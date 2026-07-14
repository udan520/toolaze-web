import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-hair-color-changer', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-hair-color-changer')

  return {
    title:
      content?.metadata?.title ||
      'AI Hair Color Changer Online - Change Hair Color with AI | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload a portrait and preview new hair colors online with AI image-to-image editing.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiHairColorChangerPage() {
  return <ToolL2PageContent locale="en" tool="ai-hair-color-changer" />
}
