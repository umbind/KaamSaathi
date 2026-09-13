# ADR-005: Privacy, Data Minimization & Consent Architecture

- **Status**: `ACCEPTED` (Approved by Principal Architect & Security Lead)
- **Date**: `2026-09-13`
- **Deciders**: Umesh Kumar (Project Owner), Principal Architect, Security Lead, Product Lead

---

## 1. Context & Problem Statement

KaamSaathi handles sensitive personal data: household addresses, contact phone numbers, identity verification evidence, and payment records.
Legal and regulatory frameworks applicable:
1. **Digital Personal Data Protection Act (DPDP Act) 2023** (India).
2. **Consumer Protection (E-Commerce) Rules 2020** (India).
3. **Google Play User Data & Permissions Policies**.

We must prevent:
- Premature disclosure of home addresses to unselected providers.
- Phone number harvesting and off-platform harassment.
- Compulsory collection of sensitive national identifiers (Aadhaar/biometrics).
- Inadvertent PII leakage in application logs, analytics, and crash reports.

---

## 2. Decision

### 2.1 PII Classification & Access Tiers
| Tier | Data Elements | Storage & Access Control |
|---|---|---|
| **Tier 1: Restricted PII** | Full home address, exact GPS coordinates, raw phone number, identity document images | Encrypted at rest; accessed only via transaction-scoped server authorization; strict audit logging |
| **Tier 2: Protected Operational** | Locality name, PIN code, first name / initial, payment reference, dispute notes | Decrypted only for active session actors; masked in support queues |
| **Tier 3: Public Marketplace** | Provider business name, category, trade experience, rating average, review text, verified badge labels | Publicly indexable; cached at edge |

### 2.2 Address Privacy Phasing
1. **Discovery & Request Phase**: Customer's address is represented solely by **District, Locality Name, and PIN Code** (e.g., "Aliganj, Lucknow - 226024"). Exact street name, building number, and landmark are redacted.
2. **Booking Phase**: Only upon quote acceptance and booking confirmation is the complete service address revealed to the single assigned service provider.
3. **Post-Completion**: Provider access to customer service address expires 7 days after job completion.

### 2.3 Interim Communication & Masked Calling Architecture
Per Decision `DEC-002`:
1. **Interface Abstraction**:
   ```typescript
   export interface ITelephonyService {
     initiateMaskedCall(bookingId: string, callerUserId: string): Promise<{ virtualNumber: string; sessionExpiry: Date }>;
     revealDirectNumberWithConsent(bookingId: string, consentEventId: string): Promise<{ contactNumber: string }>;
   }
   ```
2. **Interim Behavior (Dev / Staging / Production Launch)**:
   - When a customer or provider initiates contact, the UI displays a clear consent dialogue: *"To coordinate this booking, your phone number will be shared with the provider. Do you consent to share your number?"*
   - An immutable consent audit event (`USER_CONSENT_PHONE_REVEAL`) is recorded with user ID, booking ID, timestamp, and IP address.
   - Only then is the direct phone number made available for tap-to-call.
3. **Masked Calling Vendor Gate (`APP-002`)**: When a virtual telephony vendor (e.g. Exotel / Twilio) is approved, the implementation switches without client-side architectural changes.

### 2.4 Document Upload & Media Security
1. All verification documents and request photos are uploaded directly to private object storage via short-lived (15-minute) presigned URLs.
2. The server processes all incoming images:
   - Strips all EXIF metadata (including embedded GPS coordinates and device identifiers).
   - Validates MIME type and magic bytes (rejects executables/scripts).
   - Enforces 5MB size ceiling.
3. Verification documents are strictly non-public; access is restricted to authorized verification agents reviewing an active queue case.

### 2.5 Voluntary Verification & Non-Compulsory Aadhaar
1. Per Master Contract Section 3.2 and Rule `BR-PV-003`, **Aadhaar is never compulsory**.
2. Providers can verify their identity and trade competence through:
   - Government photo ID (Voter ID, Driving License, PAN card).
   - Trade certificate / ITI diploma / electrical wireman license.
   - Local peer references / contractor endorsement.
   - In-person verification by field operations.
3. Badges state exactly what was verified: "Voter ID Verified", "Trade References Confirmed".

### 2.6 Data Subject Rights (Export & Deletion)
1. **Data Export**: Users can request a machine-readable JSON export of their profile, transaction history, reviews, and payment records via `POST /api/v1/privacy/export`.
2. **Account Deletion**:
   - Deletion request enters state `DELETION_PENDING`.
   - The server verifies that no active legal hold, pending dispute, or unfulfilled booking exists.
   - Upon statutory retention completion, personal data is permanently anonymized or purged, leaving pseudonymized transaction hashes for accounting and tax compliance.

---

## 3. Consequences

### Positive
- Strict compliance with Indian DPDP Act 2023 and Google Play User Data policies.
- Protects customers (especially female and elderly householders) from unvetted contact.
- Empowers informal workers with accessible, non-discriminatory verification paths.

### Negative / Trade-offs
- Two-step address reveal adds slight orchestration complexity on the server.
