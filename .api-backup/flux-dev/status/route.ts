/**
 * 本地开发：代理到真实 Flux API 状态查询（next dev 下可用）
 * 构建前由 prebuild 移除；生产环境由 Cloudflare Pages Functions 提供。
 * 需在 .env.local 配置：ZHEN_AI_API_KEY，ZHEN_AI_FLUX_BASE_URL（可选）
 */
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_BASE = 'https://api.openai-hk.com'

function getBaseUrl(): string {
  const url = (process.env.ZHEN_AI_FLUX_BASE_URL || '').trim()
  return url || DEFAULT_BASE
}

function getApiKey(): string | undefined {
  return process.env.ZHEN_AI_API_KEY
}

export async function POST(request: NextRequest) {
  const apiKey = getApiKey()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured (ZHEN_AI_API_KEY)', hint: 'Add ZHEN_AI_API_KEY to .env.local' },
      { status: 500 }
    )
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    const pollingUrl = String(body?.polling_url ?? '').trim()
    const id = String(body?.id ?? '').trim()

    if (!pollingUrl && !id) {
      return NextResponse.json({ error: 'polling_url or id is required' }, { status: 400 })
    }

    const url =
      pollingUrl ||
      `${getBaseUrl().replace(/\/$/, '')}/bfl/v1/get_result?id=${encodeURIComponent(id)}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    const result = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok) {
      const msg =
        (result?.message ?? result?.error ?? result?.msg) as string | undefined || 'Failed to get task status'
      return NextResponse.json({ error: String(msg) }, { status: response.status })
    }

    const rawStatus = (result?.status ?? '') as string
    const statusMap: Record<string, string> = {
      Ready: 'SUCCEEDED',
      ready: 'SUCCEEDED',
      Failed: 'FAILED',
      failed: 'FAILED',
      Error: 'FAILED',
      error: 'FAILED',
    }
    const status = statusMap[rawStatus] ?? 'PENDING'

    let imageUrl: string | null = null
    const res = result?.result as Record<string, unknown> | undefined
    if (res && typeof res === 'object') {
      imageUrl = (res?.sample ?? res?.url ?? res?.image ?? null) as string | null
    }

    return NextResponse.json({
      status,
      imageUrl: imageUrl ?? undefined,
      result: res ?? undefined,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
