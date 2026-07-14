import type { Metadata } from 'next'
import { AiImageGeneratorPageContent } from '@/components/AiImageGeneratorPageContent'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { getTextToImageGeneratorPageCopy } from './copy'

export const dynamic = 'force-static'

const copy = getTextToImageGeneratorPageCopy()
const pageUrl = 'https://toolaze.com/text-to-image-generator'
const hreflang = generateHreflangAlternates('en', '/text-to-image-generator')

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  robots: 'index, follow',
  alternates: {
    canonical: hreflang.canonical,
    languages: hreflang.languages,
  },
  openGraph: {
    type: 'website',
    url: pageUrl,
    siteName: 'Toolaze',
    title: copy.metadata.title,
    description: copy.metadata.description,
    images: [
      {
        url: 'https://toolaze.com/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Toolaze Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.metadata.title,
    description: copy.metadata.description,
    images: ['https://toolaze.com/web-app-manifest-512x512.png'],
  },
}

export default async function TextToImageGeneratorPage() {
  return (
    <AiImageGeneratorPageContent
      locale="en"
      pageCopy={copy}
      toolId="text-to-image-generator-tool"
      heroPrefix=""
      dailyLimitStorageKey="text_to_image_generator_last_used_date"
      pageUrl={pageUrl}
      contentOrder="text-to-image"
    />
  )
}
