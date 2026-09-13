# KaamSaathi Risk Register

| Risk ID | Category | Description | Likelihood | Impact | Exposure | Early indicator | Prevention | Contingency | Owner | Status |
|---|---|---|---:|---:|---:|---|---|---|---|---|
| RSK-001 | Marketplace | Insufficient provider response density in pilot area | Medium | High | High | Response time/no-match | Narrow geography, supply onboarding | Assisted dispatch/rematch | Ops Lead | OPEN |
| RSK-002 | Trust | Fake/impersonating providers | Medium | Critical | High | Duplicate evidence/reports | Graduated verification, controls | Pause/review/notify | Trust & Safety | OPEN |
| RSK-003 | Safety | Unsafe provider-customer interaction | Low | Critical | High | Safety reports | Privacy, guidance, reporting | Contact block/T&S escalation | Trust & Safety | OPEN |
| RSK-004 | Product | Low-literacy users cannot complete request | High | High | High | Drop-off/support contacts | Voice, progressive forms, usability tests | Assisted booking | UX Lead | OPEN |
| RSK-005 | Reliability | Duplicate requests/bookings on retry | Medium | High | Medium | Duplicate IDs/leads | Idempotency/transactions | Reconciliation/cleanup | Backend Lead | OPEN |
| RSK-006 | Financial | UPI result incorrectly treated as payment | High | High | High | Mismatches | PSP verification/separate declarations | Dispute workflow | Backend Lead | OPEN |
| RSK-007 | Privacy | Address/phone/identity evidence exposure | Low | Critical | High | Access anomalies | Least privilege/masking/signed URLs | Incident containment | Security Lead | OPEN |
| RSK-008 | Operations | Complaint/verification backlog | High | Medium | Medium | Aging/SLA misses | Queue metrics/staffing | Pause growth/prioritize | Ops Lead | OPEN |
| RSK-009 | Cost | OTP/maps/logging cost spike or abuse | Medium | High | Medium | Budget alerts | Rate limits/cache/quotas | Disable/degrade feature | SRE Lead | OPEN |
| RSK-010 | Regulatory | Policy/legal requirement changes | Medium | High | Medium | Official update | Scheduled review/legal counsel | Feature/policy update | Legal Lead | OPEN |
| RSK-011 | Tooling | Host lacks local Java/JDK and Android SDK | High | High | High | Missing `java`/`adb` commands | Install JDK 17 & Android SDK or run CI container | Isolate Kotlin models/contracts, mock UI layers | DevOps / Android | OPEN |
| RSK-012 | Tooling | Host lacks local PostgreSQL / PostGIS binaries | Medium | Medium | Medium | Missing `psql`/Docker | Use PGlite/in-memory PostgreSQL for local tests | Docker compose or cloud test database | Backend / DevOps | OPEN |
| RSK-013 | Governance | Missing designated named human owner (Section 8 Gatekeeper) | High | Critical | Critical | APPROVALS.md unassigned | Explicit prompt to user to designate named owner | Local unblocked dev continues; gates hold | Orchestrator | OPEN |

