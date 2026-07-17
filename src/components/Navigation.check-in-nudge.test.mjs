import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')

test('daily check-in nudge is not suppressed on earn credits pages', () => {
  assert.equal(
    navigationSource.includes("currentPath.includes('/earn-credits')"),
    false,
  )
})

test('daily check-in nudge records any card interaction for the local day', () => {
  assert.match(navigationSource, /onClickCapture=\{markCheckInNudgeInteracted\}/)
  assert.match(navigationSource, /hasCheckInNudgeInteractionToday\(window\.localStorage\)/)
  assert.match(navigationSource, /markCheckInNudgeInteractionToday\(window\.localStorage\)/)
})

test('daily check-in nudge does not show a later action', () => {
  const nudgeSource = navigationSource.slice(
    navigationSource.indexOf('const renderCheckInNudge'),
    navigationSource.indexOf('const renderAccountMenu'),
  )

  assert.ok(!nudgeSource.includes('Later'))
})
