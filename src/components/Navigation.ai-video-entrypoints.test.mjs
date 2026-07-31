import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function getConstantBlock(start, end) {
  return navigationSource.slice(
    navigationSource.indexOf(start),
    navigationSource.indexOf(end, navigationSource.indexOf(start)),
  )
}

const aiVideoFunctionMenuSource = getConstantBlock(
  'const AI_VIDEO_FUNCTION_MENU_ITEMS',
  'const AI_VIDEO_MODEL_MENU_ITEMS',
)
const aiVideoModelMenuSource = getConstantBlock(
  'const AI_VIDEO_MODEL_MENU_ITEMS',
  'function getInitialNavTranslations',
)

test('AI Video navigation exposes video tools and Wan 2.5 model entry points', () => {
  assert.match(aiVideoFunctionMenuSource, /href: '\/ai-video-generator'/)
  assert.match(aiVideoFunctionMenuSource, /href: '\/image-to-video-generator'/)
  assert.match(aiVideoFunctionMenuSource, /href: '\/text-to-video-generator'/)
  assert.match(aiVideoModelMenuSource, /href: '\/model\/wan-2-5-ai-video-generator'/)
})

function getDesktopAiVideoBlock() {
  return navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* 一级菜单：AI Video */}')),
  )
}

function getMobileAiVideoBlock() {
  return navigationSource.slice(
    navigationSource.indexOf('{/* AI Video 部分 */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* AI Video 部分 */}')),
  )
}

test('AI Video navigation separates functional entries from model tags', () => {
  const desktopAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* 一级菜单：AI Video */}')),
  )
  const mobileAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Video 部分 */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* AI Video 部分 */}')),
  )

  for (const block of [desktopAiVideoBlock, mobileAiVideoBlock]) {
    const functionalSectionIndex = block.indexOf('data-ai-video-section="functions"')
    const modelSectionIndex = block.indexOf('data-ai-video-section="models"')
    const supportedModelsIndex = block.indexOf('supportedAiModels')

    assert.notEqual(functionalSectionIndex, -1)
    assert.notEqual(modelSectionIndex, -1)
    assert.notEqual(supportedModelsIndex, -1)
    assert.ok(functionalSectionIndex < modelSectionIndex)
    assert.ok(supportedModelsIndex > functionalSectionIndex)
  }
})

test('AI Video navigation keeps AI Dance and Talking Avatar in AI Tools only', () => {
  for (const block of [getDesktopAiVideoBlock(), getMobileAiVideoBlock()]) {
    assert.equal(block.includes("href={getLocalizedHref('/ai-dance-generator')}"), false)
    assert.equal(block.includes("href={getLocalizedHref('/talking-avatar-creator')}"), false)
  }

  assert.match(navigationSource, /const AI_VIDEO_TOOL_MENU_ITEMS[\s\S]*\/talking-avatar-creator[\s\S]*\/ai-dance-generator/)
})

test('AI Video model links render as tag-style entries after the function cards', () => {
  const expectedModelLinks = [
    '/model/wan-2-5-ai-video-generator',
    '/model/seedance-2-5',
    '/model/seedance-2',
    '/model/kling-3',
    '/kling-ai-video-generator',
    '/model/grok-imagine-video-1-5',
  ]

  for (const href of expectedModelLinks) {
    const escapedHref = href.replace(/\//g, '\\/')
    assert.match(aiVideoModelMenuSource, new RegExp(`href: '${escapedHref}'`), `${href} should exist in AI Video model tags`)
  }

  for (const block of [getDesktopAiVideoBlock(), getMobileAiVideoBlock()]) {
    const modelSectionIndex = block.indexOf('data-ai-video-section="models"')
    const modelMapIndex = block.indexOf('AI_VIDEO_MODEL_MENU_ITEMS.map')
    assert.notEqual(modelSectionIndex, -1)
    assert.notEqual(modelMapIndex, -1)
    assert.ok(modelMapIndex > modelSectionIndex)
  }

  assert.match(navigationSource, /rounded-full[\s\S]*data-ai-video-model-tag/)
})

test('AI Image navigation puts GPT Image 2 first and keeps Seedream models grouped after Pro', () => {
  const desktopAiImageBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Image */}'),
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
  )
  const mobileAiImageBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Image 部分 */}'),
    navigationSource.indexOf('{/* AI Video 部分 */}'),
  )
  const expectedModelOrder = [
    '/model/gpt-image-2',
    '/model/seedream-5-0-pro',
    '/model/seedream-5-0-lite',
    '/model/seedream-4-5',
    '/model/wan-2-7-image',
    '/model/nano-banana-pro',
    '/model/nano-banana-2',
  ]
  const getOrder = (block, href) => {
    const match = block.match(new RegExp(`href=\\{getLocalizedHref\\('${href}'\\)\\}[\\s\\S]*?className="[^"]*\\border-(\\d+)\\b`))
    assert.notEqual(match, null, `${href} should exist in AI Image navigation`)
    return Number(match[1])
  }

  for (const block of [desktopAiImageBlock, mobileAiImageBlock]) {
    const orders = expectedModelOrder.map((href) => getOrder(block, href))
    assert.deepEqual(orders, [4, 5, 6, 7, 8, 9, 10])
  }
})

test('every navigation label used by the component exists for every supported locale', () => {
  const referencedKeys = [
    ...new Set(
      [...navigationSource.matchAll(/navTranslations\.([A-Za-z0-9_]+)/g)].map((match) => match[1]),
    ),
  ]

  for (const locale of locales) {
    const common = JSON.parse(
      readFileSync(new URL(`../data/${locale}/common.json`, import.meta.url), 'utf8'),
    )

    for (const key of referencedKeys) {
      assert.equal(typeof common.nav[key], 'string', `${locale} nav.${key}`)
    }
  }
})

test('German navigation does not leave Film & Trailer in English', () => {
  const common = JSON.parse(
    readFileSync(new URL('../data/de/common.json', import.meta.url), 'utf8'),
  )

  assert.notEqual(common.nav.filmTrailer, 'Film & Trailer')
})
