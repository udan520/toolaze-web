import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
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
  const pathWithoutLocale = '/about'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.about?.metadata || {
    title: 'About Us - Toolaze',
    description: 'Learn about Toolaze - Free AI image tools that run locally in your browser. Privacy-first, unlimited, forever free.'
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

export default async function AboutPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  
  // Load translations
  const t = await loadCommonTranslations(locale)
  const translations = t?.about || {
    title: 'We Handle the Tool. You Handle the Laze.',
    titleTool: 'Tool',
    titleLaze: 'Laze',
    subtitle: "Productivity isn't about working harder. It's about being smart enough to let AI do the heavy lifting.",
    whyToolaze: {
      title: 'Why "Toolaze"?',
      content1: 'The name comes from a simple philosophy: Tool + Laze.',
      content2: 'We believe that as a creator, your energy is finite. Every minute you spend resizing images, converting formats, or worrying about server privacy is a minute stolen from your creativity.',
      content3: 'We built Toolaze to be the ultimate "lazy" solution. We use advanced Local AI to automate the boring technical stuff instantly in your browser. No uploads, no waiting, no friction.',
      content4: "So go ahead, be a little lazy. We've got the tools covered."
    },
    features: {
      privacy: { title: 'Laze on Privacy', desc: 'Relax. Your files never leave your device. Zero risk of data leaks means zero anxiety for you.' },
      waiting: { title: 'Laze on Waiting', desc: 'Why wait for uploads? Our local WebAssembly engine processes files instantly. Done in a blink.' },
      cost: { title: 'Laze on Cost', desc: "Keep your wallet shut. We don't have expensive server bills, so you don't have to pay subscription fees." }
    },
    cta: {
      title: 'Ready to work less?',
      subtitle: 'Try our tools and reclaim your creative time.',
      button: 'Start Being Lazy Now →'
    }
  }
  const breadcrumbT = t?.breadcrumb || { home: 'Home', aboutUs: 'About Us' }
  
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.aboutUs },
      ]} />

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            {translations.title.includes('We Handle') ? (
              <>
                We Handle the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{translations.titleTool}</span>.<br />
                You Handle the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{translations.titleLaze}</span>.
              </>
            ) : translations.title.includes(translations.titleTool) && translations.title.includes(translations.titleLaze) ? (
              <>
                {translations.title.split(translations.titleTool)[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{translations.titleTool}</span>
                {translations.title.split(translations.titleTool)[1]?.split(translations.titleLaze)[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{translations.titleLaze}</span>
                {translations.title.split(translations.titleLaze)[1]}
              </>
            ) : (
              translations.title
            )}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {translations.subtitle}
          </p>
        </div>

        <div className="space-y-20">
          <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-[10rem] font-black text-slate-50 opacity-50 select-none pointer-events-none">Zzz</div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-6 relative z-10">{translations.whyToolaze.title}</h2>
            <div className="space-y-6 text-slate-500 leading-relaxed text-lg relative z-10">
              <p>
                {translations.whyToolaze.content1.includes(':') ? (
                  <>
                    {translations.whyToolaze.content1.split(':')[0]}: <strong className="text-slate-900">Tool + Laze</strong>.
                  </>
                ) : (
                  translations.whyToolaze.content1
                )}
              </p>
              <p>
                {translations.whyToolaze.content2}
              </p>
              <p>
                {translations.whyToolaze.content3.includes('Toolaze') ? (
                  <>
                    {translations.whyToolaze.content3.split('Toolaze')[0]}<strong className="text-slate-900">Toolaze</strong>{translations.whyToolaze.content3.split('Toolaze')[1]}
                  </>
                ) : (
                  translations.whyToolaze.content3
                )}
              </p>
              <p className="font-bold text-indigo-600">
                {translations.whyToolaze.content4}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 text-center hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🧘</div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">{translations.features.privacy.title}</h3>
              <p className="text-sm text-slate-500">{translations.features.privacy.desc}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 text-center hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">{translations.features.waiting.title}</h3>
              <p className="text-sm text-slate-500">{translations.features.waiting.desc}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 text-center hover:-translate-y-1 transition-transform group">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💸</div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">{translations.features.cost.title}</h3>
              <p className="text-sm text-slate-500">{translations.features.cost.desc}</p>
            </div>
          </div>

          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{translations.cta.title}</h3>
            <p className="text-slate-500 mb-8">{translations.cta.subtitle}</p>
            <Link href={homeHref} className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-1">
              {translations.cta.button}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
