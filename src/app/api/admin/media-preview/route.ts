import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  buildInlineAdminMediaHeaders,
  isInlineAdminMediaContentType,
  parseAllowedAdminMediaUrl,
} from '@/lib/admin/media-preview'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const requestHeaders = await headers()
  if (!isAdminRequestAllowed({
    host: requestHeaders.get('x-forwarded-host') || requestHeaders.get('host'),
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const mediaUrl = parseAllowedAdminMediaUrl(new URL(request.url).searchParams.get('url'))
  if (!mediaUrl) {
    return NextResponse.json({ error: '预览 URL 无效。' }, { status: 400 })
  }

  let upstreamResponse: Response
  try {
    upstreamResponse = await fetch(mediaUrl, {
      headers: {
        accept: 'image/*, video/*',
      },
      redirect: 'manual',
    })
  } catch {
    return NextResponse.json({ error: '媒体读取失败。' }, { status: 502 })
  }

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return NextResponse.json({ error: '媒体读取失败。' }, { status: 502 })
  }

  if (!isInlineAdminMediaContentType(upstreamResponse.headers.get('content-type'))) {
    return NextResponse.json({ error: '仅支持图片或视频预览。' }, { status: 415 })
  }

  return new Response(upstreamResponse.body, {
    status: 200,
    headers: buildInlineAdminMediaHeaders(upstreamResponse.headers),
  })
}
