import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  claimLocalDevDailyCheckIn,
  consumeLocalDevCredits,
  createLocalDevHistoryItem,
  getLocalDevDailyCheckInStatus,
  getLocalDevCreditSummary,
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
