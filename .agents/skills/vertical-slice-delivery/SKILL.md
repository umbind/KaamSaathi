---
name: vertical-slice-delivery
description: Implements one KaamSaathi feature slice end to end across contracts, backend, database, Android/web/admin UI, tests, observability, documentation, and evidence. Use only after the slice is ready and contracts are frozen.
---

# Vertical Slice Delivery

## Input

A ready slice with requirement IDs, frozen acceptance criteria, UX states, API/data impact, security/privacy assessment, analytics, rollout, and rollback.

## Steps

1. Create a short-lived branch/worktree and declare file ownership.
2. Reconfirm requirement and state-machine transitions.
3. Update contracts first.
4. Add/modify schema and migrations with safety tests.
5. Implement backend domain logic and server authorization.
6. Implement Android and/or web/admin UI with all states.
7. Add localized content and accessibility semantics.
8. Add analytics/audit/notifications without PII leakage.
9. Add unit, integration, contract, UI/E2E, negative authorization, retry/idempotency, localization, accessibility, and failure tests.
10. Run format/lint/type/static/security/secret/dependency/build/test commands.
11. Test low network/offline/process-death behavior when relevant.
12. Update docs, traceability, changelog, status, and evidence.
13. Mark `IMPLEMENTED_NOT_VERIFIED` and hand off to independent review.

## Constraints

- Do not silently expand scope.
- Do not weaken a server rule to make UI tests pass.
- Do not skip failing tests or suppress warnings without documented justification.
- Do not reuse production data.
- Do not merge until independent review passes.

## Exit package

- Requirement/test mapping.
- Files changed.
- Migration/rollback details.
- Commands/results.
- Screenshots/recordings where useful.
- Known limitations and residual risks.
