import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-clothes-changer', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-clothes-changer')

  return {
    title:
      content?.metadata?.title ||
      'Free AI Clothes Changer Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload one photo and preview AI outfit changes online with virtual try-on style prompts.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiClothesChangerPage() {
  return <ToolL2PageContent locale="en" tool="ai-clothes-changer" />
}
