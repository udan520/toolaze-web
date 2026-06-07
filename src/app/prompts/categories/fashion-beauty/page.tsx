import type { Metadata } from 'next'
import PromptLandingPage, { getPromptLandingUrl } from '@/app/prompts/_components/PromptLandingPage'
import { promptLandingConfigs } from '@/app/prompts/_components/promptLandingConfigs'

const config = promptLandingConfigs['fashion-beauty']
const pageUrl = getPromptLandingUrl(config)

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: config.title.replace(' | Toolaze', ''),
    description: config.description,
    url: pageUrl,
    siteName: 'Toolaze',
    type: 'website',
  },
}

export default function FashionBeautyPromptTemplatesPage() {
  return <PromptLandingPage config={config} />
}

