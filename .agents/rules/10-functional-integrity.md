# Functional Integrity Rules

Activation: Always On

- `docs/product/STATE_MACHINES.md` is authoritative for lifecycle transitions.
- Critical transitions are server-controlled. Clients request transitions but do not determine authorization, ownership, final price, provider verification, or completion eligibility.
- Every mutation that can be retried must support idempotency or an equivalent duplicate-prevention mechanism.
- Accepted quote versions are immutable. Any later scope or price change requires a customer-approved change order.
- A customer may accept only one active quote for one request unless the request is explicitly split into multiple jobs.
- Exact customer addresses and private phone numbers are not exposed to unselected providers.
- Ratings and reviews require an eligible completed job. One review per reviewing party per booking; edits are versioned.
- Verification is graduated and descriptive. Never use a badge to imply a guarantee that was not performed.
- Payment records distinguish PSP-confirmed, provider-confirmed, customer-declared, cash-recorded, failed, and disputed states.
- Launching a UPI intent is not proof of successful payment.
- No automated permanent suspension for high-impact decisions. Provide human review and appeal.
- Cancellation, no-show, dispute, completion, review, deletion, and privacy workflows must preserve audit evidence.
- Do not allow a provider to quote a category, geography, or time for which the provider is ineligible.
- Do not expose admin-only fields, fraud signals, internal notes, or other users' records.
