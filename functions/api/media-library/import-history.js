import { getCurrentUser } from '../../_shared/auth.mjs';
import {
  importHistoryItemToMediaLibrary,
  isMediaLibraryAdminEmail,
} from '../../_shared/media-library.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with an admin account.' }, 401);
  if (!isMediaLibraryAdminEmail(user.email, env)) {
    return jsonResponse({ error: 'Admin access required.' }, 403);
  }

  const body = await request.json().catch(() => ({}));
  const result = await importHistoryItemToMediaLibrary(env, user, body.historyId);
  if (!result.ok) return jsonResponse({ error: result.error }, result.status || 400);

  return jsonResponse(result);
}
