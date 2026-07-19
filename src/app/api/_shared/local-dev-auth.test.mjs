import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  claimLocalDevDailyCheckIn,
  getLocalDevDailyCheckInStatus,
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
