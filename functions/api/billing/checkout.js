import { getCurrentUser } from '../../_shared/auth.mjs';
import { createCreditCheckout } from '../../_shared/creem-payments.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google before buying credits.' }, 401);

  const body = await request.json().catch(() => ({}));
  const checkout = await createCreditCheckout({
    env,
    requestUrl: request.url,
    planId: body.planId,
    user,
  });

  if (!checkout.ok) return jsonResponse(checkout.body, checkout.status);

  return jsonResponse({
    checkoutUrl: checkout.checkoutUrl,
    checkoutId: checkout.checkoutId,
    plan: {
      id: checkout.plan.id,
      name: checkout.plan.name,
      price: checkout.plan.price,
      credits: checkout.plan.credits,
    },
  });
}
