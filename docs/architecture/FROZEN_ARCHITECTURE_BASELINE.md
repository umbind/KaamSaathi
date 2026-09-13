# KaamSaathi — Frozen Architecture & Interface Contracts Baseline (M2)

- **Document Version**: `1.0.0-frozen`
- **Freeze Date**: `2026-09-13`
- **Designated Project Owner**: Umesh Kumar
- **Status**: `PENDING_HUMAN_CHECKPOINT_2_SIGN_OFF`

---

## 1. Executive Summary & Architectural Integrity

This document formally bundles and freezes the **Phase 3 Architecture and Interface Contracts** for **KaamSaathi**. With this baseline frozen, independent parallel development of the **Android client**, **Modular Monolith API**, **Admin Portal**, **Public Website**, and **Automated Test Harnesses** can proceed without contract drift or merge conflicts.

### Authoritative Architecture Package
1. [`ADR-001: Monorepo Architecture & Domain Module Boundaries`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/adr/ADR-001-monorepo-and-module-boundaries.md)
2. [`ADR-002: Identity, Authentication & Session Security`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/adr/ADR-002-identity-authentication-and-session-security.md)
3. [`ADR-003: Data Architecture, PostgreSQL/PostGIS & Migration Strategy`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/adr/ADR-003-data-architecture-postgresql-postgis-and-migrations.md)
4. [`ADR-004: Server-Driven Lifecycle, Idempotency & Concurrency`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/adr/ADR-004-server-driven-lifecycle-idempotency-and-concurrency.md)
5. [`ADR-005: Privacy, Data Minimization & Consent Architecture`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/adr/ADR-005-privacy-data-minimization-and-consent-architecture.md)
6. [`ADR-006: Dual-Language Localization & Accessibility`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/adr/ADR-006-dual-language-localization-and-accessibility.md)
7. [`Physical Data Model & Data Dictionary (PostgreSQL/PostGIS)`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/DATA_MODEL_AND_DICTIONARY.md)
8. [`Authoritative OpenAPI 3.1 REST API Specification`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/openapi-v1.yaml)
9. [`Event and Immutable Audit Log Contracts`](file:///C:/Users/Umesh%20Kumar/.gemini/antigravity/scratch/KaamSaathi/docs/architecture/EVENT_AND_AUDIT_CONTRACTS.md)

---

## 2. Core Architectural Invariants (Locked)

1. **State Ownership**: Server owns all state machines (`User`, `Request`, `Quote`, `Booking`, `ChangeOrder`, `Dispute`). Clients submit transition requests; client logic never decides price, completion, or authorization.
2. **Atomic Quote Acceptance**: A service request can result in **exactly one** accepted quote and booking. Competing quotes are atomically declined within the same transactional boundary.
3. **Price Immutability**: Dispatched quotes and accepted booking prices cannot be modified without a customer-approved **Change Order**.
4. **Data Minimization & Address Privacy**: Exact customer address is revealed only to the single booked provider upon quote acceptance. Discovery and quoting expose coarse locality/PIN only.
5. **Anti-Enumeration OTP**: Constant-time response envelopes prevent account probing. `MockOtpProvider` active in dev/CI; real SMS vendor gated behind `APP-001`.
6. **Interim Communication Fallback**: Explicit consent-gated direct number reveal with audit recording, until virtual telephony vendor is approved under `APP-002`.
7. **Monetary & Time Representation**: All currency in integer minor units (paise, `INR`). All timestamps in UTC (`TIMESTAMPTZ`), displayed in `Asia/Kolkata` (IST).
8. **Accessibility & Localization**: Hindi (`hi`) and English (`en`) launch content. Minimum 48dp touch targets; zero icon-only critical controls.

---

## 3. Human Checkpoint 2 Sign-Off Declaration

With this package, **Phase 3 (Architecture and Contract Freeze)** is complete and locked.
Upon sign-off from Project Owner Umesh Kumar, the project advances to **Phase 4 (Foundation Slice Monorepo Setup)** and **Phase 5 (Vertical Slice 1: Identity, Role, and Onboarding)**.
