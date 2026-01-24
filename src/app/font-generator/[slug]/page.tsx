import ToolSlugPageContent from '@/app/[locale]/[tool]/[slug]/ToolSlugPageContent'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs('font-generator', 'en')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const content = await getSeoContent('font-generator', resolvedParams.slug, 'en')
  
  if (!content) {
    return {
      title: 'Font Generator Tool Not Found | Toolaze',
      robots: 'index, follow',
    }
  }
  
  const pathWithoutLocale = `/font-generator/${resolvedParams.slug}`
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
  return (
    <ToolSlugPageContent 
      locale="en"
      tool="font-generator"
      slug={resolvedParams.slug}
    />
  )
}
