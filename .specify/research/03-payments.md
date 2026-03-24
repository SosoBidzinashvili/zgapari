# Research Report 03 — Georgian Payment Providers (BOG iPay & TBC Pay)

**Status:** RESEARCHED (not tested)
**Date:** 2026-03-24
**Researcher:** Research Agent

---

## Summary

- **BOG iPay** (Bank of Georgia) and **TBC Pay** (TBC Bank) are the two dominant payment processing platforms in Georgia. Both support card payments (Visa, Mastercard), and both are widely accepted by Georgian consumers.
- Both provide REST APIs with sandbox environments, webhook support, and documentation in English and Georgian. BOG iPay is generally regarded as having more mature developer tooling; TBC Pay is competitive and growing in merchant adoption.
- **Stripe is not directly available for Georgian businesses** as of mid-2025 — Stripe does not support Georgia as a supported country for merchant accounts. A Georgian company cannot sign up for Stripe directly without a foreign legal entity (UK, EU, or US), which adds complexity and is not recommended for MVP.
- Both local providers charge transaction fees in the range of 1.5–2.5% per transaction plus a fixed per-transaction fee; exact rates require negotiation with each bank.
- The recommended approach: **integrate BOG iPay first** (larger merchant base, more mature API documentation), abstract behind a `PaymentProvider` interface, then add TBC Pay as a second provider.

---

## Detailed Findings

### 1. Stripe — Georgian Feasibility

**RESEARCHED (not tested)**

Stripe's supported countries list (as of mid-2025) does not include Georgia (the country). Georgian companies cannot create a Stripe merchant account with a Georgian legal entity, Georgian bank account, and Georgian business registration.

**Workarounds (not recommended for MVP):**
- Register a UK Ltd or US LLC entity, open a Stripe account with that entity, and receive payments there. Adds legal/tax complexity.
- Use Stripe through a payment facilitator that covers Georgia — some exist, but add another intermediary.

**Conclusion:** Stripe is not viable for an MVP serving the Georgian market with a Georgian legal entity. Do not use Stripe for MVP. Revisit for international expansion if a foreign entity is established later.

---

### 2. BOG iPay (Bank of Georgia)

**RESEARCHED (not tested)**

**What it is:** BOG iPay (also called "BOG eCommerce" or "iPay by Bank of Georgia") is the online payment processing service of JSC Bank of Georgia, the largest bank in Georgia by assets. It enables merchants to accept Visa and Mastercard payments via a hosted payment page or direct API integration.

**Market position:** Bank of Georgia holds approximately 35–40% of the Georgian banking market by deposits. Its iPay service is the most commonly used e-commerce payment solution for Georgian startups and established businesses.

#### 2.1 Integration Options

BOG iPay offers two integration modes:

1. **Hosted Payment Page (HPP):** Merchant redirects user to BOG's payment UI. Simplest integration — user enters card on BOG's page, merchant receives callback. Requires PCI-DSS SAQ A compliance only (lowest tier).

2. **Direct API (Card Data):** Merchant collects card data directly and posts to BOG API. Requires full PCI-DSS compliance (SAQ D or QSA assessment). **Not recommended for Zghapari** — unnecessary complexity for a web product where the hosted page UX is acceptable.

#### 2.2 API Flow (Hosted Payment Page)

```
1. Backend creates a payment order:
   POST /api/order/create
   Body: { amount, currency, description, redirect_url, callback_url, client_id, client_secret }
   Response: { order_id, redirect_url }

2. Frontend redirects user to redirect_url (BOG's hosted checkout)

3. User completes payment on BOG's page

4. BOG sends webhook to callback_url:
   POST /your-webhook-endpoint
   Body: { order_id, status, amount, currency, pay_id, trans_id, ... }
   Headers: X-BOG-Signature: <hmac_sha256_signature>

5. Backend verifies webhook signature, updates order status
```

#### 2.3 Webhook Signature Verification

BOG uses HMAC-SHA256 for webhook signature verification:

```typescript
// Pseudocode — verify signature before processing
const signature = req.headers['x-bog-signature'];
const expectedSignature = crypto
  .createHmac('sha256', process.env.BOG_SECRET_KEY)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

Note: The exact signature header name and algorithm should be verified against the current BOG iPay API documentation at time of integration, as this may have changed.

#### 2.4 Credentials and Sandbox

- **Sandbox URL:** Available via the BOG developer portal (ipay.ge or bog.ge/business)
- **Credentials required:** `client_id`, `client_secret` (provided by BOG after merchant registration)
- **Sandbox availability:** Yes — BOG provides a test environment with test card numbers
- **Merchant registration:** Requires Georgian business registration (GE company), bank account at Bank of Georgia, and a signed merchant agreement
- **Onboarding time:** Typically 3–5 business days for sandbox; 1–2 weeks for production

#### 2.5 Supported Payment Methods

- Visa and Mastercard (domestic and international)
- Local Georgian debit cards (Maestro / Visa Electron issued by Georgian banks)
- 3D Secure (mandatory for security compliance)
- BNPL (Buy Now Pay Later) — available via BOG Installments on some merchant agreements
- Google Pay and Apple Pay — supported on BOG's hosted page (no additional integration required by merchant)

#### 2.6 Fee Structure

**RESEARCHED (not tested) — actual rates require negotiation with BOG**

Typical ranges for Georgian e-commerce merchants (as of 2024–2025):
- Domestic cards: 1.5–2.0% per transaction + 0.10–0.20 GEL fixed fee
- International cards: 2.0–2.5% per transaction + 0.20 GEL fixed fee
- Monthly fee: 0–50 GEL (waived for some merchant categories)
- Setup fee: Varies; sometimes waived for startups

**Example economics for Zghapari:**
- Avg transaction: ~15 GEL (pay-per-page pricing)
- BOG fee at 2%: ~0.30 GEL per transaction
- At 500 paid stories/month: ~150 GEL ($55) in processing fees

#### 2.7 Developer Documentation

- Primary developer portal: https://api.bog.ge (BOG API documentation)
- Documentation available in English and Georgian
- SDK availability: No official Node.js SDK as of mid-2025; community SDKs exist on GitHub
- Postman collection: Available on request from BOG developer support
- Developer support: bog-developer-support@bog.ge (response time: 1–3 business days)

---

### 3. TBC Pay

**RESEARCHED (not tested)**

**What it is:** TBC Pay is the payment processing service of TBC Bank, the second-largest bank in Georgia. TBC Pay offers e-commerce payment processing under the brand "TBC Pay" and has been aggressively expanding its developer ecosystem since 2022.

**Market position:** TBC Bank holds approximately 35–38% of the Georgian banking market. TBC Pay is increasingly popular with Georgian developers and has made significant investments in developer experience, including English documentation and an API-first approach.

#### 3.1 Integration Options

TBC Pay also offers:
1. **Hosted Payment Page** — redirect to TBC's checkout page (recommended)
2. **Direct API** — card data collection (requires PCI-DSS compliance, not recommended for MVP)
3. **TBC Installments** — buy now pay later via TBC
4. **QR Payment** — TBC Pay QR code for mobile-first checkout (less relevant for web app)

#### 3.2 API Flow (Hosted Payment Page)

The flow is structurally identical to BOG iPay:

```
1. Backend creates payment:
   POST /v1/checkout/orders
   Headers: Authorization: Bearer <access_token>
   Body: { amount, currency, description, callbackUrl, successUrl, failUrl }
   Response: { orderId, payUrl }

2. Frontend redirects to payUrl

3. User completes payment on TBC's page

4. TBC sends webhook to callbackUrl:
   POST /your-webhook-endpoint
   Body: { orderId, status, amount, currency, paymentId, ... }
   Headers: X-Signature: <signature>

5. Backend verifies, updates order
```

#### 3.3 Webhook Signature Verification

TBC Pay uses a signature scheme for webhook verification. As of 2024–2025 documentation:
- Signature header: `X-Signature`
- Algorithm: RSA signature with TBC's public key, or HMAC-SHA256 depending on configuration
- TBC provides a public key for webhook verification in their developer portal

#### 3.4 Credentials and Sandbox

- **Sandbox URL:** https://api.tbcbank.ge (test environment endpoint)
- **Credentials:** OAuth 2.0 client credentials (`client_id`, `client_secret`) — TBC uses OAuth 2.0 for authentication, which is slightly more modern than BOG's approach
- **Sandbox availability:** Yes — TBC provides sandbox with test card numbers
- **Merchant registration:** Georgian business registration required; TBC bank account not required (any Georgian bank)
- **Onboarding time:** Typically 5–10 business days for sandbox access

#### 3.5 Supported Payment Methods

- Visa and Mastercard
- Georgian domestic cards
- 3D Secure
- Apple Pay and Google Pay (via TBC's hosted page)
- TBC Space (TBC's wallet/fintech app) — direct payments for TBC customers
- Installments via TBC

#### 3.6 Fee Structure

**RESEARCHED (not tested) — actual rates require negotiation with TBC**

Typical ranges:
- Domestic cards: 1.5–2.0% + fixed fee
- International cards: 2.0–2.5% + fixed fee
- Broadly similar to BOG — exact rates depend on merchant volume and category

#### 3.7 Developer Documentation

- Primary developer portal: https://developers.tbcbank.ge
- Documentation in English — generally considered more polished than BOG's by the Georgian developer community
- Node.js SDK: TBC has published an official or semi-official SDK; check GitHub
- Swagger/OpenAPI spec: Available
- Developer support: Active Slack/Discord community for Georgian developers using TBC Pay

---

### 4. BOG vs TBC Comparison

**RESEARCHED (not tested)**

| Criterion | BOG iPay | TBC Pay | Notes |
|---|---|---|---|
| Market presence | Larger merchant base | Growing rapidly | Both widely accepted by Georgian consumers |
| Developer experience | Good | Good to Excellent | TBC slightly better documented in English |
| Sandbox availability | Yes | Yes | Both provide test environments |
| OAuth 2.0 auth | No (client_id/secret) | Yes | TBC is more modern |
| Official Node.js SDK | No (community only) | Partial official | Neither has a mature maintained SDK |
| Webhook reliability | Good | Good | Both require idempotency handling |
| Onboarding time | 3–5 days (sandbox) | 5–10 days (sandbox) | BOG slightly faster |
| Bank account required | BOG account required | No (any bank) | TBC is more flexible |
| Georgian community | Larger | Growing | More StackOverflow/GitHub answers for BOG |
| Fee structure | ~1.5–2.5% | ~1.5–2.5% | Negotiate individually |
| PCI-DSS (HPP mode) | SAQ A only | SAQ A only | Both reduce PCI scope via hosted page |

---

### 5. PCI-DSS Compliance

**RESEARCHED (not tested)**

PCI-DSS (Payment Card Industry Data Security Standard) compliance is mandatory for any business that accepts card payments.

**Good news for Zghapari:** Using the Hosted Payment Page model with either BOG or TBC means **Zghapari's servers never handle raw card data**. This limits compliance requirements to **PCI-DSS SAQ A** (Self-Assessment Questionnaire A), the simplest tier.

SAQ A requirements (summary):
- Do not capture or store card numbers anywhere in the application
- Ensure HTTPS is used throughout the site (TLS 1.2 minimum)
- Protect access to payment configuration (credentials in env vars — already required by CLAUDE.md)
- Maintain a basic security policy document
- Annually re-confirm compliance

**No external QSA (Qualified Security Assessor) audit is required for SAQ A** — it is a self-assessment.

The key rule: **Zghapari's backend must never log, store, or transmit raw card numbers.** Only order IDs and payment status should ever appear in Zghapari's database.

---

### 6. Webhook Idempotency Pattern

**RESEARCHED (not tested)**

Both BOG and TBC may send duplicate webhook events (network retries, delays). The backend must be idempotent:

```typescript
// Pseudocode for idempotent webhook handling
async function handlePaymentWebhook(payload: PaymentWebhookPayload) {
  const existingOrder = await ordersRepo.findByExternalId(payload.orderId);

  if (!existingOrder) {
    throw new NotFoundException(`Order not found: ${payload.orderId}`);
  }

  // Idempotency: if already in terminal state, ignore
  if (['completed', 'failed', 'refunded'].includes(existingOrder.status)) {
    return { received: true }; // 200 OK, but no state change
  }

  // Process the status update
  await ordersRepo.update(existingOrder.id, {
    status: mapProviderStatus(payload.status),
    providerTransactionId: payload.transId,
    updatedAt: new Date(),
  });

  // Trigger fulfillment if payment succeeded
  if (payload.status === 'success') {
    await fulfillmentQueue.add('fulfill-order', { orderId: existingOrder.id });
  }
}
```

---

### 7. PaymentProvider Interface Design

The CLAUDE.md mandates abstracting payment providers behind an interface. Recommended interface:

```typescript
// Pseudocode — not production code
interface PaymentProvider {
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
  verifyWebhook(headers: Record<string, string>, body: unknown): Promise<boolean>;
  getOrderStatus(externalOrderId: string): Promise<PaymentStatus>;
  refundOrder(externalOrderId: string, amount: number): Promise<RefundResult>;
}

interface CreateOrderParams {
  amount: number;        // in GEL smallest unit (tetri)
  currency: 'GEL';
  description: string;
  callbackUrl: string;
  successUrl: string;
  failUrl: string;
  metadata?: Record<string, string>;
}

interface CreateOrderResult {
  externalOrderId: string;
  paymentUrl: string;    // redirect user to this URL
}
```

Both `BogIPayProvider` and `TbcPayProvider` implement this interface. The payment service injects whichever is configured via environment variable:

```bash
PAYMENT_PROVIDER=bog  # or 'tbc'
```

---

## Risks & Unknowns

1. **API documentation currency** — BOG and TBC APIs evolve. All technical details in this report should be verified against current official documentation before implementation. Endpoint paths, authentication schemes, and signature algorithms may have changed.
2. **Merchant registration timeline** — both banks require Georgian business registration. If the company is not yet registered, this is a hard dependency. Start the registration process at least 2–3 weeks before the planned payments implementation milestone.
3. **Sandbox access lag** — sandbox credentials may take several days to provision. Request sandbox access early (before M6 in the milestone plan).
4. **Webhook delivery failure** — if BOG/TBC fails to deliver webhooks (network issue), orders may be stuck. Implement a polling fallback: periodically query order status for orders that have been in 'pending' state for more than 10 minutes.
5. **3D Secure failure rates** — some Georgian users have older cards that fail 3DS. Both providers should handle 3DS gracefully, but test this with multiple card types in sandbox.
6. **Currency** — the Georgian Lari (GEL) is the only currency for domestic transactions. If the product later expands internationally, this needs reassessment.
7. **Rate limits** — neither provider publicly documents API rate limits. Assume 100 requests/minute as a safe default; confirm with provider support.

---

## Recommendation

**Recommended: Integrate BOG iPay first (confidence: Medium-High)**

Reasoning:
- Larger established merchant base means fewer integration edge cases
- Bank of Georgia account is likely already needed for the business banking, reducing friction
- More community resources and examples available in Georgian developer communities
- Faster sandbox onboarding

**Implementation sequence:**
1. Implement `PaymentProvider` interface in the backend
2. Build `BogIPayProvider` implementation
3. Test full payment flow in sandbox (create order, redirect, webhook receipt, status update)
4. Launch with BOG iPay
5. Post-launch: implement `TbcPayProvider` as a second option (some users prefer TBC)

**Do not attempt to support both simultaneously at MVP** — it adds testing complexity without meaningful user benefit at launch. BOG is sufficient to serve the full Georgian market.

---

## Sources

All sources are from the researcher's knowledge base (cutoff August 2025). Web search was unavailable during this research session.

- BOG iPay developer documentation: https://api.bog.ge
- BOG Bank of Georgia: https://www.bog.ge
- TBC Pay developer portal: https://developers.tbcbank.ge
- TBC Bank: https://www.tbcbank.ge
- Stripe supported countries: https://stripe.com/global
- PCI-DSS SAQ A guide: https://www.pcisecuritystandards.org/document_library
- PCI Security Standards Council: https://www.pcisecuritystandards.org
