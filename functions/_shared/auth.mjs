import {
  createRandomToken,
  createSignedState,
  parseJwt,
  readSignedState,
  sha256Hex,
  verifyJwtRs256,
} from './crypto.mjs';
import { getSafeReturnTo } from './http.mjs';

export const SESSION_COOKIE_NAME = 'toolaze_session';
export const OAUTH_STATE_COOKIE_NAME = 'toolaze_oauth_state';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const OAUTH_STATE_TTL_SECONDS = 10 * 60;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;
const ATTRIBUTION_URL_MAX_LENGTH = 1000;
const ATTRIBUTION_TEXT_MAX_LENGTH = 500;
const UTM_MAX_LENGTH = 120;

export function parseCookies(request) {
  const header = request.headers.get('Cookie') || '';
  const cookies = {};

  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex < 0) continue;

    const name = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!name) continue;

    cookies[name] = decodeCookieValue(value);
  }

  return cookies;
}

export function createSessionCookie(token, env) {
  return buildSessionCookie(token, SESSION_TTL_SECONDS, env);
}

export function createClearSessionCookie(env) {
  return buildSessionCookie('', 0, env);
}

export function createOAuthStateCookie(state, env) {
  return buildOAuthStateCookie(state, OAUTH_STATE_TTL_SECONDS, env);
}

export function createClearOAuthStateCookie(env) {
  return buildOAuthStateCookie('', 0, env);
}

export async function createGoogleAuthRedirectUrl(env, requestUrl) {
  const authCookieSecret = requireEnv(env, 'AUTH_COOKIE_SECRET');
  const googleClientId = requireEnv(env, 'GOOGLE_CLIENT_ID');
  const siteUrl = requireEnv(env, 'SITE_URL').replace(/\/+$/, '');
  const url = new URL(requestUrl);
  const returnTo = getSafeReturnTo(url.searchParams.get('returnTo'));
  const signupAttribution = normalizeSignupAttribution({
    signupPath: url.searchParams.get('signupPath'),
    signupUrl: url.searchParams.get('signupUrl'),
    referrer: url.searchParams.get('referrer'),
  }, siteUrl);
  const state = await createSignedState(
    { returnTo, signupAttribution, exp: Date.now() + OAUTH_STATE_TTL_MS },
    authCookieSecret
  );
  const redirectUri = `${siteUrl}/api/auth/google/callback`;
  const authUrl = new URL(GOOGLE_AUTH_URL);

  authUrl.searchParams.set('client_id', googleClientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('prompt', 'select_account');
  authUrl.searchParams.set('state', state);

  return authUrl.toString();
}

export async function readOAuthState(env, state, request) {
  if (!request) return null;

  const cookieState = parseCookies(request)[OAUTH_STATE_COOKIE_NAME];
  if (!cookieState || cookieState !== state) return null;

  const payload = await readSignedState(state, env.AUTH_COOKIE_SECRET);
  if (!payload) return null;

  return {
    ...payload,
    returnTo: getSafeReturnTo(payload.returnTo),
    signupAttribution: normalizeSignupAttribution(payload.signupAttribution, getSiteUrl(env)),
  };
}

export async function exchangeGoogleCode(env, code) {
  const googleClientId = requireEnv(env, 'GOOGLE_CLIENT_ID');
  const googleClientSecret = requireEnv(env, 'GOOGLE_CLIENT_SECRET');
  const siteUrl = requireEnv(env, 'SITE_URL').replace(/\/+$/, '');
  const body = new URLSearchParams({
    code,
    client_id: googleClientId,
    client_secret: googleClientSecret,
    redirect_uri: `${siteUrl}/api/auth/google/callback`,
    grant_type: 'authorization_code',
  });

  const response = await fetch(getGoogleTokenUrl(env), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Google token exchange failed: ${response.status}`);
  }

  if (!result.id_token) {
    throw new Error('Google token response is missing id_token');
  }

  return result;
}

export async function verifyGoogleIdToken(env, idToken) {
  const parsed = parseJwt(idToken);
  if (parsed.header.alg !== 'RS256' || !parsed.header.kid) {
    throw new Error('Invalid Google ID token header');
  }

  const jwksResponse = await fetch(getGoogleJwksUrl(env));
  if (!jwksResponse.ok) {
    throw new Error(`Google JWKS request failed: ${jwksResponse.status}`);
  }

  const jwks = await jwksResponse.json();
  const jwk = (jwks.keys || []).find((key) => key.kid === parsed.header.kid);
  if (!jwk) throw new Error('Google signing key not found');

  const payload = await verifyJwtRs256(idToken, jwk);
  if (!payload) throw new Error('Invalid Google ID token signature');

  validateGooglePayload(env, payload);

  return {
    googleSub: payload.sub,
    email: payload.email,
    name: payload.name || null,
    avatarUrl: payload.picture || null,
  };
}

export async function upsertUser(env, profile, signupAttribution = null) {
  const existing = await env.DB.prepare(
    'SELECT id FROM users WHERE google_sub = ?'
  ).bind(profile.googleSub).first();
  const now = new Date().toISOString();

  if (existing) {
    await env.DB.prepare(
      'UPDATE users SET email = ?, name = ?, avatar_url = ?, updated_at = ? WHERE google_sub = ?'
    ).bind(
      profile.email,
      profile.name || null,
      profile.avatarUrl || null,
      now,
      profile.googleSub
    ).run();
    return { id: existing.id, isNew: false };
  }

  const id = `user_${createUuidSuffix()}`;
  await env.DB.prepare(
    'INSERT INTO users (id, google_sub, email, name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    id,
    profile.googleSub,
    profile.email,
    profile.name || null,
    profile.avatarUrl || null,
    now,
    now
  ).run();

  await recordSignupAttribution(env, id, signupAttribution, now);

  return { id, isNew: true };
}

export async function createSession(env, userId) {
  const id = `sess_${createUuidSuffix()}`;
  const token = createRandomToken();
  const tokenHash = await sha256Hex(token);
  const nowMs = Date.now();
  const now = new Date(nowMs).toISOString();
  const expiresAt = new Date(nowMs + SESSION_TTL_MS).toISOString();

  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, userId, tokenHash, expiresAt, now).run();

  return { id, token, expiresAt };
}

export async function getCurrentUser(env, request) {
  const token = parseCookies(request)[SESSION_COOKIE_NAME];
  if (!token) return null;

  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(
    `SELECT users.id, users.email, users.name, users.avatar_url, sessions.id AS session_id, sessions.expires_at
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ?`
  ).bind(tokenHash).first();

  if (!row) return null;

  const expiresAtMs = new Date(row.expires_at).getTime();
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    sessionId: row.session_id,
  };
}

export async function deleteCurrentSession(env, request) {
  const token = parseCookies(request)[SESSION_COOKIE_NAME];
  if (!token) return;

  const tokenHash = await sha256Hex(token);
  await env.DB.prepare(
    'DELETE FROM sessions WHERE token_hash = ?'
  ).bind(tokenHash).run();
}

function buildSessionCookie(value, maxAge, env) {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${maxAge}`,
  ];

  if (isHttpsSite(env)) parts.push('Secure');

  return parts.join('; ');
}

function buildOAuthStateCookie(value, maxAge, env) {
  const parts = [
    `${OAUTH_STATE_COOKIE_NAME}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/api/auth/google/callback',
    `Max-Age=${maxAge}`,
  ];

  if (isHttpsSite(env)) parts.push('Secure');

  return parts.join('; ');
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSignupAttribution(value, siteUrl) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const signupUrl = getSafeSignupUrl(value.signupUrl, siteUrl);
  const signupPath = getSafeSignupPath(value.signupPath) || getSignupPathFromUrl(signupUrl);
  if (!signupPath && !signupUrl) return null;

  const signupUrlParams = signupUrl ? new URL(signupUrl).searchParams : new URLSearchParams();

  return {
    signupPath,
    signupUrl,
    referrer: getSafeExternalUrl(value.referrer, ATTRIBUTION_URL_MAX_LENGTH),
    utmSource: getSafeText(value.utmSource, UTM_MAX_LENGTH) || getSafeText(signupUrlParams.get('utm_source'), UTM_MAX_LENGTH),
    utmMedium: getSafeText(value.utmMedium, UTM_MAX_LENGTH) || getSafeText(signupUrlParams.get('utm_medium'), UTM_MAX_LENGTH),
    utmCampaign: getSafeText(value.utmCampaign, UTM_MAX_LENGTH) || getSafeText(signupUrlParams.get('utm_campaign'), UTM_MAX_LENGTH),
    utmTerm: getSafeText(value.utmTerm, UTM_MAX_LENGTH) || getSafeText(signupUrlParams.get('utm_term'), UTM_MAX_LENGTH),
    utmContent: getSafeText(value.utmContent, UTM_MAX_LENGTH) || getSafeText(signupUrlParams.get('utm_content'), UTM_MAX_LENGTH),
  };
}

async function recordSignupAttribution(env, userId, attribution, now) {
  const normalized = normalizeSignupAttribution(attribution, getSiteUrl(env));
  if (!normalized) return;

  try {
    await env.DB.prepare(
      `INSERT INTO user_signup_attribution (
        user_id,
        signup_path,
        signup_url,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO NOTHING`
    ).bind(
      userId,
      normalized.signupPath,
      normalized.signupUrl,
      normalized.referrer,
      normalized.utmSource,
      normalized.utmMedium,
      normalized.utmCampaign,
      normalized.utmTerm,
      normalized.utmContent,
      now,
      now
    ).run();
  } catch (error) {
    console.warn('Unable to record signup attribution', error);
  }
}

function getSafeSignupPath(value) {
  const text = getSafeText(value, ATTRIBUTION_TEXT_MAX_LENGTH);
  if (!text) return null;
  if (!text.startsWith('/')) return null;
  if (text.startsWith('//')) return null;
  if (text.includes('\\')) return null;
  return text;
}

function getSafeSignupUrl(value, siteUrl) {
  const text = getSafeText(value, ATTRIBUTION_URL_MAX_LENGTH);
  if (!text) return null;

  try {
    const url = new URL(text);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!isAllowedSignupHost(url.hostname, siteUrl)) return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function getSafeExternalUrl(value, maxLength) {
  const text = getSafeText(value, maxLength);
  if (!text) return null;

  try {
    const url = new URL(text);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function getSignupPathFromUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

function getSafeText(value, maxLength) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function isAllowedSignupHost(hostname, siteUrl) {
  const allowedHosts = new Set([
    'toolaze.com',
    'www.toolaze.com',
    'toolaze-web.pages.dev',
  ]);

  try {
    allowedHosts.add(new URL(siteUrl).hostname);
  } catch {
    // Ignore invalid environment values; required SITE_URL validation happens elsewhere.
  }

  return allowedHosts.has(hostname) || isLocalhostHostname(hostname);
}

function isLocalhostHostname(hostname) {
  return ['localhost', '127.0.0.1', '::1', '[::1]'].includes(hostname);
}

function getSiteUrl(env) {
  return String(env.SITE_URL || '').replace(/\/+$/, '');
}

function getGoogleTokenUrl(env) {
  return env.GOOGLE_TOKEN_URL || GOOGLE_TOKEN_URL;
}

function getGoogleJwksUrl(env) {
  return env.GOOGLE_JWKS_URL || GOOGLE_JWKS_URL;
}

function requireEnv(env, name) {
  const value = String(env[name] || '').trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function isHttpsSite(env) {
  return getSiteUrl(env).startsWith('https://');
}

function createUuidSuffix() {
  return crypto.randomUUID().replace(/-/g, '');
}

function validateGooglePayload(env, payload) {
  if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') {
    throw new Error('Invalid Google ID token issuer');
  }

  if (payload.aud !== env.GOOGLE_CLIENT_ID) {
    throw new Error('Invalid Google ID token audience');
  }

  const exp = Number(payload.exp);
  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
    throw new Error('Invalid or expired Google ID token exp');
  }

  if (payload.email_verified !== true && payload.email_verified !== 'true') {
    throw new Error('Google email is not verified');
  }

  if (!payload.sub || !payload.email) {
    throw new Error('Google ID token is missing required profile fields');
  }
}
