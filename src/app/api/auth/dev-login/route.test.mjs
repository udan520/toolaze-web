import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE

test.after(() => {
  if (previousStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
  }
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
})

async function loadRoute(tokenFile, stateFile) {
  process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = tokenFile
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = stateFile
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
  return import(`./route.js?test=${Date.now()}-${Math.random()}`)
}

function createRequest(body) {
  return new Request('http://localhost:3016/api/auth/dev-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('dev login falls back to local test account when no saved Google session token exists', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-dev-login-'))
  const tokenFile = join(dir, 'missing-token.txt')
  const { POST } = await loadRoute(tokenFile, join(dir, 'state.json'))

  try {
    const response = await POST(createRequest({
      email: 'dianawu1202@gmail.com',
      password: 'test123456',
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.source, 'local-dev-fallback')
    assert.equal(payload.user.email, 'dianawu1202@gmail.com')
    assert.equal(payload.credits.balance, 1000)
    assert.equal((await readFile(tokenFile, 'utf8')).trim(), 'toolaze-local-dev-session')
    assert.match(response.headers.get('set-cookie') || '', /^toolaze_session=toolaze-local-dev-session;/)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test('dev login falls back to local test account when saved session token is no longer valid upstream', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-dev-login-'))
  const tokenFile = join(dir, 'token.txt')
  await writeFile(tokenFile, 'expired-token\n', 'utf8')
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json({ user: null })
  const { POST } = await loadRoute(tokenFile, join(dir, 'state.json'))

  try {
    const response = await POST(createRequest({
      email: 'dianawu1202@gmail.com',
      password: 'test123456',
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.source, 'local-dev-fallback')
    assert.equal(payload.user.email, 'dianawu1202@gmail.com')
    assert.equal(payload.credits.balance, 1000)
    assert.equal((await readFile(tokenFile, 'utf8')).trim(), 'toolaze-local-dev-session')
    assert.match(response.headers.get('set-cookie') || '', /^toolaze_session=toolaze-local-dev-session;/)
  } finally {
    globalThis.fetch = originalFetch
    await rm(dir, { recursive: true, force: true })
  }
})

test('dev login prefers local test account when requested', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'toolaze-dev-login-'))
  const tokenFile = join(dir, 'token.txt')
  await writeFile(tokenFile, 'valid-token\n', 'utf8')
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json({
    user: { email: 'dianawu1202@gmail.com' },
    credits: { balance: 123 },
  })
  const { POST } = await loadRoute(tokenFile, join(dir, 'state.json'))

  try {
    const response = await POST(createRequest({
      email: 'dianawu1202@gmail.com',
      password: 'test123456',
      preferLocal: true,
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.source, 'local-dev-fallback')
    assert.equal(payload.credits.balance, 1000)
    assert.equal((await readFile(tokenFile, 'utf8')).trim(), 'toolaze-local-dev-session')
    assert.match(response.headers.get('set-cookie') || '', /^toolaze_session=toolaze-local-dev-session;/)
  } finally {
    globalThis.fetch = originalFetch
    await rm(dir, { recursive: true, force: true })
  }
})
