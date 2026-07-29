const WRAPPED_GENERATOR_TOOL_SLUGS = new Set([
  'ai-baby-generator',
  'ai-couple-photo-maker',
  'ai-hairstyle-changer',
  'ai-hair-color-changer',
  'ai-clothes-changer',
  'photo-restoration',
  'watermark-remover',
  'ai-dance-generator',
  'ai-kissing-video-generator',
])

const WRAPPED_GENERATOR_TOOL_LABELS: Record<string, string> = {
  'ai-baby-generator': 'AI Baby Generator',
  'ai-couple-photo-maker': 'AI Couple Photo Maker',
  'ai-hairstyle-changer': 'AI Hair Style Changer',
  'ai-hair-color-changer': 'AI Hair Color Changer',
  'ai-clothes-changer': 'Clothes Changer',
  'photo-restoration': 'Photo Restoration',
  'watermark-remover': 'Watermark Remover',
  'ai-dance-generator': 'AI Dance Generator',
  'ai-kissing-video-generator': 'AI Kissing Video Generator',
}

const MODEL_LABELS: Record<string, string> = {
  'gpt-image-2': 'GPT Image 2',
  'gpt-image-1-5': 'GPT Image 1.5',
  'flux-2-pro': 'Flux 2 Pro',
  'flux-2-flex': 'Flux 2 Flex',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana-2': 'Nano Banana 2',
  'seedream-4-5': 'Seedream 4.5',
  'seedream-5-0-lite': 'Seedream 5.0 Lite',
  'seedream-5-0-pro': 'Seedream 5.0 Pro',
  'wan-2-7-image': 'Wan 2.7 Image',
  'grok-1-5-image': 'Grok 1.5 Image',
  'grok-video-1-5': 'Grok Video 1.5',
}

type HistoryDisplaySource = {
  model?: string | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
}

function getSourcePathRoot(sourcePath: string | null | undefined) {
  const parts = String(sourcePath || '').split('/').filter(Boolean)
  const first = parts[0] || ''
  const second = parts[1] || ''
  return ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'].includes(first)
    ? second
    : first
}

export function getGenerationModelLabel(model: string | null | undefined) {
  const normalized = String(model || '').trim()
  return MODEL_LABELS[normalized] || normalized
}

export function getWrappedGeneratorToolSlug(item: HistoryDisplaySource) {
  const sourceRoot = getSourcePathRoot(item.sourcePath)
  const storedToolSlug = String(item.toolSlug || '').trim()
  if (WRAPPED_GENERATOR_TOOL_SLUGS.has(sourceRoot)) return sourceRoot
  if (WRAPPED_GENERATOR_TOOL_SLUGS.has(storedToolSlug)) return storedToolSlug
  return ''
}

export function isWrappedHairToolHistory(item: HistoryDisplaySource) {
  return Boolean(getWrappedGeneratorToolSlug(item))
}

export function getWrappedHairToolHistoryDisplay(item: HistoryDisplaySource) {
  const sourceRoot = getSourcePathRoot(item.sourcePath)
  const storedToolSlug = String(item.toolSlug || '').trim()
  const toolSlug = getWrappedGeneratorToolSlug(item) || storedToolSlug || sourceRoot

  if (!isWrappedHairToolHistory(item)) {
    return {
      showToolLabel: false,
      toolLabel: '',
      modelLabel: getGenerationModelLabel(item.model),
    }
  }

  return {
    showToolLabel: true,
    toolLabel: WRAPPED_GENERATOR_TOOL_LABELS[toolSlug] || String(item.toolLabel || '').trim() || toolSlug,
    modelLabel: getGenerationModelLabel(item.model),
  }
}
