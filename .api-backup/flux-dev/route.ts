/**
 * 本地开发：代理到真实 Flux API（next dev 下可用）
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

function mapOutputFormat(format: unknown): string {
  if (!format) return 'jpeg'
  const f = String(format).toLowerCase()
  if (f === 'jpg' || f === 'jpeg') return 'jpeg'
  if (f === 'png') return 'png'
  return 'jpeg'
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
    const body = await request.json().catch(() => ({})) as Record<string, unknown>
    const prompt = String(body?.prompt ?? '').trim()
    const imageUrl = String(body?.imageUrl ?? body?.image_url ?? '').trim()
    const width = body?.width ?? 1024
    const height = body?.height ?? 768
    const steps = body?.steps ?? 28
    const promptUpsampling = body?.prompt_upsampling ?? false
    const seed = body?.seed ?? 42
    const guidance = body?.guidance ?? 3
    const safetyTolerance = body?.safety_tolerance ?? 2
    const outputFormat = mapOutputFormat(body?.output_format)

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    const baseUrl = getBaseUrl()
    const url = `${baseUrl.replace(/\/$/, '')}/bfl/v1/flux-dev`

    const payload: Record<string, unknown> = {
      prompt,
      width: Number(width) || 1024,
      height: Number(height) || 768,
      steps: Number(steps) || 28,
      prompt_upsampling: Boolean(promptUpsampling),
      seed: Number(seed) ?? 42,
      guidance: Number(guidance) || 3,
      safety_tolerance: Number(safetyTolerance) ?? 2,
      output_format: outputFormat,
    }
    if (imageUrl && imageUrl.startsWith('http')) {
      payload.input_image = imageUrl
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const result = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok) {
      const detail = result?.detail
      const msg =
        (result?.message ?? result?.error ?? result?.msg) as string | undefined ||
        (typeof detail === 'string' ? detail : null) ||
        (Array.isArray(detail) ? (detail as Array<{ msg?: string }>).map((d) => d?.msg).filter(Boolean).join('; ') : null) ||
        `Upstream API error: ${response.status}`
      const hint =
        response.status === 401
          ? 'Check ZHEN_AI_API_KEY'
          : response.status === 404
            ? 'Check ZHEN_AI_FLUX_BASE_URL'
            : undefined
      return NextResponse.json(
        { error: String(msg), hint },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 }
      )
    }

    const id = result?.id
    const pollingUrl = result?.polling_url
    if (!id && !pollingUrl) {
      return NextResponse.json(
        {
          error: 'Unexpected response: missing id or polling_url',
          hint: 'Check ZHEN_AI_FLUX_BASE_URL (e.g. gpt-best Base URL)',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: id ?? null,
      polling_url: pollingUrl ?? (baseUrl ? `${baseUrl.replace(/\/$/, '')}/bfl/v1/get_result?id=${id}` : null),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal server error'
    return NextResponse.json(
      { error: msg, hint: 'Check ZHEN_AI_API_KEY and ZHEN_AI_FLUX_BASE_URL in .env.local' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
