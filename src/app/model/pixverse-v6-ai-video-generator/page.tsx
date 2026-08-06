import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

const slug = 'pixverse-v6-ai-video-generator'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent(slug, 'en')
  const hreflang = generateHreflangAlternates('en', `/model/${slug}`)
  const title = content?.metadata?.title || 'PixVerse V6 AI Video Generator | Toolaze'
  const description =
    content?.metadata?.description ||
    'Create PixVerse V6 AI videos on Toolaze from text prompts or up to two reference images.'

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

export default async function PixVerseV6AiVideoGeneratorModelPage() {
  return <ToolL2PageContent locale="en" tool={slug} />
}
