import assert from 'node:assert/strict';
import test from 'node:test';
import { sha256Hex } from '../../_shared/crypto.mjs';
import { onRequest } from './checkout.js';

const STARTER_PRODUCT_ID = 'prod_4GeFDXFa2HtXjHGnEksTzJ';
const CREATOR_PRODUCT_ID = 'prod_5mvC7CdxTAkBW250SUY1Up';

test('signed-in user can create a starter Creem checkout', async () => {
  const originalFetch = globalThis.fetch;
  let checkoutBody = null;
  globalThis.fetch = async (_url, init) => {
    checkoutBody = JSON.parse(String(init.body));
    return Response.json({
      id: 'ch_test_123',
      checkout_url: 'https://www.creem.io/test/payment/ch_test_123',
    });
  };

  try {
    const env = {
      DB: await createAuthDb(),
      SITE_URL: 'https://toolaze.com',
      CREEM_API_KEY: 'creem-test-key',
      CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
      CREEM_STARTER_PRODUCT_ID: STARTER_PRODUCT_ID,
    };
    const response = await onRequest({
      env,
      request: new Request('https://toolaze.com/api/billing/checkout', {
        method: 'POST',
        headers: {
          Cookie: 'toolaze_session=session-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: 'starter' }),
      }),
    });
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.checkoutUrl, 'https://www.creem.io/test/payment/ch_test_123');
    assert.equal(payload.plan.credits, 200);
    assert.equal(checkoutBody.product_id, STARTER_PRODUCT_ID);
    assert.equal(checkoutBody.metadata.userId, 'user_123');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('signed-in user can create a creator Creem checkout', async () => {
  const originalFetch = globalThis.fetch;
  let checkoutBody = null;
  globalThis.fetch = async (_url, init) => {
    checkoutBody = JSON.parse(String(init.body));
    return Response.json({
      id: 'ch_test_creator',
      checkout_url: 'https://www.creem.io/test/payment/ch_test_creator',
    });
  };

  try {
    const env = {
      DB: await createAuthDb(),
      SITE_URL: 'https://toolaze.com',
      CREEM_PAYMENT_API_KEY: 'creem-payment-key',
      CREEM_CHECKOUT_API_BASE_URL: 'https://test-api.creem.io',
      CREEM_CREATOR_PRODUCT_ID: CREATOR_PRODUCT_ID,
    };
    const response = await onRequest({
      env,
      request: new Request('https://toolaze.com/api/billing/checkout', {
        method: 'POST',
        headers: {
          Cookie: 'toolaze_session=session-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: 'creator' }),
      }),
    });
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.checkoutUrl, 'https://www.creem.io/test/payment/ch_test_creator');
    assert.equal(payload.plan.credits, 1000);
    assert.equal(checkoutBody.product_id, CREATOR_PRODUCT_ID);
    assert.equal(checkoutBody.metadata.planId, 'creator');
    assert.equal(checkoutBody.metadata.credits, '1000');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('checkout creation requires a signed-in user', async () => {
  const response = await onRequest({
    env: { DB: await createAuthDb() },
    request: new Request('https://toolaze.com/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: 'starter' }),
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.match(payload.error, /sign in/i);
});

async function createAuthDb() {
  const sessionHash = await sha256Hex('session-token');
  return {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first() {
              const normalized = String(sql).replace(/\s+/g, ' ').toLowerCase();
              if (normalized.includes('from sessions') && normalized.includes('join users')) {
                if (values[0] !== sessionHash) return null;
                return {
                  id: 'user_123',
                  email: 'buyer@example.com',
                  name: 'Buyer',
                  avatar_url: null,
                  session_id: 'sess_123',
                  expires_at: new Date(Date.now() + 60_000).toISOString(),
                };
              }
              return null;
            },
          };
        },
      };
    },
  };
}
