import { listCreditRewardEvents } from '../../_shared/credits.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

function getAdminToken(request) {
  const explicit = request.headers.get('x-admin-token') || '';
  if (explicit) return explicit;

  const auth = request.headers.get('authorization') || '';
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
}

function requireAdmin(env, request) {
  const expected = String(env.REWARD_REVIEW_ADMIN_TOKEN || '').trim();
  if (!expected) return { ok: false, status: 503, error: 'Admin token is not configured.' };
  if (getAdminToken(request) !== expected) return { ok: false, status: 403, error: 'Admin token required.' };
  return { ok: true };
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return handleOptions();

  const admin = requireAdmin(env, request);
  if (!admin.ok) return jsonResponse({ error: admin.error }, admin.status);

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const result = await listCreditRewardEvents(env, {
      reason: url.searchParams.get('reason') || 'all',
      limit: Number(url.searchParams.get('limit') || 50),
    });
    return jsonResponse(result);
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, 405);
}
