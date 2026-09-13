import { ErrorEnvelope, StandardErrorCode } from '@kaamsaathi/contracts';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: StandardErrorCode | string,
    public readonly messageKey: string,
    public readonly details?: Record<string, unknown>,
    public readonly retryAfterSeconds?: number
  ) {
    super(messageKey);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toEnvelope(correlationId: string): ErrorEnvelope {
    return {
      code: this.code,
      message_key: this.messageKey,
      correlation_id: correlationId,
      details: this.details,
      retry_after_seconds: this.retryAfterSeconds,
    };
  }
}
