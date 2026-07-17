import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  type CreditGrantInput,
  grantProductionCredits,
} from '@/lib/admin/credit-grants'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{
    userId: string
  }>
}

export async function POST(request: Request, context: RouteContext) {
  const requestHeaders = await headers()
  if (!isAdminRequestAllowed({
    host: requestHeaders.get('x-forwarded-host') || requestHeaders.get('host'),
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { userId } = await context.params
  if (!/^user_[a-f0-9]{32}$/.test(userId)) {
    return NextResponse.json({ error: '用户 ID 无效。' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求体必须是 JSON。' }, { status: 400 })
  }

  try {
    const input = buildCreditGrantInput(body)
    const result = await grantProductionCredits(userId, input)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : '赠送积分失败。'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

function buildCreditGrantInput(body: unknown): CreditGrantInput {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new Error('请求体格式无效。')
  }

  const record = body as Record<string, unknown>
  return {
    requestId: typeof record.requestId === 'string'
      ? record.requestId
      : `admin_grant_${crypto.randomUUID().replace(/-/g, '')}`,
    amount: Number(record.amount),
    expirationMode: record.expirationMode as CreditGrantInput['expirationMode'],
    validDays: record.validDays === undefined || record.validDays === null
      ? undefined
      : Number(record.validDays),
    expiresAt: typeof record.expiresAt === 'string' ? record.expiresAt : undefined,
    note: typeof record.note === 'string' ? record.note : '',
  }
}
