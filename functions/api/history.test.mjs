import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './history.js'

class TestStatement {
  constructor(env, sql) {
    this.env = env
    this.sql = sql
    this.values = []
  }

  bind(...values) {
    this.values = values
    return this
  }

  async first() {
    if (this.sql.includes('FROM sessions')) {
      return {
        id: 'user_test',
        email: 'person@example.com',
        name: 'Person',
        avatar_url: null,
        session_id: 'sess_test',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      }
    }
    return null
  }

  async all() {
    if (this.sql.includes('from generation_attempts')) {
      return { results: this.env.attemptRows }
    }
    if (this.sql.includes('from generation_history')) {
      return { results: this.env.historyRows }
    }
    return { results: [] }
  }

  async run() {
    if (this.sql.includes('insert into generation_history')) {
      this.env.historyInserts.push(this.values)
    }
    return { success: true, meta: { changes: 1 } }
  }
}

function createEnv() {
  const env = {
    historyInserts: [],
    historyRows: [],
    attemptRows: [],
    statements: [],
    DB: {
      prepare(sql) {
        env.statements.push(sql)
        return new TestStatement(env, sql)
      },
    },
  }
  return env
}

test('history feed merges pending and failed attempts with completed results', async () => {
  const env = createEnv()
  env.historyRows = [{
    id: 'gen_completed',
    media_type: 'image',
    model: 'gpt-image-2',
    prompt: 'Completed portrait',
    output_url: 'https://assets.toolaze.com/completed.webp',
    input_urls: null,
    native_audio: 0,
    created_at: '2026-08-09T00:01:00.000Z',
  }]
  env.attemptRows = [{
    id: 'gen_attempt_pending',
    task_id: 'task_pending',
    media_type: 'video',
    status: 'pending',
    model: 'veo-3-1',
    prompt: 'Pending video',
    output_url: null,
    input_urls: '[]',
    native_audio: 0,
    consumption_id: 'consume_1',
    task_provider: 'veo',
    required_credits: 40,
    history_id: null,
    created_at: '2026-08-09T00:02:00.000Z',
    updated_at: '2026-08-09T00:02:05.000Z',
  }, {
    id: 'gen_attempt_failed',
    task_id: 'task_failed',
    media_type: 'image',
    status: 'failed',
    model: 'gpt-image-2',
    prompt: 'Failed portrait',
    output_url: null,
    input_urls: '[]',
    native_audio: 0,
    failure_reason: 'Generation failed',
    history_id: null,
    created_at: '2026-08-09T00:00:00.000Z',
    updated_at: '2026-08-09T00:00:05.000Z',
  }, {
    id: 'gen_attempt_linked',
    task_id: 'task_completed',
    media_type: 'image',
    status: 'succeeded',
    model: 'gpt-image-2',
    prompt: 'Completed portrait',
    output_url: 'https://assets.toolaze.com/completed.webp',
    input_urls: '[]',
    native_audio: 0,
    history_id: 'gen_completed',
    created_at: '2026-08-09T00:01:00.000Z',
    updated_at: '2026-08-09T00:01:05.000Z',
  }]

  const response = await onRequest({
    env,
    request: new Request('https://toolaze.test/api/history?limit=200', {
      headers: { Cookie: 'toolaze_session=test-session-token' },
    }),
  })
  const payload = await response.json()

  assert.deepEqual(payload.items.map(({ id, status }) => [id, status]), [
    ['gen_attempt_pending', 'pending'],
    ['gen_completed', 'succeeded'],
    ['gen_attempt_failed', 'failed'],
  ])
  assert.equal(payload.items[0].statusRequest.endpoint, '/api/ai-video-generator/status')
  assert.equal(payload.items[0].statusRequest.taskProvider, 'veo')
  assert.equal(payload.items[0].statusRequest.creditHold.consumptionId, 'consume_1')
})

test('video output submitted through image generation resumes through the image status endpoint', async () => {
  const env = createEnv()
  env.attemptRows = [{
    id: 'gen_attempt_grok_video',
    task_id: 'task_grok_video',
    media_type: 'video',
    status: 'pending',
    model: 'grok-video-1-5',
    prompt: 'Animate this image',
    output_url: null,
    input_urls: '[]',
    native_audio: 0,
    consumption_id: 'consume_grok_video',
    task_provider: 'image-to-image',
    required_credits: 20,
    history_id: null,
    created_at: '2026-08-09T00:00:00.000Z',
    updated_at: '2026-08-09T00:00:05.000Z',
  }]

  const response = await onRequest({
    env,
    request: new Request('https://toolaze.test/api/history', {
      headers: { Cookie: 'toolaze_session=test-session-token' },
    }),
  })
  const payload = await response.json()

  assert.equal(payload.items[0].statusRequest.endpoint, '/api/image-to-image/status')
})

test('history function accepts promptless video history for motion control', async () => {
  const env = createEnv()
  const request = new Request('https://toolaze.test/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=test-session-token',
    },
    body: JSON.stringify({
      mediaType: 'video',
      model: 'kling-3-motion-control',
      prompt: '',
      outputUrl: 'https://example.com/kling-motion-output.mp4',
      inputUrls: [
        'https://example.com/character.png',
        'https://example.com/reference-motion.mp4',
      ],
      outputFormat: JSON.stringify({ duration: 10, characterOrientation: 'image' }),
    }),
  })

  const response = await onRequest({ request, env })
  const payload = await response.json()

  assert.equal(response.status, 201)
  assert.equal(payload.item.mediaType, 'video')
  assert.equal(payload.item.model, 'kling-3-motion-control')
  assert.equal(payload.item.prompt, '')
  assert.equal(env.historyInserts.length, 1)
})
