import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-dance-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-dance-generator')

  return {
    title:
      content?.metadata?.title ||
      'Free AI Dance Generator Online | Create Dance Visuals',
    description:
      content?.metadata?.description ||
      'Use Toolaze AI Dance Generator online to create dance posters, choreography concepts, thumbnails, and social visuals from text prompts.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiDanceGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-dance-generator" />
}
