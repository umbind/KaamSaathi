# KaamSaathi End-to-End Test Matrix

## 1. Priority Definitions

- **P0:** Release blocker; safety, security, money, data loss, or core marketplace completion.
- **P1:** Essential MVP journey or high-frequency failure.
- **P2:** Important secondary behavior.
- **P3:** Nice-to-have or exploratory.

Every P0/P1 test must have an automated component where practical and an execution record for release candidates.

## 2. Core Matrix

| ID | Pri | Actor/Area | Scenario | Required validation |
|---|---:|---|---|---|
| E2E-001 | P0 | Customer | New user OTP registration | Generic response, valid OTP, one account/session, audit |
| E2E-002 | P0 | Auth | Invalid/expired/replayed OTP | Denied, attempts tracked, no enumeration |
| E2E-003 | P0 | Auth | OTP abuse/rate limit | Throttle by configured dimensions; safe retry |
| E2E-004 | P1 | Shared device | Masked notifications and logout | No sensitive lock-screen content; session removed |
| E2E-005 | P1 | Customer | Hindi first launch and language switch | All critical labels/statuses localize |
| E2E-006 | P1 | Accessibility | Screen reader + large font core onboarding | Semantic, no clipped critical action |
| E2E-007 | P1 | Location | Locality selection with GPS denied | Functional without precise permission |
| E2E-008 | P1 | Coverage | Unsupported category/locality | No false booking; alternatives shown |
| E2E-009 | P0 | Provider | Provider onboarding draft | Saved, not discoverable before eligibility |
| E2E-010 | P0 | Verification | Submit valid evidence route | Private storage, queue, status, audit |
| E2E-011 | P0 | Verification | Reject/request info/resubmit | Versions preserved; clear reason/appeal |
| E2E-012 | P1 | Verification | Alternative nonstandard route | Accurate badge and eligibility behavior |
| E2E-013 | P0 | Authorization | Customer accesses another customer request | Denied without enumeration |
| E2E-014 | P0 | Authorization | Provider accesses unassigned lead/address | Denied; exact address hidden |
| E2E-015 | P0 | Admin | Support role calls privileged admin API | Denied server-side and audited |
| E2E-016 | P0 | Customer | Create matching request | Exactly one request; correct state/notifications |
| E2E-017 | P0 | Reliability | Duplicate request retry after timeout | Same request returned; no duplicate leads |
| E2E-018 | P1 | Upload | Interrupted image upload | Draft preserved; no corrupt/public file |
| E2E-019 | P0 | Matching | Hard filters exclude ineligible provider | Server-side exclusion and reason code |
| E2E-020 | P1 | Matching | Controlled batches and expansion | Batch limits, expiry, next batch |
| E2E-021 | P1 | Matching | No provider available | NO_MATCH and alternatives/support |
| E2E-022 | P0 | Provider | Lead accept/decline/expiry | Authorized state transitions; no address leak |
| E2E-023 | P0 | Quote | Submit itemized quote | Required fields, minor units, validity |
| E2E-024 | P0 | Quote | Revise quote | Immutable versions; customer sees current |
| E2E-025 | P0 | Quote | Withdraw/expire then accept attempt | Acceptance denied; no booking |
| E2E-026 | P0 | Concurrency | Two quotes accepted concurrently | Exactly one accepted/one booking |
| E2E-027 | P0 | Booking | Contact/address reveal threshold | Hidden before; scoped after confirmation |
| E2E-028 | P1 | Booking | Reschedule accepted | Versioned schedule and notifications |
| E2E-029 | P1 | Booking | Reschedule declined/expired | Original schedule remains |
| E2E-030 | P1 | Customer | Customer cancellation | Reason, state, notifications, rematch logic |
| E2E-031 | P1 | Provider | Provider cancellation | Customer alternatives and reliability signal |
| E2E-032 | P0 | Job | Provider en route/arrived/start code | Valid sequence, rate limit, audit |
| E2E-033 | P0 | Job | Provider attempts direct completion from scheduled | Server rejects invalid transition |
| E2E-034 | P0 | Job | Wrong/expired start code | Denied without starting job |
| E2E-035 | P0 | Job | Change order accepted | Approved amount/scope updated once |
| E2E-036 | P0 | Job | Change order rejected | Final bill cannot include rejected delta |
| E2E-037 | P0 | Job | Final amount above approved ceiling | Blocked/correction flow |
| E2E-038 | P0 | Completion | Customer confirms completion | Eligible terminal state/review |
| E2E-039 | P0 | Completion | Customer disputes completion | DISPUTED and case created |
| E2E-040 | P1 | Completion | Customer never responds | Reminders; clearly unconfirmed system closure |
| E2E-041 | P0 | Concurrency | Completion confirm and dispute race | Deterministic state, no contradiction |
| E2E-042 | P0 | Payment | Cash declarations match | Party-confirmed status and labelled receipt |
| E2E-043 | P0 | Payment | Cash/UPI declarations mismatch | Disputed; evidence preserved |
| E2E-044 | P0 | Payment | UPI intent returns success-like client result | Not PSP-confirmed without server proof |
| E2E-045 | P0 | Payment | Valid PSP webhook | Signature/mapping/idempotency/status |
| E2E-046 | P0 | Payment | Duplicate/forged PSP webhook | Duplicate harmless; forged rejected |
| E2E-047 | P0 | Secrets | Payment/OTP/identity values in logs | Redaction/no collection verified |
| E2E-048 | P1 | No-show | Provider no-show | Grace/evidence, rematch, reviewable signal |
| E2E-049 | P1 | No-show | Customer no-show | Grace/contact, no unapproved auto fee |
| E2E-050 | P0 | Review | Eligible completed-job review | One review, moderation, audit |
| E2E-051 | P0 | Review | Ineligible/fake review | Server denies |
| E2E-052 | P1 | Review | Negative but compliant review reported | Remains published |
| E2E-053 | P1 | Review | Review contains PII/threat | Held/rejected; evidence restricted |
| E2E-054 | P0 | Complaint | Ordinary dispute submission | Reference immediately, queue/status |
| E2E-055 | P0 | Safety | Immediate-danger report | Emergency guidance first; restricted case |
| E2E-056 | P0 | Safety | Interim provider restriction | Authorized, reasoned, time-limited, appeal |
| E2E-057 | P0 | Privacy | Complaint evidence access by unauthorized role | Denied/audited |
| E2E-058 | P0 | Account | Account takeover response | Sessions revoked; high-risk actions frozen |
| E2E-059 | P0 | Fraud | Fake provider/impersonation flow | Profile containment, review, appeal |
| E2E-060 | P1 | Fraud | Fake booking/repeated malicious requests | Proportionate rate/review controls |
| E2E-061 | P0 | Admin | Verification approval/rejection audit | Reviewer/policy/reason/evidence version |
| E2E-062 | P0 | Admin | High-impact suspension and appeal | Human review, notice, independent appeal |
| E2E-063 | P1 | Admin | Category/coverage change during active job | Active contract unaffected |
| E2E-064 | P0 | Feature flag | Disable risky feature | Environment scoped, audited, rollback |
| E2E-065 | P0 | Privacy | Data export | User data only; protected data excluded |
| E2E-066 | P0 | Privacy | Account deletion with active booking | Deactivation/status; safe handling/retention |
| E2E-067 | P0 | Privacy | Deletion job retry | Idempotent; no repeated corruption |
| E2E-068 | P1 | Consent | Withdraw optional analytics/WhatsApp | Future processing stops; transaction intact |
| E2E-069 | P0 | Offline | Submit request offline then reconnect | Pending sync, one server record |
| E2E-070 | P0 | Offline | Server state changes before queued action | Conflict explained; no overwrite |
| E2E-071 | P1 | Android | Process death during request/job | Restore safe draft/active context |
| E2E-072 | P1 | Android | Low memory/3G/packet loss | No crash/ANR; retries and progress |
| E2E-073 | P1 | Notifications | Duplicate event delivery | One user-visible notification/action |
| E2E-074 | P1 | Notifications | Delivery failure | Transaction remains correct; retry/fallback |
| E2E-075 | P0 | Upload | Malicious/polyglot/oversized file | Rejected/quarantined; no execution/preview |
| E2E-076 | P0 | Security | IDOR/BOLA across every core object | Denied consistently |
| E2E-077 | P0 | Security | XSS/SQLi/SSRF/common injection attempts | Sanitized/blocked; no exploit |
| E2E-078 | P0 | Security | Secret scan/dependency scan | No committed secret; blockers resolved |
| E2E-079 | P0 | Database | Migration forward and rollback/forward-fix | Data constraints/integrity preserved |
| E2E-080 | P0 | Operations | Backup and restore | Restored environment passes smoke checks |
| E2E-081 | P0 | Deployment | Staging deploy and rollback | Health, smoke, metrics, rollback verified |
| E2E-082 | P1 | Web | Public pages no JS where practical | Content/metadata/canonical/sitemap valid |
| E2E-083 | P0 | Web privacy | Private/admin pages indexing | Blocked/no sensitive bundle data |
| E2E-084 | P1 | Web accessibility | Keyboard/contrast/forms/errors | No critical defect |
| E2E-085 | P1 | Analytics | Event catalogue validation | Correct event once; no PII |
| E2E-086 | P0 | Audit | Critical state and admin action events | Complete safe audit trail |
| E2E-087 | P1 | Performance | Search/request API latency under target load | Meets documented p95 or exception recorded |
| E2E-088 | P1 | Cost | Abuse/cost-exhaustion controls | Rate/quota/alert behavior |
| E2E-089 | P0 | Release | Clean reproducible builds | Android/web/admin/API build from docs |
| E2E-090 | P0 | Release | Final auditor reruns P0 suite | Actual evidence and readiness verdict |

## 3. Device and Network Matrix

At minimum test:

- Minimum supported Android API level.
- Target/current Android API level.
- Low-RAM device profile.
- Small screen and large font.
- Hindi and English.
- TalkBack/screen-reader semantics.
- 3G-like latency/bandwidth.
- Packet loss and temporary offline.
- Limited storage.
- App background/foreground and process death.
- Denied location/camera/notification permissions.
- Shared-device logout and masked notifications.

## 4. Browser Matrix

At minimum test current supported mobile/desktop versions defined by the project for:

- Chrome/Android.
- Chrome desktop.
- Edge desktop where supported.
- One WebKit/Safari path for public web if supported by launch audience.
- Keyboard-only and screen-reader smoke tests.

## 5. Synthetic Test Data

Create synthetic:

- Customers/providers/admin roles.
- Hindi/English names and content.
- Supported/unsupported localities.
- Eligible/ineligible providers.
- Verification routes and expiry.
- Quotes/change orders/payment declarations.
- Complaints at each severity.
- Offline/retry/concurrency scenarios.

Never use real identity documents, production phone numbers, real home addresses, or production payment data.
