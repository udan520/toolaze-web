import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest as createVideoTask } from './ai-video-generator.js'
import { onRequest as getVideoTaskStatus } from './ai-video-generator/status.js'

type FetchCall = {
  url: string
  init?: RequestInit
}

function createFormRequest(fields: Record<string, string>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value)
  }

  return new Request('https://toolaze.test/api/ai-video-generator', {
    method: 'POST',
    body: formData,
  })
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, any>>
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
    prepare(sql: string) {
      return {
        bind(...values: any[]) {
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

test('AI video generator rejects requests without a prompt', async () => {
  const response = await createVideoTask({
    request: createFormRequest({ mode: 'text-to-video' }),
    env: { KIE_AI_API_KEY: 'test-key' },
  })

  assert.equal(response.status, 400)
  assert.equal((await readJson(response)).error, 'Prompt is required')
})

test('AI video generator requires image URLs for image-to-video', async () => {
  const response = await createVideoTask({
    request: createFormRequest({
      mode: 'image-to-video',
      prompt: 'Animate the product photo with a slow push-in.',
    }),
    env: { KIE_AI_API_KEY: 'test-key' },
  })

  assert.equal(response.status, 400)
  assert.equal((await readJson(response)).error, 'Image-to-video requires at least one image URL')
})

test('AI video generator rejects unauthenticated generation before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'unexpected_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'seedance-2',
        prompt: 'A valid video prompt that must not reach KIE while signed out.',
        aspectRatio: '16:9',
        resolution: '480p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key', DB: createUnauthenticatedDb() },
    })

    assert.equal(response.status, 401)
    assert.equal((await readJson(response)).error, 'Please sign in with Google to generate videos.')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator creates a Kie Grok 1.5 image-to-video task', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_123' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        model: 'grok-1-5-video',
        prompt: 'Reference image as identity lock, subtle motion, cinematic lighting.',
        imageUrls: JSON.stringify(['https://cdn.example.com/input.png']),
        aspectRatio: 'auto',
        resolution: '480p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), { taskId: 'task_123', requiredCredits: 15 })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.kie.ai/api/v1/jobs/createTask')
    assert.equal(calls[0].init?.method, 'POST')
    assert.equal((calls[0].init?.headers as Record<string, string>).Authorization, 'Bearer test-key')

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.deepEqual(payload, {
      model: 'grok-imagine-video-1-5-preview',
      input: {
        prompt: 'Reference image as identity lock, subtle motion, cinematic lighting.',
        image_urls: ['https://cdn.example.com/input.png'],
        aspect_ratio: 'auto',
        resolution: '480p',
        duration: 5,
        nsfw_checker: true,
      },
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator creates a Kie Seedance 2.0 first-and-last-frame task', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'seedance_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        model: 'seedance-2',
        prompt: 'Animate these references into a short cinematic scene.',
        imageUrls: JSON.stringify([
          'https://cdn.example.com/one.png',
          'https://cdn.example.com/two.png',
        ]),
        aspectRatio: '16:9',
        resolution: '1080p',
        duration: '15',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
      },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), { taskId: 'seedance_task', requiredCredits: 3060 })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.model, 'bytedance/seedance-2')
    assert.equal(payload.input.first_frame_url, 'https://cdn.example.com/one.png')
    assert.equal(payload.input.last_frame_url, 'https://cdn.example.com/two.png')
    assert.equal(payload.input.reference_image_urls, undefined)
    assert.equal(payload.input.image_urls, undefined)
    assert.equal(payload.input.resolution, '1080p')
    assert.equal(payload.input.duration, 15)
    assert.equal(payload.input.generate_audio, false)
    assert.equal(payload.input.return_last_frame, false)
    assert.equal(payload.input.web_search, false)
    assert.equal(payload.input.nsfw_checker, undefined)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator creates a Kie Seedance 2.0 Mini task and returns mapped Toolaze credits', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'seedance_mini_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        model: 'seedance-2-mini',
        prompt: 'Animate this product reference with clean motion.',
        imageUrls: JSON.stringify(['https://cdn.example.com/mini.png']),
        aspectRatio: 'adaptive',
        resolution: '720p',
        duration: '10',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      taskId: 'seedance_mini_task',
      requiredCredits: 410,
    })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.model, 'bytedance/seedance-2-mini')
    assert.equal(payload.input.first_frame_url, 'https://cdn.example.com/mini.png')
    assert.equal(payload.input.reference_image_urls, undefined)
    assert.equal(payload.input.aspect_ratio, 'adaptive')
    assert.equal(payload.input.resolution, '720p')
    assert.equal(payload.input.duration, 10)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects unpriced Seedance 2.0 Fast specs before provider request', async () => {
  let providerCalled = false
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'unexpected' } }))
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'seedance-2-fast',
        prompt: 'A cinematic product reveal.',
        aspectRatio: '16:9',
        resolution: '1080p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Unsupported resolution for Seedance 2.0 Fast')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator maps Seedance 1.0 Pro Fast image-to-video requests', async () => {
  let requestBody: Record<string, any> | undefined
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    requestBody = JSON.parse(String(init?.body))
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'seedance_pro_fast_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        model: 'seedance-1-pro-fast',
        prompt: 'Animate the product with a slow cinematic push-in.',
        imageUrls: JSON.stringify(['https://cdn.example.com/product.png']),
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(requestBody?.model, 'bytedance/v1-pro-fast-image-to-video')
    assert.deepEqual(requestBody?.input, {
      prompt: 'Animate the product with a slow cinematic push-in.',
      image_url: 'https://cdn.example.com/product.png',
      resolution: '720p',
      duration: '5',
      nsfw_checker: true,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects Seedance 1.0 Pro Fast text-to-video requests', async () => {
  let providerCalled = false
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'unexpected' } }))
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'seedance-1-pro-fast',
        prompt: 'A cinematic product reveal.',
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Seedance 1.0 Pro Fast supports image-to-video only')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator creates a Kie Veo 3.1 Fast task through the Veo endpoint', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'veo_fast_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        model: 'veo-3-1-fast',
        prompt: 'A macro product scene with precise motion and synchronized texture sound.',
        imageUrls: JSON.stringify(['https://cdn.example.com/soap.png']),
        aspectRatio: '9:16',
        resolution: '1080p',
        duration: '8',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      taskId: 'veo_fast_task',
      requiredCredits: 75,
      taskProvider: 'veo',
    })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.kie.ai/api/v1/veo/generate')

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.deepEqual(payload, {
      prompt: 'A macro product scene with precise motion and synchronized texture sound.',
      imageUrls: ['https://cdn.example.com/soap.png'],
      model: 'veo3_fast',
      generationType: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
      aspect_ratio: '9:16',
      enableTranslation: true,
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator maps Veo 3.1 Lite to the Kie Lite provider model', async () => {
  let payload: Record<string, any> | undefined
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    payload = JSON.parse(String(init?.body))
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'veo_lite_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'veo-3-1-lite',
        prompt: 'A quiet cinematic scene with synchronized natural audio.',
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '8',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(payload?.model, 'veo3_lite')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects more than two Veo 3.1 reference images before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        model: 'veo-3-1-quality',
        prompt: 'A controlled first and last frame transition.',
        imageUrls: JSON.stringify([
          'https://cdn.example.com/start.png',
          'https://cdn.example.com/end.png',
          'https://cdn.example.com/extra.png',
        ]),
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '8',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Veo 3.1 supports up to two reference images')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator lets env override the Seedance 2.0 provider model', async () => {
  let payload: Record<string, any> | undefined
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    payload = JSON.parse(String(init?.body))
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'seedance_override_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'seedance-2',
        prompt: 'A clean text-only Seedance motion test.',
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '5',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        KIE_SEEDANCE_2_VIDEO_MODEL: 'account-enabled-seedance-model',
      },
    })

    assert.equal(response.status, 200)
    assert.equal(payload?.model, 'account-enabled-seedance-model')
    assert.equal(payload?.input?.reference_image_urls, undefined)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator uses the default Kie Kling 3.0 provider model when env is missing', async () => {
  const originalFetch = globalThis.fetch
  let payload: Record<string, any> | undefined
  globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    payload = JSON.parse(String(init?.body))
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'kling-3',
        prompt: 'A clean motion test.',
        aspectRatio: '16:9',
        resolution: '4K',
        duration: '10',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), { taskId: 'task_unexpected', requiredCredits: 1340 })
    assert.equal(payload?.model, 'kling-3.0/video')
    assert.equal(payload?.input?.mode, '4K')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator creates a Kie Kling 3.0 task with mode-based pricing', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'kling_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'kling-3',
        prompt: 'A cinematic 4K motion test with clean movement.',
        aspectRatio: '16:9',
        resolution: '4K',
        duration: '15',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        KIE_KLING_3_VIDEO_MODEL: 'kling-3.0/video',
      },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      taskId: 'kling_task',
      requiredCredits: 2010,
    })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.model, 'kling-3.0/video')
    assert.equal(payload.input.mode, '4K')
    assert.equal(payload.input.resolution, undefined)
    assert.equal(payload.input.sound, false)
    assert.equal(payload.input.multi_shots, false)
    assert.equal(payload.input.duration, 15)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator prices and sends Kling 3.0 Native Audio requests', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'kling_audio_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'kling-3',
        prompt: 'A cinematic motion test with native audio.',
        aspectRatio: '16:9',
        resolution: '1080p',
        duration: '10',
        nativeAudio: 'true',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        KIE_KLING_3_VIDEO_MODEL: 'kling-3.0/video',
      },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      taskId: 'kling_audio_task',
      requiredCredits: 540,
    })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.input.mode, 'pro')
    assert.equal(payload.input.sound, true)
    assert.equal(payload.input.duration, 10)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects Kling 3.0 Native Audio for 4K', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'kling-3',
        prompt: '4K native audio should not be accepted.',
        aspectRatio: '16:9',
        resolution: '4K',
        duration: '10',
        nativeAudio: 'true',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        KIE_KLING_3_VIDEO_MODEL: 'kling-3.0/video',
      },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Native Audio for Kling 3.0 supports 720p and 1080p only')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator supports Kling 3.0 duration range from 3 to 15 seconds', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'kling_short_task' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'kling-3',
        prompt: 'A short Kling motion test.',
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '3',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        KIE_KLING_3_VIDEO_MODEL: 'kling-3.0/video',
      },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      taskId: 'kling_short_task',
      requiredCredits: 84,
    })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.input.mode, 'std')
    assert.equal(payload.input.duration, 3)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects Kling 3.0 durations below three seconds', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        model: 'kling-3',
        prompt: 'Too short.',
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '2',
      }),
      env: {
        KIE_AI_API_KEY: 'test-key',
        KIE_KLING_3_VIDEO_MODEL: 'kling-3.0/video',
      },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Duration must be between 3 and 15 seconds for Kling 3.0')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator defaults missing Grok duration to three seconds', async () => {
  let payload: Record<string, any> | undefined
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    payload = JSON.parse(String(init?.body))
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_default_duration' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        prompt: 'A clean product motion test with a slow push-in.',
        aspectRatio: '16:9',
        resolution: '480p',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), { taskId: 'task_default_duration', requiredCredits: 10 })
    assert.equal(payload?.input?.duration, 3)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator omits image_urls for text-to-video tasks', async () => {
  let payload: Record<string, any> | undefined
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
    payload = JSON.parse(String(init?.body))
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_text' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        prompt: 'A neon city flythrough with gentle camera drift.',
        aspectRatio: '16:9',
        resolution: '720p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.equal(payload?.input?.image_urls, undefined)
    assert.equal(payload?.input?.prompt, 'A neon city flythrough with gentle camera drift.')
  } finally {
    globalThis.fetch = originalFetch
  }
})



test('AI video generator rejects unsupported Grok aspect ratios before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        prompt: 'A clean motion test.',
        aspectRatio: '4:3',
        resolution: '480p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Unsupported aspect ratio for Grok Imagine Video 1.5')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects unsupported Grok resolutions before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        prompt: 'A clean motion test.',
        aspectRatio: '16:9',
        resolution: '1080p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Unsupported resolution for Grok Imagine Video 1.5')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects Grok durations outside the documented range before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'text-to-video',
        prompt: 'A clean motion test.',
        aspectRatio: '16:9',
        resolution: '480p',
        duration: '20',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Duration must be between 1 and 15 seconds')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator rejects more than one Grok reference image before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({ code: 200, data: { taskId: 'task_unexpected' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await createVideoTask({
      request: createFormRequest({
        mode: 'image-to-video',
        prompt: 'Animate these references with subtle motion.',
        imageUrls: JSON.stringify([
          'https://cdn.example.com/input-a.png',
          'https://cdn.example.com/input-b.png',
        ]),
        aspectRatio: 'auto',
        resolution: '480p',
        duration: '5',
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 400)
    assert.equal((await readJson(response)).error, 'Grok Imagine Video 1.5 supports exactly one reference image')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video status rejects unauthenticated checks before provider request', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({
      code: 200,
      data: {
        state: 'success',
        resultJson: JSON.stringify({ videoUrls: ['https://cdn.example.com/output.mp4'] }),
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await getVideoTaskStatus({
      request: new Request('https://toolaze.test/api/ai-video-generator/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: 'task_123' }),
      }),
      env: { KIE_AI_API_KEY: 'test-key', DB: createUnauthenticatedDb() },
    })
    const payload = await readJson(response)

    assert.equal(response.status, 401)
    assert.equal(payload.error, 'Please sign in with Google to check video status.')
    assert.equal(payload.raw, undefined)
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video status rejects task ids not bound to the current account', async () => {
  const originalFetch = globalThis.fetch
  let providerCalled = false
  globalThis.fetch = (async () => {
    providerCalled = true
    return new Response(JSON.stringify({
      code: 200,
      data: {
        state: 'success',
        resultJson: JSON.stringify({ videoUrls: ['https://cdn.example.com/victim.mp4'] }),
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await getVideoTaskStatus({
      request: new Request('https://toolaze.test/api/ai-video-generator/status', {
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
            requiredCredits: 150,
            model: 'seedance-2',
            mode: 'text-to-video',
          },
        }),
      }),
      env: { KIE_AI_API_KEY: 'test-key', DB: createTaskOwnershipDb({ taskId: 'owned_task' }) },
    })
    const payload = await readJson(response)

    assert.equal(response.status, 403)
    assert.equal(payload.error, 'Generation task is not available for this account.')
    assert.equal(providerCalled, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator status parses Kie video result URLs', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () => new Response(JSON.stringify({
    code: 200,
    data: {
      state: 'success',
      resultJson: JSON.stringify({ videoUrls: ['https://cdn.example.com/output.mp4'] }),
    },
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })) as typeof fetch

  try {
    const response = await getVideoTaskStatus({
      request: new Request('https://toolaze.test/api/ai-video-generator/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'toolaze_session=owner-session',
        },
        body: JSON.stringify({
          taskId: 'task_123',
          creditHold: {
            provider: 'credit-ledger',
            taskId: 'task_123',
            consumptionId: 'credit_cons_owner',
            requiredCredits: 150,
            model: 'seedance-2',
            mode: 'text-to-video',
            mediaType: 'video',
          },
        }),
      }),
      env: { KIE_AI_API_KEY: 'test-key', DB: createTaskOwnershipDb({ taskId: 'task_123' }) },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      status: 'SUCCEEDED',
      videoUrl: 'https://cdn.example.com/output.mp4',
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator status parses Kie Veo result URLs through the Veo endpoint', async () => {
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({
      code: 200,
      data: {
        successFlag: 1,
        response: {
          resultUrls: ['https://cdn.example.com/veo-output.mp4'],
          resolution: '1080p',
        },
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    const response = await getVideoTaskStatus({
      request: new Request('https://toolaze.test/api/ai-video-generator/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: 'veo_fast_task',
          taskProvider: 'veo',
        }),
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      status: 'SUCCEEDED',
      videoUrl: 'https://cdn.example.com/veo-output.mp4',
    })
    assert.equal(calls.length, 1)
    assert.equal(calls[0].url, 'https://api.kie.ai/api/v1/veo/record-info?taskId=veo_fast_task')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('AI video generator selects the documented provider model for each creation mode', async () => {
  const cases = [
    ['wan-2-7', 'wan/2-7-text-to-video', 'wan/2-7-image-to-video', '720p'],
    ['wan-2-6', 'wan/2-6-text-to-video', 'wan/2-6-image-to-video', '720p'],
    ['wan-2-5', 'wan/2-5-text-to-video', 'wan/2-5-image-to-video', '720p'],
    ['wan-2-2', 'wan/2-2-a14b-text-to-video-turbo', 'wan/2-2-a14b-image-to-video-turbo', '480p'],
    ['kling-3-turbo', 'kling/v3-turbo-text-to-video', 'kling/v3-turbo-image-to-video', '720p'],
    ['kling-2-6', 'kling-2.6/text-to-video', 'kling-2.6/image-to-video', '720p'],
    ['kling-2-5', 'kling/v2-5-turbo-text-to-video-pro', 'kling/v2-5-turbo-image-to-video-pro', '1080p'],
    ['kling-2-1', 'kling/v2-1-master-text-to-video', 'kling/v2-1-master-image-to-video', '1080p'],
    ['pixverse-v6', 'pixverse/v6/text-to-video', 'pixverse/v6/image-to-video', '720p'],
    ['happyhorse-1-1', 'happyhorse-1-1/text-to-video', 'happyhorse-1-1/image-to-video', '1080p'],
    ['happyhorse', 'happyhorse/text-to-video', 'happyhorse/image-to-video', '1080p'],
    ['seedance-1-pro', 'bytedance/v1-pro-text-to-video', 'bytedance/v1-pro-image-to-video', '720p'],
    ['seedance-1-lite', 'bytedance/v1-lite-text-to-video', 'bytedance/v1-lite-image-to-video', '720p'],
  ] as const
  const calls: FetchCall[] = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init })
    return new Response(JSON.stringify({ code: 200, data: { taskId: `task_${calls.length}` } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }) as typeof fetch

  try {
    for (const [model, textProvider, imageProvider, resolution] of cases) {
      for (const [mode, providerModel] of [
        ['text-to-video', textProvider],
        ['image-to-video', imageProvider],
      ] as const) {
        const response = await createVideoTask({
          request: createFormRequest({
            mode,
            model,
            prompt: 'A tactile macro product scene with precise motion and synchronized sound.',
            ...(mode === 'image-to-video'
              ? { imageUrls: JSON.stringify(['https://cdn.example.com/reference.png']) }
              : {}),
            aspectRatio: '16:9',
            resolution,
            duration: '5',
          }),
          env: { KIE_AI_API_KEY: 'test-key' },
        })

        assert.equal(response.status, 200, `${model} ${mode}`)
        const payload = JSON.parse(String(calls.at(-1)?.init?.body))
        assert.equal(payload.model, providerModel)
        if (model === 'pixverse-v6') {
          assert.equal(payload.input.quality, resolution)
          assert.equal(payload.input.generate_audio_switch, false)
          assert.equal('resolution' in payload.input, false)
        }
        if (mode === 'image-to-video' && ['happyhorse-1-1', 'happyhorse'].includes(model)) {
          assert.deepEqual(payload.input.image_urls, ['https://cdn.example.com/reference.png'])
        }
      }
    }
  } finally {
    globalThis.fetch = originalFetch
  }
})
