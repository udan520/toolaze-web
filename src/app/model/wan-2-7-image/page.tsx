import type { Metadata } from 'next'
import { Wan27ImageLandingPage } from '@/components/Wan27ImageLandingPage'
import { getWan27ImagePageMetadata } from '@/lib/wan-2-7-image-landing-copy'

export const dynamic = 'force-static'

export const metadata: Metadata = getWan27ImagePageMetadata('en')

export default async function Wan27ImagePage() {
  return <Wan27ImageLandingPage />
}
