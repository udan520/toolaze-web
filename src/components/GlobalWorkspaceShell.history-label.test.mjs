import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(new URL('./GlobalWorkspaceShell.tsx', import.meta.url), 'utf8')
const localizedHistoryRoute = await readFile(new URL('../app/[locale]/history/page.tsx', import.meta.url), 'utf8')
const projectRules = await readFile(new URL('../../AGENTS.md', import.meta.url), 'utf8')

test('workspace history menu uses localized History labels without changing its route', () => {
  const expectedLabels = [
    "history: 'History'",
    "history: 'Verlauf'",
    "history: '履歴'",
    "history: 'Historial'",
    "history: '歷史記錄'",
    "history: 'Histórico'",
    "history: 'Historique'",
    "history: '기록'",
    "history: 'Cronologia'",
  ]

  for (const label of expectedLabels) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }

  assert.match(source, /\{ labelKey: 'history', href: '\/history', icon: 'library' \}/)
  assert.doesNotMatch(source, /labelKey: 'library'/)
})

test('English History uses the locale-free canonical route', () => {
  assert.match(localizedHistoryRoute, /if \(locale === 'en'\) permanentRedirect\('\/history'\)/)
  assert.match(localizedHistoryRoute, /locale === 'en'[\s\S]*'https:\/\/toolaze\.com\/history'/)
  assert.doesNotMatch(localizedHistoryRoute, /LOCALIZED_LOCALES = \[[^\]]*'en'/)
  assert.match(projectRules, /英文默认语言的公开页面 URL 不得包含 `\/en` 前缀/)
})
