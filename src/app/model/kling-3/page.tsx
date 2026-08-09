import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('kling-3', 'en')
  const pathWithoutLocale = '/model/kling-3'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Kling 3.0 AI Video Generator (4K, Online, No Sign Up) - Toolaze',
    fallbackDescription: 'Create 4K AI videos with Kling 3.0 for free. Text, image, video, and audio inputs. Native 4K, 6-shot multi-shot, multilingual audio. Free online AI video generation—coming soon.',
  })
}

export default async function Kling3ModelPage() {
  return <ToolL2PageContent locale="en" tool="kling-3" />
}
