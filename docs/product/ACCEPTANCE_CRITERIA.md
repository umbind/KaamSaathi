# KaamSaathi MVP Acceptance Criteria

These criteria are minimum release-critical behavior. Teams must add feature-specific criteria during implementation.

## A. Authentication, Account, and Roles

### AC-AUTH-001 OTP anti-enumeration

**Given** a phone number that may or may not have an account, **when** OTP is requested, **then** the client receives the same class of safe response and does not learn account existence.

### AC-AUTH-002 OTP throttling

**Given** repeated send or verify attempts, **when** configured limits are exceeded, **then** further attempts are delayed/blocked, a safe retry time is shown, and an abuse event is recorded without logging OTP values.

### AC-AUTH-003 Idempotent account creation

**Given** OTP verification is retried after a timeout, **when** the original verification already succeeded, **then** no duplicate user is created and the valid session/account is returned or safely resumed.

### AC-AUTH-004 Role isolation

**Given** a customer who has not activated provider role, **when** provider APIs are called, **then** access is denied server-side even if the client UI is manipulated.

### AC-AUTH-005 Admin MFA

**Given** a privileged admin account, **when** the user signs in without completed MFA, **then** no privileged data/action is available.

### AC-AUTH-006 Session revocation

**Given** a user revokes a session or an account-takeover response occurs, **when** the revoked token is used, **then** protected calls fail and the event is audited.

## B. Language, Accessibility, and Shared Device

### AC-UX-001 Language switch

**Given** an authenticated user with active transactions, **when** language changes between Hindi and English, **then** navigation, statuses, forms, and active-transaction labels change without data loss or account recreation.

### AC-UX-002 Large text and screen reader

**Given** maximum supported font scaling and a screen reader, **when** core customer/provider flows are used, **then** critical content remains readable/navigable, actions have semantic labels, and no information is conveyed only by colour.

### AC-UX-003 Shared-device notification privacy

**Given** masked notification preference, **when** a booking/complaint notification arrives, **then** lock-screen content excludes exact address, phone number, payment reference, and complaint details.

### AC-UX-004 Back navigation and draft

**Given** a partially completed request/onboarding form, **when** the user navigates back or the process dies, **then** a recoverable draft remains and no request/profile is submitted without confirmation.

## C. Location and Discovery

### AC-LOC-001 Coarse location first

**Given** a new user, **when** selecting a service area, **then** locality/PIN selection works without precise GPS permission.

### AC-LOC-002 Unsupported coverage

**Given** a locality/category not served, **when** the user attempts a request, **then** the system does not create an apparently bookable request and offers safe alternatives/interest registration.

### AC-LOC-003 Address privacy

**Given** an unselected provider, **when** viewing a lead, **then** the provider sees only approved coarse location and not exact service address.

### AC-DIS-001 Provider eligibility

**Given** an inactive, restricted, unapproved-category, or out-of-area provider, **when** discovery/matching runs, **then** the provider is excluded server-side.

### AC-DIS-002 Badge explanation

**Given** a displayed verification badge, **when** the user opens its explanation, **then** the exact checked signal and limitations are shown.

## D. Request and Matching

### AC-REQ-001 Request validation

**Given** valid category, coverage, address, schedule, and description, **when** the customer confirms, **then** exactly one request is created with a unique reference and authoritative status.

### AC-REQ-002 Duplicate retry

**Given** a network timeout after submission, **when** the client retries with the same idempotency key and payload, **then** it receives the original request and no duplicate lead notifications occur.

### AC-REQ-003 Interrupted attachment

**Given** an image upload interruption, **when** connectivity returns, **then** upload resumes/retries safely, invalid partial data is not published, and the request draft remains usable.

### AC-MAT-001 Controlled batches

**Given** more eligible providers than the configured batch size, **when** matching starts, **then** only the first batch is notified and later batches are triggered by policy, not all at once.

### AC-MAT-002 No match

**Given** no eligible provider after configured attempts, **when** matching finishes, **then** request becomes `NO_MATCH`, customer receives clear alternatives, and no false “provider found” state appears.

## E. Provider Onboarding and Verification

### AC-PRO-001 Progressive save

**Given** a provider completes only part of onboarding, **when** exiting and returning, **then** the draft resumes without making the provider publicly discoverable.

### AC-PRO-002 Verification privacy

**Given** provider verification evidence, **when** ordinary customer/support/analyst roles access the profile, **then** raw evidence is not available.

### AC-PRO-003 Alternative route

**Given** a provider cannot use the standard formal-document route, **when** an approved alternative route exists, **then** the provider can submit that route and the resulting badge accurately describes it.

### AC-PRO-004 Rejection and appeal

**Given** a rejected verification case, **when** the provider views it, **then** a public-safe reason, correction/resubmission instructions, and appeal option are available.

### AC-PRO-005 Eligibility recomputation

**Given** verification expires or a category is disabled, **when** eligibility is recalculated, **then** new leads stop and active bookings remain handled according to policy.

## F. Quotes and Booking

### AC-QUO-001 Required quote fields

**Given** a provider submits a quote, **when** required breakdown, validity, schedule, and scope fields are incomplete, **then** submission is rejected with field-specific guidance.

### AC-QUO-002 Immutable versions

**Given** an active quote, **when** the provider revises it, **then** a new version is created and prior version remains read-only/auditable.

### AC-QUO-003 Atomic selection

**Given** two customers/devices attempt to accept two different quotes for the same request concurrently, **when** both reach the server, **then** exactly one quote becomes accepted, one booking is created, and the other receives a state-conflict response.

### AC-QUO-004 Expired quote

**Given** a quote past valid-until, **when** acceptance is attempted, **then** no booking is created and the customer is asked to obtain a new quote.

### AC-BKG-001 Authorized contact reveal

**Given** a booking has not been confirmed, **when** either party inspects the other profile/lead, **then** private phone/address remains hidden; after authorized confirmation, only necessary details are revealed.

### AC-BKG-002 Reschedule agreement

**Given** one party proposes a new slot, **when** the other declines or proposal expires, **then** original schedule remains authoritative.

### AC-BKG-003 Cancellation audit

**Given** an eligible cancellation, **when** performed, **then** reason, actor, timestamp, affected quote/booking, notifications, and rematch option are recorded.

## G. Job Lifecycle and Change Orders

### AC-JOB-001 Start confirmation

**Given** a provider has arrived, **when** the provider attempts to start, **then** job enters `IN_PROGRESS` only after valid customer confirmation/start code or authorized support override.

### AC-JOB-002 Invalid state skip

**Given** a scheduled booking, **when** a modified client calls completion directly, **then** server rejects the transition and preserves state.

### AC-JOB-003 Change-order approval

**Given** additional work/cost is discovered, **when** provider submits a change order, **then** approved amount changes only after customer accepts the current version.

### AC-JOB-004 Rejected change order

**Given** a customer rejects a change order, **when** provider later submits completion, **then** final amount cannot include the rejected delta.

### AC-JOB-005 Final bill validation

**Given** accepted quote and change orders total ₹X, **when** provider submits an unexplained higher final amount, **then** completion submission is blocked or requires explicit corrected-bill confirmation under policy.

### AC-JOB-006 Provider cannot self-confirm satisfaction

**Given** provider submits completion, **when** customer has not responded, **then** the booking remains pending or later becomes clearly labeled `COMPLETED_UNCONFIRMED`; it does not become customer-confirmed.

### AC-JOB-007 Completion dispute race

**Given** completion confirmation and dispute requests arrive concurrently, **when** processed, **then** deterministic version/state rules prevent contradictory terminal results and preserve both attempts/audit.

## H. Payments

### AC-PAY-001 UPI intent is not success

**Given** a UPI app opens and returns to KaamSaathi, **when** no verified PSP callback exists, **then** payment is not marked `PSP_CONFIRMED`.

### AC-PAY-002 Cash reconciliation

**Given** customer marks cash paid and provider marks received for the same amount, **when** both declarations are valid, **then** payment becomes party-confirmed and a clearly labeled receipt is available.

### AC-PAY-003 Payment mismatch

**Given** party declarations differ in amount/status, **when** reconciliation runs, **then** payment becomes disputed, original declarations are preserved, and support case/route is available.

### AC-PAY-004 Duplicate webhook

**Given** the same verified PSP event is delivered repeatedly, **when** processed, **then** payment state/effects occur once.

### AC-PAY-005 Secret protection

**Given** all payment screens/APIs/logs, **when** tested, **then** UPI PIN, card credentials, bank login, or full secrets are never collected/stored/logged.

## I. Reviews

### AC-REV-001 Transaction eligibility

**Given** a user without an eligible completed booking, **when** review submission is attempted, **then** server rejects it.

### AC-REV-002 Duplicate review

**Given** an existing review by the same party for the same booking, **when** another is submitted, **then** no second independent review is created; permitted edit flow versions the review.

### AC-REV-003 Legitimate criticism

**Given** a negative review that is relevant and policy-compliant, **when** provider reports it solely for being negative, **then** it is not removed.

### AC-REV-004 PII moderation

**Given** a review containing phone/address or threatening content, **when** submitted, **then** it is held/rejected/redacted according to policy and original evidence is retained securely.

## J. Complaints, Safety, and Moderation

### AC-CMP-001 Immediate acknowledgment

**Given** a complaint submission, **when** accepted, **then** a reference and current status are returned immediately without waiting for human review.

### AC-CMP-002 Immediate danger

**Given** user indicates immediate danger, **when** report is created, **then** emergency guidance and non-emergency-service disclaimer are shown before optional detailed evidence collection.

### AC-CMP-003 Restricted evidence

**Given** one party uploads complaint evidence, **when** the other party or unauthorized staff accesses the case, **then** restricted evidence is not exposed.

### AC-CMP-004 Interim restriction review

**Given** a temporary safety restriction, **when** applied, **then** reason, authority, review deadline, affected capabilities, notice where safe, and appeal/review route are recorded.

### AC-CMP-005 Appeal independence

**Given** a high-impact final decision is appealed, **when** policy supports independent review, **then** the appeal is assigned to an eligible reviewer other than the sole original decision-maker.

## K. Admin, Audit, and Privacy

### AC-ADM-001 Server authorization

**Given** an admin UI control is hidden for a role, **when** that role calls the underlying API directly, **then** the server denies it.

### AC-ADM-002 Reasoned privileged action

**Given** suspension, verification rejection, evidence reveal, bulk export, or feature-flag change, **when** performed, **then** structured reason and audit record are mandatory.

### AC-AUD-001 Audit integrity

**Given** a critical state/admin action, **when** it succeeds or fails, **then** an audit event records actor/action/object/outcome/correlation without secrets or full sensitive payloads.

### AC-PRI-001 Data export

**Given** a verified export request, **when** processed, **then** the user receives their eligible data without another party's restricted data, internal fraud methods, secrets, or protected evidence.

### AC-PRI-002 Account deletion

**Given** a deletion request, **when** active transactions or legal retention apply, **then** the account is deactivated where appropriate, processing status/reason is communicated, and eventual deletion/anonymization or limited retention is evidenced.

### AC-PRI-003 Consent withdrawal

**Given** optional analytics/marketing/WhatsApp consent, **when** withdrawn, **then** future optional processing stops without corrupting historical transaction/audit records.

## L. Offline, Reliability, and Performance

### AC-REL-001 Pending sync clarity

**Given** no network, **when** user submits a retryable action, **then** UI shows `Pending sync` rather than success and later reconciles with server.

### AC-REL-002 Conflict reconciliation

**Given** server state changed while device was offline, **when** queued action syncs, **then** server rejects incompatible change, UI explains conflict, and no data is silently overwritten.

### AC-REL-003 Active transaction cache

**Given** temporary offline mode, **when** user opens an active booking/request previously synchronized, **then** safe cached details and last-updated time are available.

### AC-REL-004 Low-memory/process death

**Given** Android process death during draft/active workflow, **when** app restarts and user resumes, **then** durable draft/server state restores without duplicate submission.

### AC-REL-005 Notification independence

**Given** notification delivery fails, **when** a booking/quote state changes, **then** authoritative state remains correct and visible on refresh; retry/fallback follows policy.
