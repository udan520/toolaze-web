import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('font-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/font-generator')
  
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Font Generator - Create Custom Fonts Online | Toolaze',
    fallbackDescription: 'Generate custom fonts online for free. Create cursive, fancy, bold, italic, gothic, and tattoo fonts. Copy and paste instantly. No sign-up required.',
  })
}

export default function FontGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="font-generator" />
}
