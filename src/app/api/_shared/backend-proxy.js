import { readFile } from 'node:fs/promises'
import {
  buildClearSessionCookie,
  buildLocalDevSessionCookie,
  createLocalDevHistoryItem,
  deleteLocalDevHistoryItem,
  getLocalDevAuthState,
  getLocalDevSessionToken,
  hasLocalDevSession,
  isLocalhost,
  listLocalDevHistory,
} from './local-dev-auth.js'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
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
  const hasSavedLocalDevSession = savedLocalSessionToken === getLocalDevSessionToken()
  if (!isLocalhost(incomingUrl.hostname) || (!hasLocalDevSession(request) && !hasSavedLocalDevSession)) return null

  if (pathname === '/api/auth/me') {
    return localDevJsonResponse(getLocalDevAuthState())
  }

  if (pathname === '/api/credits') {
    return localDevJsonResponse({ credits: getLocalDevAuthState().credits })
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
