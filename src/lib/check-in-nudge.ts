export const CHECK_IN_NUDGE_INTERACTION_STORAGE_PREFIX = 'toolaze.checkInNudgeInteracted.v1'

type NudgeStorage = Pick<Storage, 'getItem' | 'setItem'>

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function getLocalDateKey(date = new Date()): string {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')
}

function normalizeNudgeScope(scope?: string | null): string {
  return String(scope || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_')
}

export function getCheckInNudgeInteractionKey(date = new Date(), scope?: string | null): string {
  const normalizedScope = normalizeNudgeScope(scope)
  return [
    CHECK_IN_NUDGE_INTERACTION_STORAGE_PREFIX,
    normalizedScope || null,
    getLocalDateKey(date),
  ].filter(Boolean).join(':')
}

export function hasCheckInNudgeInteractionToday(storage: NudgeStorage, date = new Date(), scope?: string | null): boolean {
  try {
    return storage.getItem(getCheckInNudgeInteractionKey(date, scope)) === '1'
  } catch {
    return false
  }
}

export function markCheckInNudgeInteractionToday(storage: NudgeStorage, date = new Date(), scope?: string | null) {
  try {
    storage.setItem(getCheckInNudgeInteractionKey(date, scope), '1')
  } catch {
    // Ignore storage failures so the nudge never blocks navigation.
  }
}
