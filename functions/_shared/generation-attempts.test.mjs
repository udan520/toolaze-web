import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  createGenerationAttempt,
  deleteGenerationAttempt,
  deleteGenerationAttemptsForHistory,
  linkGenerationAttemptHistory,
  listOrphanGenerationAttempts,
  listGenerationAttempts,
} from './generation-attempts.mjs'

function createEnv(rows = []) {
  const calls = []
  return {
    calls,
    DB: {
      prepare(sql) {
        const call = { sql, values: [] }
        calls.push(call)
        return {
          bind(...values) {
            call.values = values
            return this
          },
          async all() {
            return { results: rows }
          },
          async run() {
            return { success: true, meta: { changes: 1 } }
          },
        }
      },
    },
  }
}

test('listGenerationAttempts maps resume metadata for account history polling', async () => {
  const env = createEnv([{
    id: 'gen_attempt_1',
    task_id: 'task_1',
    media_type: 'video',
    status: 'pending',
    model: 'veo-3-1',
    prompt: 'A sunrise',
    output_url: null,
    input_urls: JSON.stringify(['https://assets.toolaze.com/input.png']),
    aspect_ratio: '16:9',
    resolution: '720p',
    output_format: JSON.stringify({ duration: 8 }),
    native_audio: 1,
    tool_slug: 'ai-video-generator',
    tool_label: 'AI Video Generator',
    source_path: '/ai-video-generator',
    failure_reason: null,
    credit_transaction_id: 'txn_1',
    consumption_id: 'consume_1',
    task_provider: 'veo',
    required_credits: 40,
    history_id: null,
    request_ip: '203.0.113.8',
    request_country: 'US',
    created_at: '2026-08-09T00:00:00.000Z',
    updated_at: '2026-08-09T00:00:05.000Z',
  }])

  const [item] = await listGenerationAttempts(env, 'user_1', 200)

  assert.equal(item.status, 'pending')
  assert.equal(item.taskProvider, 'veo')
  assert.equal(item.requiredCredits, 40)
  assert.equal(item.consumptionId, 'consume_1')
  assert.equal(item.requestIp, '203.0.113.8')
  assert.equal(item.requestCountry, 'US')
  assert.deepEqual(item.inputUrls, ['https://assets.toolaze.com/input.png'])
  assert.deepEqual(env.calls[0].values, ['user_1', 200])
})

test('listOrphanGenerationAttempts recovers a charged task from transaction metadata', async () => {
  const env = createEnv([{
    consumption_id: 'consume_orphan',
    transaction_id: 'txn_orphan',
    task_id: 'task_orphan',
    metadata: JSON.stringify({
      taskId: 'task_orphan',
      model: 'seedream-5-0-lite',
      mediaType: 'image',
      requiredCredits: 17,
      toolSlug: 'ai-clothes-changer',
      toolLabel: 'Clothes Changer',
      sourcePath: '/ai-clothes-changer',
      isImageToImage: true,
    }),
    description: 'Clothes Changer',
    created_at: '2026-08-12T12:23:51.689Z',
  }])

  const [item] = await listOrphanGenerationAttempts(env, 'user_1', 50)

  assert.equal(item.id, 'gen_recovered_consume_orphan')
  assert.equal(item.taskId, 'task_orphan')
  assert.equal(item.status, 'pending')
  assert.equal(item.taskProvider, 'image-to-image')
  assert.equal(item.requiredCredits, 17)
  assert.equal(item.toolSlug, 'ai-clothes-changer')
  assert.equal(item.toolLabel, 'Clothes Changer')
  assert.equal(item.consumptionId, 'consume_orphan')
})

test('createGenerationAttempt stores request IP and country metadata', async () => {
  const env = createEnv()

  const result = await createGenerationAttempt(env, 'user_1', {
    mediaType: 'image',
    status: 'pending',
    model: 'gpt-image-2',
    prompt: 'A product photo',
    requestIp: '203.0.113.8',
    requestCountry: 'US',
  })

  assert.match(result.id, /^gen_attempt_[a-f0-9]{32}$/)
  assert.match(env.calls[0].sql, /request_ip/i)
  assert.match(env.calls[0].sql, /request_country/i)
  assert.equal(env.calls[0].values[22], '203.0.113.8')
  assert.equal(env.calls[0].values[23], 'US')
})

test('attempt lifecycle mutations are scoped to the authenticated account', async () => {
  const env = createEnv()

  assert.equal(await linkGenerationAttemptHistory(env, {
    userId: 'user_1',
    taskId: 'task_1',
    historyId: 'gen_task_1',
  }), true)
  assert.equal(await deleteGenerationAttempt(env, 'user_1', 'gen_attempt_1'), 1)
  assert.equal(await deleteGenerationAttemptsForHistory(env, 'user_1', 'gen_task_1'), 1)

  assert.match(env.calls[0].sql, /where task_id = \? and user_id = \?/i)
  assert.deepEqual(env.calls[0].values.slice(-2), ['task_1', 'user_1'])
  assert.match(env.calls[1].sql, /where id = \? and user_id = \?/i)
  assert.deepEqual(env.calls[1].values, ['gen_attempt_1', 'user_1'])
  assert.match(env.calls[2].sql, /where history_id = \? and user_id = \?/i)
  assert.deepEqual(env.calls[2].values, ['gen_task_1', 'user_1'])
})

test('resume metadata is added by a forward-only migration', () => {
  const migration = readFileSync(new URL('../../migrations/0012_generation_attempt_resume_metadata.sql', import.meta.url), 'utf8')
  assert.match(migration, /add column task_provider text/i)
  assert.match(migration, /add column required_credits integer/i)
  assert.match(migration, /add column history_id text/i)
})
