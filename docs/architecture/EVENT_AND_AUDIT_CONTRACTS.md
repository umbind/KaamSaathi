# KaamSaathi — Event and Audit Contracts

- **Document Version**: `1.0.0-frozen`
- **Status**: `FROZEN`
- **Deciders**: Umesh Kumar (Project Owner), Principal Architect, Security Lead

---

## 1. Event Model & Architectural Purpose

Events in KaamSaathi serve three decoupled purposes:
1. **In-Process Domain Events**: Trigger asynchronous notifications (SMS/Push), cache eviction, and analytics updates without slowing synchronous HTTP request-response cycles.
2. **Immutable Audit Trail**: Statutory, security, and fraud compliance logging recording every privileged or state-changing action.
3. **Telemetry & Growth Analytics**: Privacy-preserving operational metrics and funnel analysis.

---

## 2. Standard Envelope Formats

### 2.1 Domain Event Envelope
```json
{
  "event_id": "evt_01J7K8M9N1A2B3C4D5E6F7",
  "event_type": "quote.accepted",
  "aggregate_type": "BOOKING",
  "aggregate_id": "bok_01J7K8M9N0...",
  "actor": {
    "user_id": "usr_01J7K8M9C1...",
    "role": "CUSTOMER"
  },
  "correlation_id": "cor_01J7K8M9N2...",
  "timestamp": "2026-09-13T10:15:30.123Z",
  "version": 1,
  "payload": {
    "booking_number": "KS-UP-26-000123",
    "request_id": "req_01J7K8M9R1...",
    "quote_id": "qte_01J7K8M9Q1...",
    "provider_id": "pro_01J7K8M9P1...",
    "agreed_quote_total_paise": 45000,
    "district_id": "UP_LUCKNOW"
  }
}
```

### 2.2 Immutable Audit Log Record
Every state mutation writes an append-only audit record to `audit_logs`:
```json
{
  "id": 104523,
  "entity_name": "quotes",
  "entity_id": "qte_01J7K8M9Q1...",
  "actor_id": "usr_01J7K8M9C1...",
  "actor_role": "CUSTOMER",
  "action": "QUOTE_ACCEPTED",
  "previous_state": "VIEWED",
  "new_state": "ACCEPTED",
  "metadata": {
    "request_id": "req_01J7K8M9R1...",
    "total_amount_paise": 45000,
    "competing_quotes_declined_count": 3
  },
  "ip_address": "103.24.89.12",
  "correlation_id": "cor_01J7K8M9N2...",
  "created_at": "2026-09-13T10:15:30.125Z"
}
```

---

## 3. Authoritative Event Catalog

| Event Name | Producer | Aggregate | Consumer Actions | Audit Mandatory? |
|---|---|---|---|:---:|
| `auth.otp_challenge_issued` | Identity | USER | Throttling counter; Mock/SMS delivery | Yes |
| `auth.user_authenticated` | Identity | USER | Session creation; analytics login event | Yes |
| `auth.role_switched` | Identity | USER | Active mode token re-issued | Yes |
| `provider.profile_submitted`| Provider | PROVIDER | Enqueue into admin verification queue | Yes |
| `provider.verification_decided`| Verification | PROVIDER | Compute trust badges; notify provider | Yes |
| `request.created` | Requests | REQUEST | Trigger radius matching; dispatch leads | Yes |
| `lead.dispatched` | Matching | LEAD | Push notification to provider lead inbox | No |
| `quote.dispatched` | Quotes | QUOTE | Notify customer of incoming quote | Yes |
| `quote.accepted` | Bookings | BOOKING | Lock booking; decline competing; notify | Yes |
| `job.arrived` | Bookings | BOOKING | Notify customer of provider arrival | Yes |
| `job.started` | Bookings | BOOKING | Record physical work commencement | Yes |
| `change_order.created` | Bookings | CHANGE_ORDER | Prompt customer for approval | Yes |
| `change_order.decided` | Bookings | CHANGE_ORDER | Recalculate `final_payable_paise` | Yes |
| `job.completed` | Bookings | BOOKING | Trigger completion notice; payment prompt| Yes |
| `payment.recorded` | Payments | PAYMENT | Record cash/UPI declaration; update status | Yes |
| `review.submitted` | Reviews | REVIEW | Recalculate provider average rating | Yes |
| `dispute.opened` | Support | DISPUTE | Triage into support queue; notify parties | Yes |
| `safety.escalated` | Safety | DISPUTE | P0 alert to Trust & Safety; apply hold | Yes |
| `privacy.deletion_requested`| Privacy | USER | Freeze marketing; evaluate retention hold | Yes |

---

## 4. Audit Security & PII Redaction Invariants

1. **Automated Redaction**:
   - `metadata` must NEVER contain passwords, OTPs, raw JWTs, refresh tokens, credit card numbers, or full Aadhaar numbers.
   - Phone numbers in audit logs are masked (`+91******3210`).
2. **Immutability Guarantee**:
   - The `audit_logs` table has permissions set to `INSERT` and `SELECT` only. `UPDATE` and `DELETE` grants are revoked from the application database user.
