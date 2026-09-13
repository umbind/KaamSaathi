# KaamSaathi Dependencies

| Dependency | Type | Purpose | Version/provider | Licence/terms | Security status | Data shared | Cost model | Environment | Owner | Exit/migration plan |
|---|---|---|---|---|---|---|---|---|---|---|
| Node.js | Runtime | Backend & web runtime | v24.19.0 (Installed) | MIT | Verified | None | Free / OSS | Dev, CI, Staging, Prod | SRE / Backend | Long-term LTS path |
| pnpm | Package Manager | Fast, deterministic monorepo package management | v12.4.1 (Installed) | MIT | Verified | None | Free / OSS | Dev, CI | SRE / Backend | npm / yarn compatible |
| TypeScript | Compiler / Language | Strongly typed backend, admin, and shared packages | ^5.6 | Apache 2.0 | Standard | None | Free / OSS | Dev, CI, Build | Architect | Standard JS compile target |
| NestJS / Fastify | Framework | Modular backend framework for REST API & auth | ^10.x | MIT | Standard | None | Free / OSS | Dev, Staging, Prod | Backend | Express/Hono fallback |
| PostgreSQL + PostGIS | Database | Relational datastore with spatial indexing | 16+ / PostGIS 3.4 | PostgreSQL License | Standard | Production PII/records | Free local / Cloud hosting fee | Dev (PGlite), Staging, Prod | Backend / SRE | Managed RDS / Cloud SQL |
| Kotlin + Jetpack Compose | Mobile Framework | Modern, declarative Android client | Kotlin 2.0+ / Compose BOM | Apache 2.0 | Standard | None | Free / OSS | Android Client | Android Lead | Standard Android SDK |
| Mock OTP Provider | Service Stub | Deterministic local OTP testing | In-house TypeScript class | Internal | High (no leak) | None | Free | Dev, CI | Backend | Replaced by SmsOtpProvider in Prod |
| Twilio / Gupshup / Msg91 | Third-party Service | Production Indian SMS OTP delivery | TBD (`WAITING_FOR_OWNER_APPROVAL`) | Commercial Terms | Evaluation pending | Phone number | Per-SMS fee | Staging, Prod | SRE / Security | Vendor-agnostic SmsOtpProvider interface |
| Exotel / Knowlarity / Twilio | Third-party Service | Masked voice calling / virtual numbers | TBD (`WAITING_FOR_OWNER_APPROVAL`) | Commercial Terms | Evaluation pending | Virtual call logs | Per-minute fee | Staging, Prod | SRE / Security | Interim consent-gated direct reveal fallback |

Review maintenance, security history, licence, community maturity, binary size, runtime cost, vendor lock-in, Android compatibility, data residency, and migration path before adoption.

