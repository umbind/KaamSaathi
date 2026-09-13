import http from 'node:http';
import crypto from 'node:crypto';
import { StandardErrorCode, ErrorEnvelope } from '@kaamsaathi/contracts';
import { AppError } from './common/errors.js';
import { CryptoUtils } from './common/crypto.utils.js';
import { Logger } from './common/logger.js';
import { db } from './database/db.js';
import { IdentityService } from './modules/identity/identity.service.js';
import { CustomerService } from './modules/customer/customer.service.js';
import { ProviderService } from './modules/provider/provider.service.js';
import { AdminVerificationService } from './modules/admin/admin-verification.service.js';
import { RequestService } from './modules/request/request.service.js';
import { BookingService } from './modules/booking/booking.service.js';
import { JobService } from './modules/job/job.service.js';

export class App {
  public readonly identityService = new IdentityService();
  public readonly customerService = new CustomerService();
  public readonly providerService = new ProviderService();
  public readonly adminVerificationService = new AdminVerificationService();
  public readonly requestService = new RequestService();
  public readonly bookingService = new BookingService();
  public readonly jobService = new JobService();

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'];

    res.setHeader('X-Correlation-Id', correlationId);
    res.setHeader('Content-Type', 'application/json');

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Idempotency-Key, X-Correlation-Id, Accept-Language');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;
      const method = req.method?.toUpperCase();

      // Read Body for POST/PUT
      let body: any = null;
      let rawBody = '';
      if (['POST', 'PUT', 'PATCH'].includes(method || '')) {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        rawBody = Buffer.concat(chunks).toString('utf8');
        if (rawBody.trim()) {
          try {
            body = JSON.parse(rawBody);
          } catch {
            throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_json');
          }
        } else {
          body = {};
        }
      }

      // Idempotency check for mutating endpoints
      if (idempotencyKey && ['POST', 'PUT'].includes(method || '')) {
        const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');
        const cached = db.getIdempotency(idempotencyKey);
        if (cached) {
          if (cached.payload_hash !== payloadHash) {
            throw new AppError(
              409,
              StandardErrorCode.IDEMPOTENCY_CONFLICT,
              'errors.idempotency_payload_mismatch',
              { key: idempotencyKey }
            );
          }
          res.setHeader('X-Cache-Lookup', 'HIT');
          res.statusCode = cached.response_status;
          res.end(JSON.stringify(cached.response_body));
          return;
        }
      }

      // Extract & Verify Auth Token
      let authUser: any = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        authUser = CryptoUtils.verifyJwt(token);
        if (authUser) {
          // Verify session is not revoked in DB
          const session = db.findSessionById(authUser.session_id);
          if (!session || session.is_revoked || session.expires_at < new Date()) {
            authUser = null;
          }
        }
      }

      // Route Dispatcher
      let responseBody: any = null;
      let statusCode = 200;

      // 1. Auth routes
      if (method === 'POST' && pathname === '/api/v1/auth/otp/request') {
        responseBody = await this.identityService.requestOtp(body, correlationId, clientIp);
      } else if (method === 'POST' && pathname === '/api/v1/auth/otp/verify') {
        responseBody = await this.identityService.verifyOtp(body, correlationId, clientIp, userAgent);
      } else if (method === 'POST' && pathname === '/api/v1/auth/refresh') {
        responseBody = await this.identityService.refreshToken(body.refresh_token, correlationId);
      } else if (method === 'POST' && pathname === '/api/v1/auth/logout') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.identityService.logout(authUser.session_id, authUser.sub, correlationId);
      } else if (method === 'POST' && pathname === '/api/v1/auth/role-switch') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.identityService.switchRole(authUser.sub, authUser.session_id, body.target_role, correlationId);
      } else if (method === 'POST' && pathname === '/api/v1/admin/auth/login') {
        responseBody = await this.identityService.adminLogin(body, correlationId, clientIp);
      }
      
      // 2. User & Customer Profile routes
      else if (method === 'GET' && pathname === '/api/v1/users/me') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const user = db.findUserById(authUser.sub);
        if (!user) throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.user_not_found');
        responseBody = { user: this.identityService.toUserDto(user) };
      } else if (method === 'PUT' && pathname === '/api/v1/users/language') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.customerService.updateLanguage(authUser.sub, body.language, correlationId);
      } else if (method === 'GET' && pathname === '/api/v1/customer/profile') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.customerService.getProfile(authUser.sub);
      } else if (method === 'PUT' && pathname === '/api/v1/customer/profile') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.customerService.saveProfile(authUser.sub, body, correlationId);
      }
      
      // 2.5 Categories (Public)
      else if (method === 'GET' && pathname === '/api/v1/categories') {
        responseBody = await this.providerService.getCategories();
      }

      // 3. Provider routes
      else if (method === 'POST' && pathname === '/api/v1/provider/onboard') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.providerService.onboard(authUser.sub, body, correlationId);
        statusCode = 201;
      } else if (method === 'GET' && pathname === '/api/v1/provider/profile') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.getProfile(authUser.sub);
      } else if (method === 'PUT' && pathname === '/api/v1/provider/profile') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.updateProfile(authUser.sub, body, correlationId);
      } else if (method === 'GET' && pathname === '/api/v1/provider/coverage') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.getCoverage(authUser.sub);
      } else if (method === 'PUT' && pathname === '/api/v1/provider/coverage') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.setCoverage(authUser.sub, body, correlationId);
      } else if (method === 'GET' && pathname === '/api/v1/provider/services') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.getServices(authUser.sub);
      } else if (method === 'PUT' && pathname === '/api/v1/provider/services') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.setServices(authUser.sub, body, correlationId);
      } else if (method === 'PUT' && pathname === '/api/v1/provider/availability') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.setAvailability(authUser.sub, body, correlationId);
      } else if (method === 'POST' && pathname === '/api/v1/provider/verification') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.providerService.submitVerification(authUser.sub, body, correlationId);
        statusCode = 201;
      }

      // 4. Admin Verification routes
      else if (method === 'GET' && pathname === '/api/v1/admin/verifications/queue') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.adminVerificationService.getPendingQueue(authUser.sub);
      } else if (method === 'POST' && pathname.startsWith('/api/v1/admin/verifications/') && pathname.endsWith('/review')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        // e.g. ['', 'api', 'v1', 'admin', 'verifications', ':id', 'review']
        const submissionId = parts[5];
        if (!submissionId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_submission_id');
        responseBody = await this.adminVerificationService.reviewSubmission(authUser.sub, submissionId, body, correlationId);
      }
      
      // 5. Discovery & Service Requests (Slice 3)
      else if (method === 'GET' && pathname === '/api/v1/services/search') {
        const query = url.searchParams.get('q') || url.searchParams.get('query') || '';
        const districtId = url.searchParams.get('district_id') || undefined;
        const lang = (url.searchParams.get('lang') as 'hi' | 'en') || 'hi';
        responseBody = await this.requestService.searchServices(query, districtId, lang);
      } else if (method === 'POST' && pathname === '/api/v1/uploads/presigned') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.requestService.createPresignedUpload(authUser.sub, body, correlationId);
      } else if (method === 'POST' && pathname === '/api/v1/requests') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.requestService.createRequest(authUser.sub, body, correlationId);
        statusCode = 201;
      } else if (method === 'GET' && pathname === '/api/v1/customer/requests') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.requestService.getCustomerRequests(authUser.sub);
      } else if (method === 'GET' && pathname === '/api/v1/provider/leads') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.requestService.getProviderLeads(authUser.sub);
      }
      
      // 6. Quotes and Bookings (Slice 4)
      else if (method === 'POST' && pathname === '/api/v1/provider/quotes') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        if (authUser.role !== 'PROVIDER') throw new AppError(403, StandardErrorCode.FORBIDDEN, 'errors.provider_role_required');
        responseBody = await this.bookingService.createQuote(authUser.sub, body, correlationId);
        statusCode = 201;
      } else if (method === 'GET' && pathname.startsWith('/api/v1/requests/') && pathname.endsWith('/quotes')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        // ['', 'api', 'v1', 'requests', ':id', 'quotes']
        const requestId = parts[4];
        if (!requestId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_request_id');
        responseBody = await this.bookingService.getRequestQuotes(authUser.sub, requestId);
      } else if (method === 'POST' && pathname === '/api/v1/quotes/accept') {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        responseBody = await this.bookingService.acceptQuote(authUser.sub, body, correlationId, clientIp);
        statusCode = 200;
      } else if (method === 'GET' && pathname.startsWith('/api/v1/bookings/') && !pathname.includes('/', 17)) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        const bookingId = parts[4];
        if (!bookingId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_booking_id');
        responseBody = await this.bookingService.getBookingDetails(authUser.sub, bookingId);
      }
      
      // 7. Job Lifecycle, Change Orders, and Payments (Slice 5)
      else if (method === 'PUT' && pathname.startsWith('/api/v1/bookings/') && pathname.endsWith('/status')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        const bookingId = parts[4];
        if (!bookingId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_booking_id');
        responseBody = await this.jobService.updateJobStatus(authUser.sub, bookingId, body, correlationId);
      } else if (method === 'POST' && pathname.startsWith('/api/v1/bookings/') && pathname.endsWith('/change-order')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        const bookingId = parts[4];
        if (!bookingId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_booking_id');
        responseBody = await this.jobService.createChangeOrder(authUser.sub, bookingId, body, correlationId);
        statusCode = 201;
      } else if (method === 'POST' && pathname.startsWith('/api/v1/change-orders/') && pathname.endsWith('/review')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        const changeOrderId = parts[4];
        if (!changeOrderId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_change_order_id');
        responseBody = await this.jobService.reviewChangeOrder(authUser.sub, changeOrderId, body, correlationId);
      } else if (method === 'POST' && pathname.startsWith('/api/v1/bookings/') && pathname.endsWith('/payment')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        const bookingId = parts[4];
        if (!bookingId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_booking_id');
        responseBody = await this.jobService.declarePayment(authUser.sub, bookingId, body, correlationId);
        statusCode = 201;
      } else if (method === 'POST' && pathname.startsWith('/api/v1/payments/') && pathname.endsWith('/confirm')) {
        if (!authUser) throw new AppError(401, StandardErrorCode.UNAUTHORIZED, 'errors.unauthorized');
        const parts = pathname.split('/');
        const paymentId = parts[4];
        if (!paymentId) throw new AppError(400, StandardErrorCode.INVALID_INPUT, 'errors.invalid_payment_id');
        responseBody = await this.jobService.confirmPayment(authUser.sub, paymentId, body, correlationId);
      } else {
        throw new AppError(404, StandardErrorCode.NOT_FOUND, 'errors.endpoint_not_found');
      }

      // Save Idempotency Record
      if (idempotencyKey && ['POST', 'PUT'].includes(method || '')) {
        const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');
        db.saveIdempotency({
          key: idempotencyKey,
          user_id: authUser?.sub || 'anonymous',
          request_path: pathname,
          payload_hash: payloadHash,
          response_status: statusCode,
          response_body: responseBody,
          expires_at: new Date(Date.now() + 24 * 3600 * 1000), // 24 hours TTL
        });
      }

      res.statusCode = statusCode;
      res.end(JSON.stringify(responseBody));
    } catch (err: any) {
      if (err instanceof AppError) {
        res.statusCode = err.statusCode;
        res.end(JSON.stringify(err.toEnvelope(correlationId)));
      } else {
        Logger.error('Unhandled server error', err, { correlationId });
        const envelope: ErrorEnvelope = {
          code: StandardErrorCode.INTERNAL_SERVER_ERROR,
          message_key: 'errors.generic',
          correlation_id: correlationId,
        };
        res.statusCode = 500;
        res.end(JSON.stringify(envelope));
      }
    }
  }

  createServer(): http.Server {
    return http.createServer((req, res) => this.handleRequest(req, res));
  }
}
