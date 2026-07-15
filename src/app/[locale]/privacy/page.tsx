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
  const pathWithoutLocale = '/privacy'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.privacy?.metadata || {
    title: 'Privacy Policy - Toolaze',
    description: 'Toolaze Privacy Policy for AI generation, uploads, credits, payments, analytics, and third-party providers.'
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

export default async function PrivacyPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  
  // Load translations
  const t = await loadCommonTranslations(locale)
  const translations = t?.privacy || {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated:',
    date: 'July 15, 2026',
    intro: 'At Toolaze ("we," "us," or "our"), accessible from https://toolaze.com, our main priority is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Toolaze and how we use it.',
    section1: {
      title: '1. AI generation and uploaded content',
      content: 'Toolaze may process prompts, uploaded images, uploaded videos, reference files, generated outputs, account activity, payment events, and credit usage to provide the service.',
      points: [
        'AI generation may send prompts and uploaded images to third-party AI providers.',
        'Creem or another payment processor may handle checkout, receipts, taxes, and refunds.',
        'We may store content and metadata for history, downloads, abuse prevention, billing, debugging, refunds, and support.'
      ]
    },
    section2: {
      title: '2. Information We Collect',
      content: 'We collect the information needed to run Toolaze, protect the service, and support purchases:',
      logFiles: {
        title: 'A. Log Files',
        content: 'Toolaze follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, date and time stamp, and referring/exit pages. These are not linked to any information that is personally identifiable.'
      },
      cookies: {
        title: 'B. Cookies',
        content: 'Toolaze uses "cookies" solely to store information about visitors\' preferences (e.g., dark mode settings) and to optimize the user experience.'
      }
    },
    section3: {
      title: '3. Analytics, logs, and cookies',
      content: 'We use Google Analytics, cookies, logs, and similar technologies to understand product usage, secure checkout flows, diagnose failures, and improve Toolaze.'
    },
    section4: {
      title: '4. Your rights',
      content: 'Depending on your location, you may have rights to access, correct, delete, or export certain personal information. Some records may be kept for security, tax, accounting, legal, or fraud prevention reasons.'
    },
    section5: {
      title: '5. Contact us',
      content: 'If you have additional questions, do not hesitate to contact us at support@toolaze.com.'
    }
  }
  const breadcrumbT = t?.breadcrumb || { home: 'Home', privacyPolicy: 'Privacy Policy' }
  
  return (
    <>
      <Navigation initialTranslations={t} />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.privacyPolicy },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4">{translations.title}</h1>
          
          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">{translations.lastUpdated}</strong> {translations.date}
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              {translations.intro}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section1.title}</h2>
              <p>
                {translations.section1.content}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                {translations.section1.points.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section2.title}</h2>
              <p>
                {translations.section2.content}
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{translations.section2.logFiles.title}</h3>
                  <p>
                    {translations.section2.logFiles.content}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{translations.section2.cookies.title}</h3>
                  <p>
                    {translations.section2.cookies.content}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section3.title}</h2>
              <p>
                {translations.section3.content.includes('Google Analytics') ? (
                  <>
                    {translations.section3.content.split('Google Analytics')[0]}
                    <strong className="text-slate-900">Google Analytics</strong>
                    {translations.section3.content.split('Google Analytics')[1].includes('anonymous') ? (
                      <>
                        {translations.section3.content.split('Google Analytics')[1].split('anonymous')[0]}
                        <strong className="text-slate-900">anonymous</strong>
                        {translations.section3.content.split('Google Analytics')[1].split('anonymous')[1]}
                      </>
                    ) : (
                      translations.section3.content.split('Google Analytics')[1]
                    )}
                  </>
                ) : (
                  translations.section3.content
                )}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section4.title}</h2>
              <p>
                {translations.section4.content}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section5.title}</h2>
              <p>
                {translations.section5.content.split('support@toolaze.com')[0]}<a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer initialTranslations={t} />
    </>
  )
}
