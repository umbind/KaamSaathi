import {
  AdminLoginPayload,
  AuthSessionResponse,
  VerificationSubmissionDto,
  AdminVerificationReviewPayload,
  AdminDisputeResolutionPayload,
  AdminSafetyResolutionPayload,
  AdminCreateCategoryPayload,
  AdminUpdateCategoryPayload,
  AdminRestrictProviderPayload,
  DisputeDto,
  SafetyIncidentDto,
  ProviderProfileDto,
  StandardErrorCode,
} from '@kaamsaathi/contracts';

export interface IAdminClient {
  login(payload: AdminLoginPayload): Promise<AuthSessionResponse>;
  logout(): Promise<void>;
  getAuditLogs(entityName?: string): Promise<unknown[]>;
  getPendingVerifications(): Promise<VerificationSubmissionDto[]>;
  reviewVerification(submissionId: string, payload: AdminVerificationReviewPayload): Promise<VerificationSubmissionDto>;
  resolveDispute(disputeId: string, payload: AdminDisputeResolutionPayload): Promise<DisputeDto>;
  resolveSafetyIncident(incidentId: string, payload: AdminSafetyResolutionPayload): Promise<SafetyIncidentDto>;
  restrictProvider(providerId: string, payload: AdminRestrictProviderPayload): Promise<ProviderProfileDto>;
  createCategory(payload: AdminCreateCategoryPayload): Promise<unknown>;
  updateCategory(categoryId: string, payload: AdminUpdateCategoryPayload): Promise<unknown>;
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
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Admin login failed: ${JSON.stringify(err)}`);
    }

    const session = (await response.json()) as AuthSessionResponse;
    this.currentSession = session;
    return session;
  }

  async logout(): Promise<void> {
    this.currentSession = null;
  }

  async getAuditLogs(entityName?: string): Promise<unknown[]> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const url = entityName
      ? `${this.apiBaseUrl}/api/v1/admin/audit-logs?entity_name=${encodeURIComponent(entityName)}`
      : `${this.apiBaseUrl}/api/v1/admin/audit-logs`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Failed to fetch audit logs: ${JSON.stringify(err)}`);
    }

    return response.json();
  }

  async getPendingVerifications(): Promise<VerificationSubmissionDto[]> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/verifications/queue`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Failed to fetch verification queue: ${JSON.stringify(err)}`);
    }

    return (await response.json()) as VerificationSubmissionDto[];
  }

  async reviewVerification(
    submissionId: string,
    payload: AdminVerificationReviewPayload
  ): Promise<VerificationSubmissionDto> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    if (payload.decision === 'REJECT' && !payload.review_notes?.trim()) {
      throw new Error(`[${StandardErrorCode.INVALID_INPUT}] Rejection review notes are required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/verifications/${submissionId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Review submission failed: ${JSON.stringify(err)}`);
    }

    return (await response.json()) as VerificationSubmissionDto;
  }

  async resolveDispute(
    disputeId: string,
    payload: AdminDisputeResolutionPayload
  ): Promise<DisputeDto> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Dispute resolution failed: ${JSON.stringify(err)}`);
    }

    return (await response.json()) as DisputeDto;
  }

  async resolveSafetyIncident(
    incidentId: string,
    payload: AdminSafetyResolutionPayload
  ): Promise<SafetyIncidentDto> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/safety/${incidentId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Safety incident resolution failed: ${JSON.stringify(err)}`);
    }

    return (await response.json()) as SafetyIncidentDto;
  }

  async restrictProvider(
    providerId: string,
    payload: AdminRestrictProviderPayload
  ): Promise<ProviderProfileDto> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/providers/${providerId}/restrict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Restrict provider failed: ${JSON.stringify(err)}`);
    }

    return (await response.json()) as ProviderProfileDto;
  }

  async createCategory(payload: AdminCreateCategoryPayload): Promise<unknown> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Create category failed: ${JSON.stringify(err)}`);
    }

    return response.json();
  }

  async updateCategory(categoryId: string, payload: AdminUpdateCategoryPayload): Promise<unknown> {
    if (!this.currentSession) {
      throw new Error(`[${StandardErrorCode.UNAUTHORIZED}] Authentication required.`);
    }

    const response = await fetch(`${this.apiBaseUrl}/api/v1/admin/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.currentSession.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Update category failed: ${JSON.stringify(err)}`);
    }

    return response.json();
  }

  getCurrentSession(): AuthSessionResponse | null {
    return this.currentSession;
  }
}
