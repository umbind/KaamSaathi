# KaamSaathi Antigravity Execution Pack

This package turns the KaamSaathi product brief into an execution-ready, skills-first Google Antigravity workspace.

## Recommended use

1. Create or open the KaamSaathi repository as an Antigravity workspace.
2. Copy this package into the repository root without removing the `.agents` directory.
3. Place the original business research and product brief under `docs/research/` and `docs/project/`.
4. Open `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md` and submit its **Bootstrap Instruction** to Antigravity.
5. The agent must first inspect the repository, establish project status, validate assumptions, and produce an implementation plan. It must not jump directly into feature coding.
6. Use the `kaamsaathi-orchestrator` skill for complete project execution. Use the vertical-slice and audit skills for subsequent iterations.

## Skills-first design

This package intentionally uses:

- `.agents/agents.md` for specialized project personas.
- `.agents/rules/` for persistent workspace constraints.
- `.agents/skills/<skill-name>/SKILL.md` for repeatable execution protocols.

It does not depend on legacy workflow files. A temporary slash-command workflow may be added by the owner if required, but every essential process must remain available as an Agent Skill.

## Core documents

- `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`: complete execution contract.
- `docs/product/FUNCTIONAL_WORKFLOW_SPEC.md`: actor-by-actor functional journeys.
- `docs/product/STATE_MACHINES.md`: authoritative lifecycle transitions.
- `docs/product/BUSINESS_RULES.md`: server-enforced marketplace rules.
- `docs/product/ACCEPTANCE_CRITERIA.md`: testable functional acceptance criteria.
- `docs/quality/END_TO_END_TEST_MATRIX.md`: release-critical scenario matrix.
- `docs/operations/SUPPORT_AND_SAFETY_WORKFLOWS.md`: support, dispute, fraud, and safety operations.
- `docs/architecture/API_AND_DATA_CONTRACT_CHECKLIST.md`: implementation contract checklist.

## Non-negotiable owner approvals

The agent must stop only for genuinely irreversible, legally sensitive, production, or paid-resource decisions, including real payment settlement, production release, final legal documents, real identity documents, production databases, destructive operations, and material paid cloud commitments.

## Product defaults

Unless an approved project decision overrides them:

- One role-aware Android application for customer and provider modes.
- Responsive public website and separate secure admin portal.
- Kotlin, Jetpack Compose, TypeScript, a structured modular backend framework, PostgreSQL/PostGIS, and a modular-monolith architecture.
- Hindi and English at launch.
- One configurable pilot location.
- Initial service categories: electrician, plumber, and appliance repair.
- Cash and external UPI/approved PSP references; no proprietary wallet or unlicensed escrow.
- Mobile OTP authentication; privileged admin MFA.
- Neighbourhood/locality precision by default; no continuous background location tracking.
