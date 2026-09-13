import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../database/db.js';
import { IdentityService } from '../modules/identity/identity.service.js';
import { CustomerService } from '../modules/customer/customer.service.js';
import { ProviderService } from '../modules/provider/provider.service.js';
import { AdminVerificationService } from '../modules/admin/admin-verification.service.js';
import { RequestService } from '../modules/request/request.service.js';
import { BookingService } from '../modules/booking/booking.service.js';
import { JobService } from '../modules/job/job.service.js';
import { ReviewAndSafetyService } from '../modules/review/review.service.js';
import { AdminOperationsService } from '../modules/admin/admin-operations.service.js';
import { AppError } from '../common/errors.js';
import { StandardErrorCode } from '@kaamsaathi/contracts';

test('Slice 7: Admin Operations, Dispute Resolution, and Category Control', async (t) => {
  const identityService = new IdentityService();
  const customerService = new CustomerService();
  const providerService = new ProviderService();
  const adminVerificationService = new AdminVerificationService();
  const requestService = new RequestService();
  const bookingService = new BookingService();
  const jobService = new JobService();
  const reviewService = new ReviewAndSafetyService();
  const adminOperationsService = new AdminOperationsService();

  const resetState = () => {
    db.reset();
  };

  const createAdminUser = (idSuffix: string) => {
    return db.saveUser({
      id: `admin_${idSuffix}`,
      phone_hmac: `admin_hmac_${idSuffix}`,
      phone_encrypted: 'admin_enc',
      roles: ['ADMIN'],
      active_role: 'ADMIN',
      preferred_language: 'hi',
      is_admin: true,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
    });
  };

  await t.test('AC-P7-01: Non-admin caller is rejected with 403 FORBIDDEN for administrative actions', async () => {
    resetState();
    const correlationId = 'test_ac_p7_01';

    // Normal customer user
    await identityService.requestOtp({ phone_number: '+919876540701' }, correlationId, '127.0.0.1');
    const auth = await identityService.verifyOtp(
      { phone_number: '+919876540701', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );

    await assert.rejects(
      async () => {
        await adminOperationsService.createCategory(
          auth.user.id,
          {
            id: 'painter',
            name_en: 'Painter',
            name_hi: 'पेंटर',
            icon_name: 'brush',
            display_order: 5,
            is_active: true,
          },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 403);
        assert.equal(err.code, StandardErrorCode.FORBIDDEN);
        return true;
      }
    );
  });

  await t.test('AC-P7-02: Admin dispute resolution updates dispute status and releases booking lock', async () => {
    resetState();
    const correlationId = 'test_ac_p7_02';
    const admin = createAdminUser('disp');

    // Setup booking and file dispute
    const pPhone = '+919876540711';
    const cPhone = '+919876540712';
    await identityService.requestOtp({ phone_number: pPhone }, correlationId, '127.0.0.1');
    const pAuth = await identityService.verifyOtp({ phone_number: pPhone, otp_code: '123456' }, correlationId, '127.0.0.1');
    await providerService.onboard(pAuth.user.id, { business_name: 'Mistri Pro', trade_title: 'electrician' }, correlationId);
    await providerService.setCoverage(pAuth.user.id, { district_id: 'Lucknow', latitude: 26.8467, longitude: 80.9462, radius_meters: 15000 }, correlationId);
    await providerService.setServices(pAuth.user.id, { services: [{ category_id: 'electrician', visitation_fee_paise: 20000 }] }, correlationId);
    await providerService.setAvailability(pAuth.user.id, { availability_status: 'AVAILABLE' }, correlationId);
    const verif = await providerService.submitVerification(pAuth.user.id, { document_type: 'GOVT_PHOTO_ID', storage_path: 's3://id.jpg' }, correlationId);
    await adminVerificationService.reviewSubmission(admin.id, verif.id, { decision: 'APPROVE', review_notes: 'Valid', badge_to_grant: 'GOVT_ID_VERIFIED' }, correlationId);

    await identityService.requestOtp({ phone_number: cPhone }, correlationId, '127.0.0.1');
    const cAuth = await identityService.verifyOtp({ phone_number: cPhone, otp_code: '123456' }, correlationId, '127.0.0.1');
    await customerService.saveProfile(cAuth.user.id, { full_name: 'Customer One', district_id: 'Lucknow', locality_name: 'Alambagh', pin_code: '226005' }, correlationId);

    const req = await requestService.createRequest(cAuth.user.id, { category_id: 'electrician', request_type: 'BROADCAST', district_id: 'Lucknow', locality_name: 'Alambagh', pin_code: '226005', description: 'Switch repair' }, correlationId);
    const [lead] = await requestService.getProviderLeads(pAuth.user.id);
    const quote = await bookingService.createQuote(pAuth.user.id, { lead_id: lead.id, visitation_fee_paise: 20000, estimated_labor_paise: 10000, estimated_parts_paise: 0, scope_notes: 'Fix switch' }, correlationId);
    const booking = await bookingService.acceptQuote(cAuth.user.id, { quote_id: quote.id, consent_contact_reveal: true }, correlationId, '127.0.0.1');

    const dispute = await reviewService.fileDispute(
      cAuth.user.id,
      booking.id,
      { reason: 'NO_SHOW', description: 'Provider did not arrive on scheduled time' },
      correlationId
    );

    assert.equal(dispute.status, 'OPEN');
    let bRec = db.findBookingById(booking.id)!;
    assert.equal(bRec.is_disputed, true);

    // Admin resolves dispute
    const resolvedDispute = await adminOperationsService.resolveDispute(
      admin.id,
      dispute.id,
      { action: 'RESOLVE', resolution_notes: 'Customer refunded visitation fee. Warning issued to provider.' },
      correlationId
    );

    assert.equal(resolvedDispute.status, 'RESOLVED');
    assert.equal(resolvedDispute.resolution_notes, 'Customer refunded visitation fee. Warning issued to provider.');

    // Dispute lock is released
    bRec = db.findBookingById(booking.id)!;
    assert.equal(bRec.is_disputed, false);
  });

  await t.test('AC-P7-03: Admin safety incident resolution and escalation to authorities', async () => {
    resetState();
    const correlationId = 'test_ac_p7_03';
    const admin = createAdminUser('safety');

    await identityService.requestOtp({ phone_number: '+919876540721' }, correlationId, '127.0.0.1');
    const auth = await identityService.verifyOtp({ phone_number: '+919876540721', otp_code: '123456' }, correlationId, '127.0.0.1');

    const incident = await reviewService.reportSafetyIncident(
      auth.user.id,
      {
        category: 'THEFT',
        description: 'Tools stolen from garage area during service visit.',
        severity: 'HIGH',
      },
      correlationId
    );

    assert.equal(incident.status, 'REPORTED');
    assert.equal(incident.is_priority, true);

    // Admin escalates to police
    const resolvedIncident = await adminOperationsService.resolveSafetyIncident(
      admin.id,
      incident.id,
      { action: 'ESCALATE_POLICE', resolution_notes: 'Police FIR lodged at Hazratganj Police Station.' },
      correlationId
    );

    assert.equal(resolvedIncident.status, 'ESCALATED_AUTHORITIES');
  });

  await t.test('AC-P7-04: Admin restricts bad actor provider and forces status to RESTRICTED and OFFLINE', async () => {
    resetState();
    const correlationId = 'test_ac_p7_04';
    const admin = createAdminUser('restrict');

    const pPhone = '+919876540731';
    await identityService.requestOtp({ phone_number: pPhone }, correlationId, '127.0.0.1');
    const pAuth = await identityService.verifyOtp({ phone_number: pPhone, otp_code: '123456' }, correlationId, '127.0.0.1');
    await providerService.onboard(pAuth.user.id, { business_name: 'Rogue Provider', trade_title: 'plumber' }, correlationId);

    const provider = db.findProviderProfileByUserId(pAuth.user.id)!;
    assert.equal(provider.status, 'DRAFT');

    // Admin restricts provider
    const restricted = await adminOperationsService.restrictProvider(
      admin.id,
      provider.id,
      { reason: 'Fraudulent activity and repeat customer complaints.' },
      correlationId
    );

    assert.equal(restricted.status, 'RESTRICTED');
    assert.equal(restricted.availability_status, 'OFFLINE');
  });

  await t.test('AC-P7-05: Admin category management creates and updates categories', async () => {
    resetState();
    const correlationId = 'test_ac_p7_05';
    const admin = createAdminUser('cat');

    // 1. Create new category
    const newCat = await adminOperationsService.createCategory(
      admin.id,
      {
        id: 'carpenter',
        name_en: 'Carpenter',
        name_hi: 'बढ़ई',
        icon_name: 'hammer',
        display_order: 4,
        is_active: true,
      },
      correlationId
    );

    assert.equal(newCat.id, 'carpenter');
    assert.equal(newCat.name_en, 'Carpenter');
    assert.equal(newCat.name_hi, 'बढ़ई');

    // 2. Update category
    const updated = await adminOperationsService.updateCategory(
      admin.id,
      'carpenter',
      {
        name_en: 'Master Carpenter',
        name_hi: 'कुशल बढ़ई मिस्त्री',
        icon_name: 'hammer-tool',
        display_order: 4,
        is_active: true,
      },
      correlationId
    );

    assert.equal(updated.name_en, 'Master Carpenter');
    assert.equal(updated.name_hi, 'कुशल बढ़ई मिस्त्री');
  });

  await t.test('AC-P7-06: Admin audit log querying filters by entity and returns complete log records', async () => {
    resetState();
    const correlationId = 'test_ac_p7_06';
    const admin = createAdminUser('audit');

    // Perform an admin action
    await adminOperationsService.createCategory(
      admin.id,
      {
        id: 'mason',
        name_en: 'Mason',
        name_hi: 'राजमिस्त्री',
        icon_name: 'brick',
        display_order: 6,
        is_active: true,
      },
      correlationId
    );

    const logs = await adminOperationsService.getAuditLogs(admin.id, 'Category');
    assert.ok(logs.length >= 1);
    const match = logs.find(l => l.entity_id === 'mason');
    assert.ok(match);
    assert.equal(match.action, 'CREATE_CATEGORY');
    assert.equal(match.actor_role, 'ADMIN');
  });
});
