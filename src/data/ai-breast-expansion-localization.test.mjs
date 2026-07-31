import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const pageName = 'ai-breast-expansion.json'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const localizedLocales = locales.filter((locale) => locale !== 'en')
const factoryDir = join(
  root,
  '_codex',
  'seo-pipeline',
  'tasks',
  '2026-07-31-ai-breast-expansion',
  'content',
)
const expectedSectionsOrder = [
  'intro',
  'howToUse',
  'photoTips',
  'promptExamples',
  'workflowComparison',
  'scenes',
  'features',
  'faq',
]

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

function collectStrings(value, path = '', result = []) {
  if (typeof value === 'string') {
    result.push({ path, value })
    return result
  }
  if (Array.isArray(value)) {
    value.forEach((child, index) => collectStrings(child, `${path}[${index}]`, result))
    return result
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, path ? `${path}.${key}` : key, result)
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
    'topTool.mode',
    'topTool.modelId',
    'topTool.defaultPrompt',
    'topTool.defaultImageUrls',
    'topTool.textOverrides.promptPlaceholder',
    'topTool.functionalAcceptance.recommendedMode',
    'topTool.functionalAcceptance.reason',
  ].some((prefix) => path === prefix || path.startsWith(`${prefix}[`))
    || /^topTool\.sampleImages\[\d+\]\.url$/.test(path)
    || /^topTool\.functionalAcceptance\.presets\[\d+\]\.(prompt|group)$/.test(path)
    || /^promptExamples\.items\[\d+\]\.prompt$/.test(path)
    || /^moreToolsLinks\[\d+\]\.href$/.test(path)
    || /\.color$/.test(path)
    || /\.icon(Type)?$/.test(path)
}

test('AI Breast Expansion localized pages preserve the complete English structure', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const englishShape = shapeOf(english)

  for (const locale of locales) {
    const pagePath = join(root, 'src', 'data', locale, pageName)
    assert.equal(existsSync(pagePath), true, `${locale} page JSON should exist`)
    const page = readJson(pagePath)

    assert.deepEqual(shapeOf(page), englishShape, `${locale} should preserve English structure`)
    assert.deepEqual(page.sectionsOrder, expectedSectionsOrder, `${locale} should keep the approved section order`)
    assert.equal(page.promptExamples.items.length, 3, `${locale} should keep three prompt levels`)
    assert.equal(page.features.items.length, 3, `${locale} should keep three Why Toolaze reasons`)
    assert.equal(page.howToUse.steps.length, 3, `${locale} should keep three How-to steps`)
    assert.equal(page.faq.length, 6, `${locale} should keep six FAQ entries`)
    assert.equal(page.topTool.modelId, 'wan-2-7-image', `${locale} should keep Wan 2.7 Image as the default model`)
  }
})

test('AI Breast Expansion prompt strings stay stable as model input text', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const expectedPromptFields = [
    'topTool.defaultPrompt',
    'topTool.textOverrides.promptPlaceholder',
    'topTool.functionalAcceptance.presets[0].prompt',
    'topTool.functionalAcceptance.presets[1].prompt',
    'topTool.functionalAcceptance.presets[2].prompt',
    'promptExamples.items[0].prompt',
    'promptExamples.items[1].prompt',
    'promptExamples.items[2].prompt',
  ]
  const englishStrings = new Map(collectStrings(english).map(({ path, value }) => [path, value]))

  for (const locale of localizedLocales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))
    const localeStrings = new Map(collectStrings(page).map(({ path, value }) => [path, value]))

    for (const path of expectedPromptFields) {
      assert.equal(localeStrings.get(path), englishStrings.get(path), `${locale} should preserve ${path}`)
    }
  }
})

test('AI Breast Expansion localized visible copy does not fall back to English', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const englishStrings = new Map(
    collectStrings(english)
      .filter(({ path, value }) => !isWhitelistedPath(path) && value.trim().length >= 8)
      .map(({ path, value }) => [path, value]),
  )

  for (const locale of localizedLocales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))

    for (const { path, value } of collectStrings(page)) {
      if (isWhitelistedPath(path)) continue
      const englishValue = englishStrings.get(path)
      if (!englishValue) continue
      assert.notEqual(value, englishValue, `${locale} retains English copy at ${path}`)
    }
  }
})

test('AI Breast Expansion SEO Factory content mirrors public locale JSON', () => {
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

test('AI Breast Expansion route metadata, loader, language switch, and sitemap support every locale', () => {
  const rootPageSource = readFileSync(join(root, 'src', 'app', 'ai-breast-expansion', 'page.tsx'), 'utf8')
  const localePageSource = readFileSync(join(root, 'src', 'app', '[locale]', 'ai-breast-expansion', 'page.tsx'), 'utf8')
  const seoLoaderSource = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')
  const languageSwitchSource = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const sitemapSource = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')

  assert.match(rootPageSource, /generateHreflangAlternates\('en', '\/ai-breast-expansion'\)/)
  assert.match(localePageSource, /generateHreflangAlternates\(locale, pathWithoutLocale\)/)
  assert.match(seoLoaderSource, /tool === 'ai-breast-expansion'[\s\S]*importL2FlatJson\('ai-breast-expansion', normalizedLocale\)/)
  assert.match(seoLoaderSource, /tool === 'ai-breast-expansion'[\s\S]*import\('@\/data\/en\/ai-breast-expansion\.json'\)/)
  assert.match(languageSwitchSource, /'ai-breast-expansion': ALL_LOCALE_CODES/)
  assert.match(sitemapSource, /\{ path: '\/ai-breast-expansion', priority: 0\.84 \}/)
  assert.doesNotMatch(sitemapSource, /ENGLISH_ONLY_AI_IMAGE_L2_PAGES[\s\S]*ai-breast-expansion/)
})
