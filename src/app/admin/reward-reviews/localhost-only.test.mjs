import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { isLocalAdminHost } from './localhost-only.js'

test('allows localhost admin hosts', () => {
  assert.equal(isLocalAdminHost('localhost:3010'), true)
  assert.equal(isLocalAdminHost('127.0.0.1:3010'), true)
  assert.equal(isLocalAdminHost('[::1]:3010'), true)
})

test('blocks production and preview admin hosts', () => {
  assert.equal(isLocalAdminHost('toolaze.com'), false)
  assert.equal(isLocalAdminHost('www.toolaze.com'), false)
  assert.equal(isLocalAdminHost('toolaze-web.vercel.app'), false)
  assert.equal(isLocalAdminHost('toolaze-web.pages.dev'), false)
})

test('does not import localhost guard from api routes', () => {
  const source = readFileSync(new URL('./localhost-only.js', import.meta.url), 'utf8')

  assert.doesNotMatch(source, /api\/_shared/)
})
