import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./AiImageGeneratorPageContent.tsx', import.meta.url), 'utf8')

test('ai image generator page wrapper does not add extra right padding around the tool', () => {
  const wrapperClass = source.match(/<section className="([^"]*)">\s*<div className="w-full max-w-full">/)?.[1] || ''

  assert.notEqual(wrapperClass, '')
  assert.match(wrapperClass, /\bpr-0\b/)
  assert.match(wrapperClass, /\bmd:pr-0\b/)
  assert.doesNotMatch(wrapperClass, /\bpr-2\b/)
  assert.doesNotMatch(wrapperClass, /\bmd:pr-6\b/)
})
