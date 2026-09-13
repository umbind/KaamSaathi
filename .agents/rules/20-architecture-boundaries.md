# Architecture Boundaries

Activation: Model Decision for architecture, backend, Android, web, infrastructure, and integration tasks

- Prefer a modular monolith for the MVP.
- Target baseline: Kotlin/Jetpack Compose Android, TypeScript structured backend, PostgreSQL/PostGIS, versioned REST/OpenAPI, accessible TypeScript public/admin web.
- Domain modules must have explicit owners and dependency direction. Avoid circular dependencies.
- Business rules belong in domain/application services and database constraints where appropriate, not only in controllers or clients.
- Use database foreign keys, unique constraints, check constraints, indexes, and transactional boundaries.
- Use forward-compatible migrations; every risky migration needs backup, rollback or forward-fix, and validation.
- Never trust client-provided actor IDs, roles, prices, verification flags, ownership, timestamps, or lifecycle states.
- Use secure signed object access and validate upload type, size, dimensions, content, and ownership.
- Keep PII out of logs, analytics, URLs, public caches, and error messages.
- Pin dependencies and evaluate security, licence, maintenance, binary size, runtime cost, Android compatibility, and migration path.
- Do not add a distributed queue, cache, search cluster, or microservice without documented measured need.
- Environment-specific configuration must be externalized. Never commit secrets.
