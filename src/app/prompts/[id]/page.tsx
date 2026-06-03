import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PromptDetail from '@/components/prompts/PromptDetail'
import RelatedTemplatesLoader from '@/components/prompts/RelatedTemplatesLoader'
import { getPromptItem, getPromptItems } from '@/lib/prompts'

type PromptDetailPageProps = {
  params: Promise<{ id: string }>
}

const baseUrl = 'https://toolaze.com'

export function generateStaticParams() {
  return getPromptItems().map((item) => ({ id: item.tweetId }))
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const item = getPromptItem(id)
  if (!item) return {}

  const description = `Copy this ${item.model} prompt for ${item.category.toLowerCase()}. Source-backed from X with original media, result preview, likes, views and related templates.`
  const previewImage = item.resultImage || item.poster || item.image || item.originalImage

  return {
    title: `${item.title} Prompt for ${item.model} | Toolaze`,
    description,
    alternates: {
      canonical: `${baseUrl}/prompts/${item.tweetId}`,
    },
    openGraph: {
      title: `${item.title} Prompt for ${item.model}`,
      description,
      url: `${baseUrl}/prompts/${item.tweetId}`,
      siteName: 'Toolaze',
      type: 'article',
      images: previewImage ? [{ url: previewImage, alt: item.title }] : undefined,
    },
  }
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { id } = await params
  const item = getPromptItem(id)
  if (!item) notFound()

  const previewImages = [item.originalImage, item.resultImage, item.poster, item.image].filter(Boolean)
  const promptUrl = `${baseUrl}/prompts/${item.tweetId}`
  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${item.title} Prompt for ${item.model}`,
    headline: item.title,
    description: `Source-backed ${item.model} prompt for ${item.category.toLowerCase()} AI creation.`,
    url: promptUrl,
    text: item.prompt,
    image: previewImages,
    creator: item.handle || item.author ? {
      '@type': 'Person',
      name: item.handle ? `@${item.handle}` : item.author,
      url: item.authorUrl,
    } : undefined,
    isBasedOn: item.sourceUrl,
    genre: item.category,
    keywords: [item.model, item.category, 'AI prompt template', 'image prompt', 'video prompt'].join(', '),
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: Number(item.likes || 0),
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: Number(item.views || 0),
      },
    ],
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Prompts', item: `${baseUrl}/prompts` },
      { '@type': 'ListItem', position: 3, name: item.title, item: promptUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navigation />
      <main className="min-h-screen bg-[#F8FAFF]">
        <div className="mx-auto max-w-6xl px-6 pb-4 pt-10">
          <Link href="/prompts" className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 transition-colors hover:text-indigo-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Prompt Library
          </Link>
        </div>
        <PromptDetail item={item} />
        <RelatedTemplatesLoader baseItem={item} />
      </main>
      <Footer />
    </>
  )
}
