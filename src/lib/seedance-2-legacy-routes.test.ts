import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const legacySlugs = ['ai-video-generator', 'text-to-video', 'image-to-video']
const legacyRoutes = [
  'src/app/seedance-2/[slug]/page.tsx',
  'src/app/model/seedance-2/[slug]/page.tsx',
  'src/app/[locale]/model/seedance-2/[slug]/page.tsx',
]

test('Seedance L3 redirects use fixed legacy slugs without content files', () => {
  const legacySlugSource = 'src/lib/seedance-2-legacy-routes.ts'
  assert.ok(existsSync(legacySlugSource), 'legacy slug list must be independent of removed page content')
  assert.match(readFileSync(legacySlugSource, 'utf8'), /ai-video-generator[\s\S]*text-to-video[\s\S]*image-to-video/)

  for (const route of legacyRoutes) {
    const source = readFileSync(route, 'utf8')
    assert.doesNotMatch(source, /getAllSlugs\('seedance-2', 'en'\)/, `${route} must not load obsolete Seedance L3 content`)
    assert.match(source, /LEGACY_SEEDANCE_2_L3_SLUGS/, `${route} must statically cover every legacy Seedance L3 URL`)
  }

  for (const locale of locales) {
    for (const slug of legacySlugs) {
      assert.equal(
        existsSync(`src/data/${locale}/seedance-2/${slug}.json`),
        false,
        `${locale}/${slug} legacy content must be removed`,
      )
    }
  }
})
