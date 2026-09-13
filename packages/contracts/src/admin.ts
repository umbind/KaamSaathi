export interface AdminDisputeResolutionPayload {
  action: 'RESOLVE' | 'DISMISS';
  resolution_notes: string;
}

export interface AdminSafetyResolutionPayload {
  action: 'RESOLVE' | 'ESCALATE_POLICE';
  resolution_notes: string;
}

export interface AdminUpdateCategoryPayload {
  name_en: string;
  name_hi: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface AdminCreateCategoryPayload {
  id: string;
  name_en: string;
  name_hi: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
}

export interface AdminRestrictProviderPayload {
  reason: string;
}

export interface AdminCoverageTogglePayload {
  district_id: string;
  is_active: boolean;
}
