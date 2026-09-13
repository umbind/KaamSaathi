export interface ErrorEnvelope {
  code: string;
  message_key: string;
  correlation_id: string;
  details?: Record<string, unknown>;
  retry_after_seconds?: number;
}

export enum StandardErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',
  IDEMPOTENCY_CONFLICT = 'IDEMPOTENCY_CONFLICT',
  SELF_DEALING_PROHIBITED = 'SELF_DEALING_PROHIBITED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
