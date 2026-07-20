import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const footerSource = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')

test('top AI tools menu links to the World Cup generator', () => {
  assert.match(navigationSource, /href=\{getLocalizedHref\('\/world-cup-ai-image-generator'\)\}/)
})

test('footer links to the World Cup generator', () => {
  assert.match(footerSource, /href=\{getLocalizedHref\('\/world-cup-ai-image-generator'\)\}/)
})
