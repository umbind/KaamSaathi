export interface ProviderProfileDto {
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
  badges_summary: Array<TrustBadgeDto>;
  created_at: string;
  updated_at: string;
}

export interface TrustBadgeDto {
  code: 'PHONE_VERIFIED' | 'GOVT_ID_VERIFIED' | 'TRADE_CERTIFIED' | 'POLICE_VERIFIED';
  label: string;
  reviewed_item: string;
  verified_at: string;
}

export const TRUST_BADGE_DEFINITIONS: Record<string, { label: string; reviewed_item: string }> = {
  PHONE_VERIFIED: {
    label: 'Phone Verified',
    reviewed_item: 'Mobile OTP verification completed'
  },
  GOVT_ID_VERIFIED: {
    label: 'Govt ID Reviewed',
    reviewed_item: 'Reviewed government-issued photo ID'
  },
  TRADE_CERTIFIED: {
    label: 'Trade Certified',
    reviewed_item: 'Reviewed vocational or ITI trade certificate'
  },
  POLICE_VERIFIED: {
    label: 'Police Verification Checked',
    reviewed_item: 'Reviewed police clearance certificate'
  }
};

export const MANDATORY_TRUST_DISCLAIMER =
  'The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety. Every badge states exactly what was reviewed.';

export interface ProviderOnboardPayload {
  business_name: string;
  trade_title: string;
  years_experience?: number;
  bio?: string;
}

export interface ProviderCoveragePayload {
  district_id: string;
  latitude: number;
  longitude: number;
  radius_meters: number; // 1,000 to 50,000
}

export interface ProviderCoverageDto {
  id: string;
  provider_id: string;
  district_id: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  created_at: string;
}

export interface CategoryDto {
  id: string;
  name_en: string;
  name_hi: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface ProviderServiceItemPayload {
  category_id: string;
  visitation_fee_paise: number; // must be >= 0
  pricing_notes?: string;
}

export interface ProviderServicesPayload {
  services: ProviderServiceItemPayload[];
}

export interface ProviderServiceDto {
  id: string;
  provider_id: string;
  category_id: string;
  visitation_fee_paise: number;
  pricing_notes?: string;
  created_at: string;
}

export interface ProviderAvailabilityPayload {
  availability_status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
}

export interface VerificationSubmissionPayload {
  document_type: 'GOVT_PHOTO_ID' | 'TRADE_CERT' | 'POLICE_CLEARANCE';
  storage_path: string;
}

export interface VerificationSubmissionDto {
  id: string;
  provider_id: string;
  business_name?: string;
  trade_title?: string;
  document_type: 'GOVT_PHOTO_ID' | 'TRADE_CERT' | 'POLICE_CLEARANCE';
  storage_path: string;
  status: 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewer_id?: string;
  review_notes?: string;
  badge_granted?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface AdminVerificationReviewPayload {
  decision: 'APPROVE' | 'REJECT';
  review_notes: string;
  badge_to_grant?: 'GOVT_ID_VERIFIED' | 'TRADE_CERTIFIED' | 'POLICE_VERIFIED';
}
