import type { Metadata } from 'next'
import PricingPageContent from './PricingPageContent'
import { getPricingPageCopy } from './pricing-copy'

export const dynamic = 'force-static'

const copy = getPricingPageCopy('en')

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/pricing',
  },
}

export default function PricingPage() {
  return <PricingPageContent locale="en" />
}
