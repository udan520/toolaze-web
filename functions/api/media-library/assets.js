import { getCurrentUser } from '../../_shared/auth.mjs';
import {
  isMediaLibraryAdminEmail,
  listMediaLibraryAssets,
} from '../../_shared/media-library.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, 405);
  }

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with an admin account.' }, 401);
  if (!isMediaLibraryAdminEmail(user.email, env)) {
    return jsonResponse({ error: 'Admin access required.' }, 403);
  }

  const url = new URL(request.url);
  const result = await listMediaLibraryAssets(env, {
    limit: url.searchParams.get('limit'),
    type: url.searchParams.get('type'),
    reviewStatus: url.searchParams.get('reviewStatus'),
    query: url.searchParams.get('q'),
  });

  return jsonResponse(result);
}
