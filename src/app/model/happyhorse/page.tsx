import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-static'

export default function HappyHorseRedirectPage() {
  permanentRedirect('/model/happyhorse-ai-video-generator')
}
