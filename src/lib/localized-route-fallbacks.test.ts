import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ENGLISH_ONLY_ROOT_ROUTES } from './localized-route-fallbacks'
import { BROWSER_LOCALE_REDIRECT_SCRIPT } from './browser-locale-redirect'
import { getPreferredLocalizedUrl } from './site-language-switch'

test('formerly English-only support routes now have localized URLs', () => {
  const localizedRoutes = ['refund-policy', 'acceptable-use', 'contact', 'earn-credits']

  for (const route of localizedRoutes) {
    assert.equal(getPreferredLocalizedUrl(`/${route}`, 'zh-TW'), `/zh-TW/${route}`)
    assert.equal(getPreferredLocalizedUrl(`/${route}`, 'de'), `/de/${route}`)
    assert.ok(!ENGLISH_ONLY_ROOT_ROUTES.includes(route as never), `${route} should not be English-only`)
    assert.doesNotMatch(BROWSER_LOCALE_REDIRECT_SCRIPT, new RegExp(`englishOnlyRoots[\\s\\S]*${route}`))
  }
})

test('admin routes stay on English-only local paths', () => {
  assert.ok(ENGLISH_ONLY_ROOT_ROUTES.includes('admin' as never))
  assert.equal(getPreferredLocalizedUrl('/admin/users', 'zh-TW'), '/admin/users')
  assert.match(BROWSER_LOCALE_REDIRECT_SCRIPT, /englishOnlyRoots[\s\S]*admin/)
})

test('localized support routes have explicit locale pages and indexed support sitemap coverage', () => {
  const sitemap = readFileSync('src/app/sitemap.ts', 'utf8')
  const indexedRoutes = ['refund-policy', 'acceptable-use', 'contact']

  for (const route of ['refund-policy', 'acceptable-use', 'contact', 'earn-credits']) {
    assert.match(readFileSync(`src/app/[locale]/${route}/page.tsx`, 'utf8'), /generateStaticParams/)
  }

  for (const route of indexedRoutes) {
    assert.match(sitemap, new RegExp(`const STATIC_PAGES = \\[[^\\]]*['"]${route}['"]`))
  }

  assert.doesNotMatch(sitemap, /const STATIC_PAGES = \[[^\]]*['"]earn-credits['"]/)
})
