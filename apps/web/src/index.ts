import { OtpRequestPayload, OtpVerifyPayload, AuthSessionResponse, CategoryDto } from '@kaamsaathi/contracts';
import { t } from '@kaamsaathi/localization';

export class KaamSaathiWebClient {
  private apiBaseUrl: string;
  private currentLanguage: 'hi' | 'en' = 'hi';

  constructor(apiBaseUrl: string = 'http://localhost:3000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  setLanguage(lang: 'hi' | 'en') {
    this.currentLanguage = lang;
  }

  getLanguage(): 'hi' | 'en' {
    return this.currentLanguage;
  }

  getLocalizedText(key: string, params?: Record<string, string | number>): string {
    return t(key, this.currentLanguage, params);
  }

  async getCategories(): Promise<CategoryDto[]> {
    const res = await fetch(`${this.apiBaseUrl}/api/v1/categories`, {
      method: 'GET',
      headers: {
        'Accept-Language': this.currentLanguage
      }
    });
    return res.json() as Promise<CategoryDto[]>;
  }

  async requestOtp(payload: OtpRequestPayload, idempotencyKey: string): Promise<unknown> {
    const res = await fetch(`${this.apiBaseUrl}/api/v1/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async verifyOtp(payload: OtpVerifyPayload, idempotencyKey: string): Promise<AuthSessionResponse> {
    const res = await fetch(`${this.apiBaseUrl}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });
    return res.json() as Promise<AuthSessionResponse>;
  }
}
