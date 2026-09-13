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
  badges_summary: Array<{ code: string; label: string; verified_at: string }>;
  created_at: string;
  updated_at: string;
}

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
  radius_meters: number;
}
