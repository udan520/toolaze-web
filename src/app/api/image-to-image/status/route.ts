import { NextRequest, NextResponse } from 'next/server'

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs'

// 本地开发用：与 functions/api/image-to-image/status.js 逻辑一致
// 注意：静态导出构建时会报错，但开发模式可以运行
// 生产环境使用 Cloudflare Pages Functions (functions/api/image-to-image/status.js)

function getApiKey(): string | undefined {
  return process.env.KIE_AI_API_KEY ?? process.env.DASHSCOPE_API_KEY
}

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json()
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const apiKey = getApiKey()
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const response = await fetch(
      `${KIE_AI_BASE}/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text()
      console.error('Kie AI recordInfo error:', response.status, msg)
      return NextResponse.json({ error: msg || 'Failed to get task status' }, { status: response.status })
    }

    const data = result?.data ?? result
    const state = data?.state
    let imageUrl: string | undefined

    if (data?.resultJson) {
      try {
        const parsed = typeof data.resultJson === 'string' ? JSON.parse(data.resultJson) : data.resultJson
        const urls = parsed?.resultUrls
        if (Array.isArray(urls) && urls.length > 0) {
          imageUrl = urls[0]
        }
      } catch {
        // ignore parse error
      }
    }

    return NextResponse.json({
      status: state === 'success' ? 'SUCCEEDED' : state === 'fail' ? 'FAILED' : 'PENDING',
      imageUrl,
      message: data?.failMsg ?? data?.message,
    })
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status: 500 })
  }
}
