import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '../app.js';
import { db } from '../database/db.js';

describe('Slice 1: Identity and OTP Authentication', () => {
  let app: App;

  beforeEach(() => {
    db.reset();
    app = new App();
  });

  test('AC-AUTH-001: Anti-enumeration response envelope is identical for new and registered phones', async () => {
    // Request OTP for new phone
    const resNew = await app.identityService.requestOtp(
      { phone_number: '+919876543210' },
      'test_corr_1',
      '127.0.0.1'
    );

    assert.equal(resNew.status, 'CHALLENGE_ISSUED');
    assert.equal(resNew.cooldown_seconds, 60);
    assert.equal(resNew.message_key, 'auth.otp.challenge_issued');

    // Register user
    await app.identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      'test_corr_2',
      '127.0.0.1'
    );

    // Fast-forward or simulate another request after cooldown for registered phone
    db.reset(); // clear challenge
    // Recreate registered user
    db.saveUser({
      id: 'existing_user_1',
      phone_hmac: 'some_hash',
      phone_encrypted: 'some_encrypted',
      status: 'ACTIVE',
      roles: ['CUSTOMER'],
      active_role: 'CUSTOMER',
      preferred_language: 'hi',
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const resExisting = await app.identityService.requestOtp(
      { phone_number: '+919876543210' },
      'test_corr_3',
      '127.0.0.1'
    );

    assert.equal(resExisting.status, 'CHALLENGE_ISSUED');
    assert.equal(resExisting.cooldown_seconds, 60);
    assert.equal(resExisting.message_key, 'auth.otp.challenge_issued');
  });

  test('AC-AUTH-002: OTP throttling enforces 60-second cooldown', async () => {
    await app.identityService.requestOtp(
      { phone_number: '+919876543210' },
      'test_corr_1',
      '127.0.0.1'
    );

    // Immediate second request within 60s must fail with 429
    await assert.rejects(
      async () => {
        await app.identityService.requestOtp(
          { phone_number: '+919876543210' },
          'test_corr_2',
          '127.0.0.1'
        );
      },
      (err: any) => {
        assert.equal(err.statusCode, 429);
        assert.equal(err.code, 'RATE_LIMITED');
        assert.ok(err.retryAfterSeconds > 0 && err.retryAfterSeconds <= 60);
        return true;
      }
    );
  });

  test('OTP verification fails after exceeding max attempts', async () => {
    await app.identityService.requestOtp(
      { phone_number: '+919876543210' },
      'test_corr_1',
      '127.0.0.1'
    );

    // 3 wrong attempts
    for (let i = 0; i < 3; i++) {
      await assert.rejects(
        async () => {
          await app.identityService.verifyOtp(
            { phone_number: '+919876543210', otp_code: '000000' },
            'test_corr_err',
            '127.0.0.1'
          );
        },
        (err: any) => {
          assert.equal(err.statusCode, 401);
          return true;
        }
      );
    }

    // 4th attempt with correct OTP must fail because challenge expired/exhausted
    await assert.rejects(
      async () => {
        await app.identityService.verifyOtp(
          { phone_number: '+919876543210', otp_code: '123456' },
          'test_corr_final',
          '127.0.0.1'
        );
      },
      (err: any) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  test('Successful OTP verification registers user and establishes session', async () => {
    await app.identityService.requestOtp(
      { phone_number: '+919876543210' },
      'test_corr_1',
      '127.0.0.1'
    );

    const session = await app.identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      'test_corr_2',
      '127.0.0.1',
      'Android/14 KaamSaathi'
    );

    assert.ok(session.access_token);
    assert.ok(session.refresh_token);
    assert.equal(session.is_new_user, true);
    assert.equal(session.user.active_role, 'CUSTOMER');
    assert.equal(session.user.preferred_language, 'hi');
    assert.deepEqual(session.user.roles, ['CUSTOMER']);
  });

  test('Refresh Token Rotation (RTR) and Session Revocation', async () => {
    await app.identityService.requestOtp(
      { phone_number: '+919876543210' },
      'test_corr_1',
      '127.0.0.1'
    );

    const session = await app.identityService.verifyOtp(
      { phone_number: '+919876543210', otp_code: '123456' },
      'test_corr_2',
      '127.0.0.1'
    );

    // Refresh token
    const refreshed = await app.identityService.refreshToken(session.refresh_token, 'test_corr_refresh');
    assert.ok(refreshed.access_token);
    assert.ok(refreshed.refresh_token);
    assert.notEqual(refreshed.refresh_token, session.refresh_token);

    // Replay old refresh token -> must be rejected
    await assert.rejects(
      async () => {
        await app.identityService.refreshToken(session.refresh_token, 'test_corr_replay');
      },
      (err: any) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });
});
