import crypto from 'node:crypto';
import {
  ServiceRequestCreatePayload,
  ServiceRequestDto,
  LeadDto,
  PresignedUploadPayload,
  PresignedUploadResponse,
  SearchResultDto,
  StandardErrorCode,
  UP_DISTRICTS
} from '@kaamsaathi/contracts';
import { transliteratedAliases } from '@kaamsaathi/localization';
import { db, RequestRecord, LeadRecord, ProviderProfileRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';

export class RequestService {
  async searchServices(query: string, districtId?: string, lang: 'hi' | 'en' = 'hi'): Promise<SearchResultDto> {
    const q = (query || '').trim().toLowerCase();
    const allCategories = db.getCategories();

    if (!q) {
      return {
        categories: allCategories.map(c => ({
          id: c.id,
          name_en: c.name_en,
          name_hi: c.name_hi
        })),
        matching_providers_count: 0
      };
    }

    const matchedCategories: Array<{ id: string; name_en: string; name_hi: string; matched_alias?: string }> = [];

    for (const cat of allCategories) {
      let matched = false;
      let matchedAlias: string | undefined = undefined;

      if (cat.name_en.toLowerCase().includes(q) || cat.name_hi.includes(q)) {
        matched = true;
      } else {
        const aliases = transliteratedAliases[cat.id] || [];
        for (const alias of aliases) {
          if (alias.toLowerCase().includes(q) || q.includes(alias.toLowerCase())) {
            matched = true;
            matchedAlias = alias;
            break;
          }
        }
      }

      if (matched) {
        matchedCategories.push({
          id: cat.id,
          name_en: cat.name_en,
          name_hi: cat.name_hi,
          matched_alias: matchedAlias
        });
      }
    }

    // Count active matching providers
    let providerCount = 0;
    const activeProviders = db.getAllProviderProfiles().filter(p => p.status === 'APPROVED_ACTIVE');
    for (const p of activeProviders) {
      const services = db.getProviderServices(p.id);
      const offersMatchedCategory = services.some(s => matchedCategories.some(mc => mc.id === s.category_id));
      if (offersMatchedCategory) {
        if (!districtId) {
          providerCount++;
        } else {
          const cov = db.getProviderCoverage(p.id);
          if (cov && cov.district_id.toLowerCase() === districtId.toLowerCase()) {
            providerCount++;
          }
        }
      }
    }

    return {
      categories: matchedCategories,
      matching_providers_count: providerCount
    };
  }

  async createPresignedUpload(
    userId: string,
    payload: PresignedUploadPayload,
    correlationId: string
  ): Promise<PresignedUploadResponse> {
    const ext = payload.filename.split('.').pop() || 'jpg';
    const uploadId = crypto.randomUUID();
    const storagePath = `s3://kaamsaathi-attachments/${payload.purpose.toLowerCase()}/${uploadId}.${ext}`;

    db.logAudit({
      entity_name: 'media_uploads',
      entity_id: uploadId,
      actor_id: userId,
      actor_role: 'USER',
      action: 'PRESIGNED_UPLOAD_GENERATED',
      metadata: { filename: payload.filename, content_type: payload.content_type },
      correlation_id: correlationId
    });

    return {
      upload_url: `https://storage.kaamsaathi.local/upload?ticket=${uploadId}`,
      storage_path: storagePath,
      expires_in_seconds: 900, // 15 minutes
      max_size_bytes: 10 * 1024 * 1024 // 10MB
    };
  }

  async createRequest(
    userId: string,
    payload: ServiceRequestCreatePayload,
    correlationId: string
  ): Promise<ServiceRequestDto> {
    // 1. Ensure user has a customer profile
    let customerProfile = db.findCustomerProfileByUserId(userId);
    if (!customerProfile) {
      customerProfile = db.saveCustomerProfile({
        id: crypto.randomUUID(),
        user_id: userId,
        full_name: 'Customer',
        district_id: payload.district_id,
        locality_name: payload.locality_name,
        pin_code: payload.pin_code,
        masked_notifications: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // 2. Validate UP District
    const isUpDistrict = UP_DISTRICTS.some(
      d => d.toLowerCase() === payload.district_id.trim().toLowerCase()
    );
    if (!isUpDistrict) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_up_district');
    }

    // 3. Validate Category
    const category = db.getCategoryById(payload.category_id);
    if (!category) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_category');
    }

    if (!payload.description?.trim()) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.description_required');
    }

    const now = new Date();
    const requestId = crypto.randomUUID();

    // 4. Handle TARGETED vs BROADCAST
    if (payload.request_type === 'TARGETED') {
      if (!payload.target_provider_id) {
        throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.target_provider_required');
      }

      const targetProvider = db.findProviderProfileById(payload.target_provider_id);
      if (!targetProvider) {
        throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.target_provider_not_found');
      }

      // Self-dealing exclusion
      if (targetProvider.user_id === userId) {
        throw new AppError(
          409,
          StandardErrorCode.SELF_DEALING_PROHIBITED,
          'errors.self_dealing_prohibited'
        );
      }

      const requestRecord: RequestRecord = {
        id: requestId,
        customer_id: customerProfile.id,
        category_id: payload.category_id,
        request_type: 'TARGETED',
        target_provider_id: targetProvider.id,
        status: 'SUBMITTED',
        district_id: payload.district_id,
        locality_name: payload.locality_name,
        pin_code: payload.pin_code,
        latitude: payload.latitude,
        longitude: payload.longitude,
        description: payload.description.trim(),
        preferred_schedule_window: payload.preferred_schedule_window,
        media_attachment_paths: payload.media_attachment_paths || [],
        dispatched_leads_count: 1,
        version: 1,
        created_at: now,
        updated_at: now
      };

      db.saveRequest(requestRecord);

      // Dispatch single lead to target provider (2h expiry)
      db.saveLead({
        id: crypto.randomUUID(),
        request_id: requestRecord.id,
        provider_id: targetProvider.id,
        status: 'DISPATCHED',
        expires_at: new Date(now.getTime() + 2 * 3600 * 1000),
        created_at: now,
        updated_at: now
      });

      db.logAudit({
        entity_name: 'requests',
        entity_id: requestRecord.id,
        actor_id: userId,
        actor_role: 'CUSTOMER',
        action: 'TARGETED_REQUEST_CREATED',
        new_state: 'SUBMITTED',
        metadata: { target_provider_id: targetProvider.id, category: payload.category_id },
        correlation_id: correlationId
      });

      return this.toDto(requestRecord);
    } else {
      // BROADCAST matching flow
      const candidateProviders = this.findMatchingProviders(
        userId,
        payload.category_id,
        payload.district_id
      );

      const requestRecord: RequestRecord = {
        id: requestId,
        customer_id: customerProfile.id,
        category_id: payload.category_id,
        request_type: 'BROADCAST',
        status: candidateProviders.length > 0 ? 'LEAD_DISPATCHED' : 'MATCHING',
        district_id: payload.district_id,
        locality_name: payload.locality_name,
        pin_code: payload.pin_code,
        latitude: payload.latitude,
        longitude: payload.longitude,
        description: payload.description.trim(),
        preferred_schedule_window: payload.preferred_schedule_window,
        media_attachment_paths: payload.media_attachment_paths || [],
        dispatched_leads_count: candidateProviders.length,
        version: 1,
        created_at: now,
        updated_at: now
      };

      db.saveRequest(requestRecord);

      // Batch dispatch leads to up to 5 matching providers
      for (const provider of candidateProviders) {
        db.saveLead({
          id: crypto.randomUUID(),
          request_id: requestRecord.id,
          provider_id: provider.id,
          status: 'DISPATCHED',
          expires_at: new Date(now.getTime() + 2 * 3600 * 1000),
          created_at: now,
          updated_at: now
        });
      }

      db.logAudit({
        entity_name: 'requests',
        entity_id: requestRecord.id,
        actor_id: userId,
        actor_role: 'CUSTOMER',
        action: 'BROADCAST_REQUEST_CREATED',
        new_state: requestRecord.status,
        metadata: {
          category: payload.category_id,
          district: payload.district_id,
          dispatched_count: candidateProviders.length
        },
        correlation_id: correlationId
      });

      return this.toDto(requestRecord);
    }
  }

  async getCustomerRequests(userId: string): Promise<ServiceRequestDto[]> {
    const customerProfile = db.findCustomerProfileByUserId(userId);
    if (!customerProfile) return [];
    const requests = db.findRequestsByCustomerId(customerProfile.id);
    return requests.map(r => this.toDto(r));
  }

  async getProviderLeads(userId: string): Promise<LeadDto[]> {
    const provider = db.findProviderProfileByUserId(userId);
    if (!provider) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    const leads = db.findLeadsByProviderId(provider.id);
    const result: LeadDto[] = [];

    for (const lead of leads) {
      const req = db.findRequestById(lead.request_id);
      if (req) {
        result.push({
          id: lead.id,
          request_id: lead.request_id,
          provider_id: lead.provider_id,
          status: lead.status,
          category_id: req.category_id,
          description: req.description,
          district_id: req.district_id,
          locality_name: req.locality_name, // Phased address disclosure: Locality only!
          pin_code: req.pin_code,
          preferred_schedule_window: req.preferred_schedule_window,
          media_attachment_paths: req.media_attachment_paths,
          expires_at: lead.expires_at.toISOString(),
          created_at: lead.created_at.toISOString()
        });
      }
    }

    return result;
  }

  private findMatchingProviders(
    customerUserId: string,
    categoryId: string,
    districtId: string
  ): ProviderProfileRecord[] {
    const allProviders = db.getAllProviderProfiles();
    const matches: ProviderProfileRecord[] = [];

    for (const p of allProviders) {
      // 1. Self-dealing exclusion
      if (p.user_id === customerUserId) continue;

      // 2. Status check: must be APPROVED_ACTIVE
      if (p.status !== 'APPROVED_ACTIVE') continue;

      // 3. Availability check: must be AVAILABLE (not BUSY or OFFLINE)
      if (p.availability_status !== 'AVAILABLE') continue;

      // 4. Category check: provider must offer requested category
      const services = db.getProviderServices(p.id);
      const offersCategory = services.some(s => s.category_id === categoryId);
      if (!offersCategory) continue;

      // 5. Coverage check: district match
      const coverage = db.getProviderCoverage(p.id);
      if (coverage && coverage.district_id.toLowerCase() === districtId.toLowerCase()) {
        matches.push(p);
      }

      // 6. Max 5 matching providers per batch
      if (matches.length >= 5) break;
    }

    return matches;
  }

  private toDto(record: RequestRecord): ServiceRequestDto {
    return {
      id: record.id,
      customer_id: record.customer_id,
      category_id: record.category_id,
      request_type: record.request_type,
      target_provider_id: record.target_provider_id,
      status: record.status,
      district_id: record.district_id,
      locality_name: record.locality_name,
      pin_code: record.pin_code,
      latitude: record.latitude,
      longitude: record.longitude,
      description: record.description,
      preferred_schedule_window: record.preferred_schedule_window,
      media_attachment_paths: record.media_attachment_paths,
      dispatched_leads_count: record.dispatched_leads_count,
      version: record.version,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString()
    };
  }
}
