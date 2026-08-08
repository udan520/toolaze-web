import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import sitemap from '../app/sitemap'
import { ENGLISH_ONLY_ROOT_ROUTES } from './localized-route-fallbacks'
import { BROWSER_LOCALE_REDIRECT_SCRIPT } from './browser-locale-redirect'
import { getPreferredLocalizedUrl } from './site-language-switch'

const sitemapLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const

test('formerly English-only support routes now have localized URLs', () => {
  const localizedRoutes = ['refund-policy', 'acceptable-use', 'contact', 'earn-credits', 'ai-video-generator']

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

  for (const route of ['refund-policy', 'acceptable-use', 'contact', 'earn-credits', 'ai-video-generator']) {
    assert.match(readFileSync(`src/app/[locale]/${route}/page.tsx`, 'utf8'), /generateStaticParams/)
  }

  for (const route of indexedRoutes) {
    assert.match(sitemap, new RegExp(`const STATIC_PAGES = \\[[^\\]]*['"]${route}['"]`))
  }

  assert.doesNotMatch(sitemap, /const STATIC_PAGES = \[[^\]]*['"]earn-credits['"]/)
  assert.match(sitemap, /SUPPORTED_LOCALES\.forEach\(\(locale\) => \{[\s\S]*ai-video-generator/, 'sitemap should enumerate localized AI Video Generator URLs')
})

test('sitemap includes linked AI landing pages and localized AI hubs', async () => {
  const urls = new Set((await sitemap()).map((entry) => entry.url))

  const localizedRoutes = [
    '/ai-asmr-video-generator',
    '/ai-hairstyle-changer',
    '/ai-tools',
    '/model',
  ]

  for (const route of localizedRoutes) {
    for (const locale of sitemapLocales) {
      const path = locale === 'en' ? route : `/${locale}${route}`
      assert.ok(urls.has(`https://toolaze.com${path}`), `${path} should be indexed in sitemap`)
    }
  }
})

test('sitemap lastmod uses stable page dates instead of build time', async () => {
  const source = readFileSync('src/app/sitemap.ts', 'utf8')
  assert.doesNotMatch(source, /const\s+today\s*=\s*new Date/)
  assert.doesNotMatch(source, /lastModified:\s*today/)

  const entries = await sitemap()
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]))
  const toLastModifiedIso = (value: Date | string | undefined) => value instanceof Date ? value.toISOString() : String(value)
  const lastModifiedValues = entries.map((entry) => toLastModifiedIso(entry.lastModified))

  assert.ok(new Set(lastModifiedValues).size > 1, 'sitemap should not stamp every URL with one build date')
  assert.equal(toLastModifiedIso(byUrl.get('https://toolaze.com/ai-dance-generator')?.lastModified), '2026-07-20T00:00:00.000Z')
  assert.equal(toLastModifiedIso(byUrl.get('https://toolaze.com/de/ai-dance-generator')?.lastModified), '2026-07-20T00:00:00.000Z')
  assert.equal(toLastModifiedIso(byUrl.get('https://toolaze.com/ai-asmr-video-generator')?.lastModified), '2026-07-29T00:00:00.000Z')
  assert.equal(toLastModifiedIso(byUrl.get('https://toolaze.com/ai-zine-poster-generator')?.lastModified), '2026-08-05T00:00:00.000Z')
})

test('localized Seedance model L3 URLs redirect back to the model page', () => {
  const routePath = 'src/app/[locale]/model/seedance-2/[slug]/page.tsx'

  assert.ok(existsSync(routePath), '/zh-TW/model/seedance-2/image-to-video should be handled')

  const routeSource = readFileSync(routePath, 'utf8')
  assert.match(routeSource, /generateStaticParams/)
  assert.match(routeSource, /getAllSlugs\('seedance-2', 'en'\)/)
  assert.doesNotMatch(routeSource, /permanentRedirect\(`\/model\/seedance-2\/\$\{resolvedParams\.slug\}`\)/)
  assert.match(routeSource, /\/model\/seedance-2/)
  assert.doesNotMatch(
    readFileSync('src/app/sitemap.ts', 'utf8'),
    /\/\$?\{?locale\}?\/model\/seedance-2/,
    'localized Seedance model L3 redirects should stay out of the sitemap',
  )
  assert.doesNotMatch(
    readFileSync('src/app/sitemap.ts', 'utf8'),
    /\/model\/seedance-2\/\$\{slug\}/,
    'Seedance workflow L3 pages should stay out of the sitemap',
  )
})

test('Seedance 2 legacy aliases use permanent redirects to consolidate ranking signals', () => {
  const seedanceRootPage = readFileSync('src/app/seedance-2/page.tsx', 'utf8')
  const localizedSeedanceRootPage = readFileSync('src/app/[locale]/seedance-2/page.tsx', 'utf8')
  const localizedSeedanceAllToolsPage = readFileSync('src/app/[locale]/seedance-2/all-tools/page.tsx', 'utf8')
  const localizedToolSlugPage = readFileSync('src/app/[locale]/[tool]/[slug]/page.tsx', 'utf8')

  assert.match(seedanceRootPage, /permanentRedirect\('\/model\/seedance-2'\)/)
  assert.doesNotMatch(seedanceRootPage, /useRouter|router\.push/)

  assert.match(localizedSeedanceRootPage, /permanentRedirect\(locale === 'en' \? '\/model\/seedance-2' : `\/\$\{locale\}\/model\/seedance-2`\)/)
  assert.doesNotMatch(localizedSeedanceRootPage, /import \{ redirect \} from 'next\/navigation'/)

  assert.match(localizedSeedanceAllToolsPage, /permanentRedirect\(locale === 'en' \? '\/model\/seedance-2' : `\/\$\{locale\}\/model\/seedance-2`\)/)
  assert.doesNotMatch(localizedSeedanceAllToolsPage, /import \{ redirect \} from 'next\/navigation'/)

  assert.match(localizedToolSlugPage, /permanentRedirect\(locale === 'en' \? '\/model\/seedance-2' : `\/\$\{locale\}\/model\/seedance-2`\)/)
  assert.doesNotMatch(
    localizedToolSlugPage,
    /if \(resolvedParams\.tool === 'seedance-2'\)[\s\S]*redirect\(locale === 'en' \? '\/model\/seedance-2'/,
  )
})
