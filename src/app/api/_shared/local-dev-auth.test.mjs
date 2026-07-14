import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { tmpdir } from 'node:os'

const originalStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
const stateDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-auth-test-'))
process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(stateDir, 'state.json')

test.after(() => {
  if (originalStateFile === undefined) {
    delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  } else {
    process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = originalStateFile
  }
  delete globalThis[Symbol.for('toolaze.localDevAuthState')]
  rmSync(stateDir, { recursive: true, force: true })
})

async function importFreshLocalDevAuth(label) {
  return import(`./local-dev-auth.js?isolated=${label}-${Date.now()}-${Math.random()}`)
}

test('local dev credit state is shared across isolated route module instances', async () => {
  const writer = await importFreshLocalDevAuth('writer')
  const reader = await importFreshLocalDevAuth('reader')

  writer.resetLocalDevCreditsForTests(1000)
  writer.consumeLocalDevCredits(10)

  assert.equal(reader.getLocalDevCreditSummary().balance, 990)
  assert.equal(reader.getLocalDevCreditSummary().transactions[0].amount, -10)
})

test('local dev history upgrades existing state created before history support', async () => {
  const localDevAuth = await importFreshLocalDevAuth('legacy-history')
  globalThis[Symbol.for('toolaze.localDevAuthState')] = {
    balance: 1000,
    transactions: [],
    holds: new Map(),
  }

  const item = localDevAuth.createLocalDevHistoryItem({
    mediaType: 'image',
    model: 'seedream-5-0-pro',
    prompt: 'legacy state prompt',
    outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/output.webp',
  })

  assert.equal(item.ok, true)
  assert.equal(localDevAuth.listLocalDevHistory(10).length, 1)
})


test('local dev history preserves same-origin reference image paths', async () => {
  const localDevAuth = await importFreshLocalDevAuth('relative-history-reference')
  localDevAuth.resetLocalDevCreditsForTests(1000)

  const item = localDevAuth.createLocalDevHistoryItem({
    mediaType: 'image',
    model: 'seedream-5-0-pro',
    prompt: 'relative reference prompt',
    outputUrl: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/output.webp',
    inputUrls: [
      '/ai-hair-color-changer/default-reference.png',
      'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
      'javascript:alert(1)',
    ],
  })

  assert.equal(item.ok, true)
  assert.deepEqual(item.item.inputUrls, [
    '/ai-hair-color-changer/default-reference.png',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/input.webp',
  ])
})

test('local dev credit state persists after server memory reset', async () => {
  const previousStateFile = process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
  const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-local-dev-state-'))
  process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = join(tempDir, 'state.json')

  try {
    const writer = await importFreshLocalDevAuth('persistent-writer')
    writer.resetLocalDevCreditsForTests(1000)
    writer.consumeLocalDevCredits(10)

    delete globalThis[Symbol.for('toolaze.localDevAuthState')]

    const reader = await importFreshLocalDevAuth('persistent-reader')
    assert.equal(reader.getLocalDevCreditSummary().balance, 990)
    assert.equal(reader.getLocalDevCreditSummary().transactions[0].amount, -10)
  } finally {
    if (previousStateFile === undefined) {
      delete process.env.TOOLAZE_LOCAL_DEV_STATE_FILE
    } else {
      process.env.TOOLAZE_LOCAL_DEV_STATE_FILE = previousStateFile
    }
    delete globalThis[Symbol.for('toolaze.localDevAuthState')]
    rmSync(tempDir, { recursive: true, force: true })
  }
})
