import { GptImage2LandingPage } from '@/components/GptImage2LandingPage'
import { getGptImage2PageMetadata } from '@/lib/gpt-image-2-landing-copy'

export const dynamic = 'force-static'

const pageUrl = 'https://toolaze.com/model/gpt-image-2'

export const metadata = getGptImage2PageMetadata('en', pageUrl)

export default async function GptImage2Page() {
  return <GptImage2LandingPage locale="en" />
}
