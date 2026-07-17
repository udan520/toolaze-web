import assert from 'node:assert/strict'
import test from 'node:test'
import { GET } from './route.js'

test('local download route returns an attachment response without navigating the page', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response('image-bytes', {
    status: 200,
    headers: { 'content-type': 'image/png' },
  })

  try {
    const response = await GET(new Request(
      'http://localhost:3006/api/download-image?url=https%3A%2F%2Fasset.r2.dev%2Foutput.png&filename=generated.png',
    ))

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'image/png')
    assert.match(response.headers.get('content-disposition') || '', /attachment; filename="generated\.png"/)
    assert.equal(await response.text(), 'image-bytes')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('download route allows KIE generated image result URLs', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response('kie-image-bytes', {
    status: 200,
    headers: { 'content-type': 'image/webp' },
  })

  try {
    const response = await GET(new Request(
      'http://localhost:3006/api/download-image?url=https%3A%2F%2Ftempfile.aiquickdraw.com%2Fgenerated%2Foutput.webp&filename=generated.webp',
    ))

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('content-type'), 'image/webp')
    assert.match(response.headers.get('content-disposition') || '', /attachment; filename="generated\.webp"/)
    assert.equal(await response.text(), 'kie-image-bytes')
  } finally {
    globalThis.fetch = originalFetch
  }
})
