import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('kling-2-6-pro-motion-control', 'en')
  const pathWithoutLocale = '/model/kling-2-6-pro-motion-control'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Kling 2.6 Pro Motion Control AI Video Generator | Toolaze',
    fallbackDescription: 'Create controlled Kling 2.6 videos on Toolaze from text prompts or one reference image.',
  })
}

export default async function Kling26ProMotionControlModelPage() {
  return <ToolL2PageContent locale="en" tool="kling-2-6-pro-motion-control" />
}
