'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { buildPromptExampleUseDetail } from '@/lib/prompt-example-use-detail'
import type { PromptInsertMode } from '@/lib/prompt-insert-mode'

interface PromptExampleItem {
  title: string
  prompt: string
  image?: string
  video?: string
  poster?: string
  description?: string
  duration?: string
  uploadDate?: string
  note?: string
  color?: string
  group?: string
}

interface PromptExamplesProps {
  title?: string
  subtitle?: string
  items?: PromptExampleItem[]
  bgClass?: string
  targetMode?: PromptInsertMode
}

const PROMPT_COPY_NOUN = 'Prompt'

const PROMPT_EXAMPLE_LABELS = {
  en: {
    groupAria: 'Hairstyle example groups',
    women: 'Women',
    men: 'Men',
    usePrompt: 'Use Prompt',
    copyPrompt: `Copy ${PROMPT_COPY_NOUN}`,
    copiedPrompt: `Copied ${PROMPT_COPY_NOUN}`,
  },
  de: {
    groupAria: 'Frisur-Beispielgruppen',
    women: 'Frauen',
    men: 'Männer',
    usePrompt: 'Prompt verwenden',
    copyPrompt: 'Prompt kopieren',
    copiedPrompt: 'Prompt kopiert',
  },
  ja: {
    groupAria: 'ヘアスタイル例グループ',
    women: '女性',
    men: '男性',
    usePrompt: 'プロンプトを使う',
    copyPrompt: 'プロンプトをコピー',
    copiedPrompt: 'プロンプトをコピー済み',
  },
  es: {
    groupAria: 'Grupos de ejemplos de peinados',
    women: 'Mujeres',
    men: 'Hombres',
    usePrompt: 'Usar prompt',
    copyPrompt: 'Copiar prompt',
    copiedPrompt: 'Prompt copiado',
  },
  'zh-TW': {
    groupAria: '髮型範例分組',
    women: '女性',
    men: '男性',
    usePrompt: '使用提示詞',
    copyPrompt: '複製提示詞',
    copiedPrompt: '已複製提示詞',
  },
  pt: {
    groupAria: 'Grupos de exemplos de penteados',
    women: 'Mulheres',
    men: 'Homens',
    usePrompt: 'Usar prompt',
    copyPrompt: 'Copiar prompt',
    copiedPrompt: 'Prompt copiado',
  },
  fr: {
    groupAria: 'Groupes d’exemples de coiffures',
    women: 'Femmes',
    men: 'Hommes',
    usePrompt: 'Utiliser le prompt',
    copyPrompt: 'Copier le prompt',
    copiedPrompt: 'Prompt copié',
  },
  ko: {
    groupAria: '헤어스타일 예시 그룹',
    women: '여성',
    men: '남성',
    usePrompt: '프롬프트 사용',
    copyPrompt: '프롬프트 복사',
    copiedPrompt: '프롬프트 복사됨',
  },
  it: {
    groupAria: 'Gruppi di esempi di acconciature',
    women: 'Donna',
    men: 'Uomo',
    usePrompt: 'Usa prompt',
    copyPrompt: 'Copia prompt',
    copiedPrompt: 'Prompt copiato',
  },
} as const

function getPromptExampleLabels(pathname: string | null) {
  const firstPart = pathname?.split('/').filter(Boolean)[0] || 'en'
  return PROMPT_EXAMPLE_LABELS[firstPart as keyof typeof PROMPT_EXAMPLE_LABELS] || PROMPT_EXAMPLE_LABELS.en
}

function DeferredPromptVideo({
  src,
  poster,
  label,
}: {
  src: string
  poster?: string
  label: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (typeof IntersectionObserver === 'undefined') {
      void video.play().catch(() => undefined)
      return () => video.pause()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { rootMargin: '120px 0px', threshold: 0.25 }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      aria-label={label}
      loop
      muted
      playsInline
      preload="none"
      className="h-full max-w-full object-contain"
    />
  )
}

export default function PromptExamples({
  title = 'Prompt Examples',
  subtitle,
  items = [],
  bgClass = 'bg-white',
  targetMode,
}: PromptExamplesProps) {
  const labels = getPromptExampleLabels(usePathname())
  const hasGenderGroups = items.some((item) => item.group === 'women') && items.some((item) => item.group === 'men')
  const [activeGroup, setActiveGroup] = useState('women')
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)
  const visibleItems = useMemo(() => {
    if (!hasGenderGroups) return items
    return items.filter((item) => item.group === activeGroup)
  }, [activeGroup, hasGenderGroups, items])

  if (!items || items.length === 0) return null

  const handleUsePrompt = (item: PromptExampleItem) => {
    window.dispatchEvent(new CustomEvent('toolaze:use-prompt', {
      detail: buildPromptExampleUseDetail(item, targetMode),
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyPrompt = async (item: PromptExampleItem) => {
    if (!item.prompt?.trim()) return

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(item.prompt)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = item.prompt
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedTitle(item.title)
      window.setTimeout(() => {
        setCopiedTitle((current) => current === item.title ? null : current)
      }, 1600)
    } catch {
      setCopiedTitle(null)
    }
  }

  return (
    <section className={`${bgClass} py-24 px-6`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-4">{title}</h2>
        {subtitle && (
          <p className="desc-text text-center max-w-3xl mx-auto mb-12">{subtitle}</p>
        )}
        {hasGenderGroups && (
          <div className="mb-10 flex justify-center">
            <div
              role="tablist"
              aria-label={labels.groupAria}
              className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm"
            >
              {[
                { id: 'women', text: labels.women },
                { id: 'men', text: labels.men },
              ].map((tab) => {
                const isActive = activeGroup === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveGroup(tab.id)}
                    className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab.text}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleItems.map((item, idx) => (
            <article key={`${item.title}-${idx}`} className="bg-white rounded-3xl border border-indigo-50 shadow-sm overflow-hidden">
              {item.video ? (
                <div className="flex h-[360px] items-center justify-center bg-slate-100 lg:h-[420px]">
                  <DeferredPromptVideo
                    src={item.video}
                    poster={item.poster}
                    label={`${item.title} example video`}
                  />
                </div>
              ) : item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="block h-auto w-full"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[4/3] bg-[radial-gradient(circle_at_25%_20%,#fce7f3_0,#fce7f3_24%,transparent_25%),linear-gradient(135deg,#fff7ed_0%,#eef2ff_58%,#fdf2f8_100%)] p-6 flex items-end">
                  <div className="w-full rounded-2xl bg-white/80 backdrop-blur-sm border border-white shadow-sm p-4">
                    <div
                      className="mb-4 h-12 w-12 rounded-xl border-4 border-white shadow-sm"
                      style={{ background: item.color || 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}
                    />
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {item.note && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.note}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-5">{item.prompt}</p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleUsePrompt(item)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)' }}
                  >
                    {labels.usePrompt}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(item)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-[#C7D2FE] hover:bg-indigo-50 hover:text-[#4F46E5]"
                  >
                    {copiedTitle === item.title ? labels.copiedPrompt : labels.copyPrompt}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
