import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { App } from '../app.js';
import { db } from '../database/db.js';

function createMockReqRes(options: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}) {
  const buf = options.body ? Buffer.from(JSON.stringify(options.body)) : Buffer.from('');
  const req: any = Readable.from([buf]);
  req.method = options.method;
  req.url = options.url;
  req.headers = {
    host: 'localhost',
    'content-type': 'application/json',
    ...options.headers,
  };
  req.socket = { remoteAddress: '127.0.0.1' };

  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) {
      this.headers[k.toLowerCase()] = v;
    },
    end(data: string) {
      this.body = data ? JSON.parse(data) : null;
      this.emit('finish');
    },
  };
  Object.setPrototypeOf(res, new EventEmitter());

  return { req, res };
}

describe('Slice 1: Idempotency Middleware Enforcement', () => {
  let app: App;

  beforeEach(() => {
    db.reset();
    app = new App();
  });

  test('Idempotency key replays cached response for identical payload and rejects conflicting payload', async () => {
    const idempotencyKey = '7b9d5a82-36c1-4b77-8f55-2d1b09b52a10';
    const payload = { phone_number: '+919876543210' };

    // Request 1: Initial creation
    const { req: req1, res: res1 } = createMockReqRes({
      method: 'POST',
      url: '/api/v1/auth/otp/request',
      headers: { 'idempotency-key': idempotencyKey },
      body: payload,
    });

    const p1 = new Promise<void>((resolve) => res1.on('finish', resolve));
    app.handleRequest(req1, res1);
    await p1;

    assert.equal(res1.statusCode, 200);
    assert.equal(res1.body.status, 'CHALLENGE_ISSUED');

    // Request 2: Replay with SAME idempotency key and SAME payload
    const { req: req2, res: res2 } = createMockReqRes({
      method: 'POST',
      url: '/api/v1/auth/otp/request',
      headers: { 'idempotency-key': idempotencyKey },
      body: payload,
    });

    const p2 = new Promise<void>((resolve) => res2.on('finish', resolve));
    app.handleRequest(req2, res2);
    await p2;

    assert.equal(res2.statusCode, 200);
    assert.equal(res2.headers['x-cache-lookup'], 'HIT');
    assert.equal(res2.body.status, 'CHALLENGE_ISSUED');

    // Request 3: Replay with SAME idempotency key but CONFLICTING payload
    const conflictingPayload = { phone_number: '+919876543211' };
    const { req: req3, res: res3 } = createMockReqRes({
      method: 'POST',
      url: '/api/v1/auth/otp/request',
      headers: { 'idempotency-key': idempotencyKey },
      body: conflictingPayload,
    });

    const p3 = new Promise<void>((resolve) => res3.on('finish', resolve));
    app.handleRequest(req3, res3);
    await p3;

    assert.equal(res3.statusCode, 409);
    assert.equal(res3.body.code, 'IDEMPOTENCY_CONFLICT');
  });
});
