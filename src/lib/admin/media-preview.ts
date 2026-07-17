const ADMIN_MEDIA_PREVIEW_PATH = '/api/admin/media-preview'

const ALLOWED_MEDIA_HOSTS = new Set([
  'tempfile.aiquickdraw.com',
])

const INLINE_HEADER_NAMES = [
  'content-type',
  'content-length',
  'etag',
  'last-modified',
  'cache-control',
  'accept-ranges',
]

export function parseAllowedAdminMediaUrl(rawUrl: string | null): URL | null {
  if (!rawUrl) return null

  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }

  if (url.protocol !== 'https:') return null
  if (url.username || url.password) return null
  if (!ALLOWED_MEDIA_HOSTS.has(url.hostname.toLowerCase())) return null

  return url
}

export function isAllowedAdminMediaUrl(rawUrl: string): boolean {
  return parseAllowedAdminMediaUrl(rawUrl) !== null
}

export function buildAdminMediaPreviewUrl(rawUrl: string): string | null {
  const url = parseAllowedAdminMediaUrl(rawUrl)
  if (!url) return null

  return `${ADMIN_MEDIA_PREVIEW_PATH}?url=${encodeURIComponent(url.toString())}`
}

export function isInlineAdminMediaContentType(contentType: string | null): boolean {
  if (!contentType) return false

  const mediaType = contentType.split(';', 1)[0].trim().toLowerCase()
  return mediaType.startsWith('image/') || mediaType.startsWith('video/')
}

export function buildInlineAdminMediaHeaders(upstreamHeaders: Headers): Headers {
  const headers = new Headers()

  for (const name of INLINE_HEADER_NAMES) {
    const value = upstreamHeaders.get(name)
    if (value) headers.set(name, value)
  }

  headers.set('content-disposition', 'inline')
  headers.set('x-content-type-options', 'nosniff')

  return headers
}
