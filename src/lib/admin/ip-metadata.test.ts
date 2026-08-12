import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  fetchProductionGenerationRecords,
  fetchProductionUserUsage,
  fetchProductionUsers,
  parseGenerationRecordRows,
  parseWranglerRows,
} from './users'

test('maps login and request IP metadata from D1 rows', () => {
  const users = parseWranglerRows(JSON.stringify([{ results: [{
    id: 'user_1',
    email: 'person@example.com',
    name: null,
    avatar_url: null,
    created_at: '2026-08-12T00:00:00.000Z',
    updated_at: '2026-08-12T00:00:00.000Z',
    signup_path: null,
    signup_url: null,
    signup_referrer: null,
    signup_ip: '203.0.113.8',
    signup_country: 'US',
    credit_balance: 0,
    last_login_at: null,
    last_login_ip: '198.51.100.9',
    last_login_country: 'CA',
    has_active_session: 0,
    image_generation_count: 0,
    video_generation_count: 0,
    last_generation_at: null,
    recent_model: null,
    recent_tool_slug: null,
    recent_tool_label: null,
    top_tool_slug: null,
    top_tool_label: null,
    top_tool_count: 0,
  }] }]))

  assert.equal(users[0].signupIp, '203.0.113.8')
  assert.equal(users[0].signupCountry, 'US')
  assert.equal(users[0].lastLoginIp, '198.51.100.9')
  assert.equal(users[0].lastLoginCountry, 'CA')

  const records = parseGenerationRecordRows(JSON.stringify([{ results: [{
    id: 'gen_1',
    user_id: 'user_1',
    user_email: 'person@example.com',
    user_name: null,
    media_type: 'image',
    model: 'seedream-5-0-lite',
    prompt: 'test',
    output_url: 'https://assets.toolaze.com/output.webp',
    input_urls: null,
    aspect_ratio: '9:16',
    resolution: null,
    output_format: 'webp',
    tool_slug: 'ai-bikini-generator',
    tool_label: 'AI Bikini Generator',
    source_path: '/ai-bikini-generator',
    request_ip: '192.0.2.10',
    request_country: 'JP',
    created_at: '2026-08-12T00:00:00.000Z',
  }] }]))

  assert.equal(records[0].requestIp, '192.0.2.10')
  assert.equal(records[0].requestCountry, 'JP')
})

test('admin D1 reads request IP fields and retain legacy fallbacks', async () => {
  const userQueries: string[] = []
  await fetchProductionUsers(async (_file, args) => {
    const sql = args[args.indexOf('--command') + 1]
    userQueries.push(sql)
    return JSON.stringify([{ results: [] }])
  })
  assert.match(userQueries[0], /u\.signup_ip/)
  assert.match(userQueries[0], /u\.last_login_ip/)

  const usageQueries: string[] = []
  await fetchProductionUserUsage('user_1', async (_file, args) => {
    usageQueries.push(args[args.indexOf('--command') + 1])
    return JSON.stringify([{ results: [] }])
  })
  assert.match(usageQueries[0], /request_ip/)
  assert.match(usageQueries[0], /request_country/)

  const generationQueries: string[] = []
  await fetchProductionGenerationRecords(async (_file, args) => {
    generationQueries.push(args[args.indexOf('--command') + 1])
    return JSON.stringify([{ results: [] }])
  })
  assert.match(generationQueries[0], /gh\.request_ip/)
  assert.match(generationQueries[0], /gh\.request_country/)
})

test('admin tables expose login and generation IP columns', async () => {
  const [dashboard, generations, detail] = await Promise.all([
    readFile(new URL('../../components/admin/UserDashboard.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../../app/admin/generations/page.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../../app/admin/users/[userId]/page.tsx', import.meta.url), 'utf8'),
  ])

  assert.match(dashboard, /注册 IP/)
  assert.match(dashboard, /注册国家/)
  assert.match(dashboard, /最近登录 IP/)
  assert.match(dashboard, /最近登录国家/)
  assert.match(dashboard, /user\.signupIp/)
  assert.match(dashboard, /user\.signupCountry/)
  assert.match(dashboard, /user\.lastLoginIp/)
  assert.match(dashboard, /user\.lastLoginCountry/)
  assert.match(generations, /<th[^>]*>IP<\/th>/)
  assert.match(generations, /<th[^>]*>国家<\/th>/)
  assert.match(generations, /record\.requestIp/)
  assert.match(generations, /record\.requestCountry/)
  assert.match(detail, /<th[^>]*>IP<\/th>/)
  assert.match(detail, /<th[^>]*>国家<\/th>/)
  assert.match(detail, /item\.requestIp/)
  assert.match(detail, /item\.requestCountry/)
})
