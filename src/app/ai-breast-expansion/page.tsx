import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-breast-expansion', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-breast-expansion')

  return {
    title:
      content?.metadata?.title ||
      'AI Breast Expansion Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Preview natural, clothed adult bust-size edits online while preserving the original person, clothing, pose, and scene.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiBreastExpansionPage() {
  return <ToolL2PageContent locale="en" tool="ai-breast-expansion" />
}
