import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { getL2SeoContent } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('kling-ai-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/kling-ai-video-generator')

  return {
    title: content?.metadata?.title || 'Kling AI Video Generator Online | Toolaze',
    description: content?.metadata?.description || 'Create short AI videos with Kling 3.0 from text or reference images in Toolaze.',
    robots: 'index, follow',
    alternates: { canonical: hreflang.canonical, languages: hreflang.languages },
  }
}

export default function KlingAiVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="kling-ai-video-generator" />
}
