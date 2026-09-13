import {
  CustomerProfileDto,
  ProviderProfileDto,
  UserDto,
  IdempotencyRecord,
  DisputeReason,
  DisputeStatus,
  SafetySeverity,
  SafetyCategory,
  SafetyIncidentStatus,
} from '@kaamsaathi/contracts';

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
  badges_summary: Array<{ code: string; label: string; reviewed_item: string; verified_at: string }>;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryRecord {
  id: string;
  name_en: string;
  name_hi: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface ProviderCoverageRecord {
  id: string;
  provider_id: string;
  district_id: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  created_at: Date;
}

export interface ProviderServiceRecord {
  id: string;
  provider_id: string;
  category_id: string;
  visitation_fee_paise: number;
  pricing_notes?: string;
  created_at: Date;
}

export interface VerificationSubmissionRecord {
  id: string;
  provider_id: string;
  document_type: 'GOVT_PHOTO_ID' | 'TRADE_CERT' | 'POLICE_CLEARANCE';
  storage_path: string;
  status: 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewer_id?: string;
  review_notes?: string;
  badge_granted?: string;
  reviewed_at?: Date;
  created_at: Date;
}

export interface RequestRecord {
  id: string;
  customer_id: string;
  category_id: string;
  request_type: 'TARGETED' | 'BROADCAST';
  target_provider_id?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'MATCHING' | 'LEAD_DISPATCHED' | 'QUOTED' | 'QUOTES_RECEIVED' | 'BOOKED' | 'CANCELLED';
  district_id: string;
  locality_name: string;
  pin_code: string;
  latitude?: number;
  longitude?: number;
  description: string;
  preferred_schedule_window?: string;
  media_attachment_paths: string[];
  dispatched_leads_count: number;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface LeadRecord {
  id: string;
  request_id: string;
  provider_id: string;
  status: 'DISPATCHED' | 'VIEWED' | 'DECLINED' | 'QUOTED' | 'EXPIRED';
  decline_reason?: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface QuoteRecord {
  id: string;
  request_id: string;
  lead_id: string;
  provider_id: string;
  status: 'DRAFT' | 'DISPATCHED' | 'VIEWED' | 'ACCEPTED' | 'SUPERSEDED' | 'EXPIRED' | 'WITHDRAWN';
  visitation_fee_paise: number;
  estimated_labor_paise: number;
  estimated_parts_paise: number;
  total_estimate_paise: number;
  scope_notes: string;
  expires_at: Date;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface BookingRecord {
  id: string;
  request_id: string;
  quote_id: string;
  customer_id: string;
  provider_id: string;
  status: 'SCHEDULED' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  agreed_visitation_fee_paise: number;
  agreed_labor_estimate_paise: number;
  agreed_parts_estimate_paise: number;
  total_agreed_estimate_paise: number;
  scheduled_window: string;
  consent_contact_reveal: boolean;
  is_disputed?: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface ChangeOrderRecord {
  id: string;
  booking_id: string;
  description: string;
  additional_labor_paise: number;
  additional_parts_paise: number;
  total_additional_paise: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentRecord {
  id: string;
  booking_id: string;
  payment_method: 'CASH' | 'UPI';
  amount_paise: number;
  reference_id?: string;
  status: 'PROVIDER_DECLARED' | 'CONFIRMED' | 'DISPUTED';
  declared_at: Date;
  confirmed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewRecord {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  provider_response?: string;
  provider_responded_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DisputeRecord {
  id: string;
  booking_id: string;
  filed_by_id: string;
  filed_by_role: 'CUSTOMER' | 'PROVIDER';
  reason: DisputeReason;
  description: string;
  evidence_keys: string[];
  status: DisputeStatus;
  resolution_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SafetyIncidentRecord {
  id: string;
  reporter_id: string;
  booking_id?: string;
  category: SafetyCategory;
  description: string;
  severity: SafetySeverity;
  status: SafetyIncidentStatus;
  locality?: string;
  district?: string;
  is_priority: boolean;
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
  private categories = new Map<string, CategoryRecord>();
  private providerCoverage = new Map<string, ProviderCoverageRecord>();
  private providerServices = new Map<string, ProviderServiceRecord[]>();
  private verificationSubmissions = new Map<string, VerificationSubmissionRecord>();
  private requests = new Map<string, RequestRecord>();
  private leads = new Map<string, LeadRecord>();
  private quotes = new Map<string, QuoteRecord>();
  private bookings = new Map<string, BookingRecord>();
  private changeOrders = new Map<string, ChangeOrderRecord>();
  private payments = new Map<string, PaymentRecord>();
  private reviews = new Map<string, ReviewRecord>();
  private disputes = new Map<string, DisputeRecord>();
  private safetyIncidents = new Map<string, SafetyIncidentRecord>();
  private idempotency = new Map<string, IdempotencyRecord>();
  private auditLogs: AuditLogRecord[] = [];
  private auditIdSequence = 1;

  constructor() {
    this.seedCategories();
  }

  reset(): void {
    this.users.clear();
    this.sessions.clear();
    this.otpChallenges = [];
    this.customerProfiles.clear();
    this.providerProfiles.clear();
    this.providerCoverage.clear();
    this.providerServices.clear();
    this.verificationSubmissions.clear();
    this.requests.clear();
    this.leads.clear();
    this.quotes.clear();
    this.bookings.clear();
    this.changeOrders.clear();
    this.payments.clear();
    this.reviews.clear();
    this.disputes.clear();
    this.safetyIncidents.clear();
    this.idempotency.clear();
    this.auditLogs = [];
    this.auditIdSequence = 1;
    this.seedCategories();
  }

  private seedCategories(): void {
    this.categories.clear();
    const defaults: CategoryRecord[] = [
      { id: 'electrician', name_en: 'Electrician', name_hi: 'बिजली मिस्त्री', icon_name: 'zap', display_order: 1, is_active: true },
      { id: 'plumber', name_en: 'Plumber', name_hi: 'नल मिस्त्री', icon_name: 'droplet', display_order: 2, is_active: true },
      { id: 'appliance_repair', name_en: 'Appliance Repair', name_hi: 'उपकरण मरम्मत', icon_name: 'cpu', display_order: 3, is_active: true },
    ];
    for (const cat of defaults) {
      this.categories.set(cat.id, cat);
    }
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

  findCustomerProfileById(id: string): CustomerProfileRecord | undefined {
    return this.customerProfiles.get(id);
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

  findProviderProfileById(id: string): ProviderProfileRecord | undefined {
    return this.providerProfiles.get(id);
  }

  // Categories
  getCategories(): CategoryRecord[] {
    return Array.from(this.categories.values()).filter(c => c.is_active);
  }

  getCategoryById(id: string): CategoryRecord | undefined {
    return this.categories.get(id);
  }

  // Provider Coverage
  saveProviderCoverage(coverage: ProviderCoverageRecord): ProviderCoverageRecord {
    this.providerCoverage.set(coverage.provider_id, coverage);
    return coverage;
  }

  getProviderCoverage(providerId: string): ProviderCoverageRecord | undefined {
    return this.providerCoverage.get(providerId);
  }

  // Provider Services
  saveProviderServices(providerId: string, services: ProviderServiceRecord[]): ProviderServiceRecord[] {
    this.providerServices.set(providerId, services);
    return services;
  }

  getProviderServices(providerId: string): ProviderServiceRecord[] {
    return this.providerServices.get(providerId) || [];
  }

  // Verification Submissions
  createVerificationSubmission(sub: VerificationSubmissionRecord): VerificationSubmissionRecord {
    this.verificationSubmissions.set(sub.id, sub);
    return sub;
  }

  updateVerificationSubmission(sub: VerificationSubmissionRecord): VerificationSubmissionRecord {
    this.verificationSubmissions.set(sub.id, sub);
    return sub;
  }

  getVerificationSubmissionById(id: string): VerificationSubmissionRecord | undefined {
    return this.verificationSubmissions.get(id);
  }

  getVerificationSubmissions(providerId: string): VerificationSubmissionRecord[] {
    return Array.from(this.verificationSubmissions.values()).filter(s => s.provider_id === providerId);
  }

  getPendingVerifications(): VerificationSubmissionRecord[] {
    return Array.from(this.verificationSubmissions.values()).filter(s => s.status === 'IN_REVIEW');
  }

  // Requests
  saveRequest(req: RequestRecord): RequestRecord {
    this.requests.set(req.id, { ...req, updated_at: new Date() });
    return req;
  }

  findRequestById(id: string): RequestRecord | undefined {
    return this.requests.get(id);
  }

  findRequestsByCustomerId(customerId: string): RequestRecord[] {
    return Array.from(this.requests.values()).filter(r => r.customer_id === customerId);
  }

  // Leads
  saveLead(lead: LeadRecord): LeadRecord {
    this.leads.set(lead.id, { ...lead, updated_at: new Date() });
    return lead;
  }

  findLeadById(id: string): LeadRecord | undefined {
    return this.leads.get(id);
  }

  findLeadsByProviderId(providerId: string): LeadRecord[] {
    return Array.from(this.leads.values()).filter(l => l.provider_id === providerId);
  }

  findLeadsByRequestId(requestId: string): LeadRecord[] {
    return Array.from(this.leads.values()).filter(l => l.request_id === requestId);
  }

  getAllProviderProfiles(): ProviderProfileRecord[] {
    return Array.from(this.providerProfiles.values());
  }

  // Quotes
  saveQuote(quote: QuoteRecord): QuoteRecord {
    this.quotes.set(quote.id, { ...quote, updated_at: new Date() });
    return quote;
  }

  findQuoteById(id: string): QuoteRecord | undefined {
    return this.quotes.get(id);
  }

  findQuotesByRequestId(requestId: string): QuoteRecord[] {
    return Array.from(this.quotes.values()).filter(q => q.request_id === requestId);
  }

  findQuotesByProviderId(providerId: string): QuoteRecord[] {
    return Array.from(this.quotes.values()).filter(q => q.provider_id === providerId);
  }

  // Bookings
  saveBooking(booking: BookingRecord): BookingRecord {
    this.bookings.set(booking.id, { ...booking, updated_at: new Date() });
    return booking;
  }

  findBookingById(id: string): BookingRecord | undefined {
    return this.bookings.get(id);
  }

  findBookingByRequestId(requestId: string): BookingRecord | undefined {
    return Array.from(this.bookings.values()).find(b => b.request_id === requestId);
  }

  findBookingsByCustomerId(customerId: string): BookingRecord[] {
    return Array.from(this.bookings.values()).filter(b => b.customer_id === customerId);
  }

  findBookingsByProviderId(providerId: string): BookingRecord[] {
    return Array.from(this.bookings.values()).filter(b => b.provider_id === providerId);
  }

  // Change Orders
  saveChangeOrder(order: ChangeOrderRecord): ChangeOrderRecord {
    this.changeOrders.set(order.id, { ...order, updated_at: new Date() });
    return order;
  }

  findChangeOrderById(id: string): ChangeOrderRecord | undefined {
    return this.changeOrders.get(id);
  }

  findChangeOrdersByBookingId(bookingId: string): ChangeOrderRecord[] {
    return Array.from(this.changeOrders.values()).filter(co => co.booking_id === bookingId);
  }

  // Payments
  savePayment(payment: PaymentRecord): PaymentRecord {
    this.payments.set(payment.id, { ...payment, updated_at: new Date() });
    return payment;
  }

  findPaymentById(id: string): PaymentRecord | undefined {
    return this.payments.get(id);
  }

  findPaymentByBookingId(bookingId: string): PaymentRecord | undefined {
    return Array.from(this.payments.values()).find(p => p.booking_id === bookingId);
  }

  // Reviews
  saveReview(review: ReviewRecord): ReviewRecord {
    this.reviews.set(review.id, { ...review, updated_at: new Date() });
    return review;
  }

  findReviewById(id: string): ReviewRecord | undefined {
    return this.reviews.get(id);
  }

  findReviewByBookingId(bookingId: string): ReviewRecord | undefined {
    return Array.from(this.reviews.values()).find(r => r.booking_id === bookingId);
  }

  findReviewsByProviderId(providerId: string): ReviewRecord[] {
    return Array.from(this.reviews.values()).filter(r => r.provider_id === providerId);
  }

  // Disputes
  saveDispute(dispute: DisputeRecord): DisputeRecord {
    this.disputes.set(dispute.id, { ...dispute, updated_at: new Date() });
    return dispute;
  }

  findDisputeById(id: string): DisputeRecord | undefined {
    return this.disputes.get(id);
  }

  findDisputesByBookingId(bookingId: string): DisputeRecord[] {
    return Array.from(this.disputes.values()).filter(d => d.booking_id === bookingId);
  }

  // Safety Incidents
  saveSafetyIncident(incident: SafetyIncidentRecord): SafetyIncidentRecord {
    this.safetyIncidents.set(incident.id, { ...incident, updated_at: new Date() });
    return incident;
  }

  findSafetyIncidentById(id: string): SafetyIncidentRecord | undefined {
    return this.safetyIncidents.get(id);
  }

  findSafetyIncidentsByReporterId(reporterId: string): SafetyIncidentRecord[] {
    return Array.from(this.safetyIncidents.values()).filter(s => s.reporter_id === reporterId);
  }

  getAllSafetyIncidents(): SafetyIncidentRecord[] {
    return Array.from(this.safetyIncidents.values());
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

  getAuditLogs(entityName?: string): AuditLogRecord[] {
    if (entityName) {
      return this.auditLogs.filter(l => l.entity_name === entityName);
    }
    return [...this.auditLogs];
  }
}

export const db = new InMemoryDatabase();
