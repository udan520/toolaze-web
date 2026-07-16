import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './flux-dev.js'

function createFluxDevRequest(overrides = {}) {
  return new Request('http://localhost:3016/api/flux-dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: overrides.prompt || 'a cinematic product photo',
      width: 1024,
      height: 768,
    }),
  })
}

test('Creem moderation denial blocks flux-dev before provider request', async () => {
  const originalFetch = globalThis.fetch
  const fetchUrls = []

  globalThis.fetch = async (url) => {
    fetchUrls.push(String(url))
    return Response.json({ id: 'mod_deny', object: 'moderation_result', decision: 'deny', usage: { units: 1 } })
  }

  try {
    const response = await onRequest({
      request: createFluxDevRequest({ prompt: 'blocked prompt' }),
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
