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

test('Wan image-to-video requests send duration to KIE as a string and follow the reference image shape', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.KIE_AI_API_KEY
  const calls = []

  process.env.KIE_AI_API_KEY = 'test-key'
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init })
    return Response.json({ code: 200, data: { taskId: 'mock-wan-task' } })
  }

  try {
    const body = new FormData()
    body.set('model', 'wan-2-6')
    body.set('mode', 'image-to-video')
    body.set('prompt', 'Animate the uploaded portrait with slow camera movement.')
    body.set('imageUrl', 'https://example.com/reference.png')
    body.set('aspectRatio', '16:9')
    body.set('resolution', '720p')
    body.set('duration', '5')

    const response = await POST(new Request('http://0.0.0.0:3016/api/ai-video-generator', {
      method: 'POST',
      headers: { Host: 'localhost:3016' },
      body,
    }))
    const payload = await response.json()
    const submitted = JSON.parse(calls[0].init.body)

    assert.equal(response.status, 200)
    assert.equal(payload.taskId, 'mock-wan-task')
    assert.equal(submitted.model, 'wan/2-6-image-to-video')
    assert.equal(submitted.input.duration, '5')
    assert.equal(typeof submitted.input.duration, 'string')
    assert.deepEqual(submitted.input.image_urls, ['https://example.com/reference.png'])
    assert.equal(submitted.input.aspect_ratio, undefined)
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = previousApiKey
    }
  }
})

test('reference-shaped image-to-video models do not send aspect_ratio to KIE', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.KIE_AI_API_KEY
  const calls = []

  process.env.KIE_AI_API_KEY = 'test-key'
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init })
    return Response.json({ code: 200, data: { taskId: `mock-${calls.length}` } })
  }

  const cases = [
    { model: 'seedance-1-pro-fast', imageKey: 'image_url', resolution: '720p', duration: '5' },
    { model: 'seedance-1-pro', imageKey: 'image_url', resolution: '480p', duration: '5' },
    { model: 'seedance-1-lite', imageKey: 'image_url', resolution: '480p', duration: '5' },
    { model: 'wan-2-5', imageKey: 'image_url', resolution: '720p', duration: '5' },
    { model: 'wan-2-2', imageKey: 'image_url', resolution: '480p', duration: '5' },
    { model: 'kling-2-6-motion-control', imageKey: 'input_urls', resolution: '720p', duration: '5', videoUrl: 'https://example.com/motion.mp4' },
    { model: 'happyhorse-1-1', imageKey: 'image_urls', resolution: '1080p', duration: '5' },
    { model: 'happyhorse', imageKey: 'image_urls', resolution: '1080p', duration: '5' },
  ]

  try {
    for (const item of cases) {
      const body = new FormData()
      body.set('model', item.model)
      body.set('mode', 'image-to-video')
      body.set('prompt', 'Animate the uploaded reference with slow camera movement.')
      body.set('imageUrl', 'https://example.com/reference.png')
      if (item.videoUrl) body.set('videoUrl', item.videoUrl)
      body.set('aspectRatio', '9:16')
      body.set('resolution', item.resolution)
      body.set('duration', item.duration)

      const response = await POST(new Request('http://0.0.0.0:3016/api/ai-video-generator', {
        method: 'POST',
        headers: { Host: 'localhost:3016' },
        body,
      }))
      const payload = await response.json()
      const submitted = JSON.parse(calls.at(-1).init.body)

      assert.equal(response.status, 200, `${item.model}: ${payload.error || 'request failed'}`)
      assert.equal(submitted.input.aspect_ratio, undefined, `${item.model} should follow the uploaded reference shape`)
      if (item.imageKey === 'image_url') assert.equal(submitted.input.image_url, 'https://example.com/reference.png')
      if (item.imageKey === 'image_urls') assert.deepEqual(submitted.input.image_urls, ['https://example.com/reference.png'])
      if (item.imageKey === 'input_urls') assert.deepEqual(submitted.input.input_urls, ['https://example.com/reference.png'])
    }
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = previousApiKey
    }
  }
})
