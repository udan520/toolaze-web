import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'happyhorse-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function readSource(path) {
  return readFileSync(join(root, path), 'utf8')
}

test('HappyHorse model page is available on the main preview app', () => {
  assert.ok(
    existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')),
    'English HappyHorse model route should exist',
  )

  for (const locale of locales) {
    assert.ok(
      existsSync(join(root, 'src', 'data', locale, `${slug}.json`)),
      `HappyHorse content should exist for ${locale}`,
    )
  }

  const localizedRoute = readSource('src/app/[locale]/model/[model]/page.tsx')
  const seoLoader = readSource('src/lib/seo-loader.ts')
  const sitemap = readSource('src/app/sitemap.ts')
  const languageSwitch = readSource('src/lib/site-language-switch.ts')

  assert.match(localizedRoute, new RegExp(`'${slug}': '${slug}'`))
  assert.match(seoLoader, new RegExp(`tool === '${slug}'`))
  assert.match(sitemap, new RegExp(`'${slug}'`))
  assert.match(languageSwitch, new RegExp(`'${slug}': ALL_LOCALE_CODES`))
})
