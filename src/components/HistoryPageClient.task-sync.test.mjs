import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./HistoryPageClient.tsx', import.meta.url), 'utf8')

test('History polls durable pending tasks and resumes when the page becomes visible', () => {
  assert.match(source, /status:\s*'pending'\s*\|\s*'succeeded'\s*\|\s*'failed'/)
  assert.match(source, /PENDING_HISTORY_POLL_INTERVAL_MS\s*=\s*5000/)
  assert.match(source, /statusRequest/)
  assert.match(source, /document\.visibilityState/)
  assert.match(source, /visibilitychange/)
  assert.match(source, /window\.addEventListener\('focus'/)
})
test('History renders explicit pending and failed cards without result-only actions', () => {
  assert.match(source, /data-history-status="pending"/)
  assert.match(source, /data-history-status="failed"/)
  assert.match(source, /item\.status === 'succeeded'/)
  assert.match(source, /item\.status !== 'succeeded'/)
})

test('all History locales define task lifecycle copy', () => {
  for (const locale of ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW']) {
    const common = JSON.parse(readFileSync(new URL(`../data/${locale}/common.json`, import.meta.url), 'utf8'))
    assert.equal(typeof common.historyPage.statusGenerating, 'string', `${locale} statusGenerating`)
    assert.equal(typeof common.historyPage.statusFailed, 'string', `${locale} statusFailed`)
    assert.equal(typeof common.historyPage.failureFallback, 'string', `${locale} failureFallback`)
  }
})
