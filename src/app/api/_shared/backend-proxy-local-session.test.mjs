import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

async function importFreshBackendProxy(label) {
  return import(`./backend-proxy.js?isolated=${label}-${Date.now()}-${Math.random()}`)
}

test('saved local dev session restores local history even when browser cookie is stale', async () => {
  const previousSessionFile = process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE
  const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-backend-proxy-local-session-'))
  process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = join(dir, 'session-token.txt')
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(dir, 'state.json')
  await writeFile(process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE, 'toolaze-local-dev-session\n', 'utf8')

  try {
    delete globalThis[Symbol.for('toolaze.localDevAuthState')]
    const { proxyToPagesFunctions } = await importFreshBackendProxy('saved-local-dev-session')
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/history?limit=5', {
      headers: {
        Cookie: 'toolaze_session=stale-google-session-token',
      },
    }), '/api/history')
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.deepEqual(payload.items, [])
    assert.match(response.headers.get('set-cookie') || '', /^toolaze_session=toolaze-local-dev-session;/)
  } finally {
    if (previousSessionFile === undefined) {
      delete process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE
    } else {
      process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = previousSessionFile
    }
    if (previousStateFile === undefined) {
      delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
    } else {
      process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
    }
    delete globalThis[Symbol.for('toolaze.localDevAuthState')]
    await rm(dir, { recursive: true, force: true })
  }
})

test('local dev logout clears the saved session token instead of restoring it on reload', async () => {
  const previousSessionFile = process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE
  const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  const originalFetch = globalThis.fetch
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-backend-proxy-local-logout-'))
  process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = join(dir, 'session-token.txt')
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(dir, 'state.json')
  await writeFile(process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE, 'toolaze-local-dev-session\n', 'utf8')

  try {
    delete globalThis[Symbol.for('toolaze.localDevAuthState')]
    const { proxyToPagesFunctions } = await importFreshBackendProxy('local-dev-logout-clears-saved-session')
    const logoutResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/auth/logout', {
      method: 'POST',
      headers: {
        Cookie: 'toolaze_session=toolaze-local-dev-session',
      },
    }), '/api/auth/logout')

    assert.equal(logoutResponse.status, 200)
    assert.match(logoutResponse.headers.get('set-cookie') || '', /^toolaze_session=;/)
    await assert.rejects(() => readFile(process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE, 'utf8'), { code: 'ENOENT' })

    globalThis.fetch = async () => Response.json({ ok: false, user: null }, { status: 401 })
    const authResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/auth/me'), '/api/auth/me')
    const authPayload = await authResponse.json()

    assert.equal(authResponse.status, 401)
    assert.deepEqual(authPayload, { ok: false, user: null })
    assert.doesNotMatch(authResponse.headers.get('set-cookie') || '', /toolaze-local-dev-session/)
  } finally {
    globalThis.fetch = originalFetch
    if (previousSessionFile === undefined) {
      delete process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE
    } else {
      process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = previousSessionFile
    }
    if (previousStateFile === undefined) {
      delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
    } else {
      process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
    }
    delete globalThis[Symbol.for('toolaze.localDevAuthState')]
    await rm(dir, { recursive: true, force: true })
  }
})
