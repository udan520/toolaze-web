import assert from 'node:assert/strict'
import test from 'node:test'

async function loadRoute() {
  return import(`./route.js?test=${Date.now()}-${Math.random()}`)
}

test('video generator status route treats localhost Host requests on the bind address as local', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  let remoteFetchCalled = false

  globalThis.fetch = async () => {
    remoteFetchCalled = true
    return Response.json({ error: 'proxied' }, { status: 418 })
  }

  try {
    const response = await POST(new Request('http://0.0.0.0:3016/api/ai-video-generator/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Host: 'localhost:3016',
      },
      body: JSON.stringify({}),
    }))
    const payload = await response.json()

    assert.equal(response.status, 400)
    assert.equal(payload.error, 'Task ID is required')
    assert.equal(remoteFetchCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})
