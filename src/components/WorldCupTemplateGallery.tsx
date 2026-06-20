'use client'

import { useState } from 'react'
import SiteImage from './SiteImage'

export interface WorldCupTemplateItem {
  id: string
  title: string
  category?: string
  image: string
  referenceImage?: string
  width: number
  height: number
  prompt: string
  use: string
}

interface WorldCupTemplateGalleryProps {
  items: WorldCupTemplateItem[]
  labels: {
    copyPrompt: string
    copied: string
    createSimilar: string
    altSuffix: string
    allCategory: string
    templateTitlePrefix: string
  }
}

export default function WorldCupTemplateGallery({ items, labels }: WorldCupTemplateGalleryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('__all__')
  const galleryLabels = labels
  const categories = [
    { key: '__all__', label: galleryLabels.allCategory },
    ...Array.from(new Set(items.map((item) => item.category).filter((category): category is string => Boolean(category))))
      .map((category) => ({ key: category, label: category })),
  ]
  const visibleItems =
    activeCategory === '__all__'
      ? items
      : items.filter((item) => item.category === activeCategory)

  const copyPrompt = async (item: WorldCupTemplateItem) => {
    await navigator.clipboard.writeText(item.prompt)
    setCopiedId(item.id)
    window.setTimeout(() => {
      setCopiedId((currentId) => (currentId === item.id ? null : currentId))
    }, 1600)
  }

  const useTemplate = (item: WorldCupTemplateItem) => {
    const referenceImage = item.referenceImage?.trim()
    const referenceImageName = referenceImage?.split('/').pop() || `${item.id}.webp`

    window.dispatchEvent(
      new CustomEvent('toolaze:use-prompt', {
        detail: {
          prompt: item.prompt,
          imageUrl: referenceImage,
          imageName: referenceImageName,
          demoImageUrl: item.image,
          demoImageTitle: item.title,
          demoImageWidth: item.width,
          demoImageHeight: item.height,
        },
      })
    )

    document
      .getElementById('world-cup-gpt-image-2-generator')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mt-10">
      {categories.length > 1 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`shrink-0 border px-4 py-2 text-sm font-black transition ${
                activeCategory === category.key
                  ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                  : 'border-indigo-100 bg-white text-slate-700 hover:border-[#4F46E5] hover:text-[#4F46E5]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {visibleItems.map((item) => (
        <article
          key={item.id}
          className="group flex min-h-[640px] flex-col overflow-hidden border border-indigo-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#4F46E5] hover:shadow-[10px_10px_0_rgba(79,70,229,0.12)]"
        >
          <div className="relative flex aspect-[3/4] items-center justify-center bg-[#EEF2FF]">
            <SiteImage
              src={item.image}
              alt={`${item.title} ${galleryLabels.altSuffix}`}
              width={item.width}
              height={item.height}
              className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <div>
              <p className="line-clamp-2 text-base font-black leading-5 text-slate-950">
                {item.title}
              </p>
              <p
                className="mt-2 h-[4.5rem] overflow-y-auto border border-indigo-100 bg-[#F8FAFF] p-3 text-sm leading-6 text-slate-700"
              >
                {item.prompt}
              </p>
            </div>
            <div className="mt-auto grid gap-2 pt-4">
              <button
                type="button"
                onClick={() => copyPrompt(item)}
                className="inline-flex w-full items-center justify-center border border-indigo-200 bg-white px-4 py-3 text-sm font-black text-[#4F46E5] transition hover:-translate-y-0.5 hover:border-[#4F46E5] hover:bg-[#F8FAFF]"
              >
                {copiedId === item.id ? galleryLabels.copied : galleryLabels.copyPrompt}
              </button>
              <button
                type="button"
                onClick={() => useTemplate(item)}
                className="inline-flex w-full items-center justify-center border border-[#4F46E5] bg-[#4F46E5] px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#4338CA]"
              >
                {galleryLabels.createSimilar}
              </button>
            </div>
          </div>
        </article>
      ))}
      </div>
    </div>
  )
}
