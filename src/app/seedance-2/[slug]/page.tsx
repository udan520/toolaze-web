import { permanentRedirect } from 'next/navigation'
import { LEGACY_SEEDANCE_2_L3_SLUGS } from '@/lib/seedance-2-legacy-routes'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return LEGACY_SEEDANCE_2_L3_SLUGS.map((slug) => ({ slug }))
}

export default async function Seedance2SlugRedirect({ params }: PageProps) {
  await params
  permanentRedirect('/model/seedance-2')
}
