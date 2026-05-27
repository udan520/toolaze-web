import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PromptDetail from '@/components/prompts/PromptDetail'
import { RelatedPromptGrid } from '@/components/prompts/PromptGallery'
import { getPromptItem, getPromptItems, getRelatedPromptItems } from '@/lib/prompts'

type PromptDetailPageProps = {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return getPromptItems().map((item) => ({ id: item.tweetId }))
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const item = getPromptItem(id)
  if (!item) return {}

  return {
    title: `${item.title} Prompt - Toolaze`,
    description: item.prompt.slice(0, 150),
    alternates: {
      canonical: `https://toolaze.com/prompts/${item.tweetId}`,
    },
  }
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { id } = await params
  const item = getPromptItem(id)
  if (!item) notFound()

  const relatedItems = getRelatedPromptItems(item)

  return (
    <>
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
        {relatedItems.length > 0 ? (
          <section className="bg-[#F8FAFF] px-6 py-16" aria-label="Related templates">
            <div className="mx-auto max-w-6xl">
              <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-900">Related templates</h2>
              <RelatedPromptGrid items={relatedItems} />
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
