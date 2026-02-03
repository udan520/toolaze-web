import ToolSlugPageContent from '@/app/[locale]/[tool]/[slug]/ToolSlugPageContent'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// 确保静态生成
export const dynamic = 'force-static'
export const dynamicParams = false

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
  
  // Font Generator 不支持多语言，只设置 canonical URL，不设置 hreflang languages
  const baseUrl = 'https://toolaze.com'
  const canonical = `${baseUrl}/font-generator/${resolvedParams.slug}`
  
  return {
    title: content.metadata.title,
    description: content.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical: canonical,
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
