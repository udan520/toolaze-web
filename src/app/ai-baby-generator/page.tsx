import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-baby-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-baby-generator')
  return {
    title:
      content?.metadata?.title ||
      'AI Baby Generator Online Free - Create Future Baby Photos | Toolaze',
    description:
      content?.metadata?.description ||
      'Use Toolaze AI Baby Generator online free. Upload parent photos, choose a baby portrait style, and create cute future baby images in seconds.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiBabyGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-baby-generator" />
}
