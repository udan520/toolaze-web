import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './qwen-image-edit.js'

function createQwenImageEditRequest(overrides = {}) {
  const formData = new FormData()
  formData.append('model', 'nano-banana')
  formData.append('prompt', overrides.prompt || 'restore the image with natural lighting')
  formData.append('image', new Blob(['fake image bytes'], { type: 'image/png' }), 'reference.png')

  return new Request('http://localhost:3016/api/qwen-image-edit', {
    method: 'POST',
    body: formData,
  })
}

test('Creem moderation denial blocks qwen image edit before provider request', async () => {
  const originalFetch = globalThis.fetch
  const fetchUrls = []

  globalThis.fetch = async (url) => {
    fetchUrls.push(String(url))
    return Response.json({ id: 'mod_deny', object: 'moderation_result', decision: 'deny', usage: { units: 1 } })
  }

  try {
    const response = await onRequest({
      request: createQwenImageEditRequest({ prompt: 'blocked prompt' }),
      env: { CREEM_API_KEY: 'creem-test-key', ZHEN_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 400)
    assert.equal(payload.error, 'This prompt cannot be generated. Please try a different idea.')
    assert.equal(payload.moderation.decision, 'deny')
    assert.deepEqual(fetchUrls, ['https://api.creem.io/v1/moderation/prompt'])
  } finally {
    globalThis.fetch = originalFetch
  }
})
