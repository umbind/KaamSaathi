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
      /TOTP MFA code is mandatory/
    );
  });
});
