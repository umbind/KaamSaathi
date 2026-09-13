import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '../app.js';
import { db } from '../database/db.js';

describe('Slice 1: Role Switching and Isolation', () => {
  let app: App;

  beforeEach(() => {
    db.reset();
    app = new App();
  });

  test('User cannot switch to PROVIDER role before activating provider profile', async () => {
    // 1. Authenticate customer
    await app.identityService.requestOtp({ phone_number: '+919876543210' }, 'c1', '127.0.0.1');
    const session = await app.identityService.verifyOtp({ phone_number: '+919876543210', otp_code: '123456' }, 'c2', '127.0.0.1');

    // 2. Attempt role switch to PROVIDER -> must fail with 403
    await assert.rejects(
      async () => {
        await app.identityService.switchRole(session.user.id, 'session_1', 'PROVIDER', 'c3');
      },
      (err: any) => {
        assert.equal(err.statusCode, 403);
        assert.equal(err.code, 'FORBIDDEN');
        return true;
      }
    );
  });

  test('Activating provider profile grants PROVIDER role and allows role switching', async () => {
    // 1. Authenticate customer
    await app.identityService.requestOtp({ phone_number: '+919876543210' }, 'c1', '127.0.0.1');
    const session = await app.identityService.verifyOtp({ phone_number: '+919876543210', otp_code: '123456' }, 'c2', '127.0.0.1');

    // 2. Onboard as provider
    const providerProfile = await app.providerService.onboard(
      session.user.id,
      {
        business_name: 'Sharma Electricals',
        trade_title: 'Electrician',
        years_experience: 8,
      },
      'c3'
    );

    assert.equal(providerProfile.status, 'DRAFT');
    assert.equal(providerProfile.business_name, 'Sharma Electricals');

    // 3. Verify user now has both roles
    const user = db.findUserById(session.user.id);
    assert.ok(user?.roles.includes('PROVIDER'));
    assert.ok(user?.roles.includes('CUSTOMER'));

    // 4. Role switch to PROVIDER now succeeds
    const switched = await app.identityService.switchRole(session.user.id, 'session_1', 'PROVIDER', 'c4');
    assert.equal(switched.user.active_role, 'PROVIDER');

    // 5. Role switch back to CUSTOMER succeeds
    const switchedBack = await app.identityService.switchRole(session.user.id, 'session_1', 'CUSTOMER', 'c5');
    assert.equal(switchedBack.user.active_role, 'CUSTOMER');
  });
});
