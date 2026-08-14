import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readAdminSnapshot, type AdminReadCacheOptions } from './read-cache'

export type AdminDailyMetric = {
  date: string
  checkinUsers: number
  registeredUsers: number
  imageGenerationUsers: number
  imageGenerationCount: number
}

export type AdminDailyMetricsDashboard = {
  rows: AdminDailyMetric[]
  totals: {
    checkinUsers: number
    registeredUsers: number
    imageGenerationUsers: number
    imageGenerationCount: number
  }
  latestDate: string | null
  fetchedAt: string
}

type CommandRunner = (file: string, args: string[]) => Promise<string>
type WranglerRow = Record<string, unknown>

const execFileAsync = promisify(execFile)
const DEFAULT_WRANGLER_TIMEOUT_MS = 30_000

const DAILY_METRICS_SQL = `
WITH RECURSIVE date_range(metric_date) AS (
  SELECT date('now', '+8 hours', '-29 days')
  UNION ALL
  SELECT date(metric_date, '+1 day')
  FROM date_range
  WHERE metric_date < date('now', '+8 hours')
),
registered AS (
  SELECT
    date(datetime(created_at, '+8 hours')) AS metric_date,
    COUNT(DISTINCT id) AS registered_users
  FROM users
  WHERE date(datetime(created_at, '+8 hours')) >= date('now', '+8 hours', '-29 days')
  GROUP BY date(datetime(created_at, '+8 hours'))
),
checkins AS (
  SELECT
    date(datetime(created_at, '+8 hours')) AS metric_date,
    COUNT(DISTINCT user_id) AS checkin_users
  FROM credit_transactions
  WHERE reason = 'daily_checkin'
    AND date(datetime(created_at, '+8 hours')) >= date('now', '+8 hours', '-29 days')
  GROUP BY date(datetime(created_at, '+8 hours'))
),
image_generations AS (
  SELECT
    date(datetime(created_at, '+8 hours')) AS metric_date,
    COUNT(DISTINCT user_id) AS image_generation_users,
    COUNT(*) AS image_generation_count
  FROM generation_history
  WHERE media_type = 'image'
    AND date(datetime(created_at, '+8 hours')) >= date('now', '+8 hours', '-29 days')
  GROUP BY date(datetime(created_at, '+8 hours'))
)
SELECT
  date_range.metric_date,
  COALESCE(checkins.checkin_users, 0) AS checkin_users,
  COALESCE(registered.registered_users, 0) AS registered_users,
  COALESCE(image_generations.image_generation_users, 0) AS image_generation_users,
  COALESCE(image_generations.image_generation_count, 0) AS image_generation_count
FROM date_range
LEFT JOIN checkins ON checkins.metric_date = date_range.metric_date
LEFT JOIN registered ON registered.metric_date = date_range.metric_date
LEFT JOIN image_generations ON image_generations.metric_date = date_range.metric_date
ORDER BY date_range.metric_date DESC;
`.trim()

export function parseDailyMetricsRows(stdout: string): AdminDailyMetric[] {
  return parseWranglerResultRows(stdout).map(mapDailyMetricRow)
}

export function buildDailyMetricsDashboard(rows: AdminDailyMetric[]): AdminDailyMetricsDashboard {
  return {
    rows,
    totals: rows.reduce((totals, row) => ({
      checkinUsers: totals.checkinUsers + row.checkinUsers,
      registeredUsers: totals.registeredUsers + row.registeredUsers,
      imageGenerationUsers: totals.imageGenerationUsers + row.imageGenerationUsers,
      imageGenerationCount: totals.imageGenerationCount + row.imageGenerationCount,
    }), {
      checkinUsers: 0,
      registeredUsers: 0,
      imageGenerationUsers: 0,
      imageGenerationCount: 0,
    }),
    latestDate: rows.reduce<string | null>((latest, row) => (
      !latest || row.date > latest ? row.date : latest
    ), null),
    fetchedAt: new Date().toISOString(),
  }
}

export async function fetchProductionDailyMetrics(
  runner: CommandRunner = runCommand,
  commandTimeoutMs = DEFAULT_WRANGLER_TIMEOUT_MS,
  cacheOptions: AdminReadCacheOptions = {},
): Promise<AdminDailyMetricsDashboard> {
  const loadMetrics = async () => {
    try {
      const stdout = await runWithTimeout(
        runner('npx', buildD1ReadArgs(DAILY_METRICS_SQL)),
        commandTimeoutMs,
      )

      return buildDailyMetricsDashboard(parseDailyMetricsRows(stdout))
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('无法解析 Wrangler')) {
        throw error
      }

      throw new Error(formatWranglerError(error))
    }
  }

  if (runner !== runCommand) return loadMetrics()
  return readAdminSnapshot('daily-metrics', loadMetrics, cacheOptions)
}

function buildD1ReadArgs(sql: string): string[] {
  return ['wrangler', 'd1', 'execute', 'DB', '--remote', '--json', '--command', sql]
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

function mapDailyMetricRow(value: unknown): AdminDailyMetric {
  if (!isRecord(value)) {
    throw new Error('Wrangler 返回了无效的每日数据记录。')
  }

  return {
    date: readRequiredString(value.metric_date, 'metric_date'),
    checkinUsers: readNumber(value.checkin_users),
    registeredUsers: readNumber(value.registered_users),
    imageGenerationUsers: readNumber(value.image_generation_users),
    imageGenerationCount: readNumber(value.image_generation_count),
  }
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

function isRecord(value: unknown): value is WranglerRow {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Wrangler 每日数据记录缺少 ${field}。`)
  }
  return value
}

function readNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function formatWranglerError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (/ENOENT|not found|could not determine executable/i.test(message)) {
    return '无法执行 Wrangler。请确认项目依赖已经安装。'
  }
  if (/not authenticated|not logged in|login|CLOUDFLARE_API_TOKEN|authentication/i.test(message)) {
    return 'Wrangler 尚未登录 Cloudflare，无法读取线上每日数据。'
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

  return '线上 D1 每日数据查询失败。请在终端运行 Wrangler 查询检查具体原因。'
}
