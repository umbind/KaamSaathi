import { AdminLoginPayload, AuthSessionResponse, StandardErrorCode } from '@kaamsaathi/contracts';

export interface IAdminClient {
  login(payload: AdminLoginPayload): Promise<AuthSessionResponse>;
  logout(): Promise<void>;
  getAuditLogs(): Promise<unknown[]>;
}

export class AdminPortalService implements IAdminClient {
  private apiBaseUrl: string;
  private currentSession: AuthSessionResponse | null = null;

  constructor(apiBaseUrl: string = 'http://localhost:3000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async login(payload: AdminLoginPayload): Promise<AuthSessionResponse> {
    // Mandate TOTP code presence
    if (!payload.totp_code || payload.totp_code.trim().length !== 6) {
      throw new Error(`[${StandardErrorCode.INVALID_INPUT}] TOTP MFA code is mandatory for all administrative access.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Admin login failed: ${JSON.stringify(err)}`);
    }

    const session = await response.json() as AuthSessionResponse;
    this.currentSession = session;
    return session;
  }

  async logout(): Promise<void> {
    this.currentSession = null;
  }

  async getAuditLogs(): Promise<unknown[]> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }
    return [];
  }

  getCurrentSession(): AuthSessionResponse | null {
    return this.currentSession;
  }
}
