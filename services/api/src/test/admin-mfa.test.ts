import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { App } from '../app.js';
import { db } from '../database/db.js';
import { CryptoUtils } from '../common/crypto.utils.js';

describe('Slice 1: Admin Authentication with Mandatory TOTP MFA', () => {
  let app: App;
  const adminSecret = '3132333435363738393031323334353637383930'; // 20 bytes hex

  beforeEach(() => {
    db.reset();
    app = new App();

    // Seed admin account
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.scryptSync('AdminSecurePassword123!', salt, 64).toString('hex');

    db.saveUser({
      id: 'admin_usr_01',
      phone_hmac: 'admin_hmac',
      phone_encrypted: 'admin_enc',
      status: 'ACTIVE',
      roles: ['ADMIN'],
      active_role: 'ADMIN',
      preferred_language: 'en',
      is_admin: true,
      email: 'admin@kaamsaathi.in',
      password_hash: `${salt}:${passwordHash}`,
      totp_secret: adminSecret,
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  test('Admin login fails with invalid password', async () => {
    const totp = CryptoUtils.generateTotp(adminSecret);
    await assert.rejects(
      async () => {
        await app.identityService.adminLogin(
          {
            email: 'admin@kaamsaathi.in',
            password: 'WrongPassword!',
            totp_code: totp,
          },
          'c1',
          '127.0.0.1'
        );
      },
      (err: any) => {
        assert.equal(err.statusCode, 401);
        return true;
      }
    );
  });

  test('Admin login fails with invalid TOTP code', async () => {
    await assert.rejects(
      async () => {
        await app.identityService.adminLogin(
          {
            email: 'admin@kaamsaathi.in',
            password: 'AdminSecurePassword123!',
            totp_code: '000000', // Invalid TOTP
          },
          'c1',
          '127.0.0.1'
        );
      },
      (err: any) => {
        assert.equal(err.statusCode, 401);
        assert.equal(err.messageKey, 'errors.invalid_mfa');
        return true;
      }
    );
  });

  test('AC-AUTH-005: Admin login succeeds only with valid password AND valid TOTP', async () => {
    const totp = CryptoUtils.generateTotp(adminSecret);
    const session = await app.identityService.adminLogin(
      {
        email: 'admin@kaamsaathi.in',
        password: 'AdminSecurePassword123!',
        totp_code: totp,
      },
      'c1',
      '127.0.0.1'
    );

    assert.ok(session.access_token);
    assert.equal(session.user.active_role, 'ADMIN');
    assert.deepEqual(session.user.roles, ['ADMIN']);
  });
});
