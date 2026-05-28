'use client'

import { useEffect, useState } from 'react'
import type { PromptItem } from '@/lib/prompts'
import { RelatedPromptGrid } from './PromptGallery'

function getRelatedTokens(item: PromptItem) {
  return new Set(
    [item.title, item.category, item.model, item.prompt]
      .join(' ')
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((token) => token.length > 2) ?? []
  )
}

function scoreRelatedItem(baseItem: PromptItem, item: PromptItem, tokens: Set<string>) {
  const haystack = [item.title, item.category, item.model, item.prompt].join(' ').toLowerCase()
  let score = item.category === baseItem.category ? 60 : 0
  if (item.model === baseItem.model) score += 30
  tokens.forEach((token) => {
    if (haystack.includes(token)) score += 3
  })
  return score
}

export default function RelatedTemplatesLoader({ baseItem }: { baseItem: PromptItem }) {
  const [relatedItems, setRelatedItems] = useState<PromptItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadRelated = () => {
      fetch('/prompts-data.json')
        .then((response) => response.json())
        .then((items: PromptItem[]) => {
          if (cancelled || !Array.isArray(items)) return
          const tokens = getRelatedTokens(baseItem)
          const nextItems = items
            .filter((item) => item.tweetId !== baseItem.tweetId)
            .map((item) => ({ item, score: scoreRelatedItem(baseItem, item, tokens) }))
            .sort((a, b) => b.score - a.score || Number(b.item.likes || 0) - Number(a.item.likes || 0))
            .slice(0, 6)
            .map(({ item }) => item)
          setRelatedItems(nextItems)
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }

    const idleId = window.setTimeout(loadRelated, 250)
    return () => {
      cancelled = true
      window.clearTimeout(idleId)
    }
  }, [baseItem])

  if (isLoading) {
    return (
      <section className="bg-[#F8FAFF] px-6 py-16" aria-label="Related templates">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-900">Related templates</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
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
        </div>
      </section>
    )
  }

  if (!relatedItems.length) return null

  return (
    <section className="bg-[#F8FAFF] px-6 py-16" aria-label="Related templates">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-900">Related templates</h2>
        <RelatedPromptGrid items={relatedItems} />
      </div>
    </section>
  )
}
