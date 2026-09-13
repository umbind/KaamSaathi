import crypto from 'node:crypto';
import {
  CreateQuotePayload,
  QuoteDto,
  AcceptQuotePayload,
  BookingDto,
  StandardErrorCode
} from '@kaamsaathi/contracts';
import { db, QuoteRecord, BookingRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';
import { CryptoUtils } from '../../common/crypto.utils.js';

export class BookingService {
  async createQuote(
    userId: string,
    payload: CreateQuotePayload,
    correlationId: string
  ): Promise<QuoteDto> {
    const provider = db.findProviderProfileByUserId(userId);
    if (!provider) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.provider_not_found');
    }

    const lead = db.findLeadById(payload.lead_id);
    if (!lead) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.lead_not_found');
    }

    if (lead.provider_id !== provider.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.unauthorized_lead_access');
    }

    const now = new Date();
    if (lead.expires_at < now) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.lead_expired');
    }

    // Amount validations: integer and >= 0
    const visitationFee = payload.visitation_fee_paise;
    const labor = payload.estimated_labor_paise;
    const parts = payload.estimated_parts_paise || 0;

    if (
      !Number.isInteger(visitationFee) || visitationFee < 0 ||
      !Number.isInteger(labor) || labor < 0 ||
      !Number.isInteger(parts) || parts < 0
    ) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_quote_amounts');
    }

    const totalEstimate = visitationFee + labor + parts;
    const validHours = payload.valid_hours && payload.valid_hours > 0 ? payload.valid_hours : 4;
    const expiresAt = new Date(now.getTime() + validHours * 3600 * 1000);

    const quoteId = crypto.randomUUID();
    const quoteRecord: QuoteRecord = {
      id: quoteId,
      request_id: lead.request_id,
      lead_id: lead.id,
      provider_id: provider.id,
      status: 'DISPATCHED',
      visitation_fee_paise: visitationFee,
      estimated_labor_paise: labor,
      estimated_parts_paise: parts,
      total_estimate_paise: totalEstimate,
      scope_notes: payload.scope_notes?.trim() || '',
      expires_at: expiresAt,
      version: 1,
      created_at: now,
      updated_at: now
    };

    db.saveQuote(quoteRecord);

    // Update Lead to QUOTED
    lead.status = 'QUOTED';
    db.saveLead(lead);

    // Update Request to QUOTED
    const req = db.findRequestById(lead.request_id);
    if (req && ['SUBMITTED', 'MATCHING', 'LEAD_DISPATCHED'].includes(req.status)) {
      req.status = 'QUOTED';
      db.saveRequest(req);
    }

    db.logAudit({
      entity_name: 'quotes',
      entity_id: quoteRecord.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'QUOTE_DISPATCHED',
      new_state: 'DISPATCHED',
      metadata: {
        request_id: lead.request_id,
        total_estimate_paise: totalEstimate,
        visitation_fee_paise: visitationFee
      },
      correlation_id: correlationId
    });

    return this.toQuoteDto(quoteRecord);
  }

  async getRequestQuotes(userId: string, requestId: string): Promise<QuoteDto[]> {
    const customer = db.findCustomerProfileByUserId(userId);
    const req = db.findRequestById(requestId);
    if (!req) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.request_not_found');
    }

    // Access check: only owner customer can view quotes
    if (!customer || req.customer_id !== customer.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    const quotes = db.findQuotesByRequestId(requestId);
    const now = new Date();

    return quotes.map(q => {
      // Mark as VIEWED if DISPATCHED
      if (q.status === 'DISPATCHED' && q.expires_at > now) {
        q.status = 'VIEWED';
        db.saveQuote(q);
      }
      return this.toQuoteDto(q);
    });
  }

  async acceptQuote(
    userId: string,
    payload: AcceptQuotePayload,
    correlationId: string,
    clientIp: string
  ): Promise<BookingDto> {
    if (!payload.consent_contact_reveal) {
      throw new AppError(
        400,
        StandardErrorCode.CONSENT_REQUIRED,
        'errors.consent_required'
      );
    }

    const customer = db.findCustomerProfileByUserId(userId);
    if (!customer) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.customer_not_found');
    }

    const quote = db.findQuoteById(payload.quote_id);
    if (!quote) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.quote_not_found');
    }

    const req = db.findRequestById(quote.request_id);
    if (!req || req.customer_id !== customer.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    // Atomic Concurrency / Optimistic Check:
    // Exactly one quote can be accepted for a request
    if (req.status === 'BOOKED' || db.findBookingByRequestId(req.id)) {
      throw new AppError(
        409,
        StandardErrorCode.QUOTE_ALREADY_ACCEPTED,
        'errors.quote_already_accepted'
      );
    }

    const now = new Date();
    if (quote.expires_at < now) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.quote_expired');
    }

    if (!['DISPATCHED', 'VIEWED'].includes(quote.status)) {
      throw new AppError(
        409,
        StandardErrorCode.QUOTE_ALREADY_ACCEPTED,
        'errors.quote_already_accepted'
      );
    }

    // 1. Accept chosen quote
    quote.status = 'ACCEPTED';
    quote.version += 1;
    db.saveQuote(quote);

    // 2. Transition request to BOOKED
    req.status = 'BOOKED';
    req.version += 1;
    db.saveRequest(req);

    // 3. Atomically supersede all other competing quotes for this request
    const allQuotes = db.findQuotesByRequestId(req.id);
    for (const otherQuote of allQuotes) {
      if (otherQuote.id !== quote.id && ['DISPATCHED', 'VIEWED'].includes(otherQuote.status)) {
        otherQuote.status = 'SUPERSEDED';
        otherQuote.version += 1;
        db.saveQuote(otherQuote);
      }
    }

    // 4. Create Confirmed Booking Record
    const bookingId = crypto.randomUUID();
    const bookingRecord: BookingRecord = {
      id: bookingId,
      request_id: req.id,
      quote_id: quote.id,
      customer_id: customer.id,
      provider_id: quote.provider_id,
      status: 'SCHEDULED',
      agreed_visitation_fee_paise: quote.visitation_fee_paise,
      agreed_labor_estimate_paise: quote.estimated_labor_paise,
      agreed_parts_estimate_paise: quote.estimated_parts_paise,
      total_agreed_estimate_paise: quote.total_estimate_paise,
      scheduled_window: req.preferred_schedule_window || 'Standard',
      consent_contact_reveal: true,
      version: 1,
      created_at: now,
      updated_at: now
    };

    db.saveBooking(bookingRecord);

    // 5. Immutable Audit Log with Consent Metadata
    db.logAudit({
      entity_name: 'bookings',
      entity_id: bookingRecord.id,
      actor_id: userId,
      actor_role: 'CUSTOMER',
      action: 'QUOTE_ACCEPTED_BOOKING_CONFIRMED',
      new_state: 'SCHEDULED',
      metadata: {
        quote_id: quote.id,
        provider_id: quote.provider_id,
        consent_contact_reveal: true,
        client_ip: clientIp,
        agreed_estimate_paise: quote.total_estimate_paise
      },
      correlation_id: correlationId
    });

    return this.toBookingDto(bookingRecord, userId);
  }

  async getBookingDetails(userId: string, bookingId: string): Promise<BookingDto> {
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

    return this.toBookingDto(booking, userId);
  }

  private toQuoteDto(record: QuoteRecord): QuoteDto {
    const provider = db.findProviderProfileById(record.provider_id);
    return {
      id: record.id,
      request_id: record.request_id,
      lead_id: record.lead_id,
      provider_id: record.provider_id,
      provider_business_name: provider?.business_name || 'Independent Specialist',
      provider_trade_title: provider?.trade_title || 'Service Specialist',
      provider_badges: (provider?.badges_summary || []) as any,
      status: record.status as any,
      visitation_fee_paise: record.visitation_fee_paise,
      estimated_labor_paise: record.estimated_labor_paise,
      estimated_parts_paise: record.estimated_parts_paise,
      total_estimate_paise: record.total_estimate_paise,
      scope_notes: record.scope_notes,
      expires_at: record.expires_at.toISOString(),
      created_at: record.created_at.toISOString()
    };
  }

  private toBookingDto(record: BookingRecord, requesterUserId: string): BookingDto {
    const customer = db.findCustomerProfileById(record.customer_id);
    const provider = db.findProviderProfileById(record.provider_id);

    const customerUser = customer ? db.findUserById(customer.user_id) : null;
    const providerUser = provider ? db.findUserById(provider.user_id) : null;

    let customerContact: any = undefined;
    let providerContact: any = undefined;

    // Contact Revelation upon quote acceptance
    if (record.consent_contact_reveal) {
      if (customer && customerUser) {
        let phone = '';
        try {
          phone = CryptoUtils.decrypt(customerUser.phone_encrypted);
        } catch {
          phone = '+91XXXXXXXXXX';
        }

        let addressLine = '';
        if (customer.address_line_encrypted) {
          try {
            addressLine = CryptoUtils.decrypt(customer.address_line_encrypted);
          } catch {
            addressLine = '';
          }
        }

        customerContact = {
          full_name: customer.full_name,
          phone_number: phone,
          district_id: customer.district_id,
          locality_name: customer.locality_name,
          pin_code: customer.pin_code,
          address_line: addressLine || `${customer.locality_name}, ${customer.district_id}`
        };
      }

      if (provider && providerUser) {
        let phone = '';
        try {
          phone = CryptoUtils.decrypt(providerUser.phone_encrypted);
        } catch {
          phone = '+91XXXXXXXXXX';
        }

        providerContact = {
          business_name: provider.business_name,
          phone_number: phone,
          trade_title: provider.trade_title
        };
      }
    }

    return {
      id: record.id,
      request_id: record.request_id,
      quote_id: record.quote_id,
      customer_id: record.customer_id,
      provider_id: record.provider_id,
      status: record.status,
      agreed_visitation_fee_paise: record.agreed_visitation_fee_paise,
      agreed_labor_estimate_paise: record.agreed_labor_estimate_paise,
      agreed_parts_estimate_paise: record.agreed_parts_estimate_paise,
      total_agreed_estimate_paise: record.total_agreed_estimate_paise,
      scheduled_window: record.scheduled_window,
      customer_contact: customerContact,
      provider_contact: providerContact,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString()
    };
  }
}
