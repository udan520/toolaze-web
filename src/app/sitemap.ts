import { MetadataRoute } from 'next'
import { getAllSlugs, getAllTools, hasLocaleL2JsonFile } from '@/lib/seo-loader'
import { getPromptItems } from '@/lib/prompts'

// 静态导出模式需要此配置
export const dynamic = 'force-static'

const baseUrl = 'https://toolaze.com'
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const STATIC_PAGES = ['about', 'privacy', 'terms']
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator', 'emoji-copy-and-paste']

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

  // 3c. Watermark Remover L2（无 all-tools 子页，不放入 TOOL_PAGES）
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/watermark-remover' : `/${locale}/watermark-remover`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  })

  // 3d. Photo Restoration L2（各语言均有 photo-restoration.json）
  SUPPORTED_LOCALES.forEach((locale) => {
    const path = locale === 'en' ? '/photo-restoration' : `/${locale}/photo-restoration`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.9,
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
    url: `${baseUrl}/ai-couple-photo-maker`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.9,
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
  SUPPORTED_LOCALES.forEach((locale) => {
    if (locale === 'en') return
    entries.push({
      url: `${baseUrl}/${locale}/ai-couple-photo-maker`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  })

  // 4. Model 页面（AI 图像模型，仅英文）
  const MODEL_PAGES = ['nano-banana', 'nano-banana-pro', 'nano-banana-2', 'gpt-image-2', 'gpt-image-2-0', 'wan-2-7-image', 'seedream-4-5', 'seedance-2', 'kling-3']
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
  const LOCALIZED_MODEL_SLUGS = ['nano-banana-pro', 'nano-banana-2', 'gpt-image-2', 'gpt-image-2-0', 'wan-2-7-image', 'seedance-2', 'kling-3']
  LOCALIZED_MODEL_SLUGS.forEach((model) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      if (locale === 'en') return
      const tool = model === 'gpt-image-2-0' ? 'gpt-image-2' : model
      if (tool !== 'wan-2-7-image' && !hasLocaleL2JsonFile(tool, locale)) return
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
