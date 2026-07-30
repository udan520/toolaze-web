import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-asmr-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-asmr-video-generator')
  return {
    title: content?.metadata?.title || 'AI ASMR Video Generator with Sound | Toolaze',
    description: content?.metadata?.description || 'Create tactile AI ASMR videos with synchronized sound from text or an image.',
    robots: 'index, follow',
    alternates: { canonical: hreflang.canonical, languages: hreflang.languages },
  }
}

export default function AiAsmrVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-asmr-video-generator" />
}
