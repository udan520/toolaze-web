import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-kissing-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-kissing-video-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Kissing Video Generator Online | Create AI Kiss Videos',
    fallbackDescription: 'Use Toolaze AI Kissing Video Generator online to turn photos into short romantic kiss videos for couple edits, story reels, and social clips.',
  })
}
export default function AiKissingVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-kissing-video-generator" />
}
