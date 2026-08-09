import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('seedance-2-5', 'en')
  const pathWithoutLocale = '/model/seedance-2-5'
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)
  const title = content?.metadata?.title || 'Seedance 2.5 AI Video Generator | Toolaze'
  const description = content?.metadata?.description || 'Explore Seedance 2.5 for longer AI videos, richer reference control, and production-ready creative workflows.'

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: title,
    fallbackDescription: description,
  })
}

export default async function Seedance25ModelPage() {
  return <ToolL2PageContent locale="en" tool="seedance-2-5" />
}
