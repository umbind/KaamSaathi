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
});
