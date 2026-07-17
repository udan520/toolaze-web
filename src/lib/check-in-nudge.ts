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

export function getCheckInNudgeInteractionKey(date = new Date()): string {
  return `${CHECK_IN_NUDGE_INTERACTION_STORAGE_PREFIX}:${getLocalDateKey(date)}`
}

export function hasCheckInNudgeInteractionToday(storage: NudgeStorage, date = new Date()): boolean {
  try {
    return storage.getItem(getCheckInNudgeInteractionKey(date)) === '1'
  } catch {
    return false
  }
}

export function markCheckInNudgeInteractionToday(storage: NudgeStorage, date = new Date()) {
  try {
    storage.setItem(getCheckInNudgeInteractionKey(date), '1')
  } catch {
    // Ignore storage failures so the nudge never blocks navigation.
  }
}
