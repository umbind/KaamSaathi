export interface OtpRequestPayload {
  phone_number: string; // E.164 format +91XXXXXXXXXX
}

export interface OtpRequestResponse {
  status: 'CHALLENGE_ISSUED';
  cooldown_seconds: number;
  message_key: string;
}

export interface OtpVerifyPayload {
  phone_number: string;
  otp_code: string;
}

export interface AuthSessionResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  is_new_user: boolean;
  user: UserDto;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface RoleSwitchPayload {
  target_role: 'CUSTOMER' | 'PROVIDER';
}

export interface AdminLoginPayload {
  email: string;
  password: string;
  totp_code: string;
}

export interface UserDto {
  id: string;
  status: string;
  roles: Array<'CUSTOMER' | 'PROVIDER' | 'ADMIN'>;
  active_role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  preferred_language: 'hi' | 'en';
}


export interface IOtpProvider {
  sendOtp(phone: string, otp: string, correlationId: string): Promise<{ success: boolean; providerRef?: string }>;
}
