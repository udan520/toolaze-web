import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const footerSource = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')

test('top prompts menu does not link to the World Cup generator', () => {
  assert.doesNotMatch(navigationSource, /href=\{getLocalizedHref\('\/world-cup-ai-image-generator'\)\}/)
})

test('footer does not link to the World Cup generator', () => {
  assert.doesNotMatch(footerSource, /href=\{getLocalizedHref\('\/world-cup-ai-image-generator'\)\}/)
})
