import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('AI Video navigation exposes video tools and Wan 2.5 model entry points', () => {
  const imageToVideoLinks = navigationSource.match(/getLocalizedHref\('\/image-to-video-generator'\)/g) ?? []
  const textToVideoLinks = navigationSource.match(/getLocalizedHref\('\/text-to-video-generator'\)/g) ?? []
  const wan25VideoLinks = navigationSource.match(/getLocalizedHref\('\/model\/wan-2-5-ai-video-generator'\)/g) ?? []

  assert.equal(imageToVideoLinks.length, 2)
  assert.equal(textToVideoLinks.length, 2)
  assert.equal(wan25VideoLinks.length, 3)
})

test('AI Video navigation lists Image to Video before Text to Video', () => {
  const desktopAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* 一级菜单：AI Video */}')),
  )
  const mobileAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Video 部分 */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* AI Video 部分 */}')),
  )

  for (const block of [desktopAiVideoBlock, mobileAiVideoBlock]) {
    const imageToVideoIndex = block.indexOf("href={getLocalizedHref('/image-to-video-generator')}")
    const textToVideoIndex = block.indexOf("href={getLocalizedHref('/text-to-video-generator')}")

    assert.notEqual(imageToVideoIndex, -1)
    assert.notEqual(textToVideoIndex, -1)
    assert.ok(imageToVideoIndex < textToVideoIndex)
  }
})

test('AI Video navigation keeps functional tools before model-specific links', () => {
  const desktopAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* 一级菜单：AI Video */}')),
  )
  const mobileAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Video 部分 */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* AI Video 部分 */}')),
  )

  for (const block of [desktopAiVideoBlock, mobileAiVideoBlock]) {
    const aiVideoIndex = block.indexOf("href={getLocalizedHref('/ai-video-generator')}")
    const imageToVideoIndex = block.indexOf("href={getLocalizedHref('/image-to-video-generator')}")
    const textToVideoIndex = block.indexOf("href={getLocalizedHref('/text-to-video-generator')}")
    const danceIndex = block.indexOf("href={getLocalizedHref('/ai-dance-generator')}")
    const wan25Index = block.indexOf("href={getLocalizedHref('/model/wan-2-5-ai-video-generator')}")
    const seedanceIndex = block.indexOf("href={getLocalizedHref('/model/seedance-2-5')}")

    assert.ok(aiVideoIndex < imageToVideoIndex)
    assert.ok(imageToVideoIndex < textToVideoIndex)
    assert.ok(textToVideoIndex < danceIndex)
    assert.ok(danceIndex < wan25Index)
    assert.ok(wan25Index < seedanceIndex)
  }
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
