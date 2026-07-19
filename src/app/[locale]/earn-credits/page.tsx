import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import EarnCreditsPageClient from '@/components/EarnCreditsPageClient'
import { EARN_CREDITS_LOCALES, getEarnCreditsPageCopy } from '@/app/earn-credits/earn-credits-copy'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { loadCommonTranslations } from '@/lib/seo-loader'

const PATH = '/earn-credits'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return EARN_CREDITS_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const copy = getEarnCreditsPageCopy(locale)
  const hreflang = generateHreflangAlternates(locale, PATH)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    robots: 'noindex, nofollow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function LocalizedEarnCreditsPage({ params }: PageProps) {
  const { locale } = await params
  const t = await loadCommonTranslations(locale)

  return (
    <>
      <Navigation initialTranslations={t} />
      <EarnCreditsPageClient locale={locale} copy={getEarnCreditsPageCopy(locale)} />
      <Footer initialTranslations={t} />
    </>
  )
}
