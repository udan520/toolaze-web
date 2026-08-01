import { getAllSlugs } from '@/lib/seo-loader'
import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllSlugs('seedance-2', 'en')
  return [...new Set([...slugs, 'ai-video-generator'])].map((slug) => ({ slug }))
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Redirecting to Seedance 2.0 | Toolaze',
    robots: { index: false, follow: true },
    alternates: {
      canonical: 'https://toolaze.com/model/seedance-2',
    },
  }
}

export default async function Seedance2ModelSlugRedirect({ params }: PageProps) {
  await params
  permanentRedirect('/model/seedance-2')
}
