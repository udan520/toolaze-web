import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-video-generator')

  return {
    title: content?.metadata?.title || 'AI Video Generator Free Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Create AI videos online with Toolaze. Start from text, images, video clips, or audio references and generate short video ideas.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-video-generator" />
}
