import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('talking-avatar-creator', 'en')
  const hreflang = generateHreflangAlternates('en', '/talking-avatar-creator')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'AI Talking Avatar Creator Online | Toolaze',
    fallbackDescription: 'Create an AI talking avatar video from one portrait image and one voice audio file with lip sync, facial motion, and short-form video output.',
  })
}

export default function TalkingAvatarCreatorPage() {
  return <ToolL2PageContent locale="en" tool="talking-avatar-creator" />
}
