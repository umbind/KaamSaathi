# KaamSaathi — Master Antigravity Execution Contract

## Bootstrap Instruction

You are the primary Product Delivery Orchestrator for **KaamSaathi**, a production-grade, Android-first hyperlocal service marketplace for India. Read this file and every referenced document in this repository before making code changes. Then activate the `kaamsaathi-orchestrator` skill and execute all non-blocked work autonomously.

Do not treat this as a demo, hackathon project, tutorial, UI mockup, or sample code exercise. Deliver maintainable, tested, secure, documented software and verifiable evidence.

---

## 1. Mission

Build KaamSaathi so that lower-income and lower-middle-income Indian households can reliably discover or request nearby local service providers, receive clear estimates, book work, track progress, record payment, confirm completion, review the provider, repeat a service, and obtain support when something goes wrong.

Enable local providers to create a trustworthy profile, select services and coverage areas, complete an appropriate verification route, publish availability, receive relevant work requests, submit estimates, manage jobs, record work history, respond to complaints, and improve their local reputation and earnings.

The initial product must be:

- Affordable and simple.
- Hindi- and English-ready.
- Usable on low-cost Android devices.
- Resilient on unstable or intermittent networks.
- Suitable for shared-family phones.
- Trustworthy without making unsupported safety guarantees.
- Privacy-conscious and data-minimizing.
- Accessible to low-literacy and older users.
- Operationally realistic for one pilot geography.
- Scalable through clear module boundaries, not premature microservices.

---

## 2. Required Product Surfaces

Build and maintain these surfaces:

1. **Role-aware Android application**
   - Customer mode.
   - Provider mode.
   - Role switching for users who legitimately use both modes.
   - Offline drafts, retry-safe submissions, cached active jobs, and low-data behavior.

2. **Responsive public website**
   - Product information.
   - Genuine supported service and location pages.
   - Provider registration information.
   - Help, trust, safety, grievance, privacy, and legal-review placeholders.
   - Optional lightweight lead/request flow only when operationally supported.

3. **Secure web admin portal**
   - Provider verification.
   - User and marketplace moderation.
   - Complaint, dispute, fraud, safety, content, location, category, and privacy operations.
   - Least-privilege role-based access and complete audit logging.

4. **Versioned backend API and operational platform**
   - Modular monolith for the initial product.
   - PostgreSQL with geospatial capability.
   - Secure object storage for permitted uploads.
   - Background jobs only where required.
   - Structured logs, metrics, alerts, feature flags, and audit events.

---

## 3. Locked MVP Decisions

Use these defaults unless an already-approved repository decision explicitly overrides them:

### 3.1 Pilot and categories

- One configurable Tier-2/Tier-3 city, district, or compact rural cluster.
- Do not hard-code or publicly claim a pilot city until selected and approved.
- Start with:
  1. Electrician.
  2. Plumber.
  3. Appliance repair.
- Data structures must support additional categories without schema redesign.

### 3.2 Marketplace model

Use a **light-managed, community-verified booking marketplace**:

- KaamSaathi controls provider onboarding, eligibility, matching, work-order records, quote acceptance, job-state transitions, complaint handling, review authenticity, and safety escalation.
- Providers control availability, service radius, lead acceptance, most pricing decisions, and whether to work outside KaamSaathi.
- The platform does not guarantee provider competence or personal safety. Every verification badge must state exactly what was reviewed.
- **This trust-language constraint is locked content.** "Every verification badge must state exactly what was reviewed" and "the platform does not guarantee provider competence or personal safety" are not copywriting to be softened for conversion, tone, or marketing appeal later. Any change to a badge label, safety claim, or trust-related copy that could make KaamSaathi's actual review scope sound broader than it is requires the same sign-off as a legal-content change (product + legal review, recorded in the decision log) — a UX or growth agent cannot loosen this wording unilaterally, however reasonable the motivation seems in the moment.

### 3.3 Application model

- One role-aware Android app for the MVP.
- Separate customer and provider apps require an approved ADR supported by evidence.

### 3.4 Authentication

- Indian mobile number and OTP.
- Secure refresh/session management.
- Re-authentication for high-risk actions.
- Mandatory MFA for privileged admin accounts.
- Do not expose whether an arbitrary phone number is registered.
- In local/dev/test environments, use a mock OTP provider (fixed or logged codes, no real SMS sent) so identity and auth slices can be built and tested without an owner decision or spend. Real SMS/OTP vendor selection and cost commitment stays behind the approval gate in Section 8 and blocks only the production/staging integration, never dev-environment progress.

### 3.5 Location

- Ask for locality, neighbourhood, PIN code, and service radius first.
- Request precise GPS only at the moment it materially improves a user-requested action.
- Do not run continuous background tracking in the MVP.
- Do not reveal a customer's exact service address to unselected providers.

### 3.6 Communication

- No public phone-number display.
- Use masked calling or approved in-app hand-off when feasible.
- When masking is unavailable, reveal numbers only after explicit transaction-related consent and record that consent.
- WhatsApp may be offered as an optional hand-off only after consent; do not make it mandatory.
- Do not create an unmoderated public chat system for the MVP.
- Masked-calling vendor selection is not yet made. Phase 1 research must produce a short comparison (coverage in the pilot geography, per-minute/per-number cost, latency of number provisioning) and record it as an assumption pending owner approval. Until a vendor is approved, build and test the booking/communication flow against a stubbed masking interface in dev/test, and fall back to consent-gated direct-number reveal as the interim production behavior — do not block the communication slice on vendor selection.

### 3.7 Payments

- Support cash records and external UPI intent or an approved PSP integration.
- No proprietary wallet.
- No stored-value balance.
- No unlicensed escrow.
- Never store card data, UPI PIN, bank credentials, or full payment secrets.
- Do not claim payment success based only on launching a UPI application. Confirm through the PSP callback when integrated, or record customer/provider declarations separately.

### 3.8 Languages and content

- English and Hindi launch content.
- Use short sentences and familiar terms.
- Include transliterated aliases where they improve comprehension.
- Never use icon-only critical controls.

---

## 4. Scope Boundary

### 4.1 MVP must include

- Customer and provider OTP onboarding.
- Role selection and role switching.
- Location and coverage configuration.
- Service catalogue and category browsing.
- Provider discovery and targeted requests.
- Matching-based requests.
- Provider profiles and graduated verification signals.
- Provider availability.
- Request creation with description, optional images, preferred time, address, and accessibility/communication notes.
- Provider lead inbox, accept/decline, and decline reason.
- Estimates with itemized charges, validity, timing, and conditions.
- Quote comparison and acceptance.
- Booking and server-controlled job lifecycle.
- Change-order approval for additional work or price changes.
- Call/approved messaging hand-off.
- Cash and UPI payment-reference records.
- Completion confirmation.
- Verified ratings and reviews.
- Complaints, disputes, appeals, and support.
- Saved providers and repeat booking.
- Provider work history and basic earnings-facilitated summary.
- Admin verification, moderation, audit, feature flags, content, coverage, metrics, and privacy requests.
- Account deletion request and data-export workflow.
- Hindi/English localization, accessibility, low-network handling, and analytics consent.

### 4.2 Explicitly out of MVP unless separately approved

- Nationwide launch.
- Wallet, lending, credit scoring, insurance underwriting, or escrow.
- Complex competitive bidding or reverse auctions.
- Dynamic surge pricing.
- Automated worker suspension without human review and appeal.
- Compulsory Aadhaar.
- Biometric identification.
- Background location tracking.
- AI-generated ratings, provider competence claims, or legal/medical advice.
- Children acting as providers.
- Fake marketplace activity, fake reviews, or fabricated coverage.
- Blockchain.
- Microservices without measured need.
- Features added only because they are technically interesting.

---

## 5. Source-of-Truth Order

When documents conflict, use this order:

1. Recorded owner approval.
2. Applicable law, regulator policy, Google Play policy, and security requirement.
3. This master execution contract.
4. `docs/product/STATE_MACHINES.md`.
5. `docs/product/BUSINESS_RULES.md`.
6. `docs/product/FUNCTIONAL_WORKFLOW_SPEC.md`.
7. Approved ADRs and API contracts.
8. Current implementation.
9. Backlog notes and informal comments.

Never silently resolve a material conflict. Record it in the decision log, choose the safest reversible default, and continue unless owner approval is required.

**Material vs. non-blocking test.** A conflict or unknown is **material** — record it, choose the safest reversible default, and check whether it also triggers a Section 8 approval gate — when it touches any of: money or cost commitment, legal/regulatory exposure, real user PII or identity documents, an already-approved ADR or locked decision in Section 3, or irreversible data/infrastructure change. Everything else (naming, internal file layout, wording of an error message, order of independent tasks, a UI micro-copy choice within approved content guidelines) is **non-blocking**: pick the reasonable option, note it in passing, and continue without stopping the pipeline. When genuinely unsure which bucket applies, treat it as material.

---

## 6. Antigravity Operating Model

### 6.1 Skills-first execution

Use workspace skills under `.agents/skills/<skill-name>/SKILL.md`. Keep each skill focused. Load only the skills needed for the current task.

Primary skills:

- `kaamsaathi-orchestrator`
- `workspace-discovery`
- `functional-specification`
- `architecture-contracts`
- `vertical-slice-delivery`
- `independent-quality-audit`
- `security-privacy-audit`
- `release-readiness`

### 6.2 Workspace rules

Apply `.agents/rules/` constraints at all times. No implementation may override security, approval, architecture, testing, or evidence rules.

### 6.3 Agents and parallelism

Use the personas defined in `.agents/agents.md`. Parallelize only independent work. Before parallel implementation:

- Freeze module boundaries.
- Freeze shared API and event contracts.
- Freeze design tokens.
- Assign non-overlapping file ownership.
- Declare worktree names.
- Declare merge order.
- Ensure the reviewer did not author the same change.

Two agents must not modify the same file concurrently.

### 6.4 Artifact discipline

For every milestone, produce a plan, implementation evidence, test results, known limitations, and next actions. Do not claim success based on prose summaries.

---

## 7. Delivery Lifecycle

Execute the following lifecycle in order. Revisit earlier phases when evidence invalidates an assumption.

### Phase 0 — Repository and capability discovery

1. Inspect the entire workspace, hidden files, Git state, branches, worktrees, build files, existing docs, tests, secrets patterns, CI, infrastructure, and integrations.
2. Determine whether the repository is new, partial, or existing production code.
3. Inventory available Antigravity skills, MCP tools, Android tooling, cloud credentials, browser tools, and account limitations.
4. Preserve useful work; do not replace existing architecture without justification.
5. Create or update:
   - `PROJECT_STATUS.md`
   - `docs/project/ASSUMPTIONS.md`
   - `docs/project/DECISION_LOG.md`
   - `docs/project/RISK_REGISTER.md`
   - `docs/project/APPROVALS.md`
   - `docs/project/REQUIREMENTS_TRACEABILITY_MATRIX.md`
6. Record every validation that could not be run as `NOT_RUN` with the exact prerequisite.

### Phase 1 — Current research and field-validation design

Research only facts that may have changed or materially affect the product, including Google Play requirements, Android support, Indian data-protection requirements, consumer marketplace obligations, UPI/PSP rules, accessibility standards, cloud costs, OTP costs, map costs, competitor features, and common marketplace fraud.

Separate:

- Verified fact.
- Product inference.
- Assumption requiring real-user validation.

Do not fabricate interviews, market share, demand, ratings, downloads, or legal conclusions. Create interview, usability, concierge-pilot, WhatsApp-pilot, trust, and pricing test plans for evidence that requires real users.

**Phase 1 exit gate — decide these before Phase 2 starts, not during implementation:**

- The pilot city/district/cluster (Section 3.1). Do not carry an unresolved pilot-location placeholder into the functional freeze.
- The masked-calling approach for the pilot (an approved vendor, or an explicit interim decision to use consent-gated direct-number reveal with a placeholder for a later vendor). Either answer is acceptable; leaving it open is not.
- The SMS/OTP vendor track: confirm the mock-provider dev path (Section 3.4) is sufficient to start Slice 1, and log the real-vendor decision as `WAITING_FOR_OWNER_APPROVAL` so it is visible from day one rather than discovered mid-slice.

If any of these three is still open when Phase 1 ends, record it explicitly in `docs/project/DECISION_LOG.md` as an open item with an owner and target date — do not silently proceed into Phase 2 as if it were resolved.

### Phase 2 — Functional specification freeze

Before feature coding:

1. Read all product documents in this pack.
2. Convert every major capability into:
   - Requirement ID.
   - Actor.
   - Trigger.
   - Preconditions.
   - Happy path.
   - Alternate path.
   - Error path.
   - Permissions.
   - State transition.
   - Data written.
   - Notifications.
   - Analytics event.
   - Audit event.
   - Acceptance criteria.
3. Resolve state-machine ambiguity.
4. Produce wireframes or implementation-ready screen specifications for every critical state.
5. Produce a requirements traceability baseline.
6. Freeze the MVP functional baseline. New scope must enter through change control.

### Phase 3 — Architecture and interface contracts

1. Evaluate architecture options and write ADRs.
2. Prefer:
   - Kotlin + Jetpack Compose for Android.
   - TypeScript + a strongly structured backend framework such as NestJS.
   - Versioned REST APIs documented with OpenAPI.
   - PostgreSQL + PostGIS.
   - TypeScript public website/admin with accessible server-rendered public content.
   - Modular monolith and clear domain boundaries.
3. Define:
   - Module ownership.
   - Physical and logical data model.
   - PII and retention classification.
   - API contracts.
   - Error catalogue.
   - Idempotency policy.
   - Pagination and rate limits.
   - Event schemas.
   - Audit schemas.
   - Authorization matrix.
   - Performance budgets.
   - Environment strategy.
4. Validate circular dependencies, transaction boundaries, indexes, migration safety, and rollback/forward-fix strategy.

### Phase 4 — Foundation slice

Deliver a reproducible foundation before business slices:

- Monorepo and build system.
- Dev/staging/prod configuration boundaries.
- Shared contracts.
- Authentication foundation.
- Localization and design tokens.
- Secure networking.
- Database migration framework.
- CI checks.
- Secrets scanning.
- Logging and metrics.
- Feature flags.
- Synthetic seed data.
- Local setup documentation.

### Phase 5 — Tested vertical slices

Implement end-to-end slices, not isolated layers:

1. Identity, role, customer profile, provider profile.
2. Provider services, service area, availability, verification submission.
3. Discovery, targeted request, matching request, attachments.
4. Provider lead response, estimates, quote comparison, booking.
5. Arrival, job start, change order, completion, payment record.
6. Ratings, complaints, disputes, no-shows, cancellation, support.
7. Admin verification, moderation, coverage, content, audit, privacy requests.
8. Public website and legitimate organic acquisition pages.
9. Analytics, consent, performance, security, accessibility, release readiness.

For each slice:

- Update specification and traceability.
- Define test data.
- Implement server rules first where critical.
- Add unit, integration, contract, UI, security, accessibility, localization, and retry tests.
- Run the tests.
- Independently review.
- Fix defects.
- Store evidence.
- Update status only after exit criteria pass.

### Phase 6 — Hardening

- Threat model and abuse-case testing.
- Authorization and object-level access tests.
- OTP throttling and anti-enumeration.
- Upload scanning/validation.
- PII masking.
- Admin MFA and access review.
- Offline/retry/idempotency tests.
- Low-memory and low-bandwidth tests.
- Accessibility and large-font tests.
- Hindi and English layout tests.
- Performance/load tests.
- Backup/restore and migration tests.
- Incident and support runbooks.

### Phase 7 — Approved non-production deployment

Deploy only to an approved non-production environment. Before deployment:

- Document cost and prerequisite.
- Confirm no real customer identity document or production personal data is used.
- Confirm secrets are in approved secret management.
- Execute smoke and E2E tests.
- Verify logs, metrics, alerts, backups, rollback, and data deletion.
- Produce a deployment evidence report.

### Phase 8 — Release-candidate audit and handover

The independent final auditor must rerun critical commands. It must not trust implementation summaries.

Produce:

- What is implemented.
- What is verified.
- What is deployed.
- What is mocked.
- What is not run.
- What is pending.
- What is blocked.
- What needs legal review.
- What needs owner approval.
- Exact remaining commands/manual steps.
- 30/60/90-day plan.

Never declare production-ready until production legal, privacy, security, operations, billing, data, and release approvals are actually complete.

---

## 8. Human Approval Gates

**Named owner.** Every one of these gates routes to a specific, named human, not an abstract "the owner." Before Phase 0 begins, `docs/project/APPROVALS.md` must record who that person (or role) is, how they are contacted, and an expected response window. If no owner is designated yet, the orchestrator's first action is to mark this a blocking open item and request it — do not invent a default owner or proceed as if silence means approval. A gate with no one able to clear it is not autonomy, it is a stall that looks like progress until someone notices.

**Mandatory human checkpoints.** In addition to the approval gates below, the orchestrator must pause for explicit human sign-off (not just log a status and continue) at these three points, because they set the foundation every later slice is built on:

1. After the Phase 2 functional specification freeze, before Phase 3 architecture work starts.
2. After the Phase 3 architecture/contract freeze, before Phase 4 foundation and any parallel slice work starts.
3. After Slice 1 (identity/role/onboarding) reaches `VERIFIED`, before Slices 2 onward begin — this is the first real evidence of whether the working pattern (evidence quality, test depth, review independence) is actually working, and is cheaper to correct after one slice than after five.

Continue autonomously through reversible research, design, documentation, local execution, tests, code, synthetic-data validation, and approved staging work.

Set status `WAITING_FOR_OWNER_APPROVAL` before:

- Material paid cloud resources or quota commitments.
- Purchasing domains, certificates, SMS/OTP credits, mapping credits, or subscriptions.
- Connecting to production data or databases.
- Processing real identity documents or real personal data.
- Irreversible/destructive data, Git, or cloud operations.
- Production application or public website release.
- Real payment settlement.
- Final legal policy acceptance.
- Aadhaar collection or sensitive biometric/identity use.
- Production sidecars or scheduled agents that create cost or modify systems.
- A marketplace fee model that financially affects real users.

For a blocked action, complete all preparation, exact commands, prerequisites, cost estimate, risks, validation, and rollback instructions. Continue independent work.

**Dev/test carve-out.** These gates govern real spend, real data, and production/public impact. They do not block using free-tier, mocked, sandboxed, or self-hosted equivalents (mock OTP, stubbed masked-calling, local PostgreSQL/PostGIS, synthetic seed data, a local or free-tier map tile source) to build and test a slice end-to-end in a local or non-production environment. If a slice's only remaining blocker is a paid vendor decision, mark that specific integration `WAITING_FOR_OWNER_APPROVAL`, keep the rest of the slice moving against the mocked equivalent, and do not let it stall the vertical-slice sequence.

---

## 9. Functional Authority

The complete actor journeys are defined in:

- `docs/product/FUNCTIONAL_WORKFLOW_SPEC.md`
- `docs/product/STATE_MACHINES.md`
- `docs/product/BUSINESS_RULES.md`
- `docs/operations/SUPPORT_AND_SAFETY_WORKFLOWS.md`

Critical lifecycle transitions must be enforced on the server. The client may request a transition but must not decide authorization, final price, verification status, ownership, or completion eligibility.

---

## 10. Quality Bar

A feature is not done merely because code exists.

### Definition of Ready

A feature may enter implementation only when:

- Value and actor are known.
- Scope and exclusions are clear.
- Acceptance criteria are testable.
- UX, loading, empty, permission, offline, and error states are defined.
- State-machine and authorization impact are known.
- API/data changes are understood.
- Localization and accessibility effects are understood.
- Analytics, audit, security, privacy, rollout, and rollback are defined.

### Definition of Done

A feature is done only when:

- Implementation matches the requirement and state machine.
- Builds, lint, type checks, and static analysis pass.
- Required unit, integration, contract, UI/E2E, authorization, accessibility, localization, security, and retry tests pass.
- No secret is committed.
- Documentation, traceability, changelog, and evidence are updated.
- Independent review is complete.
- Known limitations are recorded.
- Rollback/feature-flag behavior exists where necessary.
- No unresolved release-blocking defect remains.

### Minimum release gates

- Zero unresolved Severity 1 defects.
- Zero unresolved Severity 2 defects unless the owner explicitly accepts a documented exception.
- Zero unresolved critical security vulnerability.
- Zero unresolved high security vulnerability without an owner-approved exception.
- All P0/P1 test scenarios pass.
- All critical marketplace journeys pass.
- Authorization, idempotency, upload security, OTP controls, and admin MFA are verified.
- Hindi/English, screen reader semantics, text scaling, and low-connectivity behavior are verified.
- Backup and restore are tested before production.

---

## 11. Evidence Contract

For every milestone record:

- Requirement IDs.
- Files changed.
- Decisions and assumptions.
- Commands executed.
- Tests executed.
- Actual pass/fail output.
- Coverage summary.
- Security scan summary.
- Performance result.
- Screenshots/browser recordings where useful.
- Known limitations.
- Remaining risks.
- Manual steps.
- Rollback instructions.

**Evidence tiering.** The full bundle above is mandatory for every release-candidate milestone and for any slice touching authentication, payments, verification, or safety/moderation. For other interim slice milestones, a lightweight bundle is sufficient: requirement IDs, files changed, commands executed, actual test pass/fail output, and known limitations — coverage, security-scan, and performance sections may be summarized by reference to the last full run rather than re-produced in full, provided nothing in the slice materially changes that surface. This keeps documentation effort proportionate to risk rather than uniform across every milestone.

**Evidence-discipline check.** At every milestone report, the orchestrator states, in one line, the ratio of evidence-writing effort to implementation effort was reasonable for that slice's risk tier. If a lightweight-tier slice is generating full-bundle-sized reports, or a slice touching money/auth/safety is getting a thin report, flag it in the milestone report itself rather than letting it drift — this is a cheap self-check, not a new process.

Use these statuses only:

- `NOT_STARTED`
- `IN_PROGRESS`
- `BLOCKED`
- `WAITING_FOR_OWNER_APPROVAL`
- `IMPLEMENTED_NOT_VERIFIED`
- `FAILED_VERIFICATION`
- `VERIFIED`
- `RELEASED`
- `DEFERRED`

Never use `COMPLETE` as a substitute for verification.

---

## 12. First Execution Sequence

Perform these steps now:

1. Inspect the entire repository and tooling.
2. Read this package and the original KaamSaathi research/brief.
3. Activate `workspace-discovery`.
4. Create/update project status, assumptions, decisions, risk register, approvals, dependency inventory, and traceability matrix. Confirm a named owner is recorded in `docs/project/APPROVALS.md` (Section 8); if not, raise this as the first blocking item.
5. Confirm the Phase 1 exit gate (pilot location, masked-calling approach, OTP vendor track) is resolved or explicitly logged as an open item with an owner and date.
6. Activate `functional-specification` and reconcile the repository against the supplied functional workflows and state machines. **Pause for human sign-off on the frozen baseline before continuing** (Section 8 checkpoint 1).
7. Activate `architecture-contracts` and create/finalize ADRs, data contracts, API contracts, authorization, and module boundaries. **Pause for human sign-off on the frozen contracts before continuing** (Section 8 checkpoint 2).
8. Produce a milestone plan with dependencies and exit criteria.
9. Use independent subagents for UX/accessibility, Android, backend/data, web/admin, security/privacy, QA, DevOps/SRE, and growth/analytics.
10. Freeze shared contracts before parallel code changes.
11. Implement Slice 1 (identity, role, onboarding) with `vertical-slice-delivery`.
12. Run `independent-quality-audit` and `security-privacy-audit`.
13. Fix failures and store evidence.
14. **Pause for human sign-off once Slice 1 is `VERIFIED`** before starting Slice 2 onward (Section 8 checkpoint 3).
15. Continue through all remaining unblocked slices.
16. Run `release-readiness` before claiming release-candidate status.

Do not stop for a non-blocking unknown. Make the safest reversible assumption, record it, explain its impact, and continue. The checkpoints above are the exception to this: they are deliberate pauses, not unknowns, and are not skipped for the sake of momentum.
