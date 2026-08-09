import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

const canonical = 'https://toolaze.com/ai-zine-poster-generator'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-zine-poster-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-zine-poster-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Zine Poster Generator | Photo to Paper Poster | Toolaze',
    fallbackDescription: 'Upload one photo and turn the main subject into a quiet zine-style AI poster with paper texture, sparse type, and one vivid color accent.',
  })
}

export default function AiZinePosterGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-zine-poster-generator" />
}
