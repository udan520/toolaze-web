import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('age-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/age-filter')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free AI Age Filter Online – No Sign-Up | Toolaze',
    fallbackDescription: 'Use the free AI Age Filter online with no sign-up. Upload one photo and see a baby, child, young adult, middle-aged, or older-adult look.',
  })
}

export default function AgeFilterPage() {
  return <ToolL2PageContent locale="en" tool="age-filter" />
}
