import { readFile } from 'node:fs/promises'
import {
  buildClearSessionCookie,
  buildLocalDevSessionCookie,
  claimLocalDevDailyCheckIn,
  createLocalDevHistoryItem,
  deleteLocalDevHistoryItem,
  getLocalDevDailyCheckInStatus,
  getLocalDevAuthState,
  getLocalDevSessionToken,
  hasLocalDevSession,
  isLocalhost,
  listLocalDevRewardEvents,
  listLocalDevXPostRewardReviews,
  listLocalDevHistory,
  reviewLocalDevXPostReward,
  submitLocalDevXPostReward,
} from './local-dev-auth.js'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const LOCAL_DEV_ADMIN_TOKEN = 'toolaze-local-dev-admin'
const ADMIN_PRODUCTION_SOURCE = 'production'
const backendOrigin = (process.env.ACCOUNT_API_BACKEND || 'https://toolaze-web.pages.dev').replace(/\/+$/, '')
const localSessionTokenFile = process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE || '/tmp/toolaze-local-session-token.txt'

export async function proxyToPagesFunctions(request, pathname) {
  const incomingUrl = new URL(request.url)
  const savedLocalSessionToken = isLocalhost(incomingUrl.hostname) ? await readLocalSessionToken() : ''
  const localDevResponse = await handleLocalDevSessionRequest(request, incomingUrl, pathname, savedLocalSessionToken)
  if (localDevResponse) return localDevResponse

  const target = new URL(pathname, backendOrigin)
  target.search = incomingUrl.search

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')
  const localSessionToken = applyLocalSessionFallback(headers, incomingUrl, savedLocalSessionToken)

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.arrayBuffer()
    if (body.byteLength > 0) {
      init.body = body
    }
  }

  const response = await fetch(target, init)
  const responseHeaders = sanitizeBackendResponseHeaders(response.headers)
  if (localSessionToken) responseHeaders.append('Set-Cookie', buildLocalSessionCookie(localSessionToken))

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}

function sanitizeBackendResponseHeaders(headers) {
  const nextHeaders = new Headers(headers)

  for (const header of [
    'connection',
    'content-encoding',
    'content-length',
    'keep-alive',
    'transfer-encoding',
  ]) {
    nextHeaders.delete(header)
  }

  return nextHeaders
}

function applyLocalSessionFallback(headers, incomingUrl, token) {
  if (!isLocalhost(incomingUrl.hostname)) return ''
  if (!token) return ''

  headers.set('cookie', buildCookieHeader(headers.get('cookie') || '', token))
  return token
}

async function readLocalSessionToken() {
  try {
    return (await readFile(localSessionTokenFile, 'utf8')).trim()
  } catch {
    return ''
  }
}

function buildLocalSessionCookie(token) {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join('; ')
}

function buildCookieHeader(existingCookieHeader, token) {
  const encodedToken = encodeURIComponent(token)
  const preservedCookies = existingCookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !part.startsWith(`${SESSION_COOKIE_NAME}=`))

  preservedCookies.push(`${SESSION_COOKIE_NAME}=${encodedToken}`)
  return preservedCookies.join('; ')
}

function localDevJsonResponse(body, init = {}) {
  const headers = new Headers(init.headers || {})
  headers.set('Set-Cookie', buildLocalDevSessionCookie())

  return Response.json(body, {
    ...init,
    headers,
  })
}

async function handleLocalDevSessionRequest(request, incomingUrl, pathname, savedLocalSessionToken = '') {
  if (isLocalhost(incomingUrl.hostname) && pathname === '/api/admin/reward-reviews') {
    return handleLocalDevRewardReviewRequest(request, incomingUrl)
  }
  if (isLocalhost(incomingUrl.hostname) && pathname === '/api/admin/reward-events') {
    return handleLocalDevRewardEventRequest(request, incomingUrl)
  }

  const hasSavedLocalDevSession = savedLocalSessionToken === getLocalDevSessionToken()
  if (!isLocalhost(incomingUrl.hostname) || (!hasLocalDevSession(request) && !hasSavedLocalDevSession)) return null

  if (pathname === '/api/auth/me') {
    return localDevJsonResponse(getLocalDevAuthState())
  }

  if (pathname === '/api/credits') {
    return localDevJsonResponse({ credits: getLocalDevAuthState().credits })
  }

  if (pathname === '/api/rewards/check-in') {
    if (request.method === 'GET') {
      return localDevJsonResponse({
        checkIn: getLocalDevDailyCheckInStatus(),
        credits: getLocalDevAuthState().credits,
      })
    }

    if (request.method === 'POST') {
      return localDevJsonResponse(claimLocalDevDailyCheckIn())
    }

    return localDevJsonResponse({ error: 'Method not allowed', allow: 'GET, POST, OPTIONS' }, { status: 405 })
  }

  if (pathname === '/api/rewards/x-post') {
    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const result = submitLocalDevXPostReward(body.postUrl)
      if (!result.ok) return localDevJsonResponse({ error: result.error }, { status: result.status || 400 })
      return localDevJsonResponse(result, { status: result.duplicate ? 200 : 201 })
    }

    return localDevJsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, { status: 405 })
  }

  if (pathname === '/api/history') {
    if (request.method === 'GET') {
      const limit = Number(incomingUrl.searchParams.get('limit') || '100')
      return localDevJsonResponse({ items: listLocalDevHistory(limit) })
    }

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}))
      const result = createLocalDevHistoryItem(body)
      if (!result.ok) return localDevJsonResponse({ error: result.error }, { status: result.status })
      return localDevJsonResponse({ item: result.item }, { status: 201 })
    }

    if (request.method === 'DELETE') {
      const id = String(incomingUrl.searchParams.get('id') || '').trim()
      if (!id) return localDevJsonResponse({ error: 'History item id is required.' }, { status: 400 })

      const result = deleteLocalDevHistoryItem(id)
      if (!result.ok) return localDevJsonResponse({ error: 'History item not found.' }, { status: 404 })

      return localDevJsonResponse({ ok: true, deleted: result.deleted })
    }

    return localDevJsonResponse({ error: 'Method not allowed', allow: 'GET, POST, DELETE, OPTIONS' }, { status: 405 })
  }

  if (pathname === '/api/auth/logout') {
    return Response.json(
      { ok: true },
      {
        headers: {
          'Set-Cookie': buildClearSessionCookie(),
        },
      },
    )
  }

  return null
}

async function handleLocalDevRewardEventRequest(request, incomingUrl) {
  const adminToken = request.headers.get('x-admin-token') || ''
  if (adminToken !== LOCAL_DEV_ADMIN_TOKEN) {
    return Response.json({ error: 'Admin token required.' }, { status: 403 })
  }
  if (isProductionAdminSource(incomingUrl)) {
    return proxyProductionAdminRequest(request, incomingUrl, '/api/admin/reward-events')
  }

  if (request.method === 'GET') {
    return Response.json(listLocalDevRewardEvents({
      reason: incomingUrl.searchParams.get('reason') || 'all',
      limit: Number(incomingUrl.searchParams.get('limit') || 50),
    }))
  }

  return Response.json({ error: 'Method not allowed', allow: 'GET, OPTIONS' }, { status: 405 })
}

async function handleLocalDevRewardReviewRequest(request, incomingUrl) {
  const adminToken = request.headers.get('x-admin-token') || ''
  if (adminToken !== LOCAL_DEV_ADMIN_TOKEN) {
    return Response.json({ error: 'Admin token required.' }, { status: 403 })
  }
  if (isProductionAdminSource(incomingUrl)) {
    return proxyProductionAdminRequest(request, incomingUrl, '/api/admin/reward-reviews')
  }

  if (request.method === 'GET') {
    return Response.json(listLocalDevXPostRewardReviews({
      status: incomingUrl.searchParams.get('status') || 'pending',
    }))
  }

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}))
    const result = reviewLocalDevXPostReward({
      id: body.id,
      action: body.action,
      reason: body.reason,
      reviewer: 'local-dev-admin',
    })
    if (!result.ok) return Response.json({ error: result.error }, { status: result.status || 400 })
    return Response.json(result)
  }

  return Response.json({ error: 'Method not allowed', allow: 'GET, POST, OPTIONS' }, { status: 405 })
}

function isProductionAdminSource(incomingUrl) {
  return String(incomingUrl.searchParams.get('source') || '').trim().toLowerCase() === ADMIN_PRODUCTION_SOURCE
}

async function proxyProductionAdminRequest(request, incomingUrl, pathname) {
  const productionAdminToken = await readProductionAdminToken()
  if (!productionAdminToken) {
    return Response.json({ error: 'Production admin token is not configured.' }, { status: 503 })
  }

  const target = new URL(pathname, backendOrigin)
  target.search = incomingUrl.search
  target.searchParams.delete('source')

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')
  headers.set('x-admin-token', productionAdminToken)

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.arrayBuffer()
    if (body.byteLength > 0) {
      init.body = body
    }
  }

  const response = await fetch(target, init)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: sanitizeBackendResponseHeaders(response.headers),
  })
}

async function readProductionAdminToken() {
  const directToken = String(process.env.REWARD_REVIEW_ADMIN_TOKEN || '').trim()
  if (directToken) return directToken

  try {
    const envFile = process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE || `${process.cwd()}/.env.local`
    const rawEnv = await readFile(envFile, 'utf8')
    return readDotEnvValue(rawEnv, 'REWARD_REVIEW_ADMIN_TOKEN')
  } catch {
    return ''
  }
}

function readDotEnvValue(rawEnv, key) {
  const prefix = `${key}=`
  const line = String(rawEnv || '')
    .split('\n')
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix))
  if (!line) return ''

  const rawValue = line.slice(prefix.length).trim()
  if (
    (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
    (rawValue.startsWith("'") && rawValue.endsWith("'"))
  ) {
    return rawValue.slice(1, -1).trim()
  }

  return rawValue
}
