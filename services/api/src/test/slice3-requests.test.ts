import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../database/db.js';
import { IdentityService } from '../modules/identity/identity.service.js';
import { ProviderService } from '../modules/provider/provider.service.js';
import { AdminVerificationService } from '../modules/admin/admin-verification.service.js';
import { RequestService } from '../modules/request/request.service.js';
import { AppError } from '../common/errors.js';

test('Slice 3: Discovery and Service Requests', async (t) => {
  const identityService = new IdentityService();
  const providerService = new ProviderService();
  const adminVerificationService = new AdminVerificationService();
  const requestService = new RequestService();

  const resetState = () => {
    db.reset();
  };

  // Helper to create and activate a provider
  const createActiveProvider = async (
    phone: string,
    businessName: string,
    category: string,
    district: string,
    availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE' = 'AVAILABLE'
  ) => {
    const correlationId = `setup_${phone}`;
    await identityService.requestOtp({ phone_number: phone }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: phone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;

    // Onboard
    await providerService.onboard(userId, { business_name: businessName, trade_title: category }, correlationId);
    
    // Coverage
    await providerService.setCoverage(
      userId,
      { district_id: district, latitude: 26.8467, longitude: 80.9462, radius_meters: 15000 },
      correlationId
    );

    // Services
    await providerService.setServices(
      userId,
      {
        services: [
          {
            category_id: category,
            visitation_fee_paise: 20000,
            pricing_notes: 'General repair'
          }
        ]
      },
      correlationId
    );

    // Availability
    await providerService.setAvailability(userId, { availability_status: availability }, correlationId);

    // Verification & Admin Approval
    const verif = await providerService.submitVerification(
      userId,
      { document_type: 'GOVT_PHOTO_ID', storage_path: 's3://mock/id.jpg' },
      correlationId
    );

    // Admin user setup
    const adminUser = db.saveUser({
      id: `admin_${phone}`,
      phone_hmac: `admin_hmac_${phone}`,
      phone_encrypted: 'admin_enc',
      roles: ['ADMIN'],
      active_role: 'ADMIN',
      preferred_language: 'hi',
      is_admin: true,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date()
    });

    await adminVerificationService.reviewSubmission(
      adminUser.id,
      verif.id,
      { decision: 'APPROVE', review_notes: 'Approved verification for test', badge_to_grant: 'GOVT_ID_VERIFIED' },
      correlationId
    );

    const profile = db.findProviderProfileByUserId(userId)!;
    return { userId, providerId: profile.id };
  };

  // Helper to create a customer
  const createCustomer = async (phone: string) => {
    const correlationId = `cust_${phone}`;
    await identityService.requestOtp({ phone_number: phone }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: phone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    return { userId: authSession.user.id };
  };

  await t.test('AC-P3-01: Colloquial transliterated search matches categories and active providers in UP districts', async () => {
    resetState();
    // Setup 1 active electrician in Lucknow, 1 active electrician in Varanasi, and 1 active plumber in Lucknow
    await createActiveProvider('+919876543211', 'Lucknow Bijli Wala', 'electrician', 'Lucknow');
    await createActiveProvider('+919876543212', 'Varanasi Bijli Wala', 'electrician', 'Varanasi');
    await createActiveProvider('+919876543213', 'Ganga Plumber', 'plumber', 'Lucknow');

    // 1. Search colloquial Hindi/English transliterated alias "bijli mistri"
    const searchRes1 = await requestService.searchServices('bijli mistri', 'Lucknow');
    assert.ok(searchRes1.categories.some((c: any) => c.id === 'electrician'));
    assert.equal(searchRes1.matching_providers_count, 1); // Only the Lucknow electrician

    // 2. Search colloquial alias "nal mistri"
    const searchRes2 = await requestService.searchServices('nal mistri', 'Lucknow');
    assert.ok(searchRes2.categories.some((c: any) => c.id === 'plumber'));
    assert.equal(searchRes2.matching_providers_count, 1);

    // 3. Search colloquial alias "fridge" or "geyser"
    const searchRes3 = await requestService.searchServices('fridge');
    assert.ok(searchRes3.categories.some((c: any) => c.id === 'appliance_repair'));
  });

  await t.test('AC-P3-02: Presigned upload request generates valid ticket and logs audit record', async () => {
    resetState();
    const correlationId = 'test_upload_ticket';
    const { userId } = await createCustomer('+919876543220');

    const presigned = await requestService.createPresignedUpload(
      userId,
      { filename: 'motor_damage.jpg', content_type: 'image/jpeg', purpose: 'SERVICE_REQUEST_ATTACHMENT' },
      correlationId
    );

    assert.ok(presigned.upload_url.includes('storage.kaamsaathi.local'));
    assert.ok(presigned.storage_path.startsWith('s3://kaamsaathi-attachments/service_request_attachment/'));
    assert.equal(presigned.max_size_bytes, 10 * 1024 * 1024);

    // Audit log verification
    const auditLogs = db.getAuditLogs('media_uploads');
    assert.ok(auditLogs.some(l => l.action === 'PRESIGNED_UPLOAD_GENERATED' && l.actor_id === userId));
  });

  await t.test('AC-P3-03: Targeted request creation dispatches single lead with SUBMITTED status', async () => {
    resetState();
    const correlationId = 'test_targeted_req';
    const provider = await createActiveProvider('+919876543231', 'Manoj Electrician', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543232');

    const serviceReq = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Aliganj Sector C',
        pin_code: '226024',
        latitude: 26.8851,
        longitude: 80.9412,
        description: 'Main MCB keeps tripping continuously',
        preferred_schedule_window: 'Today 2pm - 5pm'
      },
      correlationId
    );

    assert.equal(serviceReq.request_type, 'TARGETED');
    assert.equal(serviceReq.status, 'SUBMITTED');
    assert.equal(serviceReq.dispatched_leads_count, 1);

    // Verify targeted provider received lead
    const leads = await requestService.getProviderLeads(provider.userId);
    assert.equal(leads.length, 1);
    assert.equal(leads[0].request_id, serviceReq.id);
    assert.equal(leads[0].status, 'DISPATCHED');
  });

  await t.test('AC-P3-04: Self-dealing guard blocks customer from creating targeted request to own provider profile', async () => {
    resetState();
    const correlationId = 'test_self_deal_targeted';
    const dualUser = await createActiveProvider('+919876543241', 'Self Electrician', 'electrician', 'Lucknow');

    await assert.rejects(
      async () => {
        await requestService.createRequest(
          dualUser.userId,
          {
            category_id: 'electrician',
            request_type: 'TARGETED',
            target_provider_id: dualUser.providerId,
            district_id: 'Lucknow',
            locality_name: 'Hazratganj',
            pin_code: '226001',
            description: 'Fixing my own meter'
          },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'SELF_DEALING_PROHIBITED'
    );
  });

  await t.test('AC-P3-05: Broadcast matching matches only active, available providers within category & district', async () => {
    resetState();
    const correlationId = 'test_broadcast_matching';

    // Provider 1: Active, Available, Electrician, Lucknow (MATCH)
    const p1 = await createActiveProvider('+919876543251', 'Active Available Electrician', 'electrician', 'Lucknow', 'AVAILABLE');
    // Provider 2: Active, Busy, Electrician, Lucknow (NO MATCH)
    const p2 = await createActiveProvider('+919876543252', 'Busy Electrician', 'electrician', 'Lucknow', 'BUSY');
    // Provider 3: Active, Available, Plumber, Lucknow (NO MATCH - category mismatch)
    const p3 = await createActiveProvider('+919876543253', 'Lucknow Plumber', 'plumber', 'Lucknow', 'AVAILABLE');
    // Provider 4: Active, Available, Electrician, Kanpur Nagar (NO MATCH - district mismatch)
    const p4 = await createActiveProvider('+919876543254', 'Kanpur Electrician', 'electrician', 'Kanpur Nagar', 'AVAILABLE');

    const customer = await createCustomer('+919876543255');

    const serviceReq = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Indira Nagar',
        pin_code: '226016',
        description: 'Ceiling fan sparking'
      },
      correlationId
    );

    assert.equal(serviceReq.request_type, 'BROADCAST');
    assert.equal(serviceReq.status, 'LEAD_DISPATCHED');
    assert.equal(serviceReq.dispatched_leads_count, 1);

    // Verify p1 got the lead
    const p1Leads = await requestService.getProviderLeads(p1.userId);
    assert.equal(p1Leads.length, 1);
    assert.equal(p1Leads[0].request_id, serviceReq.id);

    // Verify p2, p3, p4 got NO leads
    assert.equal((await requestService.getProviderLeads(p2.userId)).length, 0);
    assert.equal((await requestService.getProviderLeads(p3.userId)).length, 0);
    assert.equal((await requestService.getProviderLeads(p4.userId)).length, 0);
  });

  await t.test('AC-P3-06: Broadcast self-dealing automatically excludes customer own provider profile', async () => {
    resetState();
    const correlationId = 'test_broadcast_self_deal';

    // Provider A: Owned by User A
    const providerA = await createActiveProvider('+919876543261', 'User A Electrician', 'electrician', 'Varanasi', 'AVAILABLE');
    // Provider B: Owned by User B
    const providerB = await createActiveProvider('+919876543262', 'User B Electrician', 'electrician', 'Varanasi', 'AVAILABLE');

    // User A broadcasts request in Varanasi
    const serviceReq = await requestService.createRequest(
      providerA.userId,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Varanasi',
        locality_name: 'Assi Ghat',
        pin_code: '221005',
        description: 'Need urgent wiring assistance'
      },
      correlationId
    );

    assert.equal(serviceReq.dispatched_leads_count, 1);

    // User A (creator) must NOT receive their own lead
    const pALeads = await requestService.getProviderLeads(providerA.userId);
    assert.equal(pALeads.length, 0);

    // User B receives the lead
    const pBLeads = await requestService.getProviderLeads(providerB.userId);
    assert.equal(pBLeads.length, 1);
  });

  await t.test('AC-P3-07: Phased address privacy check - leads omit phone and exact street address', async () => {
    resetState();
    const correlationId = 'test_phased_privacy';
    const provider = await createActiveProvider('+919876543271', 'Test Electrician', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543272');

    await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Gomti Nagar Extension',
        pin_code: '226010',
        description: 'Inverter connection issue'
      },
      correlationId
    );

    const leads = await requestService.getProviderLeads(provider.userId);
    assert.equal(leads.length, 1);
    const lead = leads[0];

    // Privacy invariants:
    assert.equal(lead.locality_name, 'Gomti Nagar Extension');
    assert.equal(lead.district_id, 'Lucknow');
    assert.equal(lead.pin_code, '226010');
    // Ensure no sensitive contact/address fields exist on lead DTO
    assert.equal((lead as any).phone_number, undefined);
    assert.equal((lead as any).customer_phone, undefined);
    assert.equal((lead as any).street_address, undefined);
    assert.equal((lead as any).house_number, undefined);
  });

  await t.test('AC-P3-08: Audit trail records all request and lead dispatch lifecycle events', async () => {
    resetState();
    const correlationId = 'test_audit_trail_slice3';
    const provider = await createActiveProvider('+919876543281', 'Audit Electrician', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543282');

    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Mahanagar',
        pin_code: '226006',
        description: 'Wiring burnt smell'
      },
      correlationId
    );

    const auditLogs = db.getAuditLogs('requests');
    assert.ok(auditLogs.length > 0);
    const reqLog = auditLogs.find(l => l.entity_id === req.id);
    assert.ok(reqLog);
    assert.equal(reqLog.action, 'TARGETED_REQUEST_CREATED');
    assert.equal(reqLog.actor_role, 'CUSTOMER');
    assert.equal(reqLog.correlation_id, correlationId);
  });
});
