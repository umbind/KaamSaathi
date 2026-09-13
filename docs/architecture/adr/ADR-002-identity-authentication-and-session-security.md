# ADR-002: Identity, Authentication & Session Security Architecture

- **Status**: `ACCEPTED` (Approved by Principal Architect & Security Lead)
- **Date**: `2026-09-13`
- **Deciders**: Umesh Kumar (Project Owner), Principal Architect, Security Lead, Backend Lead

---

## 1. Context & Problem Statement

KaamSaathi serves lower-income Indian households and informal-sector service providers. Passwords are unacceptable due to low literacy and forgotten password friction. Authentication must rely on Indian mobile numbers and OTPs.

Critical security and privacy risks to mitigate:
- **User Enumeration**: Adversaries probing phone numbers to discover user registration status or provider identities.
- **SMS / OTP Fraud & Cost Abuse**: Brute-force attacks, OTP bombing, and ballooning SMS costs.
- **Shared-Family Phone Risks**: Accidental privacy leakage across family members sharing one Android phone.
- **Administrative Account Takeover**: Elevated risks for admin access to user data and verification queues.

---

## 2. Decision

### 2.1 Mobile Phone Normalization & Storage
1. All phone numbers are strictly validated and normalized to E.164 format: `+91XXXXXXXXXX` (10 digits post country code).
2. Raw phone numbers are classified as **Restricted PII**.
3. In the database, phone numbers are stored encrypted at rest, and queried using a keyed deterministic HMAC (SHA-256 with an environment-injected secret salt) to prevent plaintext phone exposure in database dumps.

### 2.2 OTP Generation & Lifecycle Protocol
- **OTP Format**: 6-digit numeric token generated via a cryptographically secure pseudo-random number generator (CSPRNG).
- **TTL**: 300 seconds (5 minutes).
- **Max Attempts**: 3 incorrect attempts before the challenge is permanently invalidated.
- **Cooldown**: 60 seconds mandatory wait before a new OTP can be requested for the same phone number.
- **Anti-Enumeration Envelope**: The endpoint `POST /api/v1/auth/otp/request` always returns HTTP 200 with an identical JSON shape and constant-time latency envelope:
  ```json
  {
    "status": "CHALLENGE_ISSUED",
    "cooldown_seconds": 60,
    "message_key": "auth.otp.challenge_issued"
  }
  ```
  The response never discloses whether the phone number belongs to an existing user, a new customer, or a registered provider.

### 2.3 Dual OTP Provider Strategy (`IOtpProvider`)
Per Master Contract Section 3.4 and approval `APP-001`:
```typescript
export interface IOtpProvider {
  sendOtp(phone: string, otp: string, correlationId: string): Promise<{ success: boolean; providerRef?: string }>;
}
```
- **`MockOtpProvider` (Active in Dev / CI)**: Returns deterministic OTP (`123456` in local dev or logs to terminal), sends no external SMS, incurs zero spend. Rate limiting, hashing, attempt expiry, and anti-enumeration envelopes execute identically.
- **`SmsOtpProvider` (Production / Staging Gate)**: Third-party SMS gateway integration (e.g. Gupshup / Msg91 / Twilio) activated only after Owner approval `APP-001`.

### 2.4 Token Architecture & Session Management
1. **Access Token**:
   - Short-lived JWT (15-minute expiry).
   - Cryptographically signed using asymmetric RS256 or EdDSA.
   - Claims:
     ```json
     {
       "sub": "usr_01J7K8M9N0...",
       "session_id": "ses_01J7K8M9N1...",
       "roles": ["CUSTOMER", "PROVIDER"],
       "active_role": "CUSTOMER",
       "iat": 1789257600,
       "exp": 1789258500
     }
     ```
2. **Refresh Token**:
   - Cryptographically random 256-bit opaque string.
   - Stored as a salted SHA-256 hash in `auth_sessions`.
   - Long-lived (30 days); rotated on every single use (Refresh Token Rotation - RTR).
   - Detection of reused refresh tokens instantly revokes the entire session family.
3. **Session Revocation & Logout**:
   - Explicit logout instantly revokes the session ID in the database.
   - Token blacklist or database session verification guarantees instant session revocation for high-impact security actions.

### 2.5 Role Switching & Self-Dealing Exclusion
1. A user holding both roles can switch active mode via `POST /api/v1/auth/role-switch`.
2. The server issues a refreshed Access Token with `active_role: "PROVIDER"` or `active_role: "CUSTOMER"`.
3. **Self-Dealing Guard**: Any request to dispatch quotes, accept quotes, or create a booking enforces:
   `ASSERT request.customer_id != quote.provider_user_id`. An account can never transact with its own provider identity.

### 2.6 Admin Authentication & Mandatory TOTP MFA
1. Admin accounts authenticate using email + strong password + mandatory Time-based One-Time Password (TOTP, RFC 6238).
2. Admin sessions are short-lived (4 hours max), bound to IP/user-agent, and strictly audited.
3. No shared or service admin accounts are allowed.

---

## 3. Consequences

### Positive
- Zero password fatigue for lower-income and elderly users.
- Immune to phone number enumeration attacks.
- Complete unblocking of local dev and automated CI testing via `MockOtpProvider`.
- Hardened against session replay and account takeover.

### Negative / Trade-offs
- SMS delivery failures in low-connectivity areas must be handled with clear retry UX and voice-call fallback in later phases.
