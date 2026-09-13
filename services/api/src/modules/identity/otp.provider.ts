import { IOtpProvider } from '@kaamsaathi/contracts';
import { Logger } from '../../common/logger.js';

export class MockOtpProvider implements IOtpProvider {
  // Store sent OTPs for assertions in tests
  public lastSentOtp: { phone: string; otp: string; correlationId: string } | null = null;
  public mockFixedCode: string | null = '123456';

  async sendOtp(phone: string, otp: string, correlationId: string): Promise<{ success: boolean; providerRef?: string }> {
    const codeToSend = this.mockFixedCode || otp;
    this.lastSentOtp = { phone, otp: codeToSend, correlationId };
    Logger.info(`[MockOtpProvider] Generated OTP for ${phone}: ${codeToSend}`, { correlationId });
    return { success: true, providerRef: `mock_ref_${Date.now()}` };
  }

}

export class SmsOtpProvider implements IOtpProvider {
  async sendOtp(phone: string, otp: string, correlationId: string): Promise<{ success: boolean; providerRef?: string }> {
    // Production SMS vendor integration placeholder (e.g. Gupshup / Msg91 / Twilio)
    // Gated behind Owner Approval APP-001
    throw new Error('SmsOtpProvider is gated behind APP-001 owner approval. Use MockOtpProvider in dev/test.');
  }
}
