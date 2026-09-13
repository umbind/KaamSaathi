import crypto from 'node:crypto';
import { CustomerProfileDto, ProviderProfileDto, UserDto, IdempotencyRecord } from '@kaamsaathi/contracts';

export interface UserRecord {
  id: string;
  phone_hmac: string;
  phone_encrypted: string;
  status: string;
  roles: Array<'CUSTOMER' | 'PROVIDER' | 'ADMIN'>;
  active_role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  preferred_language: 'hi' | 'en';
  is_admin: boolean;
  email?: string;
  password_hash?: string;
  totp_secret?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthSessionRecord {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  user_agent?: string;
  ip_address?: string;
  is_revoked: boolean;
  revoked_reason?: string;
  expires_at: Date;
  created_at: Date;
  updated_at?: Date;
}


export interface OtpChallengeRecord {
  id: string;
  phone_hmac: string;
  otp_code: string;
  attempt_count: number;
  max_attempts: number;
  is_used: boolean;
  expires_at: Date;
  created_at: Date;
}

export interface CustomerProfileRecord {
  id: string;
  user_id: string;
  full_name: string;
  district_id: string;
  locality_name: string;
  pin_code: string;
  address_line_encrypted?: string;
  masked_notifications: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProviderProfileRecord {
  id: string;
  user_id: string;
  business_name: string;
  trade_title: string;
  status: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED_ACTIVE' | 'RESTRICTED';
  availability_status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  bio?: string;
  years_experience: number;
  rating_avg: number;
  rating_count: number;
  completed_jobs_count: number;
  badges_summary: Array<{ code: string; label: string; verified_at: string }>;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLogRecord {
  id: number;
  entity_name: string;
  entity_id: string;
  actor_id?: string;
  actor_role: string;
  action: string;
  previous_state?: string;
  new_state?: string;
  metadata: Record<string, unknown>;
  ip_address?: string;
  correlation_id: string;
  created_at: Date;
}

export class InMemoryDatabase {
  private users = new Map<string, UserRecord>();
  private sessions = new Map<string, AuthSessionRecord>();
  private otpChallenges: OtpChallengeRecord[] = [];
  private customerProfiles = new Map<string, CustomerProfileRecord>();
  private providerProfiles = new Map<string, ProviderProfileRecord>();
  private idempotency = new Map<string, IdempotencyRecord>();
  private auditLogs: AuditLogRecord[] = [];
  private auditIdSequence = 1;

  reset(): void {
    this.users.clear();
    this.sessions.clear();
    this.otpChallenges = [];
    this.customerProfiles.clear();
    this.providerProfiles.clear();
    this.idempotency.clear();
    this.auditLogs = [];
    this.auditIdSequence = 1;
  }

  // Users
  findUserById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  findUserByPhoneHmac(phoneHmac: string): UserRecord | undefined {
    for (const u of this.users.values()) {
      if (u.phone_hmac === phoneHmac) return u;
    }
    return undefined;
  }

  findUserByEmail(email: string): UserRecord | undefined {
    for (const u of this.users.values()) {
      if (u.email && u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return undefined;
  }

  saveUser(user: UserRecord): UserRecord {
    this.users.set(user.id, { ...user, updated_at: new Date() });
    return this.users.get(user.id)!;
  }

  // Sessions
  saveSession(session: AuthSessionRecord): AuthSessionRecord {
    this.sessions.set(session.id, session);
    return session;
  }

  findSessionByRefreshTokenHash(tokenHash: string): AuthSessionRecord | undefined {
    for (const s of this.sessions.values()) {
      if (s.refresh_token_hash === tokenHash) return s;
    }
    return undefined;
  }

  findSessionById(id: string): AuthSessionRecord | undefined {
    return this.sessions.get(id);
  }

  revokeSession(id: string, reason: string): void {
    const s = this.sessions.get(id);
    if (s) {
      s.is_revoked = true;
      s.revoked_reason = reason;
    }
  }

  revokeAllSessionsForUser(userId: string, reason: string): void {
    for (const s of this.sessions.values()) {
      if (s.user_id === userId) {
        s.is_revoked = true;
        s.revoked_reason = reason;
      }
    }
  }

  // OTP Challenges
  saveOtpChallenge(challenge: OtpChallengeRecord): void {
    this.otpChallenges.push(challenge);
  }

  findLatestValidOtp(phoneHmac: string): OtpChallengeRecord | undefined {
    const now = new Date();
    // Return newest unexpired challenge
    for (let i = this.otpChallenges.length - 1; i >= 0; i--) {
      const c = this.otpChallenges[i];
      if (c.phone_hmac === phoneHmac && !c.is_used && c.expires_at > now) {
        return c;
      }
    }
    return undefined;
  }

  findLatestOtpAny(phoneHmac: string): OtpChallengeRecord | undefined {
    for (let i = this.otpChallenges.length - 1; i >= 0; i--) {
      const c = this.otpChallenges[i];
      if (c.phone_hmac === phoneHmac) return c;
    }
    return undefined;
  }

  // Customer Profiles
  findCustomerProfileByUserId(userId: string): CustomerProfileRecord | undefined {
    for (const cp of this.customerProfiles.values()) {
      if (cp.user_id === userId) return cp;
    }
    return undefined;
  }

  saveCustomerProfile(profile: CustomerProfileRecord): CustomerProfileRecord {
    this.customerProfiles.set(profile.id, { ...profile, updated_at: new Date() });
    return profile;
  }

  // Provider Profiles
  findProviderProfileByUserId(userId: string): ProviderProfileRecord | undefined {
    for (const pp of this.providerProfiles.values()) {
      if (pp.user_id === userId) return pp;
    }
    return undefined;
  }

  saveProviderProfile(profile: ProviderProfileRecord): ProviderProfileRecord {
    this.providerProfiles.set(profile.id, { ...profile, updated_at: new Date() });
    return profile;
  }

  // Idempotency
  getIdempotency(key: string): IdempotencyRecord | undefined {
    const rec = this.idempotency.get(key);
    if (rec && rec.expires_at < new Date()) {
      this.idempotency.delete(key);
      return undefined;
    }
    return rec;
  }

  saveIdempotency(record: IdempotencyRecord): void {
    this.idempotency.set(record.key, record);
  }

  // Audit Logs
  logAudit(audit: Omit<AuditLogRecord, 'id' | 'created_at'>): AuditLogRecord {
    const rec: AuditLogRecord = {
      ...audit,
      id: this.auditIdSequence++,
      created_at: new Date(),
    };
    this.auditLogs.push(rec);
    return rec;
  }

  getAuditLogs(): AuditLogRecord[] {
    return [...this.auditLogs];
  }
}

export const db = new InMemoryDatabase();
