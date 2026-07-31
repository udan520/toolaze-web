import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('talking-avatar-creator', 'en')
  const hreflang = generateHreflangAlternates('en', '/talking-avatar-creator')

  return {
    title: content?.metadata?.title || 'AI Talking Avatar Creator Online | Toolaze',
    description:
      content?.metadata?.description ||
      'Create an AI talking avatar video from one portrait image and one voice audio file with lip sync, facial motion, and short-form video output.',
    robots: 'index, follow',
    alternates: { canonical: hreflang.canonical, languages: hreflang.languages },
  }
}

export default function TalkingAvatarCreatorPage() {
  return <ToolL2PageContent locale="en" tool="talking-avatar-creator" />
}
