import {
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
import { db, CategoryRecord, AuditLogRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';

export class AdminOperationsService {
  private verifyAdminAccess(adminUserId: string): void {
    const user = db.findUserById(adminUserId);
    if (!user || !user.is_admin) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.admin_privileges_required');
    }
  }

  async resolveDispute(
    adminUserId: string,
    disputeId: string,
    payload: AdminDisputeResolutionPayload,
    correlationId: string
  ): Promise<DisputeDto> {
    this.verifyAdminAccess(adminUserId);

    const dispute = db.findDisputeById(disputeId);
    if (!dispute) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.dispute_not_found');
    }

    if (!['RESOLVE', 'DISMISS'].includes(payload.action)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_resolution_action');
    }

    if (!payload.resolution_notes || payload.resolution_notes.trim().length === 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.resolution_notes_required');
    }

    dispute.status = payload.action === 'RESOLVE' ? 'RESOLVED' : 'DISMISSED';
    dispute.resolution_notes = payload.resolution_notes.trim();
    dispute.updated_at = new Date();
    db.saveDispute(dispute);

    // Release dispute lock on booking if all disputes resolved/dismissed
    const allDisputes = db.findDisputesByBookingId(dispute.booking_id);
    const hasOpen = allDisputes.some(d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW');
    if (!hasOpen) {
      const booking = db.findBookingById(dispute.booking_id);
      if (booking) {
        booking.is_disputed = false;
        db.saveBooking(booking);
      }
    }

    db.logAudit({
      entity_name: 'Dispute',
      entity_id: dispute.id,
      actor_id: adminUserId,
      actor_role: 'ADMIN',
      action: `ADMIN_${payload.action}_DISPUTE`,
      metadata: {
        dispute_id: dispute.id,
        action: payload.action,
        notes: payload.resolution_notes,
      },
      correlation_id: correlationId,
    });

    return {
      id: dispute.id,
      booking_id: dispute.booking_id,
      filed_by_id: dispute.filed_by_id,
      filed_by_role: dispute.filed_by_role,
      reason: dispute.reason,
      description: dispute.description,
      evidence_keys: dispute.evidence_keys,
      status: dispute.status,
      resolution_notes: dispute.resolution_notes,
      created_at: dispute.created_at.toISOString(),
      updated_at: dispute.updated_at.toISOString(),
    };
  }

  async resolveSafetyIncident(
    adminUserId: string,
    incidentId: string,
    payload: AdminSafetyResolutionPayload,
    correlationId: string
  ): Promise<SafetyIncidentDto> {
    this.verifyAdminAccess(adminUserId);

    const incident = db.findSafetyIncidentById(incidentId);
    if (!incident) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.safety_incident_not_found');
    }

    if (!['RESOLVE', 'ESCALATE_POLICE'].includes(payload.action)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_safety_action');
    }

    incident.status = payload.action === 'RESOLVE' ? 'RESOLVED' : 'ESCALATED_AUTHORITIES';
    incident.updated_at = new Date();
    db.saveSafetyIncident(incident);

    db.logAudit({
      entity_name: 'SafetyIncident',
      entity_id: incident.id,
      actor_id: adminUserId,
      actor_role: 'ADMIN',
      action: `ADMIN_${payload.action}_SAFETY_INCIDENT`,
      metadata: {
        incident_id: incident.id,
        action: payload.action,
        notes: payload.resolution_notes,
      },
      correlation_id: correlationId,
    });

    return {
      id: incident.id,
      reporter_id: incident.reporter_id,
      booking_id: incident.booking_id,
      category: incident.category,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
      emergency_helplines: {
        police: '112',
        women_helpline: '1090',
        child_helpline: '1098',
      },
      is_priority: incident.is_priority,
      created_at: incident.created_at.toISOString(),
    };
  }

  async restrictProvider(
    adminUserId: string,
    providerId: string,
    payload: AdminRestrictProviderPayload,
    correlationId: string
  ): Promise<ProviderProfileDto> {
    this.verifyAdminAccess(adminUserId);

    const provider = db.findProviderProfileById(providerId);
    if (!provider) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    if (!payload.reason || payload.reason.trim().length === 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.restriction_reason_required');
    }

    provider.status = 'RESTRICTED';
    provider.availability_status = 'OFFLINE';
    db.saveProviderProfile(provider);

    db.logAudit({
      entity_name: 'ProviderProfile',
      entity_id: provider.id,
      actor_id: adminUserId,
      actor_role: 'ADMIN',
      action: 'ADMIN_RESTRICT_PROVIDER',
      metadata: {
        provider_id: provider.id,
        reason: payload.reason,
      },
      correlation_id: correlationId,
    });

    return {
      id: provider.id,
      user_id: provider.user_id,
      business_name: provider.business_name,
      trade_title: provider.trade_title,
      status: provider.status,
      availability_status: provider.availability_status,
      years_experience: provider.years_experience,
      rating_avg: provider.rating_avg,
      rating_count: provider.rating_count,
      completed_jobs_count: provider.completed_jobs_count,
      badges_summary: provider.badges_summary as any,
      created_at: provider.created_at.toISOString(),
      updated_at: provider.updated_at.toISOString(),
    };
  }

  async createCategory(
    adminUserId: string,
    payload: AdminCreateCategoryPayload,
    correlationId: string
  ): Promise<CategoryRecord> {
    this.verifyAdminAccess(adminUserId);

    if (!payload.id || !payload.name_en || !payload.name_hi) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_category_input');
    }

    const existing = db.getCategoryById(payload.id);
    if (existing) {
      throw new AppError(409, StandardErrorCode.CONFLICT, 'errors.category_already_exists');
    }

    const category: CategoryRecord = {
      id: payload.id,
      name_en: payload.name_en,
      name_hi: payload.name_hi,
      icon_name: payload.icon_name || 'wrench',
      display_order: payload.display_order || 99,
      is_active: payload.is_active ?? true,
    };

    db.saveCategory(category);

    db.logAudit({
      entity_name: 'Category',
      entity_id: category.id,
      actor_id: adminUserId,
      actor_role: 'ADMIN',
      action: 'CREATE_CATEGORY',
      metadata: { category_id: category.id, name_en: category.name_en },
      correlation_id: correlationId,
    });

    return category;
  }

  async updateCategory(
    adminUserId: string,
    categoryId: string,
    payload: AdminUpdateCategoryPayload,
    correlationId: string
  ): Promise<CategoryRecord> {
    this.verifyAdminAccess(adminUserId);

    const category = db.getCategoryById(categoryId);
    if (!category) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.category_not_found');
    }

    category.name_en = payload.name_en;
    category.name_hi = payload.name_hi;
    category.icon_name = payload.icon_name;
    category.display_order = payload.display_order;
    category.is_active = payload.is_active;

    db.saveCategory(category);

    db.logAudit({
      entity_name: 'Category',
      entity_id: category.id,
      actor_id: adminUserId,
      actor_role: 'ADMIN',
      action: 'UPDATE_CATEGORY',
      metadata: { category_id: category.id, is_active: category.is_active },
      correlation_id: correlationId,
    });

    return category;
  }

  async getAuditLogs(adminUserId: string, entityName?: string): Promise<AuditLogRecord[]> {
    this.verifyAdminAccess(adminUserId);
    return db.getAuditLogs(entityName);
  }
}

export const adminOperationsService = new AdminOperationsService();
