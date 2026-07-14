import {
  createGoogleAuthRedirectUrl,
  createOAuthStateCookie,
} from '../../../_shared/auth.mjs';
import {
  getRequestUrl,
  handleOptions,
  jsonResponse,
  redirectResponse,
} from '../../../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, 405);
  }

  try {
    const url = await createGoogleAuthRedirectUrl(env, getRequestUrl(request));
    const state = new URL(url).searchParams.get('state');

    return redirectResponse(url, 302, {
      'Set-Cookie': createOAuthStateCookie(state, env),
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unable to start Google sign-in' },
      500
    );
  }
}
