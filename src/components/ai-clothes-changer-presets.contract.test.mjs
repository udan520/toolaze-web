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
const expectedPresetChoiceTitles = {
  en: 'Choose a Clothing Style',
  de: 'Kleidungsstil wählen',
  ja: '服装スタイルを選択',
  es: 'Elige un estilo de ropa',
  'zh-TW': '選擇服裝風格',
  pt: 'Escolha um estilo de roupa',
  fr: 'Choisissez un style de tenue',
  ko: '의상 스타일 선택',
  it: 'Scegli uno stile di abbigliamento',
}
const expectedCustomModeLabels = {
  en: ['Describe outfit', 'Reference outfit'],
  de: ['Outfit beschreiben', 'Outfit-Referenz'],
  ja: ['服装を説明', '服装リファレンス'],
  es: ['Describe el atuendo', 'Referencia de atuendo'],
  'zh-TW': ['描述服裝', '服裝參考'],
  pt: ['Descrever look', 'Referência de look'],
  fr: ['Décrire la tenue', 'Référence de tenue'],
  ko: ['의상 설명', '의상 참고 이미지'],
  it: ['Descrivi l’outfit', 'Riferimento outfit'],
}

const readContent = (locale) => JSON.parse(
  readFileSync(new URL(`../data/${locale}/ai-clothes-changer.json`, import.meta.url), 'utf8'),
)
const rootRouteSource = readFileSync(new URL('../app/ai-clothes-changer/page.tsx', import.meta.url), 'utf8')
const localeRouteSource = readFileSync(new URL('../app/[locale]/ai-clothes-changer/page.tsx', import.meta.url), 'utf8')
const l2SeoMetadataSource = readFileSync(new URL('../lib/l2-seo-metadata.ts', import.meta.url), 'utf8')

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
    assert.equal(acceptance.hidePresetReferenceUploader, true, locale)
    assert.equal(acceptance.enableCustomReferenceImageUpload, true, locale)
    assert.equal(acceptance.combineCustomReferenceAndPrompt, false, locale)
    assert.equal(acceptance.clothingReferencePresetGrid, true, locale)
    assert.equal(readContent(locale).topTool.textOverrides.presetChoiceTitle, expectedPresetChoiceTitles[locale], locale)
    assert.deepEqual(
      [
        readContent(locale).topTool.textOverrides.customTextModeLabel,
        readContent(locale).topTool.textOverrides.customReferenceModeLabel,
      ],
      expectedCustomModeLabels[locale],
      locale,
    )
    assert.doesNotMatch(
      [
        readContent(locale).topTool.textOverrides.customTextModeLabel,
        readContent(locale).topTool.textOverrides.customReferenceModeLabel,
      ].join(' '),
      /hair|hairstyle|发型|髮型|ヘア|머리/i,
      locale + ' clothes custom tabs should not reuse hairstyle copy',
    )
    assert.doesNotMatch(
      readContent(locale).topTool.textOverrides.promptPlaceholder,
      /upload|上传|上傳|hochladen|sube|envie|carica|téléverse|アップロード|업로드/i,
      locale + ' custom prompt placeholder should describe clothing text, not request an upload',
    )
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
  assert.match(source, /isClothingReferencePresetGrid[\s\S]*grid-cols-4/)
  assert.match(source, /isClothingReferencePresetGrid \? 'aspect-\[9\/16\]' : 'aspect-\[3\/4\]'/)
  assert.match(source, /isClothingReferencePresetGrid[\s\S]*line-clamp-2/)
  assert.match(source, /shouldRenderStandaloneReferenceUploader/)
})

test('preset-only clothes tabs can generate with one person photo plus selected built-in reference', () => {
  const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
  assert.match(source, /hasSelectedPresetReferenceImage/)
  assert.match(source, /hasCurrentSecondaryReferenceImages = hasSelectedPresetReferenceImage/)
  assert.match(source, /const shouldUseSelectedPresetReference = isClothingReferencePresetGrid[\s\S]*Boolean\(selectedPromptPresetReferenceImage\)/)
  assert.match(source, /requestSelectedPresetReferenceImage = shouldUseSelectedPresetReference/)
  assert.match(source, /requestSelectedPresetReferenceImage[\s\S]*requestClothingReferenceRemoteUrls/)
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

test('workflow tab initialization does not reset user-selected Custom back to the default tab', () => {
  const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
  assert.match(source, /hasInitializedPromptPresetTabRef = useRef\(false\)/)
  assert.match(source, /if \(hasInitializedPromptPresetTabRef\.current\) return/)
  assert.match(source, /hasInitializedPromptPresetTabRef\.current = true/)
})

test('AI Clothes Changer metadata keeps OpenGraph URL aligned with canonical URL', () => {
  for (const source of [rootRouteSource, localeRouteSource]) {
    assert.match(source, /buildL2SeoMetadata\(\{[\s\S]*hreflang/)
    assert.doesNotMatch(source, /openGraph:\s*\{[\s\S]*url:\s*['"]https:\/\/toolaze\.com['"]/)
  }

  assert.match(l2SeoMetadataSource, /alternates:\s*\{[\s\S]*canonical:\s*hreflang\.canonical/)
  assert.match(l2SeoMetadataSource, /openGraph:\s*\{[\s\S]*url:\s*hreflang\.canonical/)
  assert.doesNotMatch(
    l2SeoMetadataSource,
    /openGraph:\s*\{[\s\S]*url:\s*['"]https:\/\/toolaze\.com['"]/,
  )
})
