# Testing and Evidence Rules

Activation: Always On

- Do not claim a test passed unless the command actually ran and the result was inspected.
- Record unavailable validation as NOT_RUN with prerequisites.
- Use realistic synthetic data only.
- Every critical feature needs happy-path, alternate-path, failure, authorization, retry, concurrency, localization, accessibility, low-network, and analytics tests as applicable.
- Required layers include domain/unit, API contract, database integration, migration, Android ViewModel/UI/instrumentation, web component/E2E, admin authorization, security, upload, performance, offline/reconnection, backup/restore, deployment smoke, rollback, deletion, and analytics-event tests.
- P0/P1 marketplace journeys may not be skipped.
- Independently review and rerun critical tests after implementation.
- Store commands, actual output, coverage, findings, screenshots/browser recordings, limitations, and rollback instructions.
- Zero unresolved Severity 1 defects; zero unresolved Severity 2 defects without owner-approved exception.
- Zero unresolved critical security findings; zero unresolved high findings without owner-approved exception.
- Coverage targets support but do not replace behavioral testing.
- A feature status is VERIFIED only after requirement, implementation, tests, evidence, and independent review align.
