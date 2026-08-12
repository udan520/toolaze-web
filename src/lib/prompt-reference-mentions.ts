export interface InsertPromptReferenceMentionInput {
  value: string
  selectionStart: number
  selectionEnd: number
  triggerIndex: number | null
  mention: string
}

export interface InsertPromptReferenceMentionResult {
  value: string
  caret: number
}

export interface PromptReferenceMention {
  label: string
}

export type PromptReferenceMentionSegment<T extends PromptReferenceMention> =
  | { text: string }
  | { text: string; reference: T }

export interface DeletePromptReferenceMentionInput {
  value: string
  selectionStart: number
  selectionEnd: number
  key: 'Backspace' | 'Delete'
  mentions: readonly PromptReferenceMention[]
}

export interface DeletePromptReferenceMentionResult {
  value: string
  caret: number
}

export function supportsConfiguredPromptReferenceMentions(
  capacities: readonly number[],
  options: { isFirstLastFrameMode?: boolean } = {},
): boolean {
  if (options.isFirstLastFrameMode) return false

  return capacities.reduce((total, capacity) => (
    total + (Number.isFinite(capacity) ? Math.max(0, Math.floor(capacity)) : 0)
  ), 0) >= 2
}

function hasMentionEndBoundary(value: string, end: number): boolean {
  const nextCharacter = value[end]

  return nextCharacter === undefined || !/[A-Za-z0-9_]/.test(nextCharacter)
}

export function splitPromptReferenceMentions<T extends PromptReferenceMention>(
  value: string,
  references: readonly T[],
): PromptReferenceMentionSegment<T>[] {
  const candidates = references
    .filter((reference) => reference.label.length > 0)
    .slice()
    .sort((left, right) => right.label.length - left.label.length)
  const segments: PromptReferenceMentionSegment<T>[] = []
  let textStart = 0
  let cursor = 0

  while (cursor < value.length) {
    const reference = candidates.find(
      (candidate) =>
        value.startsWith(candidate.label, cursor) &&
        hasMentionEndBoundary(value, cursor + candidate.label.length),
    )

    if (!reference) {
      cursor += 1
      continue
    }

    if (textStart < cursor) {
      segments.push({ text: value.slice(textStart, cursor) })
    }

    segments.push({ text: reference.label, reference })
    cursor += reference.label.length
    textStart = cursor
  }

  if (textStart < value.length || segments.length === 0) {
    segments.push({ text: value.slice(textStart) })
  }

  return segments
}

interface PromptReferenceMentionRange {
  start: number
  end: number
}

function getPromptReferenceMentionRanges(
  value: string,
  mentions: readonly PromptReferenceMention[],
): PromptReferenceMentionRange[] {
  const ranges: PromptReferenceMentionRange[] = []
  let cursor = 0

  for (const segment of splitPromptReferenceMentions(value, mentions)) {
    const start = cursor
    cursor += segment.text.length
    if ('reference' in segment) ranges.push({ start, end: cursor })
  }

  return ranges
}

export function deletePromptReferenceMention({
  value,
  selectionStart,
  selectionEnd,
  key,
  mentions,
}: DeletePromptReferenceMentionInput): DeletePromptReferenceMentionResult | null {
  const ranges = getPromptReferenceMentionRanges(value, mentions)
  const isCollapsed = selectionStart === selectionEnd
  const affectedRanges = ranges.filter((range) => {
    if (isCollapsed) {
      const isInsideRange = selectionStart > range.start && selectionStart < range.end
      return isInsideRange || (key === 'Backspace' ? range.end === selectionStart : range.start === selectionStart)
    }

    return range.start < selectionEnd && range.end > selectionStart
  })

  if (affectedRanges.length === 0) return null

  let deleteStart = isCollapsed ? affectedRanges[0].start : selectionStart
  let deleteEnd = isCollapsed ? affectedRanges[affectedRanges.length - 1].end : selectionEnd
  deleteStart = Math.min(deleteStart, ...affectedRanges.map((range) => range.start))
  deleteEnd = Math.max(deleteEnd, ...affectedRanges.map((range) => range.end))

  let prefix = value.slice(0, deleteStart)
  let suffix = value.slice(deleteEnd)
  if (/[ \t]$/.test(prefix) && /^[ \t]/.test(suffix)) {
    suffix = suffix.slice(1)
  } else if (prefix.length === 0 && /^[ \t]/.test(suffix)) {
    suffix = suffix.slice(1)
  } else if (suffix.length === 0 && /[ \t]$/.test(prefix)) {
    prefix = prefix.slice(0, -1)
    deleteStart -= 1
  }

  return {
    value: `${prefix}${suffix}`,
    caret: deleteStart,
  }
}

function trimTrailingInlineWhitespace(value: string): string {
  const match = value.match(/[ \t]+$/)
  if (!match || match.index === undefined) return value

  const lineStart = Math.max(value.lastIndexOf('\n'), value.lastIndexOf('\r')) + 1
  return match.index === lineStart ? value : value.slice(0, match.index)
}

function trimLeadingInlineWhitespace(value: string): string {
  const match = value.match(/^[ \t]+/)
  if (!match) return value

  const remainder = value.slice(match[0].length)
  return /^[\r\n]/.test(remainder) ? value : remainder
}

export function insertPromptReferenceMention({
  value,
  selectionStart,
  selectionEnd,
  triggerIndex,
  mention,
}: InsertPromptReferenceMentionInput): InsertPromptReferenceMentionResult {
  const replaceStart = triggerIndex === null ? selectionStart : triggerIndex
  const prefix = trimTrailingInlineWhitespace(value.slice(0, replaceStart))
  const suffix = trimLeadingInlineWhitespace(value.slice(selectionEnd))
  const leadingSpace = prefix.length > 0 && !/\s$/.test(prefix) ? ' ' : ''
  const trailingSpace = suffix.startsWith('\n') || suffix.startsWith('\r') ? '' : ' '
  const inserted = `${leadingSpace}${mention}${trailingSpace}`

  return {
    value: `${prefix}${inserted}${suffix}`,
    caret: prefix.length + inserted.length,
  }
}
