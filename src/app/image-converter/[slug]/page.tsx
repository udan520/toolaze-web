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
  const slugs = await getAllSlugs('image-converter', 'en')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const content = await getSeoContent('image-converter', resolvedParams.slug, 'en')
  
  if (!content) {
    return {
      title: 'Tool Not Found | Toolaze',
      robots: 'index, follow',
    }
  }
  
  const pathWithoutLocale = `/image-converter/${resolvedParams.slug}`
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
      tool="image-converter"
      slug={resolvedParams.slug}
    />
  )
}
