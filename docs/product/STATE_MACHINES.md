# KaamSaathi Authoritative State Machines

## 1. State-Machine Contract

- State changes are server-controlled and transactional.
- Every transition records actor, source channel, timestamp, previous state, new state, reason, correlation ID, and request/idempotency ID.
- Invalid transitions return a stable domain error and current authoritative state.
- Duplicate transition requests return the original result when the idempotency key and payload match; conflicting reuse returns an idempotency conflict.
- Admin/support overrides require explicit permission, reason, affected user notification where safe, and audit.
- No record is physically deleted merely to hide lifecycle history.

---

## 2. User Account State

### States

- `PENDING_PHONE_VERIFICATION`
- `ACTIVE`
- `TEMPORARILY_RESTRICTED`
- `SUSPENDED`
- `DEACTIVATED_BY_USER`
- `DELETION_PENDING`
- `ANONYMIZED_OR_DELETED`
- `LEGAL_HOLD_RETAINED`

### Transitions

| From | To | Actor | Preconditions | Side effects |
|---|---|---|---|---|
| None | PENDING_PHONE_VERIFICATION | System | OTP challenge created | Audit challenge without OTP value |
| PENDING_PHONE_VERIFICATION | ACTIVE | User/System | Valid OTP, risk checks pass | Create session/profile shell |
| ACTIVE | TEMPORARILY_RESTRICTED | Authorized admin | Policy basis, duration, reason | Revoke affected capabilities; notify; appeal enabled |
| TEMPORARILY_RESTRICTED | ACTIVE | Authorized admin/System | Review/expiry conditions met | Restore capability; audit |
| ACTIVE/TEMPORARILY_RESTRICTED | SUSPENDED | Authorized senior admin | High-impact review complete | Revoke sessions as required; appeal enabled |
| SUSPENDED | ACTIVE | Authorized senior admin | Appeal/review approves reinstatement | Restore; notify |
| ACTIVE | DEACTIVATED_BY_USER | User | Re-authentication; active transaction handling | Hide marketplace presence; revoke ordinary sessions |
| Any nonterminal | DELETION_PENDING | User/Privacy agent | Verified request | Freeze nonessential processing; retention assessment |
| DELETION_PENDING | ANONYMIZED_OR_DELETED | Privacy processor | No active legal hold; retention actions complete | Delete/anonymize; notify |
| DELETION_PENDING | LEGAL_HOLD_RETAINED | Authorized privacy/legal role | Documented lawful hold | Restrict access; notify to permitted extent |

**Prohibited:** Automated permanent suspension based solely on an unreviewed fraud score.

---

## 3. Provider Onboarding and Verification

### Provider Profile States

- `DRAFT`
- `SUBMITTED`
- `IN_REVIEW`
- `MORE_INFORMATION_REQUIRED`
- `APPROVED_LIMITED`
- `APPROVED_ACTIVE`
- `REJECTED`
- `PAUSED_BY_PROVIDER`
- `RESTRICTED_BY_PLATFORM`
- `DEACTIVATED`

### Verification Case States

- `DRAFT`
- `SUBMITTED`
- `VALIDATION_FAILED`
- `QUEUED`
- `IN_REVIEW`
- `MORE_INFORMATION_REQUIRED`
- `APPROVED`
- `REJECTED`
- `APPEALED`
- `SUPERSEDED`
- `EXPIRED`

### Key Transitions

| From | To | Actor | Preconditions | Side effects |
|---|---|---|---|---|
| DRAFT | SUBMITTED | Provider/Assisted operator | Required fields/evidence for route present; consent | Lock submitted evidence version |
| SUBMITTED | VALIDATION_FAILED | System | File/data validation fails | Explain safe correction; no reviewer decision |
| SUBMITTED | QUEUED | System | Validation succeeds | Assign queue/risk category |
| QUEUED | IN_REVIEW | Verification agent | Agent authorized; case claimed | Access audit; signed evidence access |
| IN_REVIEW | MORE_INFORMATION_REQUIRED | Verification agent | Structured reason and requested items | Notify provider; deadline |
| MORE_INFORMATION_REQUIRED | QUEUED | Provider | New version/evidence submitted | Preserve prior version |
| IN_REVIEW | APPROVED | Verification agent | Policy criteria met | Add exact verification signals; recompute eligibility |
| IN_REVIEW | REJECTED | Verification agent | Policy criterion fails; reason | Notify; resubmission/appeal path |
| REJECTED | APPEALED | Provider | Within appeal window | Independent review queue |
| APPROVED | EXPIRED | System/Admin | Time-bound evidence expires | Remove/alter signal; recompute eligibility |

**Provider profile approval:** `APPROVED_ACTIVE` requires category/location eligibility, active account, accepted terms, and minimum verification signals. `APPROVED_LIMITED` may allow profile completion or supervised pilot use without public discovery.

---

## 4. Service Request

### States

- `DRAFT`
- `SUBMITTED`
- `MATCHING`
- `PROVIDERS_NOTIFIED`
- `RESPONSES_RECEIVED`
- `QUOTES_AVAILABLE`
- `PROVIDER_SELECTED`
- `NO_MATCH`
- `EXPIRED`
- `CANCELLED_BY_CUSTOMER`
- `CANCELLED_BY_SYSTEM`
- `CONVERTED_TO_BOOKING`

### Transition Table

| From | To | Actor | Preconditions | Side effects |
|---|---|---|---|---|
| None | DRAFT | Customer/System | Authenticated or approved guest draft | Save local/server draft |
| DRAFT | SUBMITTED | Customer/Assisted operator | Required fields; supported area/category; consent | Create immutable request version; audit |
| SUBMITTED | MATCHING | System | Matching request | Compute eligible providers |
| SUBMITTED | PROVIDERS_NOTIFIED | System | Valid targeted provider | Create match/lead; notify |
| MATCHING | PROVIDERS_NOTIFIED | System | At least one eligible provider | Batch notifications |
| MATCHING | NO_MATCH | System | No eligible provider after policy attempts | Offer support/rematch/time change |
| PROVIDERS_NOTIFIED | RESPONSES_RECEIVED | System | At least one valid provider response | Notify customer status |
| RESPONSES_RECEIVED | QUOTES_AVAILABLE | System | At least one active quote | Notify customer |
| QUOTES_AVAILABLE | PROVIDER_SELECTED | Customer/System | Valid quote accepted atomically | Lock selection; close other matches |
| PROVIDER_SELECTED | CONVERTED_TO_BOOKING | System | Booking transaction commits | Link booking |
| Any pre-booking nonterminal | CANCELLED_BY_CUSTOMER | Customer | Cancellation allowed | Expire leads/quotes; notify |
| Any pre-booking nonterminal | EXPIRED | System | Request deadline passes | Expire open leads/quotes |
| Any nonterminal | CANCELLED_BY_SYSTEM | Authorized system/admin | Duplicate, abuse, category disabled, or invalid | Reason/audit/notice |

**Concurrency rule:** Quote acceptance and booking creation occur in one transaction or an equivalent atomic workflow. Exactly one quote wins.

---

## 5. Provider Match/Lead

### States

- `CREATED`
- `NOTIFIED`
- `VIEWED`
- `INTERESTED`
- `DECLINED`
- `QUOTE_SUBMITTED`
- `SELECTED`
- `NOT_SELECTED`
- `EXPIRED`
- `WITHDRAWN`
- `CANCELLED`

| From | To | Actor | Preconditions |
|---|---|---|---|
| CREATED | NOTIFIED | System | Provider remains eligible |
| NOTIFIED | VIEWED | Provider | Authorized provider opens lead |
| NOTIFIED/VIEWED | INTERESTED | Provider | Before expiry; available |
| NOTIFIED/VIEWED | DECLINED | Provider | Reason captured |
| INTERESTED | QUOTE_SUBMITTED | Provider/System | Valid quote created |
| QUOTE_SUBMITTED | SELECTED | System | Customer accepts linked quote |
| QUOTE_SUBMITTED/INTERESTED | NOT_SELECTED | System | Another provider selected |
| Any preselected | EXPIRED | System | Deadline passes |
| INTERESTED/QUOTE_SUBMITTED | WITHDRAWN | Provider | Before selection; reason |
| Any preselected | CANCELLED | System | Request cancelled/invalid |

---

## 6. Estimate/Quote

### States

- `DRAFT`
- `SUBMITTED`
- `ACTIVE`
- `REVISION_REQUESTED`
- `SUPERSEDED`
- `ACCEPTED`
- `REJECTED_BY_CUSTOMER`
- `WITHDRAWN_BY_PROVIDER`
- `EXPIRED`
- `CANCELLED`

| From | To | Actor | Preconditions | Side effects |
|---|---|---|---|---|
| DRAFT | SUBMITTED | Provider | Required itemization and schedule | Validate amounts/category |
| SUBMITTED | ACTIVE | System | Provider/request eligible | Notify customer |
| ACTIVE | REVISION_REQUESTED | Customer | No accepted quote; request open | Notify provider |
| ACTIVE/REVISION_REQUESTED | SUPERSEDED | System | New valid quote version submitted | Prior remains read-only |
| ACTIVE | ACCEPTED | Customer/System | Not expired/withdrawn; request open | Atomic selection/booking |
| ACTIVE | REJECTED_BY_CUSTOMER | Customer | Reason optional | Close match as appropriate |
| ACTIVE | WITHDRAWN_BY_PROVIDER | Provider | Not accepted | Notify customer |
| ACTIVE | EXPIRED | System | Valid-until passed | Disable acceptance |
| Any preacceptance | CANCELLED | System | Request cancelled | Close quote |

**Invariant:** `ACCEPTED` quote content is immutable. Corrections after acceptance use booking cancellation/rebooking or change order.

---

## 7. Booking and Job Lifecycle

### States

- `BOOKED`
- `RESCHEDULE_PROPOSED`
- `SCHEDULED`
- `PROVIDER_EN_ROUTE`
- `PROVIDER_ARRIVED`
- `START_CONFIRMATION_PENDING`
- `IN_PROGRESS`
- `CHANGE_ORDER_PENDING`
- `COMPLETION_SUBMITTED`
- `COMPLETION_CORRECTION_REQUESTED`
- `COMPLETED_CONFIRMED`
- `COMPLETED_UNCONFIRMED`
- `DISPUTED`
- `CANCELLED_BY_CUSTOMER`
- `CANCELLED_BY_PROVIDER`
- `CANCELLED_BY_PLATFORM`
- `NO_SHOW_PROVIDER`
- `NO_SHOW_CUSTOMER`
- `CLOSED`

### Allowed Transitions

| From | To | Actor | Preconditions | Side effects/notifications |
|---|---|---|---|---|
| None | BOOKED | System | Accepted quote, booking transaction commits | Notify both; reveal authorized address/contact |
| BOOKED | SCHEDULED | System | Schedule confirmed | Calendar/reminder |
| BOOKED/SCHEDULED | RESCHEDULE_PROPOSED | Customer/Provider | Proposed future slot; reason | Notify other party; proposal expiry |
| RESCHEDULE_PROPOSED | SCHEDULED | Other party/System | Proposal accepted | Version schedule; notify |
| RESCHEDULE_PROPOSED | prior stable state | Other party/System | Declined/expired | Preserve original schedule |
| SCHEDULED | PROVIDER_EN_ROUTE | Provider | Within configured time; active eligibility | Notify customer |
| SCHEDULED/PROVIDER_EN_ROUTE | PROVIDER_ARRIVED | Provider | Booking window/location context | Notify customer |
| PROVIDER_ARRIVED | START_CONFIRMATION_PENDING | Provider/System | Provider requests start | Generate/validate start method |
| START_CONFIRMATION_PENDING/PROVIDER_ARRIVED | IN_PROGRESS | Customer/System | Customer confirms or valid code/support override | Audit start |
| IN_PROGRESS | CHANGE_ORDER_PENDING | Provider | Valid change order submitted | Notify customer; original work may continue only within approved scope |
| CHANGE_ORDER_PENDING | IN_PROGRESS | Customer/System | Accepted or rejected; result stored | Update approved amount only if accepted |
| IN_PROGRESS | COMPLETION_SUBMITTED | Provider | Final bill valid; completion payload complete | Notify customer |
| COMPLETION_SUBMITTED | COMPLETION_CORRECTION_REQUESTED | Customer | Bill/work correction requested | Notify provider |
| COMPLETION_CORRECTION_REQUESTED | COMPLETION_SUBMITTED | Provider | Corrected version submitted | Preserve versions |
| COMPLETION_SUBMITTED | COMPLETED_CONFIRMED | Customer/System | Customer confirms | Review eligible; completion event |
| COMPLETION_SUBMITTED | DISPUTED | Customer/System | Complaint/dispute created | Freeze disputed portions; route support |
| COMPLETION_SUBMITTED | COMPLETED_UNCONFIRMED | System | Policy timeout; reminders sent; no open dispute | Mark source as system closure; preserve complaint window |
| Any eligible precompletion | CANCELLED_BY_CUSTOMER | Customer/Admin | Policy allows; reason | Close active leads/payment actions; notify |
| Any eligible precompletion | CANCELLED_BY_PROVIDER | Provider/Admin | Policy allows; reason | Offer rematch; reliability signal review |
| Any nonterminal | CANCELLED_BY_PLATFORM | Authorized admin/System | Safety, duplicate, invalid, policy | Notify where safe; audit |
| SCHEDULED/EN_ROUTE/ARRIVED | NO_SHOW_PROVIDER | Customer/Admin | Grace period; evidence/review | Offer rematch; case signal |
| SCHEDULED/ARRIVED | NO_SHOW_CUSTOMER | Provider/Admin | Grace period; contact attempt/evidence | Case signal |
| COMPLETED_CONFIRMED/COMPLETED_UNCONFIRMED | DISPUTED | Customer/Provider | Within complaint window or serious safety issue | Link complaint |
| COMPLETED_CONFIRMED/COMPLETED_UNCONFIRMED/DISPUTED/CANCELLED*/NO_SHOW* | CLOSED | System/Admin | Retention/appeal conditions met | Read-only operational state |

### Prohibited Direct Transitions

- `SCHEDULED` directly to `COMPLETED_CONFIRMED`.
- `PROVIDER_EN_ROUTE` directly to `IN_PROGRESS` without arrival/start confirmation unless authorized support override.
- `IN_PROGRESS` to a higher final amount without accepted change order or explicit customer-confirmed corrected bill.
- Provider alone to `COMPLETED_CONFIRMED`.
- Client-supplied arbitrary state update.

---

## 8. Reschedule Proposal

### States

- `PROPOSED`
- `ACCEPTED`
- `DECLINED`
- `EXPIRED`
- `WITHDRAWN`
- `SUPERSEDED`

Only one active proposal per booking unless policy supports alternatives. Acceptance updates booking schedule atomically.

---

## 9. Change Order

### States

- `DRAFT`
- `SUBMITTED`
- `ACTIVE`
- `ACCEPTED`
- `REJECTED`
- `WITHDRAWN`
- `EXPIRED`
- `SUPERSEDED`
- `CANCELLED`

| From | To | Actor | Preconditions |
|---|---|---|---|
| DRAFT | SUBMITTED | Provider | Reason, delta, scope, impact complete |
| SUBMITTED | ACTIVE | System | Booking in progress; provider authorized |
| ACTIVE | ACCEPTED | Customer | Current version; no conflicting terminal booking state |
| ACTIVE | REJECTED | Customer | Reason optional |
| ACTIVE | WITHDRAWN | Provider | Not accepted |
| ACTIVE | EXPIRED | System | Validity elapsed |
| ACTIVE | SUPERSEDED | System | New version submitted |
| Any nonterminal | CANCELLED | System | Booking cancelled/closed |

**Invariant:** Approved financial ceiling equals accepted quote plus accepted change-order deltas, subject to explicitly confirmed correction policy.

---

## 10. Payment Record

### States

- `NOT_RECORDED`
- `PAYMENT_INTENT_CREATED`
- `CUSTOMER_DECLARED_PAID`
- `PROVIDER_DECLARED_RECEIVED`
- `PAYMENT_CONFIRMED_PARTIES`
- `PSP_PENDING`
- `PSP_CONFIRMED`
- `FAILED`
- `CANCELLED`
- `DISPUTED`
- `REFUND_PENDING`
- `REFUNDED`
- `PARTIALLY_REFUNDED`

### Rules

- Cash/external UPI declaration states are independent until reconciled.
- PSP state changes require verified server callback or trusted reconciliation, not client result alone.
- Duplicate callbacks are idempotent.
- A payment dispute does not rewrite original declarations.
- Refund states exist only when an approved PSP/business process supports them.

---

## 11. Complaint/Dispute

### States

- `DRAFT`
- `SUBMITTED`
- `ACKNOWLEDGED`
- `TRIAGED`
- `EVIDENCE_REQUESTED`
- `UNDER_REVIEW`
- `INTERIM_ACTION_APPLIED`
- `PROPOSED_RESOLUTION`
- `RESOLVED`
- `APPEALED`
- `REOPENED`
- `CLOSED`
- `REJECTED_AS_INVALID`

| From | To | Actor | Preconditions |
|---|---|---|---|
| DRAFT | SUBMITTED | User/Operator | Category/description; consent |
| SUBMITTED | ACKNOWLEDGED | System | Case created | Reference/target communicated |
| ACKNOWLEDGED | TRIAGED | Support/T&S | Severity/category assigned |
| TRIAGED/UNDER_REVIEW | EVIDENCE_REQUESTED | Agent | Specific need; privacy limits |
| EVIDENCE_REQUESTED | UNDER_REVIEW | User/Agent | Evidence received/deadline policy |
| TRIAGED/UNDER_REVIEW | INTERIM_ACTION_APPLIED | Authorized T&S | Documented safety necessity; time-limited review | Notify where safe; appeal/ review date |
| UNDER_REVIEW | PROPOSED_RESOLUTION | Authorized agent | Facts/policy assessed |
| PROPOSED_RESOLUTION | RESOLVED | Agent/System | Resolution accepted or policy decision final at level |
| RESOLVED | APPEALED | Eligible party | Within appeal window |
| APPEALED | REOPENED | Independent reviewer | Material review needed |
| RESOLVED/APPEALED | CLOSED | System/Agent | Notice sent; retention/appeal complete |
| ACKNOWLEDGED/TRIAGED | REJECTED_AS_INVALID | Agent | Duplicate/spam/no relation; reason | Appeal where appropriate |

**Serious safety reports:** May bypass ordinary queue order but must still be audited.

---

## 12. Rating and Review

### States

- `DRAFT`
- `SUBMITTED`
- `PUBLISHED`
- `HELD_FOR_MODERATION`
- `REJECTED`
- `EDITED`
- `REMOVED`
- `APPEALED`
- `RESTORED`

Eligibility is derived, not user-supplied. Review visibility changes do not delete moderation history.

---

## 13. Notification Delivery

### States

- `QUEUED`
- `SENT_TO_PROVIDER`
- `DELIVERED`
- `OPENED`
- `FAILED_RETRYABLE`
- `FAILED_PERMANENT`
- `SUPPRESSED_BY_PREFERENCE`
- `CANCELLED_OBSOLETE`

Transactional state changes remain valid even when notification delivery fails. Retry uses backoff and deduplication keys.

---

## 14. Privacy Request

### States

- `SUBMITTED`
- `IDENTITY_VERIFICATION_REQUIRED`
- `VERIFIED`
- `BLOCKED_ACTIVE_TRANSACTION`
- `UNDER_REVIEW`
- `IN_PROCESSING`
- `COMPLETED`
- `PARTIALLY_COMPLETED_WITH_RETENTION`
- `REJECTED`
- `APPEALED`

All outcomes include reason, retained-data category where allowed, and evidence. Active-transaction blocks are temporary and narrowly scoped; immediate deactivation may still occur.
