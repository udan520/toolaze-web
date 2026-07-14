import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import {
  buildLocalDevSessionCookie,
  getLocalDevAuthState,
  getLocalDevSessionToken,
  isLocalhost,
  isValidLocalDevCredential,
  normalizeLocalDevEmail,
} from '../../_shared/local-dev-auth.js'

const SESSION_COOKIE_NAME = 'toolaze_session'
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60
const backendOrigin = (process.env.ACCOUNT_API_BACKEND || 'https://toolaze-web.pages.dev').replace(/\/+$/, '')
const localSessionTokenFile = process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE || '/tmp/toolaze-local-session-token.txt'

function buildSessionCookie(token) {
  return [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ].join('; ')
}

async function readLocalSessionToken() {
  try {
    return (await readFile(localSessionTokenFile, 'utf8')).trim()
  } catch {
    return ''
  }
}

async function writeLocalSessionToken(token) {
  await mkdir(dirname(localSessionTokenFile), { recursive: true })
  await writeFile(localSessionTokenFile, `${token}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  })
}

async function getRemoteAuthStateForToken(token) {
  if (!token) return null

  const response = await fetch(new URL('/api/auth/me', backendOrigin), {
    headers: {
      Cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    },
    cache: 'no-store',
  }).catch(() => null)

  if (!response?.ok) return null

  const data = await response.json().catch(() => null)
  if (!data?.user) return null

  return data
}

export async function POST(request) {
  const url = new URL(request.url)
  if (!isLocalhost(url.hostname)) {
    return Response.json({ error: 'Dev login is only available on localhost.' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const email = normalizeLocalDevEmail(body.email)
  const password = typeof body.password === 'string' ? body.password : ''
  const preferLocal = body.preferLocal === true

  if (!isValidLocalDevCredential(email, password)) {
    return Response.json({ error: 'Invalid local test email or password.' }, { status: 401 })
  }

  const realSessionToken = preferLocal ? '' : await readLocalSessionToken()
  const realAuthState = await getRemoteAuthStateForToken(realSessionToken)
  if (!preferLocal && normalizeLocalDevEmail(realAuthState?.user?.email) === email) {
    return Response.json(
      {
        ok: true,
        source: 'saved-google-session',
        user: realAuthState.user,
        credits: realAuthState.credits ?? null,
      },
      {
        headers: {
          'Set-Cookie': buildSessionCookie(realSessionToken),
        },
      },
    )
  }

  await writeLocalSessionToken(getLocalDevSessionToken())

  return Response.json(
    {
      ...getLocalDevAuthState(),
      source: 'local-dev-fallback',
    },
    {
      headers: {
        'Set-Cookie': buildLocalDevSessionCookie(),
      },
    },
  )
}
