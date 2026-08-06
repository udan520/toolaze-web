import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('buzz-cut-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/buzz-cut-filter')

  return {
    title:
      content?.metadata?.title ||
      'Free Buzz Cut Filter Online | No Signup | Toolaze',
    description:
      content?.metadata?.description ||
      'Use the free Buzz Cut Filter with no signup. Upload one portrait and preview a realistic buzz cut while preserving your face and the rest of the photo.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function BuzzCutFilterPage() {
  return <ToolL2PageContent locale="en" tool="buzz-cut-filter" />
}
