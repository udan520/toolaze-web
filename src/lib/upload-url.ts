/**
 * 与 Nano Banana 等工具共用：获取图片上传地址
 * 本地预览优先走同源代理，避免浏览器跨域上传失败。
 * 非本地环境优先使用 NEXT_PUBLIC_IMAGE_UPLOAD_URL，否则回退到 /api/upload。
 */
export function getImageUploadUrl(): string {
  if (isLocalBrowserHost()) {
    return '/api/upload'
  }

  const url = typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
    ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
    : ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url
  }

  return '/api/upload'
}

function isLocalBrowserHost(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname)
}
