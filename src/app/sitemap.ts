import { MetadataRoute } from 'next'
import { getAllSlugs, getAllTools, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { getPromptItems } from '@/lib/prompts'

// 静态导出模式需要此配置
export const dynamic = 'force-static'

const baseUrl = 'https://toolaze.com'
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const STATIC_PAGES = ['about', 'privacy', 'terms', 'pricing', 'refund-policy', 'acceptable-use', 'contact']
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator', 'emoji-copy-and-paste']
const VIDEO_GENERATOR_PAGES = ['kling-ai-video-generator', 'text-to-video-generator', 'image-to-video-generator'] as const
const AI_IMAGE_L2_PAGES = [
  { path: '/unrestricted-ai-image-generator', priority: 0.91 },
  { path: '/photo-restoration', priority: 0.9 },
  { path: '/watermark-remover', priority: 0.9 },
  { path: '/ai-couple-photo-maker', priority: 0.88 },
  { path: '/ai-baby-generator', priority: 0.88 },
  { path: '/ai-bikini-generator', priority: 0.88 },
  { path: '/ai-zine-poster-generator', priority: 0.88 },
  { path: '/ai-breast-expansion', priority: 0.84 },
  { path: '/ai-hairstyle-changer', priority: 0.88 },
  { path: '/buzz-cut-filter', priority: 0.86 },
] as const

// Sitemap lastmod should reflect real page launch or meaningful content updates,
// not the deployment/build time. Add explicit paths here when a page receives a
// substantial update; old pages fall back to a stable legacy date.
const LEGACY_LAST_MODIFIED_DATE = '2026-07-01'
const LAST_MODIFIED_BY_CANONICAL_PATH: Record<string, string> = {
  '/world-cup-ai-image-generator': '2026-07-14',
  '/watermark-remover': '2026-07-16',
  '/photo-restoration': '2026-07-16',
  '/ai-couple-photo-maker': '2026-05-10',
  '/ai-baby-generator': '2026-07-14',
  '/ai-hair-color-changer': '2026-07-16',
  '/ai-clothes-changer': '2026-08-04',
  '/ai-image-to-image-generator': '2026-08-04',
  '/ai-image-generator': '2026-08-04',
  '/model': '2026-08-02',
  '/ai-tools': '2026-08-05',
  '/ai-dance-generator': '2026-07-20',
  '/ai-video-generator': '2026-07-21',
  '/text-to-video-generator': '2026-07-22',
  '/ai-kissing-video-generator': '2026-07-23',
  '/image-to-video-generator': '2026-07-23',
  '/ai-asmr-video-generator': '2026-07-29',
  '/kling-ai-video-generator': '2026-07-30',
  '/model/wan-2-5-ai-video-generator': '2026-07-30',
  '/ai-bikini-generator': '2026-07-31',
  '/ai-breast-expansion': '2026-07-31',
  '/talking-avatar-creator': '2026-07-31',
  '/unrestricted-ai-image-generator': '2026-07-31',
  '/ai-hairstyle-changer': '2026-08-01',
  '/model/veo-3-1-ai-video-generator': '2026-08-06',
  '/model/wan-2-7-ai-video-generator': '2026-08-01',
  '/model/kling-2-6-pro-motion-control': '2026-08-02',
  '/model/kling-3-motion-control': '2026-08-02',
  '/model/wan-2-6-ai-video-generator': '2026-08-03',
  '/ai-zine-poster-generator': '2026-08-05',
  '/buzz-cut-filter': '2026-08-06',
}

function toLastModifiedDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

function toCanonicalPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const segments = normalized.split('/').filter(Boolean)

  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0])) {
    const withoutLocale = segments.slice(1).join('/')
    return withoutLocale ? `/${withoutLocale}` : '/'
  }

  return normalized === '' ? '/' : normalized
}

function getLastModified(path: string): Date {
  const canonicalPath = toCanonicalPath(path)
  return toLastModifiedDate(LAST_MODIFIED_BY_CANONICAL_PATH[canonicalPath] || LEGACY_LAST_MODIFIED_DATE)
}

interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = []
  // 1. 首页（所有语言版本）
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '' : `/${locale}`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'daily',
      priority: 1.0,
    })
  })

  // 2. 静态页面（所有语言版本）
  STATIC_PAGES.forEach((page) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = locale === 'en' ? `/${page}` : `/${locale}/${page}`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: getLastModified(path),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  })

  // 3. 功能页面（所有语言版本）
  TOOL_PAGES.forEach((tool) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = locale === 'en' ? `/${tool}` : `/${locale}/${tool}`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: getLastModified(path),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  })

  // 3d. AI image L2 tools（各语言均有对应 L2 JSON 与路由）
  AI_IMAGE_L2_PAGES.forEach((page) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = locale === 'en' ? page.path : `/${locale}${page.path}`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: getLastModified(path),
        changeFrequency: 'weekly',
        priority: page.priority,
      })
    })
  })

  // 3b. 单语言功能页面（仅英文）
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-tools' : `/${locale}/ai-tools`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.9 : 0.87,
    })
  })
  entries.push({
    url: `${baseUrl}/ai-image-generator`,
    lastModified: getLastModified('/ai-image-generator'),
    changeFrequency: 'weekly',
    priority: 0.94,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-video-generator' : `/${locale}/ai-video-generator`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.94 : 0.9,
    })
  })
  VIDEO_GENERATOR_PAGES.forEach((slug) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: getLastModified(path),
        changeFrequency: 'weekly',
        priority: locale === 'en' ? 0.93 : 0.88,
      })
    })
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-image-generator`,
      lastModified: getLastModified(`/${locale}/ai-image-generator`),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  entries.push({
    url: `${baseUrl}/text-to-image-generator`,
    lastModified: getLastModified('/text-to-image-generator'),
    changeFrequency: 'weekly',
    priority: 0.94,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/text-to-image-generator`,
      lastModified: getLastModified(`/${locale}/text-to-image-generator`),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  entries.push({
    url: `${baseUrl}/ai-image-to-image-generator`,
    lastModified: getLastModified('/ai-image-to-image-generator'),
    changeFrequency: 'weekly',
    priority: 0.94,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-image-to-image-generator`,
      lastModified: getLastModified(`/${locale}/ai-image-to-image-generator`),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  entries.push({
    url: `${baseUrl}/ai-dance-generator`,
    lastModified: getLastModified('/ai-dance-generator'),
    changeFrequency: 'weekly',
    priority: 0.9,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-dance-generator`,
      lastModified: getLastModified(`/${locale}/ai-dance-generator`),
      changeFrequency: 'weekly',
      priority: 0.87,
    })
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-asmr-video-generator' : `/${locale}/ai-asmr-video-generator`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.9 : 0.87,
    })
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/talking-avatar-creator' : `/${locale}/talking-avatar-creator`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.9 : 0.87,
    })
  })
  entries.push({
    url: `${baseUrl}/ai-kissing-video-generator`,
    lastModified: getLastModified('/ai-kissing-video-generator'),
    changeFrequency: 'weekly',
    priority: 0.9,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-kissing-video-generator`,
      lastModified: getLastModified(`/${locale}/ai-kissing-video-generator`),
      changeFrequency: 'weekly',
      priority: 0.87,
    })
  })

  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-hair-color-changer' : `/${locale}/ai-hair-color-changer`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.92 : 0.87,
    })
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-clothes-changer' : `/${locale}/ai-clothes-changer`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.92 : 0.87,
    })
  })
  entries.push({
    url: `${baseUrl}/world-cup-ai-image-generator`,
    lastModified: getLastModified('/world-cup-ai-image-generator'),
    changeFrequency: 'weekly',
    priority: 0.86,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/world-cup-ai-image-generator`,
      lastModified: getLastModified(`/${locale}/world-cup-ai-image-generator`),
      changeFrequency: 'weekly',
      priority: 0.84,
    })
  })

  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/model' : `/${locale}/model`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.85 : 0.82,
    })
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/prompts' : `/${locale}/prompts`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  const PROMPT_SEO_PAGES = [
    '/prompts/models/seedance-2-0',
    '/prompts/models/kling',
    '/prompts/models/gpt-image-2',
    '/prompts/models/nano-banana',
    '/prompts/categories/advertising',
    '/prompts/categories/fashion-beauty',
    '/prompts/categories/film-trailer',
  ]
  PROMPT_SEO_PAGES.forEach((path) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const localizedPath = locale === 'en' ? path : `/${locale}${path}`
      entries.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified: getLastModified(localizedPath),
        changeFrequency: 'weekly',
        priority: 0.82,
      })
    })
  })
  getPromptItems().forEach((item) => {
    const path = `/prompts/${item.tweetId}`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'monthly',
      priority: 0.65,
    })
  })
  // 4. Model 页面（AI 图像模型，仅英文）
  const MODEL_PAGES = ['nano-banana', 'nano-banana-pro', 'nano-banana-2', 'gpt-image-2', 'wan-2-7-image', 'veo-3-1-ai-video-generator', 'wan-2-7-ai-video-generator', 'wan-2-6-ai-video-generator', 'wan-2-5-ai-video-generator', 'seedream-4-5', 'seedream-5-0-lite', 'seedream-5-0-pro', 'seedance-2-5', 'seedance-2', 'kling-3-motion-control', 'kling-3', 'kling-2-6-pro-motion-control', 'grok-imagine-video-1-5']
  MODEL_PAGES.forEach((model) => {
    const path = `/model/${model}`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  const MODEL_ALL_TOOLS_PAGES = ['kling-3']
  MODEL_ALL_TOOLS_PAGES.forEach((model) => {
    const path = `/model/${model}/all-tools`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: getLastModified(path),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  // 4b. 多语言 model L2（与 /[locale]/model/[model] 一致；英语 canonical 仍为 /model/...）
  const LOCALIZED_MODEL_SLUGS = ['nano-banana-pro', 'nano-banana-2', 'gpt-image-2', 'wan-2-7-image', 'veo-3-1-ai-video-generator', 'wan-2-7-ai-video-generator', 'wan-2-6-ai-video-generator', 'wan-2-5-ai-video-generator', 'seedream-4-5', 'seedream-5-0-lite', 'seedream-5-0-pro', 'seedance-2-5', 'seedance-2', 'kling-3-motion-control', 'kling-3', 'kling-2-6-pro-motion-control', 'grok-imagine-video-1-5']
  LOCALIZED_MODEL_SLUGS.forEach((model) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      if (locale === 'en') return
      const tool = model
      if (tool !== 'wan-2-7-image' && tool !== 'veo-3-1-ai-video-generator' && tool !== 'wan-2-7-ai-video-generator' && tool !== 'wan-2-6-ai-video-generator' && tool !== 'wan-2-5-ai-video-generator' && tool !== 'seedream-4-5' && tool !== 'seedream-5-0-lite' && tool !== 'seedream-5-0-pro' && tool !== 'grok-imagine-video-1-5' && !hasLocaleL2JsonFile(tool, locale)) return
      const path = `/${locale}/model/${model}`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: getLastModified(path),
        changeFrequency: 'weekly',
        priority: 0.85,
      })
    })
  })

  // 5. All Tools 页面（所有语言版本）
  TOOL_PAGES.forEach((tool) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      const path = locale === 'en' ? `/${tool}/all-tools` : `/${locale}/${tool}/all-tools`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: getLastModified(path),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  // 6. 所有工具页面（所有语言版本和所有 slug）
  for (const locale of SUPPORTED_LOCALES) {
    try {
      const tools = await getAllTools(locale)

      if (tools && tools.length > 0) {
        tools.forEach(({ tool, slug }) => {
          // seedance-2 的 canonical 在 /model/seedance-2/[slug]，避免收录重定向路径
          if (tool === 'seedance-2') return
          // kling-3 仅英文
          if (tool === 'kling-3' && locale !== 'en') return
          const path = locale === 'en'
            ? `/${tool}/${slug}`
            : `/${locale}/${tool}/${slug}`

          entries.push({
            url: `${baseUrl}${path}`,
            lastModified: getLastModified(path),
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        })
      }
    } catch (error) {
      // 如果某个语言获取工具失败，继续处理其他语言
      console.warn(`Failed to get tools for locale ${locale}:`, error)
    }
  }

  return entries
}
