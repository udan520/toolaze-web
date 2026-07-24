import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('text-to-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/text-to-video-generator')

  return {
    title: content?.metadata?.title || 'Text to Video Generator Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Create short AI videos from text prompts in your browser. Compare models, prompt styles, aspect ratios, durations, and credit requirements on Toolaze.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function TextToVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="text-to-video-generator" />
}
