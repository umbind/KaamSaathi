# KaamSaathi Support, Dispute, Fraud, and Safety Workflows

## 1. Operating Principle

KaamSaathi is a marketplace and support platform, not an emergency service, insurer, court, police service, employer of independent providers, or guaranteed compensation scheme unless a future approved operating model explicitly provides those functions.

Support actions must be truthful, capability-bounded, privacy-minimized, and auditable.

## 2. Proposed Internal Severity Model

Targets below are internal pilot design targets and must be confirmed against actual staffing before public launch. They are not public guarantees.

| Severity | Examples | Automated acknowledgment | Human review target during staffed hours | Required owner |
|---|---|---:|---:|---|
| S0 Critical safety/security | Immediate threat, credible violence, active account takeover, material data exposure | Immediate | 15 minutes | Trust & Safety/Security lead |
| S1 High | Harassment, provider impersonation, serious property damage allegation, payment fraud pattern, malicious provider | Immediate | 1 hour | T&S senior reviewer |
| S2 Transaction dispute | No-show, quality/rework, price dispute, payment mismatch, cancellation | Immediate | 4 business hours | Support lead |
| S3 General support | Profile correction, notification issue, ordinary app help | Immediate | 1 business day | Support agent |
| S4 Feedback/request | Feature suggestion, content correction | Immediate | 3 business days | Product/content owner |

If staffing cannot meet these targets, revise the targets, operating hours, and user communications before pilot.

## 3. Universal Case Workflow

1. **Intake**
   - Source: app, web, phone-assisted entry, email/form, admin observation, or automated signal.
   - Create case idempotently.
   - Capture category, booking/account reference, description, urgency, preferred language, and optional evidence.

2. **Immediate safety screen**
   - Ask whether anyone is in immediate danger.
   - Show appropriate emergency guidance and clearly state KaamSaathi is not an emergency responder.
   - Do not delay emergency guidance while collecting a long form.

3. **Acknowledgment**
   - Send case reference, current status, expected next step, safe contact channel, and evidence preservation guidance.

4. **Triage**
   - Assign severity, queue, owner, affected entities, confidentiality, and response target.
   - Deduplicate linked reports without losing reporter records.

5. **Containment/interim action**
   - Restrict contact, revoke sessions, pause matching, hide a profile, quarantine upload, or preserve evidence only when justified and authorized.
   - Interim high-impact action is time-limited and reviewed.

6. **Investigation**
   - Review authoritative logs, state history, quote/change orders, payment declarations, communication hand-off, verification signals, prior patterns, and supplied evidence.
   - Request only necessary evidence.
   - Keep one party's private evidence restricted unless disclosure is justified.

7. **Decision and resolution**
   - Apply only remedies KaamSaathi can actually deliver.
   - Record facts, policy basis, uncertainty, action, duration, and follow-up.

8. **Notification**
   - Send public-safe outcome to relevant parties.
   - Do not reveal internal fraud methods, other users' PII, or protected evidence.

9. **Appeal**
   - High-impact decisions provide an appeal window and independent review where practical.

10. **Closure and learning**
    - Close with reason, resolution code, root cause, product/control follow-up, and retention classification.

## 4. Provider No-Show Workflow

1. Customer reports no-show only after configured grace period.
2. Check booking time, provider status events, contact attempts, reschedule proposals, and notification delivery.
3. Contact provider through approved channel.
4. Offer customer rematch, reschedule, or cancellation.
5. Record `NO_SHOW_PROVIDER` only when evidence/policy threshold is met.
6. Repeated confirmed pattern creates a reliability review; no automatic permanent suspension.
7. If the provider reports an emergency or incorrect address, record separately without erasing customer impact.

## 5. Customer No-Show Workflow

1. Provider reports after grace period and reasonable safe contact attempt.
2. Confirm provider arrival/start attempt and address authorization.
3. Contact customer.
4. Record `NO_SHOW_CUSTOMER` only after policy threshold.
5. Do not impose unapproved fee automatically.
6. Protect provider from repeated malicious fake bookings through human-reviewed controls.

## 6. Price/Undisclosed-Charge Dispute

1. Compare accepted quote, accepted change orders, final bill, and payment declarations.
2. Identify undisclosed or unaccepted delta.
3. Ask provider for itemization/evidence.
4. Ask customer to confirm any off-platform verbal agreement without treating it as automatically binding.
5. Correct platform record when clear.
6. Facilitate a bill correction, rework conversation, or policy action; do not promise refund/compensation unless available.
7. Track provider patterns of undisclosed charges for review.

## 7. Quality/Rework Complaint

1. Capture defect, expected vs delivered scope, time since completion, photos where safe, and any provider warranty/rework statement.
2. Check whether the issue is within accepted scope/change orders.
3. Offer provider response/rework where appropriate and safe.
4. Customer may decline direct re-engagement for safety reasons.
5. Record resolution: explanation, rework scheduled/completed, unresolved, rematch, or policy action.
6. Do not make technical safety claims beyond available expertise.

## 8. Payment Mismatch

1. Preserve customer declaration, provider declaration, PSP webhook/reconciliation, amount, method, and safe reference.
2. Never ask for UPI PIN, bank password, card details, or remote screen access.
3. If PSP-confirmed, treat verified server record as authoritative for platform status while allowing external bank dispute process.
4. For cash/external UPI without PSP proof, mark disputed and seek evidence from both parties.
5. Correct only the platform record; do not claim bank reversal capability.
6. Escalate suspected fraud pattern.

## 9. Property Damage Allegation

1. Assign S1/S2 depending on severity and ongoing risk.
2. Preserve booking, before/after evidence, work scope, provider identity/verification, and timeline.
3. Advise parties not to alter evidence unnecessarily and to seek emergency/professional help if dangerous.
4. Restrict unsafe further contact if needed.
5. Obtain both-party statements.
6. Apply marketplace policy action and facilitate communication only within approved capability.
7. Do not admit legal liability or promise insurance/compensation without approved authority.
8. Flag legal review for serious claims.

## 10. Harassment, Threat, or Unsafe Meeting

1. Show immediate-danger guidance.
2. Restrict case access.
3. Allow user to block further contact.
4. Preserve communication hand-off, booking state, identity/verification, and reports.
5. Apply interim matching/contact restriction when justified.
6. Senior T&S review determines longer action and appeal.
7. Avoid contacting the accused in a way that increases danger without a safety plan.

## 11. Fake/Impersonating Provider

1. Hide or pause profile when credible immediate impersonation risk exists.
2. Verify account control, evidence provenance, references, duplicate images/numbers/devices, and prior cases.
3. Revoke sessions and require re-verification if account takeover is possible.
4. Notify affected customers where appropriate.
5. Preserve evidence and report externally only under approved policy/law.
6. Provide appeal for mistaken identity.

## 12. Fake Booking or Malicious Customer

1. Verify request, OTP/device risk, repeated cancellations/no-shows, provider reports, and transaction pattern.
2. Apply rate/lead restrictions proportionately.
3. Do not expose providers to exact address/phone before selection.
4. Human review is required before lasting suspension.
5. Provide appeal.

## 13. Account Takeover

1. Revoke active sessions/tokens.
2. Freeze high-risk actions and provider matching if needed.
3. Verify legitimate user using approved recovery process without exposing account existence.
4. Review phone/SIM/device/session changes and admin actions.
5. Restore access, rotate credentials/tokens, and notify affected user.
6. Review unauthorized bookings, messages, profile changes, and payment references.
7. Open security incident if systemic.

## 14. Data Exposure or Privacy Incident

1. Treat as S0/S1 based on scope/sensitivity.
2. Contain access, revoke URLs/tokens, disable vulnerable function, preserve logs.
3. Identify data, subjects, duration, access, and affected systems.
4. Engage security/privacy/legal owners.
5. Follow approved notification and regulatory process; do not invent legal conclusions.
6. Remediate, retest, and conduct post-incident review.

## 15. Review Dispute

1. Determine transaction eligibility and authenticity.
2. Check for PII, threats, abuse, irrelevance, coercion, conflict of interest, and manipulation.
3. Preserve original content.
4. Keep legitimate negative feedback.
5. Remove/hold only under published policy.
6. Notify reviewer/provider and permit appeal.

## 16. Verification Appeal

1. Route to a reviewer not solely responsible for original final decision when practical.
2. Review policy version, evidence, reason, alternative routes, and accessibility/language barriers.
3. Approve, uphold, or request new evidence.
4. Correct badge/eligibility and notify.
5. Track systemic false rejection and operational bias.

## 17. Support Access Controls

- Default masked phone/address.
- Exact data reveal requires case purpose and permission.
- Identity documents visible only to verification/privacy/security roles as needed.
- Complaint/safety evidence restricted by queue.
- Analyst access aggregated/pseudonymized.
- Every privileged reveal/action audited.
- No copying PII into unrestricted notes or external tools.

## 18. Support Metrics

Track:

- Cases per 100 completed bookings.
- Severity mix.
- Acknowledgment and resolution time.
- Reopen and appeal rate.
- No-show and payment-dispute rate.
- Safety reports.
- Provider/customer repeated-abuse patterns.
- Verification backlog and false rejection/reversal rate.
- Support contacts per workflow step.
- Resolution satisfaction where safely measured.
- Unresolved cases and aging.
- Staff access anomalies.
