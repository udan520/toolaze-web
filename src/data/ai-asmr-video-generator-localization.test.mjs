import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const locales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const pageName = 'ai-asmr-video-generator.json'
const factoryDir = join(
  root,
  '_codex',
  'seo-pipeline',
  'tasks',
  '2026-07-29-ai-asmr-video-generator',
  'content',
)

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
    value.forEach((child, index) => collectVisibleStrings(child, path + '[' + index + ']', result))
    return result
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      collectVisibleStrings(child, path ? path + '.' + key : key, result)
    }
  }
  return result
}

function isWhitelistedPath(path) {
  return [
    'pageGroup',
    'visiblePageType',
    'topComponent',
    'topTool.defaultMode',
    'heroDemoVideo.src',
    'heroDemoVideo.poster',
    'sectionsOrder',
  ].some((prefix) => path === prefix || path.startsWith(prefix + '['))
    || /^(promptExamples|troubleshooting)\.items\[\d+\]\.prompt$/.test(path)
    || /\.color$/.test(path)
    || /\.icon$/.test(path)
    || /\.iconType$/.test(path)
    || (/\.title$/.test(path) && /modelSelectionGuide\.items/.test(path))
}

test('AI ASMR localized pages preserve the complete English structure', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const englishShape = shapeOf(english)

  for (const locale of locales) {
    const pagePath = join(root, 'src', 'data', locale, pageName)
    assert.equal(existsSync(pagePath), true, locale + ' page JSON should exist')
    const page = readJson(pagePath)

    assert.deepEqual(shapeOf(page), englishShape, locale + ' should preserve English structure')
    assert.equal(page.promptExamples.items.length, 4, locale + ' should keep four prompt examples')
    assert.equal(page.features.items.length, 3, locale + ' should keep three Why Toolaze reasons')
    assert.equal(page.howToUse.steps.length, 4, locale + ' should keep four How-to steps')
    assert.equal(page.faq.length, 8, locale + ' should keep eight FAQ entries')
  }
})

test('AI ASMR SEO Factory locale records point to public locale JSON', () => {
  for (const locale of locales) {
    const factoryPath = join(factoryDir, locale + '.json')
    assert.equal(existsSync(factoryPath), true, locale + ' Factory content should exist')
    const factory = readJson(factoryPath)

    assert.equal(factory.taskId, '2026-07-29-ai-asmr-video-generator')
    assert.equal(factory.slug, 'ai-asmr-video-generator')
    assert.equal(factory.pageType, 'l2')
    assert.equal(factory.status, 'ready_for_publish')
    assert.equal(factory.locale, locale)
    assert.equal(factory.sourceData, 'src/data/' + locale + '/' + pageName)
  }
})

test('AI ASMR language switch exposes every Toolaze locale', () => {
  const source = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  assert.match(source, /'ai-asmr-video-generator': ALL_LOCALE_CODES/)
})

test('AI ASMR localized visible copy does not fall back to full English strings', () => {
  const english = readJson(join(root, 'src', 'data', 'en', pageName))
  const englishStrings = new Map(
    collectVisibleStrings(english)
      .filter(({ path, value }) => !isWhitelistedPath(path) && value.trim().length >= 8)
      .map(({ path, value }) => [path, value]),
  )

  for (const locale of locales) {
    const page = readJson(join(root, 'src', 'data', locale, pageName))
    for (const { path, value } of collectVisibleStrings(page)) {
      if (isWhitelistedPath(path)) continue
      const englishValue = englishStrings.get(path)
      if (!englishValue) continue
      assert.notEqual(value, englishValue, locale + ' retains English copy at ' + path)
    }
  }
})
