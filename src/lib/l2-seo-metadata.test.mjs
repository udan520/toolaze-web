import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const helperPath = new URL('./l2-seo-metadata.ts', import.meta.url)

test('L2 SEO metadata helper resolves page-owned demo images before the logo fallback', () => {
  assert.ok(existsSync(helperPath), 'src/lib/l2-seo-metadata.ts should exist')

  const source = readFileSync(helperPath, 'utf8')
  assert.match(source, /heroDemoVideo\?\.poster/, 'video demo poster should be the first OG image candidate')
  assert.match(source, /heroDemoVideo\?\.src/, 'image hero demo src should be an OG image candidate')
  assert.match(source, /firstSample\?\.poster/, 'sample image poster should be an OG image candidate')
  assert.match(source, /firstSample\?\.url/, 'sample image URL should be an OG image candidate')
  assert.match(source, /web-app-manifest-512x512\.png/, 'Toolaze logo should remain the fallback image')
})

test('AI Clothes Changer route uses the shared L2 metadata helper for OG and Twitter images', () => {
  const rootRoute = readFileSync(new URL('../app/ai-clothes-changer/page.tsx', import.meta.url), 'utf8')
  const localeRoute = readFileSync(new URL('../app/[locale]/ai-clothes-changer/page.tsx', import.meta.url), 'utf8')

  for (const source of [rootRoute, localeRoute]) {
    assert.match(source, /buildL2SeoMetadata/)
    assert.doesNotMatch(source, /openGraph:\s*\{[\s\S]*url:\s*hreflang\.canonical[\s\S]*\}\s*,?\s*\n\s*}/)
  }
})
