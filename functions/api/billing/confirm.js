import { getCurrentUser } from '../../_shared/auth.mjs';
import { confirmCreditCheckout } from '../../_shared/creem-payments.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google before confirming credits.' }, 401);

  const body = await request.json().catch(() => ({}));
  const result = await confirmCreditCheckout({
    env,
    checkoutId: body.checkoutId,
    user,
  });

  return jsonResponse(result.body, result.status);
}
