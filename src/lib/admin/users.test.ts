import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { isLocalAdminHost } from './access'
import {
  buildUserDashboard,
  fetchProductionGenerationRecords,
  fetchProductionUserUsage,
  fetchProductionUsers,
  parseGenerationRecordRows,
  parseGenerationHistoryRows,
  parseGrantHistoryRows,
  parseWranglerRows,
} from './users'

test('only localhost hosts can open the user dashboard', () => {
  assert.equal(isLocalAdminHost('localhost:3006'), true)
  assert.equal(isLocalAdminHost('127.0.0.1:3006'), true)
  assert.equal(isLocalAdminHost('[::1]:3006'), true)
  assert.equal(isLocalAdminHost('toolaze.com'), false)
})

test('maps nullable D1 aggregates without dropping the user', () => {
  const rows = parseWranglerRows(JSON.stringify([{
    results: [{
      id: 'user_1',
      email: 'owner@example.com',
      name: null,
      avatar_url: null,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
      credit_balance: null,
      last_login_at: null,
      has_active_session: 0,
      image_generation_count: null,
      video_generation_count: null,
      last_generation_at: null,
      recent_model: null,
      recent_tool_slug: null,
      recent_tool_label: null,
      top_tool_slug: null,
      top_tool_label: null,
      top_tool_count: null,
    }],
  }]))

  assert.equal(rows.length, 1)
  assert.equal(rows[0].creditBalance, 0)
  assert.equal(rows[0].imageGenerationCount, 0)
  assert.equal(rows[0].videoGenerationCount, 0)
  assert.equal(rows[0].hasActiveSession, false)
  assert.equal(rows[0].recentModel, null)
  assert.equal(rows[0].recentToolLabel, null)
  assert.equal(rows[0].topToolLabel, null)
  assert.equal(rows[0].topToolCount, 0)
})

test('maps recent and top generation tools for admin users', () => {
  const rows = parseWranglerRows(JSON.stringify([{
    results: [{
      id: 'user_1',
      email: 'owner@example.com',
      name: 'Owner',
      avatar_url: null,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
      credit_balance: 12,
      last_login_at: '2026-07-10T00:00:00.000Z',
      has_active_session: 1,
      image_generation_count: 3,
      video_generation_count: 0,
      last_generation_at: '2026-07-10T12:00:00.000Z',
      recent_model: 'seedream-5-0-pro',
      recent_tool_slug: 'ai-hairstyle-changer',
      recent_tool_label: 'AI Hairstyle Changer',
      top_tool_slug: 'ai-image-generator',
      top_tool_label: 'AI Image Generator',
      top_tool_count: 2,
    }],
  }]))

  assert.equal(rows[0].recentToolSlug, 'ai-hairstyle-changer')
  assert.equal(rows[0].recentToolLabel, 'AI Hairstyle Changer')
  assert.equal(rows[0].recentModel, 'seedream-5-0-pro')
  assert.equal(rows[0].topToolSlug, 'ai-image-generator')
  assert.equal(rows[0].topToolLabel, 'AI Image Generator')
  assert.equal(rows[0].topToolCount, 2)
})

test('maps signup attribution for admin users', () => {
  const rows = parseWranglerRows(JSON.stringify([{
    results: [{
      id: 'user_1',
      email: 'owner@example.com',
      name: 'Owner',
      avatar_url: null,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T00:00:00.000Z',
      credit_balance: 12,
      last_login_at: '2026-07-10T00:00:00.000Z',
      has_active_session: 1,
      image_generation_count: 3,
      video_generation_count: 0,
      last_generation_at: '2026-07-10T12:00:00.000Z',
      recent_model: 'seedream-5-0-pro',
      recent_tool_slug: 'ai-hairstyle-changer',
      recent_tool_label: 'AI Hairstyle Changer',
      top_tool_slug: 'ai-image-generator',
      top_tool_label: 'AI Image Generator',
      top_tool_count: 2,
      signup_path: '/model/seedream-4-5',
      signup_url: 'https://toolaze.com/model/seedream-4-5?utm_source=google',
      signup_referrer: 'https://www.google.com/',
    }],
  }]))

  assert.equal(rows[0].signupPath, '/model/seedream-4-5')
  assert.equal(rows[0].signupUrl, 'https://toolaze.com/model/seedream-4-5?utm_source=google')
  assert.equal(rows[0].signupReferrer, 'https://www.google.com/')
})

test('maps generation history rows for a single admin user', () => {
  const rows = parseGenerationHistoryRows(JSON.stringify([{
    results: [{
      id: 'gen_1',
      media_type: 'image',
      model: 'nano-banana-pro',
      prompt: 'A product photo',
      output_url: 'https://example.com/output.png',
      input_urls: JSON.stringify(['https://example.com/input.png']),
      aspect_ratio: '1:1',
      resolution: '1K',
      output_format: 'PNG',
      tool_slug: 'ai-image-generator',
      tool_label: 'AI Image Generator',
      source_path: '/ai-image-generator',
      created_at: '2026-07-10T12:00:00.000Z',
    }],
  }]))

  assert.deepEqual(rows, [{
    id: 'gen_1',
    mediaType: 'image',
    model: 'nano-banana-pro',
    prompt: 'A product photo',
    outputUrl: 'https://example.com/output.png',
    inputUrls: ['https://example.com/input.png'],
    aspectRatio: '1:1',
    resolution: '1K',
    outputFormat: 'PNG',
    toolSlug: 'ai-image-generator',
    toolLabel: 'AI Image Generator',
    sourcePath: '/ai-image-generator',
    createdAt: '2026-07-10T12:00:00.000Z',
  }])
})

test('maps global generation records with user metadata', () => {
  const rows = parseGenerationRecordRows(JSON.stringify([{
    results: [{
      id: 'gen_1',
      user_id: 'user_1',
      user_email: 'owner@example.com',
      user_name: 'Owner',
      media_type: 'image',
      model: 'gpt-image-2',
      prompt: 'A fairy walking through a glowing forest',
      output_url: 'https://tempfile.aiquickdraw.com/p/result.png',
      input_urls: JSON.stringify(['https://example.com/input.png']),
      aspect_ratio: '3:4',
      resolution: '1K',
      output_format: 'Auto',
      tool_slug: 'ai-image-generator',
      tool_label: 'AI Image Generator',
      source_path: '/ai-image-generator',
      created_at: '2026-07-13T04:11:00.000Z',
    }],
  }]))

  assert.deepEqual(rows, [{
    id: 'gen_1',
    userId: 'user_1',
    userEmail: 'owner@example.com',
    userName: 'Owner',
    mediaType: 'image',
    model: 'gpt-image-2',
    prompt: 'A fairy walking through a glowing forest',
    outputUrl: 'https://tempfile.aiquickdraw.com/p/result.png',
    inputUrls: ['https://example.com/input.png'],
    aspectRatio: '3:4',
    resolution: '1K',
    outputFormat: 'Auto',
    toolSlug: 'ai-image-generator',
    toolLabel: 'AI Image Generator',
    sourcePath: '/ai-image-generator',
    createdAt: '2026-07-13T04:11:00.000Z',
  }])
})

test('builds aggregate dashboard statistics', () => {
  const dashboard = buildUserDashboard([
    {
      id: 'user_1',
      email: 'one@example.com',
      name: 'One',
      avatarUrl: null,
      createdAt: '2026-07-01T00:00:00.000Z',
      updatedAt: '2026-07-01T00:00:00.000Z',
      signupPath: null,
      signupUrl: null,
      signupReferrer: null,
      creditBalance: 20,
      lastLoginAt: '2026-07-09T00:00:00.000Z',
      hasActiveSession: true,
      imageGenerationCount: 2,
      videoGenerationCount: 0,
      lastGenerationAt: '2026-07-09T00:00:00.000Z',
      recentModel: 'gpt-image-2',
      recentToolSlug: 'ai-image-generator',
      recentToolLabel: 'AI Image Generator',
      topToolSlug: 'ai-image-generator',
      topToolLabel: 'AI Image Generator',
      topToolCount: 2,
    },
    {
      id: 'user_2',
      email: 'two@example.com',
      name: null,
      avatarUrl: null,
      createdAt: '2026-07-02T00:00:00.000Z',
      updatedAt: '2026-07-02T00:00:00.000Z',
      signupPath: null,
      signupUrl: null,
      signupReferrer: null,
      creditBalance: 10,
      lastLoginAt: null,
      hasActiveSession: false,
      imageGenerationCount: 0,
      videoGenerationCount: 0,
      lastGenerationAt: null,
      recentModel: null,
      recentToolSlug: null,
      recentToolLabel: null,
      topToolSlug: null,
      topToolLabel: null,
      topToolCount: 0,
    },
  ])

  assert.deepEqual(dashboard.stats, {
    totalUsers: 2,
    activeUsers: 1,
    totalCredits: 30,
    usersWithGenerations: 1,
  })
  assert.deepEqual(dashboard.grantHistory, [])
})

test('maps admin credit grant history and keeps admin notes private', () => {
  const rows = parseGrantHistoryRows(JSON.stringify([{
    results: [{
      id: 'credit_txn_1',
      user_id: 'user_1',
      email: 'owner@example.com',
      amount: 1000,
      balance_after: 1200,
      description: 'Bonus credits',
      metadata: JSON.stringify({ adminNote: '测试补偿' }),
      created_at: '2026-07-10T00:00:00.000Z',
    }],
  }]))

  assert.deepEqual(rows, [{
    id: 'credit_txn_1',
    userId: 'user_1',
    email: 'owner@example.com',
    amount: 1000,
    balanceAfter: 1200,
    description: 'Bonus credits',
    adminNote: '测试补偿',
    createdAt: '2026-07-10T00:00:00.000Z',
  }])
})

test('executes a fixed remote read-only Wrangler query', async () => {
  const calls: Array<{ file: string; args: string[] }> = []

  await fetchProductionUsers(async (file, args) => {
    calls.push({ file, args })
    return JSON.stringify([{ results: [] }])
  })

  assert.equal(calls.length, 2)

  for (const call of calls) {
    assert.equal(call.file, 'npx')
    assert.equal(call.args[0], 'wrangler')
    assert.ok(call.args.includes('--remote'))
    assert.ok(call.args.includes('--json'))
    assert.ok(call.args.includes('DB'))

    const commandIndex = call.args.indexOf('--command')
    assert.ok(commandIndex >= 0)
    const sql = call.args[commandIndex + 1]
    assert.match(sql, /^\s*SELECT\b/i)
    if (/FROM users u/i.test(sql)) {
      assert.match(sql, /recent_model\.model AS recent_model/i)
      assert.match(sql, /\) recent_model ON recent_model\.user_id = u\.id/i)
      assert.match(sql, /signup_attribution\.signup_path AS signup_path/i)
      assert.match(sql, /LEFT JOIN user_signup_attribution signup_attribution ON signup_attribution\.user_id = u\.id/i)
    }
    assert.doesNotMatch(sql, /\b(?:INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b/i)
  }
})

test('falls back when signup attribution table is not migrated yet', async () => {
  const calls: string[] = []

  await fetchProductionUsers(async (_file, args) => {
    const commandIndex = args.indexOf('--command')
    const sql = args[commandIndex + 1]
    calls.push(sql)

    if (/FROM users u/i.test(sql) && /user_signup_attribution/i.test(sql)) {
      throw new Error('D1_ERROR: no such table: user_signup_attribution')
    }

    return JSON.stringify([{ results: [] }])
  })

  assert.ok(calls.some((sql) => /user_signup_attribution/i.test(sql)))
  assert.ok(calls.some((sql) => /NULL AS signup_path/i.test(sql)))
})

test('falls back when Wrangler reports missing signup table in stderr', async () => {
  const calls: string[] = []

  await fetchProductionUsers(async (_file, args) => {
    const commandIndex = args.indexOf('--command')
    const sql = args[commandIndex + 1]
    calls.push(sql)

    if (/FROM users u/i.test(sql) && /user_signup_attribution/i.test(sql)) {
      const error = new Error('Command failed: npx wrangler d1 execute DB')
      Object.assign(error, {
        stderr: JSON.stringify({
          error: {
            notes: [{ text: 'no such table: user_signup_attribution: SQLITE_ERROR [code: 7500]' }],
          },
        }),
      })
      throw error
    }

    return JSON.stringify([{ results: [] }])
  })

  assert.ok(calls.some((sql) => /user_signup_attribution/i.test(sql)))
  assert.ok(calls.some((sql) => /NULL AS signup_path/i.test(sql)))
})

test('executes a fixed read-only user usage query', async () => {
  const calls: Array<{ file: string; args: string[] }> = []

  await fetchProductionUserUsage('user_1', async (file, args) => {
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
  assert.match(sql, /^\s*SELECT\b/i)
  assert.match(sql, /WHERE user_id = 'user_1'/)
  assert.doesNotMatch(sql, /\b(?:INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b/i)
})

test('executes a fixed read-only global generation records query', async () => {
  const calls: Array<{ file: string; args: string[] }> = []

  await fetchProductionGenerationRecords(async (file, args) => {
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
  assert.match(sql, /^\s*SELECT\b/i)
  assert.match(sql, /FROM generation_history gh/i)
  assert.match(sql, /JOIN users u ON u\.id = gh\.user_id/i)
  assert.match(sql, /ORDER BY gh\.created_at DESC/i)
  assert.match(sql, /LIMIT 200/i)
  assert.doesNotMatch(sql, /\b(?:INSERT|UPDATE|DELETE|DROP|ALTER|CREATE)\b/i)
})

test('reads users and grant history concurrently', async () => {
  const calls: string[][] = []
  const resolvers: Array<(value: string) => void> = []

  const pending = fetchProductionUsers(async (_file, args) => {
    calls.push(args)
    return new Promise<string>((resolve) => {
      resolvers.push(resolve)
    })
  })

  await new Promise((resolve) => setImmediate(resolve))

  assert.equal(calls.length, 2)

  resolvers.forEach((resolve) => resolve(JSON.stringify([{ results: [] }])))
  await pending
})

test('fails fast when remote Wrangler read hangs', async () => {
  await assert.rejects(
    () => fetchProductionUsers(
      async () => new Promise<string>(() => {}),
      5,
    ),
    /连接 Cloudflare 超时/,
  )
})

test('rejects unexpected Wrangler output', () => {
  assert.throws(
    () => parseWranglerRows('not-json'),
    /无法解析 Wrangler 返回的数据/,
  )
})

test('admin users page stays protected and noindex', () => {
  const pagePath = join(process.cwd(), 'src/app/admin/users/page.tsx')

  assert.equal(existsSync(pagePath), true)

  const source = readFileSync(pagePath, 'utf8')
  assert.match(source, /noindex, nofollow/)
  assert.match(source, /isAdminRequestAllowed/)
  assert.match(source, /x-forwarded-host/)
  assert.match(source, /notFound/)
  assert.doesNotMatch(source, /seo-factory/i)
})

test('admin generation records page stays protected and lists global tasks', () => {
  const pagePath = join(process.cwd(), 'src/app/admin/generations/page.tsx')

  assert.equal(existsSync(pagePath), true)

  const source = readFileSync(pagePath, 'utf8')
  assert.match(source, /任务生成记录/)
  assert.match(source, /noindex, nofollow/)
  assert.match(source, /isAdminRequestAllowed/)
  assert.match(source, /x-forwarded-host/)
  assert.match(source, /notFound/)
  assert.match(source, /fetchProductionGenerationRecords/)
})

test('admin user detail page stays protected and noindex', () => {
  const pagePath = join(process.cwd(), 'src/app/admin/users/[userId]/page.tsx')

  assert.equal(existsSync(pagePath), true)

  const source = readFileSync(pagePath, 'utf8')
  assert.match(source, /noindex, nofollow/)
  assert.match(source, /isAdminRequestAllowed/)
  assert.match(source, /x-forwarded-host/)
  assert.match(source, /notFound/)
  assert.match(source, /fetchProductionUserUsage/)
})

test('admin user detail page renders inline output previews', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/app/admin/users/[userId]/page.tsx'),
    'utf8',
  )

  assert.match(source, /function OutputPreview/)
  assert.match(source, /buildAdminMediaPreviewUrl/)
  assert.match(source, /<img/)
  assert.match(source, /<video/)
  assert.match(source, /item\.mediaType === 'video'/)
  assert.match(source, /浏览器预览/)
  assert.match(source, /下载原图/)
})

test('user dashboard links to per-user usage records', () => {
  const source = readFileSync(
    join(process.cwd(), 'src/components/admin/UserDashboard.tsx'),
    'utf8',
  )

  assert.match(source, /<a\s+href=\{`\/admin\/users\/\$\{encodeURIComponent\(user\.id\)\}`\}/)
  assert.match(source, /href="\/admin\/generations"/)
  assert.match(source, /任务生成记录/)
  assert.match(source, /使用记录/)
  assert.match(source, /<th className="px-4 py-3 text-right">余额<\/th>/)
  assert.doesNotMatch(source, /<th className="px-4 py-3 text-right">Credits<\/th>/)
  assert.match(source, /最近使用模型/)
  assert.match(source, /user\.recentModel/)
  assert.match(source, /注册入口/)
  assert.match(source, /user\.signupPath/)
  assert.match(source, /Creem 提示词检测/)
  assert.match(source, /\/api\/admin\/settings\?source=production/)
  assert.match(source, /creemPromptModerationEnabled/)
  assert.match(source, /aria-label="Creem 提示词检测开关"/)
  assert.match(source, /aria-pressed=\{isEnabled\}/)
  assert.match(source, /aria-pressed=\{isDisabled\}/)
  assert.match(source, /updateSettings\(true\)/)
  assert.match(source, /updateSettings\(false\)/)
  assert.match(source, /const \[enabled, setEnabled\] = useState\(false\)/)
  assert.match(source, /const \[loading, setLoading\] = useState\(false\)/)
  assert.match(source, /setEnabled\(false\)[\s\S]*formatAdminSettingsError/)
  assert.match(source, /const isDisabled = !enabled/)
  assert.match(source, /const ADMIN_SETTINGS_TIMEOUT_MS = 8000/)
  assert.match(source, /fetchAdminSettings\(ADMIN_SETTINGS_URL/)
  assert.match(source, /AbortSignal\.timeout/)
  assert.match(source, /const actionDisabled = saving/)
  assert.match(source, /disabled=\{actionDisabled\}/)
  assert.doesNotMatch(source, /disabled=\{loading \|\| saving \|\| enabled === null/)
  assert.doesNotMatch(source, /\? '读取中'/)
  assert.doesNotMatch(source, /updateSettings\(!isEnabled\)/)
  assert.doesNotMatch(source, /常用功能/)
})

test('signup attribution migration creates a dedicated table', () => {
  const migrationPath = join(process.cwd(), 'migrations/0005_user_signup_attribution.sql')

  assert.equal(existsSync(migrationPath), true)

  const source = readFileSync(migrationPath, 'utf8')
  assert.match(source, /create table if not exists user_signup_attribution/i)
  assert.match(source, /user_id text primary key references users\(id\) on delete cascade/i)
  assert.match(source, /signup_path text/i)
  assert.match(source, /utm_source text/i)
})
