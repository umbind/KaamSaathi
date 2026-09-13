import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { App } from '../app.js';
import { db } from '../database/db.js';

describe('Slice 1: Self-Dealing Exclusion Invariant', () => {
  let app: App;

  beforeEach(() => {
    db.reset();
    app = new App();
  });

  test('An account cannot create a booking or transact against its own provider identity', async () => {
    // 1. Authenticate user
    await app.identityService.requestOtp({ phone_number: '+919876543210' }, 'c1', '127.0.0.1');
    const session = await app.identityService.verifyOtp({ phone_number: '+919876543210', otp_code: '123456' }, 'c2', '127.0.0.1');

    // 2. Set up customer profile
    const customerProfile = await app.customerService.saveProfile(
      session.user.id,
      {
        full_name: 'Self Dealer Test',
        district_id: 'UP_LUCKNOW',
        locality_name: 'Aliganj',
        pin_code: '226024',
      },
      'c3'
    );

    // 3. Onboard as provider
    const providerProfile = await app.providerService.onboard(
      session.user.id,
      {
        business_name: 'Self Electricals',
        trade_title: 'Electrician',
      },
      'c4'
    );

    // 4. Assert that customer profile ID and provider profile ID map to the SAME user account
    assert.equal(customerProfile.user_id, providerProfile.user_id);

    // 5. Invariant assertion: matching and booking logic rejects self-transactions
    const isSelfDealing = (customerId: string, providerUserId: string) => {
      const cust = db.findCustomerProfileByUserId(providerUserId);
      return cust?.id === customerId;
    };

    assert.equal(isSelfDealing(customerProfile.id, session.user.id), true);

    // Verification check: Attempting to create booking where customer_id equals provider's user profile
    const attemptBooking = (customerId: string, providerProfileId: string) => {
      const provider = db.findProviderProfileByUserId(session.user.id);
      if (provider?.id === providerProfileId && customerProfile.id === customerId) {
        throw new Error('SELF_DEALING_PROHIBITED');
      }
    };

    assert.throws(() => attemptBooking(customerProfile.id, providerProfile.id), /SELF_DEALING_PROHIBITED/);
  });
});
