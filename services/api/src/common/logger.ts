export class Logger {
  private static maskPii(str: string): string {
    // Mask Indian phone numbers: +91 98765 43210 -> +91 ***** *3210
    return str
      .replace(/(\+91|91)?([6-9]\d{2})\d{4}(\d{3})/g, '$1 $2****$3')
      .replace(/("otp(_code)?":\s*")(\d{6})(")/gi, '$1******$4')
      .replace(/("access_token":\s*")([^"]+)(")/gi, '$1[REDACTED_TOKEN]$3')
      .replace(/("refresh_token":\s*")([^"]+)(")/gi, '$1[REDACTED_TOKEN]$3');
  }

  static info(message: string, context?: Record<string, unknown>): void {
    const ctxStr = context ? ' ' + this.maskPii(JSON.stringify(context)) : '';
    console.log(`[INFO] ${new Date().toISOString()} - ${this.maskPii(message)}${ctxStr}`);
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    const ctxStr = context ? ' ' + this.maskPii(JSON.stringify(context)) : '';
    console.warn(`[WARN] ${new Date().toISOString()} - ${this.maskPii(message)}${ctxStr}`);
  }

  static error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    const ctxStr = context ? ' ' + this.maskPii(JSON.stringify(context)) : '';
    const errStr = error instanceof Error ? ` - ${error.stack}` : '';
    console.error(`[ERROR] ${new Date().toISOString()} - ${this.maskPii(message)}${errStr}${ctxStr}`);
  }
}
