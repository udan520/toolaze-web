import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './image-to-image.js'

function createGenerationRequest(overrides = {}) {
  const formData = new FormData()
  formData.append('prompt', overrides.prompt || 'Change the hair color to rose pink.')
  formData.append('aspectRatio', overrides.aspectRatio || 'auto')
  formData.append('resolution', overrides.resolution || '1K')
  formData.append('isImageToImage', String(overrides.isImageToImage ?? true))
  formData.append('model', overrides.model || 'gpt-image-2')
  if (overrides.imageUrls !== false) {
    formData.append('imageUrls', JSON.stringify(['https://example.com/reference.png']))
  }

  return new Request('http://localhost:3016/api/image-to-image', {
    method: 'POST',
    body: formData,
  })
}

test('GPT Image 2 image-to-image requests use the image-to-image provider model', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null
  const fetchUrls = []

  globalThis.fetch = async (url, init) => {
    fetchUrls.push(String(url))
    if (String(url).includes('/v1/moderation/prompt')) {
      return Response.json({ id: 'mod_allow', object: 'moderation_result', decision: 'allow', usage: { units: 1 } })
    }
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_test' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest(),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(fetchUrls[0], 'https://api.creem.io/v1/moderation/prompt')
    assert.equal(requestBody.model, 'gpt-image-2-image-to-image')
    assert.deepEqual(requestBody.input.input_urls, ['https://example.com/reference.png'])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('GPT Image 2 text-to-image requests keep the text-to-image provider model', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null

  globalThis.fetch = async (url, init) => {
    if (String(url).includes('/v1/moderation/prompt')) {
      return Response.json({ id: 'mod_allow', object: 'moderation_result', decision: 'allow', usage: { units: 1 } })
    }
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_test' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({ isImageToImage: false, imageUrls: false }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(requestBody.model, 'gpt-image-2-text-to-image')
    assert.equal(requestBody.input.input_urls, undefined)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Creem moderation denial blocks image generation before provider request', async () => {
  const originalFetch = globalThis.fetch
  const fetchUrls = []

  globalThis.fetch = async (url) => {
    fetchUrls.push(String(url))
    return Response.json({ id: 'mod_deny', object: 'moderation_result', decision: 'deny', usage: { units: 1 } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({ prompt: 'blocked prompt' }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
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
