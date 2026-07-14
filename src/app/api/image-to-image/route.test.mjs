import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from './route.js'
import { proxyToPagesFunctions } from '../_shared/backend-proxy.js'
import {
  getLocalDevCreditSummary,
  resetLocalDevCreditsForTests,
} from '../_shared/local-dev-auth.js'

function createLocalDevGenerateRequest() {
  const formData = new FormData()
  formData.append('prompt', 'test prompt')
  formData.append('aspectRatio', '16:9')
  formData.append('resolution', '1K')
  formData.append('isImageToImage', 'false')
  formData.append('model', 'gpt-image-2')

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
    assert.equal(creditsPayload.credits.transactions[0].description, 'Image generation')
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
    assert.equal(credits.transactions[0].description, 'Image generation refund')
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
