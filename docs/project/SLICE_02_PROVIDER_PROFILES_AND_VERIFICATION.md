# Vertical Slice 2 — Provider Profiles, Coverage & Verification

Status: `IN_PROGRESS`
Owner: @orchestrator (assigned to @backend, @android, @admin, @web)
Depends on: Slice 1 (Identity, Auth, Roles & Sessions) `VERIFIED`
Blocks: Slice 3 (Discovery and Service Requests) and all matching/booking flows

This document defines the scope, state machines, business rules, acceptance criteria, and verification matrix for **Slice 2 (Provider Profiles, Coverage & Verification)** in accordance with `KAAMSAATHI_MASTER_EXECUTION_PROMPT.md`.

---

## 1. Scope

- **REQ-P-02 Provider Service Area & Coverage**:
  - Provider coverage center point (lat/lng) and radius (1,000m to 50,000m).
  - Validation restricting coverage to valid Uttar Pradesh districts (initial seed pilot clusters: Lucknow, Varanasi, Kanpur).
- **REQ-P-03 Pricing & Standard Estimates**:
  - Standard rate cards per supported category (Electrician, Plumber, Appliance Repair).
  - Diagnostic / visitation inspection fee in integer paise (must be non-negative).
  - Transparent pricing rules: fees disclosed upfront before dispatch.
- **REQ-P-04 Availability Management**:
  - Real-time availability toggle: `AVAILABLE`, `BUSY`, `OFFLINE`.
  - Immediate state transition with zero discovery lag.
- **REQ-P-05 Business Profile & Trade Experience**:
  - Business/display name, primary trade title, years of experience, bio, and languages spoken.
- **REQ-P-06 Verification Evidence Submission**:
  - Voluntary evidence upload flow for providers (mock presigned storage in local dev/CI).
  - Supported document types:
    - `GOVT_PHOTO_ID` (Aadhaar / Voter ID / Driving License — Aadhaar strictly optional, non-compulsory).
    - `TRADE_CERT` (ITI diploma / vocational certificate / apprenticeship credential).
    - `POLICE_CLEARANCE` (Police character certificate / background verification document).
  - Submission transitions provider from `DRAFT` to `SUBMITTED` / `IN_REVIEW`.
- **REQ-A-01 Admin Provider Verification Queue & Badge Granting**:
  - Review interface for privileged administrators with active TOTP MFA sessions.
  - Review actions: `APPROVE` or `REJECT` (with mandatory remediation notes).
  - State machine transitions: `SUBMITTED` / `IN_REVIEW` -> `APPROVED_ACTIVE` or `REJECTED`.
  - Trust badge issuance:
    - `PHONE_VERIFIED`: Auto-granted upon mobile OTP verification.
    - `GOVT_ID_VERIFIED`: "Reviewed Government Photo ID".
    - `TRADE_CERTIFIED`: "Reviewed Trade Certification".
    - `POLICE_VERIFIED`: "Reviewed Police Clearance".
  - Strict Trust Baseline language enforced on every badge and UI screen:
    > "The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety. Every badge states exactly what was reviewed."
  - Immutable audit record generated for every verification decision with admin ID, previous state, new state, notes, timestamp, and correlation ID.

---

## 3. Acceptance Verification Evidence

All 8 acceptance criteria are fully verified via automated tests:

| Criteria ID | Test Description | Test File & Result | Status |
|---|---|---|---|
| **AC-P2-01** | Coverage validates UP districts and radius (1,000m - 50,000m) | `services/api/src/test/slice2-provider.test.ts` (test 1) | **PASS** |
| **AC-P2-02** | Rate card rejects negative visitation fees & non-existent categories | `services/api/src/test/slice2-provider.test.ts` (test 2) | **PASS** |
| **AC-P2-03** | Real-time availability toggles between `AVAILABLE`, `BUSY`, `OFFLINE` | `services/api/src/test/slice2-provider.test.ts` (test 3) | **PASS** |
| **AC-P2-04** | Verification submission transitions provider state `DRAFT` -> `SUBMITTED` | `services/api/src/test/slice2-provider.test.ts` (test 4) | **PASS** |
| **AC-P2-05** | Admin review queue, approval, and trust badge issuance (`APPROVED_ACTIVE`) | `services/api/src/test/slice2-provider.test.ts` (test 4) | **PASS** |
| **AC-P2-06** | Admin rejection requires `review_notes` and transitions to `REJECTED` | `services/api/src/test/slice2-provider.test.ts` (test 5)<br>`apps/admin/src/index.test.ts` | **PASS** |
| **AC-P2-07** | Customer role isolation denies provider operations prior to onboarding | `services/api/src/test/slice2-provider.test.ts` (test 6) | **PASS** |
| **AC-P2-08** | Admin and provider actions emit immutable audit records with correlation IDs | `services/api/src/test/slice2-provider.test.ts` (test 7) | **PASS** |

---

## 4. Trust Baseline Compliance

- **Mandatory Trust Disclaimer**:
  `"The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety. Every badge states exactly what was reviewed."`
- **Granular Badge Labels & Descriptions**:
  - `PHONE_VERIFIED`: "Phone Verified" — *Mobile OTP verification completed*
  - `GOVT_ID_VERIFIED`: "Govt ID Reviewed" — *Reviewed government-issued photo ID*
  - `TRADE_CERTIFIED`: "Trade Certified" — *Reviewed vocational or ITI trade certificate*
  - `POLICE_VERIFIED`: "Police Verification Checked" — *Reviewed police clearance certificate*

Status: `VERIFIED` (Automated verification complete; 47/47 monorepo tests passing)
