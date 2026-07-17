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

test('Vercel keeps account APIs on Next routes while leaving image storage rewrites on Pages', () => {
  const config = JSON.parse(readProjectFile('vercel.json'))
  const rewriteSources = new Set((config.rewrites || []).map((rewrite) => rewrite.source))

  for (const source of [
    '/api/auth/:path*',
    '/api/credits',
    '/api/history',
    '/api/rewards/check-in',
    '/api/rewards/x-post',
    '/api/admin/reward-events',
    '/api/admin/reward-reviews',
  ]) {
    assert.equal(
      rewriteSources.has(source),
      false,
      `${source} should be served by Vercel's Next API route layer`,
    )
  }

  for (const source of [
    '/api/upload',
    '/api/save-image-to-r2',
    '/api/download-image',
  ]) {
    assert.equal(
      rewriteSources.has(source),
      true,
      `${source} should keep using the existing Pages/R2 storage route`,
    )
  }
})
