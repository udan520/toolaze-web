import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'en'
  const pathWithoutLocale = '/photo-restoration'
  const hreflang = generateHreflangAlternates(locale, pathWithoutLocale)
  const content = await getL2SeoContent('photo-restoration', 'en')
  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Free Photo Restoration Online - Restore Old Photos with AI | Toolaze',
    fallbackDescription: 'Restore old photos online free with AI. Remove scratches, dust, and noise, and improve details in one click.',
  })
}

export default function PhotoRestorationPage() {
  return <ToolL2PageContent locale="en" tool="photo-restoration" />
}
