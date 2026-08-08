import ToolSlugPageContent from '@/app/[locale]/[tool]/[slug]/ToolSlugPageContent'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import { generateHreflangAlternates } from '@/lib/hreflang'
import { isRetainedUtilityL3 } from '@/lib/utility-seo-routes'
import { permanentRedirect } from 'next/navigation'
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
  const slugs = await getAllSlugs('image-compressor', 'en')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params

  if (!isRetainedUtilityL3('image-compressor', resolvedParams.slug)) {
    return {
      title: 'Redirecting to Image Compressor | Toolaze',
      robots: { index: false, follow: true },
      alternates: { canonical: 'https://toolaze.com/image-compressor' },
    }
  }

  const content = await getSeoContent('image-compressor', resolvedParams.slug, 'en')
  
  if (!content) {
    return {
      title: 'Tool Not Found | Toolaze',
      robots: 'index, follow',
    }
  }
  
  const pathWithoutLocale = `/image-compressor/${resolvedParams.slug}`
  const hreflang = generateHreflangAlternates('en', pathWithoutLocale, ['en'])
  
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

  if (!isRetainedUtilityL3('image-compressor', resolvedParams.slug)) {
    permanentRedirect('/image-compressor')
  }

  return (
    <ToolSlugPageContent 
      locale="en"
      tool="image-compressor"
      slug={resolvedParams.slug}
    />
  )
}
