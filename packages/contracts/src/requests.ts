export interface ServiceRequestCreatePayload {
  category_id: string;
  request_type: 'TARGETED' | 'BROADCAST';
  target_provider_id?: string;
  district_id: string;
  locality_name: string;
  pin_code: string;
  latitude?: number;
  longitude?: number;
  description: string;
  preferred_schedule_window?: string; // e.g. 'TODAY_URGENT', 'MORNING_9_12', 'AFTERNOON_12_4'
  media_attachment_paths?: string[];
}

export interface ServiceRequestDto {
  id: string;
  customer_id: string;
  category_id: string;
  request_type: 'TARGETED' | 'BROADCAST';
  target_provider_id?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'MATCHING' | 'LEAD_DISPATCHED' | 'QUOTES_RECEIVED' | 'CANCELLED';
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
  created_at: string;
  updated_at: string;
}

export interface LeadDto {
  id: string;
  request_id: string;
  provider_id: string;
  status: 'DISPATCHED' | 'VIEWED' | 'DECLINED' | 'QUOTED' | 'EXPIRED';
  category_id: string;
  description: string;
  district_id: string;
  locality_name: string;
  pin_code: string;
  preferred_schedule_window?: string;
  media_attachment_paths: string[];
  expires_at: string;
  created_at: string;
}

export interface PresignedUploadPayload {
  filename: string;
  content_type: string; // e.g. 'image/jpeg', 'image/png'
  purpose: 'SERVICE_REQUEST_ATTACHMENT' | 'VERIFICATION_DOCUMENT';
}

export interface PresignedUploadResponse {
  upload_url: string;
  storage_path: string;
  expires_in_seconds: number;
  max_size_bytes: number;
}

export interface SearchResultDto {
  categories: Array<{
    id: string;
    name_en: string;
    name_hi: string;
    matched_alias?: string;
  }>;
  matching_providers_count: number;
}
