import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('seedance-2', 'en')
  const pathWithoutLocale = '/model/seedance-2'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Seedance 2.0 AI Video Generator (Online, No Sign Up) - Toolaze',
    fallbackDescription: 'Create Hollywood-quality 1080p videos with Seedance 2.0 for free. Text, image, video, and audio inputs. Multimodal AI video generation online. No registration required.',
  })
}

export default async function Seedance2ModelPage() {
  return <ToolL2PageContent locale="en" tool="seedance-2" />
}
