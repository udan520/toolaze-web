import { NextRequest, NextResponse } from 'next/server'

// 本地开发用：代理到 Cloudflare Pages Function
// 注意：静态导出构建时会报错，但开发模式可以运行
// 生产环境使用 Cloudflare Pages Functions (functions/api/save-image-to-r2.js)

// 静态导出模式配置
export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const imageUrl = (body.imageUrl ?? body.url ?? '').trim()
    if (!imageUrl || !imageUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Missing or invalid imageUrl' }, { status: 400 })
    }

    const uploadUrl =
      typeof process.env.IMAGE_UPLOAD_URL === 'string'
        ? process.env.IMAGE_UPLOAD_URL.trim()
        : typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
          ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
          : ''

    if (!uploadUrl) {
      return NextResponse.json(
        { error: 'IMAGE_UPLOAD_URL or NEXT_PUBLIC_IMAGE_UPLOAD_URL not set' },
        { status: 500 }
      )
    }

    const resp = await fetch(imageUrl, { redirect: 'follow' })
    if (!resp.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${resp.status}` },
        { status: 502 }
      )
    }

    const blob = await resp.blob()
    const formData = new FormData()
    formData.append('image', blob)

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

    return NextResponse.json({ url })
  } catch (error: unknown) {
    console.error('save-image-to-r2 error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
