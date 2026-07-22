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

test('AI video generator creates a Kie Seedance 2.0 task with the documented reference image payload', async () => {
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
    assert.deepEqual(await readJson(response), { taskId: 'seedance_task', requiredCredits: 2250 })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.model, 'bytedance/seedance-2')
    assert.deepEqual(payload.input.reference_image_urls, [
      'https://cdn.example.com/one.png',
      'https://cdn.example.com/two.png',
    ])
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
      requiredCredits: 300,
    })
    assert.equal(calls.length, 1)

    const payload = JSON.parse(String(calls[0].init?.body))
    assert.equal(payload.model, 'bytedance/seedance-2-mini')
    assert.deepEqual(payload.input.reference_image_urls, ['https://cdn.example.com/mini.png'])
    assert.equal(payload.input.aspect_ratio, 'adaptive')
    assert.equal(payload.input.resolution, '720p')
    assert.equal(payload.input.duration, 10)
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
    assert.deepEqual(await readJson(response), { taskId: 'task_unexpected', requiredCredits: 900 })
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
      requiredCredits: 1350,
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
      requiredCredits: 400,
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
      requiredCredits: 60,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: 'task_123' }),
      }),
      env: { KIE_AI_API_KEY: 'test-key' },
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      status: 'SUCCEEDED',
      videoUrl: 'https://cdn.example.com/output.mp4',
      raw: {
        code: 200,
        data: {
          state: 'success',
          resultJson: JSON.stringify({ videoUrls: ['https://cdn.example.com/output.mp4'] }),
        },
      },
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})
