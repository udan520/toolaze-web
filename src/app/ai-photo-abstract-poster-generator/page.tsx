import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

const canonical = 'https://toolaze.com/ai-photo-abstract-poster-generator'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-photo-abstract-poster-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-photo-abstract-poster-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Photo Abstract Poster Generator | Photo to Memory Panel | Toolaze',
    fallbackDescription: 'Upload one photo and create a browser-composed vertical editorial artwork with the original image preserved above, a sparse abstract memory panel below, and a short poetic English title.',
  })
}

export default function AiPhotoAbstractPosterGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-photo-abstract-poster-generator" />
}
