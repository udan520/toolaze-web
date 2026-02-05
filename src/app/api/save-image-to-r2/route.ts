import { NextRequest, NextResponse } from 'next/server'

/**
 * 开发环境用：根据图片 URL 拉取图片并转发到上传接口（Pages Function），返回 R2 公网 URL。
 * 生产环境可直接调用 Pages Function /api/save-image-to-r2。
 */
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

    // 拉取第三方图片
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

    // 转发到上传接口（Pages Function 或同域上传）
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
