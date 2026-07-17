import { getCurrentUser } from '../../_shared/auth.mjs';
import { getCreditSummary } from '../../_shared/credits.mjs';
import { claimDailyCheckIn, getDailyCheckInStatus } from '../../_shared/rewards.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google to earn credits.' }, 401);

  if (request.method === 'GET') {
    const checkIn = await getDailyCheckInStatus(env, user.id);
    const credits = await getCreditSummary(env, user.id, 10);
    return jsonResponse({ checkIn, credits });
  }

  if (request.method === 'POST') {
    const result = await claimDailyCheckIn(env, user.id);
    const credits = await getCreditSummary(env, user.id, 10);
    return jsonResponse({ ...result, credits });
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'GET, POST, OPTIONS' }, 405);
}
