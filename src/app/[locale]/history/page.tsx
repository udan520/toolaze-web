import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HistoryPageClient from '@/components/HistoryPageClient'
import { loadCommonTranslations } from '@/lib/seo-loader'

const SUPPORTED_LOCALES = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)
  const copy = t?.historyPage || {}

  return {
    title: copy.metadataTitle || 'Generation History - Toolaze',
    description: copy.metadataDescription || 'View your Toolaze AI generation history, download results, and reprompt previous image or video generations.',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://toolaze.com/${locale}/history`,
    },
  }
}

export default async function LocalizedHistoryPage({ params }: PageProps) {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)
  return (
    <>
      <Navigation initialTranslations={t} />
      <HistoryPageClient initialTranslations={t} locale={locale} />
      <Footer initialTranslations={t} />
    </>
  )
}
