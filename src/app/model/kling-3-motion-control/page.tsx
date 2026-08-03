import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

const slug = 'kling-3-motion-control'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent(slug, 'en')
  const hreflang = generateHreflangAlternates('en', `/model/${slug}`)

  return {
    title: content?.metadata?.title || 'Kling 3 Motion Control AI Video Generator | Toolaze',
    description: content?.metadata?.description || 'Create Kling 3 Motion Control videos with one character image and one motion reference video at 720p or 1080p on Toolaze.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Kling3MotionControlModelPage() {
  return <ToolL2PageContent locale="en" tool={slug} />
}
