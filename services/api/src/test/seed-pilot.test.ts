import test from 'node:test';
import assert from 'node:assert/strict';
import { seedPilotData } from '../scripts/seed-pilot.js';
import { db } from '../database/db.js';
import { IdentityService } from '../modules/identity/identity.service.js';
import { CryptoUtils } from '../common/crypto.utils.js';

test('Pilot Seed Engine: Database Seeding & UP Cluster Setup', async (t) => {
  await t.test('seeds complete 3-district UP pilot dataset', async () => {
    const summary = seedPilotData({ reset: true });

    assert.equal(summary.clusters.length, 3);
    assert.deepEqual(summary.clusters, ['Lucknow', 'Varanasi', 'Kanpur Nagar']);
    assert.equal(summary.categoriesCount, 3);
    assert.equal(summary.providersCount, 6);
    assert.equal(summary.customersCount, 2);
    assert.equal(summary.activeRequestsCount, 2);
    assert.equal(summary.activeQuotesCount, 1);

    // Verify Admin User & Authentication
    const identityService = new IdentityService();
    const totpCode = CryptoUtils.generateTotp(summary.adminTotpSecret);
    const session = await identityService.adminLogin(
      {
        email: 'admin@kaamsaathi.in',
        password: 'AdminSecurePassword123!',
        totp_code: totpCode
      },
      'seed_test_corr',
      '127.0.0.1'
    );
    assert.ok(session.access_token);
    assert.equal(session.user.active_role, 'ADMIN');

    // Verify Provider 1 (Ramesh Chandra Verma - Lucknow Electrician)
    const p1 = db.findProviderProfileById('prv_lko_01');
    assert.ok(p1);
    assert.equal(p1.business_name, 'Verma Electricals & Wiring');
    assert.equal(p1.status, 'APPROVED_ACTIVE');
    assert.equal(p1.availability_status, 'AVAILABLE');
    assert.equal(p1.badges_summary.length, 2);

    const cov1 = db.getProviderCoverage('prv_lko_01');
    assert.ok(cov1);
    assert.equal(cov1.district_id, 'lucknow');
    assert.equal(cov1.radius_meters, 15000);

    const srv1 = db.getProviderServices('prv_lko_01');
    assert.equal(srv1.length, 1);
    assert.equal(srv1[0].category_id, 'electrician');
    assert.equal(srv1[0].visitation_fee_paise, 15000);

    // Verify Customer 1 & Quote 1
    const req1 = db.findRequestById('req_lko_01');
    assert.ok(req1);
    assert.equal(req1.district_id, 'lucknow');
    assert.equal(req1.status, 'QUOTES_RECEIVED');

    const quotes = db.findQuotesByRequestId('req_lko_01');
    assert.equal(quotes.length, 1);
    assert.equal(quotes[0].provider_id, 'prv_lko_03');
    assert.equal(quotes[0].total_estimate_paise, 135000);
    assert.equal(Number.isInteger(quotes[0].total_estimate_paise), true);
  });
});
