'use client'

import { useState } from 'react'

export interface RedditMediaItem {
  alt: string
  displayImage: string
  image: string
  type?: 'image' | 'video'
}

interface RedditMediaCarouselProps {
  media: RedditMediaItem[]
  title: string
}

export default function RedditMediaCarousel({ media, title }: RedditMediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeMedia = media[activeIndex]
  const hasMultipleMedia = media.length > 1

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? media.length - 1 : current - 1))
  }

  function showNext() {
    setActiveIndex((current) => (current === media.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="relative overflow-hidden bg-slate-100">
      <img
        src={activeMedia.displayImage}
        alt={activeMedia.alt || title}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="aspect-[4/3] w-full object-cover"
      />

      {hasMultipleMedia ? (
        <>
          <button
            type="button"
            onClick={showPrevious}
            aria-label={`Show previous Reddit media for ${title}`}
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-lg font-black text-slate-900 shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label={`Show next Reddit media for ${title}`}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-lg font-black text-slate-900 shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {'>'}
          </button>
        </>
      ) : null}
    </div>
  )
}
