import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { getL2SeoContent } from '@/lib/seo-loader'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('kling-ai-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/kling-ai-video-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Kling AI Video Generator Online | Toolaze',
    fallbackDescription: 'Create short AI videos with Kling 3.0 from text or reference images in Toolaze.',
  })
}

export default function KlingAiVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="kling-ai-video-generator" />
}
