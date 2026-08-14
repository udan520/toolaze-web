'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { splitPromptReferenceMentions } from '@/lib/prompt-reference-mentions'
import type { PromptReferenceMentionItem } from './PromptReferenceMentionPicker'

interface PromptReferenceMentionOverlayProps {
  value: string
  items: PromptReferenceMentionItem[]
  mirrorRef: RefObject<HTMLDivElement | null>
}

interface HoveredReference {
  reference: PromptReferenceMentionItem
  top: number
  left: number
}

interface PromptReferenceTokenHitTarget<T> {
  reference: T
  rect: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>
}

export function findPromptReferenceTokenAtPoint<T>(
  targets: readonly PromptReferenceTokenHitTarget<T>[],
  clientX: number,
  clientY: number,
): T | null {
  const target = targets.find(({ rect }) => (
    clientX >= rect.left
    && clientX <= rect.right
    && clientY >= rect.top
    && clientY <= rect.bottom
  ))
  return target?.reference ?? null
}

const PREVIEW_WIDTH = 224
const PREVIEW_HEIGHT = 184
const VIEWPORT_GAP = 12

export default function PromptReferenceMentionOverlay({
  value,
  items,
  mirrorRef,
}: PromptReferenceMentionOverlayProps) {
  const [hoveredReference, setHoveredReference] = useState<HoveredReference | null>(null)
  const tokenElementsRef = useRef(new Map<string, { node: HTMLSpanElement; reference: PromptReferenceMentionItem }>())
  const segments = splitPromptReferenceMentions(value, items)

  useEffect(() => {
    setHoveredReference(null)
  }, [value, items])

  useEffect(() => {
    const textarea = mirrorRef.current?.parentElement?.querySelector('textarea')
    if (!textarea) return

    const clearHoveredReference = () => setHoveredReference((current) => current ? null : current)

    const handlePointerMove = (event: globalThis.MouseEvent) => {
      if (event.target !== textarea) {
        clearHoveredReference()
        return
      }

      const targets = Array.from(tokenElementsRef.current.values()).flatMap(({ node, reference }) => (
        Array.from(node.getClientRects()).map((rect) => ({ reference, rect }))
      ))
      const reference = findPromptReferenceTokenAtPoint(targets, event.clientX, event.clientY)
      if (!reference) {
        clearHoveredReference()
        return
      }

      const hitTarget = targets.find((target) => (
        target.reference === reference
        && event.clientX >= target.rect.left
        && event.clientX <= target.rect.right
        && event.clientY >= target.rect.top
        && event.clientY <= target.rect.bottom
      ))
      if (!hitTarget) return

      const left = Math.min(
        Math.max(hitTarget.rect.left, VIEWPORT_GAP),
        Math.max(VIEWPORT_GAP, window.innerWidth - PREVIEW_WIDTH - VIEWPORT_GAP),
      )
      const top = hitTarget.rect.bottom + VIEWPORT_GAP + PREVIEW_HEIGHT <= window.innerHeight
        ? hitTarget.rect.bottom + VIEWPORT_GAP
        : Math.max(VIEWPORT_GAP, hitTarget.rect.top - PREVIEW_HEIGHT - VIEWPORT_GAP)
      setHoveredReference((current) => (
        current?.reference === reference && current.top === top && current.left === left
          ? current
          : { reference, top, left }
      ))
    }

    textarea.addEventListener('mousemove', handlePointerMove)
    textarea.addEventListener('mouseleave', clearHoveredReference)
    textarea.addEventListener('scroll', clearHoveredReference)
    window.addEventListener('scroll', clearHoveredReference, true)
    window.addEventListener('resize', clearHoveredReference)
    return () => {
      textarea.removeEventListener('mousemove', handlePointerMove)
      textarea.removeEventListener('mouseleave', clearHoveredReference)
      textarea.removeEventListener('scroll', clearHoveredReference)
      window.removeEventListener('scroll', clearHoveredReference, true)
      window.removeEventListener('resize', clearHoveredReference)
    }
  }, [])

  const renderPreviewPortal = () => {
    if (!hoveredReference || typeof document === 'undefined') return null

    const { reference, top, left } = hoveredReference
    if (!items.some((item) => item.id === reference.id && item.src === reference.src)) return null
    return createPortal(
      <div
        data-prompt-reference-mention-preview
        className="pointer-events-none fixed z-[100] w-56 overflow-hidden rounded-xl border border-[#C7D2FE] bg-white p-2 shadow-[0_16px_40px_rgba(79,70,229,0.22)]"
        style={{ top, left }}
      >
        {reference.kind === 'image' ? (
          <img
            src={reference.src}
            alt=""
            className="h-32 w-full rounded-lg bg-slate-100 object-contain object-center"
          />
        ) : reference.kind === 'video' ? (
          <video
            src={reference.src}
            className="h-32 w-full rounded-lg bg-slate-950 object-contain object-center"
            preload="metadata"
            muted
            playsInline
          />
        ) : reference.kind === 'audio' ? (
          <div
            data-prompt-reference-audio-preview
            className="flex h-24 items-center gap-3 rounded-lg bg-[#EEF2FF] px-4 text-[#4F46E5]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l10-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="16" cy="16" r="3" />
              </svg>
            </span>
            <span className="min-w-0 text-sm font-semibold text-slate-700">Audio reference</span>
          </div>
        ) : null}
        <div className="min-w-0 px-1 pb-1 pt-2">
          <p className="text-sm font-semibold text-slate-700">{reference.label}</p>
          <p className="truncate text-xs text-slate-500">{reference.name}</p>
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <>
      <div
        ref={mirrorRef}
        data-prompt-reference-mention-overlay
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden whitespace-pre-wrap break-words rounded-xl border border-transparent px-4 pb-12 pt-3 text-base leading-6 text-slate-800 md:text-sm"
      >
        {segments.map((segment, index) => (
          'reference' in segment ? (
            <span
              key={`${segment.reference.id}-${index}`}
              ref={(node) => {
                const key = `${segment.reference.id}-${index}`
                if (node) tokenElementsRef.current.set(key, { node, reference: segment.reference })
                else tokenElementsRef.current.delete(key)
              }}
              className="text-[#9333EA]"
            >
              {segment.text}
            </span>
          ) : (
            <span key={`text-${index}`}>{segment.text}</span>
          )
        ))}
      </div>
      {renderPreviewPortal()}
    </>
  )
}
