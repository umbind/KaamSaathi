# KaamSaathi Decision Log

| Decision ID | Date | Status | Decision | Options considered | Rationale/evidence | Consequences | Owner | Related requirements/ADR | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
| DEC-001 | 2026-09-13 | `ACCEPTED` | Launch geography covers all 75 districts of Uttar Pradesh | 1. Single Tier-2 city<br>2. All districts of Uttar Pradesh | Explicit owner directive. State-wide coverage model with regional administrative/cluster subdivisions. | Coverage catalogue seeded for UP districts (e.g. Lucknow, Kanpur, Varanasi, Agra, Prayagraj, etc.). | Umesh Kumar | Section 3.1, APP-003 | None |
| DEC-002 | 2026-09-13 | `ACCEPTED` | Consent-gated direct-number reveal as interim production communication; stubbed masking in dev/test | 1. Mandatory masked calling<br>2. Consent-gated direct reveal<br>3. In-app chat | Masked calling vendor not yet selected; unblocks booking lifecycle without phone number leakage to unselected providers. | Must capture explicit consent audit records prior to number reveal. | Architect / Security | Section 3.6, ASM-004 | None |
| DEC-003 | 2026-09-13 | `ACCEPTED` | Dev/test MockOtpProvider implementation alongside stubbed real vendor | 1. Wait for production SMS vendor<br>2. Dual-implementation interface (MockOtpProvider + SmsOtpProvider) | Explicit owner approval. Unblocks Slice 1 development and CI testing immediately without external spend. | MockOtpProvider wired in dev/test; real SMS vendor stays behind APP-001. | Umesh Kumar | Section 3.4, APP-001, ASM-005 | None |
| DEC-004 | 2026-09-13 | `ACCEPTED` | Modular monolith architecture (Node/TypeScript/NestJS backend + Kotlin/Compose Android + pnpm workspace) | 1. Microservices<br>2. Modular monolith | Avoids premature distributed system complexity; aligns with Master Contract Section 2 & 7. | Clear module boundaries, strict transactional integrity, single deployable backend unit for MVP. | Architect | Section 2, TARGET_REPOSITORY_STRUCTURE | None |


Statuses: PROPOSED, ACCEPTED, SUPERSEDED, REJECTED, WAITING_FOR_OWNER_APPROVAL.

Use a formal ADR for architecture/authentication/database/app split/matching/location/payment/communication/verification/reviews/analytics/cloud/search/retention/fee-model decisions.

