/**
 * 与 Nano Banana 等工具共用：获取图片上传地址
 * 本地预览没有 R2 secret 时，走 Pages 上传端点，避免本机 /api/upload 500。
 * 非本地环境优先使用 NEXT_PUBLIC_IMAGE_UPLOAD_URL，否则回退到 /api/upload。
 */
const DEFAULT_LOCAL_UPLOAD_URL = 'https://toolaze-web.pages.dev/api/upload'

export function getImageUploadUrl(): string {
  const url = typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
    ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
    : ''

  return resolveImageUploadUrl({
    publicUploadUrl: url,
    hostname: getBrowserHostname(),
  })
}

export function resolveImageUploadUrl({
  publicUploadUrl,
  hostname,
}: {
  publicUploadUrl?: string
  hostname?: string
}): string {
  const url = typeof publicUploadUrl === 'string' ? publicUploadUrl.trim() : ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url
  }

  if (isLocalBrowserHost(hostname)) {
    return DEFAULT_LOCAL_UPLOAD_URL
  }

  return '/api/upload'
}

function getBrowserHostname(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.hostname
}

function isLocalBrowserHost(hostname = getBrowserHostname()): boolean {
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)
}
