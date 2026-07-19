import { handleCreemWebhook } from '../../_shared/creem-payments.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  const rawBody = await request.text();
  const result = await handleCreemWebhook({
    env,
    rawBody,
    signature: request.headers.get('creem-signature') || '',
  });

  return jsonResponse(result.body, result.status);
}
