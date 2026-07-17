import { getCurrentUser } from '../../_shared/auth.mjs';
import { submitXPostReward } from '../../_shared/rewards.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google to earn credits.' }, 401);

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const result = await submitXPostReward(env, user.id, body.postUrl);
    if (!result.ok) return jsonResponse({ error: result.error }, result.status || 400);
    return jsonResponse(result, result.duplicate ? 200 : 201);
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
}
