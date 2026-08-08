import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const expectedWomen = [
  'Ivory Quiet Luxury',
  'Parisian Tweed',
  'Modern Power Suit',
  'Silk Evening Gown',
  'Elevated Smart Casual',
  'Luxe Streetwear',
  'Classic Black Swim',
  'Resort Print Swim',
]
const expectedMen = [
  'Executive Business Suit',
  'Black-Tie Tuxedo',
  'Quiet Luxury Knit',
  'Modern Smart Casual',
  'Luxe Streetwear',
  'Denim Weekend',
  'Performance Athleisure',
  'Riviera Linen',
]

const readContent = (locale) => JSON.parse(
  readFileSync(new URL(`../data/${locale}/ai-clothes-changer.json`, import.meta.url), 'utf8'),
)

test('English catalog publishes the approved two rows per gender', () => {
  const presets = readContent('en').topTool.functionalAcceptance.presets
  assert.deepEqual(presets.filter((item) => item.group === 'women').map((item) => item.label), expectedWomen)
  assert.deepEqual(presets.filter((item) => item.group === 'men').map((item) => item.label), expectedMen)
})

test('every locale has 8 women and 8 men presets with the same R2 assets', () => {
  const english = readContent('en').topTool.functionalAcceptance.presets
  const englishAssets = english.map((item) => item.image)

  for (const locale of locales) {
    const acceptance = readContent(locale).topTool.functionalAcceptance
    const presets = acceptance.presets
    assert.equal(presets.filter((item) => item.group === 'women').length, 8, locale)
    assert.equal(presets.filter((item) => item.group === 'men').length, 8, locale)
    assert.deepEqual(presets.map((item) => item.image), englishAssets, locale)
    assert.equal(acceptance.inlinePresetReferenceUpload, false, locale)
    for (const preset of presets) {
      assert.match(
        preset.image,
        /^https:\/\/assets\.toolaze\.com\/landing-pages\/ai-clothes-changer\/presets\/(women|men)\/[a-z0-9-]+\.webp$/,
      )
      assert.equal(preset.referenceImage, preset.image)
      assert.match(preset.prompt, /Image 1 is the person photo\. Image 2 is the target clothing reference\./)
    }
  }
})

test('localized labels do not reuse the English catalog wholesale', () => {
  const englishLabels = readContent('en').topTool.functionalAcceptance.presets.map((item) => item.label)
  for (const locale of locales.filter((item) => item !== 'en')) {
    const labels = readContent(locale).topTool.functionalAcceptance.presets.map((item) => item.label)
    assert.notDeepEqual(labels, englishLabels, locale)
    assert.equal(new Set(labels).size, 16, `${locale} labels should stay unique`)
  }
})

test('clothes presets use a responsive four-column 9:16 grid without an inline upload tile', () => {
  const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
  assert.match(source, /isClothingReferencePresetGrid[\s\S]*grid-cols-2[\s\S]*md:grid-cols-4/)
  assert.match(source, /isClothingReferencePresetGrid \? 'aspect-\[9\/16\]' : 'aspect-\[3\/4\]'/)
  assert.match(source, /isClothingReferencePresetGrid[\s\S]*line-clamp-2/)
  assert.match(source, /shouldRenderStandaloneReferenceUploader/)
})

test('English visible copy explains the combined Custom clothing-reference workflow', () => {
  const content = readContent('en')
  const visibleCopy = [
    content.hero.desc,
    ...content.intro.content.flatMap((item) => [item.title, item.text]),
    ...content.howToUse.steps.flatMap((item) => [item.title, item.desc]),
    ...content.features.items.flatMap((item) => [item.title, item.desc]),
    content.topTool.textOverrides.promptPlaceholder,
  ].join(' ')

  assert.match(visibleCopy, /Custom[\s\S]*clothing reference[\s\S]*(directions|prompt)/i)
  assert.doesNotMatch(visibleCopy, /Custom mode with one photo|only have a person photo|upload only the person photo/i)
  assert.doesNotMatch(visibleCopy, /The page is written/i)
})
