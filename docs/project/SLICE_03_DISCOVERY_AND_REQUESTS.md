# Vertical Slice 3 — Discovery and Service Requests

Status: `VERIFIED`
Owner: @orchestrator (assigned to @backend, @android, @web)
Depends on: Slice 1 (Identity & Sessions) `VERIFIED`, Slice 2 (Provider Profiles & Verification) `VERIFIED`
Blocks: Slice 4 (Quotes and Booking)

This document defines the scope, state machines, business rules, privacy controls, acceptance criteria, and test matrix for **Slice 3 (Discovery and Service Requests)** per `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`.

---

## 1. Scope

- **REQ-C-04 Category Discovery and Problem Search**:
  - Category listings (`electrician`, `plumber`, `appliance_repair`) with dual-language metadata.
  - Search engine supporting colloquial Uttar Pradesh transliterated aliases (`bijli mistri`, `nal mistri`, `pipe leak`, `motor kharab`, `geyser`) from `@kaamsaathi/localization`.
- **REQ-C-05 Problem Description & Media Upload**:
  - Text description of repair needs.
  - Presigned private upload request simulation with EXIF stripping and virus check metadata.
- **REQ-C-06 Schedule Preference & Locality Selection**:
  - Locality, UP district, and PIN code selection.
  - Preferred schedule window (e.g. "Morning 9am - 12pm", "Afternoon 12pm - 4pm", "Urgent Today").
- **REQ-C-07 Targeted Provider Request**:
  - Direct dispatch to a chosen provider.
  - State machine: `DRAFT` -> `SUBMITTED`.
  - Generates direct lead record for target provider.
- **REQ-C-08 Broadcast / Matching Request**:
  - Algorithmic lead dispatch to candidate providers.
  - State machine: `DRAFT` -> `MATCHING` -> `LEAD_DISPATCHED`.
  - Radius filter: provider must cover customer's district and coordinates.
  - Category match: provider must offer selected trade.
  - Availability filter: provider must be `APPROVED_ACTIVE` and `AVAILABLE` (excluding `BUSY` and `OFFLINE`).
  - Self-dealing guard: excludes customer's own provider account.
  - Batching control: dispatches leads to up to 5 matching providers with standard expiration (2 hours).

---

## 2. Privacy & Data Minimization Invariants

1. **Phased Address Disclosure**:
   - Providers receive **locality, district, and PIN code only** (e.g. "Aliganj, Lucknow - 226024").
   - Raw street address and customer house number are **strictly omitted** from leads.
2. **Phone Number Masking**:
   - Customer phone number is never revealed in lead payloads. Direct contact is unlocked only upon explicit booking acceptance (`Slice 4`).

---

## 3. Acceptance Criteria (Testable)

1. **AC-P3-01 (Transliterated Colloquial Search)**:
   - Querying colloquial terms (e.g., "bijli", "nal mistri", "fridge") returns matching active categories and verified providers in that trade.
2. **AC-P3-02 (Presigned Upload Flow)**:
   - Requesting upload URL returns non-public storage path and simulated presigned upload ticket.
3. **AC-P3-03 (Targeted Request Dispatch)**:
   - Submitting targeted request to an active provider creates request in `SUBMITTED` state and dispatches a single lead to target provider.
4. **AC-P3-04 (Self-Dealing Guard on Targeted Request)**:
   - Attempting to submit a targeted request to one's own provider profile is rejected with `409 Conflict (SELF_DEALING_PROHIBITED)`.
5. **AC-P3-05 (Broadcast Matching Filter & Radius)**:
   - Broadcast request matches only providers that are:
     - `APPROVED_ACTIVE`
     - `AVAILABLE`
     - Matching category rate card
     - Coverage radius covers customer coordinates
   - Max 5 leads dispatched.
6. **AC-P3-06 (Broadcast Self-Dealing Exclusion)**:
   - When a user broadcasts a request, their own provider account is automatically excluded from the candidate match list.
7. **AC-P3-07 (Phased Address Privacy Check)**:
   - Fetching provider leads confirms that only `locality_name`, `district_id`, and `pin_code` are present; customer phone and exact street address are absent.
8. **AC-P3-08 (Audit Trail Invariant)**:
   - Every request creation and lead dispatch emits an immutable audit log record.
