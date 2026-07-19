import assert from 'node:assert/strict';
import test from 'node:test';
import {
  confirmCreditCheckout,
  createCreditCheckout,
  handleCreemWebhook,
  resolveCreditPurchasePlan,
  verifyCreemWebhookSignature,
} from './creem-payments.mjs';

const STARTER_PRODUCT_ID = 'prod_5v51HXy6lkdreHTL8MHaA1';
const CREATOR_PRODUCT_ID = 'prod_ffSemtcIFcv2O1n8pQ0SZ';
const PLUS_PRODUCT_ID = 'prod_5HtkfYOxvsZcDRG075JjC0';
const STUDIO_PRODUCT_ID = 'prod_6iyCHMBJCLIvbOpaGcECXG';
const MAX_PRODUCT_ID = 'prod_anZZAJAeGjWOwSIvoB3C6';
const BUSINESS_PRODUCT_ID = 'prod_70nrQxTprKoF3ZwIdTqdjX';

test('resolves the starter Creem product as the 200 credit plan', () => {
  const plan = resolveCreditPurchasePlan('starter', {
    CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
  });

  assert.equal(plan.id, 'starter');
  assert.equal(plan.name, 'Starter');
  assert.equal(plan.credits, 200);
  assert.equal(plan.price, '$1.99');
  assert.equal(plan.productId, STARTER_PRODUCT_ID);
});

test('resolves the creator Creem product as the 1000 credit plan', () => {
  const plan = resolveCreditPurchasePlan('creator', {
    CREEM_CREATOR_PRODUCT_ID: CREATOR_PRODUCT_ID,
  });

  assert.equal(plan.id, 'creator');
  assert.equal(plan.name, 'Creator');
  assert.equal(plan.credits, 1000);
  assert.equal(plan.price, '$8.99');
  assert.equal(plan.productId, CREATOR_PRODUCT_ID);
});

test('resolves every live Creem credit purchase plan', () => {
  const env = {
    CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
    CREEM_CREATOR_PRODUCT_ID: CREATOR_PRODUCT_ID,
    CREEM_PLUS_PRODUCT_ID: PLUS_PRODUCT_ID,
    CREEM_STUDIO_PRODUCT_ID: STUDIO_PRODUCT_ID,
    CREEM_MAX_PRODUCT_ID: MAX_PRODUCT_ID,
    CREEM_BUSINESS_PRODUCT_ID: BUSINESS_PRODUCT_ID,
  };

  assert.deepEqual(
    ['starter', 'creator', 'plus', 'studio', 'max', 'business'].map((planId) => {
      const plan = resolveCreditPurchasePlan(planId, env);
      return [plan.id, plan.name, plan.price, plan.credits, plan.productId];
    }),
    [
      ['starter', 'Starter', '$1.99', 200, STARTER_PRODUCT_ID],
      ['creator', 'Creator', '$8.99', 1000, CREATOR_PRODUCT_ID],
      ['plus', 'Plus', '$39.99', 5000, PLUS_PRODUCT_ID],
      ['studio', 'Studio', '$69.99', 10000, STUDIO_PRODUCT_ID],
      ['max', 'Max', '$179.99', 30000, MAX_PRODUCT_ID],
      ['business', 'Business', '$249.99', 50000, BUSINESS_PRODUCT_ID],
    ],
  );
});

test('creates a Creem test checkout for the signed-in starter purchase', async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl = '';
  let requestBody = null;
  let requestHeaders = null;

  globalThis.fetch = async (url, init) => {
    requestUrl = String(url);
    requestHeaders = init.headers;
    requestBody = JSON.parse(String(init.body));
    return Response.json({
      id: 'ch_test_123',
      checkout_url: 'https://www.creem.io/test/payment/ch_test_123',
      product_id: STARTER_PRODUCT_ID,
      status: 'pending',
    });
  };

  try {
    const checkout = await createCreditCheckout({
      env: {
        CREEM_API_KEY: 'creem-test-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
        SITE_URL: 'https://toolaze.com',
      },
      requestUrl: 'https://toolaze.com/api/billing/checkout',
      planId: 'starter',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
    });

    assert.equal(requestUrl, 'https://test-api.creem.io/v1/checkouts');
    assert.equal(requestHeaders['x-api-key'], 'creem-test-key');
    assert.equal(requestBody.product_id, STARTER_PRODUCT_ID);
    assert.equal(requestBody.units, 1);
    assert.equal(requestBody.customer.email, 'buyer@example.com');
    assert.equal(requestBody.metadata.userId, 'user_123');
    assert.equal(requestBody.metadata.planId, 'starter');
    assert.equal(requestBody.metadata.credits, '200');
    assert.match(requestBody.request_id, /^toolaze_starter_user_123_/);
    assert.equal(requestBody.success_url, 'https://toolaze.com/pricing?checkout=success');
    assert.equal(checkout.checkoutUrl, 'https://www.creem.io/test/payment/ch_test_123');
    assert.equal(checkout.plan.credits, 200);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('creates a Creem test checkout for the signed-in creator purchase', async () => {
  const originalFetch = globalThis.fetch;
  let requestBody = null;

  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init.body));
    return Response.json({
      id: 'ch_test_creator',
      checkout_url: 'https://www.creem.io/test/payment/ch_test_creator',
      product_id: CREATOR_PRODUCT_ID,
      status: 'pending',
    });
  };

  try {
    const checkout = await createCreditCheckout({
      env: {
        CREEM_PAYMENT_API_KEY: 'creem-payment-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_CREATOR_PRODUCT_ID: CREATOR_PRODUCT_ID,
        SITE_URL: 'https://toolaze.com',
      },
      requestUrl: 'https://toolaze.com/api/billing/checkout',
      planId: 'creator',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
    });

    assert.equal(requestBody.product_id, CREATOR_PRODUCT_ID);
    assert.equal(requestBody.metadata.planId, 'creator');
    assert.equal(requestBody.metadata.credits, '1000');
    assert.match(requestBody.request_id, /^toolaze_creator_user_123_/);
    assert.equal(checkout.checkoutUrl, 'https://www.creem.io/test/payment/ch_test_creator');
    assert.equal(checkout.plan.credits, 1000);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('checkout success URL prefers the dedicated checkout site URL', async () => {
  const originalFetch = globalThis.fetch;
  let requestBody = null;

  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init.body));
    return Response.json({
      id: 'ch_test_checkout_site',
      checkout_url: 'https://www.creem.io/payment/ch_test_checkout_site',
      product_id: STARTER_PRODUCT_ID,
      status: 'pending',
    });
  };

  try {
    await createCreditCheckout({
      env: {
        CREEM_PAYMENT_API_KEY: 'creem-payment-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
        CREEM_CHECKOUT_SITE_URL: 'https://toolaze.com/',
        SITE_URL: 'https://creem-preview.toolaze-web.pages.dev',
      },
      requestUrl: 'https://creem-preview.toolaze-web.pages.dev/api/billing/checkout',
      planId: 'starter',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
    });

    assert.equal(requestBody.success_url, 'https://toolaze.com/pricing?checkout=success');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('checkout uses the payment-specific Creem key before the shared moderation key', async () => {
  const originalFetch = globalThis.fetch;
  let requestHeaders = null;

  globalThis.fetch = async (_url, init) => {
    requestHeaders = init.headers;
    return Response.json({
      id: 'ch_test_123',
      checkout_url: 'https://www.creem.io/test/payment/ch_test_123',
    });
  };

  try {
    await createCreditCheckout({
      env: {
        CREEM_API_KEY: 'creem-moderation-key',
        CREEM_PAYMENT_API_KEY: 'creem-payment-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
      },
      requestUrl: 'https://toolaze.com/api/billing/checkout',
      planId: 'starter',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
    });

    assert.equal(requestHeaders['x-api-key'], 'creem-payment-key');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('checkout creation returns a JSON error when the starter product id is missing', async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return Response.json({});
  };

  try {
    const checkout = await createCreditCheckout({
      env: {
        CREEM_API_KEY: 'creem-test-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
      },
      requestUrl: 'https://toolaze.com/api/billing/checkout',
      planId: 'starter',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
    });

    assert.equal(checkout.ok, false);
    assert.equal(checkout.status, 503);
    assert.equal(checkout.body.error, 'CREEM_STARTER_PRODUCT_ID is not configured.');
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('checkout maps upstream Creem authorization errors to a gateway error', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => Response.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const checkout = await createCreditCheckout({
      env: {
        CREEM_API_KEY: 'wrong-creem-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
      },
      requestUrl: 'https://toolaze.com/api/billing/checkout',
      planId: 'starter',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
    });

    assert.equal(checkout.ok, false);
    assert.equal(checkout.status, 502);
    assert.equal(checkout.body.error, 'Creem checkout authorization failed. Check CREEM_PAYMENT_API_KEY for the selected checkout environment.');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('verifies Creem webhook signatures with the raw request body', async () => {
  const secret = 'whsec_test_secret';
  const rawBody = '{"eventType":"checkout.completed"}';
  const signature = await createTestSignature(rawBody, secret);

  assert.equal(await verifyCreemWebhookSignature(rawBody, signature, secret), true);
  assert.equal(await verifyCreemWebhookSignature(rawBody, 'bad-signature', secret), false);
});

test('completed starter checkout grants 200 credits with a stable idempotency key', async () => {
  const grants = [];
  const rawBody = JSON.stringify({
    id: 'evt_123',
    eventType: 'checkout.completed',
    object: {
      id: 'ch_test_123',
      order: { id: 'ord_test_123' },
      product: { id: STARTER_PRODUCT_ID },
      metadata: {
        userId: 'user_123',
        planId: 'starter',
        credits: '200',
      },
    },
  });
  const secret = 'whsec_test_secret';
  const signature = await createTestSignature(rawBody, secret);
  const env = {
    CREEM_WEBHOOK_SECRET: secret,
    CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
  };
  const grantCreditsFn = async (_env, userId, amount, options) => {
    grants.push({ userId, amount, options });
    return { ok: true, balance: 200, amount, duplicate: grants.length > 1 };
  };

  const first = await handleCreemWebhook({
    env,
    rawBody,
    signature,
    grantCreditsFn,
  });
  const second = await handleCreemWebhook({
    env,
    rawBody,
    signature,
    grantCreditsFn,
  });

  assert.equal(first.status, 200);
  assert.deepEqual(first.body, { ok: true, handled: true, eventType: 'checkout.completed' });
  assert.equal(second.status, 200);
  assert.equal(grants.length, 2);
  assert.deepEqual(grants.map((grant) => grant.amount), [200, 200]);
  assert.equal(grants[0].userId, 'user_123');
  assert.equal(grants[0].options.requestId, 'creem_order:ord_test_123');
  assert.equal(grants[0].options.reason, 'credit_purchase');
  assert.equal(grants[0].options.transactionType, 'purchase');
  assert.equal(grants[0].options.description, 'Starter Credit Purchase');
  assert.match(grants[0].options.expiresAt, /^\d{4}-\d{2}-\d{2}T/);
});

test('completed creator checkout grants 1000 credits with the creator product id', async () => {
  const grants = [];
  const rawBody = JSON.stringify({
    id: 'evt_creator',
    eventType: 'checkout.completed',
    object: {
      id: 'ch_test_creator',
      order: { id: 'ord_test_creator' },
      product: { id: CREATOR_PRODUCT_ID },
      metadata: {
        userId: 'user_123',
        planId: 'creator',
        credits: '1000',
      },
    },
  });
  const secret = 'whsec_test_secret';
  const signature = await createTestSignature(rawBody, secret);
  const env = {
    CREEM_WEBHOOK_SECRET: secret,
    CREEM_CREATOR_PRODUCT_ID: CREATOR_PRODUCT_ID,
  };
  const grantCreditsFn = async (_env, userId, amount, options) => {
    grants.push({ userId, amount, options });
    return { ok: true, balance: 1000, amount, duplicate: false };
  };

  const result = await handleCreemWebhook({
    env,
    rawBody,
    signature,
    grantCreditsFn,
  });

  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { ok: true, handled: true, eventType: 'checkout.completed' });
  assert.equal(grants.length, 1);
  assert.equal(grants[0].amount, 1000);
  assert.equal(grants[0].options.description, 'Creator Credit Purchase');
  assert.equal(grants[0].options.metadata.creemProductId, CREATOR_PRODUCT_ID);
});

test('completed checkout accepts product id from the order object', async () => {
  const grants = [];
  const rawBody = JSON.stringify({
    id: 'evt_order_product',
    eventType: 'checkout.completed',
    object: {
      id: 'ch_order_product',
      order: {
        id: 'ord_order_product',
        product: STARTER_PRODUCT_ID,
      },
      metadata: {
        userId: 'user_123',
        planId: 'starter',
        credits: '200',
      },
    },
  });
  const secret = 'whsec_test_secret';
  const signature = await createTestSignature(rawBody, secret);

  const result = await handleCreemWebhook({
    env: {
      CREEM_WEBHOOK_SECRET: secret,
      CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
    },
    rawBody,
    signature,
    grantCreditsFn: async (_env, userId, amount, options) => {
      grants.push({ userId, amount, options });
      return { ok: true, balance: 200, amount, duplicate: false };
    },
  });

  assert.equal(result.status, 200);
  assert.equal(grants.length, 1);
  assert.equal(grants[0].options.metadata.creemProductId, STARTER_PRODUCT_ID);
});

test('success return confirmation retrieves the completed checkout and grants credits once', async () => {
  const originalFetch = globalThis.fetch;
  const grants = [];
  let requestUrl = '';
  let requestHeaders = null;

  globalThis.fetch = async (url, init) => {
    requestUrl = String(url);
    requestHeaders = init.headers;
    return Response.json({
      id: 'ch_test_123',
      status: 'completed',
      order: { id: 'ord_test_123' },
      product: STARTER_PRODUCT_ID,
      metadata: {
        userId: 'user_123',
        planId: 'starter',
        credits: '200',
      },
    });
  };

  try {
    const result = await confirmCreditCheckout({
      env: {
        CREEM_PAYMENT_API_KEY: 'creem-payment-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
      },
      checkoutId: 'ch_test_123',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
      grantCreditsFn: async (_env, userId, amount, options) => {
        grants.push({ userId, amount, options });
        return { ok: true, balance: 210, amount, duplicate: false };
      },
    });

    assert.equal(requestUrl, 'https://test-api.creem.io/v1/checkouts?checkout_id=ch_test_123');
    assert.equal(requestHeaders['x-api-key'], 'creem-payment-key');
    assert.equal(result.status, 200);
    assert.equal(result.body.credits.balance, 210);
    assert.equal(result.body.credits.added, 200);
    assert.equal(grants.length, 1);
    assert.equal(grants[0].userId, 'user_123');
    assert.equal(grants[0].amount, 200);
    assert.equal(grants[0].options.requestId, 'creem_order:ord_test_123');
    assert.equal(grants[0].options.transactionType, 'purchase');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('success return confirmation rejects completed checkout when the Creem transaction is not paid', async () => {
  const originalFetch = globalThis.fetch;
  const grants = [];
  const requestUrls = [];

  globalThis.fetch = async (url) => {
    requestUrls.push(String(url));
    if (requestUrls.length === 1) {
      return Response.json({
        id: 'ch_test_declined',
        status: 'completed',
        order: { id: 'ord_test_declined', transaction: 'tx_declined' },
        product: STARTER_PRODUCT_ID,
        metadata: {
          userId: 'user_123',
          planId: 'starter',
          credits: '200',
        },
      });
    }

    return Response.json({
      id: 'tx_declined',
      status: 'declined',
    });
  };

  try {
    const result = await confirmCreditCheckout({
      env: {
        CREEM_PAYMENT_API_KEY: 'creem-payment-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
      },
      checkoutId: 'ch_test_declined',
      user: {
        id: 'user_123',
        email: 'buyer@example.com',
      },
      grantCreditsFn: async (_env, userId, amount, options) => {
        grants.push({ userId, amount, options });
        return { ok: true, balance: 210, amount, duplicate: false };
      },
    });

    assert.equal(requestUrls[0], 'https://test-api.creem.io/v1/checkouts?checkout_id=ch_test_declined');
    assert.equal(requestUrls[1], 'https://test-api.creem.io/v1/transactions?transaction_id=tx_declined');
    assert.equal(result.status, 409);
    assert.match(result.body.error, /payment is not paid/i);
    assert.equal(result.body.transactionStatus, 'declined');
    assert.equal(grants.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('success return confirmation rejects checkouts owned by another user', async () => {
  const originalFetch = globalThis.fetch;
  let grantCalled = false;

  globalThis.fetch = async () => Response.json({
    id: 'ch_test_123',
    status: 'completed',
    product: STARTER_PRODUCT_ID,
    metadata: {
      userId: 'user_other',
      planId: 'starter',
      credits: '200',
    },
  });

  try {
    const result = await confirmCreditCheckout({
      env: {
        CREEM_API_KEY: 'creem-test-key',
        CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
        CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
      },
      checkoutId: 'ch_test_123',
      user: { id: 'user_123' },
      grantCreditsFn: async () => {
        grantCalled = true;
      },
    });

    assert.equal(result.status, 403);
    assert.match(result.body.error, /does not belong/i);
    assert.equal(grantCalled, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

async function createTestSignature(rawBody, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
