import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-asmr-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-asmr-video-generator')
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI ASMR Video Generator with Sound | Toolaze',
    fallbackDescription: 'Create tactile AI ASMR videos with synchronized sound from text or an image.',
  })
}

export default function AiAsmrVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-asmr-video-generator" />
}
