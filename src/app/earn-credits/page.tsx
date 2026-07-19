import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import EarnCreditsPageClient from '@/components/EarnCreditsPageClient'
import { getEarnCreditsPageCopy } from './earn-credits-copy'
import { loadCommonTranslations } from '@/lib/seo-loader'

export const dynamic = 'force-static'

const copy = getEarnCreditsPageCopy('en')

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
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
      <EarnCreditsPageClient locale="en" copy={copy} />
      <Footer initialTranslations={t} />
    </>
  )
}
