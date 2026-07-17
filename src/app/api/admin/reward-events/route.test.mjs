import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
const tempStateDir = mkdtempSync(join(tmpdir(), 'toolaze-admin-route-test-'))
process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(tempStateDir, 'state.json')

test.after(() => {
  if (previousStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
  }
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
  rmSync(tempStateDir, { recursive: true, force: true })
})

import { GET } from './route.js'

test('production admin reward events API is hidden behind a 404', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => Response.json({ ok: true, items: [] })

  try {
    const response = await GET(new Request('https://toolaze.com/api/admin/reward-events', {
      headers: {
        'x-admin-token': 'toolaze-local-dev-admin',
      },
    }))

    assert.equal(response.status, 404)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('localhost admin reward events API remains available for local review', async () => {
  const response = await GET(new Request('http://localhost:3010/api/admin/reward-events?reason=all', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }))
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.ok(Array.isArray(payload.items))
})
