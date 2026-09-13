import crypto from 'node:crypto';
import { CustomerProfileDto, UpdateCustomerProfilePayload, StandardErrorCode } from '@kaamsaathi/contracts';
import { db, CustomerProfileRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';
import { CryptoUtils } from '../../common/crypto.utils.js';

export class CustomerService {
  async getProfile(userId: string): Promise<CustomerProfileDto> {
    const profile = db.findCustomerProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.profile_not_found');
    }
    return this.toDto(profile);
  }

  async saveProfile(userId: string, payload: UpdateCustomerProfilePayload, correlationId: string): Promise<CustomerProfileDto> {
    const user = db.findUserById(userId);
    if (!user) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.user_not_found');
    }

    if (!payload.full_name?.trim() || !payload.district_id || !payload.locality_name?.trim()) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_input');
    }

    if (!/^[1-9]\d{5}$/.test(payload.pin_code)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_pincode');
    }

    let profile = db.findCustomerProfileByUserId(userId);
    const now = new Date();

    if (profile) {
      profile.full_name = payload.full_name.trim();
      profile.district_id = payload.district_id;
      profile.locality_name = payload.locality_name.trim();
      profile.pin_code = payload.pin_code;
      if (payload.address_line) {
        profile.address_line_encrypted = CryptoUtils.encrypt(payload.address_line);
      }
      if (typeof payload.masked_notifications === 'boolean') {
        profile.masked_notifications = payload.masked_notifications;
      }
      profile.updated_at = now;
      db.saveCustomerProfile(profile);
    } else {
      profile = db.saveCustomerProfile({
        id: crypto.randomUUID(),
        user_id: userId,
        full_name: payload.full_name.trim(),
        district_id: payload.district_id,
        locality_name: payload.locality_name.trim(),
        pin_code: payload.pin_code,
        address_line_encrypted: payload.address_line ? CryptoUtils.encrypt(payload.address_line) : undefined,
        masked_notifications: payload.masked_notifications ?? true,
        created_at: now,
        updated_at: now,
      });
    }

    db.logAudit({
      entity_name: 'customer_profiles',
      entity_id: profile.id,
      actor_id: userId,
      actor_role: 'CUSTOMER',
      action: 'CUSTOMER_PROFILE_UPDATED',
      metadata: { district_id: payload.district_id, locality: payload.locality_name },
      correlation_id: correlationId,
    });

    return this.toDto(profile);
  }

  async updateLanguage(userId: string, language: 'hi' | 'en', correlationId: string): Promise<{ success: boolean; language: string }> {
    const user = db.findUserById(userId);
    if (!user) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.user_not_found');
    }

    if (!['hi', 'en'].includes(language)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_language');
    }

    user.preferred_language = language;
    db.saveUser(user);

    db.logAudit({
      entity_name: 'users',
      entity_id: user.id,
      actor_id: userId,
      actor_role: user.active_role,
      action: 'LANGUAGE_PREFERENCE_UPDATED',
      metadata: { preferred_language: language },
      correlation_id: correlationId,
    });

    return { success: true, language };
  }

  private toDto(record: CustomerProfileRecord): CustomerProfileDto {
    return {
      id: record.id,
      user_id: record.user_id,
      full_name: record.full_name,
      district_id: record.district_id,
      locality_name: record.locality_name,
      pin_code: record.pin_code,
      masked_notifications: record.masked_notifications,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    };
  }
}
