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
  'seedance-2': ALL_LOCALE_CODES,
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
 * 当前 URL 下语言切换器应提供的语种代码（若只有一种语言则不展示切换器）。
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
    return ['en']
  }

  /** 仅有根路径英文版、无 `/[locale]/...` 对应路由的工具：仍展示全站语言入口；切换非英语时跳到该语种首页（见 getAlternateLanguageUrl）。 */
  if (ENGLISH_ONLY_ROOT_TOOLS.has(root)) {
    return [...ALL_LOCALE_CODES]
  }

  const perTool = TOOL_SUPPORTED_LOCALES[root]
  if (perTool) {
    return [...perTool]
  }

  return ['en']
}

/**
 * 是否应在导航/页脚显示语言入口：路径本身允许多语言且存在 2 种及以上可选语言。
 */
export function shouldShowLanguageSwitcher(pathname: string | null): boolean {
  return getSupportedLocaleCodes(pathname).length > 1
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
