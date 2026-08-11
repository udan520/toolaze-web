type HistoryRepromptSource = {
  prompt?: string | null
  model?: string | null
  mediaType?: 'image' | 'video' | null
  outputUrl?: string | null
  inputPreview?: string | null
  inputUrls?: string[] | null
  toolSlug?: string | null
  sourcePath?: string | null
  aspectRatio?: string | null
  resolution?: string | null
  outputFormat?: string | null
  nativeAudio?: boolean | null
  webSearch?: boolean | null
}

type HistoryRecreateMode = 'text-to-image' | 'image-to-image' | 'text-to-video' | 'image-to-video'

type HistoryRecreateSource = {
  mediaType?: 'image' | 'video' | null
  model?: string | null
  toolSlug?: string | null
  sourcePath?: string | null
}

const GENERIC_IMAGE_EDIT_TOOL_SLUGS = new Set(['ai-image-generator', 'ai-image-to-image-generator'])
const LOCALE_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/

function getLocalePrefix(locale = 'en'): string {
  return locale && locale !== 'en' ? `/${locale}` : ''
}

export function buildHistoryRecreateHref(item: HistoryRecreateSource, locale = 'en'): string {
  const localePrefix = getLocalePrefix(locale)
  const sourceHref = getLocalizedSourceHref(item, localePrefix)
  if (sourceHref) return sourceHref

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

function getHistoryToolSlug(item: HistoryRepromptSource): string {
  const toolSlug = String(item.toolSlug || '').trim()
  if (toolSlug) return toolSlug

  const sourceSegments = String(item.sourcePath || '').split('/').filter(Boolean)
  return sourceSegments[0] && LOCALE_PATTERN.test(sourceSegments[0])
    ? sourceSegments[1] || ''
    : sourceSegments[0] || ''
}

function isReusableVideoUrl(url: string): boolean {
  return /\.(m4v|mkv|mov|mp4|webm)(?:[?#].*)?$/i.test(url)
}

function isReusableAudioUrl(url: string): boolean {
  return /\.(aac|m4a|mp3|ogg|wav)(?:[?#].*)?$/i.test(url)
}

function getStoredReferenceUrls(outputFormat: string | null | undefined, key: 'referenceVideoUrls' | 'referenceAudioUrls'): string[] {
  try {
    const values = JSON.parse(String(outputFormat || ''))?.[key]
    return Array.isArray(values) ? values.map(normalizeReusableReferenceImageUrl).filter(Boolean) : []
  } catch {
    return []
  }
}

function getStoredVideoMode(outputFormat: string | null | undefined): 'text-to-video' | 'image-to-video' | null {
  try {
    const parsed = JSON.parse(String(outputFormat || ''))
    return parsed?.mode === 'text-to-video' || parsed?.mode === 'image-to-video'
      ? parsed.mode
      : null
  } catch {
    return null
  }
}

function getStoredWebSearch(outputFormat: string | null | undefined): boolean {
  try {
    return JSON.parse(String(outputFormat || ''))?.webSearch === true
  } catch {
    return false
  }
}

function isKling3MotionControlHistory(item: HistoryRepromptSource, toolSlug: string): boolean {
  return item.model === 'kling-3-motion-control'
    || item.model === 'kling-2-6-motion-control'
    || toolSlug === 'kling-3-motion-control'
    || toolSlug === 'kling-2-6-motion-control'
}

function getPathRootSlug(pathname: string): string {
  const sourceSegments = String(pathname || '').split('/').filter(Boolean)
  return sourceSegments[0] && LOCALE_PATTERN.test(sourceSegments[0])
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

function getLocalizedSourceHref(item: HistoryRecreateSource, localePrefix: string): string {
  const rawSourcePath = String(item.sourcePath || '').trim()
  if (rawSourcePath.startsWith('/') && !rawSourcePath.startsWith('//')) {
    const hashIndex = rawSourcePath.indexOf('#')
    const sourceWithoutHash = hashIndex >= 0 ? rawSourcePath.slice(0, hashIndex) : rawSourcePath
    const queryIndex = sourceWithoutHash.indexOf('?')
    const pathOnly = queryIndex >= 0 ? sourceWithoutHash.slice(0, queryIndex) : sourceWithoutHash
    const query = queryIndex >= 0 ? sourceWithoutHash.slice(queryIndex) : ''
    const sourceSegments = pathOnly.split('/').filter(Boolean)
    const routeSegments = sourceSegments[0] && LOCALE_PATTERN.test(sourceSegments[0])
      ? sourceSegments.slice(1)
      : sourceSegments
    if (routeSegments.length > 0 && routeSegments[0] !== 'history') {
      return `${localePrefix}/${routeSegments.join('/')}${query}`
    }
  }

  const toolSlug = getHistoryToolSlug(item)
  return toolSlug && toolSlug !== 'history' ? `${localePrefix}/${toolSlug}` : ''
}

export function getWrappedHistoryDefaultInputImageUrls(item: HistoryRepromptSource): string[] {
  const toolSlug = getHistoryToolSlug(item)
  if (toolSlug === 'ai-hairstyle-changer') return ['/ai-hairstyle-changer/default-reference.png']
  if (toolSlug === 'ai-hair-color-changer') return ['/ai-hair-color-changer/default-reference.png']
  return []
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
  const toolSlug = getHistoryToolSlug(item)
  const originalInputUrls = Array.isArray(item.inputUrls) && item.inputUrls.length > 0
    ? item.inputUrls.map(normalizeReusableReferenceImageUrl).filter(Boolean)
    : getOriginalHistoryInputImageUrls(item)
  const isTalkingAvatar = toolSlug === 'talking-avatar-creator'
  const isKling3MotionControl = isKling3MotionControlHistory(item, toolSlug)
  const isVideoGeneration = item.mediaType === 'video'
  const storedMotionVideoUrls = isVideoGeneration ? getStoredReferenceUrls(item.outputFormat, 'referenceVideoUrls') : []
  const storedAudioUrls = isVideoGeneration ? getStoredReferenceUrls(item.outputFormat, 'referenceAudioUrls') : []
  const motionVideoUrls = storedMotionVideoUrls.length > 0
    ? storedMotionVideoUrls
    : isVideoGeneration ? originalInputUrls.filter(isReusableVideoUrl) : []
  const audioUrls = storedAudioUrls.length > 0
    ? storedAudioUrls
    : isVideoGeneration ? originalInputUrls.filter(isReusableAudioUrl) : []
  const motionVideoUrlSet = new Set(motionVideoUrls)
  const audioUrlSet = new Set(audioUrls)
  const nonVideoInputUrls = isVideoGeneration
    ? originalInputUrls.filter((url) => !motionVideoUrlSet.has(url) && !audioUrlSet.has(url) && !isReusableVideoUrl(url) && !isReusableAudioUrl(url))
    : originalInputUrls
  const imageUrls = isTalkingAvatar && nonVideoInputUrls[0] ? [nonVideoInputUrls[0]] : nonVideoInputUrls
  const talkingAvatarAudioUrl = isTalkingAvatar && originalInputUrls[1] ? originalInputUrls[1] : ''
  const storedVideoMode = isVideoGeneration ? getStoredVideoMode(item.outputFormat) : null
  const mode: HistoryRecreateMode = isKling3MotionControl
    ? 'image-to-video'
    : isTalkingAvatar
      ? 'image-to-image'
    : isVideoGeneration
      ? storedVideoMode || (imageUrls.length > 0 || motionVideoUrls.length > 0 || audioUrls.length > 0 ? 'image-to-video' : 'text-to-video')
      : imageUrls.length > 0 ? 'image-to-image' : 'text-to-image'

  return {
    prompt: item.prompt || '',
    imageUrls,
    ...(motionVideoUrls.length > 0 ? { videoUrls: motionVideoUrls } : {}),
    ...(audioUrls.length > 0 ? { audioUrls } : {}),
    ...(isTalkingAvatar && originalInputUrls.length > 0 ? { inputUrls: originalInputUrls } : {}),
    ...(talkingAvatarAudioUrl ? { audioUrl: talkingAvatarAudioUrl, audioUrls: [talkingAvatarAudioUrl] } : {}),
    modelId: item.model || undefined,
    aspectRatio: item.aspectRatio || undefined,
    resolution: item.resolution || undefined,
    outputFormat: item.outputFormat || undefined,
    ...(isVideoGeneration && item.nativeAudio === true ? { nativeAudio: true } : {}),
    ...(isVideoGeneration && (item.webSearch === true || getStoredWebSearch(item.outputFormat)) ? { webSearch: true } : {}),
    mode,
    ...(toolSlug ? { toolSlug } : {}),
    ...(item.sourcePath ? { sourcePath: item.sourcePath } : {}),
    ...(item.mediaType ? { mediaType: item.mediaType } : {}),
  }
}

export function getDisplayImagePreviewUrl(url: string, _width = 384, _quality = 75): string {
  return normalizeImageUrl(url)
}

export function getReferencePreviewUrl(url: string): string {
  const hairColorReferencePath = '/ai-hair-color-changer/default-reference.png'
  const hairColorReferencePreviewPath = '/ai-hair-color-changer/default-reference-preview.webp'
  const imageUrl = normalizeImageUrl(url)

  if (imageUrl === hairColorReferencePath || imageUrl.endsWith(hairColorReferencePath)) {
    return getDisplayImagePreviewUrl(hairColorReferencePreviewPath)
  }

  return getDisplayImagePreviewUrl(imageUrl)
}
