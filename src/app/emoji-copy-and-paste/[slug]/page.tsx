import ToolSlugPageContent from '@/app/[locale]/[tool]/[slug]/ToolSlugPageContent'
import { getAllSlugs, getSeoContent } from '@/lib/seo-loader'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllSlugs('emoji-copy-and-paste', 'en')
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const content = await getSeoContent('emoji-copy-and-paste', resolvedParams.slug, 'en')

  if (!content) {
    return {
      title: 'Emoji Copy & Paste | Toolaze',
      robots: 'index, follow',
    }
  }

  const baseUrl = 'https://toolaze.com'
  const canonical = `${baseUrl}/emoji-copy-and-paste/${resolvedParams.slug}`

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    robots: 'index, follow',
    alternates: {
      canonical,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  return (
    <ToolSlugPageContent
      locale="en"
      tool="emoji-copy-and-paste"
      slug={resolvedParams.slug}
    />
  )
}
