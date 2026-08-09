import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-breast-expansion', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-breast-expansion')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Breast Expansion Online | Toolaze',
    fallbackDescription: 'Preview natural, clothed adult bust-size edits online while preserving the original person, clothing, pose, and scene.',
  })
}

export default function AiBreastExpansionPage() {
  return <ToolL2PageContent locale="en" tool="ai-breast-expansion" />
}
