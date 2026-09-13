---
name: kaamsaathi-orchestrator
description: Orchestrates the complete KaamSaathi product lifecycle across discovery, specification, architecture, vertical-slice implementation, independent review, security, staging, release evidence, and handover. Use for project initialization, milestone planning, or end-to-end delivery.
---

# KaamSaathi Orchestrator

## Goal

Deliver the KaamSaathi marketplace as verified vertical slices while preserving functional integrity, approvals, safety, documentation, traceability, and evidence.

## Mandatory inputs

- `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`
- `.agents/agents.md`
- `.agents/rules/**`
- `docs/product/FUNCTIONAL_WORKFLOW_SPEC.md`
- `docs/product/STATE_MACHINES.md`
- `docs/product/BUSINESS_RULES.md`
- Existing repository code/docs/tests/infrastructure

## Execution sequence

1. Activate `workspace-discovery`.
2. Classify repository: NEW, PARTIAL, or EXISTING.
3. Create/update status, assumptions, decisions, risks, approvals, dependencies, and traceability. Confirm a named owner is recorded in `docs/project/APPROVALS.md`; if absent, raise as the first blocking item.
4. Activate `functional-specification`; establish requirement IDs and frozen MVP baseline. **Stop and request human sign-off on the frozen baseline before Step 5.**
5. Activate `architecture-contracts`; freeze module/API/event/design contracts. **Stop and request human sign-off on the frozen contracts before Step 6.**
6. Create milestone dependency graph and vertical-slice order.
7. Assign non-overlapping worktrees/files to specialized agents.
8. Implement Slice 1 (identity, role, onboarding) first:
   - Run `vertical-slice-delivery`.
   - Run `independent-quality-audit` by a different agent.
   - Run `security-privacy-audit` for affected risk areas.
   - Fix and rerun until gates pass or status becomes BLOCKED.
   - Once `VERIFIED`, **stop and request human sign-off before starting Slice 2.**
9. For each remaining slice, repeat the run/audit/fix loop from Step 8.
10. Integrate in documented merge order.
11. Deploy only to an approved non-production environment.
12. Run `release-readiness`.
13. Produce handover and 30/60/90-day plan.

## Decision tree

- **Non-blocking unknown?** Choose safest reversible default, record assumption, continue.
- **Conflict with existing approved ADR?** Preserve ADR unless requirement/security/legal evidence demands a change; create superseding ADR.
- **Paid/production/real-data/legal/destructive action?** Prepare fully, mark WAITING_FOR_OWNER_APPROVAL, continue other work.
- **Shared contract not frozen?** Do not parallelize implementation.
- **Test not run?** Mark NOT_RUN, never PASS.
- **Critical failure?** Stop release progression, create defect and rollback/containment plan.

## Required milestone report

- Scope and requirement IDs.
- Owners/worktrees/file boundaries.
- Dependencies and risks.
- Files changed.
- Commands and results.
- Test/security/performance evidence.
- Status by quality gate.
- Known limitations.
- Next unblocked work.
- Approval requests, if any.

## Prohibited

- Coding before repository inspection and functional baseline.
- Concurrent writes to the same files.
- Self-approval as independent reviewer.
- Production claims without verification.
- Fake user/research/integration evidence.
