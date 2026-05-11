/**
 * 全站语言切换与「某落地页实际支持的语种」——供 Navigation / Footer 及文档规则统一使用。
 * @see docs/LANGUAGE_SWITCH_AND_REDIRECT.md
 */

export const SITE_LOCALES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh-TW', name: '中文(繁體)', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
] as const

export const ALL_LOCALE_CODES = SITE_LOCALES.map((l) => l.code)

export type SiteLocaleCode = (typeof SITE_LOCALES)[number]['code']

/** URL 首段是否为已知语言码（避免 readonly tuple 上 includes 的 string 窄化问题） */
export function isSiteLocaleCode(segment: string): segment is SiteLocaleCode {
  return (ALL_LOCALE_CODES as readonly string[]).includes(segment)
}

/** 与 SEO 数据目录一致的「某工具落地页支持的语言」；未列出的根路径工具视为仅英文 */
export const TOOL_SUPPORTED_LOCALES: Record<string, readonly string[]> = {
  'image-compressor': ALL_LOCALE_CODES,
  'image-converter': ALL_LOCALE_CODES,
  'font-generator': ['en', 'de', 'ja', 'es', 'fr'],
  'emoji-copy-and-paste': ['en'],
  /** 实际内容在 `/model/seedance-2`（仅英文）；`/seedance-2` 与各 `/[locale]/seedance-2` 为重定向占位 */
  'seedance-2': ['en'],
  /** 实际内容在 `/model/kling-3`（仅英文） */
  'kling-3': ['en'],
}

/** `/model/*` 下各模型页面的实际语言支持 */
const MODEL_SUPPORTED_LOCALES: Record<string, readonly string[]> = {
  'nano-banana-2': ALL_LOCALE_CODES,
  'gpt-image-2': ALL_LOCALE_CODES,
  'gpt-image-2-0': ALL_LOCALE_CODES,
  'nano-banana-pro': ['en'],
  'seedance-2': ['en'],
  'kling-3': ['en'],
}

/** 无 [locale]/... 多语言版本的单一路径工具（仅英文 canonical） */
const ENGLISH_ONLY_ROOT_TOOLS = new Set([
  'watermark-remover',
  'photo-restoration',
  'ai-couple-photo-maker',
  'ai-tools',
])

export function parseLocalePath(pathname: string): {
  pathLocale: string
  /** 去掉语言前缀后的路径段，如 ['image-compressor','jpg-to-20kb'] */
  segments: string[]
} {
  const parts = pathname.split('/').filter(Boolean)
  const first = parts[0] ?? ''
  if (isSiteLocaleCode(first)) {
    return { pathLocale: first, segments: parts.slice(1) }
  }
  return { pathLocale: 'en', segments: parts }
}

/**
 * 当前落地页实际支持的语种（语言下拉里只应出现这些；与 SEO 路由一致）。
 */
export function getSupportedLocaleCodes(pathname: string | null): string[] {
  if (!pathname || pathname === '/') {
    return [...ALL_LOCALE_CODES]
  }

  const { segments } = parseLocalePath(pathname)
  if (segments.length === 0) {
    return [...ALL_LOCALE_CODES]
  }

  const root = segments[0]

  if (['about', 'privacy', 'terms'].includes(root)) {
    return [...ALL_LOCALE_CODES]
  }

  if (root === 'model') {
    const modelSlug = segments[1]
    if (!modelSlug) {
      return [...ALL_LOCALE_CODES]
    }
    return [...(MODEL_SUPPORTED_LOCALES[modelSlug] || ['en'])]
  }

  /** 仅有根路径英文版、无 `/[locale]/...` 对应路由的工具：只支持英文。 */
  if (ENGLISH_ONLY_ROOT_TOOLS.has(root)) {
    return ['en']
  }

  const perTool = TOOL_SUPPORTED_LOCALES[root]
  if (perTool) {
    return [...perTool]
  }

  return ['en']
}

/**
 * 是否应在导航/页脚显示语言入口。
 * 需求：所有页面都显示语言切换器；具体可选项由 getSupportedLocaleCodes(pathname) 决定。
 */
export function shouldShowLanguageSwitcher(pathname: string | null): boolean {
  void pathname
  return true
}

/** 用户手动选择语言的持久化键 */
export const PREFERRED_LOCALE_STORAGE_KEY = 'toolaze.preferredLocale'

/** 按目标页面支持语言解析「应使用语言」：优先用户语言，不支持则回退英语 */
export function resolveLocaleForPath(pathname: string, preferredLocale: string): string {
  const supported = getSupportedLocaleCodes(pathname)
  return supported.includes(preferredLocale) ? preferredLocale : 'en'
}

/** 结合目标页面支持语言与用户偏好，生成最终跳转 URL */
export function getPreferredLocalizedUrl(pathname: string, preferredLocale: string): string {
  const locale = resolveLocaleForPath(pathname, preferredLocale)
  return getAlternateLanguageUrl(pathname, locale)
}

/** 从 pathname 解析当前 locale（第一段是否为语言码） */
export function getCurrentLocaleFromPath(pathname: string | null): SiteLocaleCode {
  if (!pathname) return 'en'
  const first = pathname.split('/').filter(Boolean)[0] ?? ''
  return isSiteLocaleCode(first) ? first : 'en'
}

/**
 * 切换语言后的路径（与 Footer 历史逻辑对齐）。
 */
export function getAlternateLanguageUrl(pathname: string, targetLocale: string): string {
  if (!pathname || pathname === '/') {
    return targetLocale === 'en' ? '/' : `/${targetLocale}`
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { segments } = parseLocalePath(normalizedPath)
  const englishOnlyRoot = segments[0]
  if (englishOnlyRoot && ENGLISH_ONLY_ROOT_TOOLS.has(englishOnlyRoot)) {
    if (targetLocale === 'en') {
      return segments.length ? `/${segments.join('/')}` : '/'
    }
    return `/${targetLocale}`
  }

  const pathParts = pathname.split('/').filter(Boolean)
  const firstPart = pathParts[0] ?? ''

  const currentPathLocale = SITE_LOCALES.find((loc) => loc.code === firstPart)

  if (currentPathLocale) {
    pathParts[0] = targetLocale === 'en' ? '' : targetLocale
    const newPath = pathParts.filter(Boolean).join('/')
    return newPath ? `/${newPath}` : '/'
  }

  if (targetLocale === 'en') {
    return pathname.startsWith('/') ? pathname : `/${pathname}`
  }
  const pathWithSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `/${targetLocale}${pathWithSlash}`
}
