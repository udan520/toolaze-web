import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-hairstyle-changer', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-hairstyle-changer')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free AI Hairstyle Changer Online | Toolaze',
    fallbackDescription: 'Upload one portrait and preview popular hairstyles online with editable presets and prompts.',
  })
}

export default function AiHairstyleChangerPage() {
  return <ToolL2PageContent locale="en" tool="ai-hairstyle-changer" />
}
