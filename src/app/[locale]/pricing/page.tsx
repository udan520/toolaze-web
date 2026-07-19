import type { Metadata } from 'next'
import PricingPageContent from '../../pricing/PricingPageContent'
import { getPricingPageCopy } from '../../pricing/pricing-copy'
import { generateHreflangAlternates } from '@/lib/hreflang'
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
  const copy = getPricingPageCopy(locale)
  const hreflang = generateHreflangAlternates(locale, '/pricing')

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function LocalizedPricingPage({ params }: PageProps) {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)

  return <PricingPageContent locale={locale} initialTranslations={t} />
}
