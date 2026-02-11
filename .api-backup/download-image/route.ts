import { NextRequest, NextResponse } from 'next/server'

// 本地开发用：与 functions/api/download-image.js 逻辑一致
// 注意：静态导出构建时会报错，但开发模式可以运行
// 生产环境使用 Cloudflare Pages Functions (functions/api/download-image.js)

// 静态导出模式配置
export const dynamic = 'force-static'

const ALLOWED_BASE_URL =
  typeof process.env.R2_PUBLIC_BASE_URL === 'string'
    ? process.env.R2_PUBLIC_BASE_URL.trim().replace(/\/$/, '')
    : ''

function isAllowedUrl(url: string): boolean {
  if (!ALLOWED_BASE_URL) {
    return /^https:\/\/[^/]+\.r2\.dev\//.test(url)
  }
  return url === ALLOWED_BASE_URL || url.startsWith(ALLOWED_BASE_URL + '/')
}

export async function GET(request: NextRequest) {
  // 使用 request.nextUrl.searchParams 代替 new URL(request.url)
  // 避免在静态导出模式下使用 request.url（会导致构建失败）
  const url = request.nextUrl.searchParams.get('url')
  const filename = request.nextUrl.searchParams.get('filename') || 'image.png'

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
