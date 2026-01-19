import { getSeoContent, getAllSlugs, loadCommonTranslations } from '@/lib/seo-loader'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ImageCompressor from '@/components/ImageCompressor'
import ImageConverter from '@/components/ImageConverter'
import Rating from '@/components/blocks/Rating'
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

// 智能识别核心关键词并应用渐变
function renderH1WithGradient(h1: string): React.ReactElement {
  if (h1.includes('<span')) {
    return <span dangerouslySetInnerHTML={{ __html: h1 }} />
  }

  const keywordPatterns = [
    { pattern: /\d+\s*(KB|MB|kb|mb)/gi, name: 'size' },
    { pattern: /\b(JPG|JPEG|PNG|WebP|BMP|GIF|Image|Images)\b/gi, name: 'format' },
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

export default async function ToolSlugPageContent({ locale, tool, slug }: ToolSlugPageContentProps) {
  try {
    if (!tool || !slug) {
      notFound()
      return null
    }
    
    const content = await getSeoContent(tool, slug, locale)

    if (!content) {
      notFound()
      return null
    }
    
    if (!content.metadata || !content.hero) {
      notFound()
      return null
    }

    // Load translations
    const t = await loadCommonTranslations(locale)
    const isConverter = tool === 'image-converter' || tool === 'image-conversion'
    const toolTranslations = isConverter ? t?.imageConverter : t?.imageCompressor
    const breadcrumbT = t?.breadcrumb || { home: 'Home', imageCompression: 'Image Compression', imageConverter: 'Image Converter' }

    // 默认内容（如果没有提供，使用翻译内容）
    const whyToolazeTitle = content.sections?.whyToolaze?.title || toolTranslations?.whyToolaze?.title || (isConverter 
      ? "Convert Images Without Quality Loss"
      : "Stop Losing Time on Slow Image Compression Tools")
    const whyToolazeDesc = content.intro?.content || content.sections?.whyToolaze?.description || toolTranslations?.whyToolaze?.desc || (isConverter
      ? "Convert images between JPG, PNG, and WebP formats instantly. Our browser-based converter processes images locally, ensuring complete privacy and fast conversion. Perfect for web developers, designers, and content creators."
      : "Traditional image compressors are slow, limit file counts, and often compromise quality. Toolaze compresses images with precise size control, maintaining visual quality while dramatically reducing file sizes.")
    const whyToolazeFeatures = content.sections?.whyToolaze?.features || (isConverter
      ? [
          { icon: '📂', title: toolTranslations?.features?.batch?.title || 'Batch Processing', desc: toolTranslations?.features?.batch?.desc || 'Convert up to 100 images at once' },
          { icon: '🎯', title: toolTranslations?.features?.formats?.title || 'Multiple Formats', desc: toolTranslations?.features?.formats?.desc || 'JPG, PNG, WebP, and HEIC support' },
          { icon: '💎', title: toolTranslations?.features?.free?.title || '100% Free', desc: toolTranslations?.features?.free?.desc || 'No ads forever.' }
        ]
      : [
          { icon: '📂', title: toolTranslations?.features?.batch?.title || 'Batch Processing', desc: toolTranslations?.features?.batch?.desc || 'Compress up to 100 images at once' },
          { icon: '🎯', title: toolTranslations?.features?.precise?.title || 'Precise Size Control', desc: toolTranslations?.features?.precise?.desc || 'Set exact target size in KB or MB' },
          { icon: '💎', title: toolTranslations?.features?.free?.title || '100% Free', desc: toolTranslations?.features?.free?.desc || 'No ads forever.' }
        ])

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
    
    const howToUseSteps = content.sections?.howToUse?.steps || [
      { title: toolTranslations?.howToUse?.step1?.title || 'Upload Images', desc: defaultUploadDesc },
      defaultSecondStep,
      { title: toolTranslations?.howToUse?.step3?.title || 'Download Results', desc: defaultDownloadDesc }
    ]

    const scenariosData = content.scenes || content.sections?.scenarios || (isConverter
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

    const comparisonData = content.sections?.comparison || content.compare ? {
      toolaze: content.compare?.toolaze || content.sections?.comparison?.toolaze || (isConverter
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
      others: content.compare?.others || content.sections?.comparison?.others || [
        toolTranslations?.comparison?.features?.limitedBatch || 'Limited batch size',
        toolTranslations?.comparison?.features?.noPreciseControl || 'No precise control',
        toolTranslations?.comparison?.features?.formatRestrictions || 'Format restrictions',
        toolTranslations?.comparison?.features?.privacyConcerns || 'Privacy concerns',
        toolTranslations?.comparison?.features?.registrationRequired || 'Registration required'
      ].filter(Boolean).join(', ')
    } : null

    // 构建面包屑导航
    const toolLabel = isConverter ? breadcrumbT.imageConverter : breadcrumbT.imageCompression
    const pageTitle = content.hero?.h1 ? extractPageTitle(content.hero.h1) : (toolTranslations?.title || 'Page')
    const breadcrumbItems = [
      { label: breadcrumbT.home, href: locale === 'en' ? '/' : `/${locale}` },
      { label: toolLabel, href: `/${locale === 'en' ? '' : locale + '/'}${tool}` },
      { label: pageTitle },
    ]

    // 获取推荐的其他功能（排除当前页面）
    const allSlugs = await getAllSlugs(tool, locale)
    const otherSlugs = allSlugs.filter(s => s !== slug).slice(0, 3)
    const recommendedTools = await Promise.all(otherSlugs.map(async (s) => {
      const toolData = await getSeoContent(tool, s, locale)
      return {
        slug: s,
        title: toolData?.hero?.h1 ? extractPageTitle(toolData.hero.h1) : s,
        description: toolData?.hero?.desc || toolData?.hero?.sub || toolData?.metadata?.description || '',
        href: `/${locale}/${tool}/${s}`,
      }
    }))
    const filteredRecommendedTools = recommendedTools.filter(t => t.title && t.href)

    return (
      <>
        <Navigation />
        
        <Breadcrumb items={breadcrumbItems} />

        <main className="min-h-screen bg-[#F8FAFF]">
          {/* 1. Hero 板块 - 包含标题、描述、工具卡片和信任条 */}
          <header className="bg-[#F8FAFF] pb-12 px-6">
            <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                {content.hero?.h1 ? (
                  renderH1WithGradient(content.hero.h1)
                ) : (
                  <>Free <span className="text-gradient">{isConverter ? 'Image Converter' : 'Image Compressor'}</span></>
                )}
              </h1>
              <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
                {content.hero?.sub && content.hero?.desc ? (
                  <>
                    {content.hero.sub}. {content.hero.desc}
                  </>
                ) : (
                  content.hero?.desc || content.hero?.sub || (isConverter
                    ? 'Convert images between JPG, PNG, and WebP formats. Batch convert up to 100 images. Fast, private, 100% free. No sign-up required.'
                    : 'Batch compress up to 100 images at once. Set exact target size. Fast, private, 100% free. No sign-up required.')
                )}
              </p>
            </div>
            {tool === 'image-converter' || tool === 'image-conversion' ? (
              <ImageConverter initialFormat={slug} />
            ) : (
              <ImageCompressor initialTarget={slug} />
            )}
          </header>

          {/* 2. Why Toolaze 板块 */}
          <section className="bg-white py-24 px-6 border-t border-indigo-50/50">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-6">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">{toolTranslations?.whyToolaze?.badge || 'Why Toolaze?'}</span>
                <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">{whyToolazeTitle}</h2>
                <p className="desc-text text-lg">{whyToolazeDesc}</p>
              </div>
              <div className="grid gap-4">
                {whyToolazeFeatures.map((feature: any, idx: number) => (
                  <div key={idx} className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                      idx === 0 ? 'bg-indigo-100' : idx === 1 ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {typeof feature === 'object' ? feature.icon || '📂' : '📂'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {typeof feature === 'object' ? feature.title : feature}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {typeof feature === 'object' ? feature.desc : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. How To Use 板块 */}
          <section className="py-24 px-6 bg-[#F8FAFF]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-20">
                {toolTranslations?.howToUse?.title ? (
                  toolTranslations.howToUse.title.includes('Toolaze') ? (
                    <>
                      {toolTranslations.howToUse.title.split('Toolaze')[0]}<span className="text-indigo-600">Toolaze</span>{toolTranslations.howToUse.title.split('Toolaze')[1]}
                    </>
                  ) : (
                    toolTranslations.howToUse.title
                  )
                ) : (
                  <>How to Use <span className="text-indigo-600">Toolaze</span>?</>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                {howToUseSteps.map((step: any, idx: number) => (
                  <div key={idx} className="group">
                    <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {typeof step === 'object' ? step.title : step}
                    </h3>
                    <p className="desc-text max-w-[240px] mx-auto">
                      {typeof step === 'object' ? step.desc : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Performance Metrics 板块 */}
          {content.sections?.performanceMetrics && (
            <section className="py-24 px-6 bg-white">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
                  {content.sections.performanceMetrics.title || 'Performance Metrics'}
                </h2>
                <div className="bg-[#F8FAFF] rounded-3xl border border-indigo-50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-indigo-50 border-b border-indigo-100">
                          <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Performance Metric</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 uppercase tracking-wider">Toolaze Specification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-indigo-50">
                        {content.sections.performanceMetrics.metrics?.map((metric: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-slate-700 whitespace-nowrap">
                              {metric.label}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {metric.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. Comparison 板块 */}
          {comparisonData && (
            <section className="py-24 px-6 bg-[#F8FAFF] relative overflow-hidden">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 relative order-1">
                  <div className="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">{toolTranslations?.comparison?.smartChoice || 'Smart Choice'}</div>
                    <h3 className="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">{toolTranslations?.comparison?.toolaze || 'Toolaze 💎'}</h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      {comparisonData.toolaze.split(', ').map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">✅</span>
                          <span>{item.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200 text-2xl">{toolTranslations?.comparison?.vs || 'VS'}</div>
                <div className="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
                  <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">{toolTranslations?.comparison?.otherTools || 'Other Tools'}</h3>
                  <ul className="space-y-3 text-sm text-slate-500">
                    {comparisonData.others.split(', ').map((item: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-red-500 font-bold">❌</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* 6. Scenarios 板块 */}
          {scenariosData && scenariosData.length > 0 && (
            <section className="py-24 px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">{toolTranslations?.scenarios?.title || 'Use Cases'}</h2>
                <div className={`grid grid-cols-1 gap-6 ${
                  scenariosData.length === 2 
                    ? 'md:grid-cols-2 md:max-w-4xl md:mx-auto md:justify-center' 
                    : 'md:grid-cols-3'
                }`}>
                {scenariosData.map((scenario: any, idx: number) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl border border-indigo-50 shadow-sm">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${
                      idx === 0 ? 'bg-indigo-100' : idx === 1 ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {scenario.icon || '💻'}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {scenario.title || scenario.title}
                    </h3>
                    <p className="desc-text">
                      {scenario.description || scenario.desc || ''}
                    </p>
                  </div>
                ))}
                </div>
              </div>
            </section>
          )}

          {/* 7. FAQ 板块 */}
          {content.faq && Array.isArray(content.faq) && content.faq.length > 0 && (
            <section className="py-24 px-6 bg-[#F8FAFF]">
              <div className="max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">{toolTranslations?.faq?.title || 'Frequently Asked Questions'}</h2>
                {content.faq.map((item: any, idx: number) => (
                  <details key={idx} className="bg-[#F8FAFF] rounded-2xl p-6 border border-indigo-50">
                    <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
                      {item.q || item.question}
                      <span className="text-indigo-600 text-xl">+</span>
                    </summary>
                    <p className="desc-text mt-4">{item.a || item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 8. Recommended Tools 板块 */}
          {filteredRecommendedTools.length > 0 && (
            <section className="py-24 px-6 bg-white">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">
                  {isConverter 
                    ? (t?.imageConverter?.moreTools || `More Image Converter Tools`)
                    : (t?.imageCompressor?.moreTools || `More Image Compression Tools`)
                  }
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredRecommendedTools.map((tool, idx) => (
                    <Link
                      key={tool.slug}
                      href={tool.href}
                      className="bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${
                        idx === 0 ? 'bg-indigo-100' : idx === 1 ? 'bg-purple-100' : 'bg-blue-100'
                      }`}>
                        🖼️
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="desc-text text-sm line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="mt-4 text-sm font-bold text-indigo-600 group-hover:text-purple-600 transition-colors">
                        {t?.common?.tryNow || 'Try Now →'}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 9. Rating 板块 */}
          <Rating 
            rating={t?.common?.rating?.rating}
            description={content.rating?.text || t?.common?.rating?.description}
          />
        </main>

        <Footer />
      </>
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error rendering page:', error)
    }
    notFound()
    return null
  }
}
