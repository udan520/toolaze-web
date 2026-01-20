import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ImageConverter from '@/components/ImageConverter'
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
import { loadCommonTranslations } from '@/lib/seo-loader'
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
  const pathWithoutLocale = '/image-converter'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.imageConverter?.metadata || {
    title: 'Free Image Converter - Batch Convert Images Online | Toolaze',
    description: 'Convert images between JPG, PNG, and WebP formats. Batch convert up to 100 images. Fast, private, 100% free. No sign-up required.'
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

export default async function ImageConverterPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  
  // Load translations
  const t = await loadCommonTranslations(locale)
  const translations = t?.imageConverter || {
    title: 'Free Image Converter',
    subtitle: 'Convert images between JPG, PNG, and WebP formats. Batch convert up to 100 images. Fast, private, 100% free. No sign-up required.',
    whyToolaze: {
      badge: 'Why Toolaze?',
      title: 'Convert Images Without Quality Loss',
      desc: 'Convert images between JPG, PNG, and WebP formats instantly. Our browser-based converter processes images locally, ensuring complete privacy and fast conversion. Perfect for web developers, designers, and content creators.'
    },
    features: {
      batch: { title: 'Batch Processing', desc: 'Convert up to 100 images at once' },
      formats: { title: 'Multiple Formats', desc: 'JPG, PNG, WebP, and HEIC support' },
      free: { title: '100% Free', desc: 'No ads forever.' }
    },
    howToUse: {
      title: 'How to Use Toolaze?',
      step1: { title: 'Upload Images', desc: 'Drag and drop up to 100 images or folders. Supports JPG, PNG, WebP, BMP, and HEIC formats.' },
      step2: { title: 'Choose Format', desc: 'Select your target format: JPG, PNG, or WebP. Our converter maintains quality during conversion.' },
      step3: { title: 'Download Results', desc: 'Download individual converted images or all at once as a ZIP file. Fast and efficient.' }
    },
    comparison: {
      toolaze: 'Toolaze 💎',
      otherTools: 'Other Tools',
      vs: 'VS',
      smartChoice: 'Smart Choice',
      features: {
        batch100: 'Batch up to 100 images',
        multipleFormat: 'Multiple format support',
        qualityPreserved: 'Quality preserved',
        privateFree: '100% private & free',
        noSignup: 'No sign-up required',
        limitedBatch: 'Limited batch size',
        formatRestrictions: 'Format restrictions',
        qualityLoss: 'Quality loss',
        privacyConcerns: 'Privacy concerns',
        registrationRequired: 'Registration required'
      }
    },
    scenarios: {
      developers: { title: 'For Web Developers', desc: 'Convert images to WebP for better performance. Optimize formats for faster page loads and improved SEO.' },
      designers: { title: 'For Designers', desc: 'Convert between formats for different design needs. Preserve transparency with PNG or optimize with JPG.' },
      creators: { title: 'For Content Creators', desc: 'Batch convert images for social media and blogs. Ensure compatibility across all platforms.' }
    },
    faq: {
      formats: { q: 'Which image formats are supported?', a: 'Toolaze supports converting between JPG, PNG, and WebP formats. You can upload images in JPG, PNG, WebP, BMP, or HEIC format.' },
      free: { q: 'Is this tool really free?', a: 'Yes! Toolaze is 100% free with no ads, no registration, and no hidden fees. All processing happens in your browser.' },
      batchLimit: { q: 'Can I convert more than 100 images?', a: 'The maximum batch size is 100 files per session. For larger batches, simply process them in multiple sessions.' },
      privacy: { q: 'Are my images uploaded to a server?', a: 'No! All image conversion happens locally in your browser using JavaScript. Your images never leave your device, ensuring complete privacy.' },
      quality: { q: 'Will quality be preserved during conversion?', a: 'Quality preservation depends on the target format. PNG is lossless, while JPG and WebP use lossy compression but maintain high visual quality.' }
    }
  }
  const breadcrumbT = t?.breadcrumb || { home: 'Home', imageConverter: 'Image Converter' }
  
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.imageConverter },
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
          <ImageConverter />
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
                  <h4 className="font-bold text-slate-800">{translations.features.formats.title}</h4>
                  <p className="text-xs text-slate-500">{translations.features.formats.desc}</p>
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
                    <span>{translations.comparison.features.multipleFormat}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✅</span>
                    <span>{translations.comparison.features.qualityPreserved}</span>
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
                  <span>{translations.comparison.features.formatRestrictions}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <span>{translations.comparison.features.qualityLoss}</span>
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
            icon: '🎨',
            title: translations.scenarios.designers.title,
            description: translations.scenarios.designers.desc
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
                q: translations.faq.quality.q,
                a: translations.faq.quality.a
              }
            ]} />

        {/* 8. Rating 板块 */}
        <Rating 
          rating={t?.common?.rating?.rating}
          description={t?.common?.rating?.description}
        />
      </main>

      <Footer />
    </>
  )
}
