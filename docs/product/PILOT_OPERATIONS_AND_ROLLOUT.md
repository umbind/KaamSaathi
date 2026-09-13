# KaamSaathi Closed Pilot Operations and Rollout Manual

**Document Reference**: `OPS-PILOT-001`  
**Version**: 1.0.0  
**Effective Date**: September 2026  
**Geographic Jurisdiction**: Uttar Pradesh, India  
**Approved By**: Umesh Kumar (Project Owner & Product Sponsor)  

---

## 1. Executive Summary & Pilot Scope

The KaamSaathi Closed Pilot evaluates the operational stability, hyper-local liquidity, safety protocols, and low-connectivity resilience of the platform prior to state-wide public release. 

While the data layer, geo-spatial indexing, and localization support all **75 districts of Uttar Pradesh**, the initial closed pilot operates in **3 dense seed clusters**:

```
+---------------------------------------------------------------------------------------+
|                       UTTAR PRADESH CLOSED PILOT SEED CLUSTERS                        |
|                                                                                       |
|   1. LUCKNOW CLUSTER (Central UP)                                                     |
|      - Zones: Gomti Nagar, Alambagh, Hazratganj, Indira Nagar, Chowk                  |
|      - Target Providers: 40 Electricians, 35 Plumbers, 25 Appliance Technicians       |
|                                                                                       |
|   2. VARANASI CLUSTER (Eastern UP)                                                    |
|      - Zones: Sigra, Bhelupur, Lanka, Shivpur, Mahmoorganj                            |
|      - Target Providers: 30 Electricians, 25 Plumbers, 20 Appliance Technicians       |
|                                                                                       |
|   3. KANPUR NAGAR CLUSTER (Industrial/Commercial UP)                                  |
|      - Zones: Kakadeo, Civil Lines, Swaroop Nagar, Kalyanpur, Kidwai Nagar            |
|      - Target Providers: 35 Electricians, 30 Plumbers, 25 Appliance Technicians       |
+---------------------------------------------------------------------------------------+
```

### 1.1 Commercial Policy during Pilot
- **0% Platform Commission**: 100% of the negotiated quote is retained by the service provider (`APP-COMM-001`).
- **Zero Hidden Convenience Fees**: Customers pay exactly the agreed quote plus any formally approved change orders.
- **Direct Settlement**: Customers settle in cash or direct UPI QR scan with the provider upon service sign-off.

---

## 2. Statutory Compliance & Grievance Redressal (IT Rules 2021)

Under the **Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021**, KaamSaathi publishes the following designated Grievance Officer details and statutory escalation workflows.

### 2.1 Grievance Redressal Officer
- **Name**: Rajeshwar Dayal Verma
- **Title**: Head of Trust, Safety & Regulatory Redressal
- **Physical Address**:  
  KaamSaathi Operations Centre  
  4th Floor, Cyber Heights, Vibhuti Khand,  
  Gomti Nagar, Lucknow, Uttar Pradesh – 226010, India  
- **Official Grievance Email**: `grievance-officer@kaamsaathi.in`  
- **Dedicated Redressal Telephone**: `+91 522 491 8000` (Mon–Sat, 09:00 to 18:00 IST)  

### 2.2 Statutory SLA & Timelines
1. **Receipt Acknowledgment**: Automatic unique ticket generation within **24 hours**.
2. **Dispute Redressal**: Formal resolution and written communication within **15 days** of receipt (Internal operational SLA targets < **48 hours** for job disputes).
3. **Appeals Mechanism**: Users may submit an appeal via the Admin/Support interface within 7 days of dispute closure.

---

## 3. Emergency Safety Protocol & Doorstep SOP

Because service transactions occur physically at domestic residences, user safety is paramount.

### 3.1 Integrated Emergency Helplines
All mobile application views (Customer and Provider) and Web landing pages persistently render emergency contacts:
- **Police Emergency**: `112`
- **Women Power Line (UP Specialised)**: `1090`
- **Childline (Ministry of Women & Child Development)**: `1098`

### 3.2 In-App Safety Trigger Flow (`SCR-C-SAFETY`)
1. User taps the floating red **Safety Shield / Emergency** icon.
2. Bottom sheet displays immediate direct dialers to `112` and `1090`.
3. System immediately copies live booking metadata (Customer name, Provider verified name, Vehicle/ID reference, current GPS timestamp) to clipboard for quick SMS sharing with family.
4. An automated high-priority alert (`SEV-1-SAFETY`) triggers in the KaamSaathi Admin Operations Console with audio ping.
5. On-duty operations manager places a proactive check-in call to both customer and provider within 3 minutes.

---

## 4. Provider Field Onboarding and Verification Checklist

Every pilot provider undergoes a mandatory 4-stage ground onboarding protocol before receiving the `VERIFIED` profile badge.

| Stage | Verification Action | Required Evidence | Verification Owner |
|---|---|---|---|
| **1. Identity Verification** | In-person government photo ID check | Aadhaar (last 4 digits masked + offline XML QR verification) OR Voter ID | Field Lead |
| **2. Trade & Skill Check** | Practical trade evaluation | 3 past client references OR Trade Certificate (ITI / National Skill Dev Corp) | Category Manager |
| **3. Mobile & Digital Readiness** | Smartphone capability drill | Verified installation on Android 8.0+ device; simulated quote submission | Field Trainer |
| **4. Legal & Code of Conduct** | Signing the Fair Trade agreement | Consent to Zero Discrimination policy, Zero Alcohol/Substance policy | Operations Compliance |

---

## 5. Field Testing Checklist: 2G Networks & Low-End Android

Field technicians test in Tier-2/3 conditions across Lucknow, Varanasi, and Kanpur.

### 5.1 Device Specification Matrix
- **Minimum Test Bench**:
  - Device: Redmi 6A / Realme C2 / Samsung Galaxy A03 Core
  - OS: Android 8.1 (API 27) / Android 10 (Go Edition)
  - RAM: 2 GB
  - Processor: Quad-core 1.5 GHz MediaTek / Unisoc
  - Display: 720x1440 HD+, font scaling set to 150% and 200%

### 5.2 Network Stress Scenarios
1. **2G Edge Emulation (100 kbps, 800ms latency)**:
   - Category navigation must render cached icons within 400ms.
   - Quote submission must queue locally and show "Sending..." state without dropping data.
2. **Tunnel / Basements / Zero-Signal Drop**:
   - Provider marks job "Started" offline.
   - App stores timestamped state in local SQLite database.
   - Once connectivity resumes, sync engine replays event with original offline timestamp.
3. **Battery Drain Benchmark**:
   - Continuous background location tracking during "En Route" phase must consume < 3% battery per active hour.

---

## 6. Pilot KPI Scorecard and Success Criteria

The closed pilot will be declared ready for broad public roll-out across all 75 UP districts once the following metrics are sustained over a 21-day period:

| Metric | Target Threshold | Measured Via |
|---|---|---|
| **Supply Density** | >= 25 verified providers per category in each seed cluster | Admin Operations DB |
| **Time to First Quote** | <= 15 minutes for 85% of submitted requests | Request-to-Quote event log |
| **Mutual Contact Reveal Success** | 100% gated until customer quote acceptance | Automated API audit assertion |
| **Customer Dispute Rate** | < 2.5% of completed bookings | Dispute Resolution Table |
| **App Crash Rate** | < 0.2% sessions across low-end Android cohort | Crashlytics / Sentry telemetry |
| **Average Provider Net Rating** | >= 4.3 out of 5.0 stars | Review Aggregate Views |
