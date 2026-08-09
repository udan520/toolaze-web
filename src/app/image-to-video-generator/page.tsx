import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('image-to-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/image-to-video-generator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Image to Video Generator Online | Toolaze',
    fallbackDescription: 'Turn images into short AI videos online with Toolaze. Upload a reference image, describe motion, compare supported models, and generate.',
  })
}

export default function ImageToVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="image-to-video-generator" />
}
