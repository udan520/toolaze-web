import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-static'

export default function HappyHorse11RedirectPage() {
  permanentRedirect('/model/happyhorse-ai-video-generator')
}
