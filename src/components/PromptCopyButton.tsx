'use client'

import { useState } from 'react'

interface PromptCopyButtonProps {
  prompt: string
  copyLabel?: string
  copiedLabel?: string
}

export default function PromptCopyButton({ prompt, copyLabel = 'Copy', copiedLabel = 'Copied' }: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = prompt
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={copyPrompt}
      aria-label={copyLabel}
      className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-extrabold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {copied ? copiedLabel : copyLabel}
    </button>
  )
}
