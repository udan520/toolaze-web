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
