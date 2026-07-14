import { getCurrentUser } from '../../_shared/auth.mjs';
import { getCreditSummary } from '../../_shared/credits.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, 405);
  }

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ user: null });

  const credits = await getCreditSummary(env, user.id, 3);

  return jsonResponse({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    credits,
  });
}
