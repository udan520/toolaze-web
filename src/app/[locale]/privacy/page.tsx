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
    description: 'Toolaze Privacy Policy - We process all images locally in your browser. Your files never leave your device.'
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
    date: 'January 14, 2026',
    intro: 'At Toolaze ("we," "us," or "our"), accessible from https://toolaze.com, our main priority is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Toolaze and how we use it.',
    section1: {
      title: '1. Core Privacy Promise: Local Processing',
      content: 'We differentiate ourselves by prioritizing your privacy. We do not upload your images or videos to our servers.',
      points: [
        'All file processing happens locally within your web browser.',
        'Your files never leave your device.',
        'We cannot view, copy, or sell your content.'
      ]
    },
    section2: {
      title: '2. Information We Collect',
      content: 'We do not collect your files. We may collect anonymous non-personal information to improve our service:',
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
      title: '3. Analytics',
      content: 'We use Google Analytics to understand how our website is being used in order to improve user experience (e.g., which tools are most popular). All user data collected is anonymous and aggregated. We do not use this data for advertising profiling.'
    },
    section4: {
      title: '4. GDPR & CCPA Rights',
      content: 'We respect your data rights. Since we do not store personal data or files, we do not "sell" your data. You have the right to request information about our data practices at any time.'
    },
    section5: {
      title: '5. Contact Us',
      content: 'If you have additional questions, do not hesitate to contact us at support@toolaze.com.'
    }
  }
  const breadcrumbT = t?.breadcrumb || { home: 'Home', privacyPolicy: 'Privacy Policy' }
  
  return (
    <>
      <Navigation />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.privacyPolicy },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-4">{translations.title}</h1>
          
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

      <Footer />
    </>
  )
}
