import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-static'

export default function GptImage20RedirectPage() {
  permanentRedirect('/model/gpt-image-2')
}
