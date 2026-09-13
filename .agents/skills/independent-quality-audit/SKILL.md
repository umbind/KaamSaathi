---
name: independent-quality-audit
description: Independently reviews and executes tests against a KaamSaathi change for functional correctness, edge cases, authorization, accessibility, localization, reliability, and maintainability. Use after implementation and before integration/release.
---

# Independent Quality Audit

## Independence

The auditor must not be the primary author of the reviewed change.

## Steps

1. Read requirements, acceptance criteria, state machines, business rules, diff, and implementation evidence.
2. Reproduce clean build/setup.
3. Inspect code for missing rules, client-only enforcement, concurrency, stale state, retry duplication, unsafe logging, missing localization, inaccessible controls, and hidden coupling.
4. Rerun relevant unit, integration, contract, migration, UI/E2E, authorization, accessibility, localization, offline/retry, performance, and security tests.
5. Add adversarial tests for missing cases.
6. Verify analytics/audit/notification behavior and PII minimization.
7. Classify findings: Severity 1, 2, 3, or 4.
8. Require fixes; rerun failed checks.
9. Issue verdict:
   - VERIFIED
   - FAILED_VERIFICATION
   - BLOCKED
   - NOT_RUN_WITH_PREREQUISITES

## High-priority challenges

- Double tap/retry creates duplicates.
- Two quotes accepted concurrently.
- Provider/customer accesses another user's record.
- Provider skips job states or inflates final amount.
- Client claims UPI success.
- Offline queue shows false success.
- Admin UI hides action but API allows it.
- Notification exposes address/complaint.
- Hindi/large-font layout truncates critical action.
- Process death loses active booking/draft.

## Output

Audit report with commands, actual results, evidence, findings, fixes, rerun results, and verdict.
