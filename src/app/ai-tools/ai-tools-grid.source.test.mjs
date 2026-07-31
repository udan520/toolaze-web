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

test('AI Tools hub renders video cards with real video previews', () => {
  assert.match(source, /function ToolPreview/)
  assert.match(source, /card\.category === 'video' && card\.video/)
  assert.match(source, /<video[\s\S]*src=\{card\.video\}[\s\S]*poster=\{card\.image\}/)
  assert.match(source, /autoPlay/)
  assert.match(source, /loop/)
  assert.match(source, /muted/)
  assert.match(source, /playsInline/)
})
