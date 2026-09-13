# Vertical Slice 4 — Quotes and Booking

Status: `VERIFIED`
Owner: @orchestrator (assigned to @backend, @android, @web)
Depends on: Slice 1 (Identity) `VERIFIED`, Slice 2 (Provider Profiles) `VERIFIED`, Slice 3 (Discovery & Requests) `VERIFIED`
Blocks: Slice 5 (Job Lifecycle and Payments)

This document defines the scope, state machines, business rules, atomic concurrency locks, contact revelation protocols, acceptance criteria, and test matrix for **Slice 4 (Quotes and Booking)** per `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`.

---

## 1. Scope

- **REQ-P-08 Quote Preparation and Dispatch**:
  - Provider prepares and sends an itemized quote against a dispatched lead.
  - Quote payload:
    - `visitation_fee_paise`: Non-negative integer (diagnostic / visit fee).
    - `estimated_labor_paise`: Non-negative integer.
    - `estimated_parts_paise`: Non-negative integer (optional).
    - `scope_notes`: Text description of proposed work.
    - `valid_hours`: Number of hours quote remains valid (default: 4 hours).
  - State machine:
    - Quote: `DRAFT` -> `DISPATCHED`.
    - Lead: `DISPATCHED` -> `QUOTED`.
    - Request: `LEAD_DISPATCHED` -> `QUOTED`.
  - Invariant: Quote is immutable once dispatched.
- **REQ-C-09 Quote Review and Comparison**:
  - Customer views all quotes dispatched against their request.
  - Returns itemized quote details, provider business name, verified trust badges, average ratings, and schedule.
  - State: Quote: `DISPATCHED` -> `VIEWED`.
- **REQ-C-10 Quote Acceptance, Atomic Booking, and Mutual Contact Reveal**:
  - Customer accepts one chosen quote.
  - **Atomic Concurrency Invariant**:
    - Exactly one quote can be accepted for any service request.
    - Optimistic lock / version check prevents race conditions.
    - Acceptance atomically transitions chosen quote to `ACCEPTED`, and all other quotes for that request to `SUPERSEDED` / `REJECTED`.
    - Request transitions to `BOOKED`.
    - Creates `BookingRecord` in `SCHEDULED` status with reference to chosen quote and initial price breakdown.
  - **Mutual Contact Reveal Invariant (Consent Gate)**:
    - Prior to acceptance, customer phone and exact address are hidden.
    - Upon quote acceptance, customer's decrypted phone number and full address are revealed to the booked provider.
    - Booked provider's decrypted phone number is revealed to the customer.
    - Rejection or competing providers NEVER receive customer phone or exact address.
    - Emits immutable audit log with consent metadata, timestamp, and actor IP/UUID.

---

## 2. State Machines

### Quote Lifecycle
```
[DRAFT] -> [DISPATCHED] -> [VIEWED] -> [ACCEPTED]
                                     \-> [SUPERSEDED] (auto-declined when another quote is accepted)
                                     \-> [EXPIRED]
                                     \-> [WITHDRAWN]
```

### Request Lifecycle Progression
```
[SUBMITTED / LEAD_DISPATCHED] -> [QUOTED] -> [BOOKED]
```

### Booking Lifecycle (Creation)
```
[SCHEDULED] (Ready for Slice 5 Job Lifecycle: EN_ROUTE -> ARRIVED -> IN_PROGRESS -> COMPLETED)
```

---

## 3. Acceptance Criteria (Testable)

1. **AC-P4-01 (Quote Preparation & Itemization)**:
   - Provider prepares quote with valid integer paise amounts (`visitation_fee_paise`, `estimated_labor_paise`, `estimated_parts_paise`). Negative numbers are rejected with `400 INVALID_INPUT`. Total estimate calculation is mathematically exact.
2. **AC-P4-02 (Expired or Invalid Lead Guard)**:
   - Provider cannot dispatch a quote against an expired lead or a lead dispatched to a different provider.
3. **AC-P4-03 (Customer Quote Review & Badges)**:
   - Customer fetches quotes for their request; each quote includes provider business name, trade title, verified badges, and itemized fees.
4. **AC-P4-04 (Atomic Single-Winner Quote Acceptance)**:
   - When Customer accepts Quote A, Quote A transitions to `ACCEPTED`, while competing Quote B and Quote C for the same request atomically transition to `SUPERSEDED`.
5. **AC-P4-05 (Double-Acceptance Concurrency Conflict)**:
   - If two concurrent requests attempt to accept different quotes for the same service request, exactly one succeeds and the second fails with `409 Conflict (QUOTE_ALREADY_ACCEPTED)`.
6. **AC-P4-06 (Mutual Contact Revelation Protocol)**:
   - Upon quote acceptance, the booking details payload discloses customer phone and exact address to the winning provider, and discloses winning provider phone to the customer.
7. **AC-P4-07 (Non-Winning Provider Privacy Invariant)**:
   - Competing providers whose quotes were superseded CANNOT view customer phone or exact address at any time.
8. **AC-P4-08 (Booking Audit Trail Invariant)**:
   - Quote dispatch, quote acceptance, quote superseding, and mutual contact reveal are recorded in immutable audit logs.
