import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  claimLocalDevDailyCheckIn,
  consumeLocalDevCredits,
  createLocalDevHistoryItem,
  getLocalDevDailyCheckInStatus,
  getLocalDevCreditSummary,
  isLocalRequest,
  resetLocalDevCreditsForTests,
} from './local-dev-auth.js'

test('local dev status marks completed active-streak rewards as claimed', () => {
  const stateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-auth-'))
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(stateDir, 'state.json')
  resetLocalDevCreditsForTests()

  claimLocalDevDailyCheckIn(new Date('2026-07-01T12:00:00.000Z'))
  claimLocalDevDailyCheckIn(new Date('2026-07-02T12:00:00.000Z'))

  const status = getLocalDevDailyCheckInStatus(new Date('2026-07-02T12:05:00.000Z'))

  assert.equal(status.checkedInToday, true)
  assert.equal(status.streakDay, 2)
  assert.deepEqual(status.rewards.filter((reward) => reward.claimed).map((reward) => reward.day), [1, 2])
  assert.deepEqual(status.rewards.filter((reward) => reward.current).map((reward) => reward.day), [2])
})

test('local dev credit summary backfills wrapped tool metadata from shared generation history', () => {
  const stateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-auth-'))
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(stateDir, 'state.json')
  resetLocalDevCreditsForTests(1000)

  const creditResult = consumeLocalDevCredits(10, 'Seedream 5.0 Lite image-to-image generation')
  assert.equal(creditResult.ok, true)

  const historyResult = createLocalDevHistoryItem({
    mediaType: 'image',
    model: 'seedream-5-0-lite',
    prompt: 'Change the outfit using the target clothing reference.',
    outputUrl: 'https://example.com/generated-clothes.webp',
    inputUrls: ['https://example.com/person.webp', 'https://example.com/dress.webp'],
    toolSlug: 'ai-clothes-changer',
    toolLabel: 'AI Clothes Changer',
    sourcePath: '/ai-clothes-changer',
  })
  assert.equal(historyResult.ok, true)

  const [usageTransaction] = getLocalDevCreditSummary().transactions
  assert.equal(usageTransaction.description, 'Clothes Changer')
  assert.deepEqual(usageTransaction.metadata, {
    model: 'seedream-5-0-lite',
    modelLabel: 'Seedream 5.0 Lite',
    isImageToImage: true,
    toolSlug: 'ai-clothes-changer',
    toolLabel: 'Clothes Changer',
    sourcePath: '/ai-clothes-changer',
  })
})

test('local dev credit summary ignores video history when backfilling image credit activity', () => {
  const stateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-auth-'))
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(stateDir, 'state.json')
  resetLocalDevCreditsForTests(1000)

  const creditResult = consumeLocalDevCredits(10, 'Image generation')
  assert.equal(creditResult.ok, true)

  const videoHistoryResult = createLocalDevHistoryItem({
    mediaType: 'video',
    model: 'grok-video-1-5',
    prompt: 'Make the subject dance.',
    outputUrl: 'https://example.com/generated-dance.mp4',
    inputUrls: ['https://example.com/source.webp'],
    toolSlug: 'ai-dance-generator',
    toolLabel: 'AI Dance Generator',
    sourcePath: '/ai-dance-generator',
  })
  assert.equal(videoHistoryResult.ok, true)

  const [usageTransaction] = getLocalDevCreditSummary().transactions
  assert.equal(usageTransaction.description, 'Image generation')
  assert.equal(usageTransaction.metadata, undefined)
})

test('local request detection accepts localhost Host when the URL uses the dev bind address', () => {
  const request = new Request('http://0.0.0.0:3016/api/ai-video-generator', {
    headers: { Host: 'localhost:3016' },
  })

  assert.equal(isLocalRequest(request), true)
})

test('local request detection rejects a remote URL and remote Host', () => {
  const request = new Request('https://toolaze.com/api/ai-video-generator', {
    headers: { Host: 'toolaze.com' },
  })

  assert.equal(isLocalRequest(request), false)
})
