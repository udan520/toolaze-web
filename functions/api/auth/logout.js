import { createClearSessionCookie, deleteCurrentSession } from '../../_shared/auth.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  await deleteCurrentSession(env, request);

  return jsonResponse({ ok: true }, 200, {
    'Set-Cookie': createClearSessionCookie(env),
  });
}
