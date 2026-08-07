export type ImageDownloadResult = 'proxy' | 'direct' | 'anchor'

type DownloadImageInCurrentPageOptions = {
  imageUrl: string
  filename: string
  fetcher?: (input: string, init?: RequestInit) => Promise<Response>
  triggerBlobDownload: (blob: Blob, filename: string) => void
  triggerUrlDownload: (url: string, filename: string) => void
}

type DetectedImageFormat = {
  extension: 'png' | 'jpg' | 'webp' | 'gif' | 'avif'
  mimeType: string
}

const IMAGE_FORMAT_BY_MIME: Record<string, DetectedImageFormat> = {
  'image/png': { extension: 'png', mimeType: 'image/png' },
  'image/jpeg': { extension: 'jpg', mimeType: 'image/jpeg' },
  'image/webp': { extension: 'webp', mimeType: 'image/webp' },
  'image/gif': { extension: 'gif', mimeType: 'image/gif' },
  'image/avif': { extension: 'avif', mimeType: 'image/avif' },
}

function startsWithBytes(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((value, index) => bytes[offset + index] === value)
}

function detectImageFormat(bytes: Uint8Array, mimeType: string): DetectedImageFormat | null {
  if (startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return IMAGE_FORMAT_BY_MIME['image/png']
  }
  if (startsWithBytes(bytes, [0xff, 0xd8, 0xff])) return IMAGE_FORMAT_BY_MIME['image/jpeg']
  if (startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWithBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) {
    return IMAGE_FORMAT_BY_MIME['image/webp']
  }
  if (startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) || startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])) {
    return IMAGE_FORMAT_BY_MIME['image/gif']
  }
  if (startsWithBytes(bytes, [0x66, 0x74, 0x79, 0x70], 4)) {
    const brand = String.fromCharCode(...bytes.slice(8, 12)).toLowerCase()
    if (brand === 'avif' || brand === 'avis') return IMAGE_FORMAT_BY_MIME['image/avif']
  }
  return IMAGE_FORMAT_BY_MIME[mimeType.split(';', 1)[0].trim().toLowerCase()] || null
}

function replaceFilenameExtension(filename: string, extension: DetectedImageFormat['extension']): string {
  const baseName = filename.replace(/\.[^./\\]+$/, '') || 'image'
  return `${baseName}.${extension}`
}

async function normalizeDownloadedImage(blob: Blob, filename: string): Promise<{ blob: Blob; filename: string }> {
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer())
  const format = detectImageFormat(bytes, blob.type)
  if (!format) return { blob, filename }

  return {
    blob: blob.type === format.mimeType ? blob : new Blob([blob], { type: format.mimeType }),
    filename: replaceFilenameExtension(filename, format.extension),
  }
}

function getProxyDownloadUrl(imageUrl: string, filename: string): string {
  return `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`
}

function canUseRawAnchorFallback(imageUrl: string): boolean {
  if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) return true
  if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) return true
  if (typeof window === 'undefined') return false

  try {
    return new URL(imageUrl, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

export async function downloadImageInCurrentPage({
  imageUrl,
  filename,
  fetcher = fetch,
  triggerBlobDownload,
  triggerUrlDownload,
}: DownloadImageInCurrentPageOptions): Promise<ImageDownloadResult> {
  const proxyUrl = getProxyDownloadUrl(imageUrl, filename)

  try {
    const proxyRes = await fetcher(proxyUrl).catch(() => null)
    if (proxyRes?.ok) {
      const download = await normalizeDownloadedImage(await proxyRes.blob(), filename)
      triggerBlobDownload(download.blob, download.filename)
      return 'proxy'
    }

    const directRes = await fetcher(imageUrl, { mode: 'cors', credentials: 'omit' }).catch(() => null)
    if (directRes?.ok) {
      const download = await normalizeDownloadedImage(await directRes.blob(), filename)
      triggerBlobDownload(download.blob, download.filename)
      return 'direct'
    }
  } catch {
    // Fall through to same-page anchor fallback.
  }

  triggerUrlDownload(canUseRawAnchorFallback(imageUrl) ? imageUrl : proxyUrl, filename)
  return 'anchor'
}
