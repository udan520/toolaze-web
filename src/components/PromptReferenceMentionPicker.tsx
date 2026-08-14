import type { TouchEvent, WheelEvent } from 'react'

export type PromptReferenceMentionKind = 'image' | 'video' | 'audio'

export interface PromptReferenceMentionOrdinalRegistry {
  get: (kind: PromptReferenceMentionKind, identity: string) => number
  syncActive: (kind: PromptReferenceMentionKind, identities: readonly string[]) => void
}

export function createPromptReferenceMentionOrdinalRegistry(): PromptReferenceMentionOrdinalRegistry {
  const ordinals: Record<PromptReferenceMentionKind, Map<string, number>> = {
    image: new Map(),
    video: new Map(),
    audio: new Map(),
  }
  const nextOrdinal: Record<PromptReferenceMentionKind, number> = {
    image: 1,
    video: 1,
    audio: 1,
  }

  return {
    get(kind, identity) {
      const existingOrdinal = ordinals[kind].get(identity)
      if (existingOrdinal !== undefined) return existingOrdinal

      const ordinal = nextOrdinal[kind]
      nextOrdinal[kind] += 1
      ordinals[kind].set(identity, ordinal)
      return ordinal
    },
    syncActive(kind, identities) {
      ordinals[kind].clear()
      nextOrdinal[kind] = 1
      for (const identity of new Set(identities)) {
        ordinals[kind].set(identity, nextOrdinal[kind])
        nextOrdinal[kind] += 1
      }
    },
  }
}

export interface PromptReferenceMentionItem {
  id: string
  kind: PromptReferenceMentionKind
  label: string
  name: string
  src: string
}

interface PromptReferenceMentionPickerProps {
  id: string
  items: PromptReferenceMentionItem[]
  activeItemId?: string
  onSelect: (item: PromptReferenceMentionItem) => void
}

const GROUPS = [
  { kind: 'image' as const, label: 'Images' },
  { kind: 'video' as const, label: 'Videos' },
  { kind: 'audio' as const, label: 'Audio' },
]

const stopScrollPropagation = (event: WheelEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
  event.stopPropagation()
}

export default function PromptReferenceMentionPicker({
  id,
  items,
  activeItemId,
  onSelect,
}: PromptReferenceMentionPickerProps) {
  return (
    <div
      id={id}
      data-prompt-reference-mention-picker
      role="listbox"
      aria-label="Mention a reference"
      onWheel={stopScrollPropagation}
      onTouchMove={stopScrollPropagation}
      className="absolute bottom-11 left-3 right-3 z-30 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-[#E0E7FF] bg-white p-2 shadow-[0_16px_40px_rgba(79,70,229,0.18)] sm:left-auto sm:w-80"
    >
      {items.length === 0 ? (
        <p className="px-3 py-4 text-sm text-slate-500">Upload a reference to mention it.</p>
      ) : (
        <div className="space-y-2">
          {GROUPS.map((group) => {
            const groupItems = items.filter((item) => item.kind === group.kind)
            if (groupItems.length === 0) return null

            return (
              <section key={group.kind} aria-label={group.label}>
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {groupItems.map((item) => (
                    <button
                      key={item.id}
                      id={`${id}-option-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={item.id === activeItemId}
                      tabIndex={-1}
                      aria-label={`Mention ${item.label}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => onSelect(item)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-[#EEF2FF] focus:bg-[#EEF2FF] focus:outline-none"
                    >
                      {item.kind === 'image' ? (
                        <img
                          src={item.src}
                          alt=""
                          className="h-11 w-14 shrink-0 rounded-md bg-slate-100 object-cover"
                        />
                      ) : item.kind === 'video' ? (
                        <video
                          src={item.src}
                          className="h-11 w-14 shrink-0 rounded-md bg-slate-950 object-contain object-center"
                          preload="metadata"
                          muted
                          playsInline
                        />
                      ) : item.kind === 'audio' ? (
                        <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-md bg-[#EEF2FF] text-[#4F46E5]" aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l10-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="16" cy="16" r="3" />
                          </svg>
                        </span>
                      ) : null}
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-slate-700">{item.label}</span>
                        <span className="block truncate text-xs text-slate-500">{item.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
