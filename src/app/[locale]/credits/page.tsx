import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CreditsPageClient from '@/components/CreditsPageClient'
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
  const copy = t?.creditsPage || {}

  return {
    title: copy.metadataTitle || 'Credit Activity - Toolaze',
    description: copy.metadataDescription || 'View your Toolaze credit balance and complete credit activity history.',
    robots: 'noindex, nofollow',
    alternates: {
      canonical: `https://toolaze.com/${locale}/credits`,
    },
  }
}

export default async function LocalizedCreditsPage({ params }: PageProps) {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)
  return (
    <>
      <Navigation initialTranslations={t} />
      <CreditsPageClient initialTranslations={t} locale={locale} />
      <Footer initialTranslations={t} />
    </>
  )
}
