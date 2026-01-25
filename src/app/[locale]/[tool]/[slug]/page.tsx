import { getSeoContent, getAllSlugs } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { notFound, redirect } from 'next/navigation'
import ToolSlugPageContent from './ToolSlugPageContent'
import type { Metadata } from 'next'

// 不支持多语言的工具列表
const NON_MULTILINGUAL_TOOLS: string[] = []

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
    
    // 如果工具不支持多语言且不是英语，返回重定向元数据（目前没有不支持多语言的工具）
    // if (NON_MULTILINGUAL_TOOLS.includes(resolvedParams.tool) && locale !== 'en') {
    //   return {
    //     title: 'Redirecting... | Toolaze',
    //     robots: 'noindex, nofollow',
    //   }
    // }
    
    const content = await getSeoContent(resolvedParams.tool, resolvedParams.slug, locale)
    
    if (!content) {
      return {
        title: 'Tool Not Found | Toolaze',
        robots: 'index, follow',
      }
    }
    
    const pathWithoutLocale = `/${resolvedParams.tool}/${resolvedParams.slug}`
    const baseUrl = 'https://toolaze.com'
    
    // 支持多语言的工具，设置 hreflang
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
  
  try {
    // 使用英语版本获取所有 slug（因为所有语言版本应该有相同的 slug）
    const compressorSlugs = await getAllSlugs('image-compressor', 'en') || []
    const converterSlugs = await getAllSlugs('image-converter', 'en') || []
    const fontGeneratorSlugs = await getAllSlugs('font-generator', 'en') || []
    
    for (const locale of locales) {
      // 添加图片压缩工具的页面
      for (const slug of compressorSlugs) {
        if (slug && typeof slug === 'string') {
          params.push({
            locale: locale,
            tool: 'image-compressor',
            slug: slug,
          })
        }
      }
      
      // 添加图片转换工具的页面
      for (const slug of converterSlugs) {
        if (slug && typeof slug === 'string') {
          params.push({
            locale: locale,
            tool: 'image-converter',
            slug: slug,
          })
        }
      }
      
      // 添加字体生成工具的页面（为所有语言生成参数，未支持的语言会在运行时重定向到英语版本）
      for (const slug of fontGeneratorSlugs) {
        if (slug && typeof slug === 'string') {
          params.push({
            locale: locale,
            tool: 'font-generator',
            slug: slug,
          })
        }
      }
    }
  } catch (error) {
    console.error('Error in generateStaticParams:', error)
    // 如果出错，至少返回一个默认页面，避免构建失败
    return [{ locale: 'en', tool: 'image-compressor', slug: 'compress-jpg' }]
  }
  
  // 确保至少返回一个参数，避免构建失败
  if (params.length === 0) {
    console.warn('generateStaticParams returned empty array, using fallback')
    return [{ locale: 'en', tool: 'image-compressor', slug: 'compress-jpg' }]
  }
  
  return params
}

// 3. 页面渲染逻辑
export default async function LandingPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  if (!resolvedParams.tool) {
    notFound()
    return null
  }
  
  // 如果工具不支持多语言，且当前不是英语，重定向到英语版本（目前没有不支持多语言的工具）
  // if (NON_MULTILINGUAL_TOOLS.includes(resolvedParams.tool) && locale !== 'en') {
  //   if (resolvedParams.slug) {
  //     // L3 页面：重定向到 /tool/slug
  //     redirect(`/${resolvedParams.tool}/${resolvedParams.slug}`)
  //   } else {
  //     // L2 页面：重定向到 /tool
  //     redirect(`/${resolvedParams.tool}`)
  //   }
  // }
  
  if (!resolvedParams.slug) {
    notFound()
    return null
  }
  
  // 检查内容是否存在，如果不存在且不是英语，重定向到英语版本
  const content = await getSeoContent(resolvedParams.tool, resolvedParams.slug, locale)
  if (!content && locale !== 'en') {
    // 对于所有工具，如果内容不存在，重定向到英语版本
    if (resolvedParams.tool === 'font-generator') {
      redirect(`/font-generator/${resolvedParams.slug}`)
    } else if (resolvedParams.tool === 'image-compressor' || resolvedParams.tool === 'image-compression') {
      redirect(`/image-compressor/${resolvedParams.slug}`)
    } else if (resolvedParams.tool === 'image-converter' || resolvedParams.tool === 'image-conversion') {
      redirect(`/image-converter/${resolvedParams.slug}`)
    }
  }
  
  return (
    <ToolSlugPageContent 
      locale={locale}
      tool={resolvedParams.tool}
      slug={resolvedParams.slug}
    />
  )
}
