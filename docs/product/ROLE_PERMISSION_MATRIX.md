# KaamSaathi Role and Permission Matrix

Permissions are server-enforced. `Own` means the actor is a transaction participant or record owner under policy; it does not permit arbitrary ID access.

Legend: R = read, C = create, U = update/action, D = delete/deactivate request, A = approve/decide, M = moderate, X = prohibited.

| Capability | Customer | Provider | Assisted Operator | Verification Agent | Support Agent | Trust & Safety | Content Ops | Analyst | Privileged Admin |
|---|---|---|---|---|---|---|---|---|---|
| Own customer profile | R/U/D | R/U/D when same user | Limited U with consent | X | Masked R for case | Masked R for case | X | Aggregated only | Restricted support action |
| Own provider draft/profile | R when same user | R/C/U/D | Limited C/U with consent | R for review | Masked R for case | R for safety case | Public fields only | Aggregated only | Restricted action |
| Raw verification evidence | X | Own submission/status, not internal notes | Submit with consent only | R/A | X | R only if safety-authorized | X | X | Break-glass/authorized |
| Provider verification decision | X | Appeal only | X | A | X | Recommend/escalate | X | X | Authorized override with audit |
| Browse providers | R | R in customer mode | R with user consent | X | R for support | R for case | R public | Aggregated | R restricted |
| Create service request | C/U own | C/U in customer mode | C/U with consent | X | Assisted only | Assisted only | X | X | Exceptional support action |
| Read exact customer address | Own request | Selected booking only | With consent | X | Case-scoped reveal | Safety-case reveal | X | X | Authorized/audited |
| Read private phone/contact | Own | Selected booking/consent only | With consent | X | Case-scoped reveal | Case-scoped reveal | X | X | Authorized/audited |
| Lead accept/decline | X | U own assigned lead | X | X | X | X | X | X | Exceptional audited action |
| Submit/revise quote | X | C/U own assigned request | X | X | X | X | X | X | Exceptional correction only |
| Accept quote/create booking | U own request | X | U with customer consent | X | Assisted only | X | X | X | Exceptional audited action |
| Job state actions | Customer-allowed own | Provider-allowed own | Assisted override with rules | X | Limited support override | Safety containment | X | X | Authorized override |
| Payment declaration | Own | Own | Assisted entry with consent | X | Reconcile/support | Fraud/safety review | X | Aggregated | Authorized correction |
| Submit review | Eligible own | Eligible own | Assisted with user confirmation | X | X | X | X | Aggregated | X |
| Moderate review | X | Report/respond own | X | X | Limited report triage | M serious abuse | M standard content | Aggregated | M/override audited |
| Submit complaint | C own | C own | C with consent | X | C on behalf with consent | C/containment | X | Aggregated | C/override |
| Complaint evidence | Own submitted + status-safe | Own submitted + status-safe | Case-limited | X | R ordinary cases | R safety cases | X | Aggregated | Authorized |
| Resolve ordinary dispute | X | Respond/appeal | X | X | A within policy | A/escalate safety | X | X | Override/appeal |
| Apply safety restriction | X | X | X | X | Recommend only | A time-limited/final by role | X | X | A audited |
| Category/coverage config | R public | R relevant | X | R policy | R | R safety policy | C/U/A | Aggregated | A |
| Feature flags | X | X | X | X | X | X | Limited content flags | R metrics | C/U/A audited |
| Audit log | Own activity summary only | Own activity summary only | Own operator actions | Scoped own cases | Scoped cases | Scoped cases | Scoped content actions | Aggregated only | Authorized search |
| Data export/delete | Own request | Own request | Assist with consent | X | Intake/status only | Safety/legal hold input | X | X | Privacy-role processing |
| Bulk export | X | X | X | X | X | Restricted | X | Approved aggregate | Elevated permission only |

## Break-Glass Rules

- Break-glass access is disabled by default.
- Requires step-up authentication, incident/case reference, reason, limited duration, and immediate audit/alert.
- Cannot be used for curiosity, routine support, analytics, or convenience.
- Access review must follow every use.

## Role-Switch Rules

A single account may hold both a customer profile and a provider profile. Switching the active mode in the app changes which capability column above applies to the current session; it does not merge, combine, or elevate the two capability sets.

- Switching modes never grants a capability the target mode does not already list (a provider switching to customer mode gets exactly the Customer column, nothing carried over from Provider).
- A user acting as customer cannot select, quote, or transact against their own provider profile for the same request; the matching and quote-acceptance logic must exclude the account's own provider identity from eligible providers for any request the same account created.
- Verification evidence, payout, and audit-log views are scoped to the profile they belong to; the other mode's session cannot read them incidentally because both profiles share an account.
- Every state-changing action records which profile (customer or provider) the account was acting as at the time, not only the account ID, so audit and dispute review can reconstruct which "hat" was worn.
