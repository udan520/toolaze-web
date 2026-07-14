import { Seedream50ProLandingPage } from '@/components/Seedream50ProLandingPage'
import { getSeedream50ProPageMetadata } from '@/lib/seedream-5-0-pro-landing-copy'

export const metadata = getSeedream50ProPageMetadata('en')

export default function Seedream50ProPage() {
  return <Seedream50ProLandingPage />
}
