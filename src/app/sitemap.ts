import { MetadataRoute } from 'next'
import { getAllSlugs, getAllTools, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { getPromptItems } from '@/lib/prompts'

// 静态导出模式需要此配置
export const dynamic = 'force-static'

const baseUrl = 'https://toolaze.com'
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const STATIC_PAGES = ['about', 'privacy', 'terms', 'pricing', 'refund-policy', 'acceptable-use', 'contact']
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator', 'emoji-copy-and-paste']
const AI_IMAGE_L2_PAGES = [
  { path: '/photo-restoration', priority: 0.9 },
  { path: '/watermark-remover', priority: 0.9 },
  { path: '/ai-couple-photo-maker', priority: 0.88 },
  { path: '/ai-baby-generator', priority: 0.88 },
] as const

interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = []
  const today = new Date()

  // 1. 首页（所有语言版本）
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '' : `/${locale}`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: today,
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
        lastModified: today,
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
        lastModified: today,
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
        lastModified: today,
        changeFrequency: 'weekly',
        priority: page.priority,
      })
    })
  })

  // 3b. 单语言功能页面（仅英文）
  entries.push({
    url: `${baseUrl}/ai-tools`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9,
  })
  entries.push({
    url: `${baseUrl}/ai-image-generator`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.94,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-video-generator' : `/${locale}/ai-video-generator`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.94 : 0.9,
    })
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-image-generator`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  entries.push({
    url: `${baseUrl}/text-to-image-generator`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.94,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/text-to-image-generator`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  entries.push({
    url: `${baseUrl}/ai-image-to-image-generator`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.94,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-image-to-image-generator`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })
  entries.push({
    url: `${baseUrl}/ai-dance-generator`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-dance-generator`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.87,
    })
  })

  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/ai-hair-color-changer' : `/${locale}/ai-hair-color-changer`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: locale === 'en' ? 0.92 : 0.87,
    })
  })
  entries.push({
    url: `${baseUrl}/world-cup-ai-image-generator`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.86,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/world-cup-ai-image-generator`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.84,
    })
  })

  entries.push({
    url: `${baseUrl}/model`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.85,
  })
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/prompts' : `/${locale}/prompts`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: today,
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
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.82,
      })
    })
  })
  getPromptItems().forEach((item) => {
    entries.push({
      url: `${baseUrl}/prompts/${item.tweetId}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.65,
    })
  })
  // 4. Model 页面（AI 图像模型，仅英文）
  const MODEL_PAGES = ['nano-banana', 'nano-banana-pro', 'nano-banana-2', 'gpt-image-2', 'wan-2-7-image', 'seedream-4-5', 'seedream-5-0-lite', 'seedream-5-0-pro', 'seedance-2-5', 'seedance-2', 'kling-3', 'grok-imagine-video-1-5']
  MODEL_PAGES.forEach((model) => {
    entries.push({
      url: `${baseUrl}/model/${model}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  const MODEL_ALL_TOOLS_PAGES = ['seedance-2', 'kling-3']
  MODEL_ALL_TOOLS_PAGES.forEach((model) => {
    entries.push({
      url: `${baseUrl}/model/${model}/all-tools`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  })

  const seedanceSlugs = await getAllSlugs('seedance-2', 'en')
  seedanceSlugs.forEach((slug) => {
    entries.push({
      url: `${baseUrl}/model/seedance-2/${slug}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // 4b. 多语言 model L2（与 /[locale]/model/[model] 一致；英语 canonical 仍为 /model/...）
  const LOCALIZED_MODEL_SLUGS = ['nano-banana-pro', 'nano-banana-2', 'gpt-image-2', 'wan-2-7-image', 'seedream-4-5', 'seedream-5-0-lite', 'seedream-5-0-pro', 'seedance-2-5', 'seedance-2', 'kling-3', 'grok-imagine-video-1-5']
  LOCALIZED_MODEL_SLUGS.forEach((model) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      if (locale === 'en') return
      const tool = model
      if (tool !== 'wan-2-7-image' && tool !== 'seedream-4-5' && tool !== 'seedream-5-0-lite' && tool !== 'seedream-5-0-pro' && tool !== 'grok-imagine-video-1-5' && !hasLocaleL2JsonFile(tool, locale)) return
      entries.push({
        url: `${baseUrl}/${locale}/model/${model}`,
        lastModified: today,
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
        lastModified: today,
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
            lastModified: today,
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
