import assert from 'node:assert/strict'
import test from 'node:test'

async function loadRoute() {
  return import(`./route.js?test=${Date.now()}-${Math.random()}`)
}

test('upload route treats localhost Host requests on the bind address as local', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  let remoteFetchCalled = false

  globalThis.fetch = async () => {
    remoteFetchCalled = true
    return Response.json({ error: 'proxied' }, { status: 418 })
  }

  try {
    const response = await POST(new Request('http://0.0.0.0:3016/api/upload', {
      method: 'POST',
      headers: { Host: 'localhost:3016' },
      body: new FormData(),
    }))
    const payload = await response.json()

    assert.equal(response.status, 400)
    assert.equal(payload.error, 'No file in form (use field: image or file)')
    assert.equal(remoteFetchCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('upload route streams motion-control uploads locally from a neutral browser purpose', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.KIE_AI_API_KEY
  const calls = []

  process.env.KIE_AI_API_KEY = 'test-key'
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init })
    return Response.json({
      success: true,
      code: 200,
      data: {
        fileName: 'motion.mp4',
        filePath: 'toolaze/kling-motion-control/motion.mp4',
        downloadUrl: 'https://tempfile.redpandaai.co/toolaze/kling-motion-control/motion.mp4',
      },
    })
  }

  const body = new FormData()
  body.set('file', new File(['video-bytes'], 'motion.mp4', { type: 'video/mp4' }))
  body.set('uploadPurpose', 'kling-motion-control')

  try {
    const response = await POST(new Request('http://0.0.0.0:3016/api/upload', {
      method: 'POST',
      headers: { Host: 'localhost:3016' },
      body,
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://kieai.redpandaai.co/api/file-stream-upload')
    assert.equal(calls[0].init.headers.Authorization, 'Bearer test-key')
    assert.equal(calls[0].init.body.get('uploadPath'), 'toolaze/kling-motion-control')
    assert.match(payload.uploadRef, /^toolaze-upload-ref:/)
    assert.equal(String(payload.uploadRef).includes('redpandaai'), false)
    assert.equal(String(payload.uploadRef).includes('kieai'), false)
    assert.equal('url' in payload, false)
    assert.equal('key' in payload, false)
    assert.equal('provider' in payload, false)
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = previousApiKey
    }
  }
})

test('upload route returns Kie fileUrl before downloadUrl for local motion-control uploads', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.KIE_AI_API_KEY

  process.env.KIE_AI_API_KEY = 'test-key'
  globalThis.fetch = async () => Response.json({
    success: true,
    code: 200,
    data: {
      fileId: 'file_no_extension',
      fileName: 'character.png',
      filePath: 'toolaze/kling-motion-control/character.png',
      fileUrl: 'https://kieai.redpandaai.co/files/toolaze/kling-motion-control/character.png',
      downloadUrl: 'https://kieai.redpandaai.co/download/file_no_extension',
    },
  })

  const body = new FormData()
  body.set('image', new File(['image-bytes'], 'character.png', { type: 'image/png' }))
  body.set('uploadPurpose', 'kling-motion-control')

  try {
    const response = await POST(new Request('http://0.0.0.0:3016/api/upload', {
      method: 'POST',
      headers: { Host: 'localhost:3016' },
      body,
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.match(payload.uploadRef, /^toolaze-upload-ref:/)
    assert.equal(String(payload.uploadRef).includes('redpandaai'), false)
    assert.equal(String(payload.uploadRef).includes('kieai'), false)
    assert.equal('url' in payload, false)
    assert.equal('key' in payload, false)
    assert.equal('provider' in payload, false)
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = previousApiKey
    }
  }
})

test('upload route rejects unsupported local Kie motion-control image formats before proxying to provider', async () => {
  const { POST } = await loadRoute()
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.KIE_AI_API_KEY
  let fetchCalled = false

  process.env.KIE_AI_API_KEY = 'test-key'
  globalThis.fetch = async () => {
    fetchCalled = true
    return Response.json({ success: true })
  }

  const body = new FormData()
  body.set('image', new File(['image-bytes'], 'character.webp', { type: 'image/webp' }))
  body.set('uploadPurpose', 'kling-motion-control')

  try {
    const response = await POST(new Request('http://0.0.0.0:3016/api/upload', {
      method: 'POST',
      headers: { Host: 'localhost:3016' },
      body,
    }))
    const payload = await response.json()

    assert.equal(response.status, 400)
    assert.equal(fetchCalled, false)
    assert.match(payload.error, /Use JPG or PNG for the Kling 2\.6 Motion Control character image/)
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = previousApiKey
    }
  }
})
