import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

const slug = 'veo-3-1-ai-video-generator'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent(slug, 'en')
  const hreflang = generateHreflangAlternates('en', `/model/${slug}`)
  const title = content?.metadata?.title || 'Veo 3.1 AI Video Generator | Toolaze'
  const description =
    content?.metadata?.description ||
    'Create Veo 3.1 AI videos on Toolaze from text prompts or first and last frame image inputs.'

  return {
    title,
    description,
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Veo31AiVideoGeneratorModelPage() {
  return <ToolL2PageContent locale="en" tool={slug} />
}
