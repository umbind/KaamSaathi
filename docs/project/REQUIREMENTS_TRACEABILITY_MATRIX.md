# KaamSaathi Requirements Traceability Matrix

| Requirement ID | Requirement | Source | Priority | Actor | State machine/business rule | UX screen/flow | API/data | Implementation | Test IDs | Security/privacy review | Evidence | Release version | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-C-01 | First launch & language selection (Hindi/English) | C-01 | P0 | Customer | None | SCR-C-LANG | GET/PUT /api/v1/users/language | packages/localization, apps/android, apps/web | T-C-01 | Privacy pass (no marketing consent forced) | packages/localization/src/index.test.ts | MVP | `VERIFIED` |
| REQ-C-02 | Mobile OTP registration and login | C-02 | P0 | Customer/Provider | Account State: PENDING_PHONE_VERIFICATION -> ACTIVE, BR-ID-001/004 | SCR-AUTH-PHONE, SCR-AUTH-OTP | POST /api/v1/auth/otp/request, POST /api/v1/auth/otp/verify | services/api (IdentityService), apps/android | T-AUTH-01 | Anti-enumeration, rate-limiting | services/api/src/test/auth.test.ts | MVP | `VERIFIED` |
| REQ-C-03 | Customer profile & shared-phone privacy | C-03 | P0 | Customer | Account State: ACTIVE | SCR-C-PROFILE | GET/PUT /api/v1/users/me | services/api (CustomerService), apps/android | T-C-03 | Shared-device privacy, masked notifications | services/api/src/test/customer.test.ts | MVP | `VERIFIED` |
| REQ-C-04 | Category discovery and problem search | C-04 | P0 | Customer | BR-SC-001/004 | SCR-C-HOME, SCR-C-SEARCH | GET /api/v1/categories, GET /api/v1/services/search | Pending M5/Slice 3 | T-C-04 | Only genuine active services displayed | Pending | MVP | `NOT_STARTED` |
| REQ-C-05 | Problem description & media attachment | C-05 | P1 | Customer | BR-SC-002 | SCR-C-REQ-DETAILS | POST /api/v1/uploads/presigned, POST /api/v1/requests | Pending M5/Slice 3 | T-C-05 | Presigned upload validation, EXIF stripping | Pending | MVP | `NOT_STARTED` |
| REQ-C-06 | Schedule preference & locality selection | C-06 | P0 | Customer | BR-LC-001 | SCR-C-REQ-LOC | POST /api/v1/requests | Pending M5/Slice 3 | T-C-06 | Locality/PIN precision; no raw GPS leak | Pending | MVP | `NOT_STARTED` |
| REQ-C-07 | Targeted provider request | C-07 | P0 | Customer | Request State: DRAFT -> SUBMITTED | SCR-C-PROVIDER-DETAIL | POST /api/v1/requests/targeted | Pending M5/Slice 3 | T-C-07 | Target provider eligibility check | Pending | MVP | `NOT_STARTED` |
| REQ-C-08 | Broadcast / matching request | C-08 | P0 | Customer | Request State: MATCHING | SCR-C-REQ-CONFIRM | POST /api/v1/requests/match | Pending M5/Slice 3 | T-C-08 | Controlled lead batching, radius filtering | Pending | MVP | `NOT_STARTED` |
| REQ-C-09 | Quote review and comparison | C-09 | P0 | Customer | Quote State: RECEIVED -> VIEWED | SCR-C-QUOTES | GET /api/v1/requests/{id}/quotes | Pending M6/Slice 4 | T-C-09 | Immutability of dispatched quotes | Pending | MVP | `NOT_STARTED` |
| REQ-C-10 | Quote acceptance and booking | C-10 | P0 | Customer | Quote: ACCEPTED, Booking: CONFIRMED | SCR-C-BOOKING | POST /api/v1/quotes/{id}/accept | Pending M6/Slice 4 | T-C-10 | Atomic acceptance, contact consent recorded | Pending | MVP | `NOT_STARTED` |
| REQ-C-11 | Job progress tracking | C-11 | P0 | Customer | Job State: EN_ROUTE -> IN_PROGRESS | SCR-C-JOB-STATUS | GET /api/v1/bookings/{id}/status | Pending M7/Slice 5 | T-C-11 | Server-enforced valid transitions | Pending | MVP | `NOT_STARTED` |
| REQ-C-12 | Completion and payment record | C-12 | P0 | Customer | Job: COMPLETED, Payment: DECLARED/CONFIRMED | SCR-C-PAYMENT | POST /api/v1/bookings/{id}/pay | Pending M7/Slice 5 | T-C-12 | Separate cash/UPI declaration vs PSP | Pending | MVP | `NOT_STARTED` |
| REQ-C-13 | Verified rating and review | C-13 | P0 | Customer | Review State: SUBMITTED -> PUBLISHED | SCR-C-REVIEW | POST /api/v1/bookings/{id}/reviews | Pending M8/Slice 6 | T-C-13 | Eligible booking check, anti-fraud review | Pending | MVP | `NOT_STARTED` |
| REQ-C-14 | Support, cancellation, and dispute | C-14 | P0 | Customer | Booking: CANCELLED / DISPUTED | SCR-C-DISPUTE | POST /api/v1/bookings/{id}/dispute | Pending M8/Slice 6 | T-C-14 | Audit preservation, emergency disclaimer | Pending | MVP | `NOT_STARTED` |
| REQ-P-01 | Provider registration & role activation | P-01 | P0 | Provider | Account State: ACTIVE, Provider: DRAFT | SCR-P-ONBOARD | POST /api/v1/providers/profile | services/api (ProviderService), apps/android | T-P-01 | Self-dealing exclusion, role switch guard | services/api/src/test/role-switch.test.ts, services/api/src/test/self-dealing.test.ts | MVP | `VERIFIED` |
| REQ-P-02 | Service area and coverage radius | P-02 | P0 | Provider | Provider: DRAFT -> SUBMITTED | SCR-P-AREAS | PUT /api/v1/providers/coverage | Pending M4/Slice 2 | T-P-02 | Verified pilot boundary adherence | Pending | MVP | `NOT_STARTED` |
| REQ-P-03 | Pricing & standard estimates | P-03 | P1 | Provider | Provider: DRAFT | SCR-P-RATES | PUT /api/v1/providers/services | Pending M4/Slice 2 | T-P-03 | Transparent pricing guidelines | Pending | MVP | `NOT_STARTED` |
| REQ-P-04 | Availability & work hours | P-04 | P0 | Provider | Provider: ACTIVE / PAUSED | SCR-P-AVAILABILITY | PUT /api/v1/providers/availability | Pending M4/Slice 2 | T-P-04 | Immediate discovery update | Pending | MVP | `NOT_STARTED` |
| REQ-P-05 | Business profile & trade experience | P-05 | P1 | Provider | Provider: DRAFT | SCR-P-PROFILE | PUT /api/v1/providers/profile | Pending M4/Slice 2 | T-P-05 | Minimization of unnecessary personal data | Pending | MVP | `NOT_STARTED` |
| REQ-P-06 | Verification evidence submission | P-06 | P0 | Provider | Provider: SUBMITTED -> IN_REVIEW | SCR-P-VERIFY | POST /api/v1/providers/verification | Pending M4/Slice 2 | T-P-06 | Presigned document upload, no Aadhaar force | Pending | MVP | `NOT_STARTED` |
| REQ-P-07 | Lead inbox and request review | P-07 | P0 | Provider | Request: LEAD_DISPATCHED | SCR-P-INBOX | GET /api/v1/providers/leads | Pending M6/Slice 4 | T-P-07 | Address masked to neighbourhood | Pending | MVP | `NOT_STARTED` |
| REQ-P-08 | Quote preparation and dispatch | P-08 | P0 | Provider | Quote: DRAFT -> DISPATCHED | SCR-P-SEND-QUOTE | POST /api/v1/leads/{id}/quote | Pending M6/Slice 4 | T-P-08 | Itemized cost validation, expiration timestamp | Pending | MVP | `NOT_STARTED` |
| REQ-P-09 | Booking acceptance & arrival | P-09 | P0 | Provider | Job: EN_ROUTE -> ARRIVED | SCR-P-JOB-ACTIVE | POST /api/v1/bookings/{id}/arrive | Pending M7/Slice 5 | T-P-09 | Exact address revealed only upon acceptance | Pending | MVP | `NOT_STARTED` |
| REQ-P-10 | On-site start & change orders | P-10 | P0 | Provider | Job: IN_PROGRESS, ChangeOrder: PENDING | SCR-P-JOB-PROGRESS | POST /api/v1/bookings/{id}/change-order | Pending M7/Slice 5 | T-P-10 | Customer approval required for price delta | Pending | MVP | `NOT_STARTED` |
| REQ-P-11 | Payment collection & declaration | P-11 | P0 | Provider | Payment: PROVIDER_CONFIRMED | SCR-P-COLLECT-PAY | POST /api/v1/bookings/{id}/confirm-payment | Pending M7/Slice 5 | T-P-11 | Cash receipt declaration & UPI QR reference | Pending | MVP | `NOT_STARTED` |
| REQ-P-12 | Review response & reputation | P-12 | P1 | Provider | Review: RESPONDED | SCR-P-REVIEWS | POST /api/v1/reviews/{id}/respond | Pending M8/Slice 6 | T-P-12 | Moderated response policy | Pending | MVP | `NOT_STARTED` |
| REQ-P-13 | Work history & earnings summary | P-13 | P1 | Provider | None | SCR-P-EARNINGS | GET /api/v1/providers/earnings | Pending M8/Slice 6 | T-P-13 | Aggregated earnings; no banking credentials | Pending | MVP | `NOT_STARTED` |
| REQ-A-01 | Admin provider verification queue | A-01 | P0 | Verification Agent | Provider: APPROVED / REJECTED | SCR-ADM-VERIFY | POST /api/v1/admin/providers/{id}/verify | Pending M9/Slice 7 | T-A-01 | Dual-control check, granular trust badges | Pending | MVP | `NOT_STARTED` |
| REQ-A-02 | Catalogue & category management | A-02 | P0 | Content Operator | BR-SC-001/002 | SCR-ADM-CATALOG | POST/PUT /api/v1/admin/categories | Pending M9/Slice 7 | T-A-02 | Versioned category and questions config | Pending | MVP | `NOT_STARTED` |
| REQ-A-03 | Coverage & pilot location control | A-03 | P0 | Ops Lead | BR-LC-001 | SCR-ADM-COVERAGE | POST/PUT /api/v1/admin/coverage | Pending M9/Slice 7 | T-A-03 | Bounded boundary updates | Pending | MVP | `NOT_STARTED` |
| REQ-A-04 | Dispute & safety operations | A-05/06 | P0 | T&S / Support | Booking: RESOLVED, Account: RESTRICTED | SCR-ADM-DISPUTES | POST /api/v1/admin/disputes/{id}/resolve | Pending M9/Slice 7 | T-A-04 | Human review requirement, full audit trail | Pending | MVP | `NOT_STARTED` |
| REQ-A-05 | Admin MFA and RBAC | Admin Core | P0 | Privileged Admin | BR-ID-006 | SCR-ADM-LOGIN | POST /api/v1/auth/admin/login | services/api (IdentityService), apps/admin | T-A-05 | Mandatory TOTP MFA, no shared accounts | services/api/src/test/admin-mfa.test.ts, apps/admin/src/index.test.ts | MVP | `VERIFIED` |
| REQ-S-01 | Server-enforced idempotency | Core Infra | P0 | System | BR-ID-005, Contract §1 | Middleware | Idempotency-Key Header | services/api (app.ts) | T-S-01 | Duplicate payload vs replay test | services/api/src/test/idempotency.test.ts | MVP | `VERIFIED` |
| REQ-S-02 | Anti-enumeration & OTP security | Core Infra | P0 | System | BR-ID-004 | Auth Service | Timed constant-response envelope | services/api (IdentityService) | T-S-02 | Constant timing envelope, rate-limit test | services/api/src/test/auth.test.ts | MVP | `VERIFIED` |


## Status Rules

- NOT_STARTED: no implementation.
- IN_PROGRESS: active work.
- IMPLEMENTED_NOT_VERIFIED: code exists but independent evidence is incomplete.
- FAILED_VERIFICATION: test/review failed.
- VERIFIED: implementation and evidence satisfy requirement.
- BLOCKED: cannot proceed due to external dependency/decision.
- WAITING_FOR_OWNER_APPROVAL: action prepared but approval required.
- DEFERRED: intentionally outside current release with rationale.

A requirement may be VERIFIED only when implementation, tests, evidence, and independent review are linked.
