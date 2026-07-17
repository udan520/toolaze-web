import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import {
  grantProductionCredits,
  normalizeCreditGrantInput,
} from './credit-grants'

test('credit grant migration defines batches and consumption allocations', () => {
  const migrationPath = join(process.cwd(), 'migrations/0004_credit_grants.sql')

  assert.equal(existsSync(migrationPath), true)

  const sql = readFileSync(migrationPath, 'utf8')
  assert.match(sql, /create table if not exists credit_grants/i)
  assert.match(sql, /request_id text not null unique/i)
  assert.match(sql, /remaining_amount integer not null/i)
  assert.match(sql, /create table if not exists credit_consumptions/i)
  assert.match(sql, /create table if not exists credit_consumption_grants/i)
})

test('normalizes permanent, days, and explicit date expirations', () => {
  const now = new Date('2026-07-10T00:00:00.000Z')

  assert.equal(normalizeCreditGrantInput({
    requestId: 'admin_grant_12345678',
    amount: 100,
    expirationMode: 'permanent',
    note: '',
  }, now).expiresAt, null)

  assert.equal(normalizeCreditGrantInput({
    requestId: 'admin_grant_12345679',
    amount: 100,
    expirationMode: 'days',
    validDays: 30,
    note: '',
  }, now).expiresAt, '2026-08-09T00:00:00.000Z')

  assert.equal(normalizeCreditGrantInput({
    requestId: 'admin_grant_12345680',
    amount: 100,
    expirationMode: 'date',
    expiresAt: '2026-08-31T15:59:00.000Z',
    note: '',
  }, now).expiresAt, '2026-08-31T15:59:00.000Z')
})

test('rejects invalid amount, days, dates, note, and request id', () => {
  assert.throws(() => normalizeCreditGrantInput({
    requestId: 'bad',
    amount: 0,
    expirationMode: 'permanent',
    note: '',
  }), /requestId|amount/)

  assert.throws(() => normalizeCreditGrantInput({
    requestId: 'admin_grant_12345678',
    amount: 100,
    expirationMode: 'days',
    validDays: 0,
    note: '',
  }), /validDays/)

  assert.throws(() => normalizeCreditGrantInput({
    requestId: 'admin_grant_12345678',
    amount: 100,
    expirationMode: 'date',
    expiresAt: '2020-01-01T00:00:00.000Z',
    note: '',
  }, new Date('2026-07-10T00:00:00.000Z')), /expiresAt/)

  assert.throws(() => normalizeCreditGrantInput({
    requestId: 'admin_grant_12345678',
    amount: 100,
    expirationMode: 'permanent',
    note: 'x'.repeat(201),
  }), /note/)
})

test('uses fixed Wrangler database and transaction SQL', async () => {
  let receivedFile = ''
  let receivedArgs: string[] = []

  const result = await grantProductionCredits('user_1', {
    requestId: 'admin_grant_12345678',
    amount: 100,
    expirationMode: 'permanent',
    note: "Support's grant",
  }, async (file, args) => {
    receivedFile = file
    receivedArgs = args
    return JSON.stringify([{ results: [{ balance: 100, duplicate: 0 }] }])
  })

  assert.equal(result.balance, 100)
  assert.equal(result.duplicate, false)
  assert.equal(receivedFile, 'npx')
  assert.equal(receivedArgs[0], 'wrangler')
  assert.ok(receivedArgs.includes('DB'))
  assert.ok(receivedArgs.includes('--remote'))
  assert.ok(receivedArgs.includes('--json'))

  const commandIndex = receivedArgs.indexOf('--command')
  assert.ok(commandIndex >= 0)
  const sql = receivedArgs[commandIndex + 1]
  assert.doesNotMatch(sql, /\bBEGIN\b|\bCOMMIT\b/i)
  assert.match(sql, /credit_grants/i)
  assert.match(sql, /credit_transactions/i)
  assert.doesNotMatch(sql, /DROP TABLE|DELETE FROM users/i)
  assert.match(sql, /Bonus credits/)
  assert.match(sql, /adminNote/)
  assert.match(sql, /Support''s grant/)
})

test('hides raw Wrangler command when production grant fails', async () => {
  await assert.rejects(
    () => grantProductionCredits('user_1', {
      requestId: 'admin_grant_12345678',
      amount: 100,
      expirationMode: 'permanent',
      note: '',
    }, async () => {
      const error = new Error('Command failed: npx wrangler d1 execute DB --remote --json --command INSERT INTO credit_grants')
      Object.assign(error, {
        stderr: 'SQLITE_ERROR: no such table: credit_grants',
      })
      throw error
    }),
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.match(error.message, /缺少 credit_grants 表/)
      assert.doesNotMatch(error.message, /INSERT INTO|wrangler d1 execute/)
      return true
    },
  )
})

test('fails fast when remote Wrangler grant hangs', async () => {
  await assert.rejects(
    () => grantProductionCredits('user_1', {
      requestId: 'admin_grant_12345678',
      amount: 100,
      expirationMode: 'permanent',
      note: '',
    }, async () => new Promise<string>(() => {}), 5),
    /连接 Cloudflare 超时/,
  )
})

test('reports unsupported remote D1 transaction syntax without raw command details', async () => {
  await assert.rejects(
    () => grantProductionCredits('user_1', {
      requestId: 'admin_grant_12345679',
      amount: 100,
      expirationMode: 'permanent',
      note: '',
    }, async () => {
      const error = new Error('Command failed: npx wrangler d1 execute DB --remote --json --command BEGIN IMMEDIATE')
      Object.assign(error, {
        stderr: 'To execute a transaction, please use the state.storage.transaction() APIs instead. [code: 7500]',
      })
      throw error
    }),
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.match(error.message, /不支持当前事务写法/)
      assert.doesNotMatch(error.message, /BEGIN IMMEDIATE|wrangler d1 execute/)
      return true
    },
  )
})
