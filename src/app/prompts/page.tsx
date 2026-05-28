import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PromptGallery from '@/components/prompts/PromptGallery'
import { getPromptItems, getPromptStats } from '@/lib/prompts'

export const metadata: Metadata = {
  title: 'AI Prompt Templates - Toolaze',
  description:
    'Explore X-sourced AI prompt templates for Seedance 2.0, Kling, GPT Image 2, Nano Banana, Happy Horse, product ads, memes, video concepts, and image generation workflows.',
  alternates: {
    canonical: 'https://toolaze.com/prompts',
  },
}

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export default function PromptsPage() {
  const items = getPromptItems()
  const stats = getPromptStats(items)
  const models = Array.from(new Set(items.map((item) => item.model))).slice(0, 5)

  return (
    <>
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
                  Battle-tested prompts for AI image and video creation
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  Browse source-backed templates from original X posts, compare outcomes, copy prompts, and filter by model, category, or performance.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {models.map((model) => (
                    <span key={model} className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm shadow-indigo-100">
                      {model}
                    </span>
                  ))}
                </div>
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
        <PromptGallery />
      </main>
      <Footer />
    </>
  )
}
