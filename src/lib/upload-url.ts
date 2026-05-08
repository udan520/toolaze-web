/**
 * 与 Nano Banana 等工具共用：获取图片上传地址
 * 优先使用 NEXT_PUBLIC_IMAGE_UPLOAD_URL，否则回退到 /api/upload
 */
export function getImageUploadUrl(): string {
  const url = typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
    ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
    : ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url
  }

  // Local dev fallback: Pages Function endpoint is verified and CORS-enabled.
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'https://toolaze-web.pages.dev/api/upload'
  }

  return '/api/upload'
}
