import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/app/model/ModelHubGrid.tsx', 'utf8')

test('AI Models hub exposes All, Image, and Video tabs', () => {
  assert.match(source, /MODEL_HUB_CATEGORIES\.map/)
  assert.match(source, /aria-pressed=\{activeCategory === category\}/)
})

test('AI Models hub uses three cards per desktop row', () => {
  assert.match(source, /lg:grid-cols-3/)
})
