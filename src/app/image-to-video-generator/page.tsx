import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('image-to-video-generator', 'en')
  const hreflang = generateHreflangAlternates('en', '/image-to-video-generator')

  return {
    title: content?.metadata?.title || 'Image to Video Generator Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Turn images into short AI videos online with Toolaze. Upload a reference image, describe motion, compare supported models, and generate.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function ImageToVideoGeneratorPage() {
  return <ToolL2PageContent locale="en" tool="image-to-video-generator" />
}
