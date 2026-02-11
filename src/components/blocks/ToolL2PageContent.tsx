import { getL2SeoContent, getAllSlugs, loadCommonTranslations, getSeoContent } from '@/lib/seo-loader'
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
import NanoBananaTool from '@/components/NanoBananaTool'
import TrustBar from '@/components/blocks/TrustBar'
import Intro from '@/components/blocks/Intro'
import Features from '@/components/blocks/Features'
import PerformanceMetrics from '@/components/blocks/PerformanceMetrics'
import HowToUse from '@/components/blocks/HowToUse'
import Comparison from '@/components/blocks/Comparison'
import Scenarios from '@/components/blocks/Scenarios'
import Rating from '@/components/blocks/Rating'
import FAQ from '@/components/blocks/FAQ'
import ViewAllToolsButton from '@/components/ViewAllToolsButton'
import ToolCard from '@/components/ToolCard'
import React from 'react'

interface ToolL2PageContentProps {
  locale: string
  tool: string
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

    // Load translations
    const t = await loadCommonTranslations(locale)
    const breadcrumbT = t?.breadcrumb || { home: 'Home', fontGenerator: 'Font Generator' }

    // 默认内容（如果没有提供，使用翻译内容）
    const getDefaultIntro = () => {
      if (tool === 'font-generator') {
        return {
          title: "Why Use Toolaze Font Generator?",
          desc: "A font generator is an online tool that transforms plain text into styled text using Unicode characters. It allows you to create beautiful, distinctive text styles without installing fonts or using design software."
        }
      }
      if (tool === 'image-compressor' || tool === 'image-compression') {
        return {
          title: "Why Use Toolaze Image Compressor?",
          desc: "Traditional image compressors are slow, limit file counts, and often compromise quality. Toolaze compresses up to 100 images simultaneously with precise size control, maintaining visual quality while dramatically reducing file sizes."
        }
      }
      if (tool === 'image-converter' || tool === 'image-conversion') {
        return {
          title: "Why Use Toolaze Image Converter?",
          desc: "Convert images between JPG, PNG, and WebP formats instantly. Our browser-based converter processes images locally, ensuring complete privacy and fast conversion."
        }
      }
      if (tool === 'emoji-copy-and-paste') {
        return {
          title: "Why Use Toolaze Emoji Copy & Paste?",
          desc: "Copy and paste emojis online for free. Browse by category, search by keyword, pick skin tone, and copy with one click. No sign-up required."
        }
      }
      return {
        title: `Why Use Toolaze ${tool}?`,
        desc: ""
      }
    }
    const defaultIntro = getDefaultIntro()
    const whyToolazeTitle = content.intro?.title || defaultIntro.title
    const whyToolazeDesc = content.intro?.content?.[0]?.text || defaultIntro.desc
    
    // 优先使用 JSON 中的 features 字段
    const whyToolazeFeatures = content.features?.items || []

    const howToUseSteps = content.howToUse?.steps || []

    const scenariosData = content.scenes || []

    const comparisonData = content.comparison ? {
      toolaze: content.comparison.toolazeFeatures || content.comparison.toolaze || "Unlimited text length, Multiple font styles, Instant preview, Real-time generation, 100% local processing, No uploads, Free forever",
      others: content.comparison.othersFeatures || content.comparison.others || "Character limits, Limited styles, Slow processing, Server uploads required, Cloud queues, Privacy concerns, Paid upgrades"
    } : null

    // 构建面包屑导航
    const pageTitle = content.hero?.h1 ? extractSimpleTitle(content.hero.h1) : 'Font Generator'
    const breadcrumbItems = tool === 'nano-banana-pro'
      ? [
          { label: breadcrumbT.home, href: '/' },
          { label: 'Model', href: '/model' },
          { label: 'Nano Banana Pro' },
        ]
      : [
          { label: breadcrumbT.home, href: locale === 'en' ? '/' : `/${locale}` },
          { label: pageTitle },
        ]

    // 获取推荐的其他功能（排除当前页面）
    const allSlugs = await getAllSlugs(tool, locale)
    // 生成链接的辅助函数（英语不使用 /en 前缀）
    const getToolHref = (toolSlug: string, slug: string): string => {
      if (locale === 'en') {
        return `/${toolSlug}/${slug}`
      }
      return `/${locale}/${toolSlug}/${slug}`
    }
    const recommendedTools = await Promise.all(allSlugs.slice(0, 3).map(async (s) => {
      const toolData = await getSeoContent(tool, s, locale)
      return {
        slug: s,
        title: toolData?.hero?.h1 ? extractSimpleTitle(toolData.hero.h1) : s,
        description: toolData?.hero?.desc || toolData?.metadata?.description || '',
        href: getToolHref(tool, s),
      }
    }))
    const filteredRecommendedTools = recommendedTools.filter(t => t.title && t.href)

    // 获取板块顺序配置（优先使用 JSON 中的 sectionsOrder，否则使用默认顺序）
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
    const sectionsOrder = content.sectionsOrder || defaultSectionsOrder

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

        <main className="min-h-screen bg-[#F8FAFF] overflow-x-hidden">
          {/* 1. Hero 板块 - 固定在最前面，不参与动态顺序 */}
          {tool === 'font-generator' ? (
            <FontGeneratorHero 
              h1={content.hero?.h1 || 'Font Generator'}
              desc={content.hero?.desc || 'Generate custom fonts online for free. Create beautiful text styles instantly.'}
            />
          ) : tool === 'image-compressor' || tool === 'image-compression' ? (
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
              <ImageCompressor />
              <TrustBar />
            </header>
          ) : tool === 'image-converter' || tool === 'image-conversion' ? (
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
              <ImageConverter />
              <TrustBar />
            </header>
          ) : tool === 'emoji-copy-and-paste' ? (
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
                <EmojiCategoryPage />
              </div>
              <TrustBar />
            </header>
          ) : tool === 'nano-banana-pro' ? (
            <header className="bg-[#F8FAFF] pb-6 md:pb-12 w-full px-2 md:px-6">
              <div className="w-full max-w-full text-center pt-6 md:pt-8 mb-6 md:mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>Nano Banana Pro</>
                  )}
                </h1>
                {content.hero?.desc && (
                  <p className="desc-text text-lg md:text-xl max-w-4xl mx-auto">
                    {content.hero.desc}
                  </p>
                )}
              </div>
              <div className="w-full max-w-full">
                {/* H5: 移除固定高度，让内容自然流式布局；桌面端保持固定高度 */}
                <div className="flex flex-col md:h-screen md:overflow-hidden">
                  <NanoBananaTool />
                </div>
              </div>
              <TrustBar />
            </header>
          ) : (
            <header className="bg-[#F8FAFF] pb-8 md:pb-12 px-6">
              <div className="max-w-4xl mx-auto text-center pt-6 md:pt-8 mb-6 md:mb-12">
                <h1 className="text-[40px] font-extrabold tracking-tight mb-3 md:mb-4 leading-tight text-slate-900">
                  {content.hero?.h1 ? (
                    renderH1WithGradient(content.hero.h1)
                  ) : (
                    <>{tool}</>
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

          {/* 9. Recommended Tools 板块 */}
          <section className="py-24 px-6 bg-[#F8FAFF]">
            <div className="max-w-6xl mx-auto">
              {filteredRecommendedTools.length > 0 && (
                <>
                  <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
                    {content.moreTools || 
                      (tool === 'font-generator' 
                        ? (t?.common?.fontGenerator?.moreTools || `More Font Generator Tools`)
                        : tool === 'image-compressor' || tool === 'image-compression'
                        ? 'More Image Compression Tools'
                        : tool === 'image-converter' || tool === 'image-conversion'
                        ? 'More Image Converter Tools'
                        : `More ${tool} Tools`)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {filteredRecommendedTools.map((tool, idx) => {
                      const iconBgColors: Array<'indigo' | 'purple' | 'blue'> = ['indigo', 'purple', 'blue']
                      const iconBgColor = iconBgColors[idx % 3] as 'indigo' | 'purple' | 'blue'
                      
                      return (
                        <ToolCard
                          key={tool.slug}
                          title={tool.title}
                          description={tool.description}
                          href={tool.href}
                          iconBgColor={iconBgColor}
                          tryNowText={t?.common?.tryNow || 'Try Now →'}
                        />
                      )
                    })}
                  </div>
                </>
              )}
              
              {/* View All Related Tools 入口 - 始终显示 */}
              <ViewAllToolsButton
                href={
                  tool === 'nano-banana-pro' 
                    ? '/model' 
                    : locale === 'en' 
                      ? `/${tool}/all-tools` 
                      : `/${locale}/${tool}/all-tools`
                }
                text={t?.common?.viewAllTools?.related || 'View All Related Tools'}
                variant="related"
              />
            </div>
          </section>
        </main>

        <Footer />
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
