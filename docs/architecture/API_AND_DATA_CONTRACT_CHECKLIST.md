# KaamSaathi API and Data Contract Checklist

## 1. API Standards

- Versioned base path, for example `/api/v1`.
- OpenAPI is source-controlled and validated in CI.
- Stable error envelope: `code`, `message_key`, safe localized arguments, `correlation_id`, optional field errors, and retry guidance.
- No stack traces, secrets, account-existence leakage, or PII in error responses.
- Cursor pagination for changing lists; deterministic sorting.
- Idempotency key required for critical create/transition/payment/complaint/review requests.
- Optimistic concurrency/version field or equivalent for mutable resources.
- Request correlation ID and authenticated actor context.
- Rate-limit headers/behavior where appropriate.
- All authorization enforced server-side.
- UTC storage; display in Asia/Kolkata or user-relevant configured timezone.
- Indian currency represented in minor units with currency code, never binary float.

## 2. Required Domain Modules and Ownership

| Module | Owns | Must not own |
|---|---|---|
| Identity | OTP challenge, session, role grants, device/session revocation | Provider verification decision |
| Customer Profile | Customer preferences, saved safe addresses, consents | Booking lifecycle |
| Provider Profile | Provider descriptive data, services, service areas, availability | Verification evidence decision |
| Verification | Verification cases/signals/evidence metadata | Public profile rendering |
| Catalogue | Categories, subskills, translations, request/quote schema | Individual request state |
| Location | Coverage, locality, geospatial lookup | Continuous tracking |
| Requests | Request drafts/submission and request lifecycle | Booking job lifecycle |
| Matching | Eligibility candidates, ranking version, lead batches | Provider verification source data |
| Quotes | Quote versions and status | Final payment confirmation |
| Booking/Job | Schedule, lifecycle, change orders, completion | User authentication |
| Payments | Payment intent/reference/declaration/webhook state | Wallet/escrow |
| Reviews | Eligibility, review versions, moderation linkage | Provider verification badge |
| Complaints | Cases, evidence references, resolution/appeal | Emergency services |
| Trust/Fraud | Signals, investigations, interim actions | Unreviewed permanent suspension |
| Notifications | Template/version/channel/delivery | Authoritative transaction state |
| Admin/Audit | Privileged actions and immutable audit | Hidden bypass |
| Privacy | Export/correction/deletion/retention workflow | General support notes |
| Analytics | Approved events and aggregates | Raw sensitive free text |

## 3. Core Entity Checklist

### User

- `id`
- normalized mobile hash/encrypted value according to design
- account state
- role grants
- preferred language
- created/updated timestamps
- session/risk references
- deletion/anonymization status

### CustomerProfile

- user id
- display name
- communication/accessibility preferences
- saved address references
- consent references
- version

### ProviderProfile

- user id
- public display name
- avatar/work-sample references
- languages
- experience description
- profile state
- pause status
- public-profile consent
- eligibility summary derived, not manually trusted

### ProviderService

- provider id
- category/subskills
- status
- price guidance/visit fee
- category-specific attributes
- evidence requirement status

### ServiceArea

- provider/category/locality/PIN/radius/geospatial representation
- effective dates/status

### Availability

- recurring slots
- exceptions
- immediate availability expiry
- timezone

### ProviderVerification / VerificationSignal

- case id/provider
- route/type
- status
- evidence metadata (not raw document in normal table)
- policy version
- reviewer/reason
- expiry
- badge wording key
- appeal link

### ServiceRequest

- customer/requester
- category/subtype
- current immutable request version
- coarse matching location and protected exact address reference
- preferred window
- description
- attachment references
- targeted/matching mode
- state/version/idempotency source

### Match

- request/provider
- eligibility/ranking version and reason codes
- notification batch
- expiry
- state

### Estimate

- request/match/provider
- immutable version
- quote type
- amount components in minor units
- total/range
- proposed schedule
- validity
- inclusions/exclusions/warranty note
- status

### Booking

- request/accepted estimate version/customer/provider
- protected service address snapshot
- schedule version
- state/version
- contact-consent state
- cancellation/no-show fields
- completion source

### JobStatusHistory

- booking
- from/to
- actor/source
- reason
- timestamp
- correlation/idempotency
- metadata allowlist

### ChangeOrder

- booking
- version
- reason/scope delta
- amount delta
- schedule impact
- validity
- status/decision actor/time

### PaymentReference

- booking
- method
- amount/currency
- declaration states
- safe reference
- PSP provider transaction mapping
- webhook/reconciliation status
- dispute/refund state

### Rating / Review

- booking/reviewer/reviewee
- eligibility snapshot
- dimensions/comment
- status/version/moderation
- provider response
- unique constraint by booking/reviewer role

### Complaint / Dispute

- reporter/subject/booking/account references
- category/severity/confidentiality
- state/queue/owner
- description stored in restricted data class
- evidence references
- interim/final action
- appeal

### ConsentRecord

- user
- purpose/version
- granted/withdrawn timestamp
- source/channel
- evidence

### PrivacyRequest

- user/type/state
- verification
- retention/legal hold result
- completion evidence

### Notification

- recipient/event/template version/channel
- deduplication key
- state/attempts
- privacy-safe payload reference

### AuditEvent

- actor type/id
- action/object
- result/reason
- time/correlation
- network/device context where approved
- no secrets/full sensitive payloads

### FraudSignal

- subject/type/source
- score/band only if explainable internally
- evidence references
- state/reviewer/action link
- not treated as proof

## 4. Endpoint Capability Checklist

### Authentication and account

- Request OTP.
- Verify OTP.
- Refresh/revoke session.
- List/revoke user sessions.
- Read/update profile.
- Change language/preferences.
- Request export/correction/deletion.

### Catalogue and coverage

- List categories/translations.
- Search problem aliases.
- Check coverage.
- Read category request/quote schema.

### Provider discovery

- Search eligible providers using coarse location.
- Read privacy-safe provider profile.
- Save/unsave provider.

### Provider onboarding

- Create/update provider draft.
- Configure services/areas/availability.
- Submit verification case/evidence.
- Read status and appeal/resubmit.
- Pause/deactivate.

### Requests/matching

- Create/update draft.
- Submit request idempotently.
- Read request status/history.
- Cancel request.
- Read customer-visible matches/quotes.
- Provider lead inbox/read/respond/decline.

### Quotes/bookings

- Submit/revise/withdraw quote.
- Accept quote atomically and return booking.
- Read booking.
- Propose/respond to reschedule.
- Cancel/report no-show.
- En route/arrive/request start/confirm start.
- Submit/respond to change order.
- Submit/correct/confirm/dispute completion.

### Payments

- Create approved payment intent.
- Record party declaration.
- Read reconciliation state.
- Receive verified PSP webhook through dedicated endpoint.
- Raise payment dispute.

### Reviews/complaints

- Check review eligibility.
- Submit/edit/report review.
- Provider response.
- Submit/read complaint status/add evidence/appeal.

### Admin

- MFA/session.
- Verification queue and decision.
- Moderation/interim/final action/appeal.
- Category/coverage/content/feature flags.
- Complaint/fraud/safety queues.
- Privacy requests.
- Audit search.
- Aggregated metrics.

## 5. Required Error Codes

At minimum define stable codes for:

- Authentication required/step-up required.
- OTP invalid/expired/throttled/generic delivery failure.
- Permission denied/object not found without enumeration.
- Validation error.
- Unsupported category/location.
- Provider not eligible/not available.
- Request state conflict.
- Quote expired/withdrawn/superseded/already accepted.
- Booking state conflict.
- Change order required.
- Amount exceeds approved amount.
- Duplicate/idempotency conflict.
- Upload invalid/quarantined.
- Rate limited.
- Payment pending/unverified/disputed.
- Review not eligible/duplicate.
- Complaint duplicate/restricted.
- Feature disabled.
- Temporary dependency unavailable.

## 6. Concurrency and Transaction Checklist

- Two simultaneous quote acceptances: exactly one succeeds.
- Quote acceptance and booking creation: atomic.
- Booking transition uses expected version/current state.
- Change-order decision uses current version.
- Completion confirmation vs dispute: deterministic conflict policy.
- Review unique constraint prevents duplicates.
- Payment webhook idempotent by provider transaction/event.
- OTP attempt/cooldown atomic.
- Provider capacity/lead batching safe under concurrency.
- Privacy deletion jobs resumable/idempotent.

## 7. Logging and Analytics Checklist

Never log or send to analytics:

- OTP value.
- UPI PIN/card/bank credentials.
- Full identity-document number/image URL.
- Exact address unless a restricted operational log has explicit purpose.
- Full phone number in ordinary logs.
- Complaint free text/evidence.
- Signed URLs/tokens/secrets.

Use correlation IDs and structured event codes instead.
