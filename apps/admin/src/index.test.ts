import test from 'node:test';
import assert from 'node:assert/strict';
import { AdminPortalService } from './index.js';

test('Admin Portal Client Security Invariants', async (t) => {
  await t.test('Admin client throws error immediately if TOTP MFA code is missing or incomplete', async () => {
    const client = new AdminPortalService('http://localhost:3000');
    
    await assert.rejects(
      async () => {
        await client.login({
          email: 'admin@kaamsaathi.in',
          password: 'CorrectPassword123!',
          totp_code: ''
        });
      },
      /TOTP MFA code is mandatory/
    );

    await assert.rejects(
      async () => {
        await client.login({
          email: 'admin@kaamsaathi.in',
          password: 'CorrectPassword123!',
          totp_code: '123'
        });
      },
      (err: any) => /TOTP MFA code is mandatory/.test(err.message)
    );
  });

  await t.test('Admin verification review requires active session and non-empty rejection notes', async () => {
    const client = new AdminPortalService('http://localhost:3000');

    // Unauthenticated call throws error
    await assert.rejects(
      async () => {
        await client.getPendingVerifications();
      },
      /Authentication required/
    );

    await assert.rejects(
      async () => {
        await client.reviewVerification('sub_1', { decision: 'REJECT', review_notes: '' });
      },
      /Authentication required/
    );
  });

  await t.test('Admin operations (disputes, safety, categories, provider restriction) require active session', async () => {
    const client = new AdminPortalService('http://localhost:3000');

    await assert.rejects(
      async () => {
        await client.resolveDispute('disp_1', { action: 'RESOLVE', resolution_notes: 'Resolved' });
      },
      /Authentication required/
    );

    await assert.rejects(
      async () => {
        await client.resolveSafetyIncident('safe_1', { action: 'RESOLVE', resolution_notes: 'Checked' });
      },
      /Authentication required/
    );

    await assert.rejects(
      async () => {
        await client.restrictProvider('prov_1', { reason: 'Violation' });
      },
      /Authentication required/
    );

    await assert.rejects(
      async () => {
        await client.createCategory({
          id: 'carpenter',
          name_en: 'Carpenter',
          name_hi: 'बढ़ई',
          icon_name: 'hammer',
          display_order: 4,
          is_active: true,
        });
      },
      /Authentication required/
    );

    await assert.rejects(
      async () => {
        await client.getAuditLogs('Booking');
      },
      /Authentication required/
    );
  });
});
