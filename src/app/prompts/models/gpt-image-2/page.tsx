import type { Metadata } from 'next'
import PromptLandingPage, { getPromptLandingUrl } from '@/app/prompts/_components/PromptLandingPage'
import { promptLandingConfigs } from '@/app/prompts/_components/promptLandingConfigs'

const config = promptLandingConfigs['gpt-image-2']
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

export default function GptImage2PromptTemplatesPage() {
  return <PromptLandingPage config={config} />
}

