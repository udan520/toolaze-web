import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HistoryPageClient from '@/components/HistoryPageClient'
import { loadCommonTranslations } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Generation History - Toolaze',
  description: 'View your Toolaze AI generation history, download results, and reprompt previous image or video generations.',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://toolaze.com/history',
  },
}

export default async function HistoryPage() {
  const t = await loadCommonTranslations('en')
  return (
    <>
      <Navigation initialTranslations={t} />
      <HistoryPageClient initialTranslations={t} locale="en" />
      <Footer initialTranslations={t} />
    </>
  )
}
