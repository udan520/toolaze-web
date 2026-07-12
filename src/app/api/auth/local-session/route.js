const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60

function isLocalhost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]'
}

function buildSessionCookie(token) {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join('; ')
}

export async function POST(request) {
  const url = new URL(request.url)
  if (!isLocalhost(url.hostname)) {
    return Response.json({ error: 'Local session helper is only available on localhost.' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const token = typeof body.token === 'string' ? body.token.trim() : ''
  if (!token) {
    return Response.json({ error: 'Missing session token.' }, { status: 400 })
  }

  return Response.json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': buildSessionCookie(token),
      },
    },
  )
}
