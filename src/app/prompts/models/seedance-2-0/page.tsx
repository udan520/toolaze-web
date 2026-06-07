import type { Metadata } from 'next'
import PromptLandingPage, { getPromptLandingUrl } from '@/app/prompts/_components/PromptLandingPage'
import { promptLandingConfigs } from '@/app/prompts/_components/promptLandingConfigs'

const config = promptLandingConfigs['seedance-2-0']
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

export default function SeedancePromptTemplatesPage() {
  return <PromptLandingPage config={config} />
}
