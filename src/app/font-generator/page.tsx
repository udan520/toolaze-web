import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('font-generator', 'en')
  
  return {
    title: content?.metadata?.title || 'Free Font Generator - Create Custom Fonts Online | Toolaze',
    description: content?.metadata?.description || 'Generate custom fonts online for free. Create cursive, fancy, bold, italic, gothic, and tattoo fonts. Copy and paste instantly. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://toolaze.com/font-generator',
    },
  }
}

export default function FontGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="font-generator" />
}
