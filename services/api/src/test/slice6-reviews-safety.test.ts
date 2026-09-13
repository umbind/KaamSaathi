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
import { AppError } from '../common/errors.js';
import { StandardErrorCode } from '@kaamsaathi/contracts';

test('Slice 6: Reviews, Complaints, Safety Escalation, and Earnings Summary', async (t) => {
  const identityService = new IdentityService();
  const customerService = new CustomerService();
  const providerService = new ProviderService();
  const adminVerificationService = new AdminVerificationService();
  const requestService = new RequestService();
  const bookingService = new BookingService();
  const jobService = new JobService();
  const reviewService = new ReviewAndSafetyService();

  const resetState = () => {
    db.reset();
  };

  // Helper to setup completed booking with confirmed payment
  const setupCompletedAndPaidBooking = async (providerPhone: string, customerPhone: string) => {
    const correlationId = `setup_${providerPhone}`;
    // 1. Provider
    await identityService.requestOtp({ phone_number: providerPhone }, correlationId, '127.0.0.1');
    const pAuth = await identityService.verifyOtp(
      { phone_number: providerPhone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    await providerService.onboard(pAuth.user.id, { business_name: 'Pro Mistri', trade_title: 'electrician' }, correlationId);
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
      updated_at: new Date(),
    });
    await adminVerificationService.reviewSubmission(
      adminUser.id,
      verif.id,
      { decision: 'APPROVE', review_notes: 'Valid ID', badge_to_grant: 'GOVT_ID_VERIFIED' },
      correlationId
    );

    // 2. Customer
    await identityService.requestOtp({ phone_number: customerPhone }, correlationId, '127.0.0.1');
    const cAuth = await identityService.verifyOtp(
      { phone_number: customerPhone, otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    await customerService.saveProfile(
      cAuth.user.id,
      {
        full_name: 'Customer Test',
        district_id: 'Lucknow',
        locality_name: 'Alambagh',
        pin_code: '226005',
        address_line: 'House 44',
      },
      correlationId
    );

    // 3. Request & Quotes
    const req = await requestService.createRequest(
      cAuth.user.id,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Alambagh',
        pin_code: '226005',
        description: 'Wiring fault in hall room',
        media_attachment_paths: [],
      },
      correlationId
    );

    const leads = await requestService.getProviderLeads(pAuth.user.id);
    const lead = leads.find(l => l.request_id === req.id)!;

    const quote = await bookingService.createQuote(
      pAuth.user.id,
      {
        lead_id: lead.id,
        visitation_fee_paise: 20000,
        estimated_labor_paise: 30000,
        estimated_parts_paise: 10000,
        scope_notes: 'Will inspect wiring and replace blown fuse',
      },
      correlationId
    );

    const booking = await bookingService.acceptQuote(
      cAuth.user.id,
      { quote_id: quote.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );

    // 4. Advance through Job Lifecycle
    await jobService.updateJobStatus(pAuth.user.id, booking.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(pAuth.user.id, booking.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(pAuth.user.id, booking.id, { status: 'IN_PROGRESS' }, correlationId);
    await jobService.updateJobStatus(pAuth.user.id, booking.id, { status: 'COMPLETED' }, correlationId);

    // 5. Declare & Confirm Payment
    const payment = await jobService.declarePayment(
      pAuth.user.id,
      booking.id,
      { payment_method: 'UPI', amount_paise: 60000, reference_id: 'UPI123456789' },
      correlationId
    );
    await jobService.confirmPayment(cAuth.user.id, payment.id, { confirmed: true }, correlationId);

    return {
      providerUserId: pAuth.user.id,
      customerUserId: cAuth.user.id,
      bookingId: booking.id,
      paymentId: payment.id,
    };
  };

  await t.test('AC-P6-01: Verified reviews gated by completion and confirmed payment', async () => {
    resetState();
    const correlationId = 'test_ac_p6_01';
    const { providerUserId, customerUserId, bookingId, paymentId } = await setupCompletedAndPaidBooking(
      '+919876540601',
      '+919876540602'
    );

    // Temporarily reset booking status to IN_PROGRESS to verify guard
    const booking = db.findBookingById(bookingId)!;
    booking.status = 'IN_PROGRESS';
    db.saveBooking(booking);

    await assert.rejects(
      async () => {
        await reviewService.createReview(
          customerUserId,
          bookingId,
          { rating: 5, comment: 'Great job!' },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.code, StandardErrorCode.INVALID_STATE_TRANSITION);
        return true;
      }
    );

    // Restore COMPLETED status but unconfirm payment
    booking.status = 'COMPLETED';
    db.saveBooking(booking);
    const payment = db.findPaymentById(paymentId)!;
    payment.status = 'PROVIDER_DECLARED';
    db.savePayment(payment);

    await assert.rejects(
      async () => {
        await reviewService.createReview(
          customerUserId,
          bookingId,
          { rating: 5, comment: 'Great job!' },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.code, StandardErrorCode.INVALID_STATE_TRANSITION);
        return true;
      }
    );

    // Restore confirmed payment -> Review should succeed
    payment.status = 'CONFIRMED';
    db.savePayment(payment);

    const review = await reviewService.createReview(
      customerUserId,
      bookingId,
      { rating: 5, comment: 'Bahut badhiya kaam kiya (Great service)!' },
      correlationId
    );

    assert.equal(review.rating, 5);
    assert.equal(review.comment, 'Bahut badhiya kaam kiya (Great service)!');
    assert.equal(review.booking_id, bookingId);
  });

  await t.test('AC-P6-02: Single review anti-fraud and rating range invariant', async () => {
    resetState();
    const correlationId = 'test_ac_p6_02';
    const { customerUserId, bookingId } = await setupCompletedAndPaidBooking(
      '+919876540611',
      '+919876540612'
    );

    // Invalid ratings
    for (const invalidRating of [0, 6, 4.5, -1]) {
      await assert.rejects(
        async () => {
          await reviewService.createReview(
            customerUserId,
            bookingId,
            { rating: invalidRating },
            correlationId
          );
        },
        (err: AppError) => {
          assert.equal(err.statusCode, 400);
          assert.equal(err.code, StandardErrorCode.INVALID_INPUT);
          return true;
        }
      );
    }

    // First valid review succeeds
    await reviewService.createReview(
      customerUserId,
      bookingId,
      { rating: 4, comment: 'Punctual and neat.' },
      correlationId
    );

    // Second review on same booking fails with 409 Conflict
    await assert.rejects(
      async () => {
        await reviewService.createReview(
          customerUserId,
          bookingId,
          { rating: 5, comment: 'Trying duplicate review' },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 409);
        assert.equal(err.code, StandardErrorCode.REVIEW_ALREADY_EXISTS);
        return true;
      }
    );
  });

  await t.test('AC-P6-03: Provider rating aggregation recalculation', async () => {
    resetState();
    const correlationId = 'test_ac_p6_03';

    // First booking with customer 1
    const { providerUserId, customerUserId: cust1, bookingId: book1 } = await setupCompletedAndPaidBooking(
      '+919876540621',
      '+919876540622'
    );
    const providerProfile = db.findProviderProfileByUserId(providerUserId)!;

    // Cust 1 reviews with 4 stars
    await reviewService.createReview(cust1, book1, { rating: 4 }, correlationId);
    let updatedProvider = db.findProviderProfileById(providerProfile.id)!;
    assert.equal(updatedProvider.rating_count, 1);
    assert.equal(updatedProvider.rating_avg, 4);

    // Setup second booking for the same provider with customer 2
    await identityService.requestOtp({ phone_number: '+919876540623' }, correlationId, '127.0.0.1');
    const cust2Auth = await identityService.verifyOtp(
      { phone_number: '+919876540623', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    await customerService.saveProfile(
      cust2Auth.user.id,
      {
        full_name: 'Customer Two',
        district_id: 'Lucknow',
        locality_name: 'Hazratganj',
        pin_code: '226001',
        address_line: 'Street 10',
      },
      correlationId
    );
    const req2 = await requestService.createRequest(
      cust2Auth.user.id,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Hazratganj',
        pin_code: '226001',
        description: 'AC tripping MCB switch',
        media_attachment_paths: [],
      },
      correlationId
    );
    const leads = await requestService.getProviderLeads(providerUserId);
    const lead2 = leads.find(l => l.request_id === req2.id)!;
    const quote2 = await bookingService.createQuote(
      providerUserId,
      {
        lead_id: lead2.id,
        visitation_fee_paise: 20000,
        estimated_labor_paise: 40000,
        estimated_parts_paise: 0,
        scope_notes: 'Fix MCB overload',
      },
      correlationId
    );
    const book2 = await bookingService.acceptQuote(
      cust2Auth.user.id,
      { quote_id: quote2.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'IN_PROGRESS' }, correlationId);
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'COMPLETED' }, correlationId);
    const pay2 = await jobService.declarePayment(
      providerUserId,
      book2.id,
      { payment_method: 'CASH', amount_paise: 60000 },
      correlationId
    );
    await jobService.confirmPayment(cust2Auth.user.id, pay2.id, { confirmed: true }, correlationId);

    // Cust 2 reviews with 5 stars
    await reviewService.createReview(cust2Auth.user.id, book2.id, { rating: 5 }, correlationId);
    updatedProvider = db.findProviderProfileById(providerProfile.id)!;

    // Aggregation check: (4 + 5) / 2 = 4.5
    assert.equal(updatedProvider.rating_count, 2);
    assert.equal(updatedProvider.rating_avg, 4.5);
  });

  await t.test('AC-P6-04: Provider single response to review and authorization check', async () => {
    resetState();
    const correlationId = 'test_ac_p6_04';
    const { providerUserId, customerUserId, bookingId } = await setupCompletedAndPaidBooking(
      '+919876540631',
      '+919876540632'
    );

    const review = await reviewService.createReview(
      customerUserId,
      bookingId,
      { rating: 5, comment: 'Very skilled technician' },
      correlationId
    );

    // Non-assigned provider cannot respond
    await identityService.requestOtp({ phone_number: '+919876540633' }, correlationId, '127.0.0.1');
    const impostorAuth = await identityService.verifyOtp(
      { phone_number: '+919876540633', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    await providerService.onboard(
      impostorAuth.user.id,
      { business_name: 'Impostor Mistri', trade_title: 'electrician' },
      correlationId
    );

    await assert.rejects(
      async () => {
        await reviewService.respondToReview(
          impostorAuth.user.id,
          review.id,
          { response: 'Thank you for your review!' },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 403);
        assert.equal(err.code, StandardErrorCode.FORBIDDEN);
        return true;
      }
    );

    // Assigned provider can respond once
    const respondedReview = await reviewService.respondToReview(
      providerUserId,
      review.id,
      { response: 'Shukriya sahab! Happy to help anytime.' },
      correlationId
    );
    assert.equal(respondedReview.provider_response, 'Shukriya sahab! Happy to help anytime.');
    assert.ok(respondedReview.provider_responded_at);

    // Second response throws 409 RESPONSE_ALREADY_EXISTS
    await assert.rejects(
      async () => {
        await reviewService.respondToReview(
          providerUserId,
          review.id,
          { response: 'Another reply attempt' },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 409);
        assert.equal(err.code, StandardErrorCode.RESPONSE_ALREADY_EXISTS);
        return true;
      }
    );
  });

  await t.test('AC-P6-05: Booking dispute filing, validation, and booking audit lock', async () => {
    resetState();
    const correlationId = 'test_ac_p6_05';
    const { providerUserId, customerUserId, bookingId } = await setupCompletedAndPaidBooking(
      '+919876540641',
      '+919876540642'
    );

    // Validation: description must be at least 10 chars
    await assert.rejects(
      async () => {
        await reviewService.fileDispute(
          customerUserId,
          bookingId,
          { reason: 'OVERCHARGING', description: 'Too short' },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 400);
        assert.equal(err.code, StandardErrorCode.INVALID_INPUT);
        return true;
      }
    );

    // Valid dispute filing by customer
    const dispute = await reviewService.fileDispute(
      customerUserId,
      bookingId,
      {
        reason: 'OVERCHARGING',
        description: 'Charged extra cash on-site beyond agreed quotation.',
        evidence_keys: ['s3://evidence/bill1.jpg'],
      },
      correlationId
    );

    assert.equal(dispute.status, 'OPEN');
    assert.equal(dispute.reason, 'OVERCHARGING');
    assert.equal(dispute.filed_by_role, 'CUSTOMER');

    // Booking audit lock verification
    const booking = db.findBookingById(bookingId)!;
    assert.equal(booking.is_disputed, true);

    // Duplicate open dispute on same booking throws 409 DISPUTE_ALREADY_OPEN
    await assert.rejects(
      async () => {
        await reviewService.fileDispute(
          providerUserId,
          bookingId,
          {
            reason: 'UNPROFESSIONAL_BEHAVIOUR',
            description: 'Customer was abusive during payment settlement.',
          },
          correlationId
        );
      },
      (err: AppError) => {
        assert.equal(err.statusCode, 409);
        assert.equal(err.code, StandardErrorCode.DISPUTE_ALREADY_OPEN);
        return true;
      }
    );
  });

  await t.test('AC-P6-06: Safety incident priority escalation and UP emergency helpline metadata', async () => {
    resetState();
    const correlationId = 'test_ac_p6_06';
    const { customerUserId, bookingId } = await setupCompletedAndPaidBooking(
      '+919876540651',
      '+919876540652'
    );

    // Report critical safety incident
    const incident = await reviewService.reportSafetyIncident(
      customerUserId,
      {
        booking_id: bookingId,
        category: 'HARASSMENT',
        description: 'Individual made threatening remarks and refused to leave premises.',
        severity: 'CRITICAL',
        locality: 'Alambagh',
        district: 'Lucknow',
      },
      correlationId
    );

    assert.equal(incident.status, 'REPORTED');
    assert.equal(incident.is_priority, true);
    assert.equal(incident.severity, 'CRITICAL');
    assert.equal(incident.category, 'HARASSMENT');
    // UP Emergency helpline assertions
    assert.equal(incident.emergency_helplines.police, '112');
    assert.equal(incident.emergency_helplines.women_helpline, '1090');
    assert.equal(incident.emergency_helplines.child_helpline, '1098');
  });

  await t.test('AC-P6-07: Provider earnings and job history aggregation without exposing bank details', async () => {
    resetState();
    const correlationId = 'test_ac_p6_07';

    // Provider completes 2 jobs: one UPI (60,000 paise = ₹600), one CASH (40,000 paise = ₹400)
    const { providerUserId } = await setupCompletedAndPaidBooking(
      '+919876540661',
      '+919876540662'
    );

    // Add second completed cash job
    await identityService.requestOtp({ phone_number: '+919876540663' }, correlationId, '127.0.0.1');
    const cust2Auth = await identityService.verifyOtp(
      { phone_number: '+919876540663', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    await customerService.saveProfile(
      cust2Auth.user.id,
      {
        full_name: 'Customer Three',
        district_id: 'Lucknow',
        locality_name: 'Gomti Nagar',
        pin_code: '226010',
        address_line: 'Vipul Khand',
      },
      correlationId
    );
    const req2 = await requestService.createRequest(
      cust2Auth.user.id,
      {
        category_id: 'electrician',
        request_type: 'BROADCAST',
        district_id: 'Lucknow',
        locality_name: 'Gomti Nagar',
        pin_code: '226010',
        description: 'Ceiling fan capacitor replacement',
        media_attachment_paths: [],
      },
      correlationId
    );
    const leads = await requestService.getProviderLeads(providerUserId);
    const lead2 = leads.find(l => l.request_id === req2.id)!;
    const quote2 = await bookingService.createQuote(
      providerUserId,
      {
        lead_id: lead2.id,
        visitation_fee_paise: 20000,
        estimated_labor_paise: 20000,
        estimated_parts_paise: 0,
        scope_notes: 'Replace capacitor',
      },
      correlationId
    );
    const book2 = await bookingService.acceptQuote(
      cust2Auth.user.id,
      { quote_id: quote2.id, consent_contact_reveal: true },
      correlationId,
      '127.0.0.1'
    );
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'EN_ROUTE' }, correlationId);
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'ARRIVED' }, correlationId);
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'IN_PROGRESS' }, correlationId);
    await jobService.updateJobStatus(providerUserId, book2.id, { status: 'COMPLETED' }, correlationId);
    const pay2 = await jobService.declarePayment(
      providerUserId,
      book2.id,
      { payment_method: 'CASH', amount_paise: 40000 },
      correlationId
    );
    await jobService.confirmPayment(cust2Auth.user.id, pay2.id, { confirmed: true }, correlationId);

    // Query earnings summary
    const earnings = await reviewService.getProviderEarningsSummary(providerUserId);

    assert.equal(earnings.completed_jobs_count, 2);
    assert.equal(earnings.upi_paise, 60000); // ₹600
    assert.equal(earnings.cash_paise, 40000); // ₹400
    assert.equal(earnings.total_gross_paise, 100000); // ₹1000
    assert.equal(earnings.platform_fee_paise, 0); // 0 fee during pilot
    assert.equal(earnings.net_earnings_paise, 100000);
    // Confirm zero banking credentials exposed
    assert.equal((earnings as any).bank_account_number, undefined);
    assert.equal((earnings as any).upi_vpa, undefined);
  });

  await t.test('AC-P6-08: Full audit trail preserves review, response, dispute, and safety incident events', async () => {
    resetState();
    const correlationId = 'test_ac_p6_08';
    const { providerUserId, customerUserId, bookingId } = await setupCompletedAndPaidBooking(
      '+919876540671',
      '+919876540672'
    );

    // 1. Submit Review
    const review = await reviewService.createReview(
      customerUserId,
      bookingId,
      { rating: 5, comment: 'Excellent work' },
      correlationId
    );

    // 2. Respond to Review
    await reviewService.respondToReview(
      providerUserId,
      review.id,
      { response: 'Thank you' },
      correlationId
    );

    // 3. File Dispute
    await reviewService.fileDispute(
      customerUserId,
      bookingId,
      { reason: 'OTHER', description: 'Minor scratch left on cabinet door during tool handling.' },
      correlationId
    );

    // 4. Report Safety Incident
    await reviewService.reportSafetyIncident(
      customerUserId,
      {
        booking_id: bookingId,
        category: 'PROPERTY_DAMAGE',
        description: 'Cabinet door damaged during tool handling.',
        severity: 'LOW',
      },
      correlationId
    );

    const reviewLogs = db.getAuditLogs('Review');
    const disputeLogs = db.getAuditLogs('Dispute');
    const safetyLogs = db.getAuditLogs('SafetyIncident');

    assert.equal(reviewLogs.length, 2); // SUBMIT_REVIEW + RESPOND_TO_REVIEW
    assert.equal(reviewLogs[0].action, 'SUBMIT_REVIEW');
    assert.equal(reviewLogs[1].action, 'RESPOND_TO_REVIEW');

    assert.equal(disputeLogs.length, 1);
    assert.equal(disputeLogs[0].action, 'FILE_DISPUTE');

    assert.equal(safetyLogs.length, 1);
    assert.equal(safetyLogs[0].action, 'REPORT_SAFETY_INCIDENT');
  });
});
