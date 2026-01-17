import { getSeoContent, getAllSlugs } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { notFound } from 'next/navigation'
import ToolSlugPageContent from './ToolSlugPageContent'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    locale: string
    tool: string
    slug: string
  }>
}

// 1. 自动生成 SEO 标签 (Metadata)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const locale = resolvedParams.locale || 'en'
    const content = await getSeoContent(resolvedParams.tool, resolvedParams.slug, locale)
    
    if (!content) {
      return {
        title: 'Tool Not Found | Toolaze',
        robots: 'index, follow',
      }
    }
    
    const pathWithoutLocale = `/${resolvedParams.tool}/${resolvedParams.slug}`
    const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
    
    return {
      title: content.metadata.title,
      description: content.metadata.description,
      robots: 'index, follow',
      alternates: {
        canonical: hreflang.canonical,
        languages: hreflang.languages,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Tool Not Found | Toolaze',
      robots: 'index, follow',
    }
  }
}

// 2. 告诉 Next.js 在打包时生成哪些静态页面 (SSG)
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const params = []
  
  for (const locale of locales) {
    // 使用英语版本获取所有 slug（因为所有语言版本应该有相同的 slug）
    const compressorSlugs = await getAllSlugs('image-compressor', 'en')
    const converterSlugs = await getAllSlugs('image-converter', 'en')
    
    // 添加图片压缩工具的页面
    for (const slug of compressorSlugs) {
      params.push({
        locale: locale,
        tool: 'image-compressor',
        slug: slug,
      })
    }
    
    // 添加图片转换工具的页面
    for (const slug of converterSlugs) {
      params.push({
        locale: locale,
        tool: 'image-converter',
        slug: slug,
      })
    }
  }
  
  return params
}

// 3. 页面渲染逻辑
export default async function LandingPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  if (!resolvedParams.tool || !resolvedParams.slug) {
    notFound()
    return null
  }
  
  return (
    <ToolSlugPageContent 
      locale={locale}
      tool={resolvedParams.tool}
      slug={resolvedParams.slug}
    />
  )
}
