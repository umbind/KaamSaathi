import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '../app.js';
import { db } from '../database/db.js';

describe('Slice 1: Customer Profile and Language Settings', () => {
  let app: App;

  beforeEach(() => {
    db.reset();
    app = new App();
  });

  test('AC-UX-001: Language switch between Hindi and English preserves state', async () => {
    await app.identityService.requestOtp({ phone_number: '+919876543210' }, 'c1', '127.0.0.1');
    const session = await app.identityService.verifyOtp({ phone_number: '+919876543210', otp_code: '123456' }, 'c2', '127.0.0.1');

    assert.equal(session.user.preferred_language, 'hi');

    // Switch to English
    const resEn = await app.customerService.updateLanguage(session.user.id, 'en', 'c3');
    assert.equal(resEn.language, 'en');

    const userEn = db.findUserById(session.user.id);
    assert.equal(userEn?.preferred_language, 'en');

    // Switch back to Hindi
    const resHi = await app.customerService.updateLanguage(session.user.id, 'hi', 'c4');
    assert.equal(resHi.language, 'hi');

    const userHi = db.findUserById(session.user.id);
    assert.equal(userHi?.preferred_language, 'hi');
  });

  test('Customer profile saves UP district, locality, and masked notification setting', async () => {
    await app.identityService.requestOtp({ phone_number: '+919876543210' }, 'c1', '127.0.0.1');
    const session = await app.identityService.verifyOtp({ phone_number: '+919876543210', otp_code: '123456' }, 'c2', '127.0.0.1');

    const profile = await app.customerService.saveProfile(
      session.user.id,
      {
        full_name: 'Amit Verma',
        district_id: 'UP_LUCKNOW',
        locality_name: 'Gomti Nagar',
        pin_code: '226010',
        masked_notifications: true,
      },
      'c3'
    );

    assert.equal(profile.full_name, 'Amit Verma');
    assert.equal(profile.district_id, 'UP_LUCKNOW');
    assert.equal(profile.locality_name, 'Gomti Nagar');
    assert.equal(profile.pin_code, '226010');
    assert.equal(profile.masked_notifications, true);
  });

  test('Customer profile rejects invalid PIN code', async () => {
    await app.identityService.requestOtp({ phone_number: '+919876543210' }, 'c1', '127.0.0.1');
    const session = await app.identityService.verifyOtp({ phone_number: '+919876543210', otp_code: '123456' }, 'c2', '127.0.0.1');

    await assert.rejects(
      async () => {
        await app.customerService.saveProfile(
          session.user.id,
          {
            full_name: 'Amit Verma',
            district_id: 'UP_LUCKNOW',
            locality_name: 'Gomti Nagar',
            pin_code: '01234', // invalid
          },
          'c3'
        );
      },
      (err: any) => {
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });
});
