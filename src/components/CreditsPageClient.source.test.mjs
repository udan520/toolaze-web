import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./CreditsPageClient.tsx', import.meta.url), 'utf8')
const transactionDescriptionSource = readFileSync(
  new URL('../lib/credit-transaction-description.ts', import.meta.url),
  'utf8',
)

test('credits page short English labels use Title Case', () => {
  assert.match(source, /availableCredits: 'Available Credits'/)
  assert.match(source, /emptyTitle: 'No Credit Activity Yet\.'/)
  assert.match(source, /balanceAfter: 'Balance: \{balance\}'/)
  assert.doesNotMatch(source, /balanceAfter: 'Balance: \{balance\} Credits'/)
})

test('credits page formats legacy purchase descriptions for display', () => {
  assert.match(source, /formatCreditTransactionDescription/)
  assert.match(source, /formatCreditTransactionDescription\(transaction\.description\)/)
  assert.match(transactionDescriptionSource, /replace\(\/\[_-\]\+\/g, ' '\)/)
  assert.match(transactionDescriptionSource, /charAt\(0\)\.toUpperCase\(\)/)
})

test('credits page does not expose internal transaction reasons', () => {
  assert.doesNotMatch(source, /\{transaction\.reason\}/)
  assert.match(source, /formatCreditBalance\(transaction\.balanceAfter\)/)
})

test('credits page description can use the full content width on desktop', () => {
  assert.match(source, /className="mt-2 max-w-none text-sm leading-6 text-slate-600"/)
  assert.doesNotMatch(source, /className="mt-2 max-w-2xl text-sm leading-6 text-slate-600"/)
})

test('credits page adds transaction tabs only to the full activity page', () => {
  assert.match(source, /CREDIT_TRANSACTION_TABS/)
  assert.match(source, /tabs:\s*\{[\s\S]*all: 'All'[\s\S]*obtained: 'Obtained'[\s\S]*used: 'Used'[\s\S]*purchases: 'Purchases'/)
  assert.doesNotMatch(source, /earned: 'Earned'/)
  assert.match(source, /copy\.tabs\[tab\.id\] \|\| tab\.label/)
  assert.match(source, /useState<CreditTransactionTab>\('all'\)/)
  assert.match(source, /filterCreditTransactions\(credits\.transactions, activeTab\)/)
  assert.match(source, /aria-pressed=\{activeTab === tab\.id\}/)
  assert.match(source, /setActiveTab\(tab\.id\)/)
  assert.match(source, /visibleTransactions\.map/)
  assert.doesNotMatch(source, /credits\.transactions\.map/)
})
