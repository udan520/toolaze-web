import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('photo-restoration', 'en')
  return {
    title: content?.metadata?.title || 'Free Photo Restoration Online - Restore Old Photos with AI | Toolaze',
    description: content?.metadata?.description || 'Restore old photos online free with AI. Remove scratches, dust, and noise, and improve details in one click.',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://toolaze.com/photo-restoration',
    },
  }
}

export default function PhotoRestorationPage() {
  return <ToolL2PageContent locale="en" tool="photo-restoration" />
}
