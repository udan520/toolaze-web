'use client'

import { useRef } from 'react'
import Link from 'next/link'
import type { HomeAiToolsTabCard } from '@/components/home/HomeAiToolsTabs'

function TrendingPreview({ card }: { card: HomeAiToolsTabCard }) {
  if (card.media.type === 'video') {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
      src={card.media.poster || card.media.src}
      alt={card.media.alt}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  )
}

export default function HomeTrendingToolsRail({
  title,
  cards,
}: {
  title: string
  cards: HomeAiToolsTabCard[]
}) {
  const railRef = useRef<HTMLDivElement>(null)

  const scrollByPage = (direction: -1 | 1) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.92, 320),
      behavior: 'smooth',
    })
  }

  return (
    <section id="trending-models" className="mt-9" aria-labelledby="home-trending-title">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="home-trending-title" className="home-section-title text-3xl text-slate-950">
          {title}
        </h2>
        <div className="hidden items-center gap-2 text-slate-500 sm:flex">
          <button
            type="button"
            aria-label="Previous trending tools"
            onClick={() => scrollByPage(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next trending tools"
            onClick={() => scrollByPage(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative min-h-[240px] flex-none basis-[82%] snap-start overflow-hidden rounded-[1.5rem] bg-slate-100 ring-1 ring-slate-200 transition-colors hover:ring-indigo-200 sm:basis-[48%] xl:basis-[calc((100%_-_2rem)/3)]"
          >
            <TrendingPreview card={card} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent" />
            <h3 className="absolute inset-x-5 bottom-5 text-center text-base font-extrabold text-white drop-shadow">
              {card.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
