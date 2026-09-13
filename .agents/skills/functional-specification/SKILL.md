---
name: functional-specification
description: Converts KaamSaathi product workflows, business rules, and state machines into traceable requirements, screen/API behavior, edge cases, and acceptance criteria. Use before implementing or changing marketplace functionality.
---

# Functional Specification

## Goal

Produce an unambiguous, testable functional baseline for the requested scope.

## Steps

1. Read the master contract, functional workflow, state machines, business rules, support workflows, and existing implementation.
2. Assign stable requirement IDs by domain and capability.
3. For every workflow define:
   - Actor and authorization.
   - Trigger and preconditions.
   - Happy, alternate, and failure paths.
   - State transitions.
   - Data inputs/outputs.
   - Notifications.
   - Audit and analytics events.
   - Offline/retry/idempotency behavior.
   - Accessibility/localization requirements.
   - Security/privacy impact.
4. Identify ambiguous or conflicting rules. Resolve with the source-of-truth order; record decisions.
5. Define every screen state: loading, empty, error, permission denied, offline, pending sync, partial success, success, and stale/conflict.
6. Write Given/When/Then acceptance criteria, including authorization and negative criteria.
7. Update traceability and backlog.
8. Freeze the specification version before coding.

## Decision tree

- **Existing behavior conflicts with authoritative state machine?** Specify migration/fix; do not normalize the bug as intended behavior.
- **Requirement needs real-user evidence?** Mark assumption and create validation activity; choose reversible MVP behavior.
- **Legal/policy decision missing?** Use conservative placeholder and flag legal review; do not invent compliance.
- **New feature changes money, safety, identity, or high-impact moderation?** Require expanded threat/privacy/operations review and likely owner approval.

## Completion criteria

- No undefined actor, transition, amount source, ownership rule, or failure state.
- Acceptance criteria can drive automated/manual tests.
- Requirement-to-test traceability exists.
- Scope and exclusions are explicit.
