import { TrustBadgeDto } from './provider.js';

export interface CreateQuotePayload {
  lead_id: string;
  visitation_fee_paise: number;
  estimated_labor_paise: number;
  estimated_parts_paise?: number;
  scope_notes: string;
  valid_hours?: number;
}

export interface QuoteDto {
  id: string;
  request_id: string;
  lead_id: string;
  provider_id: string;
  provider_business_name: string;
  provider_trade_title: string;
  provider_badges: Array<TrustBadgeDto>;
  status: 'DRAFT' | 'DISPATCHED' | 'VIEWED' | 'ACCEPTED' | 'SUPERSEDED' | 'EXPIRED' | 'WITHDRAWN';
  visitation_fee_paise: number;
  estimated_labor_paise: number;
  estimated_parts_paise: number;
  total_estimate_paise: number;
  scope_notes: string;
  expires_at: string;
  created_at: string;
}

export interface AcceptQuotePayload {
  quote_id: string;
  consent_contact_reveal: boolean;
}

export interface CustomerContactDto {
  full_name: string;
  phone_number: string;
  district_id: string;
  locality_name: string;
  pin_code: string;
  address_line?: string;
}

export interface ProviderContactDto {
  business_name: string;
  phone_number: string;
  trade_title: string;
}

export interface BookingDto {
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
  customer_contact?: CustomerContactDto;
  provider_contact?: ProviderContactDto;
  created_at: string;
  updated_at: string;
}
