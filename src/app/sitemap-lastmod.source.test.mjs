import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const sitemapSource = readFileSync(new URL('./sitemap.ts', import.meta.url), 'utf8')

test('sitemap omits lastmod when a canonical path has no verified date', () => {
  assert.doesNotMatch(sitemapSource, /LEGACY_LAST_MODIFIED_DATE/)
  assert.match(sitemapSource, /const mappedDate = LAST_MODIFIED_BY_CANONICAL_PATH\[canonicalPath\]/)
  assert.match(sitemapSource, /return mappedDate \? toLastModifiedDate\(mappedDate\) : undefined/)
  assert.match(sitemapSource, /lastModified\?: Date/)
})

test('recently launched or substantially updated landing pages use verified dates', () => {
  assert.match(sitemapSource, /'\/ai-clothes-changer': '2026-08-08'/)
  assert.match(sitemapSource, /'\/model\/happyhorse-ai-video-generator': '2026-08-07'/)
  assert.match(sitemapSource, /'\/model\/pixverse-v6-ai-video-generator': '2026-08-07'/)
})
