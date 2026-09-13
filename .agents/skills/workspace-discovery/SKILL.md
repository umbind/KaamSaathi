---
name: workspace-discovery
description: Inspects a KaamSaathi workspace, repository, tools, existing decisions, tests, infrastructure, secrets patterns, and integrations before planning or coding. Use at project start, handover, or after major repository changes.
---

# Workspace Discovery

## Goal

Establish a factual repository and capability inventory without modifying business logic.

## Steps

1. Inspect root and hidden files, Git status/history/branches/worktrees, package/build files, Android modules, backend/web/admin code, docs, tests, CI, IaC, environment examples, database migrations, and generated artifacts.
2. Identify existing architecture, language/framework versions, dependency managers, coding conventions, API specs, schemas, feature flags, and observability.
3. Search for credentials, secrets, unsafe examples, production endpoints, personal data, and hardcoded identifiers without printing secret values.
4. Run harmless version/help/status commands needed to understand tooling.
5. Inventory Antigravity workspace rules, skills, MCP connections, browser access, Android tooling, cloud auth, and account limitations.
6. Map existing implementation to KaamSaathi domains and requirements.
7. Identify conflicts, missing foundations, broken builds/tests, stale docs, and unverified claims.
8. Create/update:
   - `PROJECT_STATUS.md`
   - `docs/project/ASSUMPTIONS.md`
   - `docs/project/DECISION_LOG.md`
   - `docs/project/RISK_REGISTER.md`
   - `docs/project/DEPENDENCIES.md`
   - `docs/project/APPROVALS.md`
   - `docs/project/REQUIREMENTS_TRACEABILITY_MATRIX.md`
9. Classify every major area: VERIFIED, IMPLEMENTED_NOT_VERIFIED, NOT_STARTED, BLOCKED, or DEFERRED.

## Output

A discovery report containing:

- Repository classification.
- Existing useful assets to preserve.
- Build/test status with actual commands.
- Tool/integration inventory.
- Security/data concerns.
- Decision conflicts.
- Recommended next sequence.
- Approval blockers.

## Constraints

- Do not delete, reinitialize, upgrade, migrate, install paid services, or change production resources.
- Do not expose secrets in output.
- Do not infer that an integration works merely because configuration exists.
