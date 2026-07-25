import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('AI Video navigation exposes Image to Video and Text to Video on desktop and mobile', () => {
  const imageToVideoLinks = navigationSource.match(/getLocalizedHref\('\/image-to-video-generator'\)/g) ?? []
  const textToVideoLinks = navigationSource.match(/getLocalizedHref\('\/text-to-video-generator'\)/g) ?? []

  assert.equal(imageToVideoLinks.length, 2)
  assert.equal(textToVideoLinks.length, 2)
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
