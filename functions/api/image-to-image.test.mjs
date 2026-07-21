import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './image-to-image.js'
import { onRequest as checkImageGenerationStatus } from './image-to-image/status.js'

function createGenerationRequest(overrides = {}) {
  const formData = new FormData()
  formData.append('prompt', overrides.prompt || 'Change the hair color to rose pink.')
  formData.append('aspectRatio', overrides.aspectRatio || 'auto')
  formData.append('resolution', overrides.resolution || '1K')
  if (overrides.duration) {
    formData.append('duration', String(overrides.duration))
  }
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

function createModerationSettingsDb(enabled = true) {
  const value = enabled ? 'true' : 'false'
  return {
    prepare() {
      return {
        bind() {
          return {
            async first() {
              return { value }
            },
          }
        },
      }
    },
  }
}

test('GPT Image 2 image-to-image requests use the image-to-image provider model', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null
  const fetchUrls = []

  globalThis.fetch = async (url, init) => {
    fetchUrls.push(String(url))
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_test' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest(),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(fetchUrls[0], 'https://api.kie.ai/api/v1/jobs/createTask')
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

test('Grok 1.5 image requests use the configured provider model id', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null

  globalThis.fetch = async (url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_test' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-1-5-image',
        isImageToImage: false,
        imageUrls: false,
      }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(requestBody.model, 'grok-1.5-image')
    assert.equal(requestBody.input.input_urls, undefined)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Grok Video 1.5 image-to-video requests use the KIE preview video model', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null

  globalThis.fetch = async (url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_video' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-video-1-5',
        aspectRatio: '9:16',
        resolution: '720p',
      }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(requestBody.model, 'grok-imagine-video-1-5-preview')
    assert.equal(requestBody.input.prompt, 'Change the hair color to rose pink.')
    assert.equal(requestBody.input.aspect_ratio, '9:16')
    assert.equal(requestBody.input.resolution, '720p')
    assert.equal(requestBody.input.duration, 8)
    assert.deepEqual(requestBody.input.image_urls, ['https://example.com/reference.png'])
    assert.equal(requestBody.input.image_input, undefined)
    assert.equal(requestBody.input.input_urls, undefined)
    assert.equal(payload.mediaType, 'video')
    assert.equal(payload.creditHold, null)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Grok Video 1.5 image-to-video requests forward selected duration and price by duration', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null

  globalThis.fetch = async (url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_video_15s' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-video-1-5',
        aspectRatio: '9:16',
        resolution: '720p',
        duration: 15,
      }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(requestBody.input.duration, 15)
    assert.equal(payload.requiredCredits, 263)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('image generation status returns videoUrl for Grok Video 1.5 results', async () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => {
    return Response.json({
      data: {
        state: 'success',
        resultJson: JSON.stringify({
          resultUrls: ['https://example.com/dance-result.mp4'],
        }),
      },
    })
  }

  try {
    const response = await checkImageGenerationStatus({
      request: new Request('http://localhost:3016/api/image-to-image/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: 'task_video',
          creditHold: {
            provider: 'credit-ledger',
            taskId: 'task_video',
            consumptionId: 'consume_video',
            requiredCredits: 80,
            model: 'grok-video-1-5',
            isImageToImage: true,
          },
        }),
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.status, 'SUCCEEDED')
    assert.equal(payload.videoUrl, 'https://example.com/dance-result.mp4')
    assert.equal(payload.imageUrl, undefined)
    assert.equal(payload.mediaType, 'video')
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
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key', DB: createModerationSettingsDb(true) },
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
