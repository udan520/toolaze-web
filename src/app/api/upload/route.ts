import { NextRequest, NextResponse } from 'next/server'

/**
 * 本地开发用：代理到 Cloudflare Pages Function
 * 注意：静态导出构建时会报错，但开发模式可以运行
 * 生产环境使用 Cloudflare Pages Functions (functions/api/upload.js)
 */

// 静态导出模式配置
export const dynamic = 'force-static'
export async function POST(request: NextRequest) {
  try {
    // 获取上传 URL（优先使用环境变量，否则使用默认的 Pages Function URL）
    const uploadUrl =
      typeof process.env.IMAGE_UPLOAD_URL === 'string'
        ? process.env.IMAGE_UPLOAD_URL.trim()
        : typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
          ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
          : 'https://toolaze-web.pages.dev/api/upload'

    // 获取原始请求的 FormData
    const formData = await request.formData()

    // 转发到 Cloudflare Pages Function
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: (err as { error?: string }).error ?? `Upload failed: ${uploadRes.status}` },
        { status: uploadRes.status }
      )
    }

    const data = await uploadRes.json()
    const url = (data as { url?: string }).url
    if (!url) {
      return NextResponse.json({ error: 'Upload did not return url' }, { status: 502 })
    }

    return NextResponse.json({ url, key: (data as { key?: string }).key })
  } catch (error: unknown) {
    console.error('upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
