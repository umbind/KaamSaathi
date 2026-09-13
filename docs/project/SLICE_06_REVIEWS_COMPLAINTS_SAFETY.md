# Vertical Slice 6 — Reviews, Complaints, and Safety

Status: `VERIFIED`
Owner: @orchestrator (assigned to @backend, @android, @web)
Depends on: Slice 5 (Job Lifecycle, Change Orders, and Payments) `VERIFIED`
Blocks: Slice 7 (Admin and Operations)

This document defines the scope, state machines, business rules, safety emergency protocols, acceptance criteria, and test matrix for **Slice 6 (Reviews, Complaints, and Safety)** per `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`.

---

## 1. Scope

- **REQ-C-13 Verified Rating and Review**:
  - Customer can review a service provider only after the booking is `COMPLETED` and payment is `CONFIRMED`.
  - Star rating between 1 and 5 (integer).
  - Optional review comment (max 500 characters, sanitised).
  - Anti-fraud invariant: Exactly one review permitted per booking (`REVIEW_ALREADY_EXISTS`).
  - Rating aggregation: Provider's `rating_avg` and `rating_count` are recalculated immediately upon review publication.
- **REQ-P-12 Provider Review Response**:
  - Provider can submit one professional, moderated response to a customer review (`RESPONSE_ALREADY_EXISTS`).
  - Response length max 500 characters.
- **REQ-C-14 Complaints, Cancellations, and Disputes**:
  - Customer or Provider can lodge a formal dispute against a booking.
  - Reason categories: `POOR_QUALITY`, `OVERCHARGING`, `NO_SHOW`, `UNPROFESSIONAL_BEHAVIOUR`, `DAMAGE_OR_LOSS`, `OTHER`.
  - Free-text description and optional evidence photo upload tickets.
  - Dispute State Machine: `OPEN` -> `UNDER_REVIEW` -> `RESOLVED` / `DISMISSED`.
  - Dispute Audit Lock: A booking with an active dispute cannot undergo financial alterations or record deletions.
- **Safety Escalation and Emergency Protocols**:
  - Safety incident reporting: `HARASSMENT`, `THEFT`, `VIOLENCE`, `PROPERTY_DAMAGE`, `UNSAFE_ENVIRONMENT`.
  - Zero Guarantees & Emergency Helpline Banner: Platform clearly disclaims personal safety guarantee and prominently surfaces UP Emergency services (112 Police, 1090 Women Power Line).
  - High-priority escalation tag triggering immediate administrative queue prioritization.
- **REQ-P-13 Work History & Earnings Summary**:
  - Provider can query job completion metrics, gross earnings in paise, and CASH vs UPI split.
  - Privacy invariant: Banking credentials/UPI VPA remain private and are not exposed.
- **Audit Logging**:
  - Full immutable audit records for review submissions, responses, disputes, and safety escalations.

---

## 2. State Machines

### Review State Machine
```
[ELIGIBLE (Job COMPLETED & Payment CONFIRMED)] 
      |
      v
 [PUBLISHED] (Recalculates Provider rating_avg / count)
      |
      v
 [RESPONDED] (Provider submits optional single response)
```

### Dispute State Machine
```
[OPEN] -> [UNDER_REVIEW] -> [RESOLVED]
                         \-> [DISMISSED]
```

### Safety Incident State Machine
```
[REPORTED] -> [INVESTIGATING] -> [ESCALATED_AUTHORITIES]
                              \-> [RESOLVED]
```

---

## 3. Acceptance Criteria (Testable)

1. **AC-P6-01 (Verified Reviews Gated by Completion & Payment)**:
   - Review submission is permitted if and only if the booking status is `COMPLETED` and payment status is `CONFIRMED`. Submitting for non-completed or unconfirmed booking is rejected with `400 INVALID_STATE_TRANSITION`.
2. **AC-P6-02 (Single Review Anti-Fraud & Rating Range Invariant)**:
   - Duplicate review for the same booking throws `409 REVIEW_ALREADY_EXISTS`. Ratings < 1 or > 5 or non-integers are rejected with `400 INVALID_INPUT`.
3. **AC-P6-03 (Provider Rating Aggregation Recalculation)**:
   - When a review is published, the provider's `rating_avg` and `rating_count` are recalculated accurately.
4. **AC-P6-04 (Provider Single Response to Review)**:
   - Provider can submit an official response to an eligible review. Submitting a second response throws `409 RESPONSE_ALREADY_EXISTS`. Non-assigned provider cannot respond (`403 FORBIDDEN`).
5. **AC-P6-05 (Booking Dispute Filing & Audit Lock)**:
   - Eligible customer or provider can file a booking dispute with valid reason and description. Disputed booking enters `DISPUTED` state locking subsequent state tampering.
6. **AC-P6-06 (Safety Incident Priority Escalation & Emergency Metadata)**:
   - Safety incident report records severity, category, and surfaces UP Emergency hotline guidance (112 / 1090). High severity incidents automatically flag for immediate priority review.
7. **AC-P6-07 (Provider Earnings & Job History Aggregation)**:
   - Provider earnings summary aggregates total completed bookings, total gross paise, and cash vs UPI breakdown with zero exposure of customer bank details.
8. **AC-P6-08 (Audit Trail Invariant for Reviews & Safety)**:
   - Every review, review response, dispute filing, and safety incident creates an immutable audit record with actor, timestamp, and metadata.

---

## 4. Verification Evidence

Automated test suite `services/api/src/test/slice6-reviews-safety.test.ts` ran and passed 8/8 test suites cleanly:
- `AC-P6-01`: Verified reviews gated by completion and confirmed payment (Pass)
- `AC-P6-02`: Single review anti-fraud and rating range invariant (Pass)
- `AC-P6-03`: Provider rating aggregation recalculation (Pass)
- `AC-P6-04`: Provider single response to review and authorization check (Pass)
- `AC-P6-05`: Booking dispute filing, validation, and booking audit lock (Pass)
- `AC-P6-06`: Safety incident priority escalation and UP emergency helpline metadata (Pass)
- `AC-P6-07`: Provider earnings and job history aggregation without exposing bank details (Pass)
- `AC-P6-08`: Full audit trail preserves review, response, dispute, and safety incident events (Pass)

Android Jetpack Compose Screens implemented:
- `ReviewSubmissionScreen.kt` (`SCR-C-REVIEW`): star rating selector (1-5), feedback input with character counter, zero guarantees rule banner, 48dp touch targets, dual-language strings.
- `DisputeFilingScreen.kt` (`SCR-C-DISPUTE`): dispute reason category chips, incident description, prominent UP emergency safety hotline card (112 / 1090), 48dp touch targets.
- `ProviderEarningsScreen.kt` (`SCR-P-EARNINGS`): gross earnings card, cash vs UPI breakdown, job completion count, zero bank credential exposure.
