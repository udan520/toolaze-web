import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
const tempStateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-test-'))
process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(tempStateDir, 'state.json')

test.after(() => {
  if (previousStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
  }
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
  rmSync(tempStateDir, { recursive: true, force: true })
})
import { POST } from './route.js'
import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'
import {
  getLocalDevCreditSummary,
  resetLocalDevCreditsForTests,
} from '../_shared/local-dev-auth.js'

function createLocalDevGenerateRequest({
  model = 'gpt-image-2',
  isImageToImage = false,
  imageUrls = [],
  quality = '',
  resolution = '1K',
} = {}) {
  const formData = new FormData()
  formData.append('prompt', 'test prompt')
  formData.append('aspectRatio', '16:9')
  formData.append('resolution', resolution)
  formData.append('isImageToImage', String(isImageToImage))
  formData.append('model', model)
  if (quality) formData.append('quality', quality)
  if (imageUrls.length > 0) formData.append('imageUrls', JSON.stringify(imageUrls))

  return new Request('http://localhost:3016/api/image-to-image', {
    method: 'POST',
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: formData,
  })
}

test('local dev session uses local generation function instead of remote auth proxy', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  delete process.env.KIE_AI_API_KEY

  try {
    const response = await POST(createLocalDevGenerateRequest())
    const payload = await response.json()

    assert.equal(response.status, 500)
    assert.equal(payload.error, 'API key not configured (KIE_AI_API_KEY)')
  } finally {
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})

test('local dev generation consumes credits and returns the updated balance', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'

  globalThis.fetch = async () => {
    return Response.json({ code: 200, data: { taskId: 'task_test' } })
  }

  try {
    const response = await POST(createLocalDevGenerateRequest())
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.taskId, 'task_test')
    assert.equal(payload.credits.balance, 990)

    const authResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/auth/me', {
      headers: {
        Cookie: 'toolaze_session=toolaze-local-dev-session',
      },
    }), '/api/auth/me')
    const authPayload = await authResponse.json()

    assert.equal(authPayload.credits.balance, 990)

    const creditsResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/credits?limit=200', {
      headers: {
        Cookie: 'toolaze_session=toolaze-local-dev-session',
      },
    }), '/api/credits')
    const creditsPayload = await creditsResponse.json()

    assert.equal(creditsPayload.credits.balance, 990)
    assert.equal(creditsPayload.credits.transactions[0].amount, -10)
    assert.equal(creditsPayload.credits.transactions[0].description, 'GPT Image 2 text-to-image generation')
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})

test('local dev generation pre-deducts credits before requesting the provider task', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'
  let balanceDuringProviderRequest = null

  globalThis.fetch = async () => {
    balanceDuringProviderRequest = getLocalDevCreditSummary().balance
    return Response.json({ code: 200, data: { taskId: 'task_pre_deducted' } })
  }

  try {
    const response = await POST(createLocalDevGenerateRequest())
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.taskId, 'task_pre_deducted')
    assert.equal(balanceDuringProviderRequest, 990)
    assert.equal(payload.credits.balance, 990)
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})

test('local dev generation forwards Seedream 5.0 Pro text tasks to the Seedream provider model', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'
  let providerPayload = null

  globalThis.fetch = async (_input, init) => {
    providerPayload = JSON.parse(String(init?.body || '{}'))
    return Response.json({ code: 200, data: { taskId: 'task_seedream_pro' } })
  }

  try {
    const response = await POST(createLocalDevGenerateRequest({
      model: 'seedream-5-0-pro',
      quality: 'high',
      resolution: '2K',
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.taskId, 'task_seedream_pro')
    assert.equal(providerPayload.model, 'seedream/5-pro-text-to-image')
    assert.equal(providerPayload.input.quality, 'high')
    assert.equal(providerPayload.input.resolution, '2K')
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})

test('local dev generation forwards Seedream 5.0 Pro edit tasks with image_urls', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'
  let providerPayload = null

  globalThis.fetch = async (_input, init) => {
    providerPayload = JSON.parse(String(init?.body || '{}'))
    return Response.json({ code: 200, data: { taskId: 'task_seedream_pro_edit' } })
  }

  try {
    const response = await POST(createLocalDevGenerateRequest({
      model: 'seedream-5-0-pro',
      isImageToImage: true,
      imageUrls: ['https://example.com/reference.webp'],
      quality: 'high',
    }))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.taskId, 'task_seedream_pro_edit')
    assert.equal(providerPayload.model, 'seedream/5-pro-image-to-image')
    assert.deepEqual(providerPayload.input.image_urls, ['https://example.com/reference.webp'])
    assert.equal(providerPayload.input.image_input, undefined)
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})

test('local dev generation forwards Seedream 5.0 Lite tasks to Seedream Lite', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'
  const providerModels = []

  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body || '{}'))
    providerModels.push(body.model)
    return Response.json({ code: 200, data: { taskId: `task_${providerModels.length}` } })
  }

  try {
    const textResponse = await POST(createLocalDevGenerateRequest({ model: 'seedream-5-0-lite' }))
    const editResponse = await POST(createLocalDevGenerateRequest({
      model: 'seedream-5-0-lite',
      isImageToImage: true,
      imageUrls: ['https://example.com/reference.webp'],
    }))

    assert.equal(textResponse.status, 200)
    assert.equal(editResponse.status, 200)
    assert.deepEqual(providerModels, [
      'seedream/5-lite-text-to-image',
      'seedream/5-lite-image-to-image',
    ])
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})

test('local dev generation refunds pre-deducted credits when task creation fails', async () => {
  const originalKey = process.env.KIE_AI_API_KEY
  const originalFetch = globalThis.fetch
  resetLocalDevCreditsForTests(1000)
  process.env.KIE_AI_API_KEY = 'test-key'

  globalThis.fetch = async () => {
    return Response.json({ message: 'KIE task failed' }, { status: 500 })
  }

  try {
    const response = await POST(createLocalDevGenerateRequest())
    const payload = await response.json()

    assert.equal(response.status, 500)
    assert.equal(payload.error, 'KIE task failed')

    const credits = getLocalDevCreditSummary()
    assert.equal(credits.balance, 1000)
    assert.equal(credits.transactions[0].amount, 10)
    assert.equal(credits.transactions[0].description, 'GPT Image 2 text-to-image generation refund')
  } finally {
    resetLocalDevCreditsForTests(1000)
    globalThis.fetch = originalFetch
    if (originalKey === undefined) {
      delete process.env.KIE_AI_API_KEY
    } else {
      process.env.KIE_AI_API_KEY = originalKey
    }
  }
})
