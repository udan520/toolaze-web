import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('unrestricted-ai-image-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/unrestricted-ai-image-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Unrestricted AI Image Generator Online | Toolaze',
    fallbackDescription: 'Create broader AI image concepts online with text-to-image, image-to-image, direct prompt control, and clear creative boundaries.',
  })
}

export default function UnrestrictedAiImageGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="unrestricted-ai-image-generator" />
}
