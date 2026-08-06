import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

const canonical = 'https://toolaze.com/ai-photo-abstract-poster-generator'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('ai-photo-abstract-poster-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/ai-photo-abstract-poster-generator')

  return {
    title:
      content?.metadata?.title ||
      'Photo Abstract Poster Generator | Photo to Memory Panel | Toolaze',
    description:
      content?.metadata?.description ||
      'Upload one photo and create a browser-composed vertical editorial artwork with the original image preserved above, a sparse abstract memory panel below, and a short poetic English title.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical || canonical,
      languages: hreflang.languages,
    },
  }
}

export default function AiPhotoAbstractPosterGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="ai-photo-abstract-poster-generator" />
}
