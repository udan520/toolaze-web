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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const aiImageFunctionMenuSource = getConstantBlock(
  'const AI_IMAGE_FUNCTION_MENU_ITEMS',
  'const AI_IMAGE_MODEL_MENU_ITEMS',
)
const aiImageModelMenuSource = getConstantBlock(
  'const AI_IMAGE_MODEL_MENU_ITEMS',
  'type AiVideoNavLabelKey',
)
const aiVideoFunctionMenuSource = getConstantBlock(
  'const AI_VIDEO_FUNCTION_MENU_ITEMS',
  'const AI_VIDEO_MODEL_MENU_ITEMS',
)
const aiVideoModelMenuSource = getConstantBlock(
  'const AI_VIDEO_MODEL_MENU_ITEMS',
  'function getInitialNavTranslations',
)
const promptMenuGroupsSource = getConstantBlock(
  'const promptMenuGroups',
  'return (',
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
    '/ai-video-generator?model=seedance-2-mini',
    '/model/seedance-2',
    '/model/kling-3-motion-control',
    '/model/kling-3',
    '/model/kling-2-6-pro-motion-control',
    '/model/wan-2-5-ai-video-generator',
    '/model/grok-imagine-video-1-5',
  ]

  for (const href of expectedModelLinks) {
    const escapedHref = escapeRegExp(href)
    assert.match(aiVideoModelMenuSource, new RegExp(`href: '${escapedHref}'`), `${href} should exist in AI Video model tags`)
  }

  const modelIndexes = expectedModelLinks.map((href) => aiVideoModelMenuSource.indexOf(`href: '${href}'`))
  assert.ok(modelIndexes.every((index) => index >= 0))
  assert.deepEqual(modelIndexes, [...modelIndexes].sort((a, b) => a - b))
  assert.doesNotMatch(aiVideoModelMenuSource, /href: '\/model\/seedance-2-5'/)
  assert.match(aiVideoModelMenuSource, /href: '\/ai-video-generator\?model=seedance-2-mini'[\s\S]*badgeKey: 'new'/)
  assert.match(aiVideoModelMenuSource, /href: '\/model\/kling-2-6-pro-motion-control'[\s\S]*badgeKey: 'hot'/)

  assert.doesNotMatch(aiVideoModelMenuSource, /href: '\/kling-ai-video-generator'/)

  for (const block of [getDesktopAiVideoBlock(), getMobileAiVideoBlock()]) {
    const modelSectionIndex = block.indexOf('data-ai-video-section="models"')
    const modelMapIndex = block.indexOf('AI_VIDEO_MODEL_MENU_ITEMS.map')
    assert.notEqual(modelSectionIndex, -1)
    assert.notEqual(modelMapIndex, -1)
    assert.ok(modelMapIndex > modelSectionIndex)
  }

  assert.match(navigationSource, /rounded-full[\s\S]*data-ai-video-model-tag/)
})

test('Prompts model menu only keeps prompt-library model collections', () => {
  const expectedPromptModelLinks = [
    '/prompts/models/gpt-image-2',
    '/prompts/models/seedance-2-0',
    '/prompts/models/kling',
    '/prompts/models/nano-banana',
  ]
  const removedPromptModelLinks = [
    '/model/wan-2-7-ai-video-generator',
    '/model/wan-2-6-ai-video-generator',
    '/model/wan-2-5-ai-video-generator',
    '/model/seedance-2-5',
    '/model/kling-2-6-pro-motion-control',
  ]

  for (const href of expectedPromptModelLinks) {
    assert.match(promptMenuGroupsSource, new RegExp(escapeRegExp(href)), `${href} should stay in Prompts model menu`)
  }

  for (const href of removedPromptModelLinks) {
    assert.doesNotMatch(promptMenuGroupsSource, new RegExp(escapeRegExp(href)), `${href} should be removed from Prompts model menu`)
  }
})

test('AI Image navigation separates functions from model tags ordered by rating', () => {
  const expectedFunctionLinks = [
    '/ai-image-generator',
    '/text-to-image-generator',
    '/ai-image-to-image-generator',
  ]
  const expectedModelLinks = [
    '/model/gpt-image-2',
    '/model/seedream-5-0-pro',
    '/model/nano-banana-pro',
    '/model/seedream-5-0-lite',
    '/model/wan-2-7-image',
    '/model/nano-banana-2',
    '/model/seedream-4-5',
  ]

  for (const href of expectedFunctionLinks) {
    const escapedHref = href.replace(/\//g, '\\/')
    assert.match(aiImageFunctionMenuSource, new RegExp(`href: '${escapedHref}'`), `${href} should exist in AI Image function cards`)
  }

  const modelIndexes = expectedModelLinks.map((href) => aiImageModelMenuSource.indexOf(`href: '${href}'`))
  assert.ok(modelIndexes.every((index) => index >= 0))
  assert.deepEqual(modelIndexes, [...modelIndexes].sort((a, b) => a - b))
  assert.match(aiImageModelMenuSource, /href: '\/model\/gpt-image-2'[\s\S]*badgeKey: 'hot'/)
  assert.match(aiImageModelMenuSource, /href: '\/model\/seedream-5-0-pro'[\s\S]*badgeKey: 'new'/)

  for (const block of [
    navigationSource.slice(navigationSource.indexOf('{/* 一级菜单：AI Image */}'), navigationSource.indexOf('{/* 一级菜单：AI Video */}')),
    navigationSource.slice(navigationSource.indexOf('{/* AI Image 部分 */}'), navigationSource.indexOf('{/* AI Video 部分 */}')),
  ]) {
    const functionSectionIndex = block.indexOf('data-ai-image-section="functions"')
    const modelSectionIndex = block.indexOf('data-ai-image-section="models"')
    assert.notEqual(functionSectionIndex, -1)
    assert.notEqual(modelSectionIndex, -1)
    assert.ok(functionSectionIndex < modelSectionIndex)
  }

  assert.match(navigationSource, /rounded-full[\s\S]*data-ai-image-model-tag/)
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
