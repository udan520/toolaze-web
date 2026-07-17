import { getCreditSummary } from '../../_shared/credits.mjs';
import {
  approveXPostReward,
  listXPostRewardReviews,
  rejectXPostReward,
} from '../../_shared/rewards.mjs';
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

  const url = new URL(request.url);
  if (request.method === 'GET') {
    const result = await listXPostRewardReviews(env, {
      status: url.searchParams.get('status') || 'pending',
      limit: Number(url.searchParams.get('limit') || 50),
    });
    return jsonResponse(result);
  }

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || '').trim();
    const options = {
      reviewer: String(body.reviewer || 'admin').trim() || 'admin',
      reason: body.reason,
    };
    const result = action === 'approve'
      ? await approveXPostReward(env, body.id, options)
      : action === 'reject'
        ? await rejectXPostReward(env, body.id, options)
        : { ok: false, status: 400, error: 'Unsupported review action.' };

    if (!result.ok) return jsonResponse({ error: result.error }, result.status || 400);
    const credits = result.xPost?.userId ? await getCreditSummary(env, result.xPost.userId, 10) : null;
    return jsonResponse({ ...result, credits });
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'GET, POST, OPTIONS' }, 405);
}
