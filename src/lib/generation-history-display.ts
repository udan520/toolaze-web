const WRAPPED_HAIR_TOOL_SLUGS = new Set([
  'ai-hairstyle-changer',
  'ai-hair-color-changer',
])

const WRAPPED_HAIR_TOOL_LABELS: Record<string, string> = {
  'ai-hairstyle-changer': 'AI Hair Style Changer',
  'ai-hair-color-changer': 'AI Hair Color Changer',
}

const MODEL_LABELS: Record<string, string> = {
  'gpt-image-2': 'GPT Image 2',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana-2': 'Nano Banana 2',
  'seedream-4-5': 'Seedream 4.5',
  'seedream-5-0-lite': 'Seedream 5.0 Lite',
  'seedream-5-0-pro': 'Seedream 5.0 Pro',
  'wan-2-7-image': 'Wan 2.7 Image',
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

export function isWrappedHairToolHistory(item: HistoryDisplaySource) {
  const toolSlug = String(item.toolSlug || '').trim()
  if (WRAPPED_HAIR_TOOL_SLUGS.has(toolSlug)) return true
  return WRAPPED_HAIR_TOOL_SLUGS.has(getSourcePathRoot(item.sourcePath))
}

export function getWrappedHairToolHistoryDisplay(item: HistoryDisplaySource) {
  const sourceRoot = getSourcePathRoot(item.sourcePath)
  const toolSlug = String(item.toolSlug || '').trim() || sourceRoot

  if (!isWrappedHairToolHistory(item)) {
    return {
      showToolLabel: false,
      toolLabel: '',
      modelLabel: getGenerationModelLabel(item.model),
    }
  }

  return {
    showToolLabel: true,
    toolLabel: String(item.toolLabel || '').trim() || WRAPPED_HAIR_TOOL_LABELS[toolSlug] || toolSlug,
    modelLabel: getGenerationModelLabel(item.model),
  }
}
