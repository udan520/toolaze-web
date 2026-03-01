import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('seedance-2', 'en')
  const pathWithoutLocale = '/seedance-2'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)
  
  return {
    title: content?.metadata?.title || 'Free Seedance 2.0 AI Video Generator (Online, No Sign Up) - Toolaze',
    description: content?.metadata?.description || 'Create Hollywood-quality 1080p videos with Seedance 2.0 for free. Text, image, video, and audio inputs. Multimodal AI video generation online. No registration required.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Seedance2Page() {
  return <ToolL2PageContent locale="en" tool="seedance-2" />
}
