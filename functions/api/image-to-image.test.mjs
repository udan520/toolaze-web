import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './image-to-image.js'
import { onRequest as checkImageGenerationStatus } from './image-to-image/status.js'

function createGenerationRequest(overrides = {}) {
  const formData = new FormData()
  formData.append(
    'prompt',
    Object.prototype.hasOwnProperty.call(overrides, 'prompt')
      ? String(overrides.prompt || '')
      : 'Change the hair color to rose pink.',
  )
  formData.append('aspectRatio', overrides.aspectRatio || 'auto')
  formData.append('resolution', overrides.resolution || '1K')
  if (overrides.quality) {
    formData.append('quality', overrides.quality)
  }
  if (overrides.duration) {
    formData.append('duration', String(overrides.duration))
  }
  formData.append('isImageToImage', String(overrides.isImageToImage ?? true))
  formData.append('model', overrides.model || 'gpt-image-2')
  if (overrides.toolSlug) {
    formData.append('toolSlug', overrides.toolSlug)
  }
  if (overrides.toolLabel) {
    formData.append('toolLabel', overrides.toolLabel)
  }
  if (overrides.imageUrls !== false) {
    const imageUrls = Array.isArray(overrides.imageUrls)
      ? overrides.imageUrls
      : ['https://example.com/reference.png']
    formData.append('imageUrls', JSON.stringify(imageUrls))
  }

  return new Request('http://localhost:3016/api/image-to-image', {
    method: 'POST',
    body: formData,
  })
}

for (const scenario of [
  {
    name: 'GPT Image 1.5 text-to-image',
    model: 'gpt-image-1-5',
    providerModel: 'gpt-image/1.5-text-to-image',
    isImageToImage: false,
    setting: { quality: 'high' },
  },
  {
    name: 'GPT Image 1.5 image-to-image',
    model: 'gpt-image-1-5',
    providerModel: 'gpt-image/1.5-image-to-image',
    isImageToImage: true,
    setting: { quality: 'medium' },
  },
  {
    name: 'Flux 2 Pro text-to-image',
    model: 'flux-2-pro',
    providerModel: 'flux-2/pro-text-to-image',
    isImageToImage: false,
    setting: { resolution: '2K' },
  },
  {
    name: 'Flux 2 Pro image-to-image',
    model: 'flux-2-pro',
    providerModel: 'flux-2/pro-image-to-image',
    isImageToImage: true,
    setting: { resolution: '1K' },
  },
  {
    name: 'Flux 2 Flex text-to-image',
    model: 'flux-2-flex',
    providerModel: 'flux-2/flex-text-to-image',
    isImageToImage: false,
    setting: { resolution: '1K' },
  },
  {
    name: 'Flux 2 Flex image-to-image',
    model: 'flux-2-flex',
    providerModel: 'flux-2/flex-image-to-image',
    isImageToImage: true,
    setting: { resolution: '2K' },
  },
  {
    name: 'Grok 1.5 Image text-to-image',
    model: 'grok-1-5-image',
    providerModel: 'grok-imagine/text-to-image',
    isImageToImage: false,
    setting: { resolution: '1K' },
  },
  {
    name: 'Grok 1.5 Image image-to-image',
    model: 'grok-1-5-image',
    providerModel: 'grok-imagine/image-to-image',
    isImageToImage: true,
    setting: { resolution: '1K' },
    forwardsAspectRatio: false,
  },
  {
    name: 'Nano Banana 2 Lite image-to-image',
    model: 'nano-banana-2-lite',
    providerModel: 'nano-banana-2-lite',
    isImageToImage: true,
    setting: { resolution: '4K' },
    expectedResolution: '1K',
    expectedCredits: 10,
  },
]) {
  test(`${scenario.name} uses the exact KIE Market contract`, async () => {
    const originalFetch = globalThis.fetch
    let requestBody = null

    globalThis.fetch = async (_url, init) => {
      requestBody = JSON.parse(String(init.body))
      return Response.json({ code: 200, data: { taskId: 'task_new_image_model' } })
    }

    try {
      const response = await onRequest({
        request: createGenerationRequest({
          model: scenario.model,
          isImageToImage: scenario.isImageToImage,
          imageUrls: scenario.isImageToImage ? ['https://example.com/reference.png'] : false,
          aspectRatio: '1:1',
          ...scenario.setting,
        }),
        env: { KIE_AI_API_KEY: 'test-key' },
      })
      const payload = await response.clone().json()

      assert.equal(response.status, 200)
      assert.equal(requestBody.model, scenario.providerModel)
      assert.equal(requestBody.input.prompt, 'Change the hair color to rose pink.')
      assert.equal(requestBody.input.aspect_ratio, scenario.forwardsAspectRatio === false ? undefined : '1:1')
      if (scenario.model === 'gpt-image-1-5') {
        assert.equal(requestBody.input.quality, scenario.setting.quality)
        assert.equal(requestBody.input.resolution, undefined)
      } else if (scenario.model !== 'grok-1-5-image') {
        assert.equal(requestBody.input.resolution, scenario.expectedResolution || scenario.setting.resolution)
        if (scenario.expectedCredits) {
          assert.equal(payload.requiredCredits, scenario.expectedCredits)
        }
        if (scenario.model.startsWith('flux-')) {
          assert.equal(requestBody.input.nsfw_checker, true)
        } else {
          assert.equal(requestBody.input.nsfw_checker, undefined)
        }
      }
      if (scenario.model === 'grok-1-5-image') {
        assert.deepEqual(
          requestBody.input.image_urls,
          scenario.isImageToImage ? ['https://example.com/reference.png'] : undefined,
        )
      } else if (scenario.model.startsWith('nano-banana')) {
        assert.deepEqual(
          requestBody.input.image_input,
          scenario.isImageToImage ? ['https://example.com/reference.png'] : undefined,
        )
      } else {
        assert.deepEqual(
          requestBody.input.input_urls,
          scenario.isImageToImage ? ['https://example.com/reference.png'] : undefined,
        )
      }
    } finally {
      globalThis.fetch = originalFetch
    }
  })
}

test('new image models reject invalid settings before calling KIE', async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0
  globalThis.fetch = async () => {
    fetchCount += 1
    return Response.json({ code: 200, data: { taskId: 'should_not_exist' } })
  }

  try {
    for (const overrides of [
      { model: 'gpt-image-1-5', quality: 'ultra', aspectRatio: '1:1', isImageToImage: false, imageUrls: false },
      { model: 'gpt-image-1-5', quality: 'medium', aspectRatio: '16:9', isImageToImage: false, imageUrls: false },
      { model: 'flux-2-pro', resolution: '4K', aspectRatio: '1:1', isImageToImage: false, imageUrls: false },
      { model: 'flux-2-flex', resolution: '2K', aspectRatio: '21:9', isImageToImage: false, imageUrls: false },
    ]) {
      const response = await onRequest({
        request: createGenerationRequest(overrides),
        env: { KIE_AI_API_KEY: 'test-key' },
      })
      assert.equal(response.status, 400)
    }
    assert.equal(fetchCount, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('KIE image models reject reference counts and resolutions beyond audited limits', async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0
  globalThis.fetch = async () => {
    fetchCount += 1
    return Response.json({ code: 200, data: { taskId: 'should_not_exist' } })
  }

  try {
    const cases = [
      {
        overrides: {
          model: 'nano-banana-2-lite',
          isImageToImage: true,
          imageUrls: Array.from({ length: 11 }, (_, index) => `https://example.com/nano-lite-${index}.png`),
        },
        expectedError: 'Maximum 10 images allowed',
      },
      {
        overrides: {
          model: 'seedream-5-0-pro',
          isImageToImage: true,
          imageUrls: Array.from({ length: 11 }, (_, index) => `https://example.com/seedream-pro-${index}.png`),
        },
        expectedError: 'Maximum 10 images allowed',
      },
      {
        overrides: {
          model: 'grok-1-5-image',
          isImageToImage: false,
          imageUrls: false,
          resolution: '2K',
        },
        expectedError: 'Resolution must be 1K for Grok 1.5 Image',
      },
    ]

    for (const testCase of cases) {
      const response = await onRequest({
        request: createGenerationRequest(testCase.overrides),
        env: { KIE_AI_API_KEY: 'test-key' },
      })
      const payload = await response.json()

      assert.equal(response.status, 400)
      assert.equal(payload.error, testCase.expectedError)
    }
    assert.equal(fetchCount, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('unknown image models are rejected instead of falling back to Nano Banana Pro', async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0
  globalThis.fetch = async () => {
    fetchCount += 1
    return Response.json({ code: 200, data: { taskId: 'should_not_exist' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'future-image-model',
        isImageToImage: false,
        imageUrls: false,
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 400)
    assert.equal(payload.error, 'Unsupported image model.')
    assert.equal(fetchCount, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

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

function createUnauthenticatedDb() {
  return {
    prepare() {
      return {
        bind() {
          return {
            async first() {
              return null
            },
          }
        },
      }
    },
  }
}

function createTaskOwnershipDb({ taskId = 'owned_task' } = {}) {
  return {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first() {
              const normalized = sql.replace(/\s+/g, ' ').toLowerCase()
              if (normalized.includes('from sessions') && normalized.includes('join users')) {
                return {
                  id: 'user_owner',
                  email: 'owner@example.com',
                  name: 'Owner',
                  avatar_url: null,
                  session_id: 'sess_owner',
                  expires_at: new Date(Date.now() + 60_000).toISOString(),
                }
              }
              if (normalized.includes('from credit_consumptions') && normalized.includes('join credit_transactions')) {
                return {
                  id: values[0],
                  user_id: values[1],
                  transaction_id: 'credit_txn_owner',
                  metadata: JSON.stringify({ taskId }),
                }
              }
              return null
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

test('AI Zine Poster Generator compiles uploaded reference into a skill prompt before KIE generation', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls = []
  let kieRequestBody = null

  globalThis.fetch = async (url, init) => {
    fetchCalls.push(String(url))
    if (String(url) === 'https://api.openai.com/v1/responses') {
      return Response.json({
        output: [
          {
            content: [
              {
                type: 'output_text',
                text: JSON.stringify({
                  subjectType: 'landscape',
                  mainSubject: 'seaside cliffs and calm blue water',
                  visualFragment: 'a long narrow horizon strip',
                  moodHints: ['seaside', 'quiet', 'memory'],
                  dominantColors: ['blue', 'sand', 'gray'],
                  suggestedShortText: 'quiet is enough.',
                  safetyNotes: [],
                }),
              },
            ],
          },
        ],
      })
    }

    kieRequestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_zine_compiled' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        prompt: '',
        toolSlug: 'ai-zine-poster-generator',
        toolLabel: 'AI Zine Poster Generator',
        imageUrls: ['https://assets.toolaze.com/uploads/reference-seaside.webp'],
        aspectRatio: '9:16',
      }),
      env: {
        OPENAI_API_KEY: 'openai-test-key',
        ZINE_POSTER_VISION_MODEL: 'gpt-test-vision',
        KIE_AI_API_KEY: 'kie-test-key',
      },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(fetchCalls, [
      'https://api.openai.com/v1/responses',
      'https://api.kie.ai/api/v1/jobs/createTask',
    ])
    assert.equal(kieRequestBody.model, 'gpt-image-2-image-to-image')
    assert.deepEqual(kieRequestBody.input.input_urls, ['https://assets.toolaze.com/uploads/reference-seaside.webp'])
    assert.match(kieRequestBody.input.prompt, /seaside cliffs and calm blue water/i)
    assert.match(kieRequestBody.input.prompt, /quiet is enough\./i)
    assert.match(kieRequestBody.input.prompt, /70% to 90%/)
    assert.match(kieRequestBody.input.prompt, /Avoid full-bleed/i)
    assert.doesNotMatch(kieRequestBody.input.prompt, /Change the hair color/i)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI Zine Poster Generator falls back to deterministic compiler when OpenAI vision is not configured', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls = []
  let kieRequestBody = null

  globalThis.fetch = async (url, init) => {
    fetchCalls.push(String(url))
    kieRequestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_zine_fallback' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        prompt: '',
        toolSlug: 'ai-zine-poster-generator',
        imageUrls: ['https://assets.toolaze.com/uploads/reference-object.webp'],
      }),
      env: { KIE_AI_API_KEY: 'kie-test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(fetchCalls, ['https://api.kie.ai/api/v1/jobs/createTask'])
    assert.match(kieRequestBody.input.prompt, /the clearest subject in the uploaded reference image/i)
    assert.match(kieRequestBody.input.prompt, /70% to 90%/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI Zine Poster Generator checks account credits before OpenAI vision analysis', async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0

  globalThis.fetch = async () => {
    fetchCount += 1
    return Response.json({ code: 200, data: { taskId: 'should_not_start' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        prompt: '',
        toolSlug: 'ai-zine-poster-generator',
        imageUrls: ['https://assets.toolaze.com/uploads/reference-before-auth.webp'],
      }),
      env: {
        OPENAI_API_KEY: 'openai-test-key',
        KIE_AI_API_KEY: 'kie-test-key',
        DB: createUnauthenticatedDb(),
      },
    })
    const payload = await response.json()

    assert.equal(response.status, 401)
    assert.equal(payload.error, 'Please sign in with Google to generate images.')
    assert.equal(fetchCount, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Photo Abstract Generator compiles the uploaded photo into the full editorial prompt before KIE generation', async () => {
  const originalFetch = globalThis.fetch
  const fetchCalls = []
  let kieRequestBody = null

  globalThis.fetch = async (url, init) => {
    fetchCalls.push(String(url))
    if (String(url) === 'https://api.openai.com/v1/responses') {
      return Response.json({
        output: [{
          content: [{
            type: 'output_text',
            text: JSON.stringify({
              orientation: 'landscape',
              subjectType: 'landscape',
              spatialFacts: [
                'a low horizon crosses the upper third',
                'two dark cliffs frame a pale opening',
                'the brightest water sits right of center',
              ],
              structuralAxes: ['low horizontal horizon'],
              movementDirection: 'left to right toward open water',
              spatialRhythm: 'two dense masses separated by a wide pause',
              tonalHierarchy: 'dark stone around pale water and sky',
              negativeSpace: 'open sky and water between the cliffs',
              colorRoles: {
                dominant: 'muted sea blue',
                dark: 'charcoal stone',
                light: 'warm cloud white',
                accents: ['rust brown'],
              },
              suggestedTitle: 'Between Quiet Cliffs',
              safetyNotes: [],
            }),
          }],
        }],
      })
    }

    kieRequestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_photo_abstract_compiled' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        prompt: 'old condensed fallback prompt',
        toolSlug: 'ai-photo-abstract-poster-generator',
        toolLabel: 'Photo Abstract Poster Generator',
        imageUrls: ['https://assets.toolaze.com/uploads/photo-abstract-source.webp'],
        aspectRatio: '9:16',
      }),
      env: {
        OPENAI_API_KEY: 'openai-test-key',
        PHOTO_ABSTRACT_VISION_MODEL: 'gpt-photo-vision',
        KIE_AI_API_KEY: 'kie-test-key',
      },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(fetchCalls, [
      'https://api.openai.com/v1/responses',
      'https://api.kie.ai/api/v1/jobs/createTask',
    ])
    assert.equal(kieRequestBody.model, 'gpt-image-2-image-to-image')
    assert.deepEqual(kieRequestBody.input.input_urls, ['https://assets.toolaze.com/uploads/photo-abstract-source.webp'])
    assert.match(kieRequestBody.input.prompt, /vertical editorial diptych/i)
    assert.match(kieRequestBody.input.prompt, /Between Quiet Cliffs/)
    assert.match(kieRequestBody.input.prompt, /#F3F0E8/)
    assert.doesNotMatch(kieRequestBody.input.prompt, /old condensed fallback prompt/i)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Photo Abstract Generator falls back deterministically when visual analysis is unavailable', async () => {
  const originalFetch = globalThis.fetch
  const submittedPrompts = []

  globalThis.fetch = async (_url, init) => {
    submittedPrompts.push(JSON.parse(String(init.body)).input.prompt)
    return Response.json({ code: 200, data: { taskId: `task_photo_abstract_${submittedPrompts.length}` } })
  }

  try {
    for (let index = 0; index < 2; index += 1) {
      const response = await onRequest({
        request: createGenerationRequest({
          prompt: '',
          toolSlug: 'ai-photo-abstract-poster-generator',
          imageUrls: ['https://assets.toolaze.com/uploads/photo-abstract-fallback.webp'],
        }),
        env: { KIE_AI_API_KEY: 'kie-test-key' },
      })
      assert.equal(response.status, 200)
    }

    assert.equal(submittedPrompts.length, 2)
    assert.equal(submittedPrompts[0], submittedPrompts[1])
    assert.match(submittedPrompts[0], /three to six observable spatial facts/i)
    assert.match(submittedPrompts[0], /vertical editorial diptych/i)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Photo Abstract Generator checks account credits before visual analysis', async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0

  globalThis.fetch = async () => {
    fetchCount += 1
    return Response.json({ code: 200, data: { taskId: 'should_not_start' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        prompt: '',
        toolSlug: 'ai-photo-abstract-poster-generator',
        imageUrls: ['https://assets.toolaze.com/uploads/photo-abstract-before-auth.webp'],
      }),
      env: {
        OPENAI_API_KEY: 'openai-test-key',
        KIE_AI_API_KEY: 'kie-test-key',
        DB: createUnauthenticatedDb(),
      },
    })
    const payload = await response.json()

    assert.equal(response.status, 401)
    assert.equal(payload.error, 'Please sign in with Google to generate images.')
    assert.equal(fetchCount, 0)
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

test('Grok 1.5 image requests use the official text-to-image provider model id', async () => {
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
    assert.equal(requestBody.model, 'grok-imagine/text-to-image')
    assert.equal(requestBody.input.image_urls, undefined)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Grok 1.5 image-to-image follows the reference shape instead of forwarding a fake ratio', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null

  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_grok_reference_shape' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-1-5-image',
        isImageToImage: true,
        aspectRatio: '16:9',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(requestBody.model, 'grok-imagine/image-to-image')
    assert.equal(requestBody.input.aspect_ratio, undefined)
    assert.deepEqual(requestBody.input.image_urls, ['https://example.com/reference.png'])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Grok 1.5 text-to-image keeps forwarding supported custom ratios', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null

  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_grok_custom_ratio' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-1-5-image',
        isImageToImage: false,
        imageUrls: false,
        aspectRatio: '16:9',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(requestBody.model, 'grok-imagine/text-to-image')
    assert.equal(requestBody.input.aspect_ratio, '16:9')
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

test('Grok Video 1.5 image-to-video requests forward up to seven image URLs to KIE', async () => {
  const originalFetch = globalThis.fetch
  let requestBody = null
  const imageUrls = Array.from({ length: 7 }, (_, index) => `https://example.com/reference-${index + 1}.png`)

  globalThis.fetch = async (_url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ code: 200, data: { taskId: 'task_video_multi_image' } })
  }

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-video-1-5',
        aspectRatio: '16:9',
        resolution: '480p',
        imageUrls,
      }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(requestBody.model, 'grok-imagine-video-1-5-preview')
    assert.deepEqual(requestBody.input.image_urls, imageUrls)
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
    assert.equal(payload.requiredCredits, 90)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('provider balance failures are identified as upstream errors instead of user credit errors', async () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => Response.json(
    { code: 402, message: 'Insufficient balance. Please recharge your provider account.' },
    { status: 402 },
  )

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'grok-video-1-5',
        resolution: '480p',
      }),
      env: { CREEM_API_KEY: 'creem-test-key', KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 402)
    assert.equal(payload.code, 'UPSTREAM_GENERATION_ERROR')
    assert.equal(
      payload.error,
      'The generation service is temporarily unavailable. Please try again later.',
    )
    assert.doesNotMatch(payload.error, /balance|provider|recharge/i)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('plain-text upstream task errors do not expose consumed body failures', async () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => new Response('upstream task gateway failed', {
    status: 502,
    headers: { 'Content-Type': 'text/plain' },
  })

  try {
    const response = await onRequest({
      request: createGenerationRequest({
        model: 'gpt-image-2',
        isImageToImage: true,
        imageUrls: ['https://example.com/watermarked.png'],
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 502)
    assert.equal(payload.code, 'UPSTREAM_GENERATION_ERROR')
    assert.equal(payload.error, 'The generation service is temporarily unavailable. Please try again later.')
    assert.doesNotMatch(JSON.stringify(payload), /Body has already been used|tee\(\)/i)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('plain-text upstream status errors do not expose consumed body failures', async () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => new Response('upstream status gateway failed', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  })

  try {
    const response = await checkImageGenerationStatus({
      request: new Request('http://localhost:3016/api/image-to-image/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: 'task_watermark_status' }),
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 503)
    assert.equal(payload.error, 'upstream status gateway failed')
    assert.doesNotMatch(JSON.stringify(payload), /Body has already been used|tee\(\)/i)
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
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'toolaze_session=owner-session',
        },
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
      env: { KIE_AI_API_KEY: 'test-key', DB: createTaskOwnershipDb({ taskId: 'task_video' }) },
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

test('image generation status rejects unauthenticated checks before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false

  globalThis.fetch = async () => {
    providerCalled = true
    return Response.json({
      data: {
        state: 'success',
        resultJson: JSON.stringify({ resultUrls: ['https://example.com/output.webp'] }),
      },
    })
  }

  try {
    const response = await checkImageGenerationStatus({
      request: new Request('http://localhost:3016/api/image-to-image/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: 'task_image' }),
      }),
      env: { KIE_AI_API_KEY: 'test-key', DB: createUnauthenticatedDb() },
    })
    const payload = await response.json()

    assert.equal(response.status, 401)
    assert.equal(payload.error, 'Please sign in with Google to check generation status.')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('image generation status rejects task ids not bound to the current account', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false

  globalThis.fetch = async () => {
    providerCalled = true
    return Response.json({
      data: {
        state: 'success',
        resultJson: JSON.stringify({ resultUrls: ['https://example.com/victim.webp'] }),
      },
    })
  }

  try {
    const response = await checkImageGenerationStatus({
      request: new Request('http://localhost:3016/api/image-to-image/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'toolaze_session=owner-session',
        },
        body: JSON.stringify({
          taskId: 'victim_task',
          creditHold: {
            provider: 'credit-ledger',
            taskId: 'victim_task',
            consumptionId: 'credit_cons_owner',
            requiredCredits: 20,
            model: 'gpt-image-2',
            isImageToImage: false,
            mediaType: 'image',
          },
        }),
      }),
      env: { KIE_AI_API_KEY: 'test-key', DB: createTaskOwnershipDb({ taskId: 'owned_task' }) },
    })
    const payload = await response.json()

    assert.equal(response.status, 403)
    assert.equal(payload.error, 'Generation task is not available for this account.')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('image generation status prefers the video in Kie resultUrls over its thumbnail', async () => {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => {
    return Response.json({
      data: {
        state: 'success',
        resultJson: JSON.stringify({
          resultUrls: [
            'https://example.com/kissing-thumbnail.jpeg',
            'https://example.com/kissing-result.mp4',
          ],
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
          taskId: 'task_kissing_video',
          creditHold: {
            provider: 'credit-ledger',
            taskId: 'task_kissing_video',
            consumptionId: 'consume_kissing_video',
            requiredCredits: 25,
            model: 'grok-video-1-5',
            isImageToImage: true,
            mediaType: 'video',
          },
        }),
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.status, 'SUCCEEDED')
    assert.equal(payload.videoUrl, 'https://example.com/kissing-result.mp4')
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
