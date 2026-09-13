# Vertical Slices 7 & 8 — Admin Operations and Public Web Portal

Status: `VERIFIED`
Owner: @orchestrator (assigned to @admin, @web, @backend)
Depends on: Slice 6 (Reviews, Complaints, and Safety) `VERIFIED`
Blocks: Milestone 10 (Hardening & Staging)

This document defines the scope, operational workflows, public web architecture, SEO structured data, acceptance criteria, and verification test matrix for **Slices 7 & 8 (Admin Operations and Public Web Portal)** per `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`.

---

## 1. Scope

- **REQ-A-02 Catalogue & Category Management**:
  - Administrative creation and updates of service categories (`POST/PUT /api/v1/admin/categories`).
  - Dual-language names (`name_en`, `name_hi`), icon identifiers, display ordering, and active/inactive status toggling.
- **REQ-A-03 Coverage & Pilot Location Control**:
  - Administrative control over Uttar Pradesh district pilot cluster availability.
- **REQ-A-04 Dispute & Safety Operations**:
  - Admin dispute review and formal resolution (`POST /api/v1/admin/disputes/:id/resolve` with `RESOLVE` or `DISMISS` actions and mandatory resolution notes).
  - Automatic release of booking dispute audit lock upon resolution of all open disputes.
  - Admin safety incident resolution and escalation to state authorities (`POST /api/v1/admin/safety/:id/resolve` with `RESOLVE` or `ESCALATE_POLICE`).
  - Provider disciplinary enforcement (`POST /api/v1/admin/providers/:id/restrict` setting provider profile status to `RESTRICTED` and availability to `OFFLINE`).
- **Administrative Audit Logs**:
  - Querying immutable audit records by entity name and actor (`GET /api/v1/admin/audit-logs`).
- **Public Web Portal (Slice 8)**:
  - SEO-optimized landing page templates for all 75 Uttar Pradesh districts.
  - JSON-LD Structured Data generation adhering to `schema.org/Service` and `LocalBusiness`.
  - Non-negotiable Zero Guarantees disclaimer banner on all public web routes.
  - Emergency safety hotline prominence: UP 112 (Police) and 1090 (Women Power Line).
  - Deep linking into mobile Android app (`kaamsaathi://request?category=...&district=...`).

---

## 2. Acceptance Criteria (Testable)

1. **AC-P7-01 (RBAC Security Invariant)**:
   - Non-admin callers attempting any administrative action are rejected with `403 FORBIDDEN`.
2. **AC-P7-02 (Admin Dispute Resolution & Lock Release)**:
   - Admin can resolve or dismiss disputes with non-empty resolution notes; resolving all disputes releases the booking audit lock.
3. **AC-P7-03 (Admin Safety Escalation)**:
   - Admin can escalate high-severity incidents to police/authorities (`ESCALATED_AUTHORITIES`), recording full audit metadata.
4. **AC-P7-04 (Provider Disciplinary Restriction)**:
   - Admin can restrict rogue providers, forcing their status to `RESTRICTED` and availability to `OFFLINE`.
5. **AC-P7-05 (Admin Category Lifecycle)**:
   - Admin can create new service categories and update existing categories with versioned attributes.
6. **AC-P7-06 (Admin Audit Querying)**:
   - Admin can query immutable audit logs filtered by entity name with correlation ID tracking.
7. **AC-P7-07 (SEO Structured Data Generation)**:
   - Public web client generates valid `schema.org/Service` and `LocalBusiness` JSON-LD metadata for Uttar Pradesh districts.
8. **AC-P7-08 (Zero Guarantees & Safety Disclaimer Invariant)**:
   - All public landing page templates prominently render the Zero Guarantees banner and emergency contacts (UP 112, 1090).

---

## 3. Verification Evidence

Automated test suites ran and passed 100% cleanly:
- `services/api/src/test/slice7-admin-operations.test.ts`: 6/6 tests passing.
- `apps/admin/src/index.test.ts`: 4/4 tests passing (MFA mandate, session guards, dispute/safety/category client methods).
- `apps/web/src/index.test.ts`: 3/3 tests passing (Language switching, JSON-LD schema generation, Zero Guarantees banner & emergency contacts).
- Monorepo-wide total: 91 tests passing with 0 failures across all packages.
