import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
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
import { proxyToPagesFunctions } from './backend-proxy.js'
import { resetLocalDevCreditsForTests, resetLocalDevHistoryForTests } from './local-dev-auth.js'

test('local dev session can create a starter Creem checkout', async () => {
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.CREEM_API_KEY
  const previousBaseUrl = process.env.CREEM_CHECKOUT_API_BASE_URL
  const previousProductId = process.env.CREEM_STARTER_PRODUCT_ID
  process.env.CREEM_API_KEY = 'creem-test-key'
  process.env.CREEM_CHECKOUT_API_BASE_URL = 'https://test-api.creem.io'
  process.env.CREEM_STARTER_PRODUCT_ID = 'prod_4GeFDXFa2HtXjHGnEksTzJ'

  let checkoutRequestBody = null
  globalThis.fetch = async (_target, init = {}) => {
    checkoutRequestBody = JSON.parse(String(init.body))
    return Response.json({
      id: 'ch_local_123',
      checkout_url: 'https://www.creem.io/test/payment/ch_local_123',
    })
  }

  try {
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'toolaze_session=toolaze-local-dev-session',
      },
      body: JSON.stringify({ planId: 'starter' }),
    }), '/api/billing/checkout')
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.checkoutUrl, 'https://www.creem.io/test/payment/ch_local_123')
    assert.equal(payload.plan.credits, 200)
    assert.equal(checkoutRequestBody.product_id, 'prod_4GeFDXFa2HtXjHGnEksTzJ')
    assert.equal(checkoutRequestBody.metadata.userId, 'local-dev-dianawu1202')
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.CREEM_API_KEY
    } else {
      process.env.CREEM_API_KEY = previousApiKey
    }
    if (previousBaseUrl === undefined) {
      delete process.env.CREEM_CHECKOUT_API_BASE_URL
    } else {
      process.env.CREEM_CHECKOUT_API_BASE_URL = previousBaseUrl
    }
    if (previousProductId === undefined) {
      delete process.env.CREEM_STARTER_PRODUCT_ID
    } else {
      process.env.CREEM_STARTER_PRODUCT_ID = previousProductId
    }
  }
})

test('localhost checkout uses the signed-in backend user when available', async () => {
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.CREEM_API_KEY
  const previousBaseUrl = process.env.CREEM_CHECKOUT_API_BASE_URL
  const previousProductId = process.env.CREEM_STARTER_PRODUCT_ID
  process.env.CREEM_API_KEY = 'creem-test-key'
  process.env.CREEM_CHECKOUT_API_BASE_URL = 'https://test-api.creem.io'
  process.env.CREEM_STARTER_PRODUCT_ID = 'prod_4GeFDXFa2HtXjHGnEksTzJ'

  let checkoutRequestUrl = ''
  let checkoutRequestBody = null
  globalThis.fetch = async (target, init = {}) => {
    if (String(target) === 'https://toolaze-web.pages.dev/api/auth/me') {
      return Response.json({
        user: {
          id: 'user_production_123',
          email: 'buyer@example.com',
          name: 'Buyer',
          avatarUrl: null,
        },
      })
    }

    checkoutRequestUrl = String(target)
    checkoutRequestBody = JSON.parse(String(init.body))
    return Response.json({
      id: 'ch_local_without_session_123',
      checkout_url: 'https://www.creem.io/test/payment/ch_local_without_session_123',
    })
  }

  try {
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'toolaze_session=production-session-token',
      },
      body: JSON.stringify({ planId: 'starter' }),
    }), '/api/billing/checkout')
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.checkoutUrl, 'https://www.creem.io/test/payment/ch_local_without_session_123')
    assert.equal(checkoutRequestUrl, 'https://test-api.creem.io/v1/checkouts')
    assert.equal(checkoutRequestBody.metadata.userId, 'user_production_123')
    assert.equal(checkoutRequestBody.customer.email, 'buyer@example.com')
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.CREEM_API_KEY
    } else {
      process.env.CREEM_API_KEY = previousApiKey
    }
    if (previousBaseUrl === undefined) {
      delete process.env.CREEM_CHECKOUT_API_BASE_URL
    } else {
      process.env.CREEM_CHECKOUT_API_BASE_URL = previousBaseUrl
    }
    if (previousProductId === undefined) {
      delete process.env.CREEM_STARTER_PRODUCT_ID
    } else {
      process.env.CREEM_STARTER_PRODUCT_ID = previousProductId
    }
  }
})

test('localhost checkout prefers the saved backend session over a local dev cookie', async () => {
  const originalFetch = globalThis.fetch
  const previousApiKey = process.env.CREEM_API_KEY
  const previousBaseUrl = process.env.CREEM_CHECKOUT_API_BASE_URL
  const previousProductId = process.env.CREEM_STARTER_PRODUCT_ID
  process.env.CREEM_API_KEY = 'creem-test-key'
  process.env.CREEM_CHECKOUT_API_BASE_URL = 'https://test-api.creem.io'
  process.env.CREEM_STARTER_PRODUCT_ID = 'prod_4GeFDXFa2HtXjHGnEksTzJ'

  const previousSessionFile = process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE
  const sessionTokenFile = join(tempStateDir, 'saved-session-token.txt')
  process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = sessionTokenFile
  writeFileSync(sessionTokenFile, 'production-session-token', 'utf8')

  let authCookieHeader = ''
  let checkoutRequestBody = null
  globalThis.fetch = async (target, init = {}) => {
    if (String(target) === 'https://toolaze-web.pages.dev/api/auth/me') {
      authCookieHeader = init.headers.get('cookie') || ''
      return Response.json({
        user: {
          id: 'user_saved_session_123',
          email: 'saved@example.com',
          name: 'Saved User',
          avatarUrl: null,
        },
      })
    }

    checkoutRequestBody = JSON.parse(String(init.body))
    return Response.json({
      id: 'ch_saved_session_123',
      checkout_url: 'https://www.creem.io/test/payment/ch_saved_session_123',
    })
  }

  try {
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/billing/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: 'toolaze_session=toolaze-local-dev-session',
      },
      body: JSON.stringify({ planId: 'starter' }),
    }), '/api/billing/checkout')
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.checkoutUrl, 'https://www.creem.io/test/payment/ch_saved_session_123')
    assert.equal(authCookieHeader, 'toolaze_session=production-session-token')
    assert.equal(checkoutRequestBody.metadata.userId, 'user_saved_session_123')
    assert.equal(checkoutRequestBody.customer.email, 'saved@example.com')
  } finally {
    globalThis.fetch = originalFetch
    if (previousApiKey === undefined) {
      delete process.env.CREEM_API_KEY
    } else {
      process.env.CREEM_API_KEY = previousApiKey
    }
    if (previousBaseUrl === undefined) {
      delete process.env.CREEM_CHECKOUT_API_BASE_URL
    } else {
      process.env.CREEM_CHECKOUT_API_BASE_URL = previousBaseUrl
    }
    if (previousProductId === undefined) {
      delete process.env.CREEM_STARTER_PRODUCT_ID
    } else {
      process.env.CREEM_STARTER_PRODUCT_ID = previousProductId
    }
    if (previousSessionFile === undefined) {
      delete process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE
    } else {
      process.env.TOOLAZE_LOCAL_SESSION_TOKEN_FILE = previousSessionFile
    }
  }
})


test('local dev session cookie returns local test account for auth state', async () => {
  const request = new Request('http://localhost:3016/api/auth/me', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  })

  const response = await proxyToPagesFunctions(request, '/api/auth/me')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.user.email, 'dianawu1202@gmail.com')
  assert.equal(payload.credits.balance, 1000)
})

test('local dev session cookie returns wrapped credit activity', async () => {
  const request = new Request('http://localhost:3016/api/credits?limit=200', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  })

  const response = await proxyToPagesFunctions(request, '/api/credits')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.credits.balance, 1000)
  assert.equal(payload.credits.transactions[0].description, 'Bonus credits')
})

test('local dev session can create and list generation history', async () => {
  resetLocalDevHistoryForTests()

  const createResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({
      mediaType: 'image',
      model: 'seedream-5-0-pro',
      prompt: 'test prompt',
      outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/output.webp',
      inputUrls: ['https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp'],
      aspectRatio: '16:9',
      resolution: '1K',
      outputFormat: 'Auto',
    }),
  }), '/api/history')
  const createPayload = await createResponse.json()

  assert.equal(createResponse.status, 201)
  assert.equal(createPayload.item.model, 'seedream-5-0-pro')

  const listResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/history?limit=200', {
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  }), '/api/history')
  const listPayload = await listResponse.json()

  assert.equal(listResponse.status, 200)
  assert.equal(listPayload.items.length, 1)
  assert.equal(listPayload.items[0].id, createPayload.item.id)
  assert.equal(listPayload.items[0].outputUrl, createPayload.item.outputUrl)
})

test('local dev session can claim a daily check-in reward', async () => {
  resetLocalDevCreditsForTests(1000)

  const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/rewards/check-in', {
    method: 'POST',
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  }), '/api/rewards/check-in')
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.rewardCredits, 5)
  assert.equal(payload.checkIn.day, 1)
  assert.equal(payload.credits.balance, 1005)
})

test('local dev admin can review and approve x post rewards', async () => {
  resetLocalDevCreditsForTests(1000)

  const submitResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/rewards/x-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({ postUrl: 'https://x.com/toolaze/status/789' }),
  }), '/api/rewards/x-post')
  const submitPayload = await submitResponse.json()

  assert.equal(submitResponse.status, 201)
  assert.equal(submitPayload.xPost.status, 'pending')

  const blockedResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-reviews'), '/api/admin/reward-reviews')
  const blockedPayload = await blockedResponse.json()

  assert.equal(blockedResponse.status, 403)
  assert.equal(blockedPayload.error, 'Admin token required.')

  const listResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-reviews', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }), '/api/admin/reward-reviews')
  const listPayload = await listResponse.json()

  assert.equal(listResponse.status, 200)
  assert.equal(listPayload.items.length, 1)
  assert.equal(listPayload.items[0].id, submitPayload.xPost.id)

  const approveResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'toolaze-local-dev-admin',
    },
    body: JSON.stringify({ id: submitPayload.xPost.id, action: 'approve' }),
  }), '/api/admin/reward-reviews')
  const approvePayload = await approveResponse.json()

  assert.equal(approveResponse.status, 200)
  assert.equal(approvePayload.xPost.status, 'approved')
  assert.equal(approvePayload.credits.balance, 1010)

  const duplicateResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'toolaze-local-dev-admin',
    },
    body: JSON.stringify({ id: submitPayload.xPost.id, action: 'approve' }),
  }), '/api/admin/reward-reviews')
  const duplicatePayload = await duplicateResponse.json()

  assert.equal(duplicateResponse.status, 200)
  assert.equal(duplicatePayload.alreadyReviewed, true)
  assert.equal(duplicatePayload.credits.balance, 1010)
})

test('local dev admin can list credit reward events by source', async () => {
  resetLocalDevCreditsForTests(1000)

  await proxyToPagesFunctions(new Request('http://localhost:3016/api/rewards/check-in', {
    method: 'POST',
    headers: {
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
  }), '/api/rewards/check-in')

  const submitResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/rewards/x-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=toolaze-local-dev-session',
    },
    body: JSON.stringify({ postUrl: 'https://x.com/toolaze/status/900' }),
  }), '/api/rewards/x-post')
  const submitPayload = await submitResponse.json()

  await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'toolaze-local-dev-admin',
    },
    body: JSON.stringify({ id: submitPayload.xPost.id, action: 'approve' }),
  }), '/api/admin/reward-reviews')

  const blockedResponse = await proxyToPagesFunctions(
    new Request('http://localhost:3016/api/admin/reward-events'),
    '/api/admin/reward-events',
  )
  const blockedPayload = await blockedResponse.json()

  assert.equal(blockedResponse.status, 403)
  assert.equal(blockedPayload.error, 'Admin token required.')

  const allResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-events?reason=all', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }), '/api/admin/reward-events')
  const allPayload = await allResponse.json()

  assert.equal(allResponse.status, 200)
  assert.deepEqual(allPayload.items.map((item) => item.reason), [
    'x_post_reward',
    'daily_checkin',
    'new_user_bonus',
  ])
  assert.equal(allPayload.items[0].userEmail, 'dianawu1202@gmail.com')
  assert.equal(allPayload.items[0].amount, 10)

  const checkInResponse = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-events?reason=daily_checkin', {
    headers: {
      'x-admin-token': 'toolaze-local-dev-admin',
    },
  }), '/api/admin/reward-events')
  const checkInPayload = await checkInResponse.json()

  assert.equal(checkInResponse.status, 200)
  assert.deepEqual(checkInPayload.items.map((item) => item.reason), ['daily_checkin'])
})

test('local dev admin can proxy reward events to production with the server admin token', async () => {
  const previousToken = process.env.REWARD_REVIEW_ADMIN_TOKEN
  const originalFetch = globalThis.fetch
  process.env.REWARD_REVIEW_ADMIN_TOKEN = 'production-admin-token'

  let proxiedRequest = null
  globalThis.fetch = async (target, init = {}) => {
    proxiedRequest = {
      url: String(target),
      method: init.method,
      headers: new Headers(init.headers),
    }
    return Response.json({
      ok: true,
      reason: 'daily_checkin',
      items: [{ id: 'prod_reward_1', reason: 'daily_checkin', amount: 5 }],
    })
  }

  try {
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-events?reason=daily_checkin&source=production', {
      headers: {
        'x-admin-token': 'toolaze-local-dev-admin',
      },
    }), '/api/admin/reward-events')
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.items[0].id, 'prod_reward_1')
    assert.equal(proxiedRequest.url, 'https://toolaze-web.pages.dev/api/admin/reward-events?reason=daily_checkin')
    assert.equal(proxiedRequest.method, 'GET')
    assert.equal(proxiedRequest.headers.get('x-admin-token'), 'production-admin-token')
    assert.equal(proxiedRequest.headers.get('host'), null)
  } finally {
    globalThis.fetch = originalFetch
    if (previousToken === undefined) {
      delete process.env.REWARD_REVIEW_ADMIN_TOKEN
    } else {
      process.env.REWARD_REVIEW_ADMIN_TOKEN = previousToken
    }
  }
})

test('local dev production reward source requires a server admin token', async () => {
  const previousToken = process.env.REWARD_REVIEW_ADMIN_TOKEN
  const previousEnvFile = process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE
  process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE = join(tempStateDir, 'missing-admin.env')
  delete process.env.REWARD_REVIEW_ADMIN_TOKEN

  try {
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-events?source=production', {
      headers: {
        'x-admin-token': 'toolaze-local-dev-admin',
      },
    }), '/api/admin/reward-events')
    const payload = await response.json()

    assert.equal(response.status, 503)
    assert.equal(payload.error, 'Production admin token is not configured.')
  } finally {
    if (previousEnvFile === undefined) {
      delete process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE
    } else {
      process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE = previousEnvFile
    }
    if (previousToken === undefined) {
      delete process.env.REWARD_REVIEW_ADMIN_TOKEN
    } else {
      process.env.REWARD_REVIEW_ADMIN_TOKEN = previousToken
    }
  }
})

test('local dev production reward source can read the admin token from a local env file', async () => {
  const previousToken = process.env.REWARD_REVIEW_ADMIN_TOKEN
  const previousEnvFile = process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE
  const originalFetch = globalThis.fetch
  delete process.env.REWARD_REVIEW_ADMIN_TOKEN
  process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE = join(tempStateDir, 'reward-admin.env')
  const localEnvText = 'REWARD_REVIEW_ADMIN_TOKEN="file-admin-token"\n'
  writeFileSync(process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE, localEnvText, 'utf8')

  let proxiedRequest = null
  globalThis.fetch = async (target, init = {}) => {
    proxiedRequest = {
      url: String(target),
      headers: new Headers(init.headers),
    }
    return Response.json({ ok: true, items: [] })
  }

  try {
    const response = await proxyToPagesFunctions(new Request('http://localhost:3016/api/admin/reward-events?source=production', {
      headers: {
        'x-admin-token': 'toolaze-local-dev-admin',
      },
    }), '/api/admin/reward-events')

    assert.equal(response.status, 200)
    assert.equal(proxiedRequest.url, 'https://toolaze-web.pages.dev/api/admin/reward-events')
    assert.equal(proxiedRequest.headers.get('x-admin-token'), 'file-admin-token')
  } finally {
    globalThis.fetch = originalFetch
    if (previousEnvFile === undefined) {
      delete process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE
    } else {
      process.env.TOOLAZE_REWARD_ADMIN_ENV_FILE = previousEnvFile
    }
    if (previousToken === undefined) {
      delete process.env.REWARD_REVIEW_ADMIN_TOKEN
    } else {
      process.env.REWARD_REVIEW_ADMIN_TOKEN = previousToken
    }
  }
})
