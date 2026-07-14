import {
  createClearOAuthStateCookie,
  createSession,
  createSessionCookie,
  exchangeGoogleCode,
  readOAuthState,
  upsertUser,
  verifyGoogleIdToken,
} from '../../../_shared/auth.mjs';
import { grantNewUserCredits } from '../../../_shared/credits.mjs';
import { getSafeReturnTo, jsonResponse, redirectResponse } from '../../../_shared/http.mjs';

function redirectWithClearedState(location, env) {
  return redirectResponse(location, 302, {
    'Set-Cookie': createClearOAuthStateCookie(env),
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed', allow: 'GET' }, 405);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) return redirectWithClearedState(`/?auth_error=${encodeURIComponent(error)}`, env);
  if (!code || !state) return redirectWithClearedState('/?auth_error=missing_code', env);

  try {
    const statePayload = await readOAuthState(env, state, request);
    if (!statePayload) return redirectWithClearedState('/?auth_error=invalid_state', env);

    const tokens = await exchangeGoogleCode(env, code);
    const profile = await verifyGoogleIdToken(env, tokens.id_token);
    const user = await upsertUser(env, profile);
    const grantedNewUserCredits = user.isNew
      ? await grantNewUserCredits(env, user.id)
      : false;
    const session = await createSession(env, user.id);
    const returnUrl = new URL(getSafeReturnTo(statePayload.returnTo), 'http://toolaze.local');
    if (grantedNewUserCredits) {
      returnUrl.searchParams.set('new_user_credits', '10');
    } else {
      returnUrl.searchParams.set('auth_success', '1');
    }
    if (returnUrl.pathname === '/auth/popup-callback' && isLocalhostOrigin(returnUrl.searchParams.get('openerOrigin'))) {
      returnUrl.searchParams.set('local_session_token', session.token);
    }
    const returnTo = `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`;
    const sessionCookie = createSessionCookie(session.token, env);
    const clearOAuthCookie = createClearOAuthStateCookie(env);

    const headers = new Headers({ Location: returnTo });
    headers.append('Set-Cookie', sessionCookie);
    headers.append('Set-Cookie', clearOAuthCookie);

    return new Response(null, { status: 302, headers });
  } catch (error) {
    console.error('Google OAuth callback failed', error);
    return redirectWithClearedState('/?auth_error=google_callback_failed', env);
  }
}

function isLocalhostOrigin(value) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
