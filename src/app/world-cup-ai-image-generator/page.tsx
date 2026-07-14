import type { Metadata } from 'next'
import WorldCupAiImageGeneratorPageContent from '@/components/WorldCupAiImageGeneratorPageContent'
import { getWorldCupPageCopy } from './copy'

export const dynamic = 'force-static'

const rootPageCopy = getWorldCupPageCopy('en')

export const metadata: Metadata = {
  title: rootPageCopy.metadata.title,
  description: rootPageCopy.metadata.description,
  robots: 'index, follow',
  alternates: {
    canonical: 'https://toolaze.com/world-cup-ai-image-generator',
  },
}

export default async function WorldCupAiImageGeneratorPage() {
  return <WorldCupAiImageGeneratorPageContent locale="en" />
}
