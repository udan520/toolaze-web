import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest } from './settings.js'

function createAdminRequest(method = 'GET', body = undefined) {
  return new Request('https://toolaze-web.pages.dev/api/admin/settings', {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': 'admin-token',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

function createSettingsDb(initialValue = 'true') {
  const rows = new Map([['creem_prompt_moderation_enabled', initialValue]])
  const statements = []

  return {
    rows,
    statements,
    prepare(sql) {
      statements.push(sql)
      return {
        bind(...values) {
          return {
            async first() {
              return rows.has(values[0]) ? { key: values[0], value: rows.get(values[0]) } : null
            },
            async run() {
              rows.set(values[0], values[1])
              return { meta: { changes: 1 } }
            },
          }
        },
      }
    },
  }
}

test('admin settings returns the current Creem prompt moderation switch', async () => {
  const db = createSettingsDb('false')

  const response = await onRequest({
    request: createAdminRequest(),
    env: { DB: db, REWARD_REVIEW_ADMIN_TOKEN: 'admin-token' },
  })
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.settings.creemPromptModerationEnabled, false)
})

test('admin settings updates the Creem prompt moderation switch', async () => {
  const db = createSettingsDb('true')

  const response = await onRequest({
    request: createAdminRequest('POST', { creemPromptModerationEnabled: false }),
    env: { DB: db, REWARD_REVIEW_ADMIN_TOKEN: 'admin-token' },
  })
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.settings.creemPromptModerationEnabled, false)
  assert.equal(db.rows.get('creem_prompt_moderation_enabled'), 'false')
})

test('admin settings requires the admin token', async () => {
  const response = await onRequest({
    request: createAdminRequest(),
    env: { DB: createSettingsDb('true'), REWARD_REVIEW_ADMIN_TOKEN: 'admin-token-2' },
  })
  const payload = await response.json()

  assert.equal(response.status, 403)
  assert.equal(payload.error, 'Admin token required.')
})
