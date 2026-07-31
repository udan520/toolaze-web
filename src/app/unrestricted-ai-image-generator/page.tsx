import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('unrestricted-ai-image-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/unrestricted-ai-image-generator')

  return {
    title:
      content?.metadata?.title ||
      'Unrestricted AI Image Generator Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Create broader AI image concepts online with text-to-image, image-to-image, direct prompt control, and clear creative boundaries.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function UnrestrictedAiImageGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="unrestricted-ai-image-generator" />
}
