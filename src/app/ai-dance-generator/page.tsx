import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-dance-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-dance-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free AI Dance Generator Online | Create Dance Visuals',
    fallbackDescription: 'Use Toolaze AI Dance Generator online to create dance posters, choreography concepts, thumbnails, and social visuals from text prompts.',
  })
}

export default function AiDanceGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-dance-generator" />
}
