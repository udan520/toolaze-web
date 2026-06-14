import type { Metadata } from 'next'
import { Seedream45LandingPage } from '@/components/Seedream45LandingPage'
import { getSeedream45PageMetadata } from '@/lib/seedream-4-5-landing-copy'

export const dynamic = 'force-static'

export const metadata: Metadata = getSeedream45PageMetadata('en')

export default async function Seedream45Page() {
  return <Seedream45LandingPage />
}
