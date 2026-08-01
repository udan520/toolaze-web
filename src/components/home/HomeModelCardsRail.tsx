'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type HomeModelCardsRailMedia =
  | {
      type: 'image'
      src: string
      alt: string
      width: number
      height: number
    }
  | {
      type: 'video'
      src: string
      poster?: string
      alt: string
    }

export type HomeModelCardsRailCard = {
  id: string
  title: string
  description: string
  href: string
  media: HomeModelCardsRailMedia
}

function ModelCardPreview({ card }: { card: HomeModelCardsRailCard }) {
  if (card.media.type === 'video') {
    return (
      <video
        data-home-video-model-demo
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
    <Image
      src={card.media.src}
      alt={card.media.alt}
      width={card.media.width}
      height={card.media.height}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      sizes="(max-width: 768px) 82vw, (max-width: 1280px) 48vw, 33vw"
    />
  )
}

export default function HomeModelCardsRail({
  cards,
  mediaKind,
}: {
  cards: HomeModelCardsRailCard[]
  mediaKind: 'image' | 'video'
}) {
  const railRef = useRef<HTMLDivElement>(null)

  function scrollByPage(direction: -1 | 1) {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.92, 320),
      behavior: 'smooth',
    })
  }

  return (
    <div data-home-models-rail={mediaKind}>
      <div className="mb-5 flex justify-end">
        <div className="hidden items-center gap-2 text-slate-500 sm:flex">
          <button
            type="button"
            aria-label={`Previous ${mediaKind} models`}
            onClick={() => scrollByPage(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors hover:border-indigo-200 hover:text-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={`Next ${mediaKind} models`}
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
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="home-model-card group block flex-none basis-[82%] snap-start rounded-lg border border-indigo-100 p-4 transition-all duration-300 hover:border-indigo-200 sm:basis-[48%] xl:basis-[calc((100%_-_4rem)/3)]"
          >
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-md bg-slate-50 ring-1 ring-indigo-100">
              <ModelCardPreview card={card} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-indigo-600">{card.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
