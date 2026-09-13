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
});
