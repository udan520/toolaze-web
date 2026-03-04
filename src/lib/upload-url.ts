/**
 * 与 Nano Banana 等工具共用：获取图片上传地址
 * 优先使用 NEXT_PUBLIC_IMAGE_UPLOAD_URL，否则回退到 /api/upload
 */
export function getImageUploadUrl(): string {
  const url = typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
    ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
    : ''
  return url || '/api/upload'
}
