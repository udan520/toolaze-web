import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('nano-banana-2', 'en')
  const hreflang = generateHreflangAlternates('en', '/model/nano-banana-2')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Nano Banana 2 AI Image Generator (4K, Fast, Online) - Toolaze',
    fallbackDescription: 'Create 4K AI images with Nano Banana 2 for free. Pro quality at Flash speed. Text-to-image and image-to-image. 5-character consistency, precision text rendering. Free online—coming soon.',
  })
}

export default async function NanoBanana2Page() {
  const locale = 'en'
  return <ToolL2PageContent locale={locale} tool="nano-banana-2" />
}
