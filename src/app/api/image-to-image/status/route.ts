import { NextRequest, NextResponse } from 'next/server'

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const taskId = body?.taskId

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const apiKey = process.env.KIE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'KIE_AI_API_KEY is not configured' }, { status: 500 })
    }

    const response = await fetch(
      `${KIE_AI_BASE}/recordInfo?taskId=${encodeURIComponent(String(taskId))}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    const result = await response.json().catch(() => ({}))
    const resultObj = result as { code?: number; message?: string; msg?: string; data?: Record<string, unknown> }
    if (!response.ok || (typeof resultObj.code === 'number' && resultObj.code !== 200)) {
      const message = resultObj.message || resultObj.msg || 'Failed to get task status'
      const status = response.ok ? 400 : response.status
      return NextResponse.json({ error: message }, { status })
    }

    const data = resultObj.data || {}
    const state = String(data.state || '')
    let imageUrl: string | undefined

    const resultJson = data.resultJson
    if (resultJson) {
      try {
        const parsed =
          typeof resultJson === 'string'
            ? JSON.parse(resultJson)
            : (resultJson as { resultUrls?: string[] })
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
      message: String(data.failMsg || data.message || ''),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

