import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getAdminEmailFromHeaders,
  isAdminEmailAllowed,
  isAdminRequestAllowed,
  isLocalAdminHost,
  parseAdminEmailAllowlist,
} from './access'

test('local admin hosts are allowed for local-only operations', () => {
  assert.equal(isLocalAdminHost('localhost:3006'), true)
  assert.equal(isLocalAdminHost('127.0.0.1:3006'), true)
  assert.equal(isLocalAdminHost('[::1]:3006'), true)
  assert.equal(isLocalAdminHost('toolaze.com'), false)
})

test('parses admin email allowlist from comma and newline separated env', () => {
  assert.deepEqual(
    parseAdminEmailAllowlist({
      TOOLAZE_ADMIN_EMAILS: ' Owner@Example.com, admin@example.com\nops@example.com ',
    }),
    ['owner@example.com', 'admin@example.com', 'ops@example.com'],
  )
})

test('allows configured admin email case-insensitively', () => {
  const env = { TOOLAZE_ADMIN_EMAILS: 'owner@example.com' }

  assert.equal(isAdminEmailAllowed('OWNER@example.com', env), true)
  assert.equal(isAdminEmailAllowed('other@example.com', env), false)
  assert.equal(isAdminEmailAllowed(null, env), false)
})

test('allows localhost by default and keeps remote admin disabled unless explicitly enabled', () => {
  const env = { TOOLAZE_ADMIN_EMAILS: 'owner@example.com' }

  assert.equal(isAdminRequestAllowed({
    host: 'localhost:3006',
    adminEmail: null,
    env,
  }), true)
  assert.equal(isAdminRequestAllowed({
    host: 'admin.toolaze.com',
    adminEmail: null,
    env,
  }), false)
  assert.equal(isAdminRequestAllowed({
    host: 'admin.toolaze.com',
    adminEmail: 'owner@example.com',
    env,
  }), false)
  assert.equal(isAdminRequestAllowed({
    host: 'admin.toolaze.com',
    adminEmail: 'owner@example.com',
    env: {
      ...env,
      TOOLAZE_ENABLE_REMOTE_ADMIN: 'true',
    },
  }), true)
  assert.equal(isAdminRequestAllowed({
    host: 'admin.toolaze.com',
    adminEmail: 'viewer@example.com',
    env: {
      ...env,
      TOOLAZE_ENABLE_REMOTE_ADMIN: 'true',
    },
  }), false)
})

test('reads admin email only from Cloudflare Access headers', () => {
  const headers = new Map([
    ['cf-access-authenticated-user-email', 'owner@example.com'],
  ])

  assert.equal(getAdminEmailFromHeaders({
    get(name: string) {
      return headers.get(name.toLowerCase()) ?? null
    },
  }), 'owner@example.com')

  assert.equal(getAdminEmailFromHeaders({
    get(name: string) {
      return name.toLowerCase() === 'x-admin-email' ? 'ops@example.com' : null
    },
  }), null)
})
