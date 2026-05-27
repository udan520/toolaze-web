'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { PromptItem } from '@/lib/prompts'

const categoryOrder = [
  'Film & Trailer',
  'Advertising',
  'Character & Portrait',
  'Infographic & Education',
  'UI & Design',
  'Fashion & Beauty',
  'Social Media & Meme',
  'Game & Action',
  'Fantasy & Anime',
  'Lifestyle & Vlog',
  'Art & Illustration',
  'Culture & History',
]

const compactNumber = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const modelStyles: Record<string, { dot: string; active: string; idle: string; ring: string }> = {
  'GPT Image 2': {
    dot: 'bg-sky-400',
    active: 'bg-sky-600 text-white shadow-lg shadow-sky-100',
    idle: 'bg-sky-50 text-sky-700 border-sky-100 hover:border-sky-200 hover:bg-sky-100',
    ring: 'from-sky-500 to-cyan-400',
  },
  'Seedance 2.0': {
    dot: 'bg-indigo-400',
    active: 'bg-indigo-600 text-white shadow-lg shadow-indigo-100',
    idle: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-100',
    ring: 'from-indigo-500 to-violet-500',
  },
  Kling: {
    dot: 'bg-amber-400',
    active: 'bg-amber-500 text-white shadow-lg shadow-amber-100',
    idle: 'bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-200 hover:bg-amber-100',
    ring: 'from-amber-400 to-orange-500',
  },
  'Happy Horse': {
    dot: 'bg-emerald-400',
    active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-100',
    idle: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200 hover:bg-emerald-100',
    ring: 'from-emerald-400 to-teal-500',
  },
}

function formatNumber(value: number | undefined): string {
  return compactNumber.format(Number(value || 0))
}

function MetricIcon({ type, className = 'h-4 w-4' }: { type: 'likes' | 'views' | 'bookmarks'; className?: string }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (type === 'likes') {
    return (
      <svg {...common}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    )
  }

  if (type === 'views') {
    return (
      <svg {...common}>
        <path d="M2.1 12s3.6-6.5 9.9-6.5S21.9 12 21.9 12 18.3 18.5 12 18.5 2.1 12 2.1 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M6 4.8A2.8 2.8 0 0 1 8.8 2h6.4A2.8 2.8 0 0 1 18 4.8V21l-6-3.4L6 21V4.8Z" />
    </svg>
  )
}

function MutedPreviewVideo({ item }: { item: PromptItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.volume = 0
  }, [])

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={item.poster || item.image}
      aria-label={`${item.title} muted preview`}
    >
      <source src={item.videoUrl} type="video/mp4" />
    </video>
  )
}

function MediaPreview({ item, canRenderVideo }: { item: PromptItem; canRenderVideo: boolean }) {
  if (item.videoUrl && canRenderVideo) return <MutedPreviewVideo item={item} />

  return (
    <img
      src={item.poster || item.image}
      alt={item.title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      loading="lazy"
    />
  )
}

type PromptGalleryProps = {
  items?: PromptItem[]
  fetchUrl?: string
}

function PromptCardGrid({ items }: { items: PromptItem[] }) {
  const [canRenderVideo, setCanRenderVideo] = useState(false)

  useEffect(() => {
    setCanRenderVideo(true)
  }, [])

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.tweetId}
          href={`/prompts/${item.tweetId}`}
          className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-50 transition duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/80"
        >
          <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-100">
            <MediaPreview item={item} canRenderVideo={canRenderVideo} />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/70 to-transparent opacity-80" />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className={'rounded-full bg-gradient-to-r px-3 py-1 text-xs font-black text-white shadow-lg ' + (modelStyles[item.model]?.ring || 'from-indigo-500 to-purple-500')}>
                {item.videoUrl ? 'Video' : 'Image'}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="text-xs font-bold opacity-80">@{item.handle || item.author}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black backdrop-blur">Open →</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-slate-900 px-2.5 py-1 text-white">#{item.rank}</span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">{item.model}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">{item.category}</span>
            </div>
            <h3 className="mb-3 line-clamp-2 min-h-[3rem] text-lg font-black leading-tight tracking-tight text-slate-900">{item.title}</h3>
            <p className="mb-4 line-clamp-5 h-[7.5rem] overflow-hidden text-sm leading-6 text-slate-600">
              <strong>Prompt:</strong> {item.prompt}
            </p>
            <div className="mb-3 mt-auto grid grid-cols-3 gap-2 rounded-2xl bg-[#F8FAFF] p-3 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <MetricIcon type="likes" className="h-4 w-4 text-rose-500" />
                <span><strong className="block text-slate-900">{formatNumber(item.likes)}</strong> likes</span>
              </span>
              <span className="flex items-center gap-2">
                <MetricIcon type="views" className="h-4 w-4 text-indigo-500" />
                <span><strong className="block text-slate-900">{formatNumber(item.views)}</strong> views</span>
              </span>
              <span className="flex items-center gap-2">
                <MetricIcon type="bookmarks" className="h-4 w-4 text-amber-500" />
                <span><strong className="block text-slate-900">{formatNumber(item.bookmarks)}</strong> saves</span>
              </span>
            </div>
            <p className="truncate text-xs font-semibold text-slate-400">@{item.handle || item.author} · {item.published}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function RelatedPromptGrid({ items }: { items: PromptItem[] }) {
  if (!items.length) return null

  return <PromptCardGrid items={items} />
}

export default function PromptGallery({ items: initialItems = [], fetchUrl = '/prompts-data.json' }: PromptGalleryProps) {
  const [items, setItems] = useState<PromptItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState(initialItems.length === 0)
  const [model, setModel] = useState('all')
  const [category, setCategory] = useState('All')
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('likes')
  const hasActiveFilters = model !== 'all' || category !== 'All' || query.trim().length > 0 || draftQuery.trim().length > 0

  useEffect(() => {
    if (initialItems.length > 0) return

    let cancelled = false
    setIsLoading(true)
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data: PromptItem[] | { items?: PromptItem[] }) => {
        const nextItems = Array.isArray(data) ? data : data.items
        if (!cancelled) setItems(Array.isArray(nextItems) ? nextItems : [])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [fetchUrl, initialItems.length])

  const models = useMemo(() => ['all', ...Array.from(new Set(items.map((item) => item.model)))], [items])

  const categories = useMemo(() => {
    const modelItems = items.filter((item) => model === 'all' || item.model === model)
    const counts = new Map<string, number>([['All', modelItems.length]])
    modelItems.forEach((item) => counts.set(item.category, (counts.get(item.category) || 0) + 1))

    const ordered = categoryOrder.filter((name) => counts.has(name))
    const extra = [...counts.keys()].filter((name) => name !== 'All' && !categoryOrder.includes(name))
    return ['All', ...ordered, ...extra].map((name) => ({ name, count: counts.get(name) || 0 }))
  }, [items, model])

  const visibleItems = useMemo(() => {
    const needle = query.toLowerCase().trim()
    return items
      .filter((item) => {
        const matchesModel = model === 'all' || item.model === model
        const matchesCategory = category === 'All' || item.category === category
        const haystack = [item.title, item.prompt, item.model, item.category, item.handle, item.published]
          .join(' ')
          .toLowerCase()
        return matchesModel && matchesCategory && (!needle || haystack.includes(needle))
      })
      .sort((a, b) => {
        if (sort === 'rank') return Number(a.rank || 0) - Number(b.rank || 0)
        return Number(b[sort as keyof PromptItem] || 0) - Number(a[sort as keyof PromptItem] || 0)
      })
  }, [category, items, model, query, sort])

  function resetFilters() {
    setModel('all')
    setCategory('All')
    setDraftQuery('')
    setQuery('')
    setSort('likes')
  }

  function submitSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    setQuery(draftQuery.trim())
  }

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="sticky top-[70px] z-30 mb-8 rounded-[2rem] border border-indigo-100/80 bg-white/90 p-3 shadow-xl shadow-indigo-100/50 backdrop-blur-xl">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_auto] lg:items-center">
            <form className="relative block" onSubmit={submitSearch}>
              <label htmlFor="prompt-search" className="sr-only">Search prompts</label>
              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
                </svg>
              </span>
              <input
                id="prompt-search"
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
                placeholder="Search by prompt, creator, model, or category"
                className="w-full rounded-[1.4rem] border border-transparent bg-[#F8FAFF] py-4 pl-12 pr-28 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-indigo-600"
              >
                Search
              </button>
            </form>

            <label className="relative block">
              <span className="sr-only">Sort templates</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full appearance-none rounded-[1.4rem] border border-indigo-100 bg-white px-5 py-4 text-sm font-black text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="likes">Most liked</option>
                <option value="views">Most viewed</option>
                <option value="bookmarks">Most saved</option>
                <option value="rank">Rank</option>
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">⌄</span>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters && sort === 'likes'}
              className="rounded-[1.4rem] border border-slate-200 px-5 py-4 text-sm font-black text-slate-600 transition enabled:hover:border-slate-900 enabled:hover:bg-slate-900 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-xs font-black tracking-[0.08em] text-slate-400">Models</p>
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          {models.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={model === name}
              onClick={() => {
                setModel(name)
                setCategory('All')
              }}
              className={
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition duration-200 active:scale-95 ' +
                (model === name
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50')
              }
            >
              <span className={'h-2 w-2 rounded-full ' + (model === name ? 'bg-white/70' : 'bg-slate-300')} />
              {name === 'all' ? 'All Models' : name}
              {model === name ? <span className="text-xs opacity-70">✓</span> : null}
            </button>
          ))}
        </div>

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={category === item.name}
              onClick={() => setCategory(item.name)}
              className={
                'shrink-0 rounded-full border px-4 py-2 text-xs font-black transition duration-200 active:scale-95 ' +
                (category === item.name
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700')
              }
            >
              {item.name} <span className={category === item.name ? 'opacity-70' : 'text-slate-400'}>{item.count}</span>
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Prompt templates</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {isLoading ? 'Loading templates...' : `${visibleItems.length} templates`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-sm shadow-indigo-50">
                <div className="aspect-[4/3] animate-pulse bg-indigo-50" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                  <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && visibleItems.length === 0 ? (
          <div className="rounded-[2rem] border border-indigo-100 bg-[#F8FAFF] p-10 text-center text-sm font-semibold text-slate-500">
            No matching templates.
          </div>
        ) : null}

        <PromptCardGrid items={visibleItems} />
      </div>
    </section>
  )
}
