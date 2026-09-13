---
name: release-readiness
description: Performs the final KaamSaathi release-candidate audit across functionality, tests, security, privacy, accessibility, localization, performance, operations, staging, costs, legal approvals, and handover. Use before beta or production progression.
---

# Release Readiness

## Steps

1. Identify target stage: internal QA, closed pilot, limited-location beta, or production.
2. Read status, traceability, defects, risks, approvals, release checklist, known limitations, and deployment evidence.
3. Rerun clean builds and all release-critical P0/P1 tests.
4. Verify critical customer/provider/admin journeys and all state-machine invariants.
5. Verify security gates, privacy requests, admin MFA, secrets, upload controls, authorization, and vulnerability status.
6. Verify Hindi/English, accessibility, text scaling, low-end device, low network, offline/retry, crash/ANR, API latency, and web performance evidence.
7. Verify monitoring, alerts, backups, restore, rollback, incident/support/fraud/safety runbooks, and on-call ownership.
8. Verify cloud cost guardrails and no unapproved paid/production action.
9. Verify app-store/public-site policy and legal prerequisites for the target stage.
10. Produce a stage-specific verdict:
   - RELEASE_CANDIDATE_READY
   - PILOT_READY_WITH_LIMITATIONS
   - NOT_READY
   - WAITING_FOR_OWNER_APPROVAL

## Production prohibition

Do not declare production-ready unless legal documents, privacy, provider terms, grievance process, security review, support staffing, backup/restore, monitoring, billing, data controls, Play/public release, and owner approvals are actually complete.

## Handover output

- Implemented/verified/deployed/mocked/not-run/pending/blocked.
- Open defects and risks.
- Approval/legal items.
- Exact manual steps and commands.
- Rollback.
- 30/60/90-day plan.
