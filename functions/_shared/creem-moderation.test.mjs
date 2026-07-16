import assert from 'node:assert/strict'
import test from 'node:test'
import { moderatePromptBeforeGeneration } from './creem-moderation.mjs'

test('Creem moderation allows prompt only after allow decision', async () => {
  let requestBody = null
  const fetchImpl = async (_url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ id: 'mod_allow', object: 'moderation_result', decision: 'allow', usage: { units: 1 } })
  }

  const result = await moderatePromptBeforeGeneration({
    prompt: 'a product photo on a clean table',
    env: { CREEM_API_KEY: 'creem-test-key' },
    externalId: 'generation_123',
    fetchImpl,
  })

  assert.equal(result.allowed, true)
  assert.equal(requestBody.prompt, 'a product photo on a clean table')
  assert.equal(requestBody.external_id, 'generation_123')
})

test('Creem moderation treats flag as a block', async () => {
  const fetchImpl = async () => Response.json({
    id: 'mod_flag',
    object: 'moderation_result',
    decision: 'flag',
    usage: { units: 1 },
  })

  const result = await moderatePromptBeforeGeneration({
    prompt: 'risky prompt',
    env: { CREEM_API_KEY: 'creem-test-key' },
    fetchImpl,
  })

  assert.equal(result.allowed, false)
  assert.equal(result.status, 400)
  assert.equal(result.body.error, 'This prompt cannot be generated. Please try a different idea.')
  assert.equal(result.body.moderation.decision, 'flag')
})

test('Creem moderation fails closed when API is unavailable', async () => {
  const fetchImpl = async () => Response.json({ error: 'upstream down' }, { status: 503 })

  const result = await moderatePromptBeforeGeneration({
    prompt: 'safe prompt',
    env: { CREEM_API_KEY: 'creem-test-key' },
    fetchImpl,
  })

  assert.equal(result.allowed, false)
  assert.equal(result.status, 503)
  assert.equal(result.body.error, 'Prompt moderation is temporarily unavailable. Please try again.')
})
