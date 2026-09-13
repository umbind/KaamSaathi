# KaamSaathi Milestone Delivery Plan

## Delivery Method

Implement tested vertical slices. Do not complete every backend layer before user-visible workflows. Each milestone exits only after traceability, implementation, tests, security review, documentation, and evidence meet the defined gate.

## M0 — Discovery and Control Plane

**Outputs:** Repository inventory, project status, assumptions, decisions, risks, approvals, dependencies, traceability, Antigravity agents/rules/skills.

**Exit gate:** Existing work classified; build/test/tool status evidenced; no secret exposed; next sequence approved by orchestrator.

## M1 — Product and Functional Baseline

**Outputs:** PRD/MVP, personas, JTBD, information architecture, user flows, state machines, business rules, role matrix, acceptance criteria, field-validation plan.

**Exit gate:** Every MVP capability has actor, state, failure, security/privacy, analytics, and acceptance criteria; scope frozen.

## M2 — Architecture and Contract Freeze

**Outputs:** ADRs, module boundaries, data model/dictionary, PII inventory, OpenAPI, events, authorization, migrations, performance/cost budgets, environment strategy.

**Exit gate:** Contract/schema validation; concurrency and critical invariants defined; parallel file ownership safe.

## M3 — Foundation

**Scope:** Monorepo, Kotlin app shell, backend/web/admin shells, database migration framework, auth foundation, localization/design system, CI, lint/type/tests, observability, feature flags, synthetic seed.

**Exit gate:** Clean reproducible builds, local setup, authentication skeleton, no secrets, basic smoke tests.

## M4 — Profiles, Catalogue, Coverage, and Verification

**Scope:** Customer profile; provider draft; services/areas/availability; category/coverage config; verification submission/queue/decision/appeal; eligibility.

**Exit gate:** P0 authorization and evidence privacy pass; provider not discoverable before eligibility; Hindi/English/accessibility verified.

## M5 — Discovery, Requests, and Matching

**Scope:** Category/problem search, provider list/profile, targeted and matching requests, attachments, controlled lead batches, no-match/support.

**Exit gate:** Exact address/phone protected; idempotent request; hard filters/ranking version; offline draft/retry tests.

## M6 — Quotes and Booking

**Scope:** Lead response, quote versions, comparison, atomic acceptance, booking, contact hand-off, reschedule/cancel.

**Exit gate:** Concurrency test proves exactly one accepted quote/booking; accepted quote immutable; contact privacy pass.

## M7 — Job Lifecycle, Change Orders, Completion, and Payment Records

**Scope:** En route, arrival, start confirmation, in progress, change order, completion/correction/dispute, cash/UPI/PSP-safe payment states, receipt.

**Exit gate:** Invalid state skips denied; amount ceiling enforced; UPI intent not treated as success; retry/concurrency pass.

## M8 — Reviews, Complaints, Safety, Fraud, and Support

**Scope:** Verified reviews, moderation, complaints/disputes, no-shows, payment mismatch, safety escalation, interim action, appeals, support queues.

**Exit gate:** Restricted evidence/role access; high-impact human review/appeal; support runbooks and metrics.

## M9 — Admin, Privacy, and Public Website

**Scope:** Admin MFA/RBAC, audit, category/coverage/content/flags, privacy export/deletion, genuine public pages, help/grievance, SEO basics.

**Exit gate:** Direct API authorization tests; no private indexing/bundle data; deletion/export tests; accessibility/SEO validation.

## M10 — Hardening and Staging

**Scope:** Full threat model, SAST/dependency/secret/container scans, low-end/low-network/load/performance, backup/restore, monitoring/alerts, deployment/rollback, incident response.

**Exit gate:** Zero critical/high blockers; P0/P1 pass; approved staging verified; backup/restore and rollback evidence.

## M11 — Closed Pilot Readiness

**Scope:** Store assets, data-safety/account-deletion preparation, support staffing, verification operations, pilot categories/location configuration, analytics dashboard, cost guardrails, field-pilot script.

**Exit gate:** Pilot legal/operational approvals for scope; real coverage/supply; support and T&S ready; owner approval.

## M12 — Release-Candidate Audit and Handover

**Scope:** Independent rerun, defect/risk review, known limitations, exact manual steps, 30/60/90-day plan.

**Exit gate:** Auditor issues stage-specific verdict; no claim beyond evidence.

## Suggested Slice Order within Each Milestone

1. Contract/schema and test data.
2. Backend domain and authorization.
3. Android customer/provider UI.
4. Admin/support UI.
5. Notifications/events/analytics.
6. Automated tests.
7. Independent QA/security review.
8. Documentation/evidence.
