# KaamSaathi Functional Workflow Specification

## 1. Purpose

This document defines the functional behavior that must exist across the Android app, public website, admin portal, backend, support operations, notifications, and analytics. It is implementation-agnostic but testable.

Every workflow must map to:

- Requirement ID.
- Actor and authorization.
- Trigger and preconditions.
- Screen/API entry point.
- State transitions.
- Data written.
- Notifications and audit events.
- Analytics event.
- Failure and recovery behavior.
- Acceptance criteria.

## 2. Actors

### 2.1 Customer

A registered user requesting or booking a service for self, household, family member, landlord/tenant, or another person with permission.

### 2.2 Provider

A registered user offering one or more approved services within configured areas and availability. A provider may also use customer mode.

### 2.3 Assisted Operator

A trained support or field-operations user who helps a customer or provider complete a workflow. The operator must never ask for or retain the user's OTP. Every assisted action must record the operator, purpose, user consent, and fields changed.

### 2.4 Verification Agent

Reviews provider evidence according to policy but cannot change marketplace configuration or resolve unrelated disputes.

### 2.5 Support Agent

Handles general requests, booking issues, no-shows, payment-reference mismatches, and ordinary complaints with masked access.

### 2.6 Trust and Safety Agent

Handles harassment, threats, impersonation, malicious providers/customers, serious property damage allegations, account takeover, and urgent safety escalations.

### 2.7 Content and Marketplace Operator

Manages categories, service questions, coverage, FAQ, help content, and non-sensitive operational configuration.

### 2.8 Analyst

Reads aggregated or appropriately pseudonymized metrics. No unrestricted PII access.

### 2.9 Privileged Administrator

Performs narrowly defined high-risk administration with MFA, reason entry, and audit. No shared admin accounts.

## 3. Shared Interaction Rules

1. Every critical action has text plus an icon, a confirmation state, and a safe back/cancel path.
2. Forms preserve drafts locally and, after authentication, may preserve server drafts.
3. Retryable mutations use an idempotency key and display the authoritative server result after reconnection.
4. The UI must distinguish loading, empty, offline, permission denied, validation error, temporary server failure, permanent failure, and success.
5. The app must not request contact, location, camera, files, or notification permission before the related user action.
6. Shared-device users receive a visible logout, optional app PIN, masked notifications, and no sensitive content on the lock screen by default.
7. Hindi and English are switchable without account recreation.
8. Exact address, phone number, and private attachments are shown only to authorized transaction participants and staff with a documented need.
9. No workflow may rely solely on color to communicate status.
10. Every user-visible price distinguishes indicative range, provider estimate, accepted estimate, approved change, final amount, platform fee, and payment status.

---

# 4. Customer Workflows

## C-01 First Launch and Language Selection

**Trigger:** First app launch or cleared app data.

**Preconditions:** None.

**Happy path:**

1. Display product name, short purpose, and language choices without requiring login.
2. User selects Hindi or English.
3. Persist language locally.
4. Show concise privacy/trust notice and actions: `Continue`, `How it works`, `Help`.
5. Continue to authentication or limited browse mode, depending on approved design.

**Rules:**

- Do not request permissions on first launch.
- Do not force marketing consent.
- Language can be changed later.

**Failure/recovery:** If local persistence fails, retain choice for the session and show a non-blocking error.

**Events:** `language_selected`, `first_launch_completed`.

## C-02 Mobile OTP Registration and Login

**Trigger:** User chooses login/register or attempts an authenticated action.

**Happy path:**

1. User enters Indian mobile number.
2. Client validates basic format; server normalizes and rate-checks.
3. Server returns a generic response regardless of registration status.
4. OTP is sent through the configured provider.
5. User enters OTP; auto-read may be used only with platform-compliant APIs and user permission.
6. Server validates OTP, device/app integrity signals where configured, attempt count, expiry, and replay.
7. Create or resume user account and session.
8. New user accepts mandatory current terms/privacy acknowledgement only when approved documents exist; in non-production use clearly marked placeholders.
9. Return the next required onboarding step.

**Alternate paths:**

- Resend after cooldown.
- Voice OTP only if supported and approved.
- Existing session refresh.
- Phone-number change requires re-authentication and additional safeguards.

**Failure/recovery:** Invalid/expired OTP, throttling, provider outage, offline state, SIM/device change, suspicious attempt, duplicate tap. Never reveal account existence.

**Events:** `otp_requested`, `otp_verified`, `otp_failed`, `login_succeeded`, `login_blocked_risk`.

## C-03 Customer Profile and Shared-Device Privacy

**Happy path:**

1. Ask only for display name or preferred name.
2. Optional: email, age band, communication preference, accessibility needs.
3. Offer app PIN/biometric device unlock as an optional local convenience, not identity verification.
4. Offer masked notification setting.
5. Save profile and consent records.

**Rules:**

- Do not require gender, date of birth, or government ID for ordinary customer use.
- Do not expose profile to providers beyond transaction-relevant fields.

## C-04 Location Selection

**Entry options:**

- Search locality/PIN code.
- Select from supported coverage.
- Use current location contextually.
- Enter an address during request creation.

**Happy path:**

1. Ask for locality/PIN code before precise GPS.
2. Validate whether service coverage exists.
3. Store a coarse home locality optionally.
4. During request creation, collect service address with landmark/instructions.
5. Exact address remains hidden until a provider is selected/booking is confirmed.

**Failure paths:** Location permission denied, geocoder unavailable, unsupported locality, ambiguous address, offline lookup.

**Fallback:** Manual locality selection and assisted support.

**Events:** `location_selected`, `coverage_unavailable`, `precise_location_consented`.

## C-05 Home, Category Browse, and Search

**Happy path:**

1. Show supported categories for the selected location.
2. Support Hindi/English names, aliases, transliteration, and common problem phrases.
3. User selects a category or searches a problem such as “fan not working.”
4. Display relevant service type, indicative scope guidance, safety note, and two choices:
   - Browse providers.
   - Request matching.

**Rules:**

- Do not show unsupported categories as bookable.
- Search results must not reveal private provider data.
- Urgent labels must not claim emergency-response capability.

## C-06 Provider List and Comparison

**Happy path:**

1. Apply hard eligibility filters: approved category, active status, supported service area, verification requirement, and marketplace eligibility.
2. Show provider cards with display name, safe photo/avatar, service categories, approximate distance/service area, availability indicator, verification signals, completed KaamSaathi jobs, rating summary when statistically meaningful, languages, and indicative visit fee if supplied.
3. Permit sorting/filtering only on transparent criteria.
4. Explain why a provider appears when practical.

**Rules:**

- No public phone number or exact provider home address.
- Paid promotion must be clearly labeled and may not override minimum safety/eligibility.
- Do not show an average rating without review count.

## C-07 Provider Profile

**Happy path:**

1. Show category-specific skills, experience description, work samples approved for display, service areas, languages, availability, price guidance, completed-job indicators, verification badge explanations, review summary, cancellation/reliability information when fair and policy-approved, and report action.
2. User chooses `Request this provider`, `Save`, or `Back`.

**Rules:**

- Every badge links to “what this means / does not mean.”
- Public web profile requires provider consent and privacy-safe fields.

## C-08 Create Service Request

**Entry:** Category, provider profile, saved provider, repeat booking, public web lead, or assisted operator.

**Required fields:**

- Service category and issue subtype.
- Short problem description; voice-to-text may assist.
- Service locality/address.
- Preferred date/time window.
- Contact preference.
- Confirmation that requester has permission to arrange service at the address.

**Optional fields:**

- Up to configured number/size of photos.
- Landmark/access instructions.
- Accessibility or language preference.
- Budget guidance as optional, never required.
- “For family member” contact notes without unnecessarily creating another account.

**Happy path:**

1. Save draft continuously.
2. Compress and validate attachments.
3. Show summary, address privacy explanation, indicative platform/visit fee policy, cancellation/no-show summary, and safety guidance.
4. User confirms submission.
5. Server creates request idempotently.
6. Targeted request goes to the selected eligible provider; matching request enters matching.
7. Show request status and expected next step without guaranteeing response time unless operationally supported.

**Failures:** Unsupported area, invalid category, provider no longer eligible, attachment upload interruption, duplicate submission, schedule in past, server timeout.

**Recovery:** Draft remains; server lookup by idempotency key determines whether a request already exists.

## C-09 Matching and Provider Response

**Happy path:**

1. Server finds eligible providers using hard filters.
2. Rank using approved non-discriminatory marketplace factors.
3. Notify a limited first batch.
4. Providers accept interest, decline, or let the lead expire.
5. If insufficient response, notify the next batch or offer assisted support.
6. Customer sees statuses such as `Finding providers`, `Providers reviewing`, `Estimate received`, `No provider found`.

**Rules:**

- Do not disclose exact customer address before provider selection.
- Do not spam every provider simultaneously.
- Provider decline reasons are internal/aggregated unless safe to show.

## C-10 Estimate/Quote Review

**Quote must show:**

- Provider identity and verification signals.
- Quote type: inspection required, indicative estimate, or fixed quote.
- Visit/inspection fee.
- Labour.
- Parts/materials estimate.
- Other disclosed charge/tax.
- Total or clearly explained range.
- Proposed time/date.
- Valid-until timestamp.
- Inclusions, exclusions, assumptions, warranty/rework statement when offered.
- Cancellation conditions.

**Happy path:**

1. Customer receives one or more quotes.
2. Customer compares using accessible cards.
3. Customer may ask provider to revise through a structured request/call hand-off, not public chat.
4. Customer accepts one current quote version.
5. Server locks accepted version, rejects/withdraws other active matches, and creates booking.

**Rules:**

- No hidden fee added after acceptance.
- Quote revisions create new immutable versions.
- Expired or withdrawn quotes cannot be accepted.

## C-11 Booking Confirmation and Contact Hand-off

**Happy path:**

1. Display booking ID, provider, accepted quote, date/time window, service address, contact method, cancellation/no-show policy, safety guidance, and help action.
2. Reveal contact through masked calling or consented normal call/WhatsApp hand-off.
3. Notify both parties.
4. Add booking to cached active jobs.

**Failure:** Provider becomes unavailable before confirmation. Server must not create an ambiguous booking; offer reselection or rematching.

## C-12 Reschedule and Cancellation

**Reschedule:**

1. Requesting party proposes new slot and reason.
2. Other party accepts or declines before expiry.
3. Accepted change creates a versioned schedule record and notifications.
4. Declined proposal leaves original schedule unless separately cancelled.

**Customer cancellation:**

- Allowed from eligible states.
- Require reason and clear consequence.
- MVP may record late cancellation but must not automatically charge an unapproved fee.

**Provider cancellation:**

- Require reason.
- Offer customer rematching/rebooking.
- Repeated patterns create a reviewable reliability signal, not automatic permanent suspension.

## C-13 Provider En Route and Arrival

**Happy path:**

1. Provider may mark `En route` only within a configurable time before the booking.
2. Customer receives a notification.
3. Provider marks `Arrived` at the location.
4. Customer confirms arrival, or provider requests start confirmation.

**Rules:**

- No continuous background route tracking in MVP.
- Arrival is not proof of service completion.

## C-14 Start Job

**Happy path:**

1. Customer reviews accepted scope and quote.
2. Customer confirms start through an in-app action or shares a short booking start code.
3. Server validates actor, booking state, code expiry/attempts, and accepted quote.
4. Booking becomes `IN_PROGRESS`; timestamp and audit event are stored.

**Fallback:** Assisted support may start the job only after both-party verification and reason logging.

**Failure:** Wrong/expired code, customer unavailable, provider at wrong address, quote mismatch. Do not allow the provider alone to silently start and bind the customer to new charges.

## C-15 Change Order During Work

**Trigger:** Additional defect/work/parts or price change discovered after job start.

**Happy path:**

1. Provider creates a change order with reason, added/removed scope, labour, parts, total delta, evidence/notes, and schedule impact.
2. Customer receives clear original vs changed amount.
3. Customer accepts or rejects.
4. Accepted change order becomes immutable and updates the approved ceiling/final estimate.
5. Rejected change leaves original approved scope; parties may cancel/dispute according to policy.

**Rules:**

- No verbal price change is considered platform-approved.
- Multiple change orders are versioned.
- Provider cannot mark work complete with an undisclosed higher amount.

## C-16 Completion and Final Bill

**Happy path:**

1. Provider submits completion request with work summary, final amount, quote/change-order references, optional completion photos, parts/warranty note, and payment method request.
2. Customer reviews final bill.
3. Customer chooses:
   - Confirm work completed.
   - Report issue/dispute.
   - Request correction to bill.
4. On confirmation, booking enters completed status and becomes review-eligible.
5. If customer does not respond, reminders are sent. After configured policy, the system may close as `COMPLETED_UNCONFIRMED` only if no complaint exists; the source of completion must remain visible internally and complaint window remains available.

**Rules:**

- System closure is not presented as explicit customer satisfaction.
- Final amount cannot exceed accepted quote plus accepted change orders unless customer separately confirms a corrected amount.

## C-17 Payment Record

**Cash path:**

1. Customer marks cash paid or provider marks cash received.
2. Other party is asked to confirm.
3. Matching confirmations create `PAYMENT_CONFIRMED_PARTIES`.
4. Mismatch creates `PAYMENT_DISPUTED` and support entry.

**External UPI intent path:**

1. Show provider/payee name and amount.
2. Launch approved UPI intent.
3. Treat app return as informational only.
4. If no PSP callback exists, ask customer and provider for separate confirmation.
5. Store only safe payment reference/UTR when voluntarily entered and appropriately protected.

**PSP-integrated path:**

- Verify signed webhook and transaction mapping server-side.
- Handle pending, success, failure, duplicate callback, refund where applicable.

**Receipt:** Generate a platform work/payment record clearly stating whether payment was PSP-confirmed or party-declared.

## C-18 Rating and Review

**Eligibility:** Booking is completed or system-closed under policy, user is a transaction participant, review window is open, and no duplicate review exists.

**Happy path:**

1. Ask overall rating and optional dimensions: work quality, punctuality, behaviour, price transparency.
2. Optional text/voice-to-text comment.
3. Screen for prohibited personal data, abuse, threats, and irrelevant content.
4. Publish, hold, or reject under moderation policy.
5. Provider may submit one response.

**Rules:**

- Never request a positive rating.
- Do not trigger during an open safety complaint.
- Review edits are versioned.
- Removed reviews retain moderation/audit records.

## C-19 Complaint, Dispute, and Safety Report

**Entry:** Active/completed booking, provider profile, account, payment record, review, or help.

**Categories:**

- Provider no-show.
- Customer no-show.
- Service quality/rework.
- Price or undisclosed charge.
- Payment mismatch.
- Property damage.
- Harassment/threat/safety.
- Impersonation/fake provider.
- False booking/customer fraud.
- Review/content issue.
- Privacy/account issue.

**Happy path:**

1. User selects category and urgency.
2. For immediate danger, show emergency-service guidance appropriate to the region and state that KaamSaathi is not an emergency responder.
3. Collect concise description and optional evidence.
4. Create complaint idempotently.
5. Assign severity, queue, acknowledgment target, and restricted access.
6. Notify user of reference and next step.
7. Preserve booking/payment/review evidence.

**Rules:**

- Do not expose one party's private evidence to the other without policy/legal basis.
- High-impact actions require human review and appeal.

## C-20 Saved Provider and Repeat Booking

**Happy path:**

1. User saves a provider from profile or completed job.
2. Repeat action pre-fills category, provider, locality, and prior issue template but never silently reuses old date, address, price, or consent.
3. Provider eligibility is rechecked.
4. Create a new request and quote/booking record.

## C-21 Notification Preferences

Allow separate controls for transactional push/SMS, optional WhatsApp, marketing, and reminders. Mandatory service/security messages may not be disabled where legally/operationally required, but use the least intrusive channel.

## C-22 Account Data, Export, Correction, and Deletion

1. User views current profile, devices/sessions, consents, saved addresses, and role status.
2. User may correct ordinary profile data.
3. Sensitive corrections may require re-authentication/review.
4. Export request creates a tracked privacy request.
5. Deletion request requires re-authentication and explains active booking/dispute implications.
6. Account may be immediately deactivated while deletion/anonymization runs according to approved retention/legal-hold policy.
7. User receives status and completion notice.

---

# 5. Provider Workflows

## P-01 Provider Role Activation

1. Logged-in user chooses `Earn as a service provider`.
2. Explain independent-provider model, verification levels, lead/fee policy, safety, data use, and non-guaranteed income.
3. User consents to provider terms placeholder/approved terms.
4. Create provider-onboarding draft without immediately making profile discoverable.

## P-02 Provider Profile

Collect progressively:

- Display name/business name.
- Safe photo/avatar.
- Languages.
- Experience description.
- Service categories and subskills.
- Service areas and radius.
- Availability.
- Indicative visit fee/rate guidance.
- Work samples.
- References/evidence according to verification path.
- Optional business registration/tax details only when required.

Do not require every field before saving. Mark what is needed for marketplace eligibility.

## P-03 Service and Skill Selection

1. Provider selects only configured categories.
2. Category-specific questions capture skill details, tools, job limits, appliance types, emergency/urgent availability, and exclusions.
3. Provider cannot self-create an unmoderated category.
4. Category activation may require evidence/review.

## P-04 Service Area

1. Select locality/PIN codes or draw/choose a radius within policy limits.
2. Show approximate travel burden.
3. Do not publish exact provider home address.
4. Provider may set different coverage for categories if supported.

## P-05 Availability

Support:

- Available now.
- Scheduled recurring hours.
- Date exceptions.
- Pause profile.
- Temporary vacation/unavailable period.

Availability does not guarantee lead assignment. Expired availability is not treated as current.

## P-06 Verification Submission

Available routes may include:

- Mobile verified.
- Profile reviewed.
- Government identity document reviewed where lawful/approved.
- In-person assisted verification.
- Local references.
- Address/service-area review.
- Skill evidence/training certificate.
- Work samples.

**Happy path:**

1. Explain each requested item, purpose, retention, who can see it, and alternatives.
2. Provider uploads/submits evidence.
3. Server validates format/ownership and creates verification case.
4. Verification agent approves, rejects, or requests more information with reason.
5. Provider receives status and appeal/resubmission route.

**Rules:**

- Aadhaar is not compulsory.
- Workers without formal documents may use an approved alternative route; the displayed badge must accurately describe that route.
- Evidence is private, access-controlled, and never public.

## P-07 Marketplace Eligibility

A provider becomes lead-eligible only when all category/location-specific minimum conditions are met:

- Active account and role.
- Required phone/profile verification.
- Approved category.
- Supported area.
- Current availability or schedule compatibility.
- No active policy suspension.
- Required terms/consent version accepted.

Eligibility is server-computed and reason-coded.

## P-08 Lead Inbox

1. Provider receives a privacy-minimized lead with category, approximate locality, preferred time, issue summary, allowed images, and response deadline.
2. Exact address and phone remain hidden.
3. Provider chooses `Interested`, `Decline`, or lets expire.
4. Interested provider may request an inspection or submit quote according to category rules.
5. Decline reason is recorded for marketplace improvement; do not penalize legitimate declines indiscriminately.

## P-09 Estimate Submission

Provider enters:

- Quote type.
- Visit/inspection fee.
- Labour.
- Parts/materials estimate.
- Other disclosed charges/tax.
- Total/range.
- Proposed schedule.
- Validity.
- Inclusions/exclusions.
- Warranty/rework statement.
- Notes.

Server validates category, eligibility, amount format, expiry, and request status. New revision supersedes but does not delete prior versions.

## P-10 Quote Revision/Withdrawal

- Provider may revise or withdraw before customer acceptance.
- Accepted quote cannot be edited.
- Withdrawal after acceptance requires booking cancellation flow and reason.
- Customer receives clear change notification.

## P-11 Booking Management

Provider sees:

- Booking ID.
- Accepted quote.
- Schedule.
- Address only after authorization/confirmation.
- Contact hand-off.
- Safety/report actions.
- State-transition controls allowed for the current state.

Provider cannot skip required states or backdate events.

## P-12 En Route, Arrival, and Start

- `En route` available only within policy window.
- `Arrived` records timestamp; optional one-time location check may be requested with consent but is not continuously tracked.
- Job start requires customer confirmation/start code or approved support override.
- Failed start attempts are rate-limited and auditable.

## P-13 Change Order

Provider must create a structured change order for additional work/price. Work outside approved scope is not platform-authorized until customer accepts.

## P-14 Completion Request and Final Bill

1. Provider submits work summary, final amount, parts/warranty note, and optional permitted photos.
2. Server validates final amount against accepted quote and change orders.
3. Customer is asked to confirm or dispute.
4. Provider sees pending/confirmed/disputed status.
5. Provider cannot self-confirm customer satisfaction.

## P-15 Payment and Earnings-Facilitated Record

Provider records cash received, UPI pending/received declaration, or PSP-confirmed payment. The earnings screen shows amounts facilitated/recorded by period and booking, with clear disclaimer that non-PSP declarations are not bank statements.

## P-16 Ratings, Reviews, and Response

Provider sees aggregate and eligible reviews, may report policy violations, and may post one professional response. Provider cannot pay to remove legitimate reviews or retaliate against customers.

## P-17 Complaint Response and Appeal

1. Provider receives a privacy-appropriate notice and response deadline.
2. Provider submits explanation/evidence.
3. Serious cases may temporarily restrict matching through a human-reviewed interim safety measure.
4. Final decision includes reason, duration, required action, and appeal route.
5. Internal fraud/risk details remain restricted.

## P-18 Pause, Deactivate, and Delete

- Pause removes provider from new matching while preserving active jobs.
- Deactivation handles active bookings before marketplace exit.
- Deletion uses the shared privacy workflow and approved retention/legal-hold policy.

---

# 6. Admin and Operations Workflows

## A-01 Admin Login and Session

- Individual account only.
- MFA mandatory.
- Device/session controls and timeout.
- No user-enumerating errors.
- Every privileged action requires authorization and audit.

## A-02 Provider Verification Queue

1. Filter by age, category, region, risk, and evidence status.
2. Mask unnecessary PII.
3. View evidence through signed, time-limited access.
4. Choose approve signal, reject signal, request information, escalate, or mark duplicate.
5. Enter structured reason and public-safe explanation.
6. Record reviewer, policy version, timestamp, and evidence considered.
7. Notify provider and provide appeal/resubmission.

## A-03 Category and Service Configuration

Manage:

- Category names/translations/aliases.
- Subskills and request questions.
- Verification requirements.
- Quote schema.
- Urgent-service availability.
- Media limits.
- Allowed lifecycle options.
- Indicative price guidance with effective dates and source.

Changes are versioned and cannot corrupt active jobs.

## A-04 Coverage and Locality Management

- Configure genuine serviceable localities/PIN codes.
- Enable/disable category availability by location.
- Set matching radius/batch rules.
- Preview public claims before publishing.
- Maintain change history.

## A-05 User/Provider Moderation

Available actions are role-scoped:

- Warn.
- Request correction.
- Temporarily restrict a category.
- Temporarily pause matching.
- Suspend account under policy.
- Reinstate.
- Preserve evidence/legal hold.

Every high-impact action requires reason, duration/review date, notice, and appeal. Permanent action requires authorized review.

## A-06 Complaint and Dispute Management

1. Triage category/severity.
2. Acknowledge.
3. Protect evidence.
4. Request information from relevant parties.
5. Restrict unsafe contact when needed.
6. Determine operational resolution: explanation, rework facilitation, rematch, payment-record correction, review moderation, warning, restriction, or escalation.
7. Record outcome and appeal.
8. Close only after resolution reason and user notification.

KaamSaathi must not promise compensation, insurance, refund, or legal remedy not actually available.

## A-07 Safety Escalation

- Immediate-danger messaging.
- Restricted case visibility.
- Contact freeze/blocking where appropriate.
- Evidence preservation.
- Senior review.
- Law-enforcement/legal escalation only under approved policy and law.
- Post-incident review.

## A-08 Review Moderation

- Detect duplicates, coercion, irrelevant content, abuse, PII, threats, and fake reviews.
- Preserve original and moderation reason.
- Allow appeal.
- Do not remove criticism merely because it is negative.

## A-09 Fraud Signal Review

Signals may include OTP abuse, device/account clusters, fake bookings, quote manipulation, review rings, repeated no-shows, payment mismatch, scraping, and abnormal admin access.

Signals create a case; they do not automatically prove fraud. Human review is required for high-impact action.

## A-10 Content and FAQ

- Draft, review, approve, publish, schedule, and retire content.
- Maintain Hindi/English parity.
- Version policies and user-facing notices.
- No unsupported legal, safety, pricing, or availability claim.

## A-11 Feature Flags

- Environment-scoped.
- Owner, purpose, target audience, start/end date, metrics, rollback.
- Sensitive features require approval.
- Flag changes are audited.

## A-12 Privacy Requests

- Export, correction, restriction, deletion, and consent withdrawal queue.
- Verify requester safely.
- Track deadlines and legal hold.
- Minimize staff access.
- Produce evidence of completion without exposing retained restricted records.

## A-13 Audit Log

Search by actor, action, object, time, IP/device context, outcome, and reason. Audit records are append-only or tamper-evident and exclude secrets/full sensitive payloads.

## A-14 Operational Metrics

Show marketplace funnel, provider supply, response time, completion, cancellation, no-show, complaint, fraud, verification backlog, support workload, crash/error, notification success, and cost. Apply aggregation and role-based access.

---

# 7. Public Website Workflows

## W-01 Product and Trust Information

Explain how the marketplace works, what verification means, payment limitations, safety guidance, supported categories/locations, grievance route, and app availability.

## W-02 Genuine Service/Location Pages

Only publish pages for real coverage. Include useful unique content, category details, pricing caveats, process, safety, and lead/app actions. Do not index private addresses or phone numbers.

## W-03 Provider Registration Lead

Collect minimal contact and category/location interest with consent. Do not represent lead submission as approved provider status.

## W-04 Lightweight Customer Request

If operationally enabled, allow a minimal request that transitions into OTP verification and the same authoritative backend workflow. Do not create a separate untracked lead database.

## W-05 Help, Grievance, Privacy, and Deletion

Provide accessible contact routes and account-deletion instructions even when the user cannot access the app.

---

# 8. Assisted and Low-Literacy Workflows

## L-01 Assisted Customer Booking

1. Operator identifies purpose and explains that OTP must remain with the user.
2. Operator records verbal/in-person consent according to policy.
3. User verifies phone directly.
4. Operator helps select category, locality, description, and schedule.
5. User or authorized requester reviews summary.
6. System records assisted flag/operator ID.

## L-02 Assisted Provider Onboarding

Use progressive steps, photo/document alternatives, local references, language assistance, and explicit badge meaning. Operator cannot approve their own submitted verification evidence unless policy permits independent review.

## L-03 Voice and Call Fallback

Voice input may populate fields, but user must see/hear and confirm critical information: address, schedule, quote, change order, final amount, and complaint submission.

## L-04 Offline Interruption

- Read cached active jobs and saved drafts.
- Queue permitted actions with idempotency.
- Display `Pending sync` distinctly from success.
- Reconcile with server before showing final state.
- If the server state changed, explain conflict and require user choice where needed.

## L-05 App Process Death or Device Change

Server drafts/active jobs resume after login. Sensitive local caches expire and are encrypted as appropriate. A device change may trigger risk review for high-risk actions without blocking ordinary access unnecessarily.

---

# 9. Notification Principles

1. Transactional notifications must identify booking/request context without exposing full address, phone, or complaint details on lock screens.
2. Use push first where available; SMS for OTP and selected critical fallback; WhatsApp only with approved provider and user consent.
3. Deduplicate notifications across retries.
4. Every notification links to the authoritative in-app state.
5. Notification failure must not silently cancel a valid booking or request.
6. Users can manage optional reminders and marketing separately.

Minimum notification events:

- OTP requested.
- Provider verification update.
- New lead.
- Lead expiring.
- Quote submitted/revised/withdrawn/expiring.
- Booking confirmed/rescheduled/cancelled.
- Provider en route/arrived.
- Start confirmation requested.
- Change order submitted/accepted/rejected.
- Completion requested/confirmed/disputed.
- Payment confirmation/mismatch.
- Review eligible/moderated.
- Complaint acknowledged/updated/resolved.
- Privacy request update.
- Security/session alert.

---

# 10. Analytics Principles

- Define events before implementation.
- Do not include phone, exact address, identity-document value, free-text complaint, or payment credentials in analytics.
- Use stable pseudonymous IDs only where approved.
- Record consent and retention.
- Validate event firing and duplication.

North-star metric: successfully completed service jobs that both parties confirm or that satisfy the documented completion rule.

Guardrails: safety complaints, fraud reports, fake-provider rate, fake-booking rate, no-show rate, dispute rate, support burden, account takeover, deletion completion time, crash-free sessions, and cost per active user.
