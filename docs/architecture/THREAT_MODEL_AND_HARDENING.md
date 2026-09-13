# KaamSaathi Threat Model and System Hardening Specification

**Document Reference**: `SEC-THREAT-001`  
**Version**: 1.0.0  
**Classification**: Engineering & Security Architecture Baseline  
**Target Environment**: Uttar Pradesh Hyperlocal Marketplace (Android & Node.js Microservices)  
**Primary Author**: KaamSaathi Security Engineering  
**Approved By**: Umesh Kumar (Project Owner & Product Sponsor)  

---

## 1. Executive Summary & Security Boundary

KaamSaathi is a hyperlocal blue-collar service marketplace operating across all 75 districts of Uttar Pradesh. Due to cash transactions, doorstep service delivery, and sensitive identity data (Aadhaar, phone numbers, home locations), the platform adheres to a strict Defense-in-Depth security model.

```
+-----------------------------------------------------------------------------------+
|                              UNTRUSTED EXTERNAL ZONE                              |
|  +---------------------------+   +----------------------+   +------------------+  |
|  | Android Customer App      |   | Android Provider App |   | Public Web/SEO   |  |
|  +-------------+-------------+   +----------+-----------+   +--------+---------+  |
+----------------|----------------------------|------------------------|------------+
                 | TLS 1.3 (Strict HTTPS)     | TLS 1.3 (Cert Pinning) | TLS 1.3
+----------------V----------------------------V------------------------V------------+
|                             EDGE & PERIMETER DEFENSE                              |
|  - Cloudflare / Reverse Proxy: DDoS mitigation, IP Rate Limiting                  |
|  - WAF: OWASP Core Rule Set, Geo-blocking (outside IN, optional staging lock)    |
|  - TLS Termination: TLS 1.3 exclusively, Modern Cipher Suites                     |
+---------------------------------------+-------------------------------------------+
                                        |
+---------------------------------------V-------------------------------------------+
|                             APPLICATION SECURITY DMZ                              |
|  +-----------------------------------------------------------------------------+  |
|  | KaamSaathi API Gateway & Core Service (@kaamsaathi/api)                     |  |
|  |  - Rate Limiter (Token Bucket per IP / Phone)                               |  |
|  |  - Phone OTP Provider Guard & Anti-Enumeration                              |  |
|  |  - JWT / RTR Token Verification & Reuse Detection                           |  |
|  |  - RBAC & Scope Enforcement (Customer, Provider, Admin)                    |  |
|  |  - Anti-Self-Dealing Guard (Customer ID != Provider User ID)                |  |
|  |  - Contact Reveal Gatekeeper (Locked until Quote Accepted)                  |  |
|  +------------------------------------+----------------------------------------+  |
+---------------------------------------|-------------------------------------------+
                                        |
+---------------------------------------V-------------------------------------------+
|                              SECURE DATA STORE TIER                               |
|  +-----------------------------+     +-----------------------------------------+  |
|  | Redis 7.2 (Cache & Locks)   |     | PostgreSQL 16 + PostGIS (Persistent DB) |  |
|  |  - Ephemeral OTP hashes     |     |  - AES-256-GCM column encryption        |  |
|  |  - RTR Token Families       |     |  - Append-only immutable audit log      |  |
|  |  - Distributed Mutex Locks  |     |  - Strict Foreign Keys & Row Locks      |  |
|  +-----------------------------+     +-----------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. STRIDE Threat Analysis Matrix

| STRIDE Category | Threat Description | Affected Asset | Severity | Implemented Defensive Control |
|---|---|---|---|---|
| **Spoofing** | Adversary attempts OTP brute-forcing to hijack user accounts | Phone Auth Service | **Critical** | Strict rate limiting (3 attempts per 15 minutes, 60s cooldown per number). 6-digit cryptographically secure OTP with 5-minute TTL. Hash comparison using constant-time algorithms. |
| **Spoofing** | Attacker crafts forged JWT tokens to impersonate Admin | Admin Operations | **Critical** | Mandatory TOTP MFA for all admin sessions (`role=ADMIN`). Separate admin session tokens with 8-hour expiry. HS256/RS256 signed with 256-bit secret. |
| **Tampering** | Man-in-the-Middle tampers with pricing or job coordinates | Mobile API Traffic | **High** | Mandatory TLS 1.3. Android network security config enforces Certificate Pinning in production. Integer paise representation prevents rounding fraud. |
| **Tampering** | Malicious admin alters or deletes audit history | Audit Table | **Critical** | Append-only `audit_logs` table. Database triggers and application guards prohibit `UPDATE` or `DELETE` on audit records. SHA-256 hash chaining of audit sequence. |
| **Repudiation** | Provider denies accepting a quote or completing a job | Job Lifecycle | **Medium** | Immutable timestamped state transitions (`ACCEPTED`, `IN_PROGRESS`, `COMPLETED`). Completion requires OTP shared by customer at doorstep. |
| **Information Disclosure** | Scraping customer addresses or phone numbers via search | Search & Discovery API | **Critical** | Strict contact masking (`APP-002`). Phone numbers and full home addresses are obscured until explicit quote acceptance. Geolocation fuzzed to 500m radius in open search. |
| **Information Disclosure** | Leakage of Provider Aadhaar or PAN documents | Verification Storage | **Critical** | Only last 4 digits of Aadhaar stored in plaintext. Identity documents stored in private object storage using AES-256-GCM with short-lived presigned URLs (15m expiry). |
| **Denial of Service** | OTP SMS spamming draining platform credit | Identity Service | **High** | Global IP rate limiting (10 req/min/IP) and phone rate limiting (3 OTPs/15 min). Phone numbers validated against Indian E.164 format (`+91[6-9]\d{9}`). |
| **Elevation of Privilege** | Normal user accesses Admin disputes or provider payouts | Admin & Review Service | **Critical** | Role-Based Access Control (`UserRole`: `CUSTOMER`, `PROVIDER`, `ADMIN`). Guard layer verifies admin role and active MFA session flag on all `/api/v1/admin/*` routes. |
| **Elevation of Privilege** | Provider quotes and accepts their own service request | Market Integrity | **High** | Anti-Self-Dealing verification: Engine asserts `request.customer_id != provider.user_id` at quote submission and booking acceptance. |

---

## 3. Cryptographic and Data Protection Controls

### 3.1 Encryption in Transit
- **TLS Version**: Exclusively **TLS 1.3** on public endpoints (API, Admin, Web). Fallback to TLS 1.2 restricted to AEAD cipher suites (`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`).
- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **Certificate Pinning**: Enabled in Android `network_security_config.xml` for production domain.

### 3.2 Encryption at Rest
- **Database Volumes**: PostgreSQL data volume encrypted using host-level AES-XTS-256 (LUKS/dm-crypt or cloud KMS).
- **Sensitive Column Encryption**: Provider government ID numbers and document references encrypted at application layer using **AES-256-GCM** with unique initialization vectors (IV) per record before persistence.
- **Password & Secret Hashing**: Admin bootstrap passwords hashed using `argon2id` (memory cost 64MB, time cost 3, parallelism 1).

### 3.3 Refresh Token Rotation (RTR) & Anti-Replay
- Refresh tokens are single-use cryptographically random 256-bit tokens stored as SHA-256 digests in `refresh_tokens`.
- **Token Family Invalidation**: If an expired or already-consumed refresh token is presented, the entire token family is immediately revoked, forcing re-authentication across all user devices.

### 3.4 PII Masking & Data Minimization
- Customer phone number is hidden from providers during browsing, searching, and quoting.
- Upon quote acceptance, mutual contact reveal is unlocked strictly for the booked provider and customer.
- Application logs automatically mask phone numbers (`+91 98**** 1234`) and OTP values (`******`).

---

## 4. Rate Limiting and Abuse Prevention

| Endpoint / Action | Key / Dimension | Limit | Window | Action on Exceeded |
|---|---|---|---|---|
| `POST /api/v1/identity/otp/request` | Phone Number | 3 requests | 15 minutes | HTTP 429 (`TOO_MANY_REQUESTS`), retry-after header |
| `POST /api/v1/identity/otp/request` | Client IP | 10 requests | 1 minute | HTTP 429, temporary IP tarpit |
| `POST /api/v1/identity/otp/verify` | Phone Number | 5 attempts | 5 minutes | Invalidate active OTP, lock verification for 15 mins |
| `POST /api/v1/requests` | Customer ID | 5 requests | 24 hours | HTTP 429 ("Daily request limit reached") |
| `POST /api/v1/quotes` | Provider ID | 20 quotes | 24 hours | HTTP 429 ("Quote submission quota reached") |
| `GET /api/v1/providers/search` | Client IP | 60 requests | 1 minute | HTTP 429, block scraper bots |

---

## 5. Failure Testing, Chaos, and Resilience Matrix

| Scenario | Injected Fault | Expected System Behavior | Verified In |
|---|---|---|---|
| **Intermittent 2G / Packet Loss** | 2000ms latency, 30% drop rate on mobile client | Android app caches request locally, displays offline indicator, uses exponential backoff retry with jitter. | Android Network Interceptor test suite |
| **Concurrent Booking Collision** | 2 concurrent acceptances for the same provider slot | PostgreSQL row-level lock (`SELECT ... FOR UPDATE`) guarantees atomic booking; second request rejected with HTTP 409 (`SLOT_UNAVAILABLE`). | API Concurrency Test Suite |
| **SMS Gateway Outage** | External SMS Provider returns 500 / timeout | Circuit breaker opens after 5 consecutive failures. System switches to secondary SMS route or falls back to voice OTP. Clear error displayed to user. | MockOtpProvider & SMS Failover Harness |
| **Database Network Partition** | API severed from PostgreSQL for 15s | Healthcheck `/health` reports UNHEALTHY within 5s. Docker/K8s restarts connection pool; requests queue gracefully or fail fast with 503. | Docker Compose healthcheck integration |
| **Payment Gateway Webhook Duplication** | Razorpay/UPI sends identical webhook 3 times | Webhook processor validates `X-Idempotency-Key` and checks payment transaction status; duplicate events return 200 without duplicate credit. | Slice 5 Job Lifecycle test suite |

---

## 6. Audit Log Immutability & Forensics

All state-modifying operations emit structured audit records adhering to `EVENT_AND_AUDIT_CONTRACTS.md`:

1. **Schema & Fields**:
   - `id`: UUIDv4
   - `timestamp`: UTC ISO 8601
   - `actor_id`: User UUID or `SYSTEM`
   - `actor_role`: `CUSTOMER` | `PROVIDER` | `ADMIN` | `SYSTEM`
   - `action`: Specific action code (e.g. `BOOKING_ACCEPTED`, `DISPUTE_RESOLVED`, `MFA_CHALLENGE_PASSED`)
   - `entity_type`: Target entity (`user`, `booking`, `dispute`, `quote`)
   - `entity_id`: UUID of the affected entity
   - `payload_diff`: JSON representation of previous vs updated state (sensitive fields scrubbed)
   - `ip_address` & `user_agent`: Client network metadata
   - `hash_signature`: HMAC-SHA256 of the audit record computed using internal KMS key.

2. **Tamper Detection**:
   - Any gap in audit sequence numbers or hash signature mismatch alerts the security engineering team immediately.
