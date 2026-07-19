import assert from 'node:assert/strict'
import test from 'node:test'
import { moderatePromptBeforeGeneration } from './creem-moderation.mjs'

function createModerationSettingEnv(value = 'true') {
  return {
    DB: {
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
    },
  }
}

test('Creem moderation allows prompt only after allow decision', async () => {
  let requestBody = null
  const fetchImpl = async (_url, init) => {
    requestBody = JSON.parse(String(init.body))
    return Response.json({ id: 'mod_allow', object: 'moderation_result', decision: 'allow', usage: { units: 1 } })
  }

  const result = await moderatePromptBeforeGeneration({
    prompt: 'a product photo on a clean table',
    env: { ...createModerationSettingEnv('true'), CREEM_API_KEY: 'creem-test-key' },
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
    env: { ...createModerationSettingEnv('true'), CREEM_API_KEY: 'creem-test-key' },
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
    env: { ...createModerationSettingEnv('true'), CREEM_API_KEY: 'creem-test-key' },
    fetchImpl,
  })

  assert.equal(result.allowed, false)
  assert.equal(result.status, 503)
  assert.equal(result.body.error, 'Prompt moderation is temporarily unavailable. Please try again.')
})

test('Creem moderation is skipped when the runtime admin setting is disabled', async () => {
  let fetchCalled = false
  const fetchImpl = async () => {
    fetchCalled = true
    return Response.json({ decision: 'deny' })
  }

  const result = await moderatePromptBeforeGeneration({
    prompt: 'a normal prompt',
    env: {
      DB: {
        prepare() {
          return {
            bind() {
              return {
                async first() {
                  return { value: 'false' }
                },
              }
            },
          }
        },
      },
    },
    fetchImpl,
  })

  assert.equal(result.allowed, true)
  assert.equal(result.body.moderation.skipped, true)
  assert.equal(result.body.moderation.reason, 'disabled_by_admin')
  assert.equal(fetchCalled, false)
})

test('Creem moderation is skipped when runtime settings storage is unavailable', async () => {
  let fetchCalled = false
  const fetchImpl = async () => {
    fetchCalled = true
    return Response.json({ decision: 'deny' })
  }

  const result = await moderatePromptBeforeGeneration({
    prompt: 'a normal prompt',
    env: {},
    fetchImpl,
  })

  assert.equal(result.allowed, true)
  assert.equal(result.body.moderation.skipped, true)
  assert.equal(result.body.moderation.reason, 'settings_unbound')
  assert.equal(fetchCalled, false)
})

test('Creem moderation is skipped when the runtime admin setting cannot be read', async () => {
  let fetchCalled = false
  const fetchImpl = async () => {
    fetchCalled = true
    return Response.json({ decision: 'deny' })
  }

  const result = await moderatePromptBeforeGeneration({
    prompt: 'a normal prompt',
    env: {
      DB: {
        prepare() {
          throw new Error('D1 unavailable')
        },
      },
    },
    fetchImpl,
  })

  assert.equal(result.allowed, true)
  assert.equal(result.body.moderation.skipped, true)
  assert.equal(result.body.moderation.reason, 'settings_unavailable')
  assert.equal(fetchCalled, false)
})
