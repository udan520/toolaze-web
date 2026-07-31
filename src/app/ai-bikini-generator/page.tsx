import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-bikini-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-bikini-generator')

  return {
    title:
      content?.metadata?.title ||
      'Free AI Bikini Generator Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload an adult person photo and a bikini reference to preview tasteful swimwear edits while preserving the original person and scene.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiBikiniGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-bikini-generator" />
}
