import { getSeoContent, getAllSlugs, loadCommonTranslations, getL2SeoContent, VIDEO_MODEL_L2S, IMAGE_MODEL_L2S } from '@/lib/seo-loader'
import { localizeLinksInObject } from '@/lib/localize-links'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ImageCompressor from '@/components/ImageCompressor'
import ImageConverter from '@/components/ImageConverter'
import WatermarkRemover from '@/components/WatermarkRemover'
import FontGeneratorHero from '@/components/blocks/FontGeneratorHero'
import Intro from '@/components/blocks/Intro'
import Features from '@/components/blocks/Features'
import PerformanceMetrics from '@/components/blocks/PerformanceMetrics'
import HowToUse from '@/components/blocks/HowToUse'
import Comparison from '@/components/blocks/Comparison'
import ModelIntroBlock from '@/components/blocks/ModelIntroBlock'
import Scenarios from '@/components/blocks/Scenarios'
import Rating from '@/components/blocks/Rating'
import FAQ from '@/components/blocks/FAQ'
import ViewAllToolsButton from '@/components/ViewAllToolsButton'
import ToolCard from '@/components/ToolCard'
import EmojiCategoryPage from '@/components/EmojiCategoryPage'
import SeedanceHeroPlaceholder from '@/components/blocks/SeedanceHeroPlaceholder'
import React from 'react'

interface ToolSlugPageContentProps {
  locale: string
  tool: string
  slug: string
}

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
    { pattern: /\d+\s*(KB|MB|kb|mb)/gi, name: 'size' },
    { pattern: /\b(HEIC|HEIF|JPG|JPEG|PNG|WebP|BMP|GIF|Image|Images)\b/gi, name: 'format' },
    { pattern: /\b(Compressor|Compression|Tool|Converter|Optimizer|Reducer)\b/gi, name: 'tool' },
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

export default async function ToolSlugPageContent({ locale, tool, slug }: ToolSlugPageContentProps) {
  try {
    if (!tool || !slug) {
      notFound()
      return null
    }
    
    let content = await getSeoContent(tool, slug, locale)

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

    // Load translations
    const t = await loadCommonTranslations(locale)
    const isConverter = tool === 'image-converter' || tool === 'image-conversion'
    const isFontGenerator = tool === 'font-generator'
    const isEmoji = tool === 'emoji-copy-and-paste'
    const isSeedance = tool === 'seedance-2'
    const isWatermarkRemover = tool === 'watermark-remover'
    const toolTranslations = isConverter ? t?.imageConverter : (isFontGenerator ? null : isEmoji ? null : t?.imageCompressor)
    const breadcrumbT = t?.breadcrumb || { 
      home: 'Home', 
      imageCompression: 'Image Compression', 
      imageConverter: 'Image Converter',
      fontGenerator: 'Font Generator',
      emojiCopyAndPaste: 'Emoji Copy & Paste'
    }

    // 默认内容（如果没有提供，使用翻译内容）
    // 优先使用 JSON 中的 intro.title 和 intro.content
    const whyToolazeTitle = content.intro?.title || toolTranslations?.whyToolaze?.title || (isConverter 
      ? "Convert Images Without Quality Loss"
      : "Stop Losing Time on Slow Image Compression Tools")
    const whyToolazeDesc = content.intro?.content || toolTranslations?.whyToolaze?.desc || (isConverter
      ? "Convert images between JPG, PNG, and WebP formats instantly. Our browser-based converter processes images locally, ensuring complete privacy and fast conversion. Perfect for web developers, designers, and content creators."
      : "Traditional image compressors are slow, limit file counts, and often compromise quality. Toolaze compresses images with precise size control, maintaining visual quality while dramatically reducing file sizes.")
    // 优先使用 JSON 中的 specs 字段，转换为特性卡片格式（支持 6 个特性点）
    // 从 specs 转换；最后使用默认特性
    const whyToolazeFeatures = (content.specs ? [
      { icon: '⚡', title: 'Fast Conversion', desc: content.specs.engine },
      { icon: '📦', title: 'Batch Processing', desc: content.specs.limit },
      { icon: '🔒', title: 'Private & Secure', desc: content.specs.privacy },
      ...(content.specs.logic ? [{ icon: '🎯', title: 'Quality Preservation', desc: content.specs.logic }] : []),
      // 添加更多通用特性点，确保有 6 个特性
      { icon: '🌐', title: 'Browser-Based', desc: 'No software installation required. Works directly in your browser.' },
      { icon: '💎', title: '100% Free', desc: 'Completely free. No ads, no hidden costs.' }
    ].slice(0, 6) : (isConverter
      ? [
          { icon: '📂', title: toolTranslations?.features?.batch?.title || 'Batch Processing', desc: toolTranslations?.features?.batch?.desc || 'Convert up to 100 images at once' },
          { icon: '🎯', title: toolTranslations?.features?.formats?.title || 'Multiple Formats', desc: toolTranslations?.features?.formats?.desc || 'JPG, PNG, WebP, and HEIC support' },
          { icon: '💎', title: toolTranslations?.features?.free?.title || '100% Free', desc: toolTranslations?.features?.free?.desc || 'No ads forever.' }
        ]
      : [
          { icon: '📂', title: toolTranslations?.features?.batch?.title || 'Batch Processing', desc: toolTranslations?.features?.batch?.desc || 'Compress up to 100 images at once' },
          { icon: '🎯', title: toolTranslations?.features?.precise?.title || 'Precise Size Control', desc: toolTranslations?.features?.precise?.desc || 'Set exact target size in KB or MB' },
          { icon: '💎', title: toolTranslations?.features?.free?.title || '100% Free', desc: toolTranslations?.features?.free?.desc || 'No ads forever.' }
        ]))

    // 根据工具类型设置不同的默认步骤（使用翻译）
    const defaultUploadDesc = isConverter 
      ? (toolTranslations?.howToUse?.step1?.desc || 'Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, BMP, and HEIC formats.')
      : (toolTranslations?.howToUse?.step1?.desc || 'Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, and BMP formats.')
    const defaultSecondStep = isConverter
      ? { title: toolTranslations?.howToUse?.step2?.title || 'Choose Format', desc: toolTranslations?.howToUse?.step2?.desc || 'Select your target format: JPG, PNG, or WebP. Our converter maintains quality during conversion.' }
      : { title: toolTranslations?.howToUse?.step2?.title || 'Set Target Size', desc: toolTranslations?.howToUse?.step2?.desc || 'Choose your desired file size in KB or MB. Our algorithm compresses images precisely to your target.' }
    const defaultDownloadDesc = isConverter
      ? (toolTranslations?.howToUse?.step3?.desc || 'Download individual converted images or all at once as a ZIP file. Fast and efficient.')
      : (toolTranslations?.howToUse?.step3?.desc || 'Download individual compressed images or all at once as a ZIP file. Fast and efficient.')
    
    const howToUseSteps = content.howToUse?.steps || [
      { title: toolTranslations?.howToUse?.step1?.title || 'Upload Images', desc: defaultUploadDesc },
      defaultSecondStep,
      { title: toolTranslations?.howToUse?.step3?.title || 'Download Results', desc: defaultDownloadDesc }
    ]

    const scenariosData = content.scenes || (isConverter
      ? [
          { icon: '💻', title: toolTranslations?.scenarios?.developers?.title || 'For Web Developers', description: toolTranslations?.scenarios?.developers?.desc || 'Convert images to WebP for better performance. Optimize formats for faster page loads and improved SEO.' },
          { icon: '🎨', title: toolTranslations?.scenarios?.designers?.title || 'For Designers', description: toolTranslations?.scenarios?.designers?.desc || 'Convert between formats for different design needs. Preserve transparency with PNG or optimize with JPG.' },
          { icon: '📱', title: toolTranslations?.scenarios?.creators?.title || 'For Content Creators', description: toolTranslations?.scenarios?.creators?.desc || 'Batch convert images for social media and blogs. Ensure compatibility across all platforms.' }
        ]
      : [
          { icon: '💻', title: toolTranslations?.scenarios?.developers?.title || 'For Web Developers', description: toolTranslations?.scenarios?.developers?.desc || 'Optimize images for websites and apps. Reduce load times while maintaining quality for better SEO and user experience.' },
          { icon: '🛒', title: toolTranslations?.scenarios?.ecommerce?.title || 'For E-commerce', description: toolTranslations?.scenarios?.ecommerce?.desc || 'Compress product images in bulk. Faster page loads mean better conversion rates and improved search rankings.' },
          { icon: '📱', title: toolTranslations?.scenarios?.creators?.title || 'For Content Creators', description: toolTranslations?.scenarios?.creators?.desc || 'Prepare images for social media and blogs. Batch process multiple images quickly without quality loss.' }
        ])

    const comparisonData = content.comparison ? {
      // 优先使用 toolazeFeatures 和 othersFeatures（新格式）
      // 如果没有，则使用 toolaze 和 others（旧格式）
      toolaze: content.comparison.toolazeFeatures || content.comparison.toolaze || (isConverter
        ? [
            toolTranslations?.comparison?.features?.batch100 || 'Batch up to 100 images',
            toolTranslations?.comparison?.features?.multipleFormat || 'Multiple format support',
            toolTranslations?.comparison?.features?.qualityPreserved || 'Quality preserved',
            toolTranslations?.comparison?.features?.privateFree || '100% private & free',
            toolTranslations?.comparison?.features?.noSignup || 'No sign-up required'
          ].filter(Boolean).join(', ')
        : [
            toolTranslations?.comparison?.features?.batch100 || 'Batch up to 100 images',
            toolTranslations?.comparison?.features?.preciseControl || 'Precise size control',
            toolTranslations?.comparison?.features?.multipleFormat || 'Multiple format support',
            toolTranslations?.comparison?.features?.privateFree || '100% private & free',
            toolTranslations?.comparison?.features?.noSignup || 'No sign-up required'
          ].filter(Boolean).join(', ')),
      others: content.comparison.othersFeatures || content.comparison.others || [
          toolTranslations?.comparison?.features?.limitedBatch || 'Limited batch size',
          toolTranslations?.comparison?.features?.noPreciseControl || 'No precise control',
          toolTranslations?.comparison?.features?.formatRestrictions || 'Format restrictions',
          toolTranslations?.comparison?.features?.privacyConcerns || 'Privacy concerns',
          toolTranslations?.comparison?.features?.registrationRequired || 'Registration required'
        ].filter(Boolean).join(', ')
    } : null

    // 构建面包屑导航
    let toolLabel: string
    if (isConverter) {
      toolLabel = breadcrumbT.imageConverter
    } else if (isFontGenerator) {
      toolLabel = breadcrumbT.fontGenerator
    } else if (isEmoji) {
      toolLabel = breadcrumbT.emojiCopyAndPaste
    } else if (isSeedance) {
      toolLabel = 'Seedance 2.0'
    } else if (isWatermarkRemover) {
      toolLabel = breadcrumbT.watermarkRemover || 'Watermark Remover'
    } else {
      toolLabel = breadcrumbT.imageCompression
    }
    const pageTitle = content.hero?.h1 ? extractSimpleTitle(content.hero.h1) : (toolTranslations?.title || 'Page')
    const breadcrumbItems = [
      { label: breadcrumbT.home, href: locale === 'en' ? '/' : `/${locale}` },
      { label: toolLabel, href: `/${locale === 'en' ? '' : locale + '/'}${tool}` },
      { label: pageTitle },
    ]

    // 获取推荐的其他功能
    // 视频/图片模型 L3 页：仅推荐同类型其他 L2 模型，无则不显示板块
    // 其他工具 L3 页：推荐同工具下其他 L3 子页
    const getModelL2Href = (modelTool: string): string => {
      if (modelTool === 'nano-banana-pro') return locale === 'en' ? '/model/nano-banana-pro' : `/${locale}/model/nano-banana-pro`
      return locale === 'en' ? `/${modelTool}` : `/${locale}/${modelTool}`
    }
    let filteredRecommendedTools: Array<{ slug: string; title: string; description: string; href: string }> = []
    if (isSeedance) {
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
    } else if (tool === 'nano-banana-pro') {
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
    } else {
      const allSlugs = await getAllSlugs(tool, locale)
      const otherSlugs = allSlugs.filter((s) => s !== slug).slice(0, 3)
      const getToolHref = (toolSlug: string, s: string): string =>
        locale === 'en' ? `/${toolSlug}/${s}` : `/${locale}/${toolSlug}/${s}`
      const recommendedTools = await Promise.all(
        otherSlugs.map(async (s) => {
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
    // AI Video (seedance-2) 不显示对比板块
    const defaultSectionsOrder = [
      'howToUse',
      'intro',
      'performanceMetrics',
      'comparison',
      'scenes',
      'rating',
      'faq'
    ]
    let sectionsOrder = content.sectionsOrder || defaultSectionsOrder
    if (isSeedance) {
      sectionsOrder = sectionsOrder.filter((s: string) => s !== 'comparison')
    }

    // 生成 JSON-LD HowTo Schema
    const howToTitle = content.howToUse?.title || `How to ${content.hero?.h1 ? extractSimpleTitle(content.hero.h1) : 'Use Tool'}`
    const howToSteps = content.howToUse?.steps || howToUseSteps
    const jsonLdSchema = generateHowToSchema(howToTitle, howToSteps)

    return (
      <>
        {/* JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        
        <Navigation />
        
        <Breadcrumb items={breadcrumbItems} />

        <main className="min-h-screen bg-[#F8FAFF]">
          {/* 1. Hero 板块 - 固定在最前面，不参与动态顺序 */}
          {tool === 'font-generator' ? (
            <FontGeneratorHero 
              h1={content.hero?.h1 || 'Font Generator'}
              desc={content.hero?.desc || 'Generate custom fonts online for free. Create beautiful text styles instantly.'}
            />
          ) : isEmoji ? (
            <header className="bg-[#F8FAFF] pb-8 md:pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-6 md:pt-8 mb-6 md:mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-3 md:mb-4 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Emoji Copy & Paste</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <div className="max-w-6xl mx-auto">
                <EmojiCategoryPage />
              </div>
            </header>
          ) : isSeedance ? (
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
              <SeedanceHeroPlaceholder />
            </header>
          ) : (
            <header className="bg-[#F8FAFF] pb-8 md:pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-6 md:pt-8 mb-6 md:mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-3 md:mb-4 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>{toolTranslations?.title || (isConverter ? 'Image Converter' : isWatermarkRemover ? 'Watermark Remover' : 'Image Compressor')}</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {content.hero.desc}
                  </p>
                )}
                {!content.hero?.desc && (
                  <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {isConverter
                      ? (() => {
                          // 根据 slug 生成默认描述
                          if (slug.includes('heic-to-jpg')) {
                            return 'Convert HEIC to JPG online for free. Simply drop your HEIC images below to convert them to JPG in seconds.'
                          } else if (slug.includes('heic-to-png')) {
                            return 'Convert HEIC to PNG online for free. Simply drop your HEIC images below to convert them to PNG in seconds.'
                          } else if (slug.includes('png-to-jpg')) {
                            return 'Convert PNG to JPG online for free. Simply drop your PNG images below to convert them to JPG in seconds.'
                          } else if (slug.includes('jpg-to-png')) {
                            return 'Convert JPG to PNG online for free. Simply drop your JPG images below to convert them to PNG in seconds.'
                          } else if (slug.includes('webp-to-jpg')) {
                            return 'Convert WebP to JPG online for free. Simply drop your WebP images below to convert them to JPG in seconds.'
                          } else if (slug.includes('webp-to-png')) {
                            return 'Convert WebP to PNG online for free. Simply drop your WebP images below to convert them to PNG in seconds.'
                          } else if (slug.includes('png-to-webp')) {
                            return 'Convert PNG to WebP online for free. Simply drop your PNG images below to convert them to WebP in seconds.'
                          } else if (slug.includes('jpg-to-webp')) {
                            return 'Convert JPG to WebP online for free. Simply drop your JPG images below to convert them to WebP in seconds.'
                          }
                          return 'Convert images online for free. Simply drop your images below to convert them in seconds.'
                        })()
                      : 'Compress images online for free. Simply drop your images below to compress them in seconds.'}
                  </p>
                )}
              </div>
              {tool === 'image-converter' || tool === 'image-conversion' ? (
                <ImageConverter initialFormat={slug} />
              ) : isWatermarkRemover ? (
                <WatermarkRemover />
              ) : (
                <ImageCompressor initialTarget={slug} />
              )}
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
                // 优先使用独立的 features 字段
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
              howToUse: (bgClass: string) => (
                <HowToUse
                  key="howToUse"
                  title={content.howToUse?.title || toolTranslations?.howToUse?.title}
                  steps={howToUseSteps}
                  bgClass={bgClass}
                />
              ),
              comparison: (bgClass: string) => {
                // 对于 font-generator，从 content.comparison 中读取标题和标签
                const comparisonTitle = content.comparison?.title || toolTranslations?.comparison?.title
                return (
                  <Comparison
                    key="comparison"
                    compare={comparisonData ?? undefined}
                    title={comparisonTitle}
                    labels={{
                      smartChoice: content.comparison?.smartChoice || toolTranslations?.comparison?.smartChoice,
                      toolaze: content.comparison?.toolaze || toolTranslations?.comparison?.toolaze,
                      vs: content.comparison?.vs || toolTranslations?.comparison?.vs,
                      otherTools: content.comparison?.otherTools || content.comparison?.others || toolTranslations?.comparison?.otherTools,
                    }}
                    bgClass={bgClass}
                  />
                )
              },
              scenes: (bgClass: string) => {
                // 对于 font-generator，从 content.scenesTitle 中读取标题
                const scenesTitle = content.scenesTitle || toolTranslations?.scenarios?.title
                return (
                  <Scenarios
                    key="scenes"
                    title={scenesTitle}
                    scenarios={scenariosData}
                    bgClass={bgClass}
                  />
                )
              },
              rating: (bgClass: string) => (
                <Rating
                  key="rating"
                  title={content.rating?.title || t?.common?.rating?.title}
                  rating={content.rating?.rating || t?.common?.rating?.rating}
                  description={content.rating?.text || content.rating?.description || t?.common?.rating?.description || ''}
                  bgClass={bgClass}
                />
              ),
              faq: (bgClass: string) => {
                // 对于 font-generator，从 content.faqTitle 中读取标题
                const faqTitle = content.faqTitle || toolTranslations?.faq?.title
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

          {/* 9. Recommended Tools 板块（模型 L3 页无其他 L2 时不显示） */}
          {filteredRecommendedTools.length > 0 && (
            <section className="py-24 px-6 bg-[#F8FAFF]">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
                  {content.moreTools ||
                    (isConverter
                      ? (t?.imageConverter?.moreTools || t?.common?.imageConverter?.moreTools || 'More Image Converter Tools')
                      : isEmoji
                        ? (t?.common?.emojiCopyAndPaste?.moreTools || 'More Emoji Copy & Paste')
                        : isFontGenerator
                          ? (t?.common?.fontGenerator?.moreTools || 'More Font Generator Tools')
                          : isSeedance
                            ? (t?.common?.seedance2?.moreTools || 'More Seedance 2.0 Tools')
                            : (t?.imageCompressor?.moreTools || t?.common?.imageCompressor?.moreTools || 'More Image Compression Tools'))}
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
                <ViewAllToolsButton
                  href={isWatermarkRemover ? `/${tool}` : (locale === 'en' ? `/${tool}/all-tools` : `/${locale}/${tool}/all-tools`)}
                  text={t?.common?.viewAllTools?.related || 'View All Related Tools'}
                  variant="related"
                />
              </div>
            </section>
          )}
        </main>

        <Footer />
      </>
    )
  } catch (error) {
    console.error(`Error rendering page for ${tool}/${slug} (${locale}):`, error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        tool,
        slug,
        locale
      })
    }
    notFound()
    return null
  }
}
