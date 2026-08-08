import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('bald-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/bald-filter')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Bald Filter Online | No Signup | Toolaze',
    fallbackDescription: 'Use the free Bald Filter with no signup. Upload one portrait and preview a realistic shaved-head look while preserving your face and the rest of the photo.',
  })
}

export default function BaldFilterPage() {
  return <ToolL2PageContent locale="en" tool="bald-filter" />
}
