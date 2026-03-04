/**
 * 本地开发：代理到 nano-banana edits API（next dev 下可用）
 * 构建前由 prebuild 移除；生产环境由 Cloudflare Pages Functions 提供。
 * 需在 .env.local 配置：ZHEN_AI_API_KEY，ZHEN_AI_FLUX_BASE_URL（如 https://ai.t8star.cn）
 * 接口：https://ai.t8star.cn/v1/images/edits
 * 文档：https://gpt-best.apifox.cn/api-341817449
 */
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_BASE = 'https://ai.t8star.cn'

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
    const contentType = request.headers.get('Content-Type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
    }

    const formData = await request.formData()
    const model = formData.get('model') || 'nano-banana'
    const prompt = (formData.get('prompt') || '').trim()
    const image = formData.get('image') || formData.get('file')

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }
    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: 'image file is required (field: image or file)' }, { status: 400 })
    }

    const baseUrl = getBaseUrl()
    const url = `${baseUrl.replace(/\/$/, '')}/v1/images/edits`

    const upstreamForm = new FormData()
    upstreamForm.append('model', model as string)
    upstreamForm.append('prompt', prompt)
    upstreamForm.append('image', image, (image as File).name || 'image.png')
    const responseFormat = formData.get('response_format') || 'url'
    upstreamForm.append('response_format', responseFormat as string)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: upstreamForm,
    })

    const result = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok) {
      const err = result?.error as Record<string, unknown> | undefined
      const msg = (err?.message ?? result?.message ?? result?.error ?? `Upstream error: ${response.status}`) as string
      const hint = response.status === 401 ? 'Check ZHEN_AI_API_KEY' : undefined
      return NextResponse.json({ error: String(msg), hint }, { status: response.status })
    }

    const data = result?.data as Array<{ url?: string; b64_json?: string }> | undefined
    const item = data?.[0]
    let imageUrl = item?.url
    const b64 = item?.b64_json
    if (!imageUrl) {
      const content = (result?.metadata as Record<string, unknown>)?.output as Record<string, unknown>
      const choices = content?.choices as Array<{ message?: { content?: Array<{ image?: string; url?: string }> } }> | undefined
      const firstContent = choices?.[0]?.message?.content?.[0]
      imageUrl = firstContent?.image || firstContent?.url
    }
    if (imageUrl) {
      return NextResponse.json({ url: imageUrl })
    }
    if (b64) {
      return NextResponse.json({ url: `data:image/png;base64,${b64}` })
    }
    return NextResponse.json({ error: 'Unexpected response format', raw: result }, { status: 500 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal server error'
    const isNetwork = /fetch failed|Failed to fetch|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|network/i.test(msg)
    const hint = isNetwork
      ? 'Network error. Check if ai.t8star.cn is reachable (VPN/firewall).'
      : 'Check ZHEN_AI_API_KEY and ZHEN_AI_FLUX_BASE_URL in .env.local (or Cloudflare env for production).'
    return NextResponse.json({ error: msg, hint }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
