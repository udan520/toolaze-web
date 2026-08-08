import { getSeoContent, getAllSlugs } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import {
  getUtilityLocaleAliasTarget,
  isUtilityTool,
} from '@/lib/utility-seo-routes'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import ToolSlugPageContent from './ToolSlugPageContent'
import type { Metadata } from 'next'

const MODEL_ALIAS_REDIRECTS: Record<string, string> = {
  'pixverse-v6': 'pixverse-v6-ai-video-generator',
  'happyhorse': 'happyhorse-ai-video-generator',
  'happyhorse-1-1': 'happyhorse-ai-video-generator',
}

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
    const modelAliasTarget = resolvedParams.tool === 'model'
      ? MODEL_ALIAS_REDIRECTS[resolvedParams.slug]
      : undefined

    if (modelAliasTarget) {
      const canonicalPath = locale === 'en' ? `/model/${modelAliasTarget}` : `/${locale}/model/${modelAliasTarget}`
      return {
        title: 'Redirecting to model page | Toolaze',
        robots: { index: false, follow: true },
        alternates: {
          canonical: `https://toolaze.com${canonicalPath}`,
        },
      }
    }

    if (resolvedParams.tool === 'seedance-2') {
      const canonicalPath = locale === 'en' ? '/model/seedance-2' : `/${locale}/model/seedance-2`
      return {
        title: 'Redirecting to Seedance 2.0 | Toolaze',
        robots: { index: false, follow: true },
        alternates: {
          canonical: `https://toolaze.com${canonicalPath}`,
        },
      }
    }

    if (isUtilityTool(resolvedParams.tool)) {
      const canonicalPath = getUtilityLocaleAliasTarget(
        locale,
        resolvedParams.tool,
        resolvedParams.slug
      )

      return {
        title: 'Redirecting to tool page | Toolaze',
        robots: { index: false, follow: true },
        alternates: {
          canonical: `https://toolaze.com${canonicalPath}`,
        },
      }
    }
    
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

export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = 86400

const UTILITY_REDIRECT_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const
const PREGENERATED_LOCALES = ['en'] as const
const PREGENERATED_TOOL_SLUG_LIMITS: Record<string, number> = {
  'seedance-2': 3,
  'watermark-remover': 2,
}

function getPregeneratedSlugs(tool: string, slugs: string[]) {
  const limit = PREGENERATED_TOOL_SLUG_LIMITS[tool] ?? 0
  return slugs.slice(0, limit)
}

// 2. 告诉 Next.js 在打包时生成哪些静态页面 (SSG)
export async function generateStaticParams() {
  const params = []
  
  try {
    // 使用英语版本获取所有 slug（因为所有语言版本应该有相同的 slug）
    const compressorSlugs = await getAllSlugs('image-compressor', 'en') || []
    const converterSlugs = await getAllSlugs('image-converter', 'en') || []
    const fontGeneratorSlugs = await getAllSlugs('font-generator', 'en') || []
    const emojiCopyPasteSlugs = await getAllSlugs('emoji-copy-and-paste', 'en') || []
    const seedance2Slugs = await getAllSlugs('seedance-2', 'en') || []
    const watermarkRemoverSlugs = await getAllSlugs('watermark-remover', 'en') || []

    const utilityRedirects = [
      { tool: 'image-compressor', slugs: compressorSlugs },
      { tool: 'image-converter', slugs: converterSlugs },
      { tool: 'font-generator', slugs: fontGeneratorSlugs },
      { tool: 'emoji-copy-and-paste', slugs: [...emojiCopyPasteSlugs, 'all-tools'] },
    ]

    // 父级 locale layout 禁止未声明参数，因此历史工具 URL 必须全部静态声明为 308。
    for (const locale of UTILITY_REDIRECT_LOCALES) {
      for (const { tool, slugs } of utilityRedirects) {
        for (const slug of slugs) {
          if (!slug || typeof slug !== 'string') continue
          params.push({ locale, tool, slug })
        }
      }
    }

    for (const locale of PREGENERATED_LOCALES) {
      // 添加 Seedance 2.0 L3 页面（/en/seedance-2/* 会重定向到 /seedance-2/*）
      for (const slug of getPregeneratedSlugs('seedance-2', seedance2Slugs)) {
        if (slug && typeof slug === 'string') {
          params.push({
            locale: locale,
            tool: 'seedance-2',
            slug: slug,
          })
        }
      }

      // Watermark Remover L3（/ja/watermark-remover/...；英语 canonical 仍为 /watermark-remover/...）
      for (const slug of getPregeneratedSlugs('watermark-remover', watermarkRemoverSlugs)) {
        if (slug && typeof slug === 'string') {
          params.push({
            locale: locale,
            tool: 'watermark-remover',
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

  if (!resolvedParams.slug) {
    notFound()
    return null
  }

  if (isUtilityTool(resolvedParams.tool)) {
    permanentRedirect(getUtilityLocaleAliasTarget(locale, resolvedParams.tool, resolvedParams.slug))
  }

  if (resolvedParams.tool === 'model' && MODEL_ALIAS_REDIRECTS[resolvedParams.slug]) {
    const canonicalModel = MODEL_ALIAS_REDIRECTS[resolvedParams.slug]
    permanentRedirect(locale === 'en' ? `/model/${canonicalModel}` : `/${locale}/model/${canonicalModel}`)
  }
  
  // Seedance 2.0 只保留模型 L2；工作流 L3 旧路径统一回模型页。
  if (resolvedParams.tool === 'seedance-2') {
    permanentRedirect(locale === 'en' ? '/model/seedance-2' : `/${locale}/model/seedance-2`)
  }
  
  // 无当前语种 SEO JSON：非英语一律跳到英文 canonical（避免 404；与 LANGUAGE_SWITCH_AND_REDIRECT 规则一致）
  const content = await getSeoContent(resolvedParams.tool, resolvedParams.slug, locale)
  if (!content) {
    if (locale !== 'en') {
      redirect(`/${resolvedParams.tool}/${resolvedParams.slug}`)
    }
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
