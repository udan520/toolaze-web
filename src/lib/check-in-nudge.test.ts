import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getCheckInNudgeInteractionKey,
  getLocalDateKey,
  hasCheckInNudgeInteractionToday,
  markCheckInNudgeInteractionToday,
} from './check-in-nudge'

function createStorage() {
  const data = new Map<string, string>()

  return {
    getItem(key: string) {
      return data.get(key) ?? null
    },
    setItem(key: string, value: string) {
      data.set(key, value)
    },
  }
}

test('uses the visitor local calendar day for the daily check-in nudge', () => {
  const date = new Date(2026, 6, 17, 23, 30)

  assert.equal(getLocalDateKey(date), '2026-07-17')
  assert.equal(getCheckInNudgeInteractionKey(date), 'toolaze.checkInNudgeInteracted.v1:2026-07-17')
})

test('marks any check-in nudge interaction for the rest of the local day', () => {
  const storage = createStorage()
  const date = new Date(2026, 6, 17, 9, 15)

  assert.equal(hasCheckInNudgeInteractionToday(storage, date), false)

  markCheckInNudgeInteractionToday(storage, date)

  assert.equal(hasCheckInNudgeInteractionToday(storage, date), true)
  assert.equal(hasCheckInNudgeInteractionToday(storage, new Date(2026, 6, 18, 9, 15)), false)
})

test('keeps daily check-in nudge interactions scoped to the signed-in user', () => {
  const storage = createStorage()
  const date = new Date(2026, 6, 17, 9, 15)

  markCheckInNudgeInteractionToday(storage, date, 'user-a')

  assert.equal(hasCheckInNudgeInteractionToday(storage, date, 'user-a'), true)
  assert.equal(hasCheckInNudgeInteractionToday(storage, date, 'user-b'), false)
})
