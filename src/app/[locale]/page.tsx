import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getAllTools, loadToolData, loadCommonTranslations } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams() {
  // 返回所有支持的语言（除了英语，因为英语在根路径）
  // 但为了静态导出，我们需要生成所有语言版本
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  
  return locales.map((locale) => ({
    locale: locale,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const hreflang = generateHreflangAlternates(locale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.home?.metadata || {
    title: 'Toolaze - Free AI Image Compressor & Local Tools',
    description: 'Compress images locally in your browser. No server uploads, 100% private, free AI tools for creators.'
  }
  
  return {
    title: metadata.title,
    description: metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  
  // 加载公共翻译
  const t = await loadCommonTranslations(locale)
  const translations = t || {
    home: {
      badge: 'v1.0 Now Live',
      titleLine1: 'Free Lightweight',
      titleLine2: 'Image Tools Platform.',
      subtitle: 'Professional image processing tools that run entirely in your browser. No uploads, no limits, forever free.',
      cta: 'Try Image Compressor Now →',
      sectionToolsTitle: 'All Available Tools',
      sectionToolsSubtitle: 'One suite. Infinite lazy possibilities.',
      badgeLive: 'Live',
      badgeComingSoon: 'Coming Soon',
      toolImageCompressor: 'Image Compressor',
      toolImageCompressorDesc: 'Smart lossy compression for JPG/PNG.',
      toolFormatConverter: 'Format Converter',
      toolFormatConverterDesc: 'HEIC to JPG, PNG to WEBP.',
      toolImageResize: 'Image Resize',
      toolImageResizeDesc: 'Resize images to exact dimensions.',
      toolVideoCompressor: 'Video Compressor',
      toolVideoCompressorDesc: 'Compress videos without quality loss.',
      whyToolaze: {
        badge: 'Why Toolaze?',
        title: 'Built for Privacy & Performance',
        subtitle: 'Everything you need to know about why Toolaze is the smart choice for creators who value privacy and quality.'
      },
      features: {
        privacy: {
          title: 'Privacy First Architecture',
          desc: "Unlike other tools, we don't send your images to a remote server. Everything happens right here in your browser using WebAssembly. Your files never leave your device, ensuring complete privacy and security."
        },
        unlimited: {
          title: 'Unlimited & Free',
          desc: 'Compress as many images as you want. No daily limits, no paywalls, no watermarks. All tools are completely free forever with no hidden costs or premium tiers.'
        },
        quality: {
          title: 'Lossless Quality Control',
          desc: 'Our advanced compression algorithms reduce file sizes by up to 90% while maintaining visual quality. You control the compression level to balance size and quality perfectly.'
        },
        noRegistration: {
          title: 'No Registration Required',
          desc: 'Start using our tools immediately without creating an account. No email signup, no personal information collection. Just open the tool and get started.'
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'How does Toolaze compress images without uploading them?',
            a: 'Toolaze uses WebAssembly and browser-based image processing APIs to compress images directly in your browser. Your files are processed locally on your device, never sent to any server. This ensures complete privacy and faster processing.'
          },
          {
            q: 'What image formats does Toolaze support?',
            a: "Currently, our Image Compressor supports JPG, PNG, and WEBP formats. We're working on adding support for more formats including HEIC, BMP, and TIFF in future updates."
          },
          {
            q: 'Is there a file size limit?',
            a: "There's no theoretical file size limit. However, very large images may cause browser slowdown depending on your device's performance and available memory. We recommend processing large files in smaller batches for the best experience."
          },
          {
            q: 'Will Toolaze always be free?',
            a: 'Yes! Toolaze is committed to providing free tools forever. We believe in making powerful image processing tools accessible to everyone without any cost barriers or premium subscriptions.'
          },
          {
            q: 'How much can I compress my images?',
            a: 'Compression results vary depending on the original image quality and format. Typically, you can achieve 50-90% size reduction while maintaining acceptable visual quality. You can adjust compression settings to find the perfect balance for your needs.'
          }
        ]
      }
    }
  }
  
  // 生成带语言前缀的链接（英语不使用 /en）
  const getLocalizedHref = (path: string): string => {
    if (locale === 'en') {
      return path
    }
    return `/${locale}${path}`
  }
  
  let toolList: Array<{ tool: string; slug: string; title: string; description: string; component?: string }> = []
  
  try {
    const tools = await getAllTools(locale)
    
    // Load basic info for each tool to display
    if (tools && tools.length > 0) {
      toolList = await Promise.all(
        tools.map(async ({ tool, slug }) => {
          try {
            const data = await loadToolData(tool, slug, locale)
            if (!data) {
              return {
                tool,
                slug,
                title: `${tool}/${slug}`,
                description: '',
                component: undefined,
              }
            }
            // 提取标题（移除 HTML 标签）
            const title = data?.hero?.h1 ? data.hero.h1.replace(/<[^>]*>/g, '').trim() : `${tool}/${slug}`
            // 使用 sub 或 desc 作为描述
            const description = data?.hero?.sub || data?.hero?.desc || data?.metadata?.description || ''
            
            return {
              tool,
              slug,
              title: title,
              description: description,
              component: data?.component,
            }
          } catch (error) {
            // Silently handle individual tool loading errors
            return {
              tool,
              slug,
              title: `${tool}/${slug}`,
              description: '',
              component: undefined,
            }
          }
        })
      )
    }
  } catch (error) {
    // Silently handle errors and use fallback
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in HomePage:', error)
    }
    toolList = []
  }

  return (
    <>
      <Navigation />

      <header className="pt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-4 border border-indigo-100">{translations.home.badge}</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6" style={{ lineHeight: '1.3' }}>
            {translations.home.titleLine1} <br /> <span className="text-gradient">{translations.home.titleLine2}</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            {translations.home.subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <Link href={getLocalizedHref('/image-compressor')} className="inline-block px-8 py-4 bg-gradient-brand text-white text-lg font-bold rounded-full shadow-lg shadow-indigo-200 hover:shadow-indigo-400 transition-all hover:scale-105">
            {translations.home.cta}
          </Link>
        </div>
      </header>

      <section id="tools" className="py-20 px-6 bg-white border-t border-indigo-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{translations.home.sectionToolsTitle}</h2>
              <p className="text-slate-500 mt-2">{translations.home.sectionToolsSubtitle}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolList.length > 0 ? (
              toolList.map((item, index) => (
                <Link 
                  key={`${item.tool}-${item.slug}`}
                  href={getLocalizedHref(`/${item.tool}/${item.slug}`)}
                  className="p-6 rounded-3xl bg-[#F8FAFF] border-2 border-indigo-100 hover:border-indigo-300 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{translations.home.badgeLive}</div>
                  <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                    {item.tool === 'image-converter' || item.tool === 'image-conversion' ? (
                      // 图片格式转换图标
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        {/* 浅蓝色背景矩形 */}
                        <rect x="2" y="2" width="20" height="20" rx="2.5" fill="white" opacity="0.3"/>
                        {/* 深蓝色转换箭头（对角线） */}
                        <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        {/* 图片图标（前景） */}
                        <rect x="7" y="9" width="10" height="7" rx="1.5" fill="currentColor"/>
                        <circle cx="9.5" cy="11.5" r="0.8" fill="white"/>
                        <path d="M11.5 13.5L13.5 11.5L15.5 13.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    ) : (
                      // 图片压缩图标
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        {/* 四个方块，表示压缩 */}
                        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                        {/* 向内箭头（左上和右下） */}
                        <path d="M6.5 6.5L9 9M9 6.5L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.5 17.5L15 15M15 17.5L17.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* 向外箭头（右上和左下） */}
                        <path d="M17.5 6.5L15 9M15 6.5L17.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.5 17.5L9 15M9 17.5L6.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">
                    {(item.title || '').replace(/<[^>]*>/g, '').substring(0, 50)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {(item.description || '').substring(0, 100)}
                    {(item.description || '').length > 100 ? '...' : ''}
                  </p>
                </Link>
              ))
            ) : (
              <Link href={getLocalizedHref('/image-compressor/png-to-100kb')} className="p-6 rounded-3xl bg-[#F8FAFF] border-2 border-indigo-100 hover:border-indigo-300 transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Live</div>
                <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                  {/* 图片压缩图标 */}
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    {/* 四个方块，表示压缩 */}
                    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                    {/* 向内箭头（左上和右下） */}
                    <path d="M6.5 6.5L9 9M9 6.5L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 17.5L15 15M15 17.5L17.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    {/* 向外箭头（右上和左下） */}
                    <path d="M17.5 6.5L15 9M15 6.5L17.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 17.5L9 15M9 17.5L6.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900">{translations.home.toolImageCompressor}</h3>
                <p className="text-xs text-slate-500 mt-2">{translations.home.toolImageCompressorDesc}</p>
              </Link>
            )}

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed relative">
              <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{translations.home.badgeComingSoon}</div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 text-slate-300">🔄</div>
              <h3 className="font-bold text-slate-400">{translations.home.toolFormatConverter}</h3>
              <p className="text-xs text-slate-400 mt-2">{translations.home.toolFormatConverterDesc}</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed relative">
              <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{translations.home.badgeComingSoon}</div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 text-slate-300">📐</div>
              <h3 className="font-bold text-slate-400">{translations.home.toolImageResize}</h3>
              <p className="text-xs text-slate-400 mt-2">{translations.home.toolImageResizeDesc}</p>
            </div>
            
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 opacity-60 grayscale cursor-not-allowed relative">
              <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{translations.home.badgeComingSoon}</div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-4 text-slate-300">🎬</div>
              <h3 className="font-bold text-slate-400">{translations.home.toolVideoCompressor}</h3>
              <p className="text-xs text-slate-400 mt-2">{translations.home.toolVideoCompressorDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white border-t border-indigo-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-4 py-2 rounded-full inline-block mb-6">{translations.home.whyToolaze.badge}</span>
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">{translations.home.whyToolaze.title}</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">{translations.home.whyToolaze.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">1</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{translations.home.features.privacy.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{translations.home.features.privacy.desc}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">2</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{translations.home.features.unlimited.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{translations.home.features.unlimited.desc}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">3</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{translations.home.features.quality.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{translations.home.features.quality.desc}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#F8FAFF] p-8 rounded-3xl border border-indigo-50 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">4</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{translations.home.features.noRegistration.title}</h4>
                  <p className="text-base text-slate-600 leading-relaxed">{translations.home.features.noRegistration.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#F8FAFF] border-t border-indigo-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-12">{translations.home.faq.title}</h2>
          <div className="space-y-4">
            {translations.home.faq.items.map((item: { q: string; a: string }, index: number) => (
              <details key={index} className="bg-white p-6 rounded-2xl border border-indigo-50 hover:shadow-md transition-shadow">
                <summary className="font-bold text-slate-900 cursor-pointer flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-indigo-600 text-xl">+</span>
                </summary>
                <p className="text-sm text-slate-500 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
