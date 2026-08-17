import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { buildL2SeoMetadata } from '@/lib/l2-seo-metadata'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('emoji-copy-and-paste', 'en')
  const hreflang = generateHreflangAlternates('en', '/emoji-copy-and-paste')

  return buildL2SeoMetadata({
    content,
    hreflang,
    fallbackTitle: 'Emoji Copy & Paste - Copy Emojis Online Free | Toolaze',
    fallbackDescription: 'Copy and paste emojis online for free. Browse by category, search, pick skin tone, and copy instantly. No sign-up required.',
    robots: 'noindex, follow',
  })
}

export default function EmojiCopyAndPastePage() {
  return <ToolL2PageContent locale="en" tool="emoji-copy-and-paste" />
}
