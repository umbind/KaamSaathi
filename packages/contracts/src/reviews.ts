export type DisputeReason =
  | 'POOR_QUALITY'
  | 'OVERCHARGING'
  | 'NO_SHOW'
  | 'UNPROFESSIONAL_BEHAVIOUR'
  | 'DAMAGE_OR_LOSS'
  | 'OTHER';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type SafetySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SafetyCategory =
  | 'HARASSMENT'
  | 'THEFT'
  | 'VIOLENCE'
  | 'PROPERTY_DAMAGE'
  | 'UNSAFE_ENVIRONMENT';

export type SafetyIncidentStatus =
  | 'REPORTED'
  | 'INVESTIGATING'
  | 'ESCALATED_AUTHORITIES'
  | 'RESOLVED';

export interface CreateReviewPayload {
  rating: number; // 1 to 5 integer
  comment?: string;
}

export interface ReviewDto {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  rating: number;
  comment?: string;
  provider_response?: string;
  provider_responded_at?: string;
  created_at: string;
}

export interface CreateReviewResponsePayload {
  response: string;
}

export interface FileDisputePayload {
  reason: DisputeReason;
  description: string;
  evidence_keys?: string[];
}

export interface DisputeDto {
  id: string;
  booking_id: string;
  filed_by_id: string;
  filed_by_role: 'CUSTOMER' | 'PROVIDER';
  reason: DisputeReason;
  description: string;
  evidence_keys?: string[];
  status: DisputeStatus;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportSafetyIncidentPayload {
  booking_id?: string;
  category: SafetyCategory;
  description: string;
  severity: SafetySeverity;
  locality?: string;
  district?: string;
}

export interface SafetyIncidentDto {
  id: string;
  reporter_id: string;
  booking_id?: string;
  category: SafetyCategory;
  description: string;
  severity: SafetySeverity;
  status: SafetyIncidentStatus;
  emergency_helplines: {
    police: string;
    women_helpline: string;
    child_helpline: string;
  };
  is_priority: boolean;
  created_at: string;
}

export interface ProviderEarningsSummaryDto {
  provider_id: string;
  completed_jobs_count: number;
  total_gross_paise: number;
  cash_paise: number;
  upi_paise: number;
  platform_fee_paise: number;
  net_earnings_paise: number;
}
