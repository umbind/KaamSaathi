# Security, Privacy, Fraud, and Safety Rules

Activation: Always On

- Apply least privilege, server-side authorization, admin MFA, session revocation, OTP throttling, rate limiting, audit logs, secure secret injection, encryption in transit/at rest, and PII masking.
- Prevent user enumeration in OTP, login, passwordless, support, and recovery responses.
- Test object-level and function-level authorization for every protected API.
- Exact home address, phone number, identity evidence, internal fraud signals, and support notes are restricted data.
- Request the minimum location precision and permission necessary. No continuous background location in the MVP.
- Do not collect Aadhaar, biometric data, or other sensitive identifiers without legal review, owner approval, necessity analysis, and retention controls.
- Do not use real identity documents or production personal data in development/test.
- Validate and scan uploads where appropriate; use signed URLs and non-public buckets.
- Maintain explicit consent records for analytics, communication hand-off, public provider profile, precise location, and optional marketing.
- Provide data export, correction, deactivation, deletion, and appeal workflows.
- Safety reporting must be prominent, but the product must not imply that KaamSaathi is an emergency-response service.
- High-severity safety, harassment, account takeover, data exposure, and malicious-provider reports require immediate operational escalation and evidence preservation.
- Fraud signals inform review; they do not automatically prove wrongdoing.
- Policy drafts require qualified legal review before production acceptance.
