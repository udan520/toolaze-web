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
  subtitle,
  cards,
}: {
  title: string
  subtitle?: string
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
    <section id="trending-models" className="mt-10" aria-labelledby="home-trending-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="home-trending-title" className="home-section-title text-3xl text-slate-950">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="hidden items-center gap-2 text-slate-500 sm:flex">
          <button
            type="button"
            aria-label="Previous trending tools"
            onClick={() => scrollByPage(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm shadow-indigo-100/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next trending tools"
            onClick={() => scrollByPage(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-100 bg-white text-slate-500 shadow-sm shadow-indigo-100/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-md"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative min-h-[246px] flex-none basis-[82%] snap-start overflow-hidden rounded-[1.75rem] bg-slate-100 ring-1 ring-white/80 shadow-[0_16px_42px_rgba(79,70,229,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(79,70,229,0.18)] sm:basis-[48%] xl:basis-[calc((100%_-_2.5rem)/3)]"
          >
            <TrendingPreview card={card} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/18 to-slate-950/4" />
            <div className="absolute inset-x-5 bottom-5 text-center">
              <h3 className="text-base font-extrabold leading-tight text-white drop-shadow">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
