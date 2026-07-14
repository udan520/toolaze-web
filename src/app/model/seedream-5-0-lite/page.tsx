import type { Metadata } from 'next'
import { Seedream50LiteLandingPage } from '@/components/Seedream50LiteLandingPage'
import { getSeedream50LitePageMetadata } from '@/lib/seedream-5-0-lite-landing-copy'

export const dynamic = 'force-static'

export const metadata: Metadata = getSeedream50LitePageMetadata('en')

export default async function Seedream50LitePage() {
  return <Seedream50LiteLandingPage />
}
