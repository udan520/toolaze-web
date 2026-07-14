export type ImageDownloadResult = 'proxy' | 'direct' | 'anchor'

type DownloadImageInCurrentPageOptions = {
  imageUrl: string
  filename: string
  fetcher?: (input: string, init?: RequestInit) => Promise<Response>
  triggerBlobDownload: (blob: Blob, filename: string) => void
  triggerUrlDownload: (url: string, filename: string) => void
}

export async function downloadImageInCurrentPage({
  imageUrl,
  filename,
  fetcher = fetch,
  triggerBlobDownload,
  triggerUrlDownload,
}: DownloadImageInCurrentPageOptions): Promise<ImageDownloadResult> {
  const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`

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

  triggerUrlDownload(imageUrl, filename)
  return 'anchor'
}
