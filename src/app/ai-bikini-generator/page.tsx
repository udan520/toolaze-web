import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-bikini-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-bikini-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free AI Bikini Generator Online | Toolaze',
    fallbackDescription: 'Upload an adult person photo and a bikini reference to preview tasteful swimwear edits while preserving the original person and scene.',
  })
}

export default function AiBikiniGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-bikini-generator" />
}
