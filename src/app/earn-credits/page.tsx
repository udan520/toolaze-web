import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import EarnCreditsPageClient from '@/components/EarnCreditsPageClient'
import { loadCommonTranslations } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Earn Credits - Toolaze',
  description: 'Earn Toolaze credits through daily check-ins and approved social sharing rewards.',
  robots: 'noindex, nofollow',
  alternates: {
    canonical: 'https://toolaze.com/earn-credits',
  },
}

export default async function EarnCreditsPage() {
  const t = await loadCommonTranslations('en')
  return (
    <>
      <Navigation initialTranslations={t} />
      <EarnCreditsPageClient />
      <Footer initialTranslations={t} />
    </>
  )
}
