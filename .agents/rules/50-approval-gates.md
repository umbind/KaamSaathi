# Owner Approval Gates

Activation: Always On

**Named owner required.** These gates route to a specific named human recorded in `docs/project/APPROVALS.md`, with a contact method and expected response window — not an abstract "the owner." If none is recorded, treat that as the first blocking item and request it before treating any gate as resolvable.

**Mandatory checkpoints (pause, do not just log and continue):** after the functional-specification freeze, after the architecture/contract freeze, and after Slice 1 (identity/role/onboarding) reaches `VERIFIED`. These three are deliberate pauses for human sign-off, not non-blocking unknowns — do not skip them for momentum.

Continue autonomously for reversible local development, documentation, synthetic tests, non-destructive analysis, and already-approved staging activity.

Set `WAITING_FOR_OWNER_APPROVAL` before:

- Material paid cloud resources, quota increases, subscriptions, domains, certificates, messaging/OTP credits, or mapping credits.
- Production database or production personal-data access.
- Real identity-document processing.
- Destructive or irreversible Git, database, cloud, or data operations.
- Public production website or Google Play production release.
- Real payment settlement or financial fee activation.
- Final privacy notice, terms, provider terms, grievance policy, or other legal acceptance.
- Aadhaar, biometric, or similarly sensitive identification.
- Storing secrets outside approved secret-management systems.
- Recurring sidecars/agents that can create cost or change production.
- A final business model that charges real customers/providers.

For a blocked step:

1. Complete all preparatory work.
2. Provide exact commands or console steps.
3. Document prerequisites, estimated cost, risks, validation, and rollback.
4. Continue every independent task.
5. Never fabricate integration or deployment success because access is unavailable.
