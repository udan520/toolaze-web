import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ImageCompressor from '@/components/ImageCompressor'
import Hero from '@/components/blocks/Hero'
import FAQ from '@/components/blocks/FAQ'
import Intro from '@/components/blocks/Intro'
import Specs from '@/components/blocks/Specs'
import Scenarios from '@/components/blocks/Scenarios'
import Comparison from '@/components/blocks/Comparison'
import HowToUse from '@/components/blocks/HowToUse'
import WhyToolaze from '@/components/blocks/WhyToolaze'
import Rating from '@/components/blocks/Rating'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations, getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import Link from 'next/link'
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
  const locale = resolvedParams.locale || 'en'
  const pathWithoutLocale = '/image-compressor'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.imageCompressor?.metadata || {
    title: 'Free Image Compressor - Batch Compress Images Online | Toolaze',
    description: 'Batch compress up to 100 images at once. Set exact target size. Fast, private, 100% free. No sign-up required.'
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

export default async function ImageCompressorPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  
  // Load translations
  const t = await loadCommonTranslations(locale)
  
  // 加载所有 in_menu: false 的工具（长尾页面），并选择3个最相关的显示
  let allSlugs: string[] = []
  let featuredTools: Array<{ slug: string; title: string; description: string; href: string }> = []
  let totalToolsCount = 0
  
  try {
    const slugsResult = await getAllSlugs('image-compressor', locale)
    allSlugs = Array.isArray(slugsResult) ? slugsResult : []
    
    if (allSlugs.length > 0) {
      const allLongTailTools = await Promise.all(
        allSlugs.map(async (slug) => {
          try {
            if (!slug || typeof slug !== 'string') return null
            const toolData = await getSeoContent('image-compressor', slug, locale)
            // 只包含 in_menu: false 的工具
            if (toolData && toolData.in_menu === false) {
              const title = toolData?.hero?.h1 ? toolData.hero.h1.replace(/<[^>]*>/g, '').trim() : slug
              const description = toolData?.hero?.desc || toolData?.metadata?.description || ''
              const shortDesc = description.length > 100 ? description.substring(0, 100) + '...' : description
              return {
                slug,
                title,
                description: shortDesc,
                href: locale === 'en' ? `/image-compressor/${slug}` : `/${locale}/image-compressor/${slug}`,
              }
            }
            return null
          } catch (err) {
            console.error(`Error loading tool ${slug}:`, err)
            return null
          }
        })
      )
      const filteredLongTailTools = allLongTailTools.filter((tool): tool is { slug: string; title: string; description: string; href: string } => 
        tool !== null && tool.title !== undefined && tool.href !== undefined
      )
      // 选择前3个最相关的工具显示
      featuredTools = filteredLongTailTools.slice(0, 3)
    }
    totalToolsCount = allSlugs.length || 0
  } catch (error) {
    // 如果加载失败，使用空数组，但板块仍然显示
    console.error('Failed to load tools:', error)
    featuredTools = []
    totalToolsCount = 0
    allSlugs = []
  }
  const translations = t?.imageCompressor || {
    title: 'Free Image Compressor',
    subtitle: 'Batch compress up to 100 images at once. Set exact target size. Fast, private, 100% free. No sign-up required.',
    whyToolaze: {
      badge: 'Why Toolaze?',
      title: 'Stop Losing Time on Slow Image Compression Tools',
      desc: 'Traditional image compressors are slow, limit file counts, and often compromise quality. Toolaze compresses up to 100 images simultaneously with precise size control, maintaining visual quality while dramatically reducing file sizes. Perfect for web developers, photographers, and content creators.'
    },
    features: {
      batch: { title: 'Batch Processing', desc: 'Compress up to 100 images at once' },
      precise: { title: 'Precise Size Control', desc: 'Set exact target size in KB or MB' },
      free: { title: '100% Free', desc: 'No ads forever.' }
    },
    howToUse: {
      title: 'How to Use Toolaze?',
      step1: { title: 'Upload Images', desc: 'Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, and BMP formats.' },
      step2: { title: 'Set Target Size', desc: 'Choose your desired file size in KB or MB. Our algorithm compresses images precisely to your target.' },
      step3: { title: 'Download Results', desc: 'Download individual compressed images or all at once as a ZIP file. Fast and efficient.' }
    },
    comparison: {
      toolaze: 'Toolaze 💎',
      otherTools: 'Other Tools',
      vs: 'VS',
      smartChoice: 'Smart Choice',
      features: {
        batch100: 'Batch up to 100 images',
        preciseControl: 'Precise size control',
        multipleFormat: 'Multiple format support',
        privateFree: '100% private & free',
        noSignup: 'No sign-up required',
        limitedBatch: 'Limited batch size',
        noPreciseControl: 'No precise control',
        formatRestrictions: 'Format restrictions',
        privacyConcerns: 'Privacy concerns',
        registrationRequired: 'Registration required'
      }
    },
    scenarios: {
      developers: { title: 'For Web Developers', desc: 'Optimize images for websites and apps. Reduce load times while maintaining quality for better SEO and user experience.' },
      ecommerce: { title: 'For E-commerce', desc: 'Compress product images in bulk. Faster page loads mean better conversion rates and improved search rankings.' },
      creators: { title: 'For Content Creators', desc: 'Prepare images for social media and blogs. Batch process multiple images quickly without quality loss.' }
    },
    faq: {
      formats: { q: 'Which image formats are supported?', a: 'Toolaze supports JPG, JPEG, PNG, WebP, and BMP formats. All compressed images are output as optimized JPEG files.' },
      free: { q: 'Is this tool really free?', a: 'Yes! Toolaze is 100% free with no ads, no registration, and no hidden fees. All processing happens in your browser.' },
      batchLimit: { q: 'Can I compress more than 100 images?', a: 'The maximum batch size is 100 files per session. For larger batches, simply process them in multiple sessions.' },
      privacy: { q: 'Are my images uploaded to a server?', a: 'No! All image processing happens locally in your browser using JavaScript. Your images never leave your device, ensuring complete privacy.' },
      maxSize: { q: 'What is the maximum file size I can compress?', a: "There's no theoretical file size limit. However, very large images may cause browser slowdown depending on your device's performance and available memory. We recommend processing large files in smaller batches for the best experience." }
    }
  }
  const breadcrumbT = t?.breadcrumb || { home: 'Home', imageCompression: 'Image Compression' }
  
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.imageCompression },
      ]} />

      <main className="min-h-screen bg-[#F8FAFF]">
        {/* 1. Hero 板块 - 包含标题、描述、工具卡片和信任条 */}
        <header className="bg-[#F8FAFF] pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
              {translations.title.split(' ')[0]} <span className="text-gradient">{translations.title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="desc-text text-lg md:text-xl max-w-2xl mx-auto">
              {translations.subtitle}
            </p>
          </div>
          <ImageCompressor />
        </header>

        {/* 3. Why Toolaze 板块 */}
        <section className="bg-white py-24 px-6 border-t border-indigo-50/50">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">{translations.whyToolaze.badge}</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">{translations.whyToolaze.title}</h2>
              <p className="desc-text text-lg">{translations.whyToolaze.desc}</p>
            </div>
            <div className="grid gap-4">
              <div className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">📂</div>
                <div>
                  <h4 className="font-bold text-slate-800">{translations.features.batch.title}</h4>
                  <p className="text-xs text-slate-500">{translations.features.batch.desc}</p>
                </div>
              </div>
              <div className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">🎯</div>
                <div>
                  <h4 className="font-bold text-slate-800">{translations.features.precise.title}</h4>
                  <p className="text-xs text-slate-500">{translations.features.precise.desc}</p>
                </div>
              </div>
              <div className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">💎</div>
                <div>
                  <h4 className="font-bold text-slate-800">{translations.features.free.title}</h4>
                  <p className="text-xs text-slate-500">{translations.features.free.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How To Use 板块 */}
        <section className="py-24 px-6 bg-[#F8FAFF]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-20">{translations.howToUse.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="group">
                <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{translations.howToUse.step1.title}</h3>
                <p className="desc-text max-w-[240px] mx-auto">{translations.howToUse.step1.desc}</p>
              </div>
              <div className="group">
                <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{translations.howToUse.step2.title}</h3>
                <p className="desc-text max-w-[240px] mx-auto">{translations.howToUse.step2.desc}</p>
              </div>
              <div className="group">
                <div className="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{translations.howToUse.step3.title}</h3>
                <p className="desc-text max-w-[240px] mx-auto">{translations.howToUse.step3.desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Comparison 板块 */}
        <section className="py-24 px-6 bg-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative order-1">
              <div className="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">{translations.comparison.smartChoice}</div>
                <h3 className="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">{translations.comparison.toolaze}</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>{translations.comparison.features.batch100}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>{translations.comparison.features.preciseControl}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>{translations.comparison.features.multipleFormat}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>{translations.comparison.features.privateFree}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>{translations.comparison.features.noSignup}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200 text-2xl">{translations.comparison.vs}</div>
            <div className="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
              <h3 className="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">{translations.comparison.otherTools}</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>{translations.comparison.features.limitedBatch}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>{translations.comparison.features.noPreciseControl}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>{translations.comparison.features.formatRestrictions}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>{translations.comparison.features.privacyConcerns}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>{translations.comparison.features.registrationRequired}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Scenarios 板块 */}
        <Scenarios 
          title={translations.scenarios?.title || 'Use Cases'}
          scenarios={[
          {
            icon: '💻',
            title: translations.scenarios.developers.title,
            description: translations.scenarios.developers.desc
          },
          {
            icon: '🛒',
            title: translations.scenarios.ecommerce.title,
            description: translations.scenarios.ecommerce.desc
          },
          {
            icon: '📱',
            title: translations.scenarios.creators.title,
            description: translations.scenarios.creators.desc
          }
        ]} />

        {/* 7. FAQ 板块 */}
        <FAQ 
          title={translations.faq.title}
          items={[
              {
                q: translations.faq.formats.q,
                a: translations.faq.formats.a
              },
              {
                q: translations.faq.free.q,
                a: translations.faq.free.a
              },
              {
                q: translations.faq.batchLimit.q,
                a: translations.faq.batchLimit.a
              },
              {
                q: translations.faq.privacy.q,
                a: translations.faq.privacy.a
              },
              {
                q: translations.faq.maxSize.q,
                a: translations.faq.maxSize.a
              }
            ]} />

        {/* 8. Rating 板块 */}
        <Rating 
          rating={t?.common?.rating?.rating}
          description={t?.common?.rating?.description}
          bgClass="bg-[#F8FAFF]"
        />

        {/* 9. More Tools 板块 - 显示3个最相关的长尾页面 + 所有工具入口 - 始终显示 */}
        <section className="py-24 px-6 bg-white border-t border-indigo-50/50" id="more-tools-section" data-testid="more-tools-section">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">
              More Image Compression Tools
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Discover specialized compression tools for specific platforms and use cases.
            </p>
            
            {/* 显示3个最相关的工具 */}
            {Array.isArray(featuredTools) && featuredTools.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={tool.href}
                    className="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="mt-4 text-sm font-bold text-indigo-600 group-hover:text-purple-600 transition-colors">
                      Try Now →
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* 所有工具入口 - 始终显示 */}
            <div className="text-center mt-8">
              <Link
                href={locale === 'en' ? '/image-compressor/all-tools' : `/${locale}/image-compressor/all-tools`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/50 transition-all text-base"
              >
                View All Tools
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
