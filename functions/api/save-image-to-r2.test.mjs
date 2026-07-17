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
    assert.match(body.url, /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/generated\/.+\.webp$/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
