import crypto from 'node:crypto';
import {
  CreateReviewPayload,
  ReviewDto,
  CreateReviewResponsePayload,
  FileDisputePayload,
  DisputeDto,
  ReportSafetyIncidentPayload,
  SafetyIncidentDto,
  ProviderEarningsSummaryDto,
  StandardErrorCode,
} from '@kaamsaathi/contracts';
import {
  db,
  ReviewRecord,
  DisputeRecord,
  SafetyIncidentRecord,
} from '../../database/db.js';
import { AppError } from '../../common/errors.js';

export class ReviewAndSafetyService {
  async createReview(
    userId: string,
    bookingId: string,
    payload: CreateReviewPayload,
    correlationId: string
  ): Promise<ReviewDto> {
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const customer = db.findCustomerProfileByUserId(userId);
    if (!customer || booking.customer_id !== customer.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    // Gated by job completion and payment confirmation
    if (booking.status !== 'COMPLETED') {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.review_requires_completed_job'
      );
    }

    const payment = db.findPaymentByBookingId(booking.id);
    if (!payment || payment.status !== 'CONFIRMED') {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.review_requires_confirmed_payment'
      );
    }

    // Rating validation: integer between 1 and 5
    if (
      typeof payload.rating !== 'number' ||
      !Number.isInteger(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_rating_range');
    }

    // Anti-fraud: only one review per booking
    const existing = db.findReviewByBookingId(booking.id);
    if (existing) {
      throw new AppError(
        409,
        StandardErrorCode.REVIEW_ALREADY_EXISTS,
        'errors.review_already_submitted'
      );
    }

    const reviewRecord: ReviewRecord = {
      id: crypto.randomUUID(),
      booking_id: booking.id,
      customer_id: customer.id,
      provider_id: booking.provider_id,
      rating: payload.rating,
      comment: payload.comment?.trim(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    db.saveReview(reviewRecord);

    // Recalculate provider ratings
    const providerReviews = db.findReviewsByProviderId(booking.provider_id);
    const count = providerReviews.length;
    const sum = providerReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

    const providerProfile = db.findProviderProfileById(booking.provider_id);
    if (providerProfile) {
      providerProfile.rating_avg = avg;
      providerProfile.rating_count = count;
      db.saveProviderProfile(providerProfile);
    }

    // Audit logging
    db.logAudit({
      entity_name: 'Review',
      entity_id: reviewRecord.id,
      actor_id: userId,
      actor_role: 'CUSTOMER',
      action: 'SUBMIT_REVIEW',
      metadata: {
        booking_id: booking.id,
        provider_id: booking.provider_id,
        rating: payload.rating,
        new_provider_avg: avg,
        new_provider_count: count,
      },
      correlation_id: correlationId,
    });

    return this.toReviewDto(reviewRecord);
  }

  async respondToReview(
    userId: string,
    reviewId: string,
    payload: CreateReviewResponsePayload,
    correlationId: string
  ): Promise<ReviewDto> {
    const review = db.findReviewById(reviewId);
    if (!review) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.review_not_found');
    }

    const provider = db.findProviderProfileByUserId(userId);
    if (!provider || review.provider_id !== provider.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    if (review.provider_response) {
      throw new AppError(
        409,
        StandardErrorCode.RESPONSE_ALREADY_EXISTS,
        'errors.response_already_submitted'
      );
    }

    if (!payload.response || typeof payload.response !== 'string' || payload.response.trim().length === 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.response_empty');
    }

    if (payload.response.length > 500) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.response_too_long');
    }

    review.provider_response = payload.response.trim();
    review.provider_responded_at = new Date();
    db.saveReview(review);

    db.logAudit({
      entity_name: 'Review',
      entity_id: review.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'RESPOND_TO_REVIEW',
      metadata: {
        review_id: review.id,
        provider_id: provider.id,
      },
      correlation_id: correlationId,
    });

    return this.toReviewDto(review);
  }

  async getProviderReviews(providerId: string): Promise<ReviewDto[]> {
    const reviews = db.findReviewsByProviderId(providerId);
    return reviews.map(r => this.toReviewDto(r));
  }

  async fileDispute(
    userId: string,
    bookingId: string,
    payload: FileDisputePayload,
    correlationId: string
  ): Promise<DisputeDto> {
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const customer = db.findCustomerProfileByUserId(userId);
    const provider = db.findProviderProfileByUserId(userId);

    const isCustomer = customer && booking.customer_id === customer.id;
    const isProvider = provider && booking.provider_id === provider.id;

    if (!isCustomer && !isProvider) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    const validReasons = [
      'POOR_QUALITY',
      'OVERCHARGING',
      'NO_SHOW',
      'UNPROFESSIONAL_BEHAVIOUR',
      'DAMAGE_OR_LOSS',
      'OTHER',
    ];

    if (!payload.reason || !validReasons.includes(payload.reason)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_dispute_reason');
    }

    if (
      !payload.description ||
      typeof payload.description !== 'string' ||
      payload.description.trim().length < 10
    ) {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_INPUT,
        'errors.dispute_description_too_short'
      );
    }

    // Check existing open dispute on this booking
    const existingDisputes = db.findDisputesByBookingId(booking.id);
    const activeDispute = existingDisputes.find(
      d => d.status === 'OPEN' || d.status === 'UNDER_REVIEW'
    );
    if (activeDispute) {
      throw new AppError(
        409,
        StandardErrorCode.DISPUTE_ALREADY_OPEN,
        'errors.dispute_already_open'
      );
    }

    const filedByRole = isCustomer ? 'CUSTOMER' : 'PROVIDER';
    const filedById = isCustomer ? customer!.id : provider!.id;

    const disputeRecord: DisputeRecord = {
      id: crypto.randomUUID(),
      booking_id: booking.id,
      filed_by_id: filedById,
      filed_by_role: filedByRole,
      reason: payload.reason,
      description: payload.description.trim(),
      evidence_keys: payload.evidence_keys || [],
      status: 'OPEN',
      created_at: new Date(),
      updated_at: new Date(),
    };

    db.saveDispute(disputeRecord);

    // Apply audit lock to booking
    booking.is_disputed = true;
    db.saveBooking(booking);

    db.logAudit({
      entity_name: 'Dispute',
      entity_id: disputeRecord.id,
      actor_id: userId,
      actor_role: filedByRole,
      action: 'FILE_DISPUTE',
      metadata: {
        booking_id: booking.id,
        reason: payload.reason,
        evidence_count: (payload.evidence_keys || []).length,
      },
      correlation_id: correlationId,
    });

    return this.toDisputeDto(disputeRecord);
  }

  async getDisputesForBooking(
    userId: string,
    bookingId: string
  ): Promise<DisputeDto[]> {
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const customer = db.findCustomerProfileByUserId(userId);
    const provider = db.findProviderProfileByUserId(userId);
    const user = db.findUserById(userId);

    const isCustomer = customer && booking.customer_id === customer.id;
    const isProvider = provider && booking.provider_id === provider.id;
    const isAdmin = user && user.is_admin;

    if (!isCustomer && !isProvider && !isAdmin) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    const disputes = db.findDisputesByBookingId(bookingId);
    return disputes.map(d => this.toDisputeDto(d));
  }

  async reportSafetyIncident(
    userId: string,
    payload: ReportSafetyIncidentPayload,
    correlationId: string
  ): Promise<SafetyIncidentDto> {
    const validCategories = [
      'HARASSMENT',
      'THEFT',
      'VIOLENCE',
      'PROPERTY_DAMAGE',
      'UNSAFE_ENVIRONMENT',
    ];

    if (!payload.category || !validCategories.includes(payload.category)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_safety_category');
    }

    const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    if (!payload.severity || !validSeverities.includes(payload.severity)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_safety_severity');
    }

    if (
      !payload.description ||
      typeof payload.description !== 'string' ||
      payload.description.trim().length < 10
    ) {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_INPUT,
        'errors.safety_description_too_short'
      );
    }

    if (payload.booking_id) {
      const booking = db.findBookingById(payload.booking_id);
      if (!booking) {
        throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
      }
    }

    const isPriority = payload.severity === 'HIGH' || payload.severity === 'CRITICAL';

    const incidentRecord: SafetyIncidentRecord = {
      id: crypto.randomUUID(),
      reporter_id: userId,
      booking_id: payload.booking_id,
      category: payload.category,
      description: payload.description.trim(),
      severity: payload.severity,
      status: 'REPORTED',
      locality: payload.locality,
      district: payload.district,
      is_priority: isPriority,
      created_at: new Date(),
      updated_at: new Date(),
    };

    db.saveSafetyIncident(incidentRecord);

    db.logAudit({
      entity_name: 'SafetyIncident',
      entity_id: incidentRecord.id,
      actor_id: userId,
      actor_role: 'USER',
      action: 'REPORT_SAFETY_INCIDENT',
      metadata: {
        category: payload.category,
        severity: payload.severity,
        is_priority: isPriority,
        booking_id: payload.booking_id,
      },
      correlation_id: correlationId,
    });

    return {
      id: incidentRecord.id,
      reporter_id: incidentRecord.reporter_id,
      booking_id: incidentRecord.booking_id,
      category: incidentRecord.category,
      description: incidentRecord.description,
      severity: incidentRecord.severity,
      status: incidentRecord.status,
      emergency_helplines: {
        police: '112',
        women_helpline: '1090',
        child_helpline: '1098',
      },
      is_priority: incidentRecord.is_priority,
      created_at: incidentRecord.created_at.toISOString(),
    };
  }

  async getProviderEarningsSummary(userId: string): Promise<ProviderEarningsSummaryDto> {
    const provider = db.findProviderProfileByUserId(userId);
    if (!provider) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.not_a_provider');
    }

    const bookings = db.findBookingsByProviderId(provider.id);
    let completedJobsCount = 0;
    let cashPaise = 0;
    let upiPaise = 0;

    for (const b of bookings) {
      if (b.status === 'COMPLETED') {
        const payment = db.findPaymentByBookingId(b.id);
        if (payment && payment.status === 'CONFIRMED') {
          completedJobsCount++;
          if (payment.payment_method === 'CASH') {
            cashPaise += payment.amount_paise;
          } else if (payment.payment_method === 'UPI') {
            upiPaise += payment.amount_paise;
          }
        }
      }
    }

    const totalGrossPaise = cashPaise + upiPaise;
    const platformFeePaise = 0; // Pilot phase zero commission rule
    const netEarningsPaise = totalGrossPaise - platformFeePaise;

    return {
      provider_id: provider.id,
      completed_jobs_count: completedJobsCount,
      total_gross_paise: totalGrossPaise,
      cash_paise: cashPaise,
      upi_paise: upiPaise,
      platform_fee_paise: platformFeePaise,
      net_earnings_paise: netEarningsPaise,
    };
  }

  private toReviewDto(record: ReviewRecord): ReviewDto {
    return {
      id: record.id,
      booking_id: record.booking_id,
      customer_id: record.customer_id,
      provider_id: record.provider_id,
      rating: record.rating,
      comment: record.comment,
      provider_response: record.provider_response,
      provider_responded_at: record.provider_responded_at?.toISOString(),
      created_at: record.created_at.toISOString(),
    };
  }

  private toDisputeDto(record: DisputeRecord): DisputeDto {
    return {
      id: record.id,
      booking_id: record.booking_id,
      filed_by_id: record.filed_by_id,
      filed_by_role: record.filed_by_role,
      reason: record.reason,
      description: record.description,
      evidence_keys: record.evidence_keys,
      status: record.status,
      resolution_notes: record.resolution_notes,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString(),
    };
  }
}

export const reviewAndSafetyService = new ReviewAndSafetyService();
