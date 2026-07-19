type HistoryRepromptSource = {
  prompt?: string | null
  model?: string | null
  outputUrl?: string | null
  inputPreview?: string | null
  inputUrls?: string[] | null
  toolSlug?: string | null
  sourcePath?: string | null
  aspectRatio?: string | null
  resolution?: string | null
  outputFormat?: string | null
}

const NEXT_IMAGE_WIDTHS = [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200] as const
const REFERENCE_PREVIEW_WIDTH = 384

function normalizeImageUrl(url: unknown): string {
  return typeof url === 'string' ? url.trim() : ''
}

export function normalizeReusableReferenceImageUrl(url: unknown): string {
  const imageUrl = normalizeImageUrl(url)
  if (!imageUrl) return ''
  if (imageUrl.startsWith('/')) return imageUrl.startsWith('//') || imageUrl.length === 1 ? '' : imageUrl

  try {
    const parsed = new URL(imageUrl)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? imageUrl : ''
  } catch {
    return ''
  }
}

function isBrowserOnlyPreviewUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:')
}

function isNextImageUrl(url: string): boolean {
  return url.startsWith('/_next/image?')
}

function getHistoryToolSlug(item: HistoryRepromptSource): string {
  const toolSlug = String(item.toolSlug || '').trim()
  if (toolSlug) return toolSlug

  const sourceSegments = String(item.sourcePath || '').split('/').filter(Boolean)
  const localePattern = /^[a-z]{2}(?:-[A-Z]{2})?$/
  return sourceSegments[0] && localePattern.test(sourceSegments[0])
    ? sourceSegments[1] || ''
    : sourceSegments[0] || ''
}

export function getWrappedHistoryDefaultInputImageUrls(item: HistoryRepromptSource): string[] {
  const toolSlug = getHistoryToolSlug(item)
  if (toolSlug === 'ai-hairstyle-changer') return ['/ai-hairstyle-changer/default-reference.png']
  if (toolSlug === 'ai-hair-color-changer') return ['/ai-hair-color-changer/default-reference.png']
  return []
}

function isOptimizableRemoteImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && (
      parsed.hostname.endsWith('.r2.dev') ||
      parsed.hostname.endsWith('.r2.cloudflarestorage.com')
    )
  } catch {
    return false
  }
}

function normalizePreviewWidth(width: number): number {
  const safeWidth = Number.isFinite(width) ? Math.max(64, Math.round(width)) : 384
  return NEXT_IMAGE_WIDTHS.reduce((best, current) => (
    Math.abs(current - safeWidth) < Math.abs(best - safeWidth) ? current : best
  ), NEXT_IMAGE_WIDTHS[0])
}

export function getHistoryReferenceImageUrls(item: HistoryRepromptSource): string[] {
  const inputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
    : []

  if (inputUrls.length > 0) return inputUrls

  const wrappedDefaultInputUrls = getWrappedHistoryDefaultInputImageUrls(item)
  if (wrappedDefaultInputUrls.length > 0) return wrappedDefaultInputUrls

  const outputUrl = normalizeReusableReferenceImageUrl(item.outputUrl)
  return outputUrl ? [outputUrl] : []
}

export function getOriginalHistoryInputImageUrls(item: HistoryRepromptSource): string[] {
  const inputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
    : []

  if (inputUrls.length > 0) return inputUrls

  const inputPreview = normalizeReusableReferenceImageUrl(item.inputPreview)
  if (inputPreview) return [inputPreview]

  return getWrappedHistoryDefaultInputImageUrls(item)
}

export function buildHistoryRepromptPayload(item: HistoryRepromptSource) {
  return {
    prompt: item.prompt || '',
    imageUrls: getHistoryReferenceImageUrls(item),
    modelId: item.model || undefined,
    aspectRatio: item.aspectRatio || undefined,
    resolution: item.resolution || undefined,
    outputFormat: item.outputFormat || undefined,
  }
}

export function getDisplayImagePreviewUrl(url: string, width = 384, quality = 75): string {
  const imageUrl = normalizeImageUrl(url)
  if (!imageUrl || isBrowserOnlyPreviewUrl(imageUrl) || isNextImageUrl(imageUrl)) return imageUrl

  const canUseNextImage = imageUrl.startsWith('/') || isOptimizableRemoteImageUrl(imageUrl)
  if (!canUseNextImage) return imageUrl

  const previewWidth = normalizePreviewWidth(width)
  const previewQuality = Math.min(100, Math.max(1, Math.round(Number.isFinite(quality) ? quality : 75)))

  return `/_next/image?url=${encodeURIComponent(imageUrl)}&w=${previewWidth}&q=${previewQuality}`
}

export function getReferencePreviewUrl(url: string): string {
  const hairColorReferencePath = '/ai-hair-color-changer/default-reference.png'
  const hairColorReferencePreviewPath = '/ai-hair-color-changer/default-reference-preview.webp'
  const imageUrl = normalizeImageUrl(url)

  if (imageUrl === hairColorReferencePath || imageUrl.endsWith(hairColorReferencePath)) {
    return getDisplayImagePreviewUrl(hairColorReferencePreviewPath, REFERENCE_PREVIEW_WIDTH)
  }

  return getDisplayImagePreviewUrl(imageUrl, REFERENCE_PREVIEW_WIDTH)
}
