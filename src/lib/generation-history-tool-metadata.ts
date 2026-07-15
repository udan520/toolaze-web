const LOCALIZED_ROUTE_PREFIXES = new Set(['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'])

const HISTORY_TOOL_LABELS: Record<string, string> = {
  'ai-image-generator': 'AI Image Generator',
  'ai-image-to-image-generator': 'AI Image to Image Generator',
  'text-to-image-generator': 'Text to Image Generator',
  'ai-baby-generator': 'AI Baby Generator',
  'ai-couple-photo-maker': 'AI Couple Photo Maker',
  'ai-hairstyle-changer': 'AI Hairstyle Changer',
  'ai-hair-color-changer': 'AI Hair Color Changer',
  'watermark-remover': 'Watermark Remover',
  'photo-restoration': 'Photo Restoration',
  'ai-clothes-changer': 'AI Clothes Changer',
}

function getRouteParts(pathname: string) {
  const pathParts = pathname.split('/').filter(Boolean)
  return LOCALIZED_ROUTE_PREFIXES.has(pathParts[0] || '')
    ? pathParts.slice(1)
    : pathParts
}

export function getLocalizedInternalPath(pathname: string, targetPath: string) {
  const normalizedTarget = targetPath.startsWith('/') ? targetPath : `/${targetPath}`
  const pathParts = pathname.split('/').filter(Boolean)
  const localePrefix = pathParts[0] || ''

  return LOCALIZED_ROUTE_PREFIXES.has(localePrefix)
    ? `/${localePrefix}${normalizedTarget}`
    : normalizedTarget
}

export function getHistoryToolMetadata(pathname: string, selectedModelName: string, selectedModelId: string) {
  const routeParts = getRouteParts(pathname)
  const rootSegment = routeParts[0] || 'ai-image-generator'

  if (rootSegment === 'model') {
    const modelSlug = selectedModelId || routeParts[1] || 'nano-banana-pro'
    return {
      toolSlug: `model/${modelSlug}`,
      toolLabel: selectedModelName || modelSlug,
      sourcePath: getLocalizedInternalPath(pathname, `/model/${modelSlug}`),
    }
  }

  return {
    toolSlug: rootSegment,
    toolLabel: HISTORY_TOOL_LABELS[rootSegment] || rootSegment,
    sourcePath: pathname,
  }
}
