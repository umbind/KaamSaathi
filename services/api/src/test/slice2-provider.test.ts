import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../database/db.js';
import { IdentityService } from '../modules/identity/identity.service.js';
import { ProviderService } from '../modules/provider/provider.service.js';
import { AdminVerificationService } from '../modules/admin/admin-verification.service.js';
import { AppError } from '../common/errors.js';
import { MANDATORY_TRUST_DISCLAIMER } from '@kaamsaathi/contracts';

test('Slice 2: Provider Profiles, Coverage, Rate Cards & Verification', async (t) => {
  const identityService = new IdentityService();
  const providerService = new ProviderService();
  const adminVerificationService = new AdminVerificationService();

  const resetState = () => {
    db.reset();
  };

  await t.test('AC-P2-01: Provider coverage validates UP district and radius boundaries (1,000m - 50,000m)', async () => {
    resetState();
    const correlationId = 'test_slice2_cov';

    // 1. Setup provider
    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;
    await providerService.onboard(userId, { business_name: 'Sharma Electricals', trade_title: 'Electrician' }, correlationId);

    // 2. Reject non-UP district
    await assert.rejects(
      async () => {
        await providerService.setCoverage(
          userId,
          { district_id: 'New Delhi', latitude: 28.6139, longitude: 77.2090, radius_meters: 10000 },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // 3. Reject radius < 1,000m
    await assert.rejects(
      async () => {
        await providerService.setCoverage(
          userId,
          { district_id: 'Lucknow', latitude: 26.8467, longitude: 80.9462, radius_meters: 500 },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // 4. Reject radius > 50,000m
    await assert.rejects(
      async () => {
        await providerService.setCoverage(
          userId,
          { district_id: 'Lucknow', latitude: 26.8467, longitude: 80.9462, radius_meters: 60000 },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // 5. Accept valid UP district and valid radius (15,000m)
    const coverage = await providerService.setCoverage(
      userId,
      { district_id: 'Lucknow', latitude: 26.8467, longitude: 80.9462, radius_meters: 15000 },
      correlationId
    );
    assert.strictEqual(coverage.district_id, 'Lucknow');
    assert.strictEqual(coverage.radius_meters, 15000);

    const fetched = await providerService.getCoverage(userId);
    assert.ok(fetched);
    assert.strictEqual(fetched.district_id, 'Lucknow');
    assert.strictEqual(fetched.radius_meters, 15000);
  });

  await t.test('AC-P2-02: Rate card rejects negative fees and non-existent categories; saves valid paise amounts', async () => {
    resetState();
    const correlationId = 'test_slice2_rates';

    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;
    await providerService.onboard(userId, { business_name: 'Gupta Plumbing', trade_title: 'Plumber' }, correlationId);

    // Reject negative visitation fee
    await assert.rejects(
      async () => {
        await providerService.setServices(
          userId,
          { services: [{ category_id: 'plumber', visitation_fee_paise: -5000 }] },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // Reject non-existent category
    await assert.rejects(
      async () => {
        await providerService.setServices(
          userId,
          { services: [{ category_id: 'astrology', visitation_fee_paise: 20000 }] },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // Accept valid services with visitation fee in paise (Rs 150 = 15000 paise)
    const savedServices = await providerService.setServices(
      userId,
      {
        services: [
          { category_id: 'plumber', visitation_fee_paise: 15000, pricing_notes: 'Standard inspection and minor leak test' }
        ]
      },
      correlationId
    );
    assert.strictEqual(savedServices.length, 1);
    assert.strictEqual(savedServices[0].visitation_fee_paise, 15000);

    const fetched = await providerService.getServices(userId);
    assert.strictEqual(fetched.length, 1);
    assert.strictEqual(fetched[0].category_id, 'plumber');
    assert.strictEqual(fetched[0].visitation_fee_paise, 15000);
  });

  await t.test('AC-P2-03: Real-time availability toggles between AVAILABLE, BUSY, and OFFLINE', async () => {
    resetState();
    const correlationId = 'test_slice2_avail';

    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;
    await providerService.onboard(userId, { business_name: 'Verma AC Care', trade_title: 'Appliance Repair' }, correlationId);

    // Toggle to BUSY
    let updated = await providerService.setAvailability(userId, { availability_status: 'BUSY' }, correlationId);
    assert.strictEqual(updated.availability_status, 'BUSY');

    // Toggle to OFFLINE
    updated = await providerService.setAvailability(userId, { availability_status: 'OFFLINE' }, correlationId);
    assert.strictEqual(updated.availability_status, 'OFFLINE');

    // Toggle back to AVAILABLE
    updated = await providerService.setAvailability(userId, { availability_status: 'AVAILABLE' }, correlationId);
    assert.strictEqual(updated.availability_status, 'AVAILABLE');

    // Reject invalid status
    await assert.rejects(
      async () => {
        await providerService.setAvailability(userId, { availability_status: 'SLEEPING' as any }, correlationId);
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );
  });

  await t.test('AC-P2-04 & AC-P2-05: Evidence submission transitions to SUBMITTED; Admin approval grants badge and activates provider', async () => {
    resetState();
    const correlationId = 'test_slice2_verify';

    // 1. Setup Admin Account with TOTP MFA
    const adminUser = db.saveUser({
      id: 'admin_123',
      phone_hmac: 'admin_hmac',
      phone_encrypted: 'admin_enc',
      status: 'ACTIVE',
      roles: ['ADMIN'],
      active_role: 'ADMIN',
      preferred_language: 'en',
      is_admin: true,
      email: 'ops@kaamsaathi.in',
      created_at: new Date(),
      updated_at: new Date()
    });

    // 2. Setup Provider
    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;
    const initialProfile = await providerService.onboard(userId, { business_name: 'Lucknow Wiring', trade_title: 'Electrician' }, correlationId);
    assert.strictEqual(initialProfile.status, 'DRAFT');

    // 3. Provider submits Gov Photo ID
    const submission = await providerService.submitVerification(
      userId,
      { document_type: 'GOVT_PHOTO_ID', storage_path: 's3://secure-docs/voter_id_provider1.enc' },
      correlationId
    );
    assert.strictEqual(submission.status, 'IN_REVIEW');

    const providerAfterSubmit = await providerService.getProfile(userId);
    assert.strictEqual(providerAfterSubmit.status, 'SUBMITTED');

    // 4. Admin inspects queue
    const queue = await adminVerificationService.getPendingQueue(adminUser.id);
    assert.strictEqual(queue.length, 1);
    assert.strictEqual(queue[0].id, submission.id);
    assert.strictEqual(queue[0].business_name, 'Lucknow Wiring');

    // 5. Admin approves submission
    const reviewed = await adminVerificationService.reviewSubmission(
      adminUser.id,
      submission.id,
      { decision: 'APPROVE', review_notes: 'Voter ID matched name and UP address', badge_to_grant: 'GOVT_ID_VERIFIED' },
      correlationId
    );
    assert.strictEqual(reviewed.status, 'APPROVED');
    assert.strictEqual(reviewed.badge_granted, 'GOVT_ID_VERIFIED');

    // 6. Provider is now APPROVED_ACTIVE with both PHONE_VERIFIED and GOVT_ID_VERIFIED badges
    const activeProvider = await providerService.getProfile(userId);
    assert.strictEqual(activeProvider.status, 'APPROVED_ACTIVE');
    assert.strictEqual(activeProvider.badges_summary.length, 2);

    const govtBadge = activeProvider.badges_summary.find(b => b.code === 'GOVT_ID_VERIFIED');
    assert.ok(govtBadge);
    assert.strictEqual(govtBadge.reviewed_item, 'Reviewed government-issued photo ID');

    // Invariant: Mandatory Trust Disclaimer must be strictly adhered to
    assert.ok(MANDATORY_TRUST_DISCLAIMER.includes('Every badge states exactly what was reviewed'));
  });

  await t.test('AC-P2-06: Admin rejection requires review_notes and transitions provider to REJECTED', async () => {
    resetState();
    const correlationId = 'test_slice2_reject';

    const adminUser = db.saveUser({
      id: 'admin_123',
      phone_hmac: 'admin_hmac',
      phone_encrypted: 'admin_enc',
      status: 'ACTIVE',
      roles: ['ADMIN'],
      active_role: 'ADMIN',
      preferred_language: 'en',
      is_admin: true,
      email: 'ops@kaamsaathi.in',
      created_at: new Date(),
      updated_at: new Date()
    });

    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;
    await providerService.onboard(userId, { business_name: 'Kanpur Plumbers', trade_title: 'Plumber' }, correlationId);

    const submission = await providerService.submitVerification(
      userId,
      { document_type: 'TRADE_CERT', storage_path: 's3://secure-docs/fake_cert.enc' },
      correlationId
    );

    // Reject without notes fails
    await assert.rejects(
      async () => {
        await adminVerificationService.reviewSubmission(
          adminUser.id,
          submission.id,
          { decision: 'REJECT', review_notes: '' },
          correlationId
        );
      },
      (err: any) => err instanceof AppError && err.code === 'INVALID_INPUT'
    );

    // Reject with explanation succeeds
    const rejected = await adminVerificationService.reviewSubmission(
      adminUser.id,
      submission.id,
      { decision: 'REJECT', review_notes: 'Document is illegible and missing issuer stamp' },
      correlationId
    );
    assert.strictEqual(rejected.status, 'REJECTED');

    const providerProfile = await providerService.getProfile(userId);
    assert.strictEqual(providerProfile.status, 'REJECTED');
  });

  await t.test('AC-P2-07: Customer role isolation denies provider operations prior to onboarding', async () => {
    resetState();
    const correlationId = 'test_slice2_role_guard';

    // User registers as plain CUSTOMER
    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;

    // Direct service calls require provider profile
    await assert.rejects(
      async () => {
        await providerService.getCoverage(userId);
      },
      (err: any) => err instanceof AppError && err.code === 'NOT_FOUND'
    );
  });

  await t.test('AC-P2-08: Admin and provider actions emit immutable audit records', async () => {
    resetState();
    const correlationId = 'test_slice2_audit';

    // 1. Setup provider
    await identityService.requestOtp({ phone_number: '+919876543210' }, correlationId, '127.0.0.1');
    const authSession = await identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      correlationId,
      '127.0.0.1'
    );
    const userId = authSession.user.id;
    await providerService.onboard(userId, { business_name: 'Varanasi Electric', trade_title: 'Electrician' }, correlationId);

    // 2. Set coverage
    await providerService.setCoverage(
      userId,
      { district_id: 'Varanasi', latitude: 25.3176, longitude: 82.9739, radius_meters: 12000 },
      correlationId
    );

    // 3. Submit verification
    const sub = await providerService.submitVerification(
      userId,
      { document_type: 'GOVT_PHOTO_ID', storage_path: 's3://docs/id.enc' },
      correlationId
    );

    // 4. Admin review
    const admin = db.saveUser({
      id: 'admin_audit',
      phone_hmac: 'h',
      phone_encrypted: 'e',
      status: 'ACTIVE',
      roles: ['ADMIN'],
      active_role: 'ADMIN',
      preferred_language: 'en',
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    });

    await adminVerificationService.reviewSubmission(
      admin.id,
      sub.id,
      { decision: 'APPROVE', review_notes: 'Valid ID' },
      correlationId
    );

    const logs = db.getAuditLogs();
    assert.ok(logs.length >= 4);

    const covLog = logs.find(l => l.action === 'COVERAGE_CONFIGURED');
    assert.ok(covLog, 'COVERAGE_CONFIGURED log must exist');
    assert.strictEqual(covLog.actor_role, 'PROVIDER');
    assert.strictEqual(covLog.correlation_id, correlationId);

    const reviewLog = logs.find(l => l.action === 'VERIFICATION_APPROVED');
    assert.ok(reviewLog, 'VERIFICATION_APPROVED log must exist');
    assert.strictEqual(reviewLog.actor_role, 'ADMIN');
    assert.strictEqual(reviewLog.correlation_id, correlationId);
  });
});
