import { MetadataRoute } from 'next'
import { getAllTools } from '@/lib/seo-loader'

// 静态导出模式需要此配置
export const dynamic = 'force-static'

const baseUrl = 'https://toolaze.com'
const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const STATIC_PAGES = ['about', 'privacy', 'terms']
const TOOL_PAGES = ['image-compressor', 'image-converter', 'font-generator']

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
      // font-generator 支持 en、de、ja、es 和 fr
      if (tool === 'font-generator' && locale !== 'en' && locale !== 'de' && locale !== 'ja' && locale !== 'es' && locale !== 'fr') {
        return
      }
      const path = locale === 'en' ? `/${tool}` : `/${locale}/${tool}`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  })

  // 4. All Tools 页面（所有语言版本）
  TOOL_PAGES.forEach((tool) => {
    SUPPORTED_LOCALES.forEach((locale) => {
      // font-generator 支持 en、de、ja、es 和 fr
      if (tool === 'font-generator' && locale !== 'en' && locale !== 'de' && locale !== 'ja' && locale !== 'es' && locale !== 'fr') {
        return
      }
      const path = locale === 'en' ? `/${tool}/all-tools` : `/${locale}/${tool}/all-tools`
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  })

  // 5. 所有工具页面（所有语言版本和所有 slug）
  for (const locale of SUPPORTED_LOCALES) {
    try {
      const tools = await getAllTools(locale)
      
      if (tools && tools.length > 0) {
        tools.forEach(({ tool, slug }) => {
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
