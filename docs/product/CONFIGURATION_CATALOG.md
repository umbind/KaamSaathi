# KaamSaathi Configuration Catalog

## 1. Purpose

Business and operational thresholds must be explicit, environment-scoped, versioned, validated, and auditable. Do not scatter magic numbers across clients and services.

## 2. Configuration Classes

### 2.1 Compile/build configuration

- API base URL per environment.
- Build variant/flavour.
- App version/minimum supported version.
- Feature integration presence.
- Logging level without PII.

Secrets never belong in mobile/public web build configuration.

### 2.2 Server business configuration

| Key family | Examples | Rules |
|---|---|---|
| OTP | expiry, resend cooldown, attempt limits, phone/device/IP limits | Security-owned; no client authority |
| Session | access/refresh lifetime, inactivity timeout, step-up window | Risk-based; revocable |
| Coverage | active localities/PINs, category availability | Genuine coverage only |
| Matching | batch size, batch delay, max attempts, radius limits, ranking version | Audited; fairness/safety review |
| Leads | response expiry, provider capacity | Category/location configurable |
| Quotes | validity defaults/min/max, allowed quote types, required fields | Accepted version immutable |
| Scheduling | booking horizon, reschedule expiry, en-route window | Timezone-safe |
| No-show | grace period, required contact/evidence | No unapproved auto fee |
| Job start | code length/expiry/attempt limits | Never logged plaintext |
| Change order | validity and maximum count/size policy | Customer approval required |
| Completion | reminder cadence, unconfirmed closure threshold, complaint window | Source must remain clear |
| Uploads | types, true content, size, dimensions, count, retention | Private/scanned/signed |
| Verification | route requirements, expiry, badge wording, reviewer rules | Policy-versioned |
| Reviews | eligibility window, edit window, moderation rules, minimum sample | No fake/incentivized reviews |
| Complaints | category/severity routing, response targets, appeal windows | Staffing-dependent |
| Notifications | channel priority, retries, templates, quiet hours | Transactional independence |
| Privacy | export/deletion workflow deadlines, retention schedule | Legal review required |
| Fees | customer/provider/platform fee flags and amounts | Disabled until approval |
| Feature flags | target, rollout, expiry, owner, metric, rollback | Environment scoped |

### 2.3 Remote/client-safe configuration

Only non-secret presentation/feature data safe for clients:

- Enabled categories and translations.
- Supported locality display.
- Form schemas and content versions.
- Client feature flags that do not grant authorization.
- Upload limits for early validation.
- Help content/version.
- Minimum app version.

Server revalidates every rule.

## 3. Change Control

Every configuration change records:

- Key and previous/new value.
- Environment and target audience.
- Reason and owner.
- Effective/expiry time.
- Requirement/incident/experiment link.
- Expected metric/guardrail.
- Rollback value.
- Approver when required.
- Audit event.

## 4. Safe Defaults

- Fees: disabled.
- Public provider indexing: disabled until consent/SEO review.
- Precise location: off until contextual request.
- WhatsApp hand-off: off until approved provider/consent.
- PSP payment confirmation: off until verified integration.
- System completion: conservative threshold and explicitly unconfirmed.
- New categories/locations: disabled until supply/operations exist.
- High-impact automation: human review required.

## 5. Failure Behavior

- If remote configuration cannot load, use last known signed/validated safe configuration or fail closed for risky features.
- Never enable a payment, fee, public exposure, or sensitive-data feature because configuration is missing.
- Log configuration version, not secret content, with each affected transaction.
