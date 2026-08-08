import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('bangs-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/bangs-filter')

  return {
    title:
      content?.metadata?.title ||
      'Free Bangs Filter Online | No Signup | Toolaze',
    description:
      content?.metadata?.description ||
      'Use the free Bangs Filter with no signup. Upload one portrait and preview curtain bangs, wispy bangs, blunt bangs, side bangs, and more.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function BangsFilterPage() {
  return <ToolL2PageContent locale="en" tool="bangs-filter" />
}
