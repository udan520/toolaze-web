import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CreditsPageClient from '@/components/CreditsPageClient'
import { loadCommonTranslations } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Credit Activity - Toolaze',
  description: 'View your Toolaze credit balance and complete credit activity history.',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://toolaze.com/credits',
  },
}

export default async function CreditsPage() {
  const t = await loadCommonTranslations('en')
  return (
    <>
      <Navigation initialTranslations={t} />
      <CreditsPageClient initialTranslations={t} locale="en" />
      <Footer initialTranslations={t} />
    </>
  )
}
