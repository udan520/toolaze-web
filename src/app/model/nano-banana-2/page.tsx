import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('nano-banana-2', 'en')

  return {
    title: content?.metadata?.title || 'Free Nano Banana 2 AI Image Generator (4K, Fast, Online) - Toolaze',
    description: content?.metadata?.description || 'Create 4K AI images with Nano Banana 2 for free. Pro quality at Flash speed. Text-to-image and image-to-image. 5-character consistency, precision text rendering. Free online—coming soon.',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://toolaze.com/model/nano-banana-2',
    },
  }
}

export default async function NanoBanana2Page() {
  const locale = 'en'
  return <ToolL2PageContent locale={locale} tool="nano-banana-2" />
}
