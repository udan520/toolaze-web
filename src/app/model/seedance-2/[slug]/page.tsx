import ToolSlugPageContent from '@/app/[locale]/[tool]/[slug]/ToolSlugPageContent'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (resolvedParams.slug === 'ai-video-generator') {
    return {
      title: 'Seedance 2.0 AI Video Generator | Toolaze',
      robots: { index: false, follow: true },
      alternates: {
        canonical: 'https://toolaze.com/model/seedance-2',
      },
    }
  }

  const content = await getSeoContent('seedance-2', resolvedParams.slug, 'en')

  if (!content) {
    return {
      title: 'Tool Not Found | Toolaze',
      robots: 'index, follow',
    }
  }

  const pathWithoutLocale = `/model/seedance-2/${resolvedParams.slug}`
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: hreflang.canonical,
      languages: hreflang.languages,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  if (resolvedParams.slug === 'ai-video-generator') {
    permanentRedirect('/model/seedance-2')
  }

  return (
    <ToolSlugPageContent
      locale="en"
      tool="seedance-2"
      slug={resolvedParams.slug}
    />
  )
}
