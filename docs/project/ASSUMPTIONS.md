# KaamSaathi Assumptions

| ID | Assumption | Why needed | Evidence status | Impact if wrong | Validation method | Owner | Target date | Status |
|---|---|---|---|---|---|---|---|---|
| ASM-001 | Launch geography is Uttar Pradesh (all 75 districts configured, with initial seed clusters) | Operational boundary | Validated by owner Umesh Kumar | Public pages/config | Owner decision & district seeding | Umesh Kumar | 2026-09-13 | VALIDATED |

| ASM-002 | MVP categories are electrician, plumber, appliance repair | Narrow testable launch | Prior recommendation | Catalogue/verification/ops | Field interviews and supply check | Product/Ops | 2026-09-20 | OPEN |
| ASM-003 | One role-aware Android app is suitable for MVP | Lower maintenance/download burden | Architecture default | Navigation/security | Prototype and user testing | Product/Android | 2026-09-30 | OPEN |
| ASM-004 | Interim communication model uses consent-gated direct phone number reveal until a masked-calling vendor is approved | Unblock communication workflow in dev/test/staging | Architectural fallback | Privacy disclosure & user consent UX | User testing & vendor cost review | Product/Security | 2026-09-20 | OPEN |
| ASM-005 | Dev/test environment uses MockOtpProvider (fixed/logged OTP) with identical rate limiting/expiry logic | Unblock Slice 1 development without SMS spend or vendor lock-in | Dev/test carve-out | SMS delivery fidelity | Unit/integration test against mock | Backend/Security | 2026-09-15 | OPEN |
| ASM-006 | Local backend uses Node.js 24 + TypeScript with embedded/in-memory PostgreSQL emulation for testing pending host PostgreSQL setup | Host lacks native psql/Docker; enables immediate local execution | Tooling inventory | Minor PostGIS function differences | Contract & integration test validation | Backend/Architect | 2026-09-15 | OPEN |
| ASM-007 | Android app targets minSdk 24 and targetSdk 34 for maximum low-cost Indian device compatibility and Play Store compliance | Device compatibility in pilot | Android ecosystem stats | Build failures or device incompatibility | Android emulator and device tests | Android Lead | 2026-09-30 | OPEN |

## Rule

For every non-blocking unknown, add an assumption, choose the safest reversible default, and continue. Do not disguise an assumption as verified fact.

