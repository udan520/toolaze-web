import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('kling-3', 'en')
  const pathWithoutLocale = '/kling-3'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)

  return {
    title: content?.metadata?.title || 'Free Kling 3.0 AI Video Generator (4K, Online, No Sign Up) - Toolaze',
    description: content?.metadata?.description || 'Create 4K AI videos with Kling 3.0 for free. Text, image, video, and audio inputs. Native 4K, 6-shot multi-shot, multilingual audio. Free online AI video generation—coming soon.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Kling3Page() {
  return <ToolL2PageContent locale="en" tool="kling-3" />
}
