import ToolL2PageContent from '@/components/blocks/ToolL2PageContent'
import type { Metadata } from 'next'
import { getL2SeoContent } from '@/lib/seo-loader'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getL2SeoContent('emoji-copy-and-paste', 'en')
  return {
    title: content?.metadata?.title || 'Emoji Copy & Paste - Copy Emojis Online Free | Toolaze',
    description: content?.metadata?.description || 'Copy and paste emojis online for free. Browse by category, search, pick skin tone, and copy instantly. No sign-up required.',
    robots: 'index, follow',
    alternates: {
      canonical: 'https://toolaze.com/emoji-copy-and-paste',
    },
  }
}

export default function EmojiCopyAndPastePage() {
  return <ToolL2PageContent locale="en" tool="emoji-copy-and-paste" />
}
