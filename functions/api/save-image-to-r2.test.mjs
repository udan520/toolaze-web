import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './save-image-to-r2.js'

test('save-image-to-r2 falls back to the production R2 public base URL', async () => {
  const originalFetch = globalThis.fetch
  const writes = []
  globalThis.fetch = async () => new Response('image-bytes', {
    status: 200,
    headers: { 'content-type': 'image/webp' },
  })

  try {
    const response = await onRequest({
      request: new Request('https://toolaze.test/api/save-image-to-r2', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'https://tempfile.aiquickdraw.com/generated/output.webp' }),
      }),
      env: {
        MY_BUCKET: {
          put: async (key, blob, options) => {
            writes.push({ key, text: await blob.text(), options })
          },
        },
      },
    })

    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(writes.length, 1)
    assert.equal(writes[0].text, 'image-bytes')
    assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/generated\/.+\.webp$/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('save-image-to-r2 ignores the legacy R2 development base URL', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response('image-bytes', {
    status: 200,
    headers: { 'content-type': 'image/png' },
  })

  try {
    const response = await onRequest({
      request: new Request('https://toolaze.test/api/save-image-to-r2', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'https://tempfile.aiquickdraw.com/generated/output.png' }),
      }),
      env: {
        R2_PUBLIC_BASE_URL: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev',
        MY_BUCKET: {
          put: async () => {},
        },
      },
    })
    const body = await response.json()

    assert.equal(response.status, 200)
    assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/generated\/.+\.png$/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('save-image-to-r2 persists generated videos with video metadata', async () => {
  const originalFetch = globalThis.fetch
  const writes = []
  globalThis.fetch = async () => new Response('video-bytes', {
    status: 200,
    headers: { 'content-type': 'video/mp4' },
  })

  try {
    const response = await onRequest({
      request: new Request('https://toolaze.test/api/save-image-to-r2', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: 'https://tempfile.redpandaai.co/kieai/231516/toolaze/generated-output.mp4',
          mediaType: 'video',
        }),
      }),
      env: {
        MY_BUCKET: {
          put: async (key, blob, options) => {
            writes.push({ key, text: await blob.text(), options })
          },
        },
      },
    })

    const body = await response.json()

    assert.equal(response.status, 200)
    assert.equal(writes.length, 1)
    assert.equal(writes[0].text, 'video-bytes')
    assert.equal(writes[0].options.httpMetadata.contentType, 'video/mp4')
    assert.match(writes[0].key, /^generated\/.+\.mp4$/)
    assert.equal(body.mediaType, 'video')
    assert.match(body.url, /^https:\/\/assets\.toolaze\.com\/generated\/.+\.mp4$/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
