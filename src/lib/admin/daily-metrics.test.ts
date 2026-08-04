import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import {
  buildDailyMetricsDashboard,
  fetchProductionDailyMetrics,
  parseDailyMetricsRows,
} from './daily-metrics'

test('maps daily metric rows from Wrangler output', () => {
  const rows = parseDailyMetricsRows(JSON.stringify([{
    results: [{
      metric_date: '2026-07-18',
      checkin_users: 12,
      registered_users: 7,
      image_generation_users: 5,
      image_generation_count: 9,
    }],
  }]))

  assert.deepEqual(rows, [{
    date: '2026-07-18',
    checkinUsers: 12,
    registeredUsers: 7,
    imageGenerationUsers: 5,
    imageGenerationCount: 9,
  }])
})

test('builds daily metrics dashboard totals', () => {
  const dashboard = buildDailyMetricsDashboard([
    {
      date: '2026-07-18',
      checkinUsers: 12,
      registeredUsers: 7,
      imageGenerationUsers: 5,
      imageGenerationCount: 9,
    },
    {
      date: '2026-07-19',
      checkinUsers: 4,
      registeredUsers: 3,
      imageGenerationUsers: 2,
      imageGenerationCount: 2,
    },
  ])

  assert.deepEqual(dashboard.totals, {
    checkinUsers: 16,
    registeredUsers: 10,
    imageGenerationUsers: 7,
    imageGenerationCount: 11,
  })
  assert.equal(dashboard.latestDate, '2026-07-19')
})

test('executes a fixed read-only daily metrics query', async () => {
  const calls: Array<{ file: string; args: string[] }> = []

  await fetchProductionDailyMetrics(async (file, args) => {
    calls.push({ file, args })
    return JSON.stringify([{ results: [] }])
  })

  assert.equal(calls.length, 1)
  assert.equal(calls[0].file, 'npx')
  assert.equal(calls[0].args[0], 'wrangler')
  assert.ok(calls[0].args.includes('--remote'))
  assert.ok(calls[0].args.includes('--json'))
  assert.ok(calls[0].args.includes('DB'))

  const commandIndex = calls[0].args.indexOf('--command')
  assert.ok(commandIndex >= 0)
  const sql = calls[0].args[commandIndex + 1]
  assert.match(sql, /^\s*WITH RECURSIVE\b/i)
  assert.match(sql, /FROM users/i)
  assert.match(sql, /FROM credit_transactions/i)
  assert.match(sql, /reason = 'daily_checkin'/i)
  assert.match(sql, /FROM generation_history/i)
  assert.match(sql, /media_type = 'image'/i)
  assert.match(sql, /COUNT\(DISTINCT user_id\)/i)
  assert.doesNotMatch(sql, /\b(?:INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b/i)
})

test('admin data dashboard page stays protected and noindex', () => {
  const pagePath = join(process.cwd(), 'src/app/admin/data-dashboard/page.tsx')

  assert.equal(existsSync(pagePath), true)

  const source = readFileSync(pagePath, 'utf8')
  assert.match(source, /每日数据看板/)
  assert.match(source, /noindex, nofollow/)
  assert.match(source, /isAdminRequestAllowed/)
  assert.match(source, /x-forwarded-host/)
  assert.match(source, /notFound/)
  assert.match(source, /fetchProductionDailyMetrics/)
})
