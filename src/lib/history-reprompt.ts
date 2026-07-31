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

type HistoryImageRecreateMode = 'text-to-image' | 'image-to-image'

type HistoryRecreateSource = {
  mediaType?: 'image' | 'video' | null
  model?: string | null
}

const NEXT_IMAGE_WIDTHS = [64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200] as const
const REFERENCE_PREVIEW_WIDTH = 384
const GENERIC_IMAGE_EDIT_TOOL_SLUGS = new Set(['ai-image-generator', 'ai-image-to-image-generator'])

export function buildHistoryRecreateHref(item: HistoryRecreateSource, locale = 'en'): string {
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''
  if (item.mediaType === 'video') return `${localePrefix}/ai-video-generator`

  const model = String(item.model || 'nano-banana-pro').trim() || 'nano-banana-pro'
  return `${localePrefix}/ai-image-generator?model=${encodeURIComponent(model)}`
}

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

function getPathRootSlug(pathname: string): string {
  const sourceSegments = String(pathname || '').split('/').filter(Boolean)
  const localePattern = /^[a-z]{2}(?:-[A-Z]{2})?$/
  return sourceSegments[0] && localePattern.test(sourceSegments[0])
    ? sourceSegments[1] || ''
    : sourceSegments[0] || ''
}

export function shouldUseGenericImageGeneratorForHistoryRecreate(
  currentPathname: string,
  item: HistoryRepromptSource,
): boolean {
  const currentRootSlug = getPathRootSlug(currentPathname)
  if (!currentRootSlug || GENERIC_IMAGE_EDIT_TOOL_SLUGS.has(currentRootSlug)) return false

  const historyRootSlug = getHistoryToolSlug(item).split('/')[0] || ''
  return Boolean(historyRootSlug && historyRootSlug !== currentRootSlug)
}

export function getWrappedHistoryDefaultInputImageUrls(item: HistoryRepromptSource): string[] {
  const toolSlug = getHistoryToolSlug(item)
  if (toolSlug === 'ai-hairstyle-changer') return ['/ai-hairstyle-changer/default-reference.png']
  if (toolSlug === 'ai-hair-color-changer') return ['/ai-hair-color-changer/default-reference.png']
  return []
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

export function splitDualUploadReferenceImageUrls(imageUrls: string[], useSecondaryReferenceSlot: boolean) {
  const reusableUrls = Array.isArray(imageUrls)
    ? imageUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
    : []

  if (!useSecondaryReferenceSlot) {
    return {
      personImageUrls: reusableUrls,
      secondaryReferenceImageUrls: [],
    }
  }

  return {
    personImageUrls: reusableUrls.slice(0, 1),
    secondaryReferenceImageUrls: reusableUrls.slice(1, 2),
  }
}

export function buildHistoryRepromptPayload(item: HistoryRepromptSource) {
  const imageUrls = getOriginalHistoryInputImageUrls(item)
  const mode: HistoryImageRecreateMode = imageUrls.length > 0 ? 'image-to-image' : 'text-to-image'

  return {
    prompt: item.prompt || '',
    imageUrls,
    modelId: item.model || undefined,
    aspectRatio: item.aspectRatio || undefined,
    resolution: item.resolution || undefined,
    outputFormat: item.outputFormat || undefined,
    mode,
  }
}

export function getDisplayImagePreviewUrl(url: string, width = 384, quality = 75): string {
  const imageUrl = normalizeImageUrl(url)
  if (!imageUrl || isBrowserOnlyPreviewUrl(imageUrl) || isNextImageUrl(imageUrl)) return imageUrl

  const canUseNextImage = imageUrl.startsWith('/') && !imageUrl.startsWith('//')
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
