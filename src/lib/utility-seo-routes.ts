export const UTILITY_TOOLS = [
  'image-compressor',
  'image-converter',
  'font-generator',
  'emoji-copy-and-paste',
] as const

export type UtilityTool = (typeof UTILITY_TOOLS)[number]

export const RETAINED_UTILITY_L3: Record<UtilityTool, readonly string[]> = {
  'image-compressor': ['batch-compress'],
  'image-converter': [],
  'font-generator': ['cool', 'fancy', 'tattoo'],
  'emoji-copy-and-paste': [],
}

export function isUtilityTool(tool: string): tool is UtilityTool {
  return (UTILITY_TOOLS as readonly string[]).includes(tool)
}

export function isRetainedUtilityL3(tool: string, slug: string): boolean {
  return isUtilityTool(tool) && RETAINED_UTILITY_L3[tool].includes(slug)
}

export function getUtilityParentPath(locale: string, tool: UtilityTool): string {
  return locale === 'en' ? `/${tool}` : `/${locale}/${tool}`
}

export function getUtilityLocaleAliasTarget(
  locale: string,
  tool: UtilityTool,
  slug: string
): string {
  if (locale === 'en' && isRetainedUtilityL3(tool, slug)) {
    return `/${tool}/${slug}`
  }

  return getUtilityParentPath(locale, tool)
}

export function shouldIncludeUtilityL3InSitemap(
  locale: string,
  tool: string,
  slug: string
): boolean {
  return locale === 'en' && isRetainedUtilityL3(tool, slug)
}
