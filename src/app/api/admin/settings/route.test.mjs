import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
const tempStateDir = mkdtempSync(join(tmpdir(), 'toolaze-admin-settings-route-test-'))
process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(tempStateDir, 'state.json')

test.after(() => {
  if (previousStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
  }
  delete globalThis[Symbol.for('toolaze.localRuntimeSettings')]
  rmSync(tempStateDir, { recursive: true, force: true })
})

import { GET, POST } from './route.js'

test('production admin settings API is hidden behind a 404', async () => {
  const response = await GET(new Request('https://toolaze.com/api/admin/settings', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }))

  assert.equal(response.status, 404)
})

test('localhost admin settings API reads and updates local settings', async () => {
  const readResponse = await GET(new Request('http://localhost:3010/api/admin/settings', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }))
  const readPayload = await readResponse.json()

  assert.equal(readResponse.status, 200)
  assert.equal(readPayload.settings.creemPromptModerationEnabled, false)

  const updateResponse = await POST(new Request('http://localhost:3010/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'toolaze-local-dev-admin',
    },
    body: JSON.stringify({ creemPromptModerationEnabled: false }),
  }))
  const updatePayload = await updateResponse.json()

  assert.equal(updateResponse.status, 200)
  assert.equal(updatePayload.settings.creemPromptModerationEnabled, false)

  const rereadResponse = await GET(new Request('http://localhost:3010/api/admin/settings', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }))
  const rereadPayload = await rereadResponse.json()

  assert.equal(rereadPayload.settings.creemPromptModerationEnabled, false)
})


test('localhost admin settings API proxies production settings with the server admin token', async () => {
  const previousToken = process.env.REWARD_REVIEW_ADMIN_TOKEN
  const originalFetch = globalThis.fetch
  process.env.REWARD_REVIEW_ADMIN_TOKEN = 'production-admin-token'

  let proxiedRequest = null
  globalThis.fetch = async (target, init = {}) => {
    proxiedRequest = {
      url: String(target),
      method: init.method,
      headers: new Headers(init.headers),
    }
    return Response.json({
      settings: { creemPromptModerationEnabled: false },
      meta: { source: 'database', reason: 'disabled_by_admin' },
    })
  }

  try {
    const response = await GET(new Request('http://localhost:3010/api/admin/settings?source=production', {
      headers: {
        'x-admin-token': 'toolaze-local-dev-admin',
      },
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.settings.creemPromptModerationEnabled, false)
    assert.equal(proxiedRequest.url, 'https://toolaze-web.pages.dev/api/admin/settings')
    assert.equal(proxiedRequest.method, 'GET')
    assert.equal(proxiedRequest.headers.get('x-admin-token'), 'production-admin-token')
    assert.equal(proxiedRequest.headers.get('host'), null)
  } finally {
    globalThis.fetch = originalFetch
    if (previousToken === undefined) {
      delete process.env.REWARD_REVIEW_ADMIN_TOKEN
    } else {
      process.env.REWARD_REVIEW_ADMIN_TOKEN = previousToken
    }
  }
})
