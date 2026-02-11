import Link from 'next/link'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { loadCommonTranslations } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import type { Metadata } from 'next'


interface PageProps {
  params: Promise<{
    locale: string
  }>
}

// 为静态导出生成所有语言版本的参数
export async function generateStaticParams() {
  const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const localeParam = resolvedParams.locale || 'en'
  
  // 验证 locale 是否是有效的语言代码
  const validLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const locale = validLocales.includes(localeParam) ? localeParam : 'en'
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
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale.replace('-', '_'),
      url: hreflang.canonical,
      siteName: 'Toolaze',
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: 'https://toolaze.com/web-app-manifest-512x512.png',
          width: 512,
          height: 512,
          alt: 'Toolaze Logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['https://toolaze.com/web-app-manifest-512x512.png'],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params
  const localeParam = resolvedParams.locale || 'en'
  
  // 验证 locale 是否是有效的语言代码
  const validLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  if (!validLocales.includes(localeParam)) {
    // 如果不是有效的 locale，返回 404
    const { notFound } = await import('next/navigation')
    notFound()
    return null
  }
  
  const locale = localeParam
  
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
  
  // 只显示L2工具（不显示L3页面）
  const l2Tools: Array<{ tool: string; title: string; description: string; href: string }> = []
  
  try {
    // 定义L2工具列表
    const l2ToolList = [
      { tool: 'image-compressor', name: 'Image Compressor' },
      { tool: 'image-converter', name: 'Image Converter' },
      { tool: 'font-generator', name: 'Font Generator' },
    ]
    
    // 加载每个L2工具的数据
    const loadedL2Tools = await Promise.all(
      l2ToolList.map(async ({ tool, name }) => {
        try {
          const { getL2SeoContent } = await import('@/lib/seo-loader')
          const data = await getL2SeoContent(tool, locale)
          if (!data) {
            return null
          }
          // 提取标题（移除 HTML 标签）
          const title = data?.hero?.h1 ? data.hero.h1.replace(/<[^>]*>/g, '').trim() : name
          // 使用 desc 或 metadata.description 作为描述
          const description = data?.hero?.desc || data?.metadata?.description || ''
          
          return {
            tool,
            title: title,
            description: description,
            href: getLocalizedHref(`/${tool}`),
          }
        } catch (error) {
          // Silently handle individual tool loading errors
          return null
        }
      })
    )
    // 过滤掉 null 值
    l2Tools.push(...loadedL2Tools.filter((tool): tool is NonNullable<typeof tool> => tool !== null))
  } catch (error) {
    // Silently handle errors and use fallback
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in HomePage:', error)
    }
  }

  // Organization Schema for Google Search Logo
  // Google requires logo to be at least 112x112px, square, and accessible
  // Using 512x512px for better quality
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toolaze',
    url: 'https://toolaze.com',
    logo: 'https://toolaze.com/web-app-manifest-512x512.png',
    image: 'https://toolaze.com/web-app-manifest-512x512.png',
    sameAs: [],
    description: 'Free AI Image Compressor & Local Tools - Professional image processing tools that run entirely in your browser.',
  }

  return (
    <>
      {/* Organization Schema for Google Search Logo */}
      <Script
        id="organization-schema-homepage-locale"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navigation />

      <header className="pt-10 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-4 border border-indigo-100">{translations.home.badge}</span>
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-6" style={{ lineHeight: '1.3' }}>
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
            {l2Tools.length > 0 ? (
              l2Tools.map((item, index) => {
                // 根据工具类型生成图标
                let icon = null
                if (item.tool === 'image-compressor') {
                  icon = (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <path d="M6.5 6.5L9 9M9 6.5L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 17.5L15 15M15 17.5L17.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 6.5L15 9M15 6.5L17.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 17.5L9 15M9 17.5L6.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )
                } else if (item.tool === 'image-converter') {
                  icon = (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <rect x="2" y="2" width="20" height="20" rx="2.5" fill="#93C5FD" opacity="0.4"/>
                      <path d="M5 5L19 19M19 5L5 19" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
                      <rect x="7" y="9" width="10" height="7" rx="1.5" fill="#3B82F6"/>
                      <circle cx="9.5" cy="11.5" r="0.8" fill="white"/>
                      <path d="M11.5 13.5L13.5 11.5L15.5 13.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  )
                } else if (item.tool === 'font-generator') {
                  icon = (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <rect x="3" y="4" width="18" height="16" rx="2" fill="url(#fontGradient)" opacity="0.2"/>
                      <path d="M7 8H17M7 12H15M7 16H13" stroke="url(#fontGradient)" strokeWidth="2" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="fontGradient" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#9333EA"/>
                          <stop offset="1" stopColor="#4F46E5"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  )
                }
                
                return (
                  <Link 
                    key={item.tool}
                    href={item.href}
                    className="p-6 rounded-3xl bg-[#F8FAFF] border-2 border-indigo-100 hover:border-indigo-300 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{translations.home.badgeLive}</div>
                    <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                      {icon}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      {(item.title || '').replace(/<[^>]*>/g, '').substring(0, 50)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {(item.description || '').substring(0, 100)}
                      {(item.description || '').length > 100 ? '...' : ''}
                    </p>
                  </Link>
                )
              })
            ) : (
              // Fallback: 如果加载失败，显示默认工具
              <>
                <Link href={getLocalizedHref('/image-compressor')} className="p-6 rounded-3xl bg-[#F8FAFF] border-2 border-indigo-100 hover:border-indigo-300 transition-all group relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{translations.home.badgeLive}</div>
                  <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor"/>
                      <path d="M6.5 6.5L9 9M9 6.5L6.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 17.5L15 15M15 17.5L17.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 6.5L15 9M15 6.5L17.5 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 17.5L9 15M9 17.5L6.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900">{translations.home.toolImageCompressor}</h3>
                  <p className="text-xs text-slate-500 mt-2">{translations.home.toolImageCompressorDesc}</p>
                </Link>
              </>
            )}
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
