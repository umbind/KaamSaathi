import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../database/db.js';
import { IdentityService } from '../modules/identity/identity.service.js';
import { ProviderService } from '../modules/provider/provider.service.js';
import { AdminVerificationService } from '../modules/admin/admin-verification.service.js';
import { RequestService } from '../modules/request/request.service.js';
import { BookingService } from '../modules/booking/booking.service.js';
import { AppError } from '../common/errors.js';

test('Slice 4: Quotes, Atomic Booking, and Mutual Contact Reveal', async (t) => {
  const identityService = new IdentityService();
  const providerService = new ProviderService();
  const adminVerificationService = new AdminVerificationService();
  const requestService = new RequestService();
  const bookingService = new BookingService();

  const resetState = () => {
    db.reset();
  };

  // Helper to create and activate a provider
  const createActiveProvider = async (
    phone: string,
    businessName: string,
    category: string,
    district: string
  ) => {
    const correlationId = `setup_${phone}`;
    await identityService.requestOtp({ phone_number: phone }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: phone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;

    await providerService.onboard(userId, { business_name: businessName, trade_title: category }, correlationId);
    await providerService.setCoverage(
      userId,
      { district_id: district, latitude: 26.8467, longitude: 80.9462, radius_meters: 15000 },
      correlationId
    );
    await providerService.setServices(
      userId,
      {
        services: [
          { category_id: category, visitation_fee_paise: 20000, pricing_notes: 'Standard diagnostic' }
        ]
      },
      correlationId
    );
    await providerService.setAvailability(userId, { availability_status: 'AVAILABLE' }, correlationId);

    const verif = await providerService.submitVerification(
      userId,
      { document_type: 'GOVT_PHOTO_ID', storage_path: 's3://mock/id.jpg' },
      correlationId
    );

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
      { decision: 'APPROVE', review_notes: 'Verified photo ID', badge_to_grant: 'GOVT_ID_VERIFIED' },
      correlationId
    );

    const profile = db.findProviderProfileByUserId(userId)!;
    return { userId, providerId: profile.id, phone };
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
    return { userId: authSession.user.id, phone };
  };

  await t.test('AC-P4-01: Quote preparation validates itemized paise amounts and calculates exact total', async () => {
    resetState();
    const correlationId = 'test_quote_itemization';
    const provider = await createActiveProvider('+919876543301', 'Sharma Electric Works', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543302');

    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Indira Nagar',
        pin_code: '226016',
        description: 'Wiring fault in kitchen'
      },
      correlationId
    );

    const leads = await requestService.getProviderLeads(provider.userId);
    const lead = leads[0];

    // 1. Reject negative amount
    await assert.rejects(
      async () => {
        await bookingService.createQuote(
          provider.userId,
          {
            lead_id: lead.id,
            visitation_fee_paise: -100,
            estimated_labor_paise: 50000,
            scope_notes: 'Wiring'
          },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // 2. Dispatch valid itemized quote
    const quote = await bookingService.createQuote(
      provider.userId,
      {
        lead_id: lead.id,
        visitation_fee_paise: 20000,
        estimated_labor_paise: 45000,
        estimated_parts_paise: 15000,
        scope_notes: 'Replace MCB and 2.5mm copper wiring'
      },
      correlationId
    );

    assert.equal(quote.visitation_fee_paise, 20000);
    assert.equal(quote.estimated_labor_paise, 45000);
    assert.equal(quote.estimated_parts_paise, 15000);
    assert.equal(quote.total_estimate_paise, 80000); // Exactly 20000 + 45000 + 15000
    assert.equal(quote.status, 'DISPATCHED');
    assert.equal(quote.provider_business_name, 'Sharma Electric Works');
    assert.ok(quote.provider_badges.some(b => b.code === 'GOVT_ID_VERIFIED'));
  });

  await t.test('AC-P4-02: Provider cannot quote on expired lead or lead assigned to another provider', async () => {
    resetState();
    const correlationId = 'test_unauthorized_lead_quote';
    const providerA = await createActiveProvider('+919876543311', 'Provider A', 'electrician', 'Lucknow');
    const providerB = await createActiveProvider('+919876543312', 'Provider B', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543313');

    // Create targeted request to Provider A
    await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: providerA.providerId,
        district_id: 'Lucknow',
        locality_name: 'Hazratganj',
        pin_code: '226001',
        description: 'Need fuse repair'
      },
      correlationId
    );

    const [leadA] = await requestService.getProviderLeads(providerA.userId);

    // Provider B attempts to quote on Provider A's lead
    await assert.rejects(
      async () => {
        await bookingService.createQuote(
          providerB.userId,
          {
            lead_id: leadA.id,
            visitation_fee_paise: 15000,
            estimated_labor_paise: 30000,
            scope_notes: 'Hijacking quote'
          },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'FORBIDDEN'
    );
  });

  await t.test('AC-P4-03: Customer quote review returns itemized costs and updates status to VIEWED', async () => {
    resetState();
    const correlationId = 'test_quote_review';
    const provider = await createActiveProvider('+919876543321', 'Reliable Electric', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543322');

    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Aliganj',
        pin_code: '226024',
        description: 'Switchboard smoking'
      },
      correlationId
    );

    const [lead] = await requestService.getProviderLeads(provider.userId);
    await bookingService.createQuote(
      provider.userId,
      {
        lead_id: lead.id,
        visitation_fee_paise: 25000,
        estimated_labor_paise: 35000,
        scope_notes: 'Replace burnt switchboard'
      },
      correlationId
    );

    // Customer reviews quotes
    const quotes = await bookingService.getRequestQuotes(customer.userId, req.id);
    assert.equal(quotes.length, 1);
    assert.equal(quotes[0].total_estimate_paise, 60000);
    assert.equal(quotes[0].status, 'VIEWED'); // Automatically transitioned from DISPATCHED to VIEWED
  });

  await t.test('AC-P4-04: Atomic single-winner quote acceptance supersedes competing quotes and marks request BOOKED', async () => {
    resetState();
    const correlationId = 'test_atomic_acceptance';
    const p1 = await createActiveProvider('+919876543331', 'Provider One', 'electrician', 'Lucknow');
    const p2 = await createActiveProvider('+919876543332', 'Provider Two', 'electrician', 'Lucknow');
    const p3 = await createActiveProvider('+919876543333', 'Provider Three', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543334');

    // Broadcast request
    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Gomti Nagar',
        pin_code: '226010',
        description: 'Tripping issue'
      },
      correlationId
    );

    // All 3 providers submit quotes
    const [lead1] = await requestService.getProviderLeads(p1.userId);
    const [lead2] = await requestService.getProviderLeads(p2.userId);
    const [lead3] = await requestService.getProviderLeads(p3.userId);

    const q1 = await bookingService.createQuote(
      p1.userId,
      { lead_id: lead1.id, visitation_fee_paise: 20000, estimated_labor_paise: 30000, scope_notes: 'P1 fix' },
      correlationId
    );
    const q2 = await bookingService.createQuote(
      p2.userId,
      { lead_id: lead2.id, visitation_fee_paise: 18000, estimated_labor_paise: 28000, scope_notes: 'P2 fix' },
      correlationId
    );
    const q3 = await bookingService.createQuote(
      p3.userId,
      { lead_id: lead3.id, visitation_fee_paise: 22000, estimated_labor_paise: 32000, scope_notes: 'P3 fix' },
      correlationId
    );

    // Customer accepts Quote 2
    const booking = await bookingService.acceptQuote(
      customer.userId,
      { quote_id: q2.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );

    assert.equal(booking.status, 'SCHEDULED');
    assert.equal(booking.quote_id, q2.id);
    assert.equal(booking.provider_id, p2.providerId);
    assert.equal(booking.total_agreed_estimate_paise, 46000);

    // Verify Quote 2 is ACCEPTED
    const acceptedQ2 = db.findQuoteById(q2.id)!;
    assert.equal(acceptedQ2.status, 'ACCEPTED');

    // Verify Competing Quotes 1 and 3 are SUPERSEDED
    const supersededQ1 = db.findQuoteById(q1.id)!;
    const supersededQ3 = db.findQuoteById(q3.id)!;
    assert.equal(supersededQ1.status, 'SUPERSEDED');
    assert.equal(supersededQ3.status, 'SUPERSEDED');

    // Verify Request is BOOKED
    const updatedReq = db.findRequestById(req.id)!;
    assert.equal(updatedReq.status, 'BOOKED');
  });

  await t.test('AC-P4-05: Double-acceptance concurrency conflict throws QUOTE_ALREADY_ACCEPTED', async () => {
    resetState();
    const correlationId = 'test_double_accept';
    const p1 = await createActiveProvider('+919876543341', 'Provider P1', 'electrician', 'Lucknow');
    const p2 = await createActiveProvider('+919876543342', 'Provider P2', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543343');

    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Mahanagar',
        pin_code: '226006',
        description: 'Inverter check'
      },
      correlationId
    );

    const [lead1] = await requestService.getProviderLeads(p1.userId);
    const [lead2] = await requestService.getProviderLeads(p2.userId);

    const q1 = await bookingService.createQuote(
      p1.userId,
      { lead_id: lead1.id, visitation_fee_paise: 20000, estimated_labor_paise: 20000, scope_notes: 'P1' },
      correlationId
    );
    const q2 = await bookingService.createQuote(
      p2.userId,
      { lead_id: lead2.id, visitation_fee_paise: 20000, estimated_labor_paise: 20000, scope_notes: 'P2' },
      correlationId
    );

    // Accept q1
    await bookingService.acceptQuote(
      customer.userId,
      { quote_id: q1.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );

    // Attempt to accept q2
    await assert.rejects(
      async () => {
        await bookingService.acceptQuote(
          customer.userId,
          { quote_id: q2.id, consent_contact_reveal: true },
          correlationId,
          '127.0.0.1'
        );
      },
      (err: any) => err instanceof AppError && err.code === 'QUOTE_ALREADY_ACCEPTED'
    );
  });

  await t.test('AC-P4-06: Mutual contact reveal unlocks phone & address between customer and booked provider', async () => {
    resetState();
    const correlationId = 'test_mutual_contact_reveal';
    const provider = await createActiveProvider('+919876543351', 'Verma Electric', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543352');

    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Vikas Nagar Sector 4',
        pin_code: '226022',
        description: 'Doorbell and light repair'
      },
      correlationId
    );

    const [lead] = await requestService.getProviderLeads(provider.userId);
    const quote = await bookingService.createQuote(
      provider.userId,
      { lead_id: lead.id, visitation_fee_paise: 15000, estimated_labor_paise: 20000, scope_notes: 'Fixing' },
      correlationId
    );

    const booking = await bookingService.acceptQuote(
      customer.userId,
      { quote_id: quote.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );

    // 1. Booked provider gets customer decrypted phone and address
    assert.ok(booking.customer_contact);
    assert.equal(booking.customer_contact.phone_number, '+919876543352');
    assert.equal(booking.customer_contact.district_id, 'Lucknow');
    assert.equal(booking.customer_contact.locality_name, 'Vikas Nagar Sector 4');
    assert.equal(booking.customer_contact.pin_code, '226022');

    // 2. Customer gets provider decrypted phone and business details
    assert.ok(booking.provider_contact);
    assert.equal(booking.provider_contact.phone_number, '+919876543351');
    assert.equal(booking.provider_contact.business_name, 'Verma Electric');
  });

  await t.test('AC-P4-07: Non-winning provider cannot access booking details or revealed contact information', async () => {
    resetState();
    const correlationId = 'test_non_winning_privacy';
    const winningProvider = await createActiveProvider('+919876543361', 'Winner Electric', 'electrician', 'Lucknow');
    const competingProvider = await createActiveProvider('+919876543362', 'Loser Electric', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543363');

    await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Hazratganj',
        pin_code: '226001',
        description: 'Wiring check'
      },
      correlationId
    );

    const [lead1] = await requestService.getProviderLeads(winningProvider.userId);
    const [lead2] = await requestService.getProviderLeads(competingProvider.userId);

    const q1 = await bookingService.createQuote(
      winningProvider.userId,
      { lead_id: lead1.id, visitation_fee_paise: 20000, estimated_labor_paise: 20000, scope_notes: 'Win' },
      correlationId
    );
    await bookingService.createQuote(
      competingProvider.userId,
      { lead_id: lead2.id, visitation_fee_paise: 25000, estimated_labor_paise: 25000, scope_notes: 'Lose' },
      correlationId
    );

    const booking = await bookingService.acceptQuote(
      customer.userId,
      { quote_id: q1.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );

    // Competing provider attempts to access booking details
    await assert.rejects(
      async () => {
        await bookingService.getBookingDetails(competingProvider.userId, booking.id);
      },
      (err: any) => err instanceof AppError && err.code === 'FORBIDDEN'
    );
  });

  await t.test('AC-P4-08: Audit trail records quote dispatch, acceptance, and contact reveal metadata', async () => {
    resetState();
    const correlationId = 'test_slice4_audit';
    const provider = await createActiveProvider('+919876543371', 'Audit Provider', 'electrician', 'Lucknow');
    const customer = await createCustomer('+919876543372');

    const req = await requestService.createRequest(
      customer.userId,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: provider.providerId,
        district_id: 'Lucknow',
        locality_name: 'Aliganj',
        pin_code: '226024',
        description: 'Audit test'
      },
      correlationId
    );

    const [lead] = await requestService.getProviderLeads(provider.userId);
    const quote = await bookingService.createQuote(
      provider.userId,
      { lead_id: lead.id, visitation_fee_paise: 20000, estimated_labor_paise: 30000, scope_notes: 'Notes' },
      correlationId
    );

    const booking = await bookingService.acceptQuote(
      customer.userId,
      { quote_id: quote.id, consent_contact_reveal: true },
      correlationId,
      '192.168.1.100'
    );

    // Verify quote audit
    const quoteAudits = db.getAuditLogs('quotes');
    assert.ok(quoteAudits.some(a => a.action === 'QUOTE_DISPATCHED' && a.entity_id === quote.id));

    // Verify booking audit
    const bookingAudits = db.getAuditLogs('bookings');
    const bookingLog = bookingAudits.find(a => a.entity_id === booking.id);
    assert.ok(bookingLog);
    assert.equal(bookingLog.action, 'QUOTE_ACCEPTED_BOOKING_CONFIRMED');
    assert.equal(bookingLog.metadata.consent_contact_reveal, true);
    assert.equal(bookingLog.metadata.client_ip, '192.168.1.100');
  });
});
