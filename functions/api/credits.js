import { getCurrentUser } from '../_shared/auth.mjs';
import { getCreditSummary } from '../_shared/credits.mjs';
import { handleOptions, jsonResponse } from '../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, 405);
  }

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google to view credits.' }, 401);

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') || '200');
  const credits = await getCreditSummary(env, user.id, limit);

  return jsonResponse({ credits });
}
