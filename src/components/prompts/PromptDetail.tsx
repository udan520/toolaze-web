'use client'

import { useEffect, useState } from 'react'
import type { PromptItem } from '@/lib/prompts'

const fullNumber = new Intl.NumberFormat('en-US')

function formatMetric(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-'
  return fullNumber.format(value)
}

function MetricIcon({ type }: { type: 'Likes' | 'Views' | 'Reposts' | 'Bookmarks' }) {
  const common = {
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (type === 'Likes') {
    return (
      <svg {...common}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    )
  }

  if (type === 'Views') {
    return (
      <svg {...common}>
        <path d="M2.1 12s3.6-6.5 9.9-6.5S21.9 12 21.9 12 18.3 18.5 12 18.5 2.1 12 2.1 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  if (type === 'Reposts') {
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

type PreviewImage = {
  src: string
  alt: string
  label?: string
}

function MediaPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.16),transparent_28%),linear-gradient(135deg,#f8faff,#eef2ff)] p-8 text-center shadow-xl shadow-indigo-100">
      <div>
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-black text-indigo-500 shadow-sm shadow-indigo-100">
          AI
        </span>
        <p className="text-base font-black text-slate-800">{title}</p>
        <p className="mt-2 text-sm font-semibold text-slate-400">Prompt only</p>
      </div>
    </div>
  )
}

function DetailMedia({
  item,
  canRenderVideo,
  onPreview,
}: {
  item: PromptItem
  canRenderVideo: boolean
  onPreview: (image: PreviewImage) => void
}) {
  const previewKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, image: PreviewImage) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onPreview(image)
    }
  }

  if (item.videoUrl && canRenderVideo) {
    return (
      <video
        className="h-full w-full object-cover shadow-xl shadow-indigo-100"
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        poster={item.poster || item.image}
      >
        <source src={item.videoUrl} type="video/mp4" />
      </video>
    )
  }

  if (item.videoUrl) {
    const posterImage = item.poster || item.image
    if (!posterImage) return <MediaPlaceholder title={item.title} />

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onPreview({ src: posterImage, alt: item.title })}
        onKeyDown={(event) => previewKeyDown(event, { src: posterImage, alt: item.title })}
        className="h-full w-full cursor-zoom-in overflow-hidden shadow-xl shadow-indigo-100 outline-none ring-indigo-200 transition focus-visible:ring-4"
      >
        <img
          src={posterImage}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
        />
      </div>
    )
  }

  if (item.originalImage && item.resultImage) {
    return (
      <div className="grid h-full gap-4 md:grid-cols-2">
        {[
          ['Original', item.originalImage],
          ['Result', item.resultImage],
        ].map(([label, src]) => (
          <figure key={label} className="flex h-full min-h-0 flex-col overflow-hidden border border-indigo-100 bg-white shadow-lg shadow-indigo-50">
            <figcaption className="px-5 py-3 text-xs font-black tracking-[0.08em] text-slate-400">{label}</figcaption>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onPreview({ src, alt: `${item.title} ${label}`, label })}
              onKeyDown={(event) => previewKeyDown(event, { src, alt: `${item.title} ${label}`, label })}
              className="min-h-0 flex-1 cursor-zoom-in overflow-hidden outline-none ring-indigo-200 transition focus-visible:ring-4"
            >
              <img src={src} alt={`${item.title} ${label}`} className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]" />
            </div>
          </figure>
        ))}
      </div>
    )
  }

  const image = item.image || item.poster
  if (!image) return <MediaPlaceholder title={item.title} />

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onPreview({ src: image, alt: item.title })}
      onKeyDown={(event) => previewKeyDown(event, { src: image, alt: item.title })}
      className="h-full w-full cursor-zoom-in overflow-hidden shadow-xl shadow-indigo-100 outline-none ring-indigo-200 transition focus-visible:ring-4"
    >
      <img
        src={image}
        alt={item.title}
        className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
      />
    </div>
  )
}

export default function PromptDetail({ item }: { item: PromptItem }) {
  const [copied, setCopied] = useState(false)
  const [canRenderVideo, setCanRenderVideo] = useState(false)
  const [previewImage, setPreviewImage] = useState<PreviewImage | null>(null)

  useEffect(() => {
    setCanRenderVideo(true)
  }, [])

  useEffect(() => {
    if (!previewImage) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewImage(null)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewImage])

  async function copyPrompt() {
    await navigator.clipboard.writeText(item.prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const metrics = [
    ['Likes', item.likes],
    ['Views', item.views],
    ['Reposts', item.retweets],
    ['Bookmarks', item.bookmarks],
  ] as const

  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="aspect-[4/3] w-full">
          <DetailMedia item={item} canRenderVideo={canRenderVideo} onPreview={setPreviewImage} />
        </div>

        <article className="border border-indigo-100 bg-[#F8FAFF] p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-black text-white">
              {item.model}
            </span>
            <span className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-black text-indigo-600">
              {item.category}
            </span>
          </div>
          <h1 className="mb-5 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
            #{item.rank} {item.title}
          </h1>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4 shadow-sm shadow-indigo-50">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFF] text-indigo-500">
                  <MetricIcon type={label as 'Likes' | 'Views' | 'Reposts' | 'Bookmarks'} />
                </div>
                <strong className="block text-center text-lg font-black text-slate-900">{formatMetric(value)}</strong>
                <span className="block text-center text-xs font-bold text-slate-400">{label}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-50">
            <h2 className="mb-3 text-sm font-black tracking-[0.08em] text-slate-400">Prompt</h2>
            <p className="max-h-[10.5rem] overflow-y-auto whitespace-pre-wrap pr-2 text-sm leading-7 text-slate-700">{item.prompt}</p>
          </div>

          <div className="mt-6 flex flex-nowrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={copyPrompt}
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-3 py-3 text-xs font-black text-white shadow-lg shadow-slate-100 transition hover:scale-[1.02] hover:bg-indigo-600 sm:px-4 sm:text-sm"
            >
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-3 text-xs font-black text-white shadow-lg shadow-indigo-100 transition hover:scale-[1.02] sm:px-4 sm:text-sm"
            >
              View source on X
            </a>
          </div>
        </article>
      </div>
      {previewImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={previewImage.label ? `${previewImage.label} Preview` : 'Image Preview'}
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
            onClick={() => setPreviewImage(null)}
          >
            Close
          </button>
          <img
            src={previewImage.src}
            alt={previewImage.alt}
            className="max-h-[88vh] max-w-[92vw] rounded-3xl object-contain shadow-2xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  )
}
