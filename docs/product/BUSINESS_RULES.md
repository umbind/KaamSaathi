# KaamSaathi Business Rules

## 1. Rule Format

Every rule implemented in code must have:

- Rule ID.
- Source requirement.
- Server enforcement location.
- Client presentation behavior.
- Test IDs.
- Feature-flag/config dependencies.
- Effective version/date.

---

## 2. Identity and Roles

**BR-ID-001:** One mobile number maps to one primary user account unless a documented migration/merge process resolves duplicates.

**BR-ID-002:** A user may hold customer and provider roles; permissions are evaluated per action, not by the last selected UI mode.

**BR-ID-003:** Provider role activation does not automatically grant lead eligibility.

**BR-ID-004:** OTP responses must not reveal account existence. OTP send/verify/resend are throttled by phone, device/app signal, IP/network, and risk policy.

**BR-ID-005:** High-risk actions require recent authentication or step-up verification.

**BR-ID-006:** Admin accounts are individual, MFA-protected, role-scoped, and auditable. Shared credentials are prohibited.

---

## 3. Provider Eligibility and Verification

**BR-PV-001:** Eligibility is server-computed from active account, provider profile, category, service area, verification signals, terms, availability, and restrictions.

**BR-PV-002:** A verification badge describes a specific signal; it must state what was checked and what was not guaranteed.

**BR-PV-003:** Aadhaar is not a mandatory default. Any sensitive identifier requires approved necessity, legal review, owner approval, minimization, and retention controls.

**BR-PV-004:** Alternative verification routes must be available where operational policy allows workers without formal documents, such as in-person onboarding, local references, skill evidence, and platform work history.

**BR-PV-005:** The agent who assists evidence submission should not be the sole approver of the same case unless an approved dual-control exception exists.

**BR-PV-006:** Expired/revoked evidence recomputes badge display and eligibility; historical claims remain auditable.

**BR-PV-007:** High-impact restriction/suspension requires human review, notice where safe, reason, duration/review date, and appeal.

---

## 4. Service Catalogue and Coverage

**BR-SC-001:** Only active categories in genuinely supported locations can accept new requests.

**BR-SC-002:** Category-specific forms, verification requirements, quote fields, media limits, and lifecycle options are versioned configuration.

**BR-SC-003:** Configuration changes do not retroactively alter accepted quotes or active booking obligations.

**BR-SC-004:** Search aliases and transliterations may map problems to categories but must not silently select a hazardous/incorrect service without customer confirmation.

**BR-SC-005:** “Urgent” means prioritized marketplace handling only; it is not an emergency-service guarantee.

---

## 5. Location and Privacy

**BR-LOC-001:** Discovery/matching uses the minimum adequate precision, normally locality/PIN/service radius.

**BR-LOC-002:** Exact customer service address is withheld from unselected providers.

**BR-LOC-003:** Exact provider residential address is never publicly shown.

**BR-LOC-004:** Precise GPS is requested contextually and consented; no continuous background tracking in MVP.

**BR-LOC-005:** Location and address access is logged for privileged/support access where practical.

---

## 6. Matching and Ranking

### 6.1 Hard filters

A provider is eligible for a lead only when all apply:

- Account/provider role active.
- Category and subskill approved.
- Location/service radius covers approximate request area.
- Required verification level met.
- Availability/schedule compatible or provider may explicitly respond.
- No active restriction for the category/customer/request.
- Not blocked by either party under policy.
- Capacity/lead-rate controls permit notification.

### 6.2 Permitted ranking factors

Approved factors may include:

- Service-area fit/distance band.
- Schedule compatibility.
- Category-specific skill match.
- Recent response rate.
- Completion rate with minimum sample protection.
- Verified completed-job count.
- Rating adjusted for sample size and recency.
- Relevant language.
- Fair rotation/new-provider exposure.
- Repeated no-show/cancellation signals after policy review.

### 6.3 Prohibited or restricted ranking behavior

- Discrimination on protected/sensitive characteristics.
- Hidden pay-to-rank that bypasses safety/eligibility.
- Punishing every decline regardless of reason.
- Using unreviewed complaint allegations as proven misconduct.
- Revealing exact customer location in ranking payloads.
- Manipulating ratings with synthetic activity.

**BR-MAT-001:** Notify providers in controlled batches; expand only as required.

**BR-MAT-002:** Record ranking version and key eligibility/ranking reasons for audit and support.

**BR-MAT-003:** No-match provides alternatives: change time, broaden radius within consent, select another category, assisted support, or close request.

---

## 7. Request, Quote, and Booking

**BR-RQB-001:** Request submission is idempotent and returns the existing request for duplicate retry with matching payload.

**BR-RQB-002:** A targeted provider must be revalidated at submission time.

**BR-RQB-003:** Providers quote only approved categories and active requests assigned to them.

**BR-RQB-004:** Quote includes version, type, fee breakdown, total/range, schedule, validity, inclusions/exclusions, and provider identity.

**BR-RQB-005:** Only one active quote may be accepted for a single unsplit request.

**BR-RQB-006:** Quote acceptance and booking creation are atomic.

**BR-RQB-007:** Accepted quote is immutable. A later scope/price change requires accepted change order or explicit corrected-bill confirmation under policy.

**BR-RQB-008:** Other providers are notified that the request is no longer available without exposing the selected provider's private details.

**BR-RQB-009:** Contact details/address are revealed only after the relevant authorization and consent threshold.

**BR-RQB-010:** Booking IDs are non-sequential/public-safe or otherwise protected against enumeration.

---

## 8. Scheduling, Cancellation, and No-Show

**BR-SCH-001:** Schedule changes require acceptance by the other party; a proposal does not replace the original until accepted.

**BR-SCH-002:** Past or impossible time windows are rejected.

**BR-SCH-003:** MVP may record late cancellation but must not charge an unapproved automated fee.

**BR-SCH-004:** Provider cancellation offers customer rematch/rebooking.

**BR-SCH-005:** No-show reporting requires configured grace period, contact attempt where safe, and evidence/review for adverse consequences.

**BR-SCH-006:** Repeated cancellation/no-show patterns create reviewable signals, not automatic permanent suspension.

---

## 9. Job Start, Change Order, and Completion

**BR-JOB-001:** Provider cannot unilaterally bind the customer to an in-progress job. Start requires customer confirmation/code or authorized support override.

**BR-JOB-002:** Start code is short-lived, rate-limited, scoped to booking, and never logged in plaintext.

**BR-JOB-003:** Work beyond accepted scope requires a change order showing delta and schedule impact.

**BR-JOB-004:** Rejected change order does not alter approved amount/scope.

**BR-JOB-005:** Final bill is validated against accepted quote plus accepted change orders.

**BR-JOB-006:** Provider submission means “provider says work is complete,” not “customer is satisfied.”

**BR-JOB-007:** System closure after customer inactivity is labeled `COMPLETED_UNCONFIRMED`, records reminders, preserves complaint window, and is not used as explicit satisfaction evidence.

**BR-JOB-008:** Completion photos are optional unless category policy requires evidence; avoid capturing people or private home interiors unnecessarily.

---

## 10. Payment

**BR-PAY-001:** KaamSaathi does not hold funds in MVP.

**BR-PAY-002:** Cash and non-integrated UPI are party-declared until reconciled.

**BR-PAY-003:** Launching UPI intent or receiving a client callback is not sufficient proof of success.

**BR-PAY-004:** PSP-confirmed status requires verified server-side callback/reconciliation.

**BR-PAY-005:** Never store UPI PIN, card credentials, bank login, or full payment secrets.

**BR-PAY-006:** Display payee and amount before UPI hand-off.

**BR-PAY-007:** Payment/reference mismatch creates a dispute without overwriting original evidence.

**BR-PAY-008:** Receipts distinguish platform work record, party-declared payment, and PSP-confirmed payment.

**BR-PAY-009:** Refund states/features remain disabled until a real approved PSP/operating model supports them.

---

## 11. Ratings and Reviews

**BR-REV-001:** Only eligible transaction participants may review an eligible completed booking.

**BR-REV-002:** One review per party per booking; edit history retained.

**BR-REV-003:** Never incentivize positive sentiment or block low ratings.

**BR-REV-004:** Open safety complaints suppress rating prompts but do not necessarily eliminate later review rights.

**BR-REV-005:** Rating averages show review count and use minimum sample/adjustment to avoid misleading ranking.

**BR-REV-006:** Moderation removes policy-violating content, not legitimate criticism.

**BR-REV-007:** Provider response is limited, public-safe, and cannot expose customer PII.

---

## 12. Complaints, Safety, and Appeals

**BR-CMP-001:** Complaint submission is idempotent and returns a reference immediately.

**BR-CMP-002:** Immediate-danger guidance is visible; KaamSaathi does not claim emergency-response capability unless actually staffed and approved.

**BR-CMP-003:** Case access is need-to-know and category/severity scoped.

**BR-CMP-004:** Serious safety evidence is preserved and may justify a time-limited interim restriction with prompt human review.

**BR-CMP-005:** Allegations remain allegations until reviewed; user-facing wording avoids declaring guilt prematurely.

**BR-CMP-006:** Resolutions are limited to capabilities actually offered. Do not promise insurance, compensation, refund, legal judgment, or police action without a real basis.

**BR-CMP-007:** High-impact decisions include reason, notice where safe, duration, review date, and appeal.

**BR-CMP-008:** Appeal reviewer should be independent from the original final decision where practical.

---

## 13. Notifications and Communication

**BR-NOT-001:** Notification content is privacy-minimized for lock screens/shared devices.

**BR-NOT-002:** Notification failure never changes authoritative transaction state.

**BR-NOT-003:** Deduplicate by event/recipient/channel/version.

**BR-NOT-004:** Optional marketing consent is separate from transactional communications.

**BR-NOT-005:** Phone/WhatsApp reveal requires transaction purpose and consent; no public indexing.

**BR-NOT-006:** Communication abuse/reporting can disable future contact while preserving case evidence.

---

## 14. Attachments

**BR-FIL-001:** Validate allowlisted file types, true content type, size, dimensions, count, and ownership.

**BR-FIL-002:** Strip unnecessary metadata where appropriate.

**BR-FIL-003:** Store privately; serve via signed, short-lived URLs.

**BR-FIL-004:** Scan or quarantine where appropriate; malicious/suspicious files never reach ordinary clients/admin previews.

**BR-FIL-005:** Do not include private attachment URLs in analytics, logs, email, or public pages.

**BR-FIL-006:** Deletion/retention follows the linked business record and legal/safety hold policy.

---

## 15. Privacy, Consent, and Deletion

**BR-PRI-001:** Every collected field has a defined purpose, classification, owner, retention, access role, and deletion behavior.

**BR-PRI-002:** Consent is granular for optional analytics, marketing, public provider profile, precise location, and WhatsApp/contact hand-off.

**BR-PRI-003:** Withdrawal affects future optional processing without corrupting transaction records.

**BR-PRI-004:** Account deletion may immediately deactivate access while processing deletion/anonymization under approved retention/legal holds.

**BR-PRI-005:** Data export excludes other parties' restricted data, secrets, internal fraud methods, and protected support evidence.

**BR-PRI-006:** Sensitive staff access is logged and reviewable.

---

## 16. Admin and Audit

**BR-ADM-001:** UI visibility is not authorization; every admin API checks role/action/object scope.

**BR-ADM-002:** Privileged actions require structured reason and audit event.

**BR-ADM-003:** Support notes are restricted and never visible to users unless intentionally copied into a public-safe response.

**BR-ADM-004:** Feature flags are environment-scoped, owned, expiring where possible, measurable, and reversible.

**BR-ADM-005:** No secret administrative bypass, hardcoded superuser, or undocumented backdoor.

**BR-ADM-006:** Bulk export/action needs elevated permission, purpose, limit, and audit.

---

## 17. Low Connectivity and Reliability

**BR-REL-001:** Pending local action is visibly different from server success.

**BR-REL-002:** Retry uses exponential backoff/jitter where appropriate and never creates duplicate request, quote, booking, payment, complaint, or review.

**BR-REL-003:** Active booking/request state is cached for read-only offline access with last-updated timestamp.

**BR-REL-004:** On conflict after reconnection, server state wins; user receives an actionable explanation.

**BR-REL-005:** App process death and restart restore draft and active transaction context without exposing sensitive data to another device user.

---

## 18. Monetization Guardrails

**BR-MON-001:** Customer/provider charges remain disabled until owner approval, clear disclosure, legal/tax review, refund/cancellation handling, and metrics exist.

**BR-MON-002:** Workers are not charged merely to view/apply for ordinary work opportunities in the initial model.

**BR-MON-003:** Paid placement is labeled and never bypasses safety/eligibility.

**BR-MON-004:** Essential complaint, safety, wage/payment dispute, privacy, or deletion access is never paywalled.
