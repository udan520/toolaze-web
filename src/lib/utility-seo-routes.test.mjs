import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import test from 'node:test'

import * as utilitySeoRoutes from './utility-seo-routes.ts'

const {
  RETAINED_UTILITY_L3,
  UTILITY_TOOLS,
  getUtilityLocaleAliasTarget,
  getUtilityParentPath,
  isRetainedUtilityL3,
  isUtilityTool,
  shouldIncludeUtilityL3InSitemap,
} = utilitySeoRoutes

const root = process.cwd()
const readSource = (...segments) => readFileSync(join(root, ...segments), 'utf8')
const require = createRequire(import.meta.url)

test('utility SEO policy keeps the L2 tools available but removes every utility L3 from indexable surfaces', () => {
  assert.deepEqual(UTILITY_TOOLS, [
    'image-compressor',
    'image-converter',
    'font-generator',
    'emoji-copy-and-paste',
  ])

  assert.deepEqual(RETAINED_UTILITY_L3, {
    'image-compressor': [],
    'image-converter': [],
    'font-generator': [],
    'emoji-copy-and-paste': [],
  })

  assert.equal(isUtilityTool('font-generator'), true)
  assert.equal(isUtilityTool('watermark-remover'), false)
  assert.equal(isRetainedUtilityL3('font-generator', 'fancy'), false)
  assert.equal(isRetainedUtilityL3('font-generator', 'gothic'), false)
  assert.equal(isRetainedUtilityL3('image-compressor', 'batch-compress'), false)
  assert.equal(isRetainedUtilityL3('image-converter', 'png-to-webp'), false)
})

test('utility parent paths preserve real locale L2 pages and omit the English prefix', () => {
  assert.equal(getUtilityParentPath('en', 'font-generator'), '/font-generator')
  assert.equal(getUtilityParentPath('de', 'font-generator'), '/de/font-generator')
  assert.equal(getUtilityParentPath('zh-TW', 'image-compressor'), '/zh-TW/image-compressor')
})

test('every utility L3 alias consolidates to its locale L2 parent', () => {
  assert.equal(
    getUtilityLocaleAliasTarget('en', 'font-generator', 'fancy'),
    '/font-generator'
  )
  assert.equal(
    getUtilityLocaleAliasTarget('en', 'font-generator', 'gothic'),
    '/font-generator'
  )
  assert.equal(
    getUtilityLocaleAliasTarget('de', 'font-generator', 'fancy'),
    '/de/font-generator'
  )
  assert.equal(
    getUtilityLocaleAliasTarget('fr', 'emoji-copy-and-paste', 'all-tools'),
    '/fr/emoji-copy-and-paste'
  )
})

test('sitemap and navigation policies exclude every utility URL below L2', () => {
  const { shouldExposeUtilityL3InNavigation, shouldIncludeUtilityL2InSitemap } = utilitySeoRoutes

  assert.equal(typeof shouldIncludeUtilityL2InSitemap, 'function')
  assert.equal(typeof shouldExposeUtilityL3InNavigation, 'function')

  for (const tool of UTILITY_TOOLS) {
    assert.equal(shouldIncludeUtilityL2InSitemap(tool), false)
    assert.equal(shouldExposeUtilityL3InNavigation(tool), false)
  }

  assert.equal(shouldIncludeUtilityL3InSitemap('en', 'font-generator', 'cool'), false)
  assert.equal(shouldIncludeUtilityL3InSitemap('en', 'image-compressor', 'batch-compress'), false)
  assert.equal(shouldIncludeUtilityL3InSitemap('en', 'font-generator', 'gothic'), false)
  assert.equal(shouldIncludeUtilityL3InSitemap('de', 'font-generator', 'cool'), false)
  assert.equal(shouldIncludeUtilityL3InSitemap('en', 'emoji-copy-and-paste', 'fire-copy-and-paste'), false)
})

test('utility L3 routes use the shared policy and permanent redirects', () => {
  const localizedRoute = readSource('src', 'app', '[locale]', '[tool]', '[slug]', 'page.tsx')
  assert.match(localizedRoute, /getUtilityLocaleAliasTarget/)
  assert.match(localizedRoute, /isUtilityTool/)
  assert.match(localizedRoute, /export const dynamicParams = false/)
  assert.match(localizedRoute, /const UTILITY_REDIRECT_LOCALES = \[/)
  assert.match(localizedRoute, /for \(const locale of UTILITY_REDIRECT_LOCALES\.filter\(\(locale\) => locale !== 'en'\)\)/)
  assert.match(localizedRoute, /emojiCopyPasteSlugs, 'all-tools'/)
  assert.match(
    localizedRoute,
    /permanentRedirect\(getUtilityLocaleAliasTarget\(locale, resolvedParams\.tool, resolvedParams\.slug\)\)/
  )

  for (const tool of UTILITY_TOOLS) {
    const route = readSource('src', 'app', tool, '[slug]', 'page.tsx')
    assert.match(route, /isRetainedUtilityL3/)
    assert.match(route, /permanentRedirect/)
    assert.match(route, new RegExp(`permanentRedirect\\('/${tool}'\\)`))
  }
})

test('utility all-tools routes permanently redirect to their L2 parent', () => {
  for (const tool of ['image-compressor', 'image-converter', 'font-generator']) {
    const localizedRoute = readSource('src', 'app', '[locale]', tool, 'all-tools', 'page.tsx')
    assert.match(localizedRoute, /permanentRedirect/)
    assert.match(localizedRoute, /getUtilityParentPath/)

    const englishRoute = readSource('src', 'app', tool, 'all-tools', 'page.tsx')
    assert.match(englishRoute, /permanentRedirect/)
    assert.match(englishRoute, new RegExp(`permanentRedirect\\('/${tool}'\\)`))
  }

  const emojiRoute = readSource('src', 'app', 'emoji-copy-and-paste', 'all-tools', 'page.tsx')
  assert.match(emojiRoute, /permanentRedirect\('\/emoji-copy-and-paste'\)/)
})

test('legacy Kling aliases use server-side permanent redirects', () => {
  const klingRoute = readSource('src', 'app', 'kling-3', 'page.tsx')
  const klingAllToolsRoute = readSource('src', 'app', 'kling-3', 'all-tools', 'page.tsx')
  const canonicalAllToolsRoute = readSource('src', 'app', 'model', 'kling-3', 'all-tools', 'page.tsx')

  assert.match(klingRoute, /permanentRedirect\('\/model\/kling-3'\)/)
  assert.doesNotMatch(klingRoute, /useEffect|useRouter|router\.push|'use client'/)
  assert.match(klingAllToolsRoute, /permanentRedirect\('\/model\/kling-3'\)/)
  assert.doesNotMatch(klingAllToolsRoute, /useEffect|useRouter|router\.push|'use client'/)
  assert.match(canonicalAllToolsRoute, /permanentRedirect\('\/model\/kling-3'\)/)
})

test('sitemap and navigation stop exposing all utility SEO URLs', () => {
  const sitemap = readSource('src', 'app', 'sitemap.ts')
  assert.match(sitemap, /shouldIncludeUtilityL2InSitemap/)
  assert.match(sitemap, /shouldIncludeUtilityL3InSitemap/)
  assert.doesNotMatch(sitemap, /const TOOL_PAGES = \[/)
  assert.doesNotMatch(
    sitemap,
    /const path = locale === 'en' \? `\/\$\{tool\}\/all-tools` : `\/\$\{locale\}\/\$\{tool\}\/all-tools`/
  )

  const toolSlugContent = readSource(
    'src',
    'app',
    '[locale]',
    '[tool]',
    '[slug]',
    'ToolSlugPageContent.tsx'
  )
  assert.match(toolSlugContent, /isUtilityTool\(tool\)[\s\S]*getUtilityParentPath\(locale, tool\)/)

  const clientMenuData = readSource('src', 'lib', 'client-menu-data.ts')
  assert.match(clientMenuData, /shouldExposeUtilityL3InNavigation/)
  assert.match(clientMenuData, /if \(!shouldExposeUtilityL3InNavigation\(tool\)\) return \[\]/)

  const navigation = readSource('src', 'components', 'Navigation.tsx')
  for (const tool of UTILITY_TOOLS) {
    assert.match(navigation, new RegExp(`tool: '${tool}'[\\s\\S]{0,120}hasThirdLevel: false`))
  }
})

test('utility L2 routes are noindex,follow while remaining usable', () => {
  const routes = [
    ['src', 'app', 'image-compressor', 'page.tsx'],
    ['src', 'app', 'image-converter', 'page.tsx'],
    ['src', 'app', 'font-generator', 'page.tsx'],
    ['src', 'app', 'emoji-copy-and-paste', 'page.tsx'],
    ['src', 'app', '[locale]', 'image-compressor', 'page.tsx'],
    ['src', 'app', '[locale]', 'image-converter', 'page.tsx'],
    ['src', 'app', '[locale]', 'font-generator', 'page.tsx'],
    ['src', 'app', '[locale]', 'emoji-copy-and-paste', 'page.tsx'],
  ]

  for (const route of routes) {
    assert.match(readSource(...route), /robots: 'noindex, follow'/, route.join('/'))
  }
})

test('Next config serves historical utility redirects before page rendering', async () => {
  const nextConfig = require(join(root, 'next.config.js'))
  assert.equal(typeof nextConfig.redirects, 'function')

  const redirects = await nextConfig.redirects()
  const findRedirect = (source) => redirects.find((item) => item.source === source)

  assert.deepEqual(findRedirect('/font-generator/gothic'), {
    source: '/font-generator/gothic',
    destination: '/font-generator',
    permanent: true,
  })
  assert.deepEqual(findRedirect('/de/font-generator/fancy'), {
    source: '/de/font-generator/fancy',
    destination: '/de/font-generator',
    permanent: true,
  })
  assert.deepEqual(findRedirect('/en/font-generator/fancy'), {
    source: '/en/font-generator/fancy',
    destination: '/font-generator',
    permanent: true,
  })
  assert.deepEqual(findRedirect('/fr/emoji-copy-and-paste/all-tools'), {
    source: '/fr/emoji-copy-and-paste/all-tools',
    destination: '/fr/emoji-copy-and-paste',
    permanent: true,
  })
  assert.deepEqual(findRedirect('/image-compressor/compress-jpg'), {
    source: '/image-compressor/compress-jpg',
    destination: '/image-compressor',
    permanent: true,
  })
  assert.deepEqual(findRedirect('/font-generator/fancy'), {
    source: '/font-generator/fancy',
    destination: '/font-generator',
    permanent: true,
  })
  assert.deepEqual(findRedirect('/image-compressor/batch-compress'), {
    source: '/image-compressor/batch-compress',
    destination: '/image-compressor',
    permanent: true,
  })
})
