import { getSeoContent, getAllSlugs } from '@/lib/seo-loader'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ImageCompressor from '@/components/ImageCompressor'
import ImageConverter from '@/components/ImageConverter'
import Rating from '@/components/blocks/Rating'
import type { Metadata } from 'next'
import React from 'react'

interface PageProps {
  params: Promise<{
    tool: string
    slug: string
  }>
}

// 1. 自动生成 SEO 标签 (Metadata)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const content = getSeoContent(resolvedParams.tool, resolvedParams.slug)
    
    if (!content) {
      return {
        title: 'Tool Not Found | Toolaze',
      }
    }
    
    return {
      title: content.metadata.title,
      description: content.metadata.description,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Tool Not Found | Toolaze',
    }
  }
}

// 2. 告诉 Next.js 在打包时生成哪些静态页面 (SSG)
export async function generateStaticParams() {
  const compressorSlugs = getAllSlugs('image-compressor')
  const converterSlugs = getAllSlugs('image-converter')
  
  const params = []
  
  // 添加图片压缩工具的页面
  for (const slug of compressorSlugs) {
    params.push({
      tool: 'image-compressor',
      slug: slug,
    })
  }
  
  // 添加图片转换工具的页面
  for (const slug of converterSlugs) {
    params.push({
      tool: 'image-converter',
      slug: slug,
    })
  }
  
  return params
}

// 格式化 tool 名称为显示名称
function formatToolName(tool: string): string {
  // 将横线分隔的单词转换为首字母大写的空格分隔形式
  return tool
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 从 hero.h1 中提取页面标题（用于面包屑）
function extractPageTitle(h1: string): string {
  // 移除 HTML 标签
  let cleanH1 = h1.replace(/<[^>]*>/g, '')
  
  // 移除常见前缀动词
  cleanH1 = cleanH1.replace(/^(Compress|Free|Convert|Optimize|Reduce)\s+/i, '')
  
  // 移除末尾的 "Compression"、"Tool" 等词
  cleanH1 = cleanH1.replace(/\s+(Compression|Tool|Compressor|Converter|Optimizer)$/i, '')
  
  return cleanH1.trim() || h1.replace(/<[^>]*>/g, '')
}

// 智能识别核心关键词并应用渐变
function renderH1WithGradient(h1: string): React.ReactElement {
  // 如果包含 HTML 标签，直接渲染
  if (h1.includes('<span')) {
    return <span dangerouslySetInnerHTML={{ __html: h1 }} />
  }

  // 定义核心关键词模式（使用全局匹配，但需要重置 lastIndex）
  const keywordPatterns = [
    { pattern: /\d+\s*(KB|MB|kb|mb)/gi, name: 'size' },
    { pattern: /\b(JPG|JPEG|PNG|WebP|BMP|GIF|Image|Images)\b/gi, name: 'format' },
    { pattern: /\b(Compressor|Compression|Tool|Converter|Optimizer|Reducer)\b/gi, name: 'tool' },
  ]

  const parts = h1.split(/(\s+)/) // 保留空格
  const result: React.ReactNode[] = []

  parts.forEach((part, index) => {
    // 保留空格
    if (/^\s+$/.test(part)) {
      result.push(part)
      return
    }

    // 检查是否是核心关键词
    let isKeyword = false
    for (const { pattern } of keywordPatterns) {
      pattern.lastIndex = 0 // 重置正则表达式状态
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

// 3. 页面渲染逻辑
export default async function LandingPage({ params }: PageProps) {
  try {
    const resolvedParams = await params
    
    if (!resolvedParams.tool || !resolvedParams.slug) {
      console.error('Missing params:', resolvedParams)
      notFound()
      return null
    }
    
    const content = getSeoContent(resolvedParams.tool, resolvedParams.slug)

    if (!content) {
      console.error('Content not found for:', resolvedParams.tool, resolvedParams.slug)
      notFound()
      return null
    }
    
    // Validate required content fields
    if (!content.metadata || !content.hero) {
      console.error('Invalid content structure:', Object.keys(content))
      notFound()
      return null
    }

    // 根据工具类型判断
    const isConverter = resolvedParams.tool === 'image-converter' || resolvedParams.tool === 'image-conversion'
    
    // 默认内容（如果没有提供，使用通用内容）
    const whyToolazeTitle = content.sections?.whyToolaze?.title || (isConverter 
      ? "Convert Images Without Quality Loss"
      : "Stop Losing Time on Slow Image Compression Tools")
    const whyToolazeDesc = content.intro?.content || content.sections?.whyToolaze?.description || (isConverter
      ? "Convert images between JPG, PNG, and WebP formats instantly. Our browser-based converter processes images locally, ensuring complete privacy and fast conversion. Perfect for web developers, designers, and content creators."
      : "Traditional image compressors are slow, limit file counts, and often compromise quality. Toolaze compresses images with precise size control, maintaining visual quality while dramatically reducing file sizes.")
    const whyToolazeFeatures = content.sections?.whyToolaze?.features || (isConverter
      ? [
          { icon: '📂', title: 'Batch Processing', desc: 'Convert up to 100 images at once' },
          { icon: '🎯', title: 'Multiple Formats', desc: 'JPG, PNG, WebP, and HEIC support' },
          { icon: '💎', title: '100% Free', desc: 'No ads forever.' }
        ]
      : [
          { icon: '📂', title: 'Batch Processing', desc: 'Compress up to 100 images at once' },
          { icon: '🎯', title: 'Precise Size Control', desc: 'Set exact target size in KB or MB' },
          { icon: '💎', title: '100% Free', desc: 'No ads forever.' }
        ])

    // 根据工具类型设置不同的默认步骤
    const defaultUploadDesc = isConverter 
      ? 'Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, BMP, and HEIC formats.'
      : 'Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, and BMP formats.'
    const defaultSecondStep = isConverter
      ? { title: 'Choose Format', desc: 'Select your target format: JPG, PNG, or WebP. Our converter maintains quality during conversion.' }
      : { title: 'Set Target Size', desc: 'Choose your desired file size in KB or MB. Our algorithm compresses images precisely to your target.' }
    const defaultDownloadDesc = isConverter
      ? 'Download individual converted images or all at once as a ZIP file. Fast and efficient.'
      : 'Download individual compressed images or all at once as a ZIP file. Fast and efficient.'
    
    const howToUseSteps = content.sections?.howToUse?.steps || [
      { title: 'Upload Images', desc: defaultUploadDesc },
      defaultSecondStep,
      { title: 'Download Results', desc: defaultDownloadDesc }
    ]

    const scenariosData = content.scenes || content.sections?.scenarios || (isConverter
      ? [
          { icon: '💻', title: 'For Web Developers', description: 'Convert images to WebP for better performance. Optimize formats for faster page loads and improved SEO.' },
          { icon: '🎨', title: 'For Designers', description: 'Convert between formats for different design needs. Preserve transparency with PNG or optimize with JPG.' },
          { icon: '📱', title: 'For Content Creators', description: 'Batch convert images for social media and blogs. Ensure compatibility across all platforms.' }
        ]
      : [
          { icon: '💻', title: 'For Web Developers', description: 'Optimize images for websites and apps. Reduce load times while maintaining quality for better SEO and user experience.' },
          { icon: '🛒', title: 'For E-commerce', description: 'Compress product images in bulk. Faster page loads mean better conversion rates and improved search rankings.' },
          { icon: '📱', title: 'For Content Creators', description: 'Prepare images for social media and blogs. Batch process multiple images quickly without quality loss.' }
        ])

    const comparisonData = content.sections?.comparison || content.compare ? {
      toolaze: content.compare?.toolaze || content.sections?.comparison?.toolaze || (isConverter
        ? 'Batch up to 100 images, Multiple format support, Quality preserved, 100% private & free, No sign-up required'
        : 'Batch up to 100 images, Precise size control, Multiple format support, 100% private & free, No sign-up required'),
      others: content.compare?.others || content.sections?.comparison?.others || 'Limited batch size, No precise control, Format restrictions, Privacy concerns, Registration required'
    } : null

    // 构建面包屑导航
    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: formatToolName(resolvedParams.tool), href: `/${resolvedParams.tool}` },
      { label: content.hero?.h1 ? extractPageTitle(content.hero.h1) : 'Page' },
    ]

    // 获取推荐的其他功能（排除当前页面）
    const allSlugs = getAllSlugs(resolvedParams.tool)
    const otherSlugs = allSlugs.filter(slug => slug !== resolvedParams.slug).slice(0, 3)
    const recommendedTools = otherSlugs.map(slug => {
      const toolData = getSeoContent(resolvedParams.tool, slug)
      return {
        slug,
        title: toolData?.hero?.h1 ? extractPageTitle(toolData.hero.h1) : slug,
        description: toolData?.hero?.desc || toolData?.hero?.sub || toolData?.metadata?.description || '',
        href: `/${resolvedParams.tool}/${slug}`,
      }
    }).filter(tool => tool.title && tool.href)

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
            {resolvedParams.tool === 'image-converter' || resolvedParams.tool === 'image-conversion' ? (
              <ImageConverter initialFormat={resolvedParams.slug} />
            ) : (
              <ImageCompressor initialTarget={resolvedParams.slug} />
            )}
          </header>

          {/* 2. Why Toolaze 板块 */}
          <section className="bg-white py-24 px-6 border-t border-indigo-50/50">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-6">
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Why Toolaze?</span>
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
              <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-20">How to Use <span className="text-indigo-600">Toolaze?</span></h2>
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

          {/* 4. Comparison 板块 */}
          {comparisonData && (
            <section className="py-24 px-6 bg-white relative overflow-hidden">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 relative order-1">
                  <div className="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Smart Choice</div>
                    <h3 className="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">Toolaze 💎</h3>
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
                <div className="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200 text-2xl">VS</div>
                <div className="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
                  <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">Other Tools</h3>
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

          {/* 5. Scenarios 板块 */}
          {scenariosData && scenariosData.length > 0 && (
            <section className="py-24 px-6 bg-[#F8FAFF]">
              <div className={`max-w-6xl mx-auto grid grid-cols-1 gap-6 ${
                scenariosData.length === 2 
                  ? 'md:grid-cols-2 md:max-w-4xl md:justify-center' 
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
            </section>
          )}

          {/* 6. FAQ 板块 */}
          {content.faq && Array.isArray(content.faq) && content.faq.length > 0 && (
            <section className="py-24 px-6 bg-white">
              <div className="max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
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

          {/* 7. Recommended Tools 板块 */}
          {recommendedTools.length > 0 && (
            <section className="py-24 px-6 bg-[#F8FAFF]">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">More {resolvedParams.tool === 'image-converter' ? 'Image Converter' : 'Image Compression'} Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedTools.map((tool, idx) => (
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
                        Try Now →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 8. Rating 板块 */}
          <Rating />
        </main>

        <Footer />
      </>
    )
  } catch (error) {
    // Log error but don't expose details to client
    if (process.env.NODE_ENV === 'development') {
      console.error('Error rendering page:', error)
    }
    notFound()
    return null
  }
}