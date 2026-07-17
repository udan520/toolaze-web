import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

export type AdminUser = {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
  signupPath: string | null
  signupUrl: string | null
  signupReferrer: string | null
  creditBalance: number
  lastLoginAt: string | null
  hasActiveSession: boolean
  imageGenerationCount: number
  videoGenerationCount: number
  lastGenerationAt: string | null
  recentModel: string | null
  recentToolSlug: string | null
  recentToolLabel: string | null
  topToolSlug: string | null
  topToolLabel: string | null
  topToolCount: number
}

export type AdminCreditGrantHistoryItem = {
  id: string
  userId: string
  email: string
  amount: number
  balanceAfter: number
  description: string
  adminNote: string | null
  createdAt: string
}

export type AdminGenerationHistoryItem = {
  id: string
  mediaType: string
  model: string
  prompt: string
  outputUrl: string
  inputUrls: string[]
  aspectRatio: string | null
  resolution: string | null
  outputFormat: string | null
  toolSlug: string | null
  toolLabel: string | null
  sourcePath: string | null
  createdAt: string
}

export type AdminGenerationRecordItem = AdminGenerationHistoryItem & {
  userId: string
  userEmail: string
  userName: string | null
}

export type UserDashboardData = {
  users: AdminUser[]
  grantHistory: AdminCreditGrantHistoryItem[]
  stats: {
    totalUsers: number
    activeUsers: number
    totalCredits: number
    usersWithGenerations: number
  }
  fetchedAt: string
}

type CommandRunner = (file: string, args: string[]) => Promise<string>

type WranglerRow = Record<string, unknown>

const execFileAsync = promisify(execFile)
const DEFAULT_WRANGLER_TIMEOUT_MS = 15_000

const USER_DASHBOARD_SQL = `
SELECT
  u.id,
  u.email,
  u.name,
  u.avatar_url,
  u.created_at,
  u.updated_at,
  signup_attribution.signup_path AS signup_path,
  signup_attribution.signup_url AS signup_url,
  signup_attribution.referrer AS signup_referrer,
  COALESCE(ca.balance, 0) AS credit_balance,
  session_stats.last_login_at,
  COALESCE(session_stats.has_active_session, 0) AS has_active_session,
  COALESCE(generation_stats.image_generation_count, 0) AS image_generation_count,
  COALESCE(generation_stats.video_generation_count, 0) AS video_generation_count,
  generation_stats.last_generation_at,
  recent_model.model AS recent_model,
  recent_tool.tool_slug AS recent_tool_slug,
  recent_tool.tool_label AS recent_tool_label,
  top_tool.tool_slug AS top_tool_slug,
  top_tool.tool_label AS top_tool_label,
  top_tool.tool_count AS top_tool_count
FROM users u
LEFT JOIN user_signup_attribution signup_attribution ON signup_attribution.user_id = u.id
LEFT JOIN credit_accounts ca ON ca.user_id = u.id
LEFT JOIN (
  SELECT
    user_id,
    MAX(created_at) AS last_login_at,
    MAX(CASE WHEN julianday(expires_at) > julianday('now') THEN 1 ELSE 0 END) AS has_active_session
  FROM sessions
  GROUP BY user_id
) session_stats ON session_stats.user_id = u.id
LEFT JOIN (
  SELECT
    user_id,
    SUM(CASE WHEN media_type = 'image' THEN 1 ELSE 0 END) AS image_generation_count,
    SUM(CASE WHEN media_type = 'video' THEN 1 ELSE 0 END) AS video_generation_count,
    MAX(created_at) AS last_generation_at
  FROM generation_history
  GROUP BY user_id
) generation_stats ON generation_stats.user_id = u.id
LEFT JOIN (
  SELECT user_id, model
  FROM (
    SELECT
      user_id,
      model,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_number
    FROM generation_history
    WHERE model IS NOT NULL AND model != ''
  )
  WHERE row_number = 1
) recent_model ON recent_model.user_id = u.id
LEFT JOIN (
  SELECT user_id, tool_slug, tool_label
  FROM (
    SELECT
      user_id,
      tool_slug,
      COALESCE(NULLIF(tool_label, ''), tool_slug) AS tool_label,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_number
    FROM generation_history
    WHERE tool_slug IS NOT NULL AND tool_slug != ''
  )
  WHERE row_number = 1
) recent_tool ON recent_tool.user_id = u.id
LEFT JOIN (
  SELECT user_id, tool_slug, tool_label, tool_count
  FROM (
    SELECT
      user_id,
      tool_slug,
      COALESCE(NULLIF(tool_label, ''), tool_slug) AS tool_label,
      COUNT(*) AS tool_count,
      ROW_NUMBER() OVER (
        PARTITION BY user_id
        ORDER BY COUNT(*) DESC, MAX(created_at) DESC
      ) AS row_number
    FROM generation_history
    WHERE tool_slug IS NOT NULL AND tool_slug != ''
    GROUP BY user_id, tool_slug, tool_label
  )
  WHERE row_number = 1
) top_tool ON top_tool.user_id = u.id
ORDER BY u.created_at DESC;
`.trim()

const USER_DASHBOARD_LEGACY_SQL = USER_DASHBOARD_SQL
  .replace(
    `  signup_attribution.signup_path AS signup_path,
  signup_attribution.signup_url AS signup_url,
  signup_attribution.referrer AS signup_referrer,
`,
    `  NULL AS signup_path,
  NULL AS signup_url,
  NULL AS signup_referrer,
`,
  )
  .replace(
    'LEFT JOIN user_signup_attribution signup_attribution ON signup_attribution.user_id = u.id\n',
    '',
  )

const ADMIN_GRANT_HISTORY_SQL = `
SELECT
  ct.id,
  ct.user_id,
  u.email,
  ct.amount,
  ct.balance_after,
  ct.description,
  ct.metadata,
  ct.created_at
FROM credit_transactions ct
JOIN users u ON u.id = ct.user_id
WHERE ct.reason = 'admin_grant'
ORDER BY ct.created_at DESC
LIMIT 20;
`.trim()

const GENERATION_RECORDS_SQL = `
SELECT
  gh.id,
  gh.user_id,
  u.email AS user_email,
  u.name AS user_name,
  gh.media_type,
  gh.model,
  gh.prompt,
  gh.output_url,
  gh.input_urls,
  gh.aspect_ratio,
  gh.resolution,
  gh.output_format,
  gh.tool_slug,
  gh.tool_label,
  gh.source_path,
  gh.created_at
FROM generation_history gh
JOIN users u ON u.id = gh.user_id
ORDER BY gh.created_at DESC
LIMIT 200;
`.trim()

function buildUserUsageSql(userId: string): string {
  return `
SELECT
  id,
  media_type,
  model,
  prompt,
  output_url,
  input_urls,
  aspect_ratio,
  resolution,
  output_format,
  tool_slug,
  tool_label,
  source_path,
  created_at
FROM generation_history
WHERE user_id = ${quoteSqlString(userId)}
ORDER BY created_at DESC
LIMIT 100;
`.trim()
}

export function parseWranglerRows(stdout: string): AdminUser[] {
  return parseWranglerResultRows(stdout).map(mapWranglerRow)
}

export function parseGrantHistoryRows(stdout: string): AdminCreditGrantHistoryItem[] {
  return parseWranglerResultRows(stdout).map(mapGrantHistoryRow)
}

export function parseGenerationHistoryRows(stdout: string): AdminGenerationHistoryItem[] {
  return parseWranglerResultRows(stdout).map(mapGenerationHistoryRow)
}

export function parseGenerationRecordRows(stdout: string): AdminGenerationRecordItem[] {
  return parseWranglerResultRows(stdout).map(mapGenerationRecordRow)
}

function parseWranglerResultRows(stdout: string): unknown[] {
  let payload: unknown

  try {
    payload = JSON.parse(stdout)
  } catch {
    throw new Error('无法解析 Wrangler 返回的数据。')
  }

  const resultGroups = Array.isArray(payload) ? payload : [payload]
  const rows = resultGroups.flatMap((group) => {
    if (!isRecord(group) || !Array.isArray(group.results)) return []
    return group.results
  })

  if (!resultGroups.some((group) => isRecord(group) && Array.isArray(group.results))) {
    throw new Error('Wrangler 返回的数据缺少 results。')
  }

  return rows
}

export function buildUserDashboard(
  users: AdminUser[],
  grantHistory: AdminCreditGrantHistoryItem[] = [],
): UserDashboardData {
  return {
    users,
    grantHistory,
    stats: {
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.hasActiveSession).length,
      totalCredits: users.reduce((sum, user) => sum + user.creditBalance, 0),
      usersWithGenerations: users.filter(
        (user) => user.imageGenerationCount + user.videoGenerationCount > 0,
      ).length,
    },
    fetchedAt: new Date().toISOString(),
  }
}

export async function fetchProductionUserUsage(
  userId: string,
  runner: CommandRunner = runCommand,
  commandTimeoutMs = DEFAULT_WRANGLER_TIMEOUT_MS,
): Promise<AdminGenerationHistoryItem[]> {
  const args = [
    'wrangler',
    'd1',
    'execute',
    'DB',
    '--remote',
    '--json',
    '--command',
    buildUserUsageSql(userId),
  ]

  try {
    const stdout = await runWithTimeout(
      runner('npx', args),
      commandTimeoutMs,
    )

    return parseGenerationHistoryRows(stdout)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('无法解析 Wrangler')) {
      throw error
    }

    throw new Error(formatWranglerError(error))
  }
}

export async function fetchProductionGenerationRecords(
  runner: CommandRunner = runCommand,
  commandTimeoutMs = DEFAULT_WRANGLER_TIMEOUT_MS,
): Promise<AdminGenerationRecordItem[]> {
  const args = [
    'wrangler',
    'd1',
    'execute',
    'DB',
    '--remote',
    '--json',
    '--command',
    GENERATION_RECORDS_SQL,
  ]

  try {
    const stdout = await runWithTimeout(
      runner('npx', args),
      commandTimeoutMs,
    )

    return parseGenerationRecordRows(stdout)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('无法解析 Wrangler')) {
      throw error
    }

    throw new Error(formatWranglerError(error))
  }
}

export async function fetchProductionUsers(
  runner: CommandRunner = runCommand,
  commandTimeoutMs = DEFAULT_WRANGLER_TIMEOUT_MS,
): Promise<UserDashboardData> {
  try {
    const [users, grantHistoryStdout] = await Promise.all([
      fetchProductionUserRows(runner, commandTimeoutMs),
      runWithTimeout(
        runner('npx', buildD1ReadArgs(ADMIN_GRANT_HISTORY_SQL)),
        commandTimeoutMs,
      ),
    ])

    return buildUserDashboard(
      users,
      parseGrantHistoryRows(grantHistoryStdout),
    )
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('无法解析 Wrangler')) {
      throw error
    }

    throw new Error(formatWranglerError(error))
  }
}

async function fetchProductionUserRows(
  runner: CommandRunner,
  commandTimeoutMs: number,
): Promise<AdminUser[]> {
  try {
    const stdout = await runWithTimeout(
      runner('npx', buildD1ReadArgs(USER_DASHBOARD_SQL)),
      commandTimeoutMs,
    )

    return parseWranglerRows(stdout)
  } catch (error) {
    if (!isMissingSignupAttributionTableError(error)) throw error

    const stdout = await runWithTimeout(
      runner('npx', buildD1ReadArgs(USER_DASHBOARD_LEGACY_SQL)),
      commandTimeoutMs,
    )

    return parseWranglerRows(stdout)
  }
}

function buildD1ReadArgs(sql: string): string[] {
  return [
    'wrangler',
    'd1',
    'execute',
    'DB',
    '--remote',
    '--json',
    '--command',
    sql,
  ]
}

function isMissingSignupAttributionTableError(error: unknown): boolean {
  const messageParts = [error instanceof Error ? error.message : String(error)]

  if (isRecord(error)) {
    const stderr = error.stderr
    const stdout = error.stdout
    if (typeof stderr === 'string') messageParts.push(stderr)
    if (typeof stdout === 'string') messageParts.push(stdout)
  }

  return /no such table:\s*user_signup_attribution/i.test(messageParts.join('\n'))
}

function runWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`Wrangler command timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout)
  })
}

async function runCommand(file: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(file, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  })

  return stdout
}

function mapWranglerRow(value: unknown): AdminUser {
  if (!isRecord(value)) {
    throw new Error('Wrangler 返回了无效的用户记录。')
  }

  const id = readRequiredString(value.id, 'id')
  const email = readRequiredString(value.email, 'email')

  return {
    id,
    email,
    name: readNullableString(value.name),
    avatarUrl: readNullableString(value.avatar_url),
    createdAt: readRequiredString(value.created_at, 'created_at'),
    updatedAt: readRequiredString(value.updated_at, 'updated_at'),
    signupPath: readNullableString(value.signup_path),
    signupUrl: readNullableString(value.signup_url),
    signupReferrer: readNullableString(value.signup_referrer),
    creditBalance: readNumber(value.credit_balance),
    lastLoginAt: readNullableString(value.last_login_at),
    hasActiveSession: readNumber(value.has_active_session) > 0,
    imageGenerationCount: readNumber(value.image_generation_count),
    videoGenerationCount: readNumber(value.video_generation_count),
    lastGenerationAt: readNullableString(value.last_generation_at),
    recentModel: readNullableString(value.recent_model),
    recentToolSlug: readNullableString(value.recent_tool_slug),
    recentToolLabel: readNullableString(value.recent_tool_label),
    topToolSlug: readNullableString(value.top_tool_slug),
    topToolLabel: readNullableString(value.top_tool_label),
    topToolCount: readNumber(value.top_tool_count),
  }
}

function mapGrantHistoryRow(value: unknown): AdminCreditGrantHistoryItem {
  if (!isRecord(value)) {
    throw new Error('Wrangler 返回了无效的积分赠送记录。')
  }

  return {
    id: readRequiredString(value.id, 'id'),
    userId: readRequiredString(value.user_id, 'user_id'),
    email: readRequiredString(value.email, 'email'),
    amount: readNumber(value.amount),
    balanceAfter: readNumber(value.balance_after),
    description: readRequiredString(value.description, 'description'),
    adminNote: readAdminNote(value.metadata),
    createdAt: readRequiredString(value.created_at, 'created_at'),
  }
}

function mapGenerationHistoryRow(value: unknown): AdminGenerationHistoryItem {
  if (!isRecord(value)) {
    throw new Error('Wrangler 返回了无效的生成记录。')
  }

  return {
    id: readRequiredString(value.id, 'id'),
    mediaType: readRequiredString(value.media_type, 'media_type'),
    model: readRequiredString(value.model, 'model'),
    prompt: readRequiredString(value.prompt, 'prompt'),
    outputUrl: readRequiredString(value.output_url, 'output_url'),
    inputUrls: readStringArray(value.input_urls),
    aspectRatio: readNullableString(value.aspect_ratio),
    resolution: readNullableString(value.resolution),
    outputFormat: readNullableString(value.output_format),
    toolSlug: readNullableString(value.tool_slug),
    toolLabel: readNullableString(value.tool_label),
    sourcePath: readNullableString(value.source_path),
    createdAt: readRequiredString(value.created_at, 'created_at'),
  }
}

function mapGenerationRecordRow(value: unknown): AdminGenerationRecordItem {
  if (!isRecord(value)) {
    throw new Error('Wrangler 返回了无效的生成记录。')
  }

  return {
    ...mapGenerationHistoryRow(value),
    userId: readRequiredString(value.user_id, 'user_id'),
    userEmail: readRequiredString(value.user_email, 'user_email'),
    userName: readNullableString(value.user_name),
  }
}

function isRecord(value: unknown): value is WranglerRow {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Wrangler 用户记录缺少 ${field}。`)
  }
  return value
}

function readNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function readNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function readStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
  }

  if (typeof value !== 'string' || value.trim() === '') return []

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
  } catch {
    return []
  }
}

function readAdminNote(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null

  try {
    const parsed = JSON.parse(value)
    if (!isRecord(parsed)) return null
    return readNullableString(parsed.adminNote)
  } catch {
    return null
  }
}

function quoteSqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

function formatWranglerError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (/ENOENT|not found|could not determine executable/i.test(message)) {
    return '无法执行 Wrangler。请确认项目依赖已经安装。'
  }

  if (/not authenticated|not logged in|login|CLOUDFLARE_API_TOKEN|authentication/i.test(message)) {
    return 'Wrangler 尚未登录 Cloudflare，无法读取线上用户数据。'
  }

  if (/permission|unauthorized|forbidden|not authorized|code:\s*10000/i.test(message)) {
    return '当前 Cloudflare 账号没有读取线上 D1 的权限。'
  }

  if (/timed out|timeout/i.test(message)) {
    return '连接 Cloudflare 超时，请检查网络后重试。'
  }

  if (/fetch failed|network|ECONN|ETIMEDOUT|ENOTFOUND/i.test(message)) {
    return '连接 Cloudflare 失败，请检查网络后重试。'
  }

  return '线上 D1 用户查询失败。请在终端运行 Wrangler 查询检查具体原因。'
}
