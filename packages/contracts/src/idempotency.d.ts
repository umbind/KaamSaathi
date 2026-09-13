export interface IdempotencyRecord {
    key: string;
    user_id: string;
    request_path: string;
    payload_hash: string;
    response_status: number;
    response_body: unknown;
    expires_at: Date;
}
//# sourceMappingURL=idempotency.d.ts.map