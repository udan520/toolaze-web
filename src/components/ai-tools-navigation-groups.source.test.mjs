import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const toolL2PageSource = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

const imageToolHrefs = [
  '/ai-hairstyle-changer',
  '/ai-hair-color-changer',
  '/ai-clothes-changer',
  '/ai-bikini-generator',
  '/ai-baby-generator',
  '/ai-couple-photo-maker',
  '/world-cup-ai-image-generator',
  '/watermark-remover',
  '/photo-restoration',
]

const videoToolHrefs = [
  '/ai-asmr-video-generator',
  '/talking-avatar-creator',
  '/ai-kissing-video-generator',
  '/ai-dance-generator',
]

function sourceBetween(start, end) {
  const startIndex = navigationSource.indexOf(start)
  const endIndex = navigationSource.indexOf(end, startIndex + start.length)
  assert.notEqual(startIndex, -1, `missing source marker: ${start}`)
  assert.notEqual(endIndex, -1, `missing source marker: ${end}`)
  return navigationSource.slice(startIndex, endIndex)
}

test('AI Tools navigation defines the approved image and video groups once', () => {
  const imageGroup = sourceBetween(
    'const AI_IMAGE_TOOL_MENU_ITEMS',
    'const AI_VIDEO_TOOL_MENU_ITEMS',
  )
  const videoGroup = sourceBetween(
    'const AI_VIDEO_TOOL_MENU_ITEMS',
    'function getInitialNavTranslations',
  )

  for (const href of imageToolHrefs) assert.match(imageGroup, new RegExp(`href: '${href}'`))
  for (const href of videoToolHrefs) assert.match(videoGroup, new RegExp(`href: '${href}'`))

  assert.equal(imageGroup.match(/href: '/g)?.length, imageToolHrefs.length)
  assert.equal(videoGroup.match(/href: '/g)?.length, videoToolHrefs.length)
})

test('AI Tools desktop and mobile menus expose categorized controls', () => {
  assert.match(navigationSource, /data-ai-tools-group="image"/)
  assert.match(navigationSource, /data-ai-tools-group="video"/)
  assert.match(
    navigationSource,
    /grid-cols-\[minmax\(0,1\.55fr\)_minmax\(0,0\.9fr\)\]/,
  )
  assert.match(navigationSource, /ai-tools-image/)
  assert.match(navigationSource, /ai-tools-video/)
  assert.match(navigationSource, /aria-expanded=\{isExpanded\}/)
})

test('AI Tools category headings are translated in every locale', () => {
  for (const locale of locales) {
    const common = JSON.parse(
      readFileSync(new URL(`../data/${locale}/common.json`, import.meta.url), 'utf8'),
    )
    assert.equal(typeof common.nav.imageTools, 'string', `${locale} imageTools should exist`)
    assert.equal(typeof common.nav.videoTools, 'string', `${locale} videoTools should exist`)
    assert.equal(
      typeof common.nav.aiAsmrVideoGenerator,
      'string',
      `${locale} aiAsmrVideoGenerator should exist`,
    )
    assert.equal(
      typeof common.nav.aiBikiniGenerator,
      'string',
      `${locale} aiBikiniGenerator should exist`,
    )
    assert.equal(
      typeof common.nav.talkingAvatarCreator,
      'string',
      `${locale} talkingAvatarCreator should exist`,
    )
    assert.notEqual(common.nav.imageTools.trim(), '', `${locale} imageTools should not be empty`)
    assert.notEqual(common.nav.videoTools.trim(), '', `${locale} videoTools should not be empty`)
  }
})

test('scene pages preserve AI Tools group translations in the navigation payload', () => {
  const sceneNavKeys = toolL2PageSource.slice(
    toolL2PageSource.indexOf('const sceneNavKeys = ['),
    toolL2PageSource.indexOf('const sceneFooterKeys = ['),
  )

  assert.match(sceneNavKeys, /'imageTools'/)
  assert.match(sceneNavKeys, /'videoTools'/)
  assert.match(sceneNavKeys, /'aiAsmrVideoGenerator'/)
  assert.match(sceneNavKeys, /'aiBikiniGenerator'/)
  assert.match(sceneNavKeys, /'talkingAvatarCreator'/)
})
