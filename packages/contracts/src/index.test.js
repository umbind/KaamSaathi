import test from 'node:test';
import assert from 'node:assert/strict';
import { StandardErrorCode } from './index.js';
test('Contracts Package Specifications', async (t) => {
    await t.test('StandardErrorCode contains all core security and domain error codes', () => {
        assert.strictEqual(StandardErrorCode.INVALID_INPUT, 'INVALID_INPUT');
        assert.strictEqual(StandardErrorCode.UNAUTHORIZED, 'UNAUTHORIZED');
        assert.strictEqual(StandardErrorCode.FORBIDDEN, 'FORBIDDEN');
        assert.strictEqual(StandardErrorCode.NOT_FOUND, 'NOT_FOUND');
        assert.strictEqual(StandardErrorCode.CONFLICT, 'CONFLICT');
        assert.strictEqual(StandardErrorCode.RATE_LIMITED, 'RATE_LIMITED');
        assert.strictEqual(StandardErrorCode.INVALID_STATE_TRANSITION, 'INVALID_STATE_TRANSITION');
        assert.strictEqual(StandardErrorCode.IDEMPOTENCY_CONFLICT, 'IDEMPOTENCY_CONFLICT');
        assert.strictEqual(StandardErrorCode.SELF_DEALING_PROHIBITED, 'SELF_DEALING_PROHIBITED');
        assert.strictEqual(StandardErrorCode.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
    });
    await t.test('Trust badge definitions state exactly what was reviewed', async () => {
        const { TRUST_BADGE_DEFINITIONS, MANDATORY_TRUST_DISCLAIMER } = await import('./provider.js');
        assert.ok(TRUST_BADGE_DEFINITIONS.PHONE_VERIFIED.reviewed_item.includes('OTP'));
        assert.ok(TRUST_BADGE_DEFINITIONS.GOVT_ID_VERIFIED.reviewed_item.includes('photo ID'));
        assert.ok(TRUST_BADGE_DEFINITIONS.TRADE_CERTIFIED.reviewed_item.includes('certificate'));
        assert.ok(TRUST_BADGE_DEFINITIONS.POLICE_VERIFIED.reviewed_item.includes('police clearance'));
        // Mandatory trust disclaimer must state lack of platform competence guarantee
        assert.ok(MANDATORY_TRUST_DISCLAIMER.includes('does not guarantee provider competence or personal safety'));
        assert.ok(MANDATORY_TRUST_DISCLAIMER.includes('Every badge states exactly what was reviewed'));
    });
});
//# sourceMappingURL=index.test.js.map