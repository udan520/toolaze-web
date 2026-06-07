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
  'font-generator': ALL_LOCALE_CODES,
  'emoji-copy-and-paste': ALL_LOCALE_CODES,
  'watermark-remover': ALL_LOCALE_CODES,
  'ai-couple-photo-maker': ALL_LOCALE_CODES,
  'photo-restoration': ALL_LOCALE_CODES,
  'prompts': ALL_LOCALE_CODES,
  /** 无各语言 SEO 数据时由页面重定向到 `/ai-tools` */
  'ai-tools': ALL_LOCALE_CODES,
  /** `/[locale]/seedance-2` 占位，多由页面重定向到 `/model/seedance-2` */
  'seedance-2': ALL_LOCALE_CODES,
  'kling-3': ALL_LOCALE_CODES,
}

/** `/model/*` 下各模型页面的实际语言支持 */
const MODEL_SUPPORTED_LOCALES: Record<string, readonly string[]> = {
  'nano-banana-2': ALL_LOCALE_CODES,
  'gpt-image-2': ALL_LOCALE_CODES,
  'gpt-image-2-0': ALL_LOCALE_CODES,
  'nano-banana-pro': ALL_LOCALE_CODES,
  'seedance-2': ALL_LOCALE_CODES,
  'kling-3': ALL_LOCALE_CODES,
}

/** 无多语言 URL 的根路径；切换到其他语言时直接回英文 canonical */
const ENGLISH_ONLY_ROOT_TOOLS = new Set<string>()

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
 * 当前落地页**内容/路由**实际支持的语种（用于判断是否可切到该语言、以及无译文时回退英语）。
 */
export function getContentSupportedLocaleCodes(pathname: string | null): string[] {
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
    return [...(MODEL_SUPPORTED_LOCALES[modelSlug] || ALL_LOCALE_CODES)]
  }

  if (ENGLISH_ONLY_ROOT_TOOLS.has(root)) {
    return ['en']
  }

  const perTool = TOOL_SUPPORTED_LOCALES[root]
  if (perTool) {
    return [...perTool]
  }

  return [...ALL_LOCALE_CODES]
}

/**
 * 语言下拉里展示的语种：与首页一致，**始终为全站支持语言**。
 * 无该语 SEO 文件时由目标页 `redirect` 到英文 canonical，不在此处隐藏选项。
 */
export function getSupportedLocaleCodes(pathname: string | null): string[] {
  void pathname
  return [...ALL_LOCALE_CODES]
}

/**
 * 是否应在导航/页脚显示语言入口。
 */
export function shouldShowLanguageSwitcher(pathname: string | null): boolean {
  void pathname
  return true
}

/** 用户手动选择语言的持久化键 */
export const PREFERRED_LOCALE_STORAGE_KEY = 'toolaze.preferredLocale'

/** 按目标页面支持语言解析「应使用语言」：优先用户语言，不支持则回退英语 */
export function resolveLocaleForPath(pathname: string, preferredLocale: string): string {
  const supported = getContentSupportedLocaleCodes(pathname)
  return supported.includes(preferredLocale) ? preferredLocale : 'en'
}

/** 去掉 URL 中的语言前缀，得到无前缀的英文 canonical 路径（`/` 表示首页） */
export function toEnglishCanonicalPath(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { segments } = parseLocalePath(normalized)
  if (segments.length === 0) return '/'
  return `/${segments.join('/')}`
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
 * 切换语言后的路径（优先 `/{locale}/...`）。
 * 缺省语言 JSON 时由目标页的 `redirect()` 落到英文 canonical，而非在此处拦截。
 */
export function getAlternateLanguageUrl(pathname: string, targetLocale: string): string {
  if (!pathname || pathname === '/') {
    return targetLocale === 'en' ? '/' : `/${targetLocale}`
  }

  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`

  if (!getContentSupportedLocaleCodes(normalizedPath).includes(targetLocale)) {
    return toEnglishCanonicalPath(normalizedPath)
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
