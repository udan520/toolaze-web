import { getL2SeoContent, getAllSlugs, loadCommonTranslations, getSeoContent, VIDEO_MODEL_L2S, IMAGE_MODEL_L2S } from '@/lib/seo-loader'
import { filterPaymentReviewSections, shouldRenderPaymentReviewSocialProofSection } from '@/lib/payment-review-visibility'
import { localizeLinksInObject } from '@/lib/localize-links'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FontGeneratorHero from '@/components/blocks/FontGeneratorHero'
import FontGenerator from '@/components/FontGenerator'
import ImageCompressor from '@/components/ImageCompressor'
import ImageConverter from '@/components/ImageConverter'
import EmojiCategoryPage from '@/components/EmojiCategoryPage'
import AiImageGenerationTool from '@/components/AiImageGenerationTool'
import WatermarkRemover from '@/components/WatermarkRemover'
import PhotoRestoration from '@/components/PhotoRestoration'
import SeedanceHeroPlaceholder from '@/components/blocks/SeedanceHeroPlaceholder'
import Seedance25LaunchUpdates from '@/components/blocks/Seedance25LaunchUpdates'
import KlingHeroPlaceholder from '@/components/blocks/KlingHeroPlaceholder'
import NanoBanana2HeroPlaceholder from '@/components/blocks/NanoBanana2HeroPlaceholder'
import TrustBar from '@/components/blocks/TrustBar'
import Intro from '@/components/blocks/Intro'
import Features from '@/components/blocks/Features'
import PerformanceMetrics from '@/components/blocks/PerformanceMetrics'
import ModelComparisonTable from '@/components/blocks/ModelComparisonTable'
import HowToUse from '@/components/blocks/HowToUse'
import Comparison from '@/components/blocks/Comparison'
import ModelIntroBlock from '@/components/blocks/ModelIntroBlock'
import Scenarios from '@/components/blocks/Scenarios'
import Rating from '@/components/blocks/Rating'
import FAQ from '@/components/blocks/FAQ'
import PromptExamples from '@/components/blocks/PromptExamples'
import type { PromptInsertMode } from '@/lib/prompt-insert-mode'
import ToolCard from '@/components/ToolCard'
import React from 'react'

interface ToolL2PageContentProps {
  locale: string
  tool: string
}

const AI_IMAGE_TOOL_TOP_COMPONENTS = new Set(['gpt-image-2'])

// 从 hero.h1 中提取页面标题（用于面包屑）
function extractPageTitle(h1: string): string {
  return h1.replace(/<[^>]*>/g, '').trim()
}

// 提取简化的核心标题（用于面包屑和菜单，去掉修饰词如 "Unlimited"）
function extractSimpleTitle(h1: string): string {
  const cleaned = h1.replace(/<[^>]*>/g, '').trim()
  
  // 移除常见的修饰词
  const modifiers = [
    /^Unlimited\s+/i,
    /^Free\s+/i,
    /^Professional\s+/i,
    /^Advanced\s+/i,
    /^Premium\s+/i,
    /\s*:\s*.*$/i, // 移除冒号后的所有内容
  ]
  
  let result = cleaned
  for (const pattern of modifiers) {
    result = result.replace(pattern, '')
  }
  
  return result.trim() || cleaned
}

// 智能识别核心关键词并应用渐变
function renderH1WithGradient(h1: string): React.ReactElement {
  if (h1.includes('<span')) {
    return <span dangerouslySetInnerHTML={{ __html: h1 }} />
  }

  const keywordPatterns = [
    { pattern: /\b(Font|Fonts|Generator)\b/gi, name: 'tool' },
  ]

  const parts = h1.split(/(\s+)/)
  const result: React.ReactNode[] = []

  parts.forEach((part, index) => {
    if (/^\s+$/.test(part)) {
      result.push(part)
      return
    }

    let isKeyword = false
    for (const { pattern } of keywordPatterns) {
      pattern.lastIndex = 0
      if (pattern.test(part)) {
        isKeyword = true
        break
      }
    }

    if (isKeyword) {
      result.push(
        <span key={index} className="text-gradient">
          {part}
        </span>
      )
    } else {
      result.push(part)
    }
  })

  return <>{result}</>
}

// 生成 JSON-LD HowTo Schema
function generateHowToSchema(
  howToTitle: string,
  steps: Array<{ title?: string; desc?: string; description?: string }>
): object {
  const howToSteps = steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    text: step.desc || step.description || step.title || `Step ${index + 1}`,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howToTitle,
    step: howToSteps,
  }
}

interface StrategyCardItem {
  title: string
  desc?: string
  prompt?: string
  color?: string
  badge?: string
}

interface StrategyCardSection {
  title?: string
  subtitle?: string
  items?: StrategyCardItem[]
}

interface StrategyTableSection {
  title?: string
  subtitle?: string
  columns?: string[]
  rows?: string[][]
}

interface TestimonialItem {
  name?: string
  role?: string
  quote: string
}

interface TestimonialsSection {
  title?: string
  subtitle?: string
  items?: TestimonialItem[]
}

interface PromptPreset {
  label: string
  prompt?: string
  color?: string
  swatch?: string
  image?: string
  group?: string
  referenceImage?: string
}

function Testimonials({
  section,
  bgClass,
}: {
  section?: TestimonialsSection
  bgClass: string
}) {
  if (!shouldRenderPaymentReviewSocialProofSection('testimonials')) return null
  if (!section?.items || section.items.length === 0) return null

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        {section.title && (
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="desc-text text-center max-w-3xl mx-auto mb-12">
            {section.subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {section.items.slice(0, 3).map((item, idx) => (
            <article
              key={`${item.name || 'review'}-${idx}`}
              className="flex h-full flex-col rounded-3xl border border-indigo-50 bg-white p-7 shadow-sm"
            >
              <div className="mb-5 flex gap-1 text-amber-400" aria-label="rating stars">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <span key={starIndex}>★</span>
                ))}
              </div>
              <p className="flex-1 text-sm leading-7 text-slate-600">“{item.quote}”</p>
              {(item.name || item.role) && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  {item.name && <p className="font-bold text-slate-900">{item.name}</p>}
                  {item.role && <p className="mt-1 text-xs font-semibold text-indigo-600">{item.role}</p>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function StrategyCardGrid({
  section,
  bgClass,
}: {
  section?: StrategyCardSection
  bgClass: string
}) {
  if (!section?.items || section.items.length === 0) return null
  const gridClass =
    section.items.length === 4
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      : 'grid grid-cols-1 md:grid-cols-3 gap-6'

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        {section.title && (
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="desc-text text-center max-w-3xl mx-auto mb-12">
            {section.subtitle}
          </p>
        )}
        <div className={gridClass}>
          {section.items.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              className="rounded-3xl border border-indigo-50 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="h-12 w-12 rounded-2xl border-4 border-white shadow-sm"
                  style={{ background: item.color || 'linear-gradient(135deg, #6366f1, #ec4899)' }}
                />
                {item.badge && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              {item.desc && (
                <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
              )}
              {item.prompt && (
                <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {item.prompt}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function StrategyTable({
  section,
  bgClass,
}: {
  section?: StrategyTableSection
  bgClass: string
}) {
  if (!section?.rows || section.rows.length === 0) return null

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        {section.title && (
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="desc-text text-center max-w-3xl mx-auto mb-12">
            {section.subtitle}
          </p>
        )}
        <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              {section.columns && section.columns.length > 0 && (
                <thead>
                  <tr className="bg-slate-50">
                    {section.columns.map((column) => (
                      <th key={column} className="px-6 py-4 text-sm font-bold text-slate-900">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {section.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-slate-100">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className={`px-6 py-5 text-sm leading-relaxed ${
                          cellIndex === 0 ? 'font-bold text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function pickKeys<T extends Record<string, unknown>>(source: T | undefined, keys: string[]) {
  if (!source) return undefined
  return keys.reduce<Record<string, unknown>>((picked, key) => {
    if (key in source) picked[key] = source[key]
    return picked
  }, {})
}

export default async function ToolL2PageContent({ locale, tool }: ToolL2PageContentProps) {
  try {
    if (!tool) {
      notFound()
      return null
    }
    
    let content = await getL2SeoContent(tool, locale)

    if (!content) {
      notFound()
      return null
    }
    
    if (!content.metadata || !content.hero) {
      notFound()
      return null
    }

    // 为内容中的内部链接添加语言前缀（非英语）
    if (locale !== 'en') {
      content = localizeLinksInObject(content, locale) as typeof content
    }

    // 顶部功能：优先使用 JSON 中的 topComponent，否则用 tool
    const topComp = (content.topComponent || tool) as string
    const isScenePage = content.visiblePageType === 'scene'
    const isAiImageToolPage = content.pageGroup === 'ai-tools' || AI_IMAGE_TOOL_TOP_COMPONENTS.has(topComp)
    const promptExampleTargetMode: PromptInsertMode | undefined =
      content.topTool?.mode === 'image-to-image' || content.topTool?.mode === 'text-to-image'
        ? content.topTool.mode
        : undefined

    // Load translations
    const t = await loadCommonTranslations(locale)
    const sceneNavKeys = [
      'language',
      'quickTools',
      'aiTools',
      'imageCompression',
      'imageConverter',
      'watermarkRemover',
      'photoRestoration',
      'aiCouplePhotoMaker',
      'aiBabyGenerator',
      'worldCupAiImageGenerator',
      'fontGenerator',
      'emojiCopyAndPaste',
      'aiImage',
      'aiImageGenerator',
      'textToImageGenerator',
      'aiImageToImageGenerator',
      'aiVideo',
      'wan27Image',
      'seedream45',
      'seedream50Lite',
      'seedance25',
      'seedance2',
      'kling3',
      'promptLibrary',
      'allPrompts',
      'promptModels',
      'promptScenes',
      'kling',
      'advertising',
      'fashionBeauty',
      'filmTrailer',
      'aboutUs',
      'viewAllAiTools',
      'emojiMenu',
    ]
    const sceneFooterKeys = [
      'home',
      'allTools',
      'aboutUs',
      'privacyPolicy',
      'termsOfService',
      'contact',
      'language',
      'footerNavigation',
      'noToolsAvailable',
      'copyright',
      'tagline',
      'quickTools',
      'aiTools',
      'aiVideo',
      'aiImage',
      'aiImageGenerator',
      'textToImageGenerator',
      'aiImageToImageGenerator',
      'watermarkRemover',
      'photoRestoration',
      'aiCouplePhotoMaker',
      'aiBabyGenerator',
      'worldCupAiImageGenerator',
      'imageCompression',
      'imageConverter',
      'fontGenerator',
      'emojiCopyAndPaste',
      'seedance25',
      'seedance2',
      'kling3',
      'wan27Image',
      'seedream45',
      'seedream50Lite',
      'emojiMenu',
    ]
    const pageTranslations = isScenePage
      ? {
          suppressModelBranding: true,
          nav: pickKeys(t?.nav, sceneNavKeys),
          footer: pickKeys(t?.footer, sceneFooterKeys),
          breadcrumb: t?.breadcrumb,
          auth: t?.auth,
          account: t?.account,
          common: {
            performanceMetrics: t?.common?.performanceMetrics,
            nanoBananaTool: t?.common?.nanoBananaTool,
            tryNow: t?.common?.tryNow,
          },
        }
      : t
    const breadcrumbT = t?.breadcrumb || { home: 'Home', fontGenerator: 'Font Generator' }

    const fallbackPageTitle = content.hero?.h1 ? extractSimpleTitle(content.hero.h1) : tool

    // 默认内容：避免在非英语页面缺字段时暴露英文兜底文案。
    const getDefaultIntro = () => {
      return {
        title: fallbackPageTitle,
        desc: ""
      }
    }
    const defaultIntro = getDefaultIntro()
    const whyToolazeTitle = content.intro?.title || defaultIntro.title
    const whyToolazeDesc = (Array.isArray(content.intro?.content) && content.intro.content.length > 0)
      ? content.intro.content
      : (content.intro?.content?.[0]?.text || defaultIntro.desc)
    
    // 优先使用 JSON 中的 features 字段
    const whyToolazeFeatures = content.features?.items || []

    const howToUseSteps = content.howToUse?.steps || []

    const scenariosData = content.scenes || []

    const comparisonData = content.comparison && (content.comparison.toolazeFeatures || content.comparison.toolaze || content.comparison.othersFeatures || content.comparison.others) ? {
      toolaze: content.comparison.toolazeFeatures || content.comparison.toolaze || '',
      others: content.comparison.othersFeatures || content.comparison.others || ''
    } : null

    // 构建面包屑导航
    const pageTitle = fallbackPageTitle
    const breadcrumbItems = tool === 'watermark-remover'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.aiTools || 'AI Tools', href: '/ai-tools' },
          { label: breadcrumbT.watermarkRemover || 'Watermark Remover' },
        ]
      : tool === 'photo-restoration'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.aiTools || 'AI Tools', href: '/ai-tools' },
          { label: breadcrumbT.photoRestoration || 'Photo Restoration' },
        ]
      : tool === 'ai-couple-photo-maker'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.aiTools || 'AI Tools', href: '/ai-tools' },
          { label: breadcrumbT.aiCouplePhotoMaker || 'AI Couple Photo Maker' },
        ]
      : tool === 'ai-baby-generator'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.aiTools || 'AI Tools', href: '/ai-tools' },
          { label: breadcrumbT.aiBabyGenerator || 'AI Baby Generator' },
        ]
      : tool === 'nano-banana-pro'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.model || 'Model', href: '/model' },
          { label: 'Nano Banana Pro' },
        ]
      : tool === 'nano-banana-2'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.model || 'Model', href: '/model' },
          { label: 'Nano Banana 2' },
        ]
      : tool === 'gpt-image-2' && !isAiImageToolPage
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.model || 'Model', href: '/model' },
          { label: 'GPT Image 2' },
        ]
      : tool === 'seedance-2-5'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.model || 'Model', href: '/model' },
          { label: 'Seedance 2.5' },
        ]
      : tool === 'seedance-2'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.model || 'Model', href: '/model' },
          { label: 'Seedance 2.0' },
        ]
      : tool === 'kling-3'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: breadcrumbT.model || 'Model', href: '/model' },
          { label: 'Kling 3.0' },
        ]
      : isAiImageToolPage
      ? [
          { label: breadcrumbT.home, href: locale === 'en' ? '/' : `/${locale}` },
          { label: breadcrumbT.aiTools || 'AI Tools', href: locale === 'en' ? '/ai-tools' : `/${locale}/ai-tools` },
          { label: pageTitle },
        ]
      : [
          { label: breadcrumbT.home, href: locale === 'en' ? '/' : `/${locale}` },
          { label: pageTitle },
        ]
    const toolHeroOwnsBreadcrumb = [
      'ai-couple-photo-maker',
      'ai-baby-generator',
      'nano-banana-pro',
      'gpt-image-2',
      'nano-banana-2',
    ].includes(topComp)

    // 获取推荐的其他功能
    // 模型页（视频/图片）：仅推荐同类型其他 L2 模型，无其他 L2 则不显示板块
    // 非模型页：推荐同工具下的 L3 子页
    const getModelL2Href = (modelTool: string): string => {
      if (modelTool === 'nano-banana-pro') return locale === 'en' ? '/model/nano-banana-pro' : `/${locale}/model/nano-banana-pro`
      if (modelTool === 'nano-banana-2') return locale === 'en' ? '/model/nano-banana-2' : `/${locale}/model/nano-banana-2`
      if (modelTool === 'gpt-image-2') return locale === 'en' ? '/model/gpt-image-2' : `/${locale}/model/gpt-image-2`
      if (modelTool === 'seedance-2-5') return locale === 'en' ? '/model/seedance-2-5' : `/${locale}/model/seedance-2-5`
      if (modelTool === 'seedance-2') return locale === 'en' ? '/model/seedance-2' : `/${locale}/model/seedance-2`
      if (modelTool === 'kling-3') return locale === 'en' ? '/model/kling-3' : `/${locale}/model/kling-3`
      return locale === 'en' ? `/${modelTool}` : `/${locale}/${modelTool}`
    }
    let filteredRecommendedTools: Array<{ slug: string; title: string; description: string; href: string }> = []
    if (Array.isArray(content.moreToolsLinks) && content.moreToolsLinks.length > 0) {
      filteredRecommendedTools = content.moreToolsLinks
        .filter((l: { title?: string; href?: string }) => l?.title && l?.href)
        .map((l: { slug?: string; title: string; description?: string; href: string }) => ({
          slug: l.slug || l.href?.split('/').pop() || '',
          title: l.title,
          description: l.description || '',
          href: l.href,
        }))
    } else if (VIDEO_MODEL_L2S.includes(tool)) {
      const otherVideoModels = VIDEO_MODEL_L2S.filter((t) => t !== tool)
      filteredRecommendedTools = await Promise.all(
        otherVideoModels.slice(0, 3).map(async (modelTool) => {
          const data = await getL2SeoContent(modelTool, locale)
          return {
            slug: modelTool,
            title: data?.hero?.h1 ? extractSimpleTitle(data.hero.h1) : modelTool,
            description: data?.hero?.desc || data?.metadata?.description || '',
            href: getModelL2Href(modelTool),
          }
        })
      ).then((arr) => arr.filter((t) => t.title && t.href))
    } else if (IMAGE_MODEL_L2S.includes(tool)) {
      const otherImageModels = IMAGE_MODEL_L2S.filter((t) => t !== tool)
      filteredRecommendedTools = await Promise.all(
        otherImageModels.slice(0, 3).map(async (modelTool) => {
          const data = await getL2SeoContent(modelTool, locale)
          return {
            slug: modelTool,
            title: data?.hero?.h1 ? extractSimpleTitle(data.hero.h1) : modelTool,
            description: data?.hero?.desc || data?.metadata?.description || '',
            href: getModelL2Href(modelTool),
          }
        })
      ).then((arr) => arr.filter((t) => t.title && t.href))
    } else if (tool === 'watermark-remover') {
      // 竞品内链策略：去水印后常需压缩/转换；L3 教程页
      const workflowTools = ['image-compressor', 'image-converter']
      const workflowData = await Promise.all(
        workflowTools.map(async (t) => {
          const data = await getL2SeoContent(t, locale)
          return {
            slug: t,
            title: data?.hero?.h1 ? extractSimpleTitle(data.hero.h1) : t,
            description: data?.hero?.desc || data?.metadata?.description || '',
            href: locale === 'en' ? `/${t}` : `/${locale}/${t}`,
          }
        })
      )
      const howToData = await getSeoContent('watermark-remover', 'how-to-remove-watermark', locale)
      const howToCard = howToData
        ? {
            slug: 'how-to-remove-watermark',
            title: howToData.hero?.h1 ? extractSimpleTitle(howToData.hero.h1) : 'How to Remove Watermark from Photo',
            description: howToData.hero?.desc || howToData.metadata?.description || '',
            href: '/watermark-remover/how-to-remove-watermark',
          }
        : null
      filteredRecommendedTools = [...workflowData, howToCard].filter((t): t is NonNullable<typeof t> => t != null && !!t.title && !!t.href).slice(0, 3)
    } else {
      const allSlugs = await getAllSlugs(tool, locale)
      const getToolHref = (toolSlug: string, slug: string): string =>
        locale === 'en' ? `/${toolSlug}/${slug}` : `/${locale}/${toolSlug}/${slug}`
      const recommendedTools = await Promise.all(
        allSlugs.slice(0, 3).map(async (s) => {
          const toolData = await getSeoContent(tool, s, locale)
          return {
            slug: s,
            title: toolData?.hero?.h1 ? extractSimpleTitle(toolData.hero.h1) : s,
            description: toolData?.hero?.desc || toolData?.metadata?.description || '',
            href: getToolHref(tool, s),
          }
        })
      )
      filteredRecommendedTools = recommendedTools.filter((t) => t.title && t.href)
    }

    // 获取板块顺序配置（优先使用 JSON 中的 sectionsOrder，否则使用默认顺序）
    // AI Image 和 AI Video 不显示对比板块
    const defaultSectionsOrder = [
      'howToUse',
      'features',
      'intro',
      'performanceMetrics',
      'comparison',
      'scenes',
      'rating',
      'faq'
    ]
    let sectionsOrder = content.sectionsOrder || defaultSectionsOrder
    if (IMAGE_MODEL_L2S.includes(tool) || (VIDEO_MODEL_L2S.includes(tool) && tool !== 'seedance-2-5')) {
      sectionsOrder = sectionsOrder.filter((s: string) => s !== 'comparison')
    }
    sectionsOrder = filterPaymentReviewSections(sectionsOrder)

    // 生成 JSON-LD HowTo Schema
    const howToTitle = content.howToUse?.title || fallbackPageTitle
    const howToSteps = content.howToUse?.steps || howToUseSteps
    const jsonLdSchema = generateHowToSchema(howToTitle, howToSteps)

    const getPromptPresetColor = (title: string) => {
      const normalized = title.toLowerCase()
      if (normalized.includes('pink')) return 'linear-gradient(135deg, #f9a8d4, #db2777)'
      if (normalized.includes('blonde')) return 'linear-gradient(135deg, #fde68a, #d97706)'
      if (normalized.includes('copper')) return 'linear-gradient(135deg, #fb923c, #92400e)'
      if (normalized.includes('burgundy')) return 'linear-gradient(135deg, #fda4af, #991b1b)'
      if (normalized.includes('silver')) return 'linear-gradient(135deg, #f8fafc, #64748b)'
      if (normalized.includes('blue black')) return 'linear-gradient(135deg, #0f172a, #1d4ed8)'
      return 'linear-gradient(135deg, #6366f1, #ec4899)'
    }

    const promptPresetItems = (content.promptExamples?.items || []) as Array<{ title?: string; prompt?: string; color?: string; swatch?: string; image?: string; group?: string; referenceImage?: string }>
    const configuredPresetLabels = Array.isArray(content.topTool?.functionalAcceptance?.presets)
      ? content.topTool.functionalAcceptance.presets
      : []
    const promptPresetMap = new Map(
      promptPresetItems
        .filter((item) => item.title && item.prompt)
        .map((item) => [item.title, item])
    )
    const promptPresets: PromptPreset[] = configuredPresetLabels.length > 0
      ? configuredPresetLabels.map((preset: string | PromptPreset) => {
          const label = typeof preset === 'string' ? preset : preset.label
          const matched = promptPresetMap.get(label)
          return {
            label,
            prompt: label.toLowerCase() === 'custom' ? '' : (typeof preset === 'string' ? matched?.prompt : preset.prompt || matched?.prompt),
            color: label.toLowerCase() === 'custom' ? undefined : (typeof preset === 'string' ? matched?.color : preset.color || matched?.color) || getPromptPresetColor(label),
            swatch: label.toLowerCase() === 'custom' ? undefined : (typeof preset === 'string' ? matched?.swatch : preset.swatch || matched?.swatch),
            image: label.toLowerCase() === 'custom' ? undefined : (typeof preset === 'string' ? matched?.image : preset.image),
            group: typeof preset === 'string' ? matched?.group : preset.group || matched?.group,
            referenceImage: typeof preset === 'string' ? matched?.referenceImage : preset.referenceImage || matched?.referenceImage,
          }
        })
      : []

    return (
      <>
        {/* JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        
        <Navigation initialTranslations={pageTranslations} />
        
        {!toolHeroOwnsBreadcrumb && <Breadcrumb items={breadcrumbItems} />}

        <main className="min-h-screen bg-[#F8FAFF] overflow-x-hidden">
          {/* 1. Hero 板块 - 固定在最前面，不参与动态顺序；支持 topComponent 覆盖 */}
          {topComp === 'font-generator' ? (
            <FontGeneratorHero 
              h1={content.hero?.h1 || 'Font Generator'}
              desc={content.hero?.desc || 'Generate custom fonts online for free. Create beautiful text styles instantly.'}
              initialTranslations={t}
            />
          ) : topComp === 'image-compressor' || topComp === 'image-compression' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Image Compressor</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <ImageCompressor initialTranslations={t} />
              <TrustBar />
            </header>
          ) : topComp === 'image-converter' || topComp === 'image-conversion' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Image Converter</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <ImageConverter initialTranslations={t} />
              <TrustBar />
            </header>
          ) : topComp === 'emoji-copy-and-paste' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-8">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Emoji Copy & Paste</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <div className="max-w-6xl mx-auto">
                <EmojiCategoryPage initialTranslations={t} />
              </div>
              <TrustBar />
            </header>
          ) : topComp === 'watermark-remover' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Free Watermark Remover</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <WatermarkRemover initialTranslations={t} />
            </header>
          ) : topComp === 'photo-restoration' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Free Photo Restoration Online</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <PhotoRestoration initialTranslations={t} />
            </header>
          ) : topComp === 'ai-couple-photo-maker' ? (
            <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full pl-0 pr-2 md:pl-0 md:pr-6">
              <div className="w-full max-w-full">
                <div className="flex flex-col">
                  <AiImageGenerationTool
                    modelId="nano-banana-2"
                    modelName="Nano Banana 2"
                    dailyLimitStorageKey="ai_couple_photo_maker_last_used_date"
                    presetMode="ai-couple-photo-maker"
                    heroBreadcrumbItems={breadcrumbItems}
                    heroTitle={content.hero?.h1 ? renderH1WithGradient(content.hero.h1) : <>AI Couple Photo Maker</>}
                    heroDescription={content.hero?.desc}
                    initialTranslations={pageTranslations}
                  />
                </div>
              </div>
            </header>
          ) : topComp === 'ai-baby-generator' ? (
            <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full pl-0 pr-2 md:pl-0 md:pr-6">
              <div className="w-full max-w-full">
                <div className="flex flex-col">
                  <AiImageGenerationTool
                    modelId="gpt-image-2"
                    modelName={content.topTool?.displayName || 'AI Baby Generator'}
                    dailyLimitStorageKey="ai_baby_generator_last_used_date"
                    defaultMode="image-to-image"
                    defaultPrompt={content.topTool?.defaultPrompt || ''}
                    defaultImageUrls={Array.isArray(content.topTool?.defaultImageUrls) ? content.topTool.defaultImageUrls : []}
                    maxUploadImages={typeof content.topTool?.maxUploadImages === 'number' ? content.topTool.maxUploadImages : undefined}
                    hideModelBranding={content.topTool?.hideModelBranding === true}
                    sampleImages={Array.isArray(content.topTool?.sampleImages) ? content.topTool.sampleImages : undefined}
                    sampleImageVariant="sharp"
                    promptPresets={promptPresets}
                    promptPresetTitle={content.topTool?.functionalAcceptance?.presetTitle || 'Baby Portrait Styles'}
                    promptModifier={content.topTool?.promptModifier}
                    hidePresetPromptInput={content.topTool?.hidePresetPromptInput === true}
                    compactResultPanel={content.topTool?.compactResultPanel === true}
                    sceneText={content.topTool?.textOverrides}
                    heroBreadcrumbItems={breadcrumbItems}
                    heroTitle={content.hero?.h1 ? renderH1WithGradient(content.hero.h1) : <>AI Baby Generator</>}
                    heroDescription={content.hero?.desc}
                    initialTranslations={pageTranslations}
                  />
                </div>
              </div>
            </header>
          ) : topComp === 'nano-banana-pro' ? (
            <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full pl-0 pr-2 md:pl-0 md:pr-6">
              <div className="w-full max-w-full">
                {/* H5: 移除固定高度，让内容自然流式布局；桌面端保持固定高度 */}
                <div className="flex flex-col">
                  <AiImageGenerationTool
                    heroBreadcrumbItems={breadcrumbItems}
                    heroTitle={content.hero?.h1 ? renderH1WithGradient(content.hero.h1) : <>Nano Banana Pro</>}
                    heroDescription={content.hero?.desc}
                    initialTranslations={t}
                  />
                </div>
              </div>
            </header>
          ) : topComp === 'gpt-image-2' ? (
            <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full pl-0 pr-2 md:pl-0 md:pr-6">
              <div className="w-full max-w-full">
                <div className="flex flex-col">
                  <AiImageGenerationTool
                    modelId="gpt-image-2"
                    modelName={content.topTool?.displayName || 'AI Hair Color Changer'}
                    dailyLimitStorageKey="gpt_image_2_last_used_date"
                    defaultMode={content.topTool?.mode === 'image-to-image' ? 'image-to-image' : undefined}
                    defaultPrompt={content.topTool?.defaultPrompt || ''}
                    defaultImageUrls={Array.isArray(content.topTool?.defaultImageUrls) ? content.topTool.defaultImageUrls : []}
                    maxUploadImages={typeof content.topTool?.maxUploadImages === 'number' ? content.topTool.maxUploadImages : undefined}
                    hideModelBranding={content.topTool?.hideModelBranding === true}
                    sampleImages={Array.isArray(content.topTool?.sampleImages) ? content.topTool.sampleImages : undefined}
                    sampleImageVariant="sharp"
                    promptPresets={promptPresets}
                    promptPresetTitle={content.topTool?.functionalAcceptance?.presetTitle || 'Hair Color Presets'}
                    promptPresetTabs={Array.isArray(content.topTool?.functionalAcceptance?.presetTabs) ? content.topTool.functionalAcceptance.presetTabs : undefined}
                    hidePresetPromptInput={content.topTool?.functionalAcceptance?.hidePresetPromptInput === true}
                    compactResultPanel={content.topTool?.compactResultPanel === true}
                    customPromptTabId={content.topTool?.functionalAcceptance?.customPromptTabId || 'custom'}
                    sceneText={content.topTool?.textOverrides}
                    heroBreadcrumbItems={breadcrumbItems}
                    heroTitle={
                      content.hero?.h1
                        ? renderH1WithGradient(content.hero.h1)
                        : isScenePage || isAiImageToolPage
                          ? <>{content.topTool?.displayName || fallbackPageTitle}</>
                          : <>GPT Image 2</>
                    }
                    heroDescription={content.hero?.desc}
                    initialTranslations={pageTranslations}
                  />
                </div>
              </div>
            </header>
          ) : topComp === 'seedance-2-5' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Seedance 2.5 AI Video Generator</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <Seedance25LaunchUpdates copy={content.launchUpdates} />
            </header>
          ) : topComp === 'seedance-2' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Seedance 2.0</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <SeedanceHeroPlaceholder initialTranslations={t} />
            </header>
          ) : topComp === 'kling-3' ? (
            <header className="bg-[#F8FAFF] pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Kling 3.0</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <KlingHeroPlaceholder initialTranslations={t} />
            </header>
          ) : topComp === 'nano-banana-2' ? (
            <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full pl-0 pr-2 md:pl-0 md:pr-6">
              <div className="w-full max-w-full">
                <div className="flex flex-col">
                  <AiImageGenerationTool
                    modelId="nano-banana-2"
                    modelName="Nano Banana 2"
                    dailyLimitStorageKey="nano_banana_2_last_used_date"
                    heroBreadcrumbItems={breadcrumbItems}
                    heroTitle={content.hero?.h1 ? renderH1WithGradient(content.hero.h1) : <>Nano Banana 2</>}
                    heroDescription={content.hero?.desc}
                    initialTranslations={t}
                  />
                </div>
              </div>
            </header>
          ) : (
            <header className="bg-[#F8FAFF] pb-8 md:pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-6 md:pt-8 mb-6 md:mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-3 md:mb-4 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>{topComp || tool}</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="text-base md:text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
                    {content.hero.desc}
                  </p>
                )}
              </div>
            </header>
          )}

          {/* 动态渲染板块 - 根据 sectionsOrder 配置 */}
          {(() => {
            // 定义各个板块的渲染函数
            const sectionRenderers: Record<string, (bgClass: string, index: number) => React.ReactNode> = {
              modelIntro: () => {
                const mi = content.modelIntro as { title?: string; description?: string | string[]; image?: { src: string; alt: string }; modelName?: string; modelType?: string; featureCards?: Array<{ title: string; content: string }> } | undefined
                if (!mi?.title || !mi?.featureCards || mi.featureCards.length < 3) return null
                return (
                  <ModelIntroBlock
                    key="modelIntro"
                    title={mi.title}
                    description={mi.description || []}
                    image={mi.image}
                    modelName={mi.modelName}
                    modelType={mi.modelType}
                    featureCards={[mi.featureCards[0], mi.featureCards[1], mi.featureCards[2]]}
                  />
                )
              },
              intro: (bgClass: string) => (
                <Intro
                  key="intro"
                  title={whyToolazeTitle}
                  description={whyToolazeDesc}
                  bgClass={bgClass}
                />
              ),
              features: (bgClass: string) => {
                const featuresData = content.features?.items || whyToolazeFeatures
                return (
                  <Features
                    key="features"
                    title={content.features?.title || 'Key Features'}
                    features={featuresData}
                    bgClass={bgClass}
                  />
                )
              },
              performanceMetrics: (bgClass: string) => {
                const performanceMetricsT = t?.common?.performanceMetrics || {}
                return (
                  <PerformanceMetrics
                    key="performanceMetrics"
                    title={content.performanceMetrics?.title}
                    metrics={content.performanceMetrics?.metrics}
                    columnHeaders={{
                      metric: performanceMetricsT.metricColumn || 'Performance Metric',
                      specification: performanceMetricsT.specificationColumn || 'Toolaze Specification'
                    }}
                    bgClass={bgClass}
                  />
                )
              },
              modelComparison: (bgClass: string) => {
                const modelComparison = content.modelComparison as {
                  title?: string
                  rows?: Array<{ label: string; baseline: string; target: string }>
                  columnHeaders?: { metric?: string; baseline?: string; target?: string }
                } | undefined
                if (!modelComparison?.rows || modelComparison.rows.length === 0) return null
                return (
                  <ModelComparisonTable
                    key="modelComparison"
                    title={modelComparison.title}
                    rows={modelComparison.rows}
                    columnHeaders={modelComparison.columnHeaders}
                    bgClass={bgClass}
                  />
                )
              },
              competitorComparison: (bgClass: string) => {
                const competitorComparison = content.competitorComparison as {
                  title?: string
                  rows?: Array<{ label: string; baseline: string; target: string }>
                  columnHeaders?: { metric?: string; baseline?: string; target?: string }
                } | undefined
                if (!competitorComparison?.rows || competitorComparison.rows.length === 0) return null
                return (
                  <ModelComparisonTable
                    key="competitorComparison"
                    title={competitorComparison.title}
                    rows={competitorComparison.rows}
                    columnHeaders={competitorComparison.columnHeaders}
                    bgClass={bgClass}
                  />
                )
              },
              howToUse: (bgClass: string) => (
                <HowToUse
                  key="howToUse"
                  title={content.howToUse?.title}
                  steps={howToUseSteps}
                  bgClass={bgClass}
                />
              ),
              comparison: (bgClass: string) => {
                // 确保使用 JSON 中的翻译标题
                const comparisonTitle = content.comparison?.title
                return (
                  <Comparison
                    key="comparison"
                    compare={comparisonData ?? undefined}
                    title={comparisonTitle}
                    labels={{
                      smartChoice: content.comparison?.smartChoice,
                      toolaze: content.comparison?.toolaze,
                      vs: content.comparison?.vs,
                      otherTools: content.comparison?.otherTools || content.comparison?.others,
                    }}
                    bgClass={bgClass}
                  />
                )
              },
              scenes: (bgClass: string) => {
                // 确保使用 JSON 中的翻译标题
                const scenesTitle = content.scenesTitle
                return (
                  <Scenarios
                    key="scenes"
                    title={scenesTitle}
                    scenarios={scenariosData}
                    bgClass={bgClass}
                  />
                )
              },
              promptExamples: (bgClass: string) => {
                const promptExamples = content.promptExamples as { title?: string; subtitle?: string; items?: Array<{ title: string; prompt: string; image?: string; note?: string; color?: string }> } | undefined
                if (!promptExamples?.items || promptExamples.items.length === 0) return null
                return (
                  <PromptExamples
                    key="promptExamples"
                    title={promptExamples.title}
                    subtitle={promptExamples.subtitle}
                    items={promptExamples.items}
                    bgClass={bgClass}
                    targetMode={promptExampleTargetMode}
                  />
                )
              },
              colorIdeas: (bgClass: string) => (
                <StrategyCardGrid
                  key="colorIdeas"
                  section={content.colorIdeas as StrategyCardSection | undefined}
                  bgClass={bgClass}
                />
              ),
              photoTips: (bgClass: string) => (
                <StrategyCardGrid
                  key="photoTips"
                  section={content.photoTips as StrategyCardSection | undefined}
                  bgClass={bgClass}
                />
              ),
              workflowComparison: (bgClass: string) => (
                <StrategyTable
                  key="workflowComparison"
                  section={content.workflowComparison as StrategyTableSection | undefined}
                  bgClass={bgClass}
                />
              ),
              testimonials: (bgClass: string) => (
                <Testimonials
                  key="testimonials"
                  section={content.testimonials as TestimonialsSection | undefined}
                  bgClass={bgClass}
                />
              ),
              rating: (bgClass: string) => {
                // 确保使用 JSON 中的翻译标题
                const ratingTitle = content.rating?.title
                const ratingValue = content.rating?.rating
                return (
                  <Rating
                    key="rating"
                    title={ratingTitle}
                    rating={ratingValue}
                    description={content.rating?.text || content.rating?.description || ''}
                    bgClass={bgClass}
                  />
                )
              },
              faq: (bgClass: string) => {
                // 确保使用 JSON 中的翻译标题
                const faqTitle = content.faqTitle
                return (
                  <FAQ
                    key="faq"
                    title={faqTitle}
                    items={content.faq}
                    bgClass={bgClass}
                  />
                )
              },
            }

            // 根据 sectionsOrder 动态渲染板块，并处理背景色交替
            // Hero 是 bg-[#F8FAFF]，所以第一个动态板块应该是 bg-white
            return sectionsOrder.map((sectionKey: string, index: number) => {
              const renderer = sectionRenderers[sectionKey]
              if (!renderer) return null
              
              // 背景色交替：index 0 = white, index 1 = #F8FAFF, index 2 = white, ...
              const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFF]'
              return renderer(bgClass, index)
            }).filter(Boolean)
          })()}

          {/* 9. Recommended Tools 板块（模型页无其他 L2 时不显示） */}
          {filteredRecommendedTools.length > 0 && (
            <section className="py-24 px-6 bg-[#F8FAFF]">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
                  {(VIDEO_MODEL_L2S.includes(tool)
                    ? (t?.common?.aiVideoModels?.moreTools || 'More AI Video Models')
                    : content.moreTools) ||
                    (tool === 'font-generator'
                      ? (t?.common?.fontGenerator?.moreTools || 'More Font Generator Tools')
                      : tool === 'image-compressor' || tool === 'image-compression'
                        ? (t?.imageCompressor?.moreTools || t?.common?.imageCompressor?.moreTools || 'More Image Compression Tools')
                        : tool === 'image-converter' || tool === 'image-conversion'
                          ? (t?.imageConverter?.moreTools || t?.common?.imageConverter?.moreTools || 'More Image Converter Tools')
                          : IMAGE_MODEL_L2S.includes(tool)
                              ? (t?.common?.aiImageModels?.moreTools || 'More AI Image Models')
                              : tool === 'nano-banana-pro'
                              ? (t?.common?.nanoBananaPro?.moreTools || 'Explore More Free AI Tools')
                              : `More ${tool} Tools`)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {filteredRecommendedTools.map((recTool, idx) => {
                    const iconBgColors: Array<'indigo' | 'purple' | 'blue'> = ['indigo', 'purple', 'blue']
                    const iconBgColor = iconBgColors[idx % 3] as 'indigo' | 'purple' | 'blue'
                    return (
                      <ToolCard
                        key={recTool.slug}
                        title={recTool.title}
                        description={recTool.description}
                        href={recTool.href}
                        iconBgColor={iconBgColor}
                        tryNowText={t?.common?.tryNow || 'Try Now →'}
                      />
                    )
                  })}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer initialTranslations={pageTranslations} />
      </>
    )
  } catch (error) {
    console.error(`Error rendering L2 page for ${tool} (${locale}):`, error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        tool,
        locale
      })
    }
    notFound()
    return null
  }
}
