import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../database/db.js';
import { IdentityService } from '../modules/identity/identity.service.js';
import { ProviderService } from '../modules/provider/provider.service.js';
import { AdminVerificationService } from '../modules/admin/admin-verification.service.js';
import { RequestService } from '../modules/request/request.service.js';
import { BookingService } from '../modules/booking/booking.service.js';
import { JobService } from '../modules/job/job.service.js';
import { AppError } from '../common/errors.js';

test('Slice 5: Job Lifecycle, Change Orders, and Cash/UPI Payments', async (t) => {
  const identityService = new IdentityService();
  const providerService = new ProviderService();
  const adminVerificationService = new AdminVerificationService();
  const requestService = new RequestService();
  const bookingService = new BookingService();
  const jobService = new JobService();

  const resetState = () => {
    db.reset();
  };

  // Helper to setup confirmed booking
  const setupConfirmedBooking = async (providerPhone: string, customerPhone: string) => {
    const correlationId = `setup_${providerPhone}`;
    // 1. Provider
    await identityService.requestOtp({ phone_number: providerPhone }, correlationId, '127.0.0.1');
    const pAuth = await identityService.verifyOtp(
      { phone_number: providerPhone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    await providerService.onboard(pAuth.user.id, { business_name: 'Pro Electric', trade_title: 'electrician' }, correlationId);
    await providerService.setCoverage(
      pAuth.user.id,
      { district_id: 'Lucknow', latitude: 26.8467, longitude: 80.9462, radius_meters: 15000 },
      correlationId
    );
    await providerService.setServices(
      pAuth.user.id,
      { services: [{ category_id: 'electrician', visitation_fee_paise: 20000, pricing_notes: 'Standard' }] },
      correlationId
    );
    await providerService.setAvailability(pAuth.user.id, { availability_status: 'AVAILABLE' }, correlationId);
    const verif = await providerService.submitVerification(
      pAuth.user.id,
      { document_type: 'GOVT_PHOTO_ID', storage_path: 's3://mock/id.jpg' },
      correlationId
    );
    const adminUser = db.saveUser({
      id: `admin_${providerPhone}`,
      phone_hmac: `admin_hmac_${providerPhone}`,
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
      { decision: 'APPROVE', review_notes: 'Approved', badge_to_grant: 'GOVT_ID_VERIFIED' },
      correlationId
    );
    const providerProfile = db.findProviderProfileByUserId(pAuth.user.id)!;

    // 2. Customer
    await identityService.requestOtp({ phone_number: customerPhone }, correlationId, '127.0.0.1');
    const cAuth = await identityService.verifyOtp(
      { phone_number: customerPhone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );

    // 3. Request
    const req = await requestService.createRequest(
      cAuth.user.id,
      {
        category_id: 'electrician',
        request_type: 'TARGETED',
        target_provider_id: providerProfile.id,
        district_id: 'Lucknow',
        locality_name: 'Hazratganj',
        pin_code: '226001',
        description: 'Wiring check'
      },
      correlationId
    );

    // 4. Quote
    const [lead] = await requestService.getProviderLeads(pAuth.user.id);
    const quote = await bookingService.createQuote(
      pAuth.user.id,
      {
        lead_id: lead.id,
        visitation_fee_paise: 20000,
        estimated_labor_paise: 30000,
        estimated_parts_paise: 10000,
        scope_notes: 'Initial check'
      },
      correlationId
    );

    // 5. Booking
    const booking = await bookingService.acceptQuote(
      cAuth.user.id,
      { quote_id: quote.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );

    return {
      providerUserId: pAuth.user.id,
      customerUserId: cAuth.user.id,
      booking
    };
  };

  await t.test('AC-P5-01: Sequential Job Progression SCHEDULED -> EN_ROUTE -> ARRIVED -> IN_PROGRESS', async () => {
    resetState();
    const correlationId = 'test_job_progression';
    const { providerUserId, booking } = await setupConfirmedBooking('+919876543401', '+919876543402');

    assert.equal(booking.status, 'SCHEDULED');

    // 1. Advance to EN_ROUTE
    const b1 = await jobService.updateJobStatus(
      providerUserId,
      booking.id,
      { status: 'EN_ROUTE', notes: 'Leaving workshop now' },
      correlationId
    );
    assert.equal(b1.status, 'EN_ROUTE');

    // 2. Advance to ARRIVED
    const b2 = await jobService.updateJobStatus(
      providerUserId,
      booking.id,
      { status: 'ARRIVED', notes: 'Reached customer premises' },
      correlationId
    );
    assert.equal(b2.status, 'ARRIVED');

    // 3. Advance to IN_PROGRESS
    const b3 = await jobService.updateJobStatus(
      providerUserId,
      booking.id,
      { status: 'IN_PROGRESS', notes: 'Diagnosing wiring and main board' },
      correlationId
    );
    assert.equal(b3.status, 'IN_PROGRESS');
  });

  await t.test('AC-P5-02: Invalid state transitions throw INVALID_STATE_TRANSITION', async () => {
    resetState();
    const correlationId = 'test_invalid_transition';
    const { providerUserId, booking } = await setupConfirmedBooking('+919876543411', '+919876543412');

    // Attempt illegal skip: SCHEDULED directly to COMPLETED
    await assert.rejects(
      async () => {
        await jobService.updateJobStatus(
          providerUserId,
          booking.id,
          { status: 'COMPLETED' },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_STATE_TRANSITION'
    );

    // Advance to EN_ROUTE
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);

    // Attempt backwards transition: EN_ROUTE back to SCHEDULED
    await assert.rejects(
      async () => {
        await jobService.updateJobStatus(
          providerUserId,
          booking.id,
          { status: 'SCHEDULED' as any },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_STATE_TRANSITION'
    );
  });

  await t.test('AC-P5-03: Change order creation rejects negative amounts and requires active job', async () => {
    resetState();
    const correlationId = 'test_change_order_creation';
    const { providerUserId, booking } = await setupConfirmedBooking('+919876543421', '+919876543422');

    // Booking is SCHEDULED; change order must fail
    await assert.rejects(
      async () => {
        await jobService.createChangeOrder(
          providerUserId,
          booking.id,
          { description: 'Extra wire', additional_labor_paise: 10000, additional_parts_paise: 5000 },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_STATE_TRANSITION'
    );

    // Advance to IN_PROGRESS
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'IN_PROGRESS' }, correlationId);

    // Reject negative amount
    await assert.rejects(
      async () => {
        await jobService.createChangeOrder(
          providerUserId,
          booking.id,
          { description: 'Extra wire', additional_labor_paise: -500, additional_parts_paise: 5000 },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // Valid change order
    const co = await jobService.createChangeOrder(
      providerUserId,
      booking.id,
      {
        description: 'Discovered burnt capacitor; requires replacement and extra diagnostic',
        additional_labor_paise: 15000,
        additional_parts_paise: 25000
      },
      correlationId
    );

    assert.equal(co.status, 'PENDING_APPROVAL');
    assert.equal(co.additional_labor_paise, 15000);
    assert.equal(co.additional_parts_paise, 25000);
    assert.equal(co.total_additional_paise, 40000);
  });

  await t.test('AC-P5-04: Customer approves change order and updates booking total atomically', async () => {
    resetState();
    const correlationId = 'test_change_order_approval';
    const { providerUserId, customerUserId, booking } = await setupConfirmedBooking('+919876543431', '+919876543432');

    // Advance to IN_PROGRESS
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'IN_PROGRESS' }, correlationId);

    const initialTotal = booking.total_agreed_estimate_paise; // 60000

    const co = await jobService.createChangeOrder(
      providerUserId,
      booking.id,
      { description: 'Extra socket fitting', additional_labor_paise: 10000, additional_parts_paise: 15000 },
      correlationId
    );

    // Customer approves change order
    const reviewed = await jobService.reviewChangeOrder(
      customerUserId,
      co.id,
      { action: 'APPROVE' },
      correlationId
    );

    assert.equal(reviewed.status, 'APPROVED');

    // Verify booking total incremented atomically
    const updatedBooking = db.findBookingById(booking.id)!;
    assert.equal(updatedBooking.total_agreed_estimate_paise, initialTotal + 25000);
    assert.equal(updatedBooking.agreed_labor_estimate_paise, 30000 + 10000);
    assert.equal(updatedBooking.agreed_parts_estimate_paise, 10000 + 15000);
  });

  await t.test('AC-P5-05: Customer rejects change order; booking total remains unchanged', async () => {
    resetState();
    const correlationId = 'test_change_order_rejection';
    const { providerUserId, customerUserId, booking } = await setupConfirmedBooking('+919876543441', '+919876543442');

    // Advance to IN_PROGRESS
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'IN_PROGRESS' }, correlationId);

    const initialTotal = booking.total_agreed_estimate_paise;

    const co = await jobService.createChangeOrder(
      providerUserId,
      booking.id,
      { description: 'Premium copper wiring upgrade', additional_labor_paise: 20000, additional_parts_paise: 50000 },
      correlationId
    );

    // Customer rejects
    const reviewed = await jobService.reviewChangeOrder(
      customerUserId,
      co.id,
      { action: 'REJECT' },
      correlationId
    );

    assert.equal(reviewed.status, 'REJECTED');

    // Verify booking total was NOT modified
    const updatedBooking = db.findBookingById(booking.id)!;
    assert.equal(updatedBooking.total_agreed_estimate_paise, initialTotal);
  });

  await t.test('AC-P5-06: Provider declares payment (CASH and UPI) with non-negative integer paise', async () => {
    resetState();
    const correlationId = 'test_payment_declaration';
    const { providerUserId, booking } = await setupConfirmedBooking('+919876543451', '+919876543452');

    // Advance to IN_PROGRESS
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'IN_PROGRESS' }, correlationId);

    // Declare UPI payment
    const payment = await jobService.declarePayment(
      providerUserId,
      booking.id,
      {
        payment_method: 'UPI',
        amount_paise: 60000,
        reference_id: 'UPI-UTR-984712093412'
      },
      correlationId
    );

    assert.equal(payment.payment_method, 'UPI');
    assert.equal(payment.amount_paise, 60000);
    assert.equal(payment.status, 'PROVIDER_DECLARED');
    assert.equal(payment.reference_id, 'UPI-UTR-984712093412');

    // Booking is now COMPLETED
    const updatedBooking = db.findBookingById(booking.id)!;
    assert.equal(updatedBooking.status, 'COMPLETED');
  });

  await t.test('AC-P5-07: Customer confirms payment declaration', async () => {
    resetState();
    const correlationId = 'test_payment_confirmation';
    const { providerUserId, customerUserId, booking } = await setupConfirmedBooking('+919876543461', '+919876543462');

    // Advance and declare CASH payment
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'IN_PROGRESS' }, correlationId);

    const payment = await jobService.declarePayment(
      providerUserId,
      booking.id,
      { payment_method: 'CASH', amount_paise: 60000, reference_id: 'Cash receipt #104' },
      correlationId
    );

    // Customer confirms payment
    const confirmed = await jobService.confirmPayment(
      customerUserId,
      payment.id,
      { confirmed: true },
      correlationId
    );

    assert.equal(confirmed.status, 'CONFIRMED');
    assert.ok(confirmed.confirmed_at);
  });

  await t.test('AC-P5-08: Full audit trail preserves every lifecycle, change order, and payment event', async () => {
    resetState();
    const correlationId = 'test_slice5_audit';
    const { providerUserId, customerUserId, booking } = await setupConfirmedBooking('+919876543471', '+919876543472');

    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, booking.id, { status: 'IN_PROGRESS' }, correlationId);

    const co = await jobService.createChangeOrder(
      providerUserId,
      booking.id,
      { description: 'Testing audit', additional_labor_paise: 5000, additional_parts_paise: 5000 },
      correlationId
    );
    await jobService.reviewChangeOrder(customerUserId, co.id, { action: 'APPROVE' }, correlationId);

    const payment = await jobService.declarePayment(
      providerUserId,
      booking.id,
      { payment_method: 'UPI', amount_paise: 70000, reference_id: 'UTR-111' },
      correlationId
    );
    await jobService.confirmPayment(customerUserId, payment.id, { confirmed: true }, correlationId);

    const bookingAudits = db.getAuditLogs('bookings');
    assert.ok(bookingAudits.some(a => a.action === 'JOB_STATUS_UPDATED' && a.new_state === 'EN_ROUTE'));
    assert.ok(bookingAudits.some(a => a.action === 'JOB_STATUS_UPDATED' && a.new_state === 'ARRIVED'));
    assert.ok(bookingAudits.some(a => a.action === 'JOB_STATUS_UPDATED' && a.new_state === 'IN_PROGRESS'));

    const coAudits = db.getAuditLogs('change_orders');
    assert.ok(coAudits.some(a => a.action === 'CHANGE_ORDER_CREATED'));
    assert.ok(coAudits.some(a => a.action === 'CHANGE_ORDER_APPROVED'));

    const paymentAudits = db.getAuditLogs('payments');
    assert.ok(paymentAudits.some(a => a.action === 'PAYMENT_DECLARED'));
    assert.ok(paymentAudits.some(a => a.action === 'PAYMENT_CONFIRMED'));
  });
});
