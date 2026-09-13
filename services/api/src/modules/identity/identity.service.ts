import crypto from 'node:crypto';
import {
  OtpRequestPayload,
  OtpRequestResponse,
  OtpVerifyPayload,
  AuthSessionResponse,
  RoleSwitchPayload,
  AdminLoginPayload,
  UserDto,
  StandardErrorCode,
} from '@kaamsaathi/contracts';
import { db, UserRecord, AuthSessionRecord } from '../../database/db.js';
import { CryptoUtils } from '../../common/crypto.utils.js';
import { AppError } from '../../common/errors.js';
import { Logger } from '../../common/logger.js';
import { MockOtpProvider } from './otp.provider.js';

export class IdentityService {
  constructor(private readonly otpProvider = new MockOtpProvider()) {}

  async requestOtp(payload: OtpRequestPayload, correlationId: string, clientIp: string): Promise<OtpRequestResponse> {
    const phone = payload.phone_number?.trim();
    if (!phone || !/^\+91[6-9]\d{9}$/.test(phone)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_phone');
    }

    const phoneHmac = CryptoUtils.hashPhone(phone);
    const now = new Date();

    // Check rate limit / 60-second cooldown
    const latestChallenge = db.findLatestOtpAny(phoneHmac);
    if (latestChallenge && !latestChallenge.is_used) {
      const elapsedMs = now.getTime() - latestChallenge.created_at.getTime();
      if (elapsedMs < 60000) {
        const remainingSeconds = Math.ceil((60000 - elapsedMs) / 1000);
        throw new AppError(
          429,
          StandardErrorCode.RATE_LIMITED,
          'errors.rate_limited',
          { cooldown_seconds: remainingSeconds },
          remainingSeconds
        );
      }
    }

    // Generate 6-digit OTP
    const otpCode =
      this.otpProvider instanceof MockOtpProvider && this.otpProvider.mockFixedCode
        ? this.otpProvider.mockFixedCode
        : CryptoUtils.generateOtp();


    // Store challenge
    db.saveOtpChallenge({
      id: crypto.randomUUID(),
      phone_hmac: phoneHmac,
      otp_code: otpCode,
      attempt_count: 0,
      max_attempts: 3,
      is_used: false,
      expires_at: new Date(now.getTime() + 300000), // 5 minutes TTL
      created_at: now,
    });

    // Send via provider
    await this.otpProvider.sendOtp(phone, otpCode, correlationId);

    // Audit log without sensitive OTP value
    db.logAudit({
      entity_name: 'users',
      entity_id: phoneHmac,
      actor_role: 'SYSTEM',
      action: 'OTP_CHALLENGE_ISSUED',
      metadata: { phone_hmac: phoneHmac },
      ip_address: clientIp,
      correlation_id: correlationId,
    });

    // Constant anti-enumeration envelope
    return {
      status: 'CHALLENGE_ISSUED',
      cooldown_seconds: 60,
      message_key: 'auth.otp.challenge_issued',
    };
  }

  async verifyOtp(
    payload: OtpVerifyPayload,
    correlationId: string,
    clientIp: string,
    userAgent?: string
  ): Promise<AuthSessionResponse> {
    const phone = payload.phone_number?.trim();
    const otp = payload.otp_code?.trim();

    if (!phone || !/^\+91[6-9]\d{9}$/.test(phone) || !otp || !/^\d{6}$/.test(otp)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_input');
    }

    const phoneHmac = CryptoUtils.hashPhone(phone);
    const challenge = db.findLatestValidOtp(phoneHmac);

    if (!challenge) {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.otp_expired');
    }

    challenge.attempt_count++;
    if (challenge.attempt_count > challenge.max_attempts) {
      challenge.is_used = true;
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.otp_expired');
    }

    if (!CryptoUtils.timingSafeEqual(challenge.otp_code, otp)) {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.invalid_otp');
    }

    // Success: mark challenge used
    challenge.is_used = true;

    // Retrieve or create user
    let user = db.findUserByPhoneHmac(phoneHmac);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const newUserId = crypto.randomUUID();
      user = db.saveUser({
        id: newUserId,
        phone_hmac: phoneHmac,
        phone_encrypted: CryptoUtils.encrypt(phone),
        status: 'ACTIVE',
        roles: ['CUSTOMER'],
        active_role: 'CUSTOMER',
        preferred_language: 'hi',
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      db.logAudit({
        entity_name: 'users',
        entity_id: user.id,
        actor_id: user.id,
        actor_role: 'CUSTOMER',
        action: 'USER_REGISTERED',
        previous_state: 'PENDING_PHONE_VERIFICATION',
        new_state: 'ACTIVE',
        metadata: { is_new_user: true },
        ip_address: clientIp,
        correlation_id: correlationId,
      });
    }

    // Issue session
    const sessionId = crypto.randomUUID();
    const refreshToken = CryptoUtils.generateRandomToken();
    const refreshTokenHash = CryptoUtils.hashPhone(refreshToken);

    db.saveSession({
      id: sessionId,
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      user_agent: userAgent,
      ip_address: clientIp,
      is_revoked: false,
      expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000), // 30 days
      created_at: new Date(),
      updated_at: new Date(),
    });

    const accessToken = CryptoUtils.signJwt(
      {
        sub: user.id,
        session_id: sessionId,
        roles: user.roles,
        active_role: user.active_role,
        preferred_language: user.preferred_language,
      },
      900 // 15 minutes
    );

    db.logAudit({
      entity_name: 'auth_sessions',
      entity_id: sessionId,
      actor_id: user.id,
      actor_role: user.active_role,
      action: 'USER_AUTHENTICATED',
      metadata: { session_id: sessionId },
      ip_address: clientIp,
      correlation_id: correlationId,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
      is_new_user: isNewUser,
      user: this.toUserDto(user),
    };
  }

  async refreshToken(refreshToken: string, correlationId: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    if (!refreshToken) {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
    }

    const tokenHash = CryptoUtils.hashPhone(refreshToken);
    const session = db.findSessionByRefreshTokenHash(tokenHash);

    if (!session || session.is_revoked || session.expires_at < new Date()) {
      if (session?.is_revoked) {
        // Reuse detection! Revoke entire session tree
        db.revokeAllSessionsForUser(session.user_id, 'TOKEN_REUSE_DETECTED');
        Logger.warn('Refresh token reuse detected. Revoked all sessions for user', { userId: session.user_id });
      }
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
    }

    // Revoke old session token (RTR rotation)
    db.revokeSession(session.id, 'ROTATED');

    const user = db.findUserById(session.user_id);
    if (!user || user.status !== 'ACTIVE') {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
    }

    // Create new session
    const newSessionId = crypto.randomUUID();
    const newRefreshToken = CryptoUtils.generateRandomToken();
    const newRefreshTokenHash = CryptoUtils.hashPhone(newRefreshToken);

    db.saveSession({
      id: newSessionId,
      user_id: user.id,
      refresh_token_hash: newRefreshTokenHash,
      is_revoked: false,
      expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const accessToken = CryptoUtils.signJwt(
      {
        sub: user.id,
        session_id: newSessionId,
        roles: user.roles,
        active_role: user.active_role,
        preferred_language: user.preferred_language,
      },
      900
    );

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: 900,
    };
  }

  async logout(sessionId: string, userId: string, correlationId: string): Promise<{ success: boolean }> {
    db.revokeSession(sessionId, 'USER_LOGOUT');
    db.logAudit({
      entity_name: 'auth_sessions',
      entity_id: sessionId,
      actor_id: userId,
      actor_role: 'SYSTEM',
      action: 'USER_LOGOUT',
      metadata: { session_id: sessionId },
      correlation_id: correlationId,
    });
    return { success: true };
  }

  async switchRole(userId: string, sessionId: string, targetRole: 'CUSTOMER' | 'PROVIDER', correlationId: string): Promise<AuthSessionResponse> {
    const user = db.findUserById(userId);
    if (!user) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.user_not_found');
    }

    if (!user.roles.includes(targetRole)) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden_role_not_activated');
    }

    user.active_role = targetRole;
    db.saveUser(user);

    const accessToken = CryptoUtils.signJwt(
      {
        sub: user.id,
        session_id: sessionId,
        roles: user.roles,
        active_role: targetRole,
        preferred_language: user.preferred_language,
      },
      900
    );

    db.logAudit({
      entity_name: 'users',
      entity_id: user.id,
      actor_id: user.id,
      actor_role: targetRole,
      action: 'ROLE_SWITCHED',
      previous_state: user.active_role === 'CUSTOMER' ? 'PROVIDER' : 'CUSTOMER',
      new_state: targetRole,
      metadata: { target_role: targetRole },
      correlation_id: correlationId,
    });

    return {
      access_token: accessToken,
      refresh_token: '', // Refresh token unchanged
      expires_in: 900,
      is_new_user: false,
      user: this.toUserDto(user),
    };
  }

  async adminLogin(payload: AdminLoginPayload, correlationId: string, clientIp: string): Promise<AuthSessionResponse> {
    const user = db.findUserByEmail(payload.email);
    if (!user || !user.is_admin || !user.totp_secret || !user.password_hash) {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
    }

    // Verify password hash
    const [salt, expectedHash] = user.password_hash.split(':');
    const actualHash = crypto.scryptSync(payload.password, salt, 64).toString('hex');
    if (!CryptoUtils.timingSafeEqual(expectedHash, actualHash)) {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
    }

    // Mandatory TOTP verification
    const isTotpValid = CryptoUtils.verifyTotp(user.totp_secret, payload.totp_code);
    if (!isTotpValid) {
      throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.invalid_mfa');
    }

    const sessionId = crypto.randomUUID();
    const refreshToken = CryptoUtils.generateRandomToken();

    db.saveSession({
      id: sessionId,
      user_id: user.id,
      refresh_token_hash: CryptoUtils.hashPhone(refreshToken),
      ip_address: clientIp,
      is_revoked: false,
      expires_at: new Date(Date.now() + 4 * 3600 * 1000), // 4 hours admin session
      created_at: new Date(),
      updated_at: new Date(),
    });

    const accessToken = CryptoUtils.signJwt(
      {
        sub: user.id,
        session_id: sessionId,
        roles: ['ADMIN'],
        active_role: 'ADMIN',
        is_admin: true,
      },
      14400 // 4 hours
    );

    db.logAudit({
      entity_name: 'users',
      entity_id: user.id,
      actor_id: user.id,
      actor_role: 'ADMIN',
      action: 'ADMIN_MFA_LOGIN',
      metadata: { session_id: sessionId },
      ip_address: clientIp,
      correlation_id: correlationId,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 14400,
      is_new_user: false,
      user: this.toUserDto(user),
    };
  }

  toUserDto(user: UserRecord): UserDto {
    return {
      id: user.id,
      status: user.status,
      roles: user.roles,
      active_role: user.active_role,
      preferred_language: user.preferred_language,
    };
  }
}
