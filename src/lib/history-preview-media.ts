import { getDisplayImagePreviewUrl } from './history-reprompt'

type HistoryPreviewMediaOptions = {
  outputUrl: string
  selectedReferenceUrl?: string | null
}

function getOriginalImageUrl(url: string): string {
  const imageUrl = url.trim()
  if (!imageUrl.startsWith('/_next/image?')) return imageUrl

  try {
    const parsed = new URL(imageUrl, 'http://localhost')
    return parsed.searchParams.get('url') || imageUrl
  } catch {
    return imageUrl
  }
}

export function getHistoryPreviewMediaUrl({
  outputUrl,
}: HistoryPreviewMediaOptions): string {
  return getOriginalImageUrl(outputUrl)
}

export function getHistoryFullScreenPreviewUrl(url: string): string {
  return getOriginalImageUrl(url)
}

export function getHistoryLibraryThumbnailUrl(url: string): string {
  return getDisplayImagePreviewUrl(url, 256, 60)
}

export function getHistoryReferenceThumbnailUrl(url: string): string {
  return getDisplayImagePreviewUrl(url, 128, 60)
}
