import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

export type CreditExpirationMode = 'permanent' | 'days' | 'date'

export type CreditGrantInput = {
  requestId: string
  amount: number
  expirationMode: CreditExpirationMode
  validDays?: number
  expiresAt?: string
  note?: string
}

export type NormalizedCreditGrantInput = {
  requestId: string
  amount: number
  expirationMode: CreditExpirationMode
  validDays: number | null
  expiresAt: string | null
  note: string
}

export type CreditGrantResult = {
  balance: number
  duplicate: boolean
}

type CommandRunner = (file: string, args: string[]) => Promise<string>
type WranglerRow = Record<string, unknown>

const execFileAsync = promisify(execFile)
const REQUEST_ID_PATTERN = /^admin_grant_[a-zA-Z0-9_-]{8,80}$/
const DEFAULT_WRANGLER_TIMEOUT_MS = 15_000

export function normalizeCreditGrantInput(
  input: CreditGrantInput,
  now = new Date(),
): NormalizedCreditGrantInput {
  const requestId = String(input.requestId || '').trim()
  if (!REQUEST_ID_PATTERN.test(requestId)) {
    throw new Error('requestId 格式无效。')
  }

  if (!Number.isInteger(input.amount) || input.amount < 1 || input.amount > 1_000_000) {
    throw new Error('amount 必须是 1 到 1000000 之间的整数。')
  }

  const note = String(input.note || '').trim()
  if (note.length > 200) {
    throw new Error('note 最多 200 个字符。')
  }

  if (input.expirationMode === 'permanent') {
    return {
      requestId,
      amount: input.amount,
      expirationMode: 'permanent',
      validDays: null,
      expiresAt: null,
      note,
    }
  }

  if (input.expirationMode === 'days') {
    const validDays = input.validDays
    if (
      typeof validDays !== 'number'
      || !Number.isInteger(validDays)
      || validDays < 1
      || validDays > 3650
    ) {
      throw new Error('validDays 必须是 1 到 3650 之间的整数。')
    }

    return {
      requestId,
      amount: input.amount,
      expirationMode: 'days',
      validDays,
      expiresAt: new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000).toISOString(),
      note,
    }
  }

  if (input.expirationMode === 'date') {
    const expiresAt = String(input.expiresAt || '').trim()
    const timestamp = Date.parse(expiresAt)
    if (!Number.isFinite(timestamp) || timestamp <= now.getTime()) {
      throw new Error('expiresAt 必须是晚于当前时间的有效日期。')
    }

    return {
      requestId,
      amount: input.amount,
      expirationMode: 'date',
      validDays: null,
      expiresAt: new Date(timestamp).toISOString(),
      note,
    }
  }

  throw new Error('expirationMode 无效。')
}

export async function grantProductionCredits(
  userId: string,
  input: CreditGrantInput,
  runner: CommandRunner = runCommand,
  commandTimeoutMs = DEFAULT_WRANGLER_TIMEOUT_MS,
): Promise<CreditGrantResult> {
  const normalized = normalizeCreditGrantInput(input)
  const now = new Date().toISOString()
  const grantId = createSqlId('credit_grant')
  const transactionId = createSqlId('credit_txn')
  const description = 'Bonus credits'
  const metadata = JSON.stringify({
    requestId: normalized.requestId,
    expirationMode: normalized.expirationMode,
    validDays: normalized.validDays,
    expiresAt: normalized.expiresAt,
    adminNote: normalized.note || null,
  })

  const sql = `
INSERT INTO credit_accounts (user_id, balance, created_at, updated_at)
VALUES (${sqlLiteral(userId)}, 0, ${sqlLiteral(now)}, ${sqlLiteral(now)})
ON CONFLICT(user_id) DO NOTHING;
INSERT INTO credit_grants (
  id, request_id, user_id, original_amount, remaining_amount,
  expires_at, reason, description, metadata, created_at, updated_at
)
VALUES (
  ${sqlLiteral(grantId)},
  ${sqlLiteral(normalized.requestId)},
  ${sqlLiteral(userId)},
  ${normalized.amount},
  ${normalized.amount},
  ${sqlNullable(normalized.expiresAt)},
  'admin_grant',
  ${sqlLiteral(description)},
  ${sqlLiteral(metadata)},
  ${sqlLiteral(now)},
  ${sqlLiteral(now)}
)
ON CONFLICT(request_id) DO NOTHING;
UPDATE credit_accounts
SET balance = balance + ${normalized.amount}, updated_at = ${sqlLiteral(now)}
WHERE user_id = ${sqlLiteral(userId)}
  AND EXISTS (
    SELECT 1 FROM credit_grants
    WHERE id = ${sqlLiteral(grantId)}
      AND request_id = ${sqlLiteral(normalized.requestId)}
  );
INSERT INTO credit_transactions (
  id, user_id, type, amount, balance_after, reason, description, metadata, created_at
)
SELECT
  ${sqlLiteral(transactionId)},
  ${sqlLiteral(userId)},
  'grant',
  ${normalized.amount},
  ca.balance,
  'admin_grant',
  ${sqlLiteral(description)},
  ${sqlLiteral(metadata)},
  ${sqlLiteral(now)}
FROM credit_accounts ca
WHERE ca.user_id = ${sqlLiteral(userId)}
  AND EXISTS (
    SELECT 1 FROM credit_grants
    WHERE id = ${sqlLiteral(grantId)}
      AND request_id = ${sqlLiteral(normalized.requestId)}
  );
SELECT
  COALESCE(ca.balance, 0) AS balance,
  CASE WHEN EXISTS (
    SELECT 1 FROM credit_grants
    WHERE request_id = ${sqlLiteral(normalized.requestId)}
      AND id <> ${sqlLiteral(grantId)}
  ) THEN 1 ELSE 0 END AS duplicate
FROM credit_accounts ca
WHERE ca.user_id = ${sqlLiteral(userId)};
`.trim()

  let stdout: string
  try {
    stdout = await runWithTimeout(
      runner('npx', [
        'wrangler',
        'd1',
        'execute',
        'DB',
        '--remote',
        '--json',
        '--command',
        sql,
      ]),
      commandTimeoutMs,
    )
  } catch (error) {
    throw new Error(formatGrantCommandError(error))
  }

  return parseGrantResult(stdout)
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

function parseGrantResult(stdout: string): CreditGrantResult {
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
  const row = rows.find((item) => isRecord(item) && 'balance' in item) as WranglerRow | undefined

  if (!row) {
    throw new Error('Wrangler 返回的数据缺少积分结果。')
  }

  return {
    balance: readNumber(row.balance),
    duplicate: readNumber(row.duplicate) > 0,
  }
}

async function runCommand(file: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(file, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  })

  return stdout
}

function createSqlId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`
}

function sqlNullable(value: string | null): string {
  return value === null ? 'NULL' : sqlLiteral(value)
}

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

function isRecord(value: unknown): value is WranglerRow {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function formatGrantCommandError(error: unknown): string {
  const message = readErrorText(error)

  if (/no such table:\s*credit_grants/i.test(message)) {
    return '线上 D1 尚未应用积分批次迁移，缺少 credit_grants 表。请先执行远程 D1 migration。'
  }

  if (/no such table:\s*credit_consumptions|no such table:\s*credit_consumption_grants/i.test(message)) {
    return '线上 D1 尚未应用积分消费批次迁移。请先执行远程 D1 migration。'
  }

  if (/BEGIN TRANSACTION|SAVEPOINT|BEGIN IMMEDIATE|code:\s*7500|automatic atomic write coalescing/i.test(message)) {
    return '线上 D1 不支持当前事务写法，请更新后台赠送逻辑后重试。'
  }

  if (/not authenticated|not logged in|login|CLOUDFLARE_API_TOKEN|authentication/i.test(message)) {
    return 'Wrangler 尚未登录 Cloudflare，无法写入线上 D1。'
  }

  if (/permission|unauthorized|forbidden|not authorized|code:\s*10000/i.test(message)) {
    return '当前 Cloudflare 账号没有写入线上 D1 的权限。'
  }

  if (/timed out|timeout/i.test(message)) {
    return '连接 Cloudflare 超时，请检查网络后重试。'
  }

  if (/fetch failed|network|ECONN|ETIMEDOUT|ENOTFOUND/i.test(message)) {
    return '连接 Cloudflare 失败，请检查网络后重试。'
  }

  return '线上 D1 积分赠送失败。请在终端查看 Wrangler 详细错误。'
}

function readErrorText(error: unknown): string {
  if (typeof error !== 'object' || error === null) {
    return String(error)
  }

  const record = error as Record<string, unknown>
  return [
    record.message,
    record.stderr,
    record.stdout,
  ].filter((value): value is string => typeof value === 'string').join('\n')
}
