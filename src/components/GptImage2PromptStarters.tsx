'use client'

import { useState } from 'react'

export type GptImage2PromptStarter = {
  title: string
  useCase: string
  prompt: string
}

interface GptImage2PromptStartersProps {
  items: GptImage2PromptStarter[]
}

export default function GptImage2PromptStarters({ items }: GptImage2PromptStartersProps) {
  const [copiedTitle, setCopiedTitle] = useState('')

  async function copyPrompt(item: GptImage2PromptStarter) {
    await navigator.clipboard.writeText(item.prompt)
    setCopiedTitle(item.title)
    window.setTimeout(() => setCopiedTitle(''), 1800)
  }

  function usePrompt(item: GptImage2PromptStarter) {
    window.dispatchEvent(
      new CustomEvent('toolaze:use-prompt', {
        detail: { prompt: item.prompt },
      })
    )
    document.getElementById('gpt-image-2-generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="group flex min-h-[360px] flex-col justify-between border border-slate-200 bg-[#F7F8F2] p-5 transition duration-200 hover:-translate-y-1 hover:border-slate-950 hover:shadow-[8px_8px_0_#0f172a]"
        >
          <div>
            <p className="w-fit bg-slate-950 px-3 py-1 text-xs font-black text-[#F7F8F2]">
              {item.useCase}
            </p>
            <h3 className="mt-4 text-xl font-black tracking-[-0.03em] text-slate-950">
              {item.title}
            </h3>
            <p className="mt-4 line-clamp-[8] whitespace-pre-line text-sm leading-7 text-slate-700">
              {item.prompt}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => usePrompt(item)}
              className="rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-black text-white transition hover:bg-slate-950"
            >
              Use In Generator
            </button>
            <button
              type="button"
              onClick={() => copyPrompt(item)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-800 transition hover:border-slate-950"
            >
              {copiedTitle === item.title ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
