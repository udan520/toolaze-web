import { GrokImagineVideo15LandingPage } from '@/components/GrokImagineVideo15LandingPage'
import type { Metadata } from 'next'
import { getGrokImagineVideo15PageMetadata } from '@/lib/grok-imagine-video-1-5-landing-copy'

export const dynamic = 'force-static'

const canonicalUrl = 'https://toolaze.com/model/grok-imagine-video-1-5'

export async function generateMetadata(): Promise<Metadata> {
  return getGrokImagineVideo15PageMetadata('en', canonicalUrl)
}
export default async function GrokImagineVideo15ModelPage() {
  return <GrokImagineVideo15LandingPage locale="en" />
}
