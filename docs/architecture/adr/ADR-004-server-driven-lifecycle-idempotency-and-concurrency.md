# ADR-004: Server-Driven Lifecycle, Idempotency & Concurrency Architecture

- **Status**: `ACCEPTED` (Approved by Principal Architect & Backend Lead)
- **Date**: `2026-09-13`
- **Deciders**: Umesh Kumar (Project Owner), Principal Architect, Backend Lead, QA Lead

---

## 1. Context & Problem Statement

Hyperlocal service marketplaces operate over unstable mobile networks (2G/3G in rural UP). Users frequently:
- Double-tap buttons when a spinner delays.
- Lose network connectivity mid-transaction and retry when signal returns.
- Simultaneously accept quotes or submit multiple payments.

Without strict server-enforced lifecycle rules and idempotency:
- Duplicate bookings would be created for the same repair job.
- Providers could be double-booked or quotes accepted after expiry.
- Payments could be recorded multiple times or out of sequence.

---

## 2. Decision

### 2.1 Server-Controlled Lifecycle Transitions
1. All lifecycle transitions for **User Accounts**, **Service Requests**, **Quotes**, **Bookings**, **Change Orders**, and **Disputes** are strictly owned and executed by the server.
2. Clients (Android app, public web, admin portal) may only submit transition *requests* (e.g. `POST /api/v1/bookings/{id}/arrive`).
3. The server evaluates:
   - Authenticated actor identity and role.
   - Current state against the authoritative state machine in [`docs/product/STATE_MACHINES.md`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/product/STATE_MACHINES.md).
   - Business preconditions (e.g., job cannot start before arrival; completion cannot occur without payment declaration or confirmation).
4. Invalid transitions return HTTP 422 with a structured error:
   ```json
   {
     "code": "INVALID_STATE_TRANSITION",
     "message_key": "errors.lifecycle.invalid_transition",
     "current_state": "ARRIVED",
     "attempted_transition": "COMPLETED",
     "allowed_transitions": ["START_WORK", "CANCELLED"]
   }
   ```

### 2.2 Idempotency Engine
All state-mutating HTTP requests require an `Idempotency-Key` header (UUIDv4):
```http
POST /api/v1/quotes/01J7K8M.../accept HTTP/1.1
Idempotency-Key: 7b9d5a82-36c1-4b77-8f55-2d1b09b52a10
```

1. **Idempotency Storage Schema**:
   ```sql
   CREATE TABLE idempotency_keys (
       key VARCHAR(100) PRIMARY KEY,
       user_id UUID NOT NULL,
       request_path VARCHAR(255) NOT NULL,
       payload_hash VARCHAR(64) NOT NULL, -- SHA-256 of request body
       response_status INTEGER NOT NULL,
       response_body JSONB NOT NULL,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       expires_at TIMESTAMPTZ NOT NULL
   );
   CREATE INDEX idx_idempotency_expires ON idempotency_keys (expires_at);
   ```
2. **Behavior on Retry**:
   - **Same key + same payload**: Returns the cached response immediately with HTTP header `X-Cache-Lookup: HIT`.
   - **Same key + different payload**: Rejects with HTTP 409 Conflict (`IDEMPOTENCY_CONFLICT`).
   - **Concurrent requests with same key**: The second request waits on a short row lock or returns HTTP 409 (`OPERATION_IN_PROGRESS`).

### 2.3 Atomic Quote Acceptance & Booking Invariant
To guarantee that **exactly one quote is accepted per service request**:
1. When a customer accepts a quote, the transaction acquires an exclusive row lock on the parent `requests` record (`SELECT * FROM requests WHERE id = :id FOR UPDATE`).
2. Checks that `requests.status = 'QUOTES_RECEIVED'`.
3. Sets `quotes.status = 'ACCEPTED'` for the selected quote.
4. Transitions all other active quotes for that request to `'DECLINED'`.
5. Creates the authoritative `bookings` record in state `'CONFIRMED'`.
6. Sets `requests.status = 'BOOKED'`.
7. All steps commit atomically within a single database transaction.

### 2.4 Immutable Quotes and Change Orders
1. Once dispatched by a provider, a quote version is **immutable**.
2. If on-site inspection reveals additional work or parts are required, the provider cannot edit the original quote.
3. The provider must submit a **Change Order** (`change_orders.DRAFT` -> `PENDING`).
4. The change order includes the itemized delta amount and description.
5. The customer must explicitly approve or reject the change order. Unapproved change orders do not affect the binding job total.

---

## 3. Consequences

### Positive
- Zero duplicate bookings or ghost jobs regardless of network retry storms.
- Transparent price protection: customers never face surprise charges without formal change-order approval.
- Complete auditability of every state change and transition attempt.

### Negative / Trade-offs
- Requires clients to generate and store idempotency keys in local SQLite databases before initiating network requests.
- Requires periodic vacuuming/pruning of the `idempotency_keys` table (TTL: 24 hours).
