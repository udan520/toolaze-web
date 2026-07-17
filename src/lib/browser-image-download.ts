export type ImageDownloadResult = 'proxy' | 'direct' | 'anchor'

type DownloadImageInCurrentPageOptions = {
  imageUrl: string
  filename: string
  fetcher?: (input: string, init?: RequestInit) => Promise<Response>
  triggerBlobDownload: (blob: Blob, filename: string) => void
  triggerUrlDownload: (url: string, filename: string) => void
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
      triggerBlobDownload(await proxyRes.blob(), filename)
      return 'proxy'
    }

    const directRes = await fetcher(imageUrl, { mode: 'cors', credentials: 'omit' }).catch(() => null)
    if (directRes?.ok) {
      triggerBlobDownload(await directRes.blob(), filename)
      return 'direct'
    }
  } catch {
    // Fall through to same-page anchor fallback.
  }

  triggerUrlDownload(canUseRawAnchorFallback(imageUrl) ? imageUrl : proxyUrl, filename)
  return 'anchor'
}
