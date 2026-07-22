import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/app/ai-tools/AiToolsGrid.tsx', 'utf8')

test('AI Tools hub exposes All, image, and video tabs', () => {
  assert.match(source, /AI_TOOL_CATEGORIES\.map/)
  assert.match(source, /aria-pressed=\{activeCategory === category\}/)
})

test('AI Tools hub keeps three cards per desktop row', () => {
  assert.match(source, /lg:grid-cols-3/)
})
