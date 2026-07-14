import { readFile } from 'node:fs/promises'
import {
  buildClearSessionCookie,
  getLocalDevAuthState,
  hasLocalDevSession,
  isLocalhost,
} from './local-dev-auth.js'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const backendOrigin = (process.env.ACCOUNT_API_BACKEND || 'https://toolaze-web.pages.dev').replace(/\/+$/, '')
const localSessionTokenFile = process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE || '/tmp/toolaze-local-session-token.txt'

export async function proxyToPagesFunctions(request, pathname) {
  const incomingUrl = new URL(request.url)
  const localDevResponse = handleLocalDevSessionRequest(request, incomingUrl, pathname)
  if (localDevResponse) return localDevResponse

  const target = new URL(pathname, backendOrigin)
  target.search = incomingUrl.search

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('content-length')
  const localSessionToken = await applyLocalSessionFallback(headers, incomingUrl)

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

async function applyLocalSessionFallback(headers, incomingUrl) {
  if (!isLocalhost(incomingUrl.hostname)) return ''

  const token = await readLocalSessionToken()
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

function handleLocalDevSessionRequest(request, incomingUrl, pathname) {
  if (!isLocalhost(incomingUrl.hostname) || !hasLocalDevSession(request)) return null

  if (pathname === '/api/auth/me') {
    return Response.json(getLocalDevAuthState())
  }

  if (pathname === '/api/credits') {
    return Response.json({ credits: getLocalDevAuthState().credits })
  }

  if (pathname === '/api/history') {
    return Response.json({ items: [] })
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
