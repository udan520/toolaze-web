import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-couple-photo-maker', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-couple-photo-maker')
  return {
    title:
      content?.metadata?.title ||
      'AI Couple Photo Maker Online Free - Upload One Photo, Pick a Scene | Toolaze',
    description:
      content?.metadata?.description ||
      'Use AI Couple Photo Maker online free with Toolaze. Upload one or two couple photos, choose a preset scene, and generate realistic couple images in seconds.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiCouplePhotoMakerPage() {
  return <ToolL2PageContent locale="en" tool="ai-couple-photo-maker" />
}
