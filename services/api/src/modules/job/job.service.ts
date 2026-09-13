import crypto from 'node:crypto';
import {
  UpdateJobStatusPayload,
  CreateChangeOrderPayload,
  ChangeOrderDto,
  ReviewChangeOrderPayload,
  DeclarePaymentPayload,
  PaymentRecordDto,
  ConfirmPaymentPayload,
  BookingDto,
  StandardErrorCode
} from '@kaamsaathi/contracts';
import { db, ChangeOrderRecord, PaymentRecord, BookingRecord } from '../../database/db.js';
import { AppError } from '../../common/errors.js';
import { CryptoUtils } from '../../common/crypto.utils.js';

export class JobService {
  async updateJobStatus(
    userId: string,
    bookingId: string,
    payload: UpdateJobStatusPayload,
    correlationId: string
  ): Promise<BookingDto> {
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const provider = db.findProviderProfileByUserId(userId);
    const customer = db.findCustomerProfileByUserId(userId);

    const isProvider = provider && booking.provider_id === provider.id;
    const isCustomer = customer && booking.customer_id === customer.id;

    if (!isProvider && !isCustomer) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    // Customer can only cancel if scheduled
    if (isCustomer && !isProvider) {
      if (payload.status !== 'CANCELLED') {
        throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.customer_can_only_cancel');
      }
    }

    // Valid state transitions
    const validTransitions: Record<string, string[]> = {
      SCHEDULED: ['EN_ROUTE', 'CANCELLED'],
      EN_ROUTE: ['ARRIVED', 'CANCELLED'],
      ARRIVED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: []
    };

    const allowed = validTransitions[booking.status] || [];
    if (!allowed.includes(payload.status)) {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.invalid_state_transition',
        { current: booking.status, requested: payload.status }
      );
    }

    const prevStatus = booking.status;
    booking.status = payload.status;
    booking.version += 1;
    db.saveBooking(booking);

    db.logAudit({
      entity_name: 'bookings',
      entity_id: booking.id,
      actor_id: userId,
      actor_role: isProvider ? 'PROVIDER' : 'CUSTOMER',
      action: 'JOB_STATUS_UPDATED',
      previous_state: prevStatus,
      new_state: payload.status,
      metadata: { notes: payload.notes || '' },
      correlation_id: correlationId
    });

    return this.toBookingDto(booking);
  }

  async createChangeOrder(
    userId: string,
    bookingId: string,
    payload: CreateChangeOrderPayload,
    correlationId: string
  ): Promise<ChangeOrderDto> {
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const provider = db.findProviderProfileByUserId(userId);
    if (!provider || booking.provider_id !== provider.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    if (!['ARRIVED', 'IN_PROGRESS'].includes(booking.status)) {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.change_order_requires_active_job'
      );
    }

    const labor = payload.additional_labor_paise;
    const parts = payload.additional_parts_paise;

    if (!Number.isInteger(labor) || labor < 0 || !Number.isInteger(parts) || parts < 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_amounts');
    }

    const totalAdditional = labor + parts;
    if (totalAdditional <= 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.change_order_zero_amount');
    }

    const now = new Date();
    const orderRecord: ChangeOrderRecord = {
      id: crypto.randomUUID(),
      booking_id: booking.id,
      description: payload.description.trim(),
      additional_labor_paise: labor,
      additional_parts_paise: parts,
      total_additional_paise: totalAdditional,
      status: 'PENDING_APPROVAL',
      version: 1,
      created_at: now,
      updated_at: now
    };

    db.saveChangeOrder(orderRecord);

    db.logAudit({
      entity_name: 'change_orders',
      entity_id: orderRecord.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'CHANGE_ORDER_CREATED',
      new_state: 'PENDING_APPROVAL',
      metadata: { booking_id: booking.id, total_additional_paise: totalAdditional },
      correlation_id: correlationId
    });

    return this.toChangeOrderDto(orderRecord);
  }

  async reviewChangeOrder(
    userId: string,
    changeOrderId: string,
    payload: ReviewChangeOrderPayload,
    correlationId: string
  ): Promise<ChangeOrderDto> {
    const changeOrder = db.findChangeOrderById(changeOrderId);
    if (!changeOrder) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.change_order_not_found');
    }

    const booking = db.findBookingById(changeOrder.booking_id);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const customer = db.findCustomerProfileByUserId(userId);
    if (!customer || booking.customer_id !== customer.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    if (changeOrder.status !== 'PENDING_APPROVAL') {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.change_order_already_reviewed'
      );
    }

    const prevStatus = changeOrder.status;

    if (payload.action === 'APPROVE') {
      changeOrder.status = 'APPROVED';
      // Atomically increment booking agreed pricing
      booking.agreed_labor_estimate_paise += changeOrder.additional_labor_paise;
      booking.agreed_parts_estimate_paise += changeOrder.additional_parts_paise;
      booking.total_agreed_estimate_paise += changeOrder.total_additional_paise;
      booking.version += 1;
      db.saveBooking(booking);
    } else {
      changeOrder.status = 'REJECTED';
    }

    changeOrder.version += 1;
    db.saveChangeOrder(changeOrder);

    db.logAudit({
      entity_name: 'change_orders',
      entity_id: changeOrder.id,
      actor_id: userId,
      actor_role: 'CUSTOMER',
      action: `CHANGE_ORDER_${changeOrder.status}`,
      previous_state: prevStatus,
      new_state: changeOrder.status,
      metadata: { booking_id: booking.id, delta: changeOrder.total_additional_paise },
      correlation_id: correlationId
    });

    return this.toChangeOrderDto(changeOrder);
  }

  async declarePayment(
    userId: string,
    bookingId: string,
    payload: DeclarePaymentPayload,
    correlationId: string
  ): Promise<PaymentRecordDto> {
    const booking = db.findBookingById(bookingId);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const provider = db.findProviderProfileByUserId(userId);
    if (!provider || booking.provider_id !== provider.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    if (!['IN_PROGRESS', 'COMPLETED'].includes(booking.status)) {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.job_must_be_active_to_declare_payment'
      );
    }

    const amount = payload.amount_paise;
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_payment_amount');
    }

    if (!['CASH', 'UPI'].includes(payload.payment_method)) {
      throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_payment_method');
    }

    // Transition booking to COMPLETED if not already
    if (booking.status !== 'COMPLETED') {
      booking.status = 'COMPLETED';
      booking.version += 1;
      db.saveBooking(booking);
    }

    const now = new Date();
    const paymentRecord: PaymentRecord = {
      id: crypto.randomUUID(),
      booking_id: booking.id,
      payment_method: payload.payment_method,
      amount_paise: amount,
      reference_id: payload.reference_id?.trim(),
      status: 'PROVIDER_DECLARED',
      declared_at: now,
      created_at: now,
      updated_at: now
    };

    db.savePayment(paymentRecord);

    db.logAudit({
      entity_name: 'payments',
      entity_id: paymentRecord.id,
      actor_id: userId,
      actor_role: 'PROVIDER',
      action: 'PAYMENT_DECLARED',
      new_state: 'PROVIDER_DECLARED',
      metadata: {
        booking_id: booking.id,
        method: payload.payment_method,
        amount_paise: amount,
        reference_id: payload.reference_id
      },
      correlation_id: correlationId
    });

    return this.toPaymentDto(paymentRecord);
  }

  async confirmPayment(
    userId: string,
    paymentId: string,
    payload: ConfirmPaymentPayload,
    correlationId: string
  ): Promise<PaymentRecordDto> {
    const payment = db.findPaymentById(paymentId);
    if (!payment) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.payment_not_found');
    }

    const booking = db.findBookingById(payment.booking_id);
    if (!booking) {
      throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.booking_not_found');
    }

    const customer = db.findCustomerProfileByUserId(userId);
    if (!customer || booking.customer_id !== customer.id) {
      throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.forbidden');
    }

    if (payment.status !== 'PROVIDER_DECLARED') {
      throw new AppError(
        400,
        StandardErrorCode.INVALID_STATE_TRANSITION,
        'errors.payment_already_processed'
      );
    }

    const prevStatus = payment.status;
    const now = new Date();

    if (payload.confirmed) {
      payment.status = 'CONFIRMED';
      payment.confirmed_at = now;
    } else {
      payment.status = 'DISPUTED';
    }

    db.savePayment(payment);

    db.logAudit({
      entity_name: 'payments',
      entity_id: payment.id,
      actor_id: userId,
      actor_role: 'CUSTOMER',
      action: `PAYMENT_${payment.status}`,
      previous_state: prevStatus,
      new_state: payment.status,
      metadata: { booking_id: booking.id, confirmed: payload.confirmed },
      correlation_id: correlationId
    });

    return this.toPaymentDto(payment);
  }

  private toChangeOrderDto(record: ChangeOrderRecord): ChangeOrderDto {
    return {
      id: record.id,
      booking_id: record.booking_id,
      description: record.description,
      additional_labor_paise: record.additional_labor_paise,
      additional_parts_paise: record.additional_parts_paise,
      total_additional_paise: record.total_additional_paise,
      status: record.status,
      created_at: record.created_at.toISOString(),
      updated_at: record.updated_at.toISOString()
    };
  }

  private toPaymentDto(record: PaymentRecord): PaymentRecordDto {
    return {
      id: record.id,
      booking_id: record.booking_id,
      payment_method: record.payment_method,
      amount_paise: record.amount_paise,
      reference_id: record.reference_id,
      status: record.status,
      declared_at: record.declared_at.toISOString(),
      confirmed_at: record.confirmed_at ? record.confirmed_at.toISOString() : undefined
    };
  }

  private toBookingDto(record: BookingRecord): BookingDto {
    const customer = db.findCustomerProfileById(record.customer_id);
    const provider = db.findProviderProfileById(record.provider_id);

    const customerUser = customer ? db.findUserById(customer.user_id) : null;
    const providerUser = provider ? db.findUserById(provider.user_id) : null;

    let customerContact: any = undefined;
    let providerContact: any = undefined;

    if (record.consent_contact_reveal) {
      if (customer && customerUser) {
        let phone = '';
        try {
          phone = CryptoUtils.decrypt(customerUser.phone_encrypted);
        } catch {
          phone = '+91XXXXXXXXXX';
        }
        customerContact = {
          full_name: customer.full_name,
          phone_number: phone,
          district_id: customer.district_id,
          locality_name: customer.locality_name,
          pin_code: customer.pin_code
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
