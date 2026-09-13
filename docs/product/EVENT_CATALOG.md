# KaamSaathi Event, Notification, and Audit Catalog

## 1. Event Rules

Each event definition must include owner, schema version, trigger, delivery semantics, PII classification, retention, consumers, retry/deduplication, and validation test.

Do not place phone numbers, exact addresses, identity document values, complaint free text, UPI PIN/card/bank data, signed URLs, or secrets in analytics/event payloads.

## 2. Core Domain Events

| Event | Trigger | Minimum safe properties | Primary consumers |
|---|---|---|---|
| `user.otp_requested` | OTP challenge accepted | challenge_id, channel, risk_band, result | Security metrics, notification provider |
| `user.otp_verified` | Successful verification | user_id pseudonym, new/existing, device risk band | Identity, analytics |
| `provider.profile_submitted` | Onboarding submitted | provider_id, categories_count, route | Verification queue |
| `provider.verification_status_changed` | Decision/status | provider_id, signal_type, from/to, policy_version | Eligibility, notification, audit |
| `provider.eligibility_changed` | Derived eligibility changes | provider_id, category_id, area_id, from/to, reason_code | Matching, notification |
| `request.submitted` | Valid request created | request_id, category_id, area_id, mode, schedule_bucket | Matching, analytics |
| `matching.batch_created` | Providers selected for batch | request_id, batch_no, provider_count, ranking_version | Notification, metrics |
| `match.responded` | Provider interest/decline | match_id, response, reason_code, latency_bucket | Request/matching metrics |
| `quote.submitted` | Active quote version | quote_id, request_id, provider_id, version, amount_band, validity | Customer notification |
| `quote.status_changed` | Accept/withdraw/expire/etc. | quote_id, from/to, actor_type | Booking/request/audit |
| `booking.created` | Atomic quote acceptance | booking_id, request_id, quote_id, category_id | Notification, analytics |
| `booking.schedule_changed` | Accepted reschedule | booking_id, version, old/new bucket, actor_type | Notification, audit |
| `booking.state_changed` | Valid lifecycle transition | booking_id, from/to, actor_type, reason_code | Notification, analytics, audit |
| `change_order.submitted` | Active change order | booking_id, change_id, version, amount_delta_band | Customer notification |
| `change_order.decided` | Accept/reject | booking_id, change_id, decision, actor_type | Billing ceiling, audit |
| `completion.submitted` | Provider completion | booking_id, final_amount_band, evidence_count | Customer notification |
| `payment.state_changed` | Declaration/PSP/reconciliation | booking_id, method, from/to, amount_band, source | Receipt, support, audit |
| `review.submitted` | Eligible review | booking_id, review_id, rating_band, moderation_state | Reputation, moderation |
| `complaint.submitted` | Case created | complaint_id, category, severity, linked_object_type | Support/T&S, notification |
| `complaint.state_changed` | Case transition | complaint_id, from/to, queue, resolution_code | Notification, metrics, audit |
| `privacy_request.state_changed` | Privacy workflow | request_id, type, from/to, retention_result_code | Privacy ops, notification |
| `admin.action_performed` | Privileged action | admin_id, action, object_type/id, result, reason_code | Audit/security monitoring |

## 3. Analytics Events

| Event | Purpose | Key non-PII properties |
|---|---|---|
| `app_opened` | Engagement/technical health | app_version, locale, network_class, device_tier |
| `language_selected` | Localization adoption | locale, onboarding_stage |
| `category_viewed` | Demand discovery | category_id, area_id, source |
| `provider_list_viewed` | Discovery funnel | category_id, result_count_bucket, filters |
| `provider_profile_viewed` | Provider consideration | provider_id pseudonym, category_id, source |
| `request_started` | Funnel | category_id, source |
| `request_submitted` | Conversion | category_id, mode, area_id, attachments_bucket |
| `provider_response_received` | Supply responsiveness | request_id pseudonym, latency_bucket |
| `quote_viewed` | Quote funnel | quote_count_bucket, category_id |
| `booking_confirmed` | Core conversion | category_id, time_to_booking_bucket |
| `job_started` | Fulfilment | category_id, delay_bucket |
| `job_completed` | North-star | category_id, completion_source, duration_bucket |
| `review_submitted` | Trust loop | rating_band, category_id |
| `repeat_request_started` | Retention | category_id, same_provider boolean |
| `support_opened` | Friction | workflow_stage, reason_code |
| `offline_action_queued` | Reliability | action_type, network_class |
| `offline_action_synced` | Reliability | action_type, latency_bucket, result |

## 4. Notification Templates

Every template has Hindi/English versions, version number, channel-specific content, lock-screen-safe body, deep link, deduplication key, and fallback policy.

| Template | Recipient | Trigger | Privacy rule |
|---|---|---|---|
| OTP code | User | OTP requested | Never log; expiry; no account existence |
| Verification update | Provider | Case status | No document detail on lock screen |
| New lead | Provider | Match notified | Coarse area only; no address/phone |
| Lead expiring | Provider | Deadline near | Booking/request reference only |
| Quote received/revised | Customer | Quote active | Amount may be hidden on lock screen by preference |
| Quote expiring | Customer | Validity near | No private provider contact |
| Booking confirmed | Both | Booking created | Safe summary; full details in app |
| Reschedule proposal/result | Both | Schedule event | No full address |
| Provider en route/arrived | Customer | State change | No exact address in body |
| Start confirmation | Customer | Provider request | Code not displayed on lock screen |
| Change order | Customer | Change submitted | Amount details inside app |
| Completion request | Customer | Provider submission | Full bill inside app |
| Payment update | Both | Payment state | No UTR/full payment reference on lock screen |
| Review eligible | Eligible party | Completion | Suppress during open safety complaint |
| Complaint acknowledgment/update | Reporter | Case event | No sensitive allegation details on lock screen |
| Security alert | User/Admin | Session/risk event | Actionable, privacy-safe |
| Privacy request update | User | State change | Details inside authenticated view |

## 5. Audit Events

Mandatory audit actions include:

- Verification evidence view and decision.
- Exact address/phone reveal by staff.
- Admin login/MFA failure and privileged session.
- User/provider restriction, suspension, reinstatement.
- Safety interim action.
- Review removal/restore.
- Feature flag/config/coverage/category change.
- Bulk export.
- Privacy export/deletion/retention decision.
- Payment correction/refund state change.
- Manual state override.
- Secret/config access where supported.
