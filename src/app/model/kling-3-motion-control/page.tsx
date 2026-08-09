import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

const slug = 'kling-3-motion-control'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent(slug, 'en')
  const hreflang = generateHreflangAlternates('en', `/model/${slug}`)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Kling 3 Motion Control AI Video Generator | Toolaze',
    fallbackDescription: 'Create Kling 3 Motion Control videos with one character image and one motion reference video at 720p or 1080p on Toolaze.',
  })
}

export default async function Kling3MotionControlModelPage() {
  return <ToolL2PageContent locale="en" tool={slug} />
}
