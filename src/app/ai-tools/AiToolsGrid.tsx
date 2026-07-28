'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AiToolsCard, AiToolsCategory } from './copy'

const AI_TOOL_CATEGORIES: AiToolsCategory[] = ['all', 'image', 'video']

function localizeHref(href: string, locale: string) {
  return locale === 'en' ? href : `/${locale}${href}`
}

export default function AiToolsGrid({
  cards,
  filters,
  locale,
}: {
  cards: AiToolsCard[]
  filters: Record<AiToolsCategory, string>
  locale: string
}) {
  const [activeCategory, setActiveCategory] = useState<AiToolsCategory>('all')
  const visibleCards = activeCategory === 'all'
    ? cards
    : cards.filter((card) => card.category === activeCategory)

  return (
    <>
      <div className="mb-8 inline-flex max-w-full rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="group" aria-label="Tool type">
        {AI_TOOL_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={`min-h-11 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors sm:px-5 ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {filters[category]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => (
          <Link
            key={card.href}
            href={localizeHref(card.href, locale)}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm transition-colors hover:border-indigo-200"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img src={card.image} alt={card.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                {card.title}
              </h2>
              <p className="text-sm leading-6 text-slate-600">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
