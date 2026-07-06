import type { Metadata } from 'next'
import { AiImageGeneratorPageContent } from '@/components/AiImageGeneratorPageContent'
import { getAiImageGeneratorPageCopy } from './copy'

export const dynamic = 'force-static'

const copy = getAiImageGeneratorPageCopy('en')

export const metadata: Metadata = {
  title: copy.metadata.title,
  description: copy.metadata.description,
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/ai-image-generator',
  },
  openGraph: {
    type: 'website',
    url: 'https://toolaze.com/ai-image-generator',
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

export default async function AiImageGeneratorPage() {
  return <AiImageGeneratorPageContent locale="en" />
}
