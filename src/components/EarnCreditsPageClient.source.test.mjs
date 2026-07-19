import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./EarnCreditsPageClient.tsx', import.meta.url), 'utf8')

test('claimed daily check-in reward cards show a green check marker on the card corner', () => {
  assert.match(source, /reward\.claimed \?\s*\(/)
  assert.match(source, /aria-label=\{formatEarnCreditsCopy\(copy\.checkIn\.checkedInAria, \{ day: reward\.day \}\)\}/)
  assert.match(source, /absolute -left-1\.5 -top-1\.5/)
  assert.doesNotMatch(source, /absolute left-2 top-2/)
  assert.match(source, /bg-emerald-500/)
  assert.match(source, /ring-2 ring-white/)
})

test('claimed daily check-in reward cards use green styling even when current', () => {
  const rewardCardClassSource = source.slice(
    source.indexOf('className={`relative rounded-2xl'),
    source.indexOf('}`}', source.indexOf('className={`relative rounded-2xl')),
  )

  assert.match(rewardCardClassSource, /reward\.claimed\s*\?\s*'border-emerald-200 bg-emerald-50'/)
  assert.match(rewardCardClassSource, /reward\.claimed[\s\S]*:\s*reward\.current/)
  assert.doesNotMatch(rewardCardClassSource, /reward\.current[\s\S]*:\s*reward\.claimed/)
})

test('earn credits feedback uses the global top notice surface', () => {
  assert.match(source, /import \{ dispatchToolazeTopNotice \} from '@\/lib\/top-notice'/)
  assert.match(source, /dispatchToolazeTopNotice\(\{\s*type: 'success'[\s\S]*title: copy\.notices\.dailyRewardClaimedTitle/)
  assert.match(source, /dispatchToolazeTopNotice\(\{\s*type: 'error'[\s\S]*title: copy\.notices\.checkInFailedTitle/)
  assert.match(source, /dispatchToolazeTopNotice\(\{\s*type: 'success'[\s\S]*title: copy\.notices\.xPostSubmittedTitle/)
  assert.match(source, /dispatchToolazeTopNotice\(\{\s*type: 'error'[\s\S]*title: copy\.notices\.submissionFailedTitle/)
  assert.doesNotMatch(source, /const \[notice, setNotice\]/)
  assert.doesNotMatch(source, /const \[error, setError\]/)
  assert.doesNotMatch(source, /border border-emerald-200 bg-emerald-50 px-4 py-3/)
  assert.doesNotMatch(source, /border border-rose-200 bg-rose-50 px-4 py-3/)
})

test('earn credits page updates the check-in board from external check-in events', () => {
  assert.match(source, /window\.addEventListener\('toolaze:check-in-updated', handleCheckInUpdated\)/)
  assert.match(source, /window\.removeEventListener\('toolaze:check-in-updated', handleCheckInUpdated\)/)
  assert.match(source, /setCheckIn\(nextCheckIn\)/)
})

test('earn credits page visible copy is supplied by locale copy props', () => {
  assert.match(source, /copy\.hero\.eyebrow/)
  assert.match(source, /copy\.hero\.title/)
  assert.match(source, /copy\.checkIn\.title/)
  assert.match(source, /copy\.share\.submitForReview/)
  assert.doesNotMatch(source, />Earn Free Credits</)
  assert.doesNotMatch(source, />Daily check-in</)
  assert.doesNotMatch(source, />Submit for review</)
})
