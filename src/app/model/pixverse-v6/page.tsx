import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-static'

export default function PixVerseV6RedirectPage() {
  permanentRedirect('/model/pixverse-v6-ai-video-generator')
}
