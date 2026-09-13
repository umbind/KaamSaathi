# Vertical Slice 5 — Job Lifecycle, Change Orders, and Payments

Status: `VERIFIED`
Owner: @orchestrator (assigned to @backend, @android, @web)
Depends on: Slice 4 (Quotes and Booking) `VERIFIED`
Blocks: Slice 6 (Reviews, Complaints, and Safety)

This document defines the scope, state machines, business rules, financial precision standards, change order protocols, acceptance criteria, and test matrix for **Slice 5 (Job Lifecycle, Change Orders, and Payments)** per `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`.

---

## 1. Scope

- **REQ-P-09 / REQ-C-11 Job Lifecycle State Machine**:
  - Transitions:
    `SCHEDULED` -> `EN_ROUTE` -> `ARRIVED` -> `IN_PROGRESS` -> `COMPLETED`.
  - Server-enforced valid transitions (illegal skips or backwards transitions rejected with `400 INVALID_STATE_TRANSITION`).
  - Arrival verification: Provider marks `ARRIVED`; records timestamp.
  - Job execution: Provider marks `IN_PROGRESS`.
- **REQ-P-10 On-Site Change Orders**:
  - When unforeseen work or additional parts are discovered on site:
    - Provider submits change order: `description`, `additional_labor_paise`, `additional_parts_paise`.
    - Change order state: `PENDING_CUSTOMER_APPROVAL`.
    - Customer approval gate: Customer explicitly approves or rejects.
    - If approved: Booking total estimate is updated atomically.
    - If rejected: Booking proceeds with initial scope and agreed price.
- **REQ-P-11 / REQ-C-12 Completion & Payment Declaration**:
  - Provider marks work complete and declares payment method:
    - `CASH`: Provider declares cash collected (amount in paise, receipt notes).
    - `UPI`: Provider declares UPI QR payment received (UTR / reference ID, amount in paise).
  - Customer verifies payment:
    - Customer confirms payment declaration (`CONFIRMED`).
  - Financial precision:
    - All amounts in non-negative integer paise.
    - Zero floating point numbers in financial paths.
- **Audit Logging**:
  - Immutable audit logs for all lifecycle state changes, change orders, and payment declarations.

---

## 2. State Machines

### Job State Machine
```
[SCHEDULED] -> [EN_ROUTE] -> [ARRIVED] -> [IN_PROGRESS] -> [COMPLETED]
     \              \            \             \
      \--------------\------------\-------------\-> [CANCELLED]
```

### Change Order State Machine
```
[PENDING_APPROVAL] -> [APPROVED] (updates booking total)
                   \-> [REJECTED] (preserves original total)
```

### Payment State Machine
```
[PENDING] -> [PROVIDER_DECLARED] -> [CUSTOMER_CONFIRMED]
```

---

## 3. Acceptance Criteria (Testable)

1. **AC-P5-01 (Sequential Job Progression)**:
   - Provider can advance job strictly from `SCHEDULED` -> `EN_ROUTE` -> `ARRIVED` -> `IN_PROGRESS`.
2. **AC-P5-02 (Invalid State Transition Guard)**:
   - Attempting to skip states (e.g. `SCHEDULED` directly to `COMPLETED` or `ARRIVED` to `SCHEDULED`) is rejected with `400 INVALID_STATE_TRANSITION`.
3. **AC-P5-03 (Change Order Creation & Validation)**:
   - Provider can propose on-site change order with positive integer paise amounts for additional labor and parts. Negative amounts are rejected.
4. **AC-P5-04 (Customer Change Order Approval & Atomic Recalculation)**:
   - When Customer approves a change order, the booking's agreed total is atomically incremented by the change order delta.
5. **AC-P5-05 (Customer Change Order Rejection)**:
   - When Customer rejects a change order, the change order transitions to `REJECTED`, and the booking total remains unchanged.
6. **AC-P5-06 (Provider Payment Declaration - Cash & UPI)**:
   - Provider completes job and declares payment method (`CASH` or `UPI`) with integer paise and reference/receipt notes.
7. **AC-P5-07 (Customer Payment Confirmation)**:
   - Customer confirms the provider's declared payment; payment status transitions to `CONFIRMED`.
8. **AC-P5-08 (Audit Trail Invariant)**:
   - Every state transition, change order submission, approval/rejection, and payment declaration emits an audit record with actor ID, timestamp, and metadata.

---

## 4. Verification Evidence

Automated test suite `services/api/src/test/slice5-job-lifecycle.test.ts` ran and passed 8/8 test suites cleanly:
- `AC-P5-01`: Sequential Job Progression `SCHEDULED` -> `EN_ROUTE` -> `ARRIVED` -> `IN_PROGRESS` (Pass)
- `AC-P5-02`: Invalid state transitions throw `INVALID_STATE_TRANSITION` (Pass)
- `AC-P5-03`: Change order creation rejects negative amounts and requires active job (Pass)
- `AC-P5-04`: Customer approves change order and updates booking total atomically (Pass)
- `AC-P5-05`: Customer rejects change order; booking total remains unchanged (Pass)
- `AC-P5-06`: Provider declares payment (`CASH` and `UPI`) with non-negative integer paise (Pass)
- `AC-P5-07`: Customer confirms payment declaration (Pass)
- `AC-P5-08`: Full audit trail preserves every lifecycle, change order, and payment event (Pass)

Android Jetpack Compose Screens implemented:
- `JobActiveTrackingScreen.kt` (`SCR-C-JOB-STATUS`, `SCR-P-JOB-ACTIVE`, `SCR-P-JOB-PROGRESS`)
- `PaymentDeclarationScreen.kt` (`SCR-P-COLLECT-PAY`, `SCR-C-PAYMENT`)

