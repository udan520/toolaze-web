'use client'

import { useState } from 'react'
import Link from 'next/link'

export type HomeAiToolsTabCard = {
  title: string
  href: string
  media: {
    type: 'image' | 'video'
    src: string
    poster?: string
    alt: string
  }
}

export type HomeAiToolsTabsCopy = {
  videoTools: string
  imageTools: string
}

function ToolPreview({ card }: { card: HomeAiToolsTabCard }) {
  if (card.media.type === 'video') {
    return (
      <video
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        src={card.media.src}
        poster={card.media.poster}
        aria-label={card.media.alt}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    )
  }

  return (
    <img
      src={card.media.src}
      alt={card.media.alt}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  )
}

export default function HomeAiToolsTabs({
  copy,
  videoTools,
  imageTools,
}: {
  copy: HomeAiToolsTabsCopy
  videoTools: HomeAiToolsTabCard[]
  imageTools: HomeAiToolsTabCard[]
}) {
  const [activeTab, setActiveTab] = useState<'video' | 'image'>('video')
  const activeCards = activeTab === 'video' ? videoTools : imageTools

  return (
    <div>
      <div className="mb-8 inline-flex max-w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist" aria-label="AI tools">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'video'}
          onClick={() => setActiveTab('video')}
          className={`min-h-11 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors sm:px-5 ${
            activeTab === 'video'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {copy.videoTools}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'image'}
          onClick={() => setActiveTab('image')}
          className={`min-h-11 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors sm:px-5 ${
            activeTab === 'image'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {copy.imageTools}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {activeCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm transition-colors hover:border-indigo-200"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <ToolPreview card={card} />
            </div>
            <div className="flex min-h-16 items-center p-5">
              <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
