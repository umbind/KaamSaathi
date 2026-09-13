---
name: architecture-contracts
description: Designs and validates KaamSaathi module boundaries, ADRs, data models, OpenAPI contracts, authorization, events, migrations, performance budgets, and integration contracts. Use before parallel implementation or architectural change.
---

# Architecture and Contracts

## Goal

Create stable, secure contracts that allow Android, backend, web/admin, QA, and operations work to proceed independently.

## Steps

1. Read functional requirements and inspect existing architecture.
2. Write/confirm ADRs for app structure, backend framework, database, authentication, location, matching, communication, payment, verification, review, analytics, deployment, and retention.
3. Define modular-monolith domains and dependency direction.
4. Create conceptual/logical/physical data model and data dictionary.
5. Classify every field for PII/sensitivity, purpose, access, retention, deletion, and logging/analytics prohibition.
6. Define OpenAPI operations, schemas, stable error format, pagination, idempotency, versioning, and rate limits.
7. Define event/audit schemas and delivery semantics.
8. Define authorization matrix at action/object/field level.
9. Define transaction boundaries and concurrency controls for quote acceptance, booking creation, state transitions, payment callbacks, review uniqueness, and privacy processing.
10. Define migration, seed, backup, restore, rollback/forward-fix, and compatibility plan.
11. Define performance/cost budgets and observability.
12. Run contract/schema checks where tooling exists.

## Mandatory invariants

- Exactly one accepted quote per unsplit request.
- Accepted quote and accepted change-order versions are immutable.
- Server owns critical state transitions.
- Private address/phone/evidence access is authorization-scoped.
- Payment success cannot rely on client UPI return.
- Reviews require eligible transactions and unique reviewer/booking pair.
- Admin APIs enforce authorization independently of UI.

## Output

ADRs, architecture diagrams, module ownership, schema/migrations plan, OpenAPI, event/audit contracts, authorization matrix, and contract freeze record.
