export interface CustomerProfileDto {
  id: string;
  user_id: string;
  full_name: string;
  district_id: string;
  locality_name: string;
  pin_code: string;
  masked_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateCustomerProfilePayload {
  full_name: string;
  district_id: string;
  locality_name: string;
  pin_code: string;
  address_line?: string;
  masked_notifications?: boolean;
}

export interface UpdateLanguagePayload {
  language: 'hi' | 'en';
}
