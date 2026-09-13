import crypto from 'node:crypto';
import {
  ProviderProfileDto,
  ProviderOnboardPayload,
  ProviderCoveragePayload,
  ProviderCoverageDto,
  ProviderServicesPayload,
  ProviderServiceDto,
  ProviderAvailabilityPayload,
  VerificationSubmissionPayload,
  VerificationSubmissionDto,
  CategoryDto,
  StandardErrorCode,
  UP_DISTRICTS
} from '@kaamsaathi/contracts';
import {
  db,
  ProviderProfileRecord,
  ProviderCoverageRecord,
  ProviderServiceRecord,
  VerificationSubmissionRecord
} from '../../database/db.js';
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
      profile.years_experience = payload.years_experience ?? profile.years_experience;
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
        years_experience: payload.years_experience ?? 0,
        bio: payload.bio,
        rating_avg: 0.0,
        rating_count: 0,
        completed_jobs_count: 0,
        badges_summary: [
          {
            code: 'PHONE_VERIFIED',
            label: 'Phone Verified',
            reviewed_item: 'Mobile OTP verification completed',
            verified_at: now.toISOString()
          }
        ],
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

  async updateProfile(userId: string, payload: Partial<ProviderOnboardPayload>, correlationId: string): Promise<ProviderProfileDto> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    if (payload.business_name) profile.business_name = payload.business_name.trim();
    if (payload.trade_title) profile.trade_title = payload.trade_title.trim();
    if (payload.years_experience !== undefined) profile.years_experience = payload.years_experience;
    if (payload.bio !== undefined) profile.bio = payload.bio.trim();

    profile.updated_at = new Date();
    db.saveProviderProfile(profile);

    db.logAudit({
      entity_name: 'provider_profiles',
      entity_id: profile.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'PROVIDER_PROFILE_UPDATED',
      previous_state: profile.status,
      new_state: profile.status,
      metadata: { ...payload },
      correlation_id: correlationId,
    });

    return this.toDto(profile);
  }

  async getCategories(): Promise<CategoryDto[]> {
    return db.getCategories();
  }

  async setCoverage(userId: string, payload: ProviderCoveragePayload, correlationId: string): Promise<ProviderCoverageDto> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    // Validate UP district
    const isUpDistrict = UP_DISTRICTS.some(
      d => d.toLowerCase() === payload.district_id.trim().toLowerCase()
    );
    if (!isUpDistrict) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_up_district');
    }

    // Validate radius (1km to 50km)
    if (!Number.isInteger(payload.radius_meters) || payload.radius_meters < 1000 || payload.radius_meters > 50000) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_coverage_radius');
    }

    const record: ProviderCoverageRecord = {
      id: crypto.randomUUID(),
      provider_id: profile.id,
      district_id: payload.district_id,
      latitude: payload.latitude,
      longitude: payload.longitude,
      radius_meters: payload.radius_meters,
      created_at: new Date()
    };

    db.saveProviderCoverage(record);

    db.logAudit({
      entity_name: 'provider_coverage',
      entity_id: record.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'COVERAGE_CONFIGURED',
      metadata: { district_id: payload.district_id, radius_meters: payload.radius_meters },
      correlation_id: correlationId,
    });

    return {
      id: record.id,
      provider_id: record.provider_id,
      district_id: record.district_id,
      latitude: record.latitude,
      longitude: record.longitude,
      radius_meters: record.radius_meters,
      created_at: record.created_at.toISOString()
    };
  }

  async getCoverage(userId: string): Promise<ProviderCoverageDto | null> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }
    const coverage = db.getProviderCoverage(profile.id);
    if (!coverage) return null;
    return {
      id: coverage.id,
      provider_id: coverage.provider_id,
      district_id: coverage.district_id,
      latitude: coverage.latitude,
      longitude: coverage.longitude,
      radius_meters: coverage.radius_meters,
      created_at: coverage.created_at.toISOString()
    };
  }

  async setServices(userId: string, payload: ProviderServicesPayload, correlationId: string): Promise<ProviderServiceDto[]> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    if (!Array.isArray(payload.services) || payload.services.length === 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.services_required');
    }

    const records: ProviderServiceRecord[] = [];
    const now = new Date();

    for (const item of payload.services) {
      const cat = db.getCategoryById(item.category_id);
      if (!cat) {
        throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_category');
      }

      if (!Number.isInteger(item.visitation_fee_paise) || item.visitation_fee_paise < 0) {
        throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_visitation_fee');
      }

      records.push({
        id: crypto.randomUUID(),
        provider_id: profile.id,
        category_id: item.category_id,
        visitation_fee_paise: item.visitation_fee_paise,
        pricing_notes: item.pricing_notes?.trim(),
        created_at: now
      });
    }

    db.saveProviderServices(profile.id, records);

    db.logAudit({
      entity_name: 'provider_services',
      entity_id: profile.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'SERVICES_CONFIGURED',
      metadata: { serviceCount: records.length },
      correlation_id: correlationId,
    });

    return records.map(r => ({
      id: r.id,
      provider_id: r.provider_id,
      category_id: r.category_id,
      visitation_fee_paise: r.visitation_fee_paise,
      pricing_notes: r.pricing_notes,
      created_at: r.created_at.toISOString()
    }));
  }

  async getServices(userId: string): Promise<ProviderServiceDto[]> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }
    return db.getProviderServices(profile.id).map(r => ({
      id: r.id,
      provider_id: r.provider_id,
      category_id: r.category_id,
      visitation_fee_paise: r.visitation_fee_paise,
      pricing_notes: r.pricing_notes,
      created_at: r.created_at.toISOString()
    }));
  }

  async setAvailability(userId: string, payload: ProviderAvailabilityPayload, correlationId: string): Promise<ProviderProfileDto> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    if (!['AVAILABLE', 'BUSY', 'OFFLINE'].includes(payload.availability_status)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_availability_status');
    }

    const prevStatus = profile.availability_status;
    profile.availability_status = payload.availability_status;
    profile.updated_at = new Date();
    db.saveProviderProfile(profile);

    db.logAudit({
      entity_name: 'provider_profiles',
      entity_id: profile.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'AVAILABILITY_CHANGED',
      previous_state: prevStatus,
      new_state: profile.availability_status,
      metadata: {},
      correlation_id: correlationId,
    });

    return this.toDto(profile);
  }

  async submitVerification(
    userId: string,
    payload: VerificationSubmissionPayload,
    correlationId: string
  ): Promise<VerificationSubmissionDto> {
    const profile = db.findProviderProfileByUserId(userId);
    if (!profile) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    if (!['GOVT_PHOTO_ID', 'TRADE_CERT', 'POLICE_CLEARANCE'].includes(payload.document_type)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_document_type');
    }

    if (!payload.storage_path?.trim()) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.storage_path_required');
    }

    const now = new Date();
    const submission: VerificationSubmissionRecord = {
      id: crypto.randomUUID(),
      provider_id: profile.id,
      document_type: payload.document_type,
      storage_path: payload.storage_path.trim(),
      status: 'IN_REVIEW',
      created_at: now
    };

    db.createVerificationSubmission(submission);

    // Transition provider status from DRAFT to SUBMITTED if currently DRAFT
    if (profile.status === 'DRAFT') {
      profile.status = 'SUBMITTED';
      profile.updated_at = now;
      db.saveProviderProfile(profile);
    }

    db.logAudit({
      entity_name: 'verification_submissions',
      entity_id: submission.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'VERIFICATION_SUBMITTED',
      previous_state: 'DRAFT',
      new_state: profile.status,
      metadata: { document_type: payload.document_type },
      correlation_id: correlationId,
    });

    return {
      id: submission.id,
      provider_id: submission.provider_id,
      document_type: submission.document_type,
      storage_path: submission.storage_path,
      status: submission.status,
      created_at: submission.created_at.toISOString()
    };
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
      badges_summary: record.badges_summary as any,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    };
  }
}
