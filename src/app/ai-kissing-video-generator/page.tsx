import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-kissing-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-kissing-video-generator')

  return {
    title:
      content?.metadata?.title ||
      'AI Kissing Video Generator Online | Create AI Kiss Videos',
    description:
      content?.metadata?.description ||
      'Use Toolaze AI Kissing Video Generator online to turn photos into short romantic kiss videos for couple edits, story reels, and social clips.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}
export default function AiKissingVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-kissing-video-generator" />
}
