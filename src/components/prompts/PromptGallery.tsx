'use client'

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
  'Workflow & Utility',
  'General',
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

function formatMetric(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-'
  return compactNumber.format(value)
}

function MetricIcon({ type, className = 'h-4 w-4' }: { type: 'likes' | 'views' | 'reposts' | 'bookmarks'; className?: string }) {
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

  if (type === 'reposts') {
    return (
      <svg {...common}>
        <path d="M17 2.5 21 6.5 17 10.5" />
        <path d="M3 11V8.5a2 2 0 0 1 2-2h16" />
        <path d="M7 21.5 3 17.5 7 13.5" />
        <path d="M21 13v2.5a2 2 0 0 1-2 2H3" />
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

function MediaPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.16),transparent_28%),linear-gradient(135deg,#f8faff,#eef2ff)] p-6 text-center">
      <div>
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-black text-indigo-500 shadow-sm shadow-indigo-100">
          AI
        </span>
        <p className="line-clamp-2 text-sm font-black text-slate-700">{title}</p>
        <p className="mt-1 text-xs font-semibold text-slate-400">Prompt only</p>
      </div>
    </div>
  )
}

function MediaPreview({ item, canRenderVideo }: { item: PromptItem; canRenderVideo: boolean }) {
  if (item.videoUrl && canRenderVideo) return <MutedPreviewVideo item={item} />

  const previewImage = item.poster || item.image || item.resultImage || item.originalImage
  if (!previewImage) return <MediaPlaceholder title={item.title} />

  return (
    <img
      src={previewImage}
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
        <PromptCard key={item.tweetId} item={item} canRenderVideo={canRenderVideo} />
      ))}
    </div>
  )
}

function PromptCard({ item, canRenderVideo }: { item: PromptItem; canRenderVideo: boolean }) {
  const metrics = [
    { type: 'likes' as const, label: 'likes', value: item.likes, iconClass: 'text-rose-500' },
    { type: 'views' as const, label: 'views', value: item.views, iconClass: 'text-indigo-500' },
    { type: 'reposts' as const, label: 'reposts', value: item.retweets, iconClass: 'text-emerald-500' },
    { type: 'bookmarks' as const, label: 'bookmarks', value: item.bookmarks, iconClass: 'text-amber-500' },
  ]

  return (
    <a
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
        <div className="mb-3 mt-auto grid grid-cols-4 gap-1 rounded-2xl bg-[#F8FAFF] p-3 text-[11px] text-slate-500">
          {metrics.map((metric) => (
            <span key={metric.type} className="flex min-w-0 items-center gap-1.5">
              <MetricIcon type={metric.type} className={`h-3.5 w-3.5 shrink-0 ${metric.iconClass}`} />
              <span className="min-w-0 truncate">
                <strong className="block text-xs text-slate-900">{formatMetric(metric.value)}</strong> {metric.label}
              </span>
            </span>
          ))}
        </div>
        <p className="truncate text-xs font-semibold text-slate-400">@{item.handle || item.author} · {item.published}</p>
      </div>
    </a>
  )
}

export function RelatedPromptGrid({ items }: { items: PromptItem[] }) {
  if (!items.length) return null

  return <PromptCardGrid items={items} />
}

export default function PromptGallery({ items: initialItems = [], fetchUrl = '/prompts-data.json' }: PromptGalleryProps) {
  const categoryScrollerRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<PromptItem[]>(initialItems)
  const [isLoading, setIsLoading] = useState(initialItems.length === 0)
  const [model, setModel] = useState('all')
  const [category, setCategory] = useState('All')
  const [draftQuery, setDraftQuery] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('likes')
  const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] = useState(false)
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] = useState(false)
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

  useEffect(() => {
    const scroller = categoryScrollerRef.current
    if (!scroller) return

    function updateCategoryScrollState(currentScroller: HTMLDivElement) {
      const nextCanScrollLeft = currentScroller.scrollLeft > 4
      const nextCanScrollRight = currentScroller.scrollLeft + currentScroller.clientWidth < currentScroller.scrollWidth - 4
      setCanScrollCategoriesLeft(nextCanScrollLeft)
      setCanScrollCategoriesRight(nextCanScrollRight)
    }

    const handleScrollStateChange = () => updateCategoryScrollState(scroller)

    handleScrollStateChange()
    scroller.addEventListener('scroll', handleScrollStateChange, { passive: true })
    window.addEventListener('resize', handleScrollStateChange)

    return () => {
      scroller.removeEventListener('scroll', handleScrollStateChange)
      window.removeEventListener('resize', handleScrollStateChange)
    }
  }, [categories])

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

  function scrollCategories(direction: 'left' | 'right') {
    const scroller = categoryScrollerRef.current
    if (!scroller) return

    const distance = Math.max(220, Math.round(scroller.clientWidth * 0.72))
    scroller.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <style jsx>{`
          .prompt-tab-scroller {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .prompt-tab-scroller::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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

        <div className="prompt-tab-scroller mb-7 flex gap-2 overflow-x-auto pb-1">
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
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition duration-200 active:scale-95 ' +
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

        <div className="mb-10 flex items-center gap-3">
          <div className="relative min-w-0 flex-1">
            {canScrollCategoriesLeft ? <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-white/0" /> : null}
            {canScrollCategoriesRight ? <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-white/0" /> : null}
            <div
              ref={categoryScrollerRef}
              className="prompt-tab-scroller flex gap-2 overflow-x-auto scroll-smooth pb-1"
            >
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
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              aria-label="Scroll categories left"
              onClick={() => scrollCategories('left')}
              disabled={!canScrollCategoriesLeft}
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition enabled:hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
            >
              <span aria-hidden="true" className="text-xl font-black leading-none">&lt;</span>
            </button>
            <button
              type="button"
              aria-label="Scroll categories right"
              onClick={() => scrollCategories('right')}
              disabled={!canScrollCategoriesRight}
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition enabled:hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
            >
              <span aria-hidden="true" className="text-xl font-black leading-none">&gt;</span>
            </button>
          </div>
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
