---
name: security-privacy-audit
description: Threat-models and validates KaamSaathi changes for authentication, authorization, privacy, fraud, upload, location, payment, admin, logging, and safety risks. Use for sensitive features and release hardening.
---

# Security and Privacy Audit

## Steps

1. Identify assets, actors, trust boundaries, data flows, threats, abuse cases, and high-impact decisions.
2. Update threat model and privacy/data inventory.
3. Verify OTP anti-enumeration, throttling, replay prevention, session expiry/revocation, and step-up auth.
4. Test object/function/field-level authorization for customer, provider, support, verification, analyst, and admin roles.
5. Test input validation, injection, XSS/CSRF/SSRF where applicable, upload type/content/size, signed URL scope, and log redaction.
6. Verify exact location, phone, identity evidence, complaint evidence, payment reference, and support-note access.
7. Test fake provider/customer/booking/review, rating manipulation, no-show abuse, quote manipulation, payment mismatch, scraping, notification spam, and cost exhaustion.
8. Verify consent, preference, export, correction, deletion, retention, and legal-hold flows.
9. Verify high-impact moderation includes human review and appeal.
10. Run available SAST, dependency, licence, secret, container, and dynamic checks.
11. Record legal/policy items requiring qualified review.

## Blockers

- Critical/high unresolved vulnerability without approved exception.
- Broken authorization or public PII exposure.
- Hardcoded secret/backdoor.
- Real identity/production data in test.
- Unverified payment success.
- Missing admin MFA for privileged role.
- No deletion/privacy process for collected data.

## Output

Findings with exploitability/impact/evidence, remediation, retest, residual risk, and release recommendation.
