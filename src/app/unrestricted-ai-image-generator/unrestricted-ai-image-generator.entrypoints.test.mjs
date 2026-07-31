import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const slug = 'unrestricted-ai-image-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('unrestricted AI image generator has root and localized routes', () => {
  assert.equal(existsSync(`src/app/${slug}/page.tsx`), true)
  assert.equal(existsSync(`src/app/[locale]/${slug}/page.tsx`), true)
})

test('unrestricted AI image generator is exposed in sitemap and AI tools hub', () => {
  const sitemapSource = readFileSync('src/app/sitemap.ts', 'utf8')
  const aiToolsSource = readFileSync('src/app/ai-tools/copy.ts', 'utf8')

  assert.match(sitemapSource, new RegExp(`/${slug}`))
  assert.match(aiToolsSource, new RegExp(`href: '/${slug}'`))
  assert.match(aiToolsSource, /unrestricted:/)
})

test('unrestricted AI image generator has localized navigation, footer, and homepage entries', () => {
  for (const locale of locales) {
    const common = JSON.parse(readFileSync(`src/data/${locale}/common.json`, 'utf8'))
    const homepageCard = common.home.homepageToolCardSummaries[slug]

    assert.match(common.nav.unrestrictedAiImageGenerator, /Unrestricted|Unlimited/)
    assert.match(common.footer.unrestrictedAiImageGenerator, /Unrestricted|Unlimited/)
    assert.ok(homepageCard, `${locale} homepage card should exist`)
    assert.match(homepageCard.cardTitle, /Unrestricted|Unlimited/)
    assert.match(homepageCard.summary, /unlimited-style/)
  }
})
