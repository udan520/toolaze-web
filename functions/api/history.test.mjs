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
    DB: {
      prepare(sql) {
        return new TestStatement(env, sql)
      },
    },
  }
  return env
}

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
