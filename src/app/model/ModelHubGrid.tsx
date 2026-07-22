'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  getModelHubModels,
  type ModelHubCategory,
} from '@/lib/model-hub'

type ExistingCard = {
  href: string
  description: string
  tags: string[]
  cta: string
}

const MODEL_HUB_CATEGORIES: ModelHubCategory[] = ['all', 'image', 'video']

const localeText: Record<string, {
  tabs: Record<ModelHubCategory, string>
  imageDescription: string
  videoDescription: string
  view: string
  comingSoon: string
}> = {
  en: { tabs: { all: 'All', image: 'Image', video: 'Video' }, imageDescription: 'AI image generation, editing, and reference workflows.', videoDescription: 'Text-to-video and image-to-video generation workflows.', view: 'View', comingSoon: 'Coming soon' },
  de: { tabs: { all: 'Alle', image: 'Bild', video: 'Video' }, imageDescription: 'KI-Bildgenerierung, Bearbeitung und referenzbasierte Workflows.', videoDescription: 'Workflows für Text-zu-Video und Bild-zu-Video.', view: 'Ansehen', comingSoon: 'Demnächst' },
  ja: { tabs: { all: 'すべて', image: '画像', video: '動画' }, imageDescription: 'AI画像生成、編集、参照画像ワークフロー。', videoDescription: 'テキストから動画、画像から動画の生成ワークフロー。', view: '見る', comingSoon: '近日公開' },
  es: { tabs: { all: 'Todos', image: 'Imagen', video: 'Video' }, imageDescription: 'Generación y edición de imágenes con IA y flujos con referencias.', videoDescription: 'Flujos de texto a video e imagen a video.', view: 'Ver', comingSoon: 'Próximamente' },
  'zh-TW': { tabs: { all: '全部', image: '圖像', video: '影片' }, imageDescription: 'AI 圖像生成、編輯與參考圖工作流程。', videoDescription: '文字生成影片與圖像生成影片工作流程。', view: '查看', comingSoon: '即將推出' },
  pt: { tabs: { all: 'Todos', image: 'Imagem', video: 'Vídeo' }, imageDescription: 'Geração e edição de imagens com IA e fluxos com referências.', videoDescription: 'Fluxos de texto para vídeo e imagem para vídeo.', view: 'Ver', comingSoon: 'Em breve' },
  fr: { tabs: { all: 'Tous', image: 'Image', video: 'Vidéo' }, imageDescription: "Génération et retouche d'images IA avec workflows de référence.", videoDescription: 'Workflows texte-vers-vidéo et image-vers-vidéo.', view: 'Voir', comingSoon: 'Bientôt' },
  ko: { tabs: { all: '전체', image: '이미지', video: '동영상' }, imageDescription: 'AI 이미지 생성, 편집 및 참조 이미지 워크플로.', videoDescription: '텍스트 투 비디오 및 이미지 투 비디오 워크플로.', view: '보기', comingSoon: '출시 예정' },
  it: { tabs: { all: 'Tutti', image: 'Immagine', video: 'Video' }, imageDescription: 'Generazione e modifica di immagini IA con flussi basati su riferimenti.', videoDescription: 'Flussi da testo a video e da immagine a video.', view: 'Vedi', comingSoon: 'Prossimamente' },
}

function localizeHref(href: string, locale: string) {
  return locale === 'en' ? href : `/${locale}${href}`
}

export default function ModelHubGrid({
  locale,
  existingCards,
}: {
  locale: string
  existingCards: ExistingCard[]
}) {
  const [activeCategory, setActiveCategory] = useState<ModelHubCategory>('all')
  const text = localeText[locale] || localeText.en
  const existingCardsByHref = useMemo(
    () => new Map(existingCards.map((card) => [card.href, card])),
    [existingCards],
  )
  const models = getModelHubModels(activeCategory)

  return (
    <>
      <div className="mb-8 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="group" aria-label="Model type">
        {MODEL_HUB_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={`min-w-24 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {text.tabs[category]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => {
          const existingCard = existingCardsByHref.get(model.href)
          const description = existingCard?.description || (
            model.category === 'image' ? text.imageDescription : text.videoDescription
          )
          const tags = existingCard?.tags || [text.tabs[model.category], model.vendor]

          return (
            <Link
              key={model.href}
              href={localizeHref(model.href, locale)}
              className="group flex min-h-72 flex-col rounded-2xl border border-[#E0E7FF] bg-white p-6 shadow-lg shadow-[#4F46E5]/8 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4F46E5]/12"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
                    <img src={model.logoSrc} alt={model.logoAlt} className="h-7 w-7 object-contain" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{model.vendor}</p>
                    <h2 className="mt-1 text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                      {model.name}
                    </h2>
                  </div>
                </div>
                {model.qualityRating === null ? (
                  <span className="flex-none rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{text.comingSoon}</span>
                ) : (
                  <span className="flex-none rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700" aria-label={`Quality ${model.qualityRating}`}>
                    ★ {model.qualityRating.toFixed(1)}
                  </span>
                )}
              </div>

              <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">{description}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-lg bg-[#EEF2FF] px-2.5 py-1 text-xs font-semibold text-[#4F46E5]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center text-sm font-semibold text-indigo-600">
                <span>{existingCard?.cta || `${text.view} ${model.name}`}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
