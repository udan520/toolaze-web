import { grantCredits } from './credits.mjs';

const DEFAULT_CREEM_API_BASE_URL = 'https://api.creem.io';
const CREDIT_VALIDITY_DAYS = 365;

const CREDIT_PURCHASE_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$1.99',
    credits: 200,
    productEnvKey: 'CREEM_STARTER_PRODUCT_ID',
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '$8.99',
    credits: 1000,
    productEnvKey: 'CREEM_CREATOR_PRODUCT_ID',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$39.99',
    credits: 5000,
    productEnvKey: 'CREEM_PLUS_PRODUCT_ID',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$69.99',
    credits: 10000,
    productEnvKey: 'CREEM_STUDIO_PRODUCT_ID',
  },
  {
    id: 'max',
    name: 'Max',
    price: '$179.99',
    credits: 30000,
    productEnvKey: 'CREEM_MAX_PRODUCT_ID',
  },
  {
    id: 'business',
    name: 'Business',
    price: '$249.99',
    credits: 50000,
    productEnvKey: 'CREEM_BUSINESS_PRODUCT_ID',
  },
];

function getCreemApiKey(env) {
  return String(env.CREEM_PAYMENT_API_KEY || env.CREEM_API_KEY || '').trim();
}

function getCheckoutApiBaseUrl(env) {
  return String(
    env.CREEM_CHECKOUT_API_BASE_URL
      || env.CREEM_PAYMENTS_API_BASE_URL
      || env.CREEM_API_BASE_URL
      || DEFAULT_CREEM_API_BASE_URL
  ).replace(/\/+$/, '');
}

function getSiteUrl(env, requestUrl) {
  const configured = String(
    env.CREEM_CHECKOUT_SITE_URL
      || env.CHECKOUT_SITE_URL
      || env.SITE_URL
      || env.NEXT_PUBLIC_SITE_URL
      || ''
  ).trim();
  if (configured) return configured.replace(/\/+$/, '');
  return new URL(requestUrl).origin.replace(/\/+$/, '');
}

function createCheckoutRequestId(planId, userId) {
  const safeUserId = String(userId || 'user').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `toolaze_${planId}_${safeUserId}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function getOneYearExpiryIso(now = new Date()) {
  const expiresAt = new Date(now.getTime());
  expiresAt.setUTCDate(expiresAt.getUTCDate() + CREDIT_VALIDITY_DAYS);
  return expiresAt.toISOString();
}

function normalizeMetadataValue(value) {
  if (value == null) return '';
  return String(value).trim();
}

function readObjectId(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return String(value.id || '').trim();
  return '';
}

function readCheckoutObject(event) {
  return event?.object && typeof event.object === 'object' ? event.object : {};
}

function readCheckoutProductId(checkout) {
  return readObjectId(checkout.product)
    || readObjectId(checkout.product_id)
    || readObjectId(checkout.order?.product)
    || readObjectId(checkout.order?.product_id);
}

function readCheckoutOrderId(checkout) {
  return readObjectId(checkout.order) || readObjectId(checkout.order_id) || readObjectId(checkout.id);
}

function readCheckoutTransactionId(checkout) {
  return readObjectId(checkout.transaction)
    || readObjectId(checkout.transaction_id)
    || readObjectId(checkout.order?.transaction)
    || readObjectId(checkout.order?.transaction_id);
}

function readCheckoutStatus(checkout) {
  return String(checkout.status || checkout.payment_status || '').trim().toLowerCase();
}

function readRetrievedCheckout(payload) {
  if (payload?.checkout && typeof payload.checkout === 'object') return payload.checkout;
  if (payload?.object && typeof payload.object === 'object') return payload.object;
  return payload && typeof payload === 'object' ? payload : {};
}

function readRetrievedTransaction(payload) {
  if (payload?.transaction && typeof payload.transaction === 'object') return payload.transaction;
  if (payload?.object && typeof payload.object === 'object') return payload.object;
  return payload && typeof payload === 'object' ? payload : {};
}

async function fetchCreemTransaction(env, transactionId) {
  const apiKey = getCreemApiKey(env);
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      body: { error: 'Creem transaction API key is not configured.' },
    };
  }

  const url = new URL('/v1/transactions', `${getCheckoutApiBaseUrl(env)}/`);
  url.searchParams.set('transaction_id', transactionId);
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const upstreamError = payload?.error || payload?.message || 'Creem transaction could not be retrieved.';
    const isAuthorizationError = response.status === 401 || response.status === 403;
    return {
      ok: false,
      status: isAuthorizationError ? 502 : response.status,
      body: {
        error: isAuthorizationError
          ? 'Creem checkout authorization failed. Check CREEM_PAYMENT_API_KEY for the selected checkout environment.'
          : upstreamError,
      },
    };
  }

  return {
    ok: true,
    transaction: readRetrievedTransaction(payload),
  };
}

async function verifyCheckoutPaymentPaid({ env, checkout }) {
  const transactionId = readCheckoutTransactionId(checkout);
  if (!transactionId) return { ok: true };

  const transactionResult = await fetchCreemTransaction(env, transactionId);
  if (!transactionResult.ok) {
    return transactionResult;
  }

  const transactionStatus = readCheckoutStatus(transactionResult.transaction);
  if (transactionStatus !== 'paid') {
    return {
      ok: false,
      status: 409,
      body: {
        error: 'Creem payment is not paid yet.',
        transactionStatus: transactionStatus || null,
      },
    };
  }

  return { ok: true, transactionStatus };
}

export function resolveCreditPurchasePlan(planId, env) {
  const id = String(planId || '').trim().toLowerCase();
  const plan = CREDIT_PURCHASE_PLANS.find((item) => item.id === id);
  if (!plan) {
    throw new Error('Unsupported credit purchase plan.');
  }

  const productId = String(env?.[plan.productEnvKey] || '').trim();
  if (!productId) {
    throw new Error(`${plan.productEnvKey} is not configured.`);
  }

  return {
    ...plan,
    productId,
  };
}

async function grantCompletedCheckoutCredits({
  env,
  checkout,
  eventId = null,
  eventType,
  expectedUserId = '',
  grantCreditsFn,
}) {
  const metadata = checkout.metadata && typeof checkout.metadata === 'object' ? checkout.metadata : {};
  const plan = resolveCreditPurchasePlan(metadata.planId, env);
  const productId = readCheckoutProductId(checkout);

  if (productId !== plan.productId) {
    return {
      ok: false,
      status: 400,
      body: { error: 'Creem product does not match the requested credit plan.' },
    };
  }

  const userId = normalizeMetadataValue(metadata.userId);
  if (!userId) {
    return {
      ok: false,
      status: 400,
      body: { error: 'Creem checkout metadata is missing userId.' },
    };
  }

  if (expectedUserId && userId !== expectedUserId) {
    return {
      ok: false,
      status: 403,
      body: { error: 'Creem checkout does not belong to the signed-in user.' },
    };
  }

  const metadataCredits = Number(normalizeMetadataValue(metadata.credits));
  if (metadataCredits !== plan.credits) {
    return {
      ok: false,
      status: 400,
      body: { error: 'Creem checkout metadata credits do not match the plan.' },
    };
  }

  const payment = await verifyCheckoutPaymentPaid({ env, checkout });
  if (!payment.ok) return { ok: false, status: payment.status, body: payment.body };

  const orderId = readCheckoutOrderId(checkout);
  const requestId = orderId ? `creem_order:${orderId}` : `creem_checkout:${checkout.id}`;
  const grant = await grantCreditsFn(env, userId, plan.credits, {
    requestId,
    reason: 'credit_purchase',
    transactionType: 'purchase',
    description: `${plan.name} Credit Purchase`,
    expiresAt: getOneYearExpiryIso(),
    metadata: {
      creemEventId: eventId,
      creemEventType: eventType,
      creemCheckoutId: checkout.id || null,
      creemOrderId: orderId || null,
      creemProductId: productId,
      planId: plan.id,
      price: plan.price,
    },
  });

  return {
    ok: true,
    plan,
    grant,
    userId,
    checkoutId: checkout.id || null,
    orderId,
  };
}

export async function createCreditCheckout({
  env,
  requestUrl,
  planId,
  user,
}) {
  if (!user?.id) {
    return {
      ok: false,
      status: 401,
      body: { error: 'Please sign in with Google before buying credits.' },
    };
  }

  const apiKey = getCreemApiKey(env);
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      body: { error: 'Creem checkout API key is not configured.' },
    };
  }

  let plan;
  try {
    plan = resolveCreditPurchasePlan(planId, env);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Credit purchase plan is not configured.';
    return {
      ok: false,
      status: message === 'Unsupported credit purchase plan.' ? 400 : 503,
      body: { error: message },
    };
  }

  const siteUrl = getSiteUrl(env, requestUrl);
  const requestId = createCheckoutRequestId(plan.id, user.id);
  const body = {
    product_id: plan.productId,
    request_id: requestId,
    units: 1,
    success_url: `${siteUrl}/pricing?checkout=success`,
    metadata: {
      userId: user.id,
      planId: plan.id,
      credits: String(plan.credits),
      requestId,
    },
  };

  if (user.email) {
    body.customer = { email: user.email };
  }

  const response = await fetch(`${getCheckoutApiBaseUrl(env)}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const upstreamError = payload?.error || payload?.message || 'Creem checkout could not be created.';
    const isAuthorizationError = response.status === 401 || response.status === 403;

    return {
      ok: false,
      status: isAuthorizationError ? 502 : response.status,
      body: {
        error: isAuthorizationError
          ? 'Creem checkout authorization failed. Check CREEM_PAYMENT_API_KEY for the selected checkout environment.'
          : upstreamError,
      },
    };
  }

  const checkoutUrl = payload.checkout_url || payload.checkoutUrl;
  if (!checkoutUrl) {
    return {
      ok: false,
      status: 502,
      body: { error: 'Creem checkout response is missing checkout_url.' },
    };
  }

  return {
    ok: true,
    status: 200,
    checkoutUrl,
    checkoutId: payload.id,
    requestId,
    plan,
  };
}

export async function confirmCreditCheckout({
  env,
  checkoutId,
  user,
  grantCreditsFn = grantCredits,
}) {
  if (!user?.id) {
    return {
      status: 401,
      body: { error: 'Please sign in with Google before confirming credits.' },
    };
  }

  const normalizedCheckoutId = normalizeMetadataValue(checkoutId);
  if (!normalizedCheckoutId) {
    return {
      status: 400,
      body: { error: 'Creem checkout id is required.' },
    };
  }

  const apiKey = getCreemApiKey(env);
  if (!apiKey) {
    return {
      status: 503,
      body: { error: 'Creem checkout API key is not configured.' },
    };
  }

  const url = new URL('/v1/checkouts', `${getCheckoutApiBaseUrl(env)}/`);
  url.searchParams.set('checkout_id', normalizedCheckoutId);
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const upstreamError = payload?.error || payload?.message || 'Creem checkout could not be retrieved.';
    const isAuthorizationError = response.status === 401 || response.status === 403;
    return {
      status: isAuthorizationError ? 502 : response.status,
      body: {
        error: isAuthorizationError
          ? 'Creem checkout authorization failed. Check CREEM_PAYMENT_API_KEY for the selected checkout environment.'
          : upstreamError,
      },
    };
  }

  const checkout = readRetrievedCheckout(payload);
  const status = readCheckoutStatus(checkout);
  if (status !== 'completed') {
    return {
      status: 409,
      body: { error: 'Creem checkout is not completed yet.', checkoutStatus: status || null },
    };
  }

  const result = await grantCompletedCheckoutCredits({
    env,
    checkout,
    eventType: 'checkout.confirmed',
    expectedUserId: user.id,
    grantCreditsFn,
  });

  if (!result.ok) return { status: result.status, body: result.body };

  return {
    status: 200,
    body: {
      ok: true,
      checkoutId: result.checkoutId,
      plan: {
        id: result.plan.id,
        name: result.plan.name,
        credits: result.plan.credits,
      },
      credits: {
        balance: result.grant.balance,
        added: result.plan.credits,
        duplicate: Boolean(result.grant.duplicate),
      },
    },
  };
}

export async function verifyCreemWebhookSignature(rawBody, signature, secret) {
  const normalizedSignature = String(signature || '').replace(/\s+/g, '').trim().toLowerCase();
  const normalizedSecret = String(secret || '').trim();
  if (!rawBody || !normalizedSignature || !normalizedSecret) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalizedSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const computed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const computedSignature = Array.from(new Uint8Array(computed))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return timingSafeEqualHex(computedSignature, normalizedSignature);
}

function timingSafeEqualHex(left, right) {
  if (!/^[a-f0-9]+$/.test(left) || !/^[a-f0-9]+$/.test(right)) return false;
  if (left.length !== right.length) return false;

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

export async function handleCreemWebhook({
  env,
  rawBody,
  signature,
  grantCreditsFn = grantCredits,
}) {
  const webhookSecret = String(env.CREEM_WEBHOOK_SECRET || '').trim();
  if (!webhookSecret) {
    return {
      status: 503,
      body: { error: 'Creem webhook secret is not configured.' },
    };
  }

  const verified = await verifyCreemWebhookSignature(rawBody, signature, webhookSecret);
  if (!verified) {
    return {
      status: 401,
      body: { error: 'Invalid Creem webhook signature.' },
    };
  }

  const event = JSON.parse(rawBody);
  const eventType = String(event.eventType || event.type || '').trim();
  if (eventType !== 'checkout.completed') {
    return {
      status: 200,
      body: { ok: true, handled: false, eventType },
    };
  }

  const checkout = readCheckoutObject(event);
  const result = await grantCompletedCheckoutCredits({
    env,
    checkout,
    eventId: event.id || null,
    eventType,
    grantCreditsFn,
  });
  if (!result.ok) return { status: result.status, body: result.body };

  return {
    status: 200,
    body: { ok: true, handled: true, eventType },
  };
}
