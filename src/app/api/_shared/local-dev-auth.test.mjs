import assert from 'node:assert/strict'
import test from 'node:test'

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
