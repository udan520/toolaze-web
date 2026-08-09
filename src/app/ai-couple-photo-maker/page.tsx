import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-couple-photo-maker', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-couple-photo-maker')
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Couple Photo Maker Online Free - Upload One Photo, Pick a Scene | Toolaze',
    fallbackDescription: 'Use AI Couple Photo Maker online free with Toolaze. Upload one or two couple photos, choose a preset scene, and generate realistic couple images in seconds.',
  })
}

export default function AiCouplePhotoMakerPage() {
  return <ToolL2PageContent locale="en" tool="ai-couple-photo-maker" />
}
