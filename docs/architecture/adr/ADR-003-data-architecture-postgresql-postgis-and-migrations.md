# ADR-003: Data Architecture, PostgreSQL/PostGIS & Migration Strategy

- **Status**: `ACCEPTED` (Approved by Principal Architect & Backend Lead)
- **Date**: `2026-09-13`
- **Deciders**: Umesh Kumar (Project Owner), Principal Architect, Backend Lead

---

## 1. Context & Problem Statement

KaamSaathi is a hyperlocal marketplace operating across all 75 districts of Uttar Pradesh. Core queries require:
- Proximity-based matching: finding active, verified providers whose configured service radius encompasses the customer's locality.
- Strict transactional consistency: quote acceptance, booking creation, and payment state changes must avoid race conditions and double-booking.
- Schema evolution: forward-compatible migrations to avoid downtime and data corruption.

---

## 2. Decision

### 2.1 Database Engine
We standardize on **PostgreSQL 16+ with the PostGIS 3.4+ extension**.
- Primary relational storage for all users, profiles, categories, requests, quotes, bookings, and audit records.
- Spatial index (`GiST`) for fast radius and polygon containment queries across UP districts and PIN codes.

### 2.2 Geospatial Modeling for Uttar Pradesh
1. **Spatial Representation**: Coordinates stored using standard WGS 84 (`SRID 4326`) as `GEOMETRY(Point, 4326)`.
2. **Provider Coverage Area**: Stored either as a center point + radius in meters, or as a polygon boundary matching specific UP administrative blocks / PIN codes:
   ```sql
   CREATE TABLE provider_coverage (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
       district_id VARCHAR(50) NOT NULL, -- e.g. 'UP_LUCKNOW', 'UP_VARANASI'
       location_center GEOMETRY(Point, 4326) NOT NULL,
       radius_meters INTEGER NOT NULL CHECK (radius_meters BETWEEN 1000 AND 50000),
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   CREATE INDEX idx_provider_coverage_geo ON provider_coverage USING GIST (location_center);
   CREATE INDEX idx_provider_coverage_district ON provider_coverage (district_id);
   ```
3. **Hyperlocal Matching Query**:
   ```sql
   SELECT p.id, p.user_id, p.rating_avg
   FROM provider_profiles p
   JOIN provider_coverage c ON c.provider_id = p.id
   JOIN provider_services s ON s.provider_id = p.id
   WHERE s.category_id = :categoryId
     AND p.status = 'APPROVED_ACTIVE'
     AND p.availability_status = 'AVAILABLE'
     AND c.district_id = :customerDistrictId
     AND ST_DWithin(
         c.location_center::geography,
         ST_SetSRID(ST_MakePoint(:customerLon, :customerLat), 4326)::geography,
         c.radius_meters
     )
   LIMIT 10;
   ```

### 2.3 Monetary & Timestamp Standards
- **Currency**: All financial values (estimates, quotes, change orders, payment records) are stored as integers in **minor units (paise)**:
  `50000` = ₹500.00. Floating-point numbers are strictly forbidden for currency.
- **Timestamps**: All database columns use `TIMESTAMPTZ` (UTC). Timezone conversion to `Asia/Kolkata` (IST) is handled at the API/UI presentation layer.

### 2.4 Dev & CI Execution Strategy (Addressing Host Tooling)
Given the host machine currently lacks native `psql` / PostgreSQL binaries:
1. **Unit & Contract Tests**: Run in-memory using **PGlite** (PostgreSQL compiled to WebAssembly) or SQLite with spatial function mocks for rapid test execution.
2. **Integration & Staging**: Execute against a standard containerized PostgreSQL 16 + PostGIS service.

### 2.5 Migration Framework & Invariants
1. Database schema changes use an automated, version-controlled migration tool (Prisma / TypeORM / Umzug).
2. **Zero-Downtime Expand/Contract**:
   - Step 1 (Expand): Add nullable columns or new tables.
   - Step 2: Deploy code writing to new columns.
   - Step 3 (Contract): Backfill, apply NOT NULL constraints, drop deprecated columns in separate migrations.
3. Every migration must include a verified rollback script or deterministic forward-fix plan.

---

## 3. Consequences

### Positive
- Sub-millisecond hyperlocal geospatial filtering using PostGIS indexes.
- Transactional guarantees prevent quote double-acceptance and phantom bookings.
- Unambiguous monetary and timezone representation eliminates rounding errors and scheduling confusion.

### Negative / Trade-offs
- PostGIS functions require spatial libraries in staging/production Docker containers.
