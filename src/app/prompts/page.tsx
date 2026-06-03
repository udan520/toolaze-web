import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PromptGallery from '@/components/prompts/PromptGallery'
import {
  getPromptItems,
  getPromptStats,
} from '@/lib/prompts'

export const metadata: Metadata = {
  title: 'AI Image & Video Prompt Templates | Seedance, Kling, GPT Image 2',
  description:
    'Copy source-backed AI prompt templates from X for Seedance 2.0, Kling, GPT Image 2, Nano Banana, Happy Horse and more. Filter by model, use case, likes and views.',
  alternates: {
    canonical: 'https://toolaze.com/prompts',
  },
  openGraph: {
    title: 'AI Image & Video Prompt Templates | Toolaze',
    description:
      'Browse source-backed AI image and video prompts from X. Copy templates for Seedance 2.0, Kling, GPT Image 2, Nano Banana, Happy Horse and more.',
    url: 'https://toolaze.com/prompts',
    siteName: 'Toolaze',
    type: 'website',
  },
}

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export default function PromptsPage() {
  const items = getPromptItems()
  const stats = getPromptStats(items)
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Image and Video Prompt Templates',
    description: metadata.description,
    url: 'https://toolaze.com/prompts',
    numberOfItems: items.length,
    itemListElement: items.slice(0, 30).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://toolaze.com/prompts/${item.tweetId}`,
      name: `${item.title} Prompt for ${item.model}`,
    })),
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolaze.com' },
      { '@type': 'ListItem', position: 2, name: 'Prompts', item: 'https://toolaze.com/prompts' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navigation />
      <main className="min-h-screen bg-[#F8FAFF]">
        <header className="relative overflow-hidden bg-[#F8FAFF] px-6 py-20 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(99,102,241,0.20),transparent_28%),radial-gradient(circle_at_86%_22%,rgba(168,85,247,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(238,242,255,0.68))]" />
          <div className="absolute -left-20 top-28 h-72 w-72 rounded-full border border-indigo-200/70 bg-white/30 blur-sm" />
          <div className="absolute right-10 top-16 hidden h-44 w-44 rotate-12 rounded-[3rem] border border-purple-200/70 bg-white/40 shadow-2xl shadow-indigo-100 md:block" />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-black tracking-[0.08em] text-indigo-600 shadow-sm shadow-indigo-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.16)]" />
              Prompts
            </div>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
              <div>
                <h1 className="home-section-title mb-5 max-w-4xl text-[42px] leading-[1.04] tracking-tight text-slate-950 md:text-[64px]">
                  AI Image And Video Prompt Templates From X
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  Copy battle-tested prompts for Seedance 2.0, Kling, GPT Image 2, Nano Banana and more. Browse source-backed examples by model, use case, and performance.
                </p>
              </div>
              <div className="rounded-[2.25rem] border border-white/80 bg-white/80 p-4 shadow-2xl shadow-indigo-100/80 backdrop-blur">
                <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-black tracking-[0.08em] text-indigo-200">Live Index</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <strong className="block text-3xl font-black">{stats.total}</strong>
                      <span className="text-xs font-bold text-white/45">Templates</span>
                    </div>
                    <div>
                      <strong className="block text-3xl font-black">{compactNumber.format(stats.likes)}</strong>
                      <span className="text-xs font-bold text-white/45">Likes</span>
                    </div>
                    <div>
                      <strong className="block text-3xl font-black">{compactNumber.format(stats.views)}</strong>
                      <span className="text-xs font-bold text-white/45">Views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <PromptGallery items={items} />
      </main>
      <Footer />
    </>
  )
}
