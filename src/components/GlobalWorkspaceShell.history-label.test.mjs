import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const source = await readFile(new URL('./GlobalWorkspaceShell.tsx', import.meta.url), 'utf8')

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
