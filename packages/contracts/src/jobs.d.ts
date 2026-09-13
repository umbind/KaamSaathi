export type JobStatus = 'SCHEDULED' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export interface UpdateJobStatusPayload {
    status: 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
}
export interface CreateChangeOrderPayload {
    description: string;
    additional_labor_paise: number;
    additional_parts_paise: number;
}
export interface ChangeOrderDto {
    id: string;
    booking_id: string;
    description: string;
    additional_labor_paise: number;
    additional_parts_paise: number;
    total_additional_paise: number;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
    created_at: string;
    updated_at: string;
}
export interface ReviewChangeOrderPayload {
    action: 'APPROVE' | 'REJECT';
}
export interface DeclarePaymentPayload {
    payment_method: 'CASH' | 'UPI';
    amount_paise: number;
    reference_id?: string;
}
export interface PaymentRecordDto {
    id: string;
    booking_id: string;
    payment_method: 'CASH' | 'UPI';
    amount_paise: number;
    reference_id?: string;
    status: 'PROVIDER_DECLARED' | 'CONFIRMED' | 'DISPUTED';
    declared_at: string;
    confirmed_at?: string;
}
export interface ConfirmPaymentPayload {
    confirmed: boolean;
}
//# sourceMappingURL=jobs.d.ts.map