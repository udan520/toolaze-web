import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-hairstyle-changer', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-hairstyle-changer')

  return {
    title:
      content?.metadata?.title ||
      'Free AI Hairstyle Changer Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload one portrait and preview popular hairstyles online with editable presets and prompts.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiHairstyleChangerPage() {
  return <ToolL2PageContent locale="en" tool="ai-hairstyle-changer" />
}
