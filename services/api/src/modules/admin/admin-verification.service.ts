import {
  VerificationSubmissionDto,
  AdminVerificationReviewPayload,
  TRUST_BADGE_DEFINITIONS,
  TrustBadgeDto,
  StandardErrorCode
} from '@kaamsaathi/contracts';
import { db, VerificationSubmissionRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';

export class AdminVerificationService {
  async getPendingQueue(adminUserId: string): Promise<VerificationSubmissionDto[]> {
    this.verifyAdminAccess(adminUserId);
    const submissions = db.getPendingVerifications();

    return submissions.map(sub => {
      const provider = db.findProviderProfileById(sub.provider_id);
      return {
        id: sub.id,
        provider_id: sub.provider_id,
        business_name: provider?.business_name,
        trade_title: provider?.trade_title,
        document_type: sub.document_type,
        storage_path: sub.storage_path,
        status: sub.status,
        reviewer_id: sub.reviewer_id,
        review_notes: sub.review_notes,
        badge_granted: sub.badge_granted,
        reviewed_at: sub.reviewed_at?.toISOString(),
        created_at: sub.created_at.toISOString()
      };
    });
  }

  async reviewSubmission(
    adminUserId: string,
    submissionId: string,
    payload: AdminVerificationReviewPayload,
    correlationId: string
  ): Promise<VerificationSubmissionDto> {
    this.verifyAdminAccess(adminUserId);

    const submission = db.getVerificationSubmissionById(submissionId);
    if (!submission) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.submission_not_found');
    }

    if (submission.status !== 'IN_REVIEW') {
      throw new AppError(400, StandardErrorCode.INVALID_STATE_TRANSITION, 'errors.submission_already_reviewed');
    }

    if (!['APPROVE', 'REJECT'].includes(payload.decision)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_decision');
    }

    if (payload.decision === 'REJECT' && !payload.review_notes?.trim()) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.rejection_notes_required');
    }

    const provider = db.findProviderProfileById(submission.provider_id);
    if (!provider) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    const now = new Date();
    submission.reviewer_id = adminUserId;
    submission.review_notes = payload.review_notes?.trim() || 'Approved by admin review';
    submission.reviewed_at = now;

    const prevProviderStatus = provider.status;

    if (payload.decision === 'APPROVE') {
      submission.status = 'APPROVED';

      // Determine badge to grant based on document type or explicit payload
      let badgeCode = payload.badge_to_grant;
      if (!badgeCode) {
        if (submission.document_type === 'GOVT_PHOTO_ID') badgeCode = 'GOVT_ID_VERIFIED';
        else if (submission.document_type === 'TRADE_CERT') badgeCode = 'TRADE_CERTIFIED';
        else if (submission.document_type === 'POLICE_CLEARANCE') badgeCode = 'POLICE_VERIFIED';
      }

      if (badgeCode && TRUST_BADGE_DEFINITIONS[badgeCode]) {
        submission.badge_granted = badgeCode;
        const badgeDef = TRUST_BADGE_DEFINITIONS[badgeCode];

        // Add to provider badges if not already present
        const existing = provider.badges_summary.find(b => b.code === badgeCode);
        if (!existing) {
          const newBadge: TrustBadgeDto = {
            code: badgeCode as any,
            label: badgeDef.label,
            reviewed_item: badgeDef.reviewed_item,
            verified_at: now.toISOString()
          };
          provider.badges_summary.push(newBadge);
        }
      }

      // Transition provider status to APPROVED_ACTIVE
      provider.status = 'APPROVED_ACTIVE';
      provider.updated_at = now;
      db.saveProviderProfile(provider);
    } else {
      submission.status = 'REJECTED';
      // Provider status set to REJECTED with note
      provider.status = 'REJECTED' as any;
      provider.updated_at = now;
      db.saveProviderProfile(provider);
    }

    db.updateVerificationSubmission(submission);

    // Write immutable audit log
    db.logAudit({
      entity_name: 'verification_submissions',
      entity_id: submission.id,
      actor_id: adminUserId,
      actor_role: 'ADMIN',
      action: payload.decision === 'APPROVE' ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
      previous_state: prevProviderStatus,
      new_state: provider.status,
      metadata: {
        provider_id: provider.id,
        decision: payload.decision,
        badge_granted: submission.badge_granted,
        notes: submission.review_notes
      },
      correlation_id: correlationId
    });

    return {
      id: submission.id,
      provider_id: submission.provider_id,
      business_name: provider.business_name,
      trade_title: provider.trade_title,
      document_type: submission.document_type,
      storage_path: submission.storage_path,
      status: submission.status,
      reviewer_id: submission.reviewer_id,
      review_notes: submission.review_notes,
      badge_granted: submission.badge_granted,
      reviewed_at: submission.reviewed_at.toISOString(),
      created_at: submission.created_at.toISOString()
    };
  }

  private verifyAdminAccess(userId: string): void {
    const user = db.findUserById(userId);
    if (!user || !user.is_admin) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.admin_forbidden');
    }
  }
}
