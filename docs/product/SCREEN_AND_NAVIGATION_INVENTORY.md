# KaamSaathi Screen and Navigation Inventory

## 1. Android Navigation Model

Use one role-aware Android app with separate customer/provider navigation graphs under a shared authenticated shell. Role switching must not change server permissions; it changes available navigation only.

### Global destinations

| ID | Screen | Key actions | Required states |
|---|---|---|---|
| G-01 | Splash/startup | Load language/session/config, route safely | loading, offline cached, config failure, forced upgrade if approved |
| G-02 | Language | Select Hindi/English | default, selected, persistence error |
| G-03 | Welcome/how it works | Continue, help, trust explanation | online/offline content |
| G-04 | Mobile number | Request OTP | validation, sending, throttled, provider outage |
| G-05 | OTP verification | Verify/resend/change number | timer, invalid, expired, offline, success |
| G-06 | Role chooser/switcher | Customer mode, provider mode | provider not activated, onboarding pending, eligible, restricted |
| G-07 | Notifications centre | Open transaction alerts | empty, unread, failed deep link |
| G-08 | Help and support | Search help, contact, grievance | offline help, channel unavailable |
| G-09 | Settings | Language, notifications, privacy, sessions, logout | save pending/error/success |
| G-10 | Privacy/account | Export, correction, deletion, consents | re-auth, active transaction, request status |
| G-11 | Session security | List/revoke devices | current/other session, suspicious activity |

## 2. Customer Screens

| ID | Screen | Key content/actions | Critical rules |
|---|---|---|---|
| C-S01 | Customer home | Locality, categories, search, active requests/bookings | Genuine supported categories only |
| C-S02 | Location selector | PIN/locality/current location | Coarse first; contextual GPS |
| C-S03 | Category/problem search | Aliases, problem phrases | Confirm mapped category |
| C-S04 | Category detail | Scope, indicative guidance, browse/request | No emergency guarantee |
| C-S05 | Provider list | Filters, transparent sorting, cards | No phone/address; eligible providers only |
| C-S06 | Provider profile | Skills, badges, reviews, request/save | Badge meaning/limitations |
| C-S07 | Request form | Issue, time, address, description | Progressive form/draft |
| C-S08 | Attachment capture | Camera/gallery, compression | Contextual permission/private upload |
| C-S09 | Request review | Summary, privacy, fees/policies | Explicit confirmation/idempotency |
| C-S10 | Matching status | Batches/progress/alternatives | No false ETA/guarantee |
| C-S11 | Quote list | Compare current quotes | Version/current/expired labels |
| C-S12 | Quote detail | Itemization, scope, time, validity | No hidden charges |
| C-S13 | Booking confirmation | Accepted quote, provider, schedule | Contact/address threshold |
| C-S14 | Booking detail | Timeline, actions, contact, help | State-driven controls only |
| C-S15 | Reschedule proposal | New slot/reason | Original remains until accepted |
| C-S16 | Cancel booking | Reason/consequence | No unapproved automatic fee |
| C-S17 | Provider en route/arrival | Status, safety/help | No continuous tracking claim |
| C-S18 | Start confirmation | Review scope, tap/PIN | Rate-limited, server validated |
| C-S19 | Change order | Original vs delta, accept/reject | Current immutable version |
| C-S20 | Completion/final bill | Work summary, amount, confirm/dispute | Approved amount ceiling |
| C-S21 | Payment record | Cash/UPI/PSP status, receipt | Intent not success |
| C-S22 | Rating/review | Dimensions, comment, report rules | Eligible completed job only |
| C-S23 | Complaint/report | Category, urgency, evidence | Immediate-danger guidance first |
| C-S24 | Complaint status | Timeline, requests, outcome/appeal | Restricted evidence |
| C-S25 | Saved providers | List, remove, repeat | Revalidate eligibility |
| C-S26 | Request/booking history | Filters/details/receipts | Pagination and privacy |
| C-S27 | Repeat request | Prefilled safe fields | No reused price/date/consent |

## 3. Provider Screens

| ID | Screen | Key content/actions | Critical rules |
|---|---|---|---|
| P-S01 | Provider introduction | Model, verification, fees, no income guarantee | Explicit consent |
| P-S02 | Profile basics | Name/photo/languages/experience | Draft; not public yet |
| P-S03 | Service selection | Categories/subskills | Configured categories only |
| P-S04 | Service area | Localities/PIN/radius | No public home address |
| P-S05 | Availability | Now/schedule/exceptions/pause | Expiry/current status |
| P-S06 | Price guidance | Visit fee/rates | Indicative/disclosed |
| P-S07 | Work samples | Add/remove/reorder | Private upload + display consent |
| P-S08 | Verification routes | Options/purpose/alternatives | No compulsory Aadhaar |
| P-S09 | Evidence upload/reference | Submit evidence | Private/signed/validated |
| P-S10 | Verification status | Pending/info/rejected/approved/appeal | Reason and badge meaning |
| P-S11 | Provider dashboard | Eligibility, leads, jobs, earnings summary | Clear restrictions/status |
| P-S12 | Lead inbox | New/expiring/history | Coarse customer location only |
| P-S13 | Lead detail | Issue/time/images, accept/decline | No exact address/phone |
| P-S14 | Quote editor | Itemization/scope/validity/schedule | Versioned; required fields |
| P-S15 | Quote status | Active/revision/selected/not selected | Accepted immutable |
| P-S16 | Provider booking detail | Address/contact after authorization, timeline | State-driven actions |
| P-S17 | En route/arrival | Update states | Time window; no tracking |
| P-S18 | Start code entry | Enter/confirm | No plaintext logging |
| P-S19 | Change-order editor | Scope and amount delta | Customer acceptance required |
| P-S20 | Completion/final bill | Summary/evidence/amount | Ceiling validation |
| P-S21 | Payment/earnings record | Declarations/status/history | Not a bank statement |
| P-S22 | Reviews | Summary, responses, report | No retaliation/PII |
| P-S23 | Complaint response | Notice, evidence, appeal | Privacy-appropriate allegation |
| P-S24 | Pause/deactivate/delete | Availability/account state | Active-job handling |

## 4. Admin Portal Screens

| ID | Screen | Role | Key capabilities |
|---|---|---|---|
| A-S01 | Admin login/MFA | All admins | Secure auth/session |
| A-S02 | Operations dashboard | Role-scoped | Queue/marketplace/technical metrics |
| A-S03 | Verification queue | Verification | Claim/filter/review cases |
| A-S04 | Verification case | Verification | Evidence, reason, approve/reject/info/appeal |
| A-S05 | User/provider search | Support/T&S | Masked overview, case-scoped reveal |
| A-S06 | Provider moderation | T&S/Admin | Warn/restrict/suspend/reinstate/appeal |
| A-S07 | Complaint queue | Support/T&S | Severity/aging/owner |
| A-S08 | Complaint case | Support/T&S | Evidence, actions, resolution, appeal |
| A-S09 | Fraud signals | T&S/Security | Review clusters/signals/actions |
| A-S10 | Review moderation | Content/T&S | Hold/remove/restore/appeal |
| A-S11 | Category configuration | Content/Admin | Forms, quote schema, verification requirements |
| A-S12 | Coverage management | Ops/Admin | Locations/categories/radius/batches |
| A-S13 | Content/FAQ | Content | Hindi/English versioned publishing |
| A-S14 | Feature flags | Privileged | Target/expiry/metrics/rollback |
| A-S15 | Privacy requests | Privacy role | Verify/process/retention/evidence |
| A-S16 | Audit explorer | Privileged | Search safe audit events |
| A-S17 | Notifications/templates | Ops/Admin | Version/localization/fallback |
| A-S18 | Analytics/exports | Analyst/Admin | Aggregated/pseudonymized only |

## 5. Public Website Pages

- Home.
- How KaamSaathi works.
- Supported services.
- Service category page.
- Genuine service-by-location page.
- Supported locations.
- Provider registration.
- Safety and verification.
- Pricing/estimate guidance.
- Help and FAQ.
- Contact and grievance.
- Privacy notice.
- Terms/provider terms placeholders or approved versions.
- Account deletion instructions.
- App download/deep link.
- Consented public provider profile where approved.

## 6. Universal Screen-State Checklist

Every applicable screen must specify and test:

- Initial loading/skeleton.
- Empty state with next action.
- Offline cached state and last-updated time.
- Pending-sync state.
- Permission denied and manual fallback.
- Validation error.
- Authentication/step-up required.
- Authorization denied.
- Retryable dependency/server error.
- Permanent/unsupported state.
- Stale version/state conflict.
- Duplicate action/idempotent result.
- Success and next action.
- Large-font layout.
- Hindi long-text layout.
- Screen-reader semantics.
- Back/cancel behavior.
