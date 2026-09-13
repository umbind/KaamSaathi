import crypto from 'node:crypto';

const HMAC_SALT = process.env.PHONE_HMAC_SALT || 'kaamsaathi-secure-dev-salt-2026';
const AES_KEY = crypto.scryptSync(HMAC_SALT, 'salt', 32);
const JWT_SECRET = process.env.JWT_SECRET || 'kaamsaathi-jwt-secret-key-32-chars-min!';

export class CryptoUtils {
  static hashPhone(phoneNumber: string): string {
    return crypto.createHmac('sha256', HMAC_SALT).update(phoneNumber.trim()).digest('hex');
  }

  static encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', AES_KEY, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  static decrypt(ciphertext: string): string {
    const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':');
    const decipher = crypto.createDecipheriv('aes-256-gcm', AES_KEY, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static generateOtp(): string {
    const num = crypto.randomInt(100000, 1000000);
    return num.toString();
  }

  static generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static timingSafeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  static signJwt(payload: Record<string, unknown>, expiresInSeconds: number): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };
    const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const b64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${b64Header}.${b64Payload}`)
      .digest('base64url');
    return `${b64Header}.${b64Payload}.${signature}`;
  }

  static verifyJwt(token: string): Record<string, any> | null {
    try {
      const [b64Header, b64Payload, signature] = token.split('.');
      if (!b64Header || !b64Payload || !signature) return null;

      const expectedSig = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${b64Header}.${b64Payload}`)
        .digest('base64url');

      if (!this.timingSafeEqual(signature, expectedSig)) return null;

      const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null; // Expired
      }
      return payload;
    } catch {
      return null;
    }
  }

  // RFC 6238 TOTP verification (time step 30s)
  static generateTotp(secret: string, timeStepWindow: number = 0): string {
    const counter = Math.floor(Date.now() / 1000 / 30) + timeStepWindow;
    const buf = Buffer.alloc(8);
    buf.writeBigInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'hex')).update(buf).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);
    return (code % 1000000).toString().padStart(6, '0');
  }

  static verifyTotp(secret: string, code: string): boolean {
    // Check current window and +/- 1 window (drift tolerance)
    for (const window of [0, -1, 1]) {
      const generated = this.generateTotp(secret, window);
      if (this.timingSafeEqual(generated, code)) {
        return true;
      }
    }
    return false;
  }
}
