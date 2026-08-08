import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('perm-filter', 'en')
  const hreflang = generateHreflangAlternates('en', '/perm-filter')

  return {
    title:
      content?.metadata?.title ||
      'Free Perm Filter Online | AI Perm Filter | Toolaze',
    description:
      content?.metadata?.description ||
      'Use the free AI Perm Filter. Upload one portrait and preview soft wave, loose digital, curly bob, spiral, Korean volume, and men’s perm styles.',
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default function PermFilterPage() {
  return <ToolL2PageContent locale="en" tool="perm-filter" />
}
