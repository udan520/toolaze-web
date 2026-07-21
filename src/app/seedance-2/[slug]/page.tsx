import { permanentRedirect } from 'next/navigation'
import { getAllSlugs } from '@/lib/seo-loader'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllSlugs('seedance-2', 'en')
  return [...new Set([...slugs, 'ai-video-generator'])].map((slug) => ({ slug }))
}

export default async function Seedance2SlugRedirect({ params }: PageProps) {
  const { slug } = await params
  if (slug === 'ai-video-generator') {
    permanentRedirect('/model/seedance-2')
  }
  permanentRedirect(`/model/seedance-2/${slug}`)
}
