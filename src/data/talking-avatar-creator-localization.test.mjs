import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const pageName = 'talking-avatar-creator.json'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const localizedLocales = locales.filter((locale) => locale !== 'en')
const factoryDir = join(
  root,
  '_codex',
  'seo-pipeline',
  'tasks',
  '2026-07-31-talking-avatar-creator',
  'content',
)
const demoVideoUrl = 'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo.mp4'
const demoPosterUrl = 'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo-poster.webp'
const aiVideoDemoUrl = 'https://assets.toolaze.com/uploads/ai-video-generator/ai-video-generator-grok-demo.mp4'
const aiImageDemoUrl = 'https://assets.toolaze.com/home-model-cards/gpt-image-2.jpg'

const trimCopyKeys = [
  'audioTrimTitle',
  'audioTrimMessage',
  'audioTrimStartLabel',
  'audioTrimLengthLabel',
  'audioTrimRangeLabel',
  'audioTrimConfirmAction',
  'audioTrimCancelAction',
  'audioTooLongMessage',
  'audioReadFailedMessage',
  'audioTrimFailedMessage',
]
const expectedSectionsOrder = ['intro', 'howToUse', 'promptExamples', 'scenes', 'features', 'performanceMetrics', 'faq']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function shapeOf(value) {
  if (Array.isArray(value)) return value.map(shapeOf)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shapeOf(child)]))
  }
  return typeof value
}

function collectVisibleStrings(value, path = '', result = []) {
  if (typeof value === 'string') {
    result.push({ path, value })
    return result
  }
  if (Array.isArray(value)) {
    value.forEach((child, index) => collectVisibleStrings(child, `${path}[${index}]`, result))
    return result
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectVisibleStrings(child, path ? `${path}.${key}` : key, result)
    }
  }
  return result
}

function isWhitelistedPath(path) {
  return [
    'pageGroup',
    'visiblePageType',
    'topComponent',
    'sectionsOrder',
  ].some((prefix) => path === prefix || path.startsWith(`${prefix}[`))
    || /^heroDemoVideo\.(src|poster|duration|uploadDate|sourceHistory)$/.test(path)
    || /^(promptExamples)\.items\[\d+\]\.prompt$/.test(path)
    || /^moreToolsLinks\[\d+\]\.slug$/.test(path)
    || /^moreToolsLinks\[\d+\]\.href$/.test(path)
    || /^moreToolsLinks\[\d+\]\.media\.(type|src|poster)$/.test(path)
    || /\.color$/.test(path)
    || /\.icon$/.test(path)
}

test('Talking Avatar localized pages preserve the complete English structure', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const englishShape = shapeOf(english)

  for (const locale of locales) {
    const pagePath = join(root, 'src', 'data', locale, pageName)
    assert.equal(existsSync(pagePath), true, `${locale} page JSON should exist`)
    const page = readJson(pagePath)

    assert.deepEqual(shapeOf(page), englishShape, `${locale} should preserve English structure`)
    assert.deepEqual(page.sectionsOrder, expectedSectionsOrder, `${locale} should keep the approved section order`)
    assert.equal(page.promptExamples.items.length, 4, `${locale} should keep four prompt examples`)
    assert.equal(page.features.items.length, 6, `${locale} should keep six feature cards`)
    assert.equal(page.howToUse.steps.length, 4, `${locale} should keep four How-to steps`)
    assert.equal(page.faq.length, 6, `${locale} should keep six FAQ entries`)
  }
})

test('Talking Avatar audio trim UI copy exists in every locale', () => {
  for (const locale of locales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))

    for (const key of trimCopyKeys) {
      assert.equal(
        typeof page.topTool?.textOverrides?.[key],
        'string',
        `${locale} topTool.textOverrides.${key} should exist`,
      )
      assert.ok(page.topTool.textOverrides[key].trim(), `${locale} ${key} should not be empty`)
    }
  }
})

test('Talking Avatar localized visible copy does not fall back to English', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const englishStrings = new Map(
    collectVisibleStrings(english)
      .filter(({ path, value }) => !isWhitelistedPath(path) && value.trim().length >= 8)
      .map(({ path, value }) => [path, value]),
  )

  for (const locale of localizedLocales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))

    for (const { path, value } of collectVisibleStrings(page)) {
      if (isWhitelistedPath(path)) continue
      const englishValue = englishStrings.get(path)
      if (!englishValue) continue
      assert.notEqual(value, englishValue, `${locale} retains English copy at ${path}`)
    }
  }
})

test('Talking Avatar SEO Factory content mirrors public locale JSON', () => {
  for (const locale of locales) {
    const factoryPath = join(factoryDir, `${locale}.json`)
    assert.equal(existsSync(factoryPath), true, `${locale} Factory content should exist`)
    assert.deepEqual(
      readJson(factoryPath),
      readJson(join(root, 'src', 'data', locale, pageName)),
      `${locale} Factory content should mirror public page data`,
    )
  }
})

test('Talking Avatar demo video uses the uploaded R2 asset in every locale', () => {
  for (const locale of locales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))

    assert.equal(page.heroDemoVideo?.src, demoVideoUrl, `${locale} demo video should use R2 mp4`)
    assert.equal(page.heroDemoVideo?.poster, demoPosterUrl, `${locale} demo poster should use R2 WebP`)
    assert.match(page.heroDemoVideo?.duration || '', /^PT14\.48S$/)
    assert.ok(page.heroDemoVideo?.ariaLabel?.trim(), `${locale} demo video should have localized aria label`)
  }
})

test('Talking Avatar related tools use demo media instead of icon-only cards', () => {
  const expectedMedia = [
    { type: 'video', src: aiVideoDemoUrl },
    { type: 'video', src: aiVideoDemoUrl },
    { type: 'image', src: aiImageDemoUrl },
  ]

  for (const locale of locales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))

    assert.equal(page.moreToolsLinks.length, 3, `${locale} should keep three related tools`)
    assert.deepEqual(
      page.moreToolsLinks.map((item) => ({ type: item.media?.type, src: item.media?.src })),
      expectedMedia,
      `${locale} related tools should use demo media assets`,
    )
    assert.ok(
      page.moreToolsLinks.every((item) => item.media?.alt?.trim()),
      `${locale} related tool media should include localized alt text`,
    )
    assert.equal(
      page.moreToolsLinks.some((item) => item.icon),
      false,
      `${locale} related tools should not use icon-only card data`,
    )
  }
})

test('Talking Avatar public entry points are wired across Toolaze surfaces', () => {
  const navigationSource = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footerSource = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const homeSource = readFileSync(join(root, 'src', 'components', 'home', 'HomePageMain.tsx'), 'utf8')
  const aiToolsCopySource = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')
  const sitemapSource = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitchSource = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const slug = '/talking-avatar-creator'

  assert.match(navigationSource, /talkingAvatarCreator/, 'navigation should reference the localized label key')
  assert.match(navigationSource, new RegExp(demoPosterUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'navigation should use the shared Talking Avatar poster')
  assert.match(navigationSource, /AI_VIDEO_TOOL_MENU_ITEMS[\s\S]*\/talking-avatar-creator/, 'AI Tools video group should include Talking Avatar')
  assert.equal(
    (navigationSource.match(/getLocalizedHref\('\/talking-avatar-creator'\)/g) ?? []).length,
    2,
    'AI Video desktop and mobile menus should include localized Talking Avatar links',
  )
  assert.match(footerSource, /\/talking-avatar-creator/, 'footer should include Talking Avatar')
  assert.match(homeSource, /localizeHomeHref\('\/talking-avatar-creator'\)/, 'homepage AI Tools hub should include Talking Avatar')
  assert.match(homeSource, new RegExp(demoVideoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'homepage should use the shared Talking Avatar demo video')
  assert.match(homeSource, new RegExp(demoPosterUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'homepage should use the shared Talking Avatar poster')
  assert.match(aiToolsCopySource, /href:\s*'\/talking-avatar-creator'/, 'AI Tools hub should include Talking Avatar')
  assert.match(aiToolsCopySource, new RegExp(demoPosterUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'AI Tools hub should use the shared Talking Avatar poster')
  assert.match(sitemapSource, /\/talking-avatar-creator/, 'sitemap should include Talking Avatar')
  assert.match(languageSwitchSource, /'talking-avatar-creator': ALL_LOCALE_CODES/, 'language switch should support every locale')

  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.ok(common.nav?.talkingAvatarCreator?.trim(), `${locale} nav.talkingAvatarCreator should exist`)
    assert.ok(common.footer?.talkingAvatarCreator?.trim(), `${locale} footer.talkingAvatarCreator should exist`)
  }
})
