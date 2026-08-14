import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const readSource = (path) => readFileSync(path, 'utf8')

test('Prompt detail and localized collection routes opt out of indexing', () => {
  const routes = [
    'src/app/prompts/[id]/page.tsx',
    'src/app/[locale]/prompts/page.tsx',
    'src/app/[locale]/prompts/models/[model]/page.tsx',
    'src/app/[locale]/prompts/categories/[category]/page.tsx',
  ]

  for (const route of routes) {
    assert.match(
      readSource(route),
      /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/,
      `${route} must emit noindex, follow metadata`,
    )
  }
})
