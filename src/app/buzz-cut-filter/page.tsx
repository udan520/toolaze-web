import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('buzz-cut-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/buzz-cut-filter')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Buzz Cut Filter Online | No Signup | Toolaze',
    fallbackDescription: 'Use the free Buzz Cut Filter with no signup. Upload one portrait and preview a realistic buzz cut while preserving your face and the rest of the photo.',
  })
}

export default function BuzzCutFilterPage() {
  return <ToolL2PageContent locale="en" tool="buzz-cut-filter" />
}
