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
  const pathWithoutLocale = '/terms'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  
  // Load translations for metadata
  const t = await loadCommonTranslations(locale)
  const metadata = t?.terms?.metadata || {
    title: 'Terms of Service - Toolaze',
    description: 'Toolaze Terms of Service for AI generation, credits, one-time purchases, commercial use, refunds, and acceptable use.'
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

export default async function TermsPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale || 'en'
  const homeHref = locale === 'en' ? '/' : `/${locale}`
  
  // Load translations
  const t = await loadCommonTranslations(locale)
  const translations = t?.terms || {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated:',
    date: 'July 15, 2026',
    intro: 'Welcome to Toolaze! By accessing or using our website (https://toolaze.com), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.',
    section1: {
      title: '1. Description of Service',
      content: 'Toolaze provides AI generation, AI editing, image utilities, video utilities, prompt workflows, generation history, and credit-based purchases.',
      localProcessing: 'AI generation: Some tools use third-party model providers and cloud infrastructure to process prompts, uploaded media, and generated outputs.'
    },
    section2: {
      title: '2. Use of Service',
      license: 'License: We grant you a limited, non-exclusive, non-transferable license to use our tools for personal or commercial purposes, provided you comply with these Terms.',
      noRegistration: 'Credits: Purchased credits are one-time purchases, valid for 12 months, and returned when a failed generation is confirmed.',
      prohibitedActs: 'Acceptable Use: You agree not to:',
      prohibitedList: [
        'Reverse engineer, decompile, or attempt to extract the source code of the Service.',
        'Use the Service to create illegal, NSFW, sexual, hateful, deceptive, or infringing content.',
        'Use automated scripts (bots) that affect the stability of our website.'
      ]
    },
    section3: {
      title: '3. User Content & Data',
      ownership: 'Your Ownership: You keep the rights you already have in prompts, uploads, reference files, and generated outputs.',
      noLiability: 'Commercial Use: Commercial use is allowed for generated outputs, subject to these Terms, the Acceptable Use Policy, applicable law, and any third-party model provider rules.'
    },
    section4: {
      title: '4. Intellectual Property',
      content: 'The Service itself (excluding your content), including its original content, features, code, and functionality, is and will remain the exclusive property of Toolaze and its licensors. Our trademarks (including the "Toolaze" name and Logo) may not be used without prior written consent.'
    },
    section5: {
      title: '5. Disclaimer of Warranties ("AS IS")',
      content: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Toolaze makes no representations or warranties of any kind, express or implied, regarding the operation of the Service or the accuracy of the AI processing results.',
      guarantee: 'We do not guarantee that a third-party model will produce a specific result, quality level, style, file type, or delivery time.'
    },
    section6: {
      title: '6. Limitation of Liability',
      content: 'In no event shall Toolaze be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or goodwill, resulting from your use of the Service.'
    },
    section7: {
      title: '7. Changes to Terms',
      content: 'We reserve the right to modify or replace these Terms at any time. By continuing to access our Service after those revisions become effective, you agree to be bound by the revised terms.'
    },
    section8: {
      title: '8. Contact Us',
      content: 'If you have any questions about these Terms, please contact us at: support@toolaze.com'
    }
  }
  const breadcrumbT = t?.breadcrumb || { home: 'Home', termsOfService: 'Terms of Service' }
  
  return (
    <>
      <Navigation initialTranslations={t} />
      
      <Breadcrumb items={[
        { label: breadcrumbT.home, href: homeHref },
        { label: breadcrumbT.termsOfService },
      ]} />

      <main className="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-4">{translations.title}</h1>
          
          <p className="text-slate-500 mb-12 text-base leading-relaxed">
            <strong className="text-slate-900">{translations.lastUpdated}</strong> {translations.date}
          </p>

          <div className="text-slate-600 space-y-8 leading-relaxed text-base">
            <p>
              {translations.intro.includes('Toolaze') ? (
                <>
                  {translations.intro.split('Toolaze')[0]}<strong className="text-slate-900">Toolaze</strong>{translations.intro.split('Toolaze')[1]}
                </>
              ) : (
                translations.intro
              )}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section1.title}</h2>
              <p>
                {translations.section1.content}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>
                  {translations.section1.localProcessing.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{translations.section1.localProcessing.split(':')[0]}:</strong> {translations.section1.localProcessing.split(':')[1]}
                    </>
                  ) : (
                    translations.section1.localProcessing
                  )}
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section2.title}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>
                  {translations.section2.license.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{translations.section2.license.split(':')[0]}:</strong> {translations.section2.license.split(':')[1]}
                    </>
                  ) : (
                    translations.section2.license
                  )}
                </li>
                <li>
                  {translations.section2.noRegistration.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{translations.section2.noRegistration.split(':')[0]}:</strong> {translations.section2.noRegistration.split(':')[1]}
                    </>
                  ) : (
                    translations.section2.noRegistration
                  )}
                </li>
                <li>
                  {translations.section2.prohibitedActs.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{translations.section2.prohibitedActs.split(':')[0]}:</strong>
                      <ol className="list-decimal list-inside space-y-1 ml-6 mt-2">
                        {translations.section2.prohibitedList.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ol>
                    </>
                  ) : (
                    <>
                      {translations.section2.prohibitedActs}
                      <ol className="list-decimal list-inside space-y-1 ml-6 mt-2">
                        {translations.section2.prohibitedList.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section3.title}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
                <li>
                  {translations.section3.ownership.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{translations.section3.ownership.split(':')[0]}:</strong> {translations.section3.ownership.split(':')[1]}
                    </>
                  ) : (
                    translations.section3.ownership
                  )}
                </li>
                <li>
                  {translations.section3.noLiability.includes(':') ? (
                    <>
                      <strong className="text-slate-900">{translations.section3.noLiability.split(':')[0]}:</strong> {translations.section3.noLiability.split(':')[1]}
                    </>
                  ) : (
                    translations.section3.noLiability
                  )}
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section4.title}</h2>
              <p>
                {translations.section4.content.includes('Toolaze') ? (
                  <>
                    {translations.section4.content.split('Toolaze')[0]}<strong className="text-slate-900">Toolaze</strong>{translations.section4.content.split('Toolaze')[1]}
                  </>
                ) : (
                  translations.section4.content
                )}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section5.title}</h2>
              <p>
                {translations.section5.content}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600 mt-4">
                <li>{translations.section5.guarantee}</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section6.title}</h2>
              <p>
                {translations.section6.content.includes('Toolaze') ? (
                  <>
                    {translations.section6.content.split('Toolaze')[0]}<strong className="text-slate-900">Toolaze</strong>{translations.section6.content.split('Toolaze')[1]}
                  </>
                ) : (
                  translations.section6.content
                )}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section7.title}</h2>
              <p>
                {translations.section7.content}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-12 mb-4">{translations.section8.title}</h2>
              <p>
                {translations.section8.content.includes('support@toolaze.com') ? (
                  <>
                    {translations.section8.content.split('support@toolaze.com')[0]}<strong className="text-slate-900"><a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a></strong>
                  </>
                ) : (
                  <>
                    {translations.section8.content}
                    <a href="mailto:support@toolaze.com" className="text-indigo-600 hover:text-purple-600 underline font-medium">support@toolaze.com</a>
                  </>
                )}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer initialTranslations={t} />
    </>
  )
}
