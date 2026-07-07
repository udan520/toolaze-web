import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

const projectRoot = process.cwd()

function readProjectFile(path) {
  return readFileSync(join(projectRoot, path), 'utf8')
}

test('localized layout allows ISR child routes outside pregenerated params', () => {
  const source = readProjectFile('src/app/[locale]/layout.tsx')

  assert.match(source, /export const dynamicParams = true/)
})

test('Vercel API route handlers remain runtime dynamic', () => {
  const routeFiles = [
    'src/app/api/generate-alt/route.js',
    'src/app/api/image-to-image/route.js',
    'src/app/api/image-to-image/status/route.js',
    'src/app/api/save-image-to-r2/route.js',
  ]

  for (const routeFile of routeFiles) {
    const source = readProjectFile(routeFile)

    assert.doesNotMatch(source, /export const dynamic = ['"]force-static['"]/)
    assert.match(source, /export const dynamic = ['"]force-dynamic['"]/)
  }
})

test('localized tool ISR params do not prebuild api placeholders', () => {
  const source = readProjectFile('src/app/[locale]/[tool]/[slug]/page.tsx')

  assert.doesNotMatch(source, /locale:\s*['"]api['"]/)
  assert.doesNotMatch(source, /\/api\/\*\s*占位/)
})
