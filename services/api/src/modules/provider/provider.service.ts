import crypto from 'node:crypto';
import { ProviderProfileDto, ProviderOnboardPayload, StandardErrorCode } from '@kaamsaathi/contracts';
import { db, ProviderProfileRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';

export class ProviderService {
  async onboard(userId: string, payload: ProviderOnboardPayload, correlationId: string): Promise<ProviderProfileDto> {
    const user = db.findUserById(userId);
    if (!user) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.user_not_found');
    }

    if (!payload.business_name?.trim() || !payload.trade_title?.trim()) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_input');
    }

    // Add PROVIDER role to user if not already granted
    if (!user.roles.includes('PROVIDER')) {
      user.roles.push('PROVIDER');
      db.saveUser(user);
    }

    let profile = db.findProviderProfileByUserId(userId);
    const now = new Date();

    if (profile) {
      profile.business_name = payload.business_name.trim();
      profile.trade_title = payload.trade_title.trim();
      profile.years_experience = payload.years_experience || profile.years_experience;
      profile.bio = payload.bio || profile.bio;
      profile.updated_at = now;
      db.saveProviderProfile(profile);
    } else {
      profile = db.saveProviderProfile({
        id: crypto.randomUUID(),
        user_id: userId,
        business_name: payload.business_name.trim(),
        trade_title: payload.trade_title.trim(),
        status: 'DRAFT', // Onboarding begins in DRAFT state per state machine
        availability_status: 'AVAILABLE',
        years_experience: payload.years_experience || 0,
        bio: payload.bio,
        rating_avg: 0.0,
        rating_count: 0,
        completed_jobs_count: 0,
        badges_summary: [],
        created_at: now,
        updated_at: now,
      });
    }

    db.logAudit({
      entity_name: 'provider_profiles',
      entity_id: profile.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'PROVIDER_ONBOARDED',
      previous_state: 'NONE',
      new_state: 'DRAFT',
      metadata: { trade_title: payload.trade_title },
      correlation_id: correlationId,
    });

    return this.toDto(profile);
  }

  async getProfile(userId: string): Promise<ProviderProfileDto> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }
    return this.toDto(profile);
  }

  private toDto(record: ProviderProfileRecord): ProviderProfileDto {
    return {
      id: record.id,
      user_id: record.user_id,
      business_name: record.business_name,
      trade_title: record.trade_title,
      status: record.status,
      availability_status: record.availability_status,
      bio: record.bio,
      years_experience: record.years_experience,
      rating_avg: record.rating_avg,
      rating_count: record.rating_count,
      completed_jobs_count: record.completed_jobs_count,
      badges_summary: record.badges_summary,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    };
  }
}
