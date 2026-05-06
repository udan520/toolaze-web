import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('gpt-image-2', 'en')

  return {
    title: content?.metadata?.title || 'GPT Image 2 - Free AI Image Generator (Text to Image & Image to Image) | Toolaze',
    description: content?.metadata?.description || 'Use GPT Image 2 online for free on Toolaze. Generate images from text or transform existing images with fast, high-quality output.',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://toolaze.com/model/gpt-image-2',
    },
  }
}

export default async function GptImage2Page() {
  const locale = 'en'
  return <ToolL2PageContent locale={locale} tool="gpt-image-2" />
}
