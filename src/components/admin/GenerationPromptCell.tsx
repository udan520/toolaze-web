'use client'

import { useState } from 'react'

type GenerationPromptCellProps = {
  prompt: string
}

const PROMPT_PREVIEW_LENGTH = 220

export function GenerationPromptCell({ prompt }: GenerationPromptCellProps) {
  const [copied, setCopied] = useState(false)
  const [showFullPrompt, setShowFullPrompt] = useState(false)
  const displayPrompt = prompt.trim() || '无提示词'
  const canCopy = prompt.length > 0
  const promptPreview = displayPrompt.length > PROMPT_PREVIEW_LENGTH
    ? `${displayPrompt.slice(0, PROMPT_PREVIEW_LENGTH).trimEnd()}...`
    : displayPrompt
  const isTruncated = promptPreview !== displayPrompt

  async function handleCopy() {
    if (!canCopy) return

    await copyText(prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div
      className="relative max-w-xl"
      onMouseEnter={() => setShowFullPrompt(true)}
      onMouseLeave={() => setShowFullPrompt(false)}
      onFocus={() => setShowFullPrompt(true)}
      onBlur={() => setShowFullPrompt(false)}
    >
      <div className="group relative rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 pr-10 transition hover:border-indigo-200 hover:bg-white">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canCopy}
          aria-label="复制提示词"
          className="absolute right-2 top-2 inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-600 opacity-0 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 group-hover:opacity-100 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {copied ? '已复制' : '复制'}
        </button>
        <p className="max-h-20 overflow-hidden whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">
          {promptPreview}
        </p>
        {isTruncated ? (
          <p className="mt-1 text-[11px] font-medium text-slate-400">Hover 省略号查看完整提示词</p>
        ) : null}
      </div>

      {showFullPrompt ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-[520px] max-w-[70vw] rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-700 shadow-xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">完整提示词</p>
          <p className="max-h-96 overflow-auto whitespace-pre-wrap break-words">{displayPrompt}</p>
        </div>
      ) : null}
    </div>
  )
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}
