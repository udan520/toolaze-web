import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('text-to-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/text-to-video-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Text to Video Generator Online | Toolaze',
    fallbackDescription: 'Create short AI videos from text prompts in your browser. Compare models, prompt styles, aspect ratios, durations, and credit requirements on Toolaze.',
  })
}

export default function TextToVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="text-to-video-generator" />
}
