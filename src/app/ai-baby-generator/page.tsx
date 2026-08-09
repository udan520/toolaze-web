import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-baby-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-baby-generator')
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Baby Generator Online Free - Create Future Baby Photos | Toolaze',
    fallbackDescription: 'Use Toolaze AI Baby Generator online free. Upload parent photos, choose a baby portrait style, and create cute future baby images in seconds.',
  })
}

export default function AiBabyGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-baby-generator" />
}
