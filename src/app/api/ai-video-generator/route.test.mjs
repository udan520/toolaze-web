import assert from 'node:assert/strict'
import test from 'node:test'

async function loadRoute() {
  return import(`./route.js?test=${Date.now()}-${Math.random()}`)
}

test('video generator route treats localhost Host requests on the bind address as local', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  let remoteFetchCalled = false

  globalThis.fetch = async () => {
    remoteFetchCalled = true
    return Response.json({ error: 'proxied' }, { status: 418 })
  }

  try {
    const body = new FormData()
    body.set('model', 'kling-2-6-motion-control')
    body.set('mode', 'image-to-video')
    body.set('imageUrl', 'https://example.com/character.webp')

    const response = await POST(new Request('http://0.0.0.0:3016/api/ai-video-generator', {
      method: 'POST',
      headers: { Host: 'localhost:3016' },
      body,
    }))
    const payload = await response.json()

    assert.equal(response.status, 400)
    assert.equal(payload.error, 'Kling 2.6 Motion Control requires one motion reference video URL')
    assert.equal(remoteFetchCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})
