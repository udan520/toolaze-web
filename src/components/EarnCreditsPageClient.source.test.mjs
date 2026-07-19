import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./EarnCreditsPageClient.tsx', import.meta.url), 'utf8')

test('claimed daily check-in reward cards show a green check marker on the card corner', () => {
  assert.match(source, /reward\.claimed \?\s*\(/)
  assert.match(source, /aria-label=\{`Day \$\{reward\.day\} checked in`\}/)
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
