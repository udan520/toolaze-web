import { NextRequest, NextResponse } from 'next/server'

/**
 * 代理下载 R2 上的图片，返回 Content-Disposition: attachment 触发浏览器直接下载。
 * 仅允许白名单域名（R2 公网域名），防止被滥用为任意 URL 代理。
 */
const ALLOWED_BASE_URL =
  typeof process.env.R2_PUBLIC_BASE_URL === 'string'
    ? process.env.R2_PUBLIC_BASE_URL.trim().replace(/\/$/, '')
    : ''

function isAllowedUrl(url: string): boolean {
  if (!ALLOWED_BASE_URL) {
    // 如果没有配置白名单，检查是否是常见的R2 URL格式
    // R2 URL格式: https://pub-xxx.r2.dev/... 或 https://xxx.r2.dev/...
    return /^https:\/\/[^/]+\.r2\.dev\//.test(url)
  }
  return url === ALLOWED_BASE_URL || url.startsWith(ALLOWED_BASE_URL + '/')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const filename = searchParams.get('filename') || 'image.png'

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Missing or invalid url' }, { status: 400 })
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  try {
    const resp = await fetch(url, { redirect: 'follow' })
    if (!resp.ok) {
      return NextResponse.json(
        { error: `Upstream failed: ${resp.status}` },
        { status: 502 }
      )
    }

    const contentType = resp.headers.get('content-type') || 'application/octet-stream'
    const blob = await resp.blob()

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '\\"')}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: unknown) {
    console.error('download-image proxy error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
