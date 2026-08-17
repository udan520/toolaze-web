import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./HowToUse.tsx', import.meta.url), 'utf8')

test('HowToUse renders optional step media between the step number and title', () => {
  assert.match(source, /media\?:\s*\{[\s\S]*src:\s*string[\s\S]*alt:\s*string[\s\S]*\}/)
  assert.match(source, /step\.media\.src/)
  assert.match(source, /step\.media\.alt/)
  assert.match(source, /\{idx \+ 1\}[\s\S]*<img[\s\S]*step\.media\.src[\s\S]*step\.media\.alt[\s\S]*<h3/s)
  assert.match(source, /object-contain/, 'step screenshots should remain fully visible')
})

test('HowToUse keeps its original four-step layout when steps include media', () => {
  assert.match(source, /steps\.length === 4[\s\S]*grid-cols-1 md:grid-cols-4 gap-8 text-center/)
  assert.doesNotMatch(source, /const hasStepMedia/)
  assert.match(source, /<div key=\{idx\} className="group">/)
  assert.match(source, /w-20 h-20 mb-8 mx-auto rounded-full/)
})
