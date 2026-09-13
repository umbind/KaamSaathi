# KaamSaathi Approvals Register

## Named Project Owner (Section 8 Gatekeeper)

- **Designated Human Owner:** Umesh Kumar
- **Designated Role / Title:** Project Owner & Product Sponsor
- **Contact Channel / Method:** Antigravity Direct Pair Programming Session
- **Expected Response Window:** 24–48 hours

*Confirmed and designated on 2026-09-13.*

---

## Approvals Register

| Approval ID | Activity/decision | Why approval required | Prepared artifacts/commands | Cost/risk | Approver | Requested date | Decision/date | Status |
|---|---|---|---|---|---|---|---|---|
| APP-001 | SMS/OTP Provider Strategy (Dev MockOtpProvider approved; Prod SMS deferred) | Incurs per-message messaging charges and production API credentials | `MockOtpProvider` in local/CI; vendor abstraction | Operational SMS spend | Umesh Kumar | 2026-09-13 | 2026-09-13 | `APPROVED` (Mock in Dev/CI; Prod vendor gated) |
| APP-002 | Masked-Calling Vendor Selection | Incurs virtual number lease and per-minute voice telephony costs | Masked calling trade-off matrix | Voice telephony spend & pilot coverage | Umesh Kumar | 2026-09-13 | | `WAITING_FOR_OWNER_APPROVAL` |
| APP-003 | Pilot & Launch Geography: All Districts of Uttar Pradesh | Public operational focus, provider onboarding, and legal/licensing context | UP 75-district coverage catalog & seed clusters | Operational concentration & field validation | Umesh Kumar | 2026-09-13 | 2026-09-13 | `APPROVED` (All 75 Districts of UP) |

| APP-004 | Cloud / Database Infrastructure Provisioning | Incurs cloud infrastructure billing for PostgreSQL/PostGIS & object storage | Terraform scripts / Docker compose | Cloud service spend | Named Owner | Pending M3 | | `NOT_STARTED` |
| APP-005 | Production Payment Gateway / PSP Integration | Financial settlement, compliance, and merchant onboarding | PSP integration spec & sandbox tests | Financial & regulatory liability | Named Owner | Pending M7 | | `NOT_STARTED` |
| APP-006 | Legal & Terms of Service Sign-off | Consumer marketplace rules, data protection (DPDP Act), privacy policy | Draft legal terms & grievance workflow | Regulatory & civil liability | Named Owner + Legal | Pending M9 | | `NOT_STARTED` |
| APP-007 | Google Play & Public Web Production Release | Public release to real consumers and service providers | RC audit report & release artifacts | Brand, operational, and commercial exposure | Named Owner | Pending M12 | | `NOT_STARTED` |

Approval-required categories include paid cloud commitments, domains/certificates/credits/subscriptions, production data, real identity documents, destructive operations, production releases, real payment settlement, final legal policies, Aadhaar/biometrics, nonapproved secret storage, cost-incurring production sidecars, and real-user fees.

