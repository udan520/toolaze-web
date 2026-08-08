import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('bangs-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/bangs-filter')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Bangs Filter Online | No Signup | Toolaze',
    fallbackDescription: 'Use the free Bangs Filter with no signup. Upload one portrait and preview curtain bangs, wispy bangs, blunt bangs, side bangs, and more.',
  })
}

export default function BangsFilterPage() {
  return <ToolL2PageContent locale="en" tool="bangs-filter" />
}
