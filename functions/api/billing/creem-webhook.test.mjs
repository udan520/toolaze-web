import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from './creem-webhook.js';

test('Creem webhook rejects invalid signatures before processing the event', async () => {
  const response = await onRequest({
    env: { CREEM_WEBHOOK_SECRET: 'whsec_test_secret' },
    request: new Request('https://toolaze.com/api/billing/creem-webhook', {
      method: 'POST',
      headers: {
        'creem-signature': 'invalid-signature',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventType: 'checkout.completed' }),
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.match(payload.error, /signature/i);
});

test('Creem webhook requires POST', async () => {
  const response = await onRequest({
    env: { CREEM_WEBHOOK_SECRET: 'whsec_test_secret' },
    request: new Request('https://toolaze.com/api/billing/creem-webhook'),
  });
  const payload = await response.json();

  assert.equal(response.status, 405);
  assert.match(payload.allow, /POST/);
});
