import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const expectedWomen = [
  'Black Suit',
  'Caramel Suit',
  'Pink Suit',
  'Black Swim',
  'Emerald Gown',
  'Velvet Gown',
  'Ivory Couture',
  'Celestial',
  'Ivory Quiet Luxury',
  'Parisian Tweed',
  'Modern Power Suit',
  'Silk Evening Gown',
  'Elevated Smart Casual',
  'Luxe Streetwear',
  'Classic Black Swim (Original)',
  'Black Bikini',
]
const expectedMen = [
  'Midnight Tuxedo',
  'Sage Suit',
  'Camel Coat',
  'Velvet Dinner',
  'White Resort',
  'Leather Aviator',
  'Monochrome Tech',
  'Indigo Tailoring',
  'Executive Suit',
  'Black Tuxedo',
  'Quiet Knit',
  'Modern Casual',
  'Luxe Streetwear',
  'Denim Weekend',
  'Performance Wear',
  'Riviera Linen',
]
const ivoryCoutureDemoUrl = 'https://assets.toolaze.com/landing-pages/ai-clothes-changer/demo/ivory-couture-before-after.webp'
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
const toolL2PageSource = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')

test('English catalog publishes the approved women catalog followed by the men catalog', () => {
  const presets = readContent('en').topTool.functionalAcceptance.presets
  assert.deepEqual(presets.filter((item) => item.group === 'women').map((item) => item.label), expectedWomen)
  assert.deepEqual(presets.filter((item) => item.group === 'men').map((item) => item.label), expectedMen)
})

test('optional prompt examples keep the shared L2 renderer type-safe', () => {
  assert.match(
    toolL2PageSource,
    /layout=\{promptExamples\?\.layout \|\| \(tool === 'ai-dance-generator' \? 'horizontal' : 'grid'\)\}/,
  )
})

test('English women catalog keeps the approved luxury wardrobe mix', () => {
  const women = readContent('en').topTool.functionalAcceptance.presets
    .filter((item) => item.group === 'women')
    .slice(0, 8)

  assert.deepEqual(
    women.map((item) => item.label),
    ['Black Suit', 'Caramel Suit', 'Pink Suit', 'Black Swim', 'Emerald Gown', 'Velvet Gown', 'Ivory Couture', 'Celestial'],
  )
  assert.deepEqual(
    women.map((item) => item.image),
    [
      'black-evening-suit',
      'caramel-quiet-luxury-suit',
      'blush-satin-suit',
      'classic-black-swim',
      'emerald-red-carpet-gown',
      'burgundy-velvet-mermaid-gown',
      'ivory-architectural-couture',
      'midnight-celestial-couture',
    ].map((slug) => `https://assets.toolaze.com/landing-pages/ai-clothes-changer/presets/women/${slug}.webp`),
  )
})

test('English catalog restores the legacy black bikini in place of the resort-print swim preset', () => {
  const women = readContent('en').topTool.functionalAcceptance.presets
    .filter((item) => item.group === 'women')
  const legacyBlackBikiniUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d9c58f4a47544904909fc28a0e9cd584.webp'
  const blackBikini = women.at(-1)

  assert.equal(blackBikini.label, 'Black Bikini')
  assert.equal(blackBikini.image, legacyBlackBikiniUrl)
  assert.equal(blackBikini.referenceImage, legacyBlackBikiniUrl)
  assert.match(blackBikini.prompt, /Image 1 is the person photo\. Image 2 is the target clothing reference\./)
  assert.match(blackBikini.prompt, /black bikini/i)
  assert.doesNotMatch(JSON.stringify(women), /resort-print-swim|botanical/i)
})

test('every locale has 16 women and 16 men presets with the same R2 assets', () => {
  const english = readContent('en').topTool.functionalAcceptance.presets
  const englishAssets = english.map((item) => item.image)

  for (const locale of locales) {
    const topTool = readContent(locale).topTool
    const acceptance = topTool.functionalAcceptance
    const presets = acceptance.presets
    assert.equal(topTool.defaultAspectRatio, '9:16', locale)
    assert.equal(presets.filter((item) => item.group === 'women').length, 16, locale)
    assert.equal(presets.filter((item) => item.group === 'men').length, 16, locale)
    assert.deepEqual(presets.map((item) => item.image), englishAssets, locale)
    assert.equal(acceptance.inlinePresetReferenceUpload, false, locale)
    assert.equal(acceptance.hidePresetReferenceUploader, true, locale)
    assert.equal(acceptance.enableCustomReferenceImageUpload, true, locale)
    assert.equal(acceptance.combineCustomReferenceAndPrompt, false, locale)
    assert.equal(acceptance.clothingReferencePresetGrid, true, locale)
    assert.equal(topTool.sampleImages?.[0]?.url, ivoryCoutureDemoUrl, locale)
    assert.equal(topTool.sampleImages?.[0]?.width, 1600, locale)
    assert.equal(topTool.sampleImages?.[0]?.height, 900, locale)
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
        /^(https:\/\/assets\.toolaze\.com\/landing-pages\/ai-clothes-changer\/presets\/(women|men)\/[a-z0-9-]+\.webp|https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/d9c58f4a47544904909fc28a0e9cd584\.webp)$/,
      )
      assert.equal(preset.referenceImage, preset.image)
      assert.match(preset.prompt, /Image 1 is the person photo\. Image 2 is the target clothing reference\./)
    }
  }
})

test('English men catalog begins with eight premium varied looks and keeps every visible name to two words', () => {
  const men = readContent('en').topTool.functionalAcceptance.presets
    .filter((item) => item.group === 'men')

  assert.deepEqual(men.map((item) => item.label), expectedMen)
  assert.ok(men.every((item) => item.label.trim().split(/\s+/).length <= 2))
  assert.deepEqual(
    men.slice(0, 8).map((item) => item.image),
    [
      'midnight-tuxedo',
      'sage-double-breasted-suit',
      'camel-overcoat',
      'velvet-dinner-jacket',
      'white-resort-linen',
      'leather-aviator',
      'monochrome-techwear',
      'indigo-tailoring',
    ].map((slug) => `https://assets.toolaze.com/landing-pages/ai-clothes-changer/presets/men/${slug}.webp`),
  )
})

test('Clothes inspiration grid reuses every top clothing preset and selects it without replacing the demo', () => {
  const l2Source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')
  const promptExamplesSource = readFileSync(new URL('./blocks/PromptExamples.tsx', import.meta.url), 'utf8')
  const generatorSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')

  assert.match(l2Source, /isClothesChanger[\s\S]*const items = isClothesChanger \? clothingPresetItems : promptExamples\?\.items/)
  assert.match(l2Source, /items={items}/)
  assert.match(l2Source, /isClothesChanger[\s\S]*clothingPresetGrid/)
  const clothesGridBranch = promptExamplesSource.match(/if \(clothingPresetGrid\) \{([\s\S]*?)\n  \}\n\n  return \(/)?.[1] || ''
  assert.match(promptExamplesSource, /createSimilar: 'Create Similar'/)
  assert.doesNotMatch(clothesGridBranch, /Copy Prompt/)
  assert.match(promptExamplesSource, /selectClothingPreset: true/)
  assert.match(promptExamplesSource, /preserveDemo: true/)
  assert.match(generatorSource, /if \(detail\.selectClothingPreset\) \{[\s\S]*?applyPromptPresetReferenceImage[\s\S]*?return true/)
  assert.match(generatorSource, /if \(!detail\.preserveDemo && demoImageUrl\)/)
  assert.match(promptExamplesSource, /window\.scrollTo\(\{ top: 0, behavior: 'smooth' \}\)/)
})

test('Clothes Custom mode puts reference outfit before describe outfit', () => {
  const generatorSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
  const customModeSwitch = generatorSource.match(/\{shouldShowCustomInputModeSwitch && \(([\s\S]*?)\n            \)\}/)?.[1] || ''

  assert.match(customModeSwitch, /aria-pressed=\{customInputMode === 'reference'\}[\s\S]*?customReferenceModeLabel[\s\S]*?aria-pressed=\{customInputMode === 'prompt'\}[\s\S]*?customTextModeLabel/)
})

test('Clothes Custom mode defaults to Reference Outfit', () => {
  const generatorSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
  const l2Source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')

  assert.match(generatorSource, /defaultCustomInputMode\?: 'prompt' \| 'reference'/)
  assert.match(generatorSource, /useState<'prompt' \| 'reference'>\(defaultCustomInputMode\)/)
  assert.match(generatorSource, /if \(tabId === customPromptTabId\) \{[\s\S]*?setCustomInputMode\(defaultCustomInputMode\)/)
  assert.match(l2Source, /defaultCustomInputMode=\{isClothesChanger \? 'reference' : undefined\}/)
})

test('Clothes feature cards use distinct semantic icon types', () => {
  const featuresSource = readFileSync(new URL('./blocks/Features.tsx', import.meta.url), 'utf8')
  const content = readContent('en').features.items

  assert.deepEqual(content.map((item) => item.iconType), ['reference', 'identity', 'safety'])
  assert.match(featuresSource, /reference:/)
  assert.match(featuresSource, /identity:/)
  assert.match(featuresSource, /safety:/)
})

test('localized labels do not reuse the English catalog wholesale', () => {
  const englishLabels = readContent('en').topTool.functionalAcceptance.presets.map((item) => item.label)
  for (const locale of locales.filter((item) => item !== 'en')) {
    const labels = readContent(locale).topTool.functionalAcceptance.presets.map((item) => item.label)
    assert.notDeepEqual(labels, englishLabels, locale)
    assert.equal(new Set(labels).size, 32, `${locale} labels should stay unique`)
  }
})

test('clothes presets use a responsive four-column 9:16 grid without an inline upload tile', () => {
  const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
  assert.match(source, /isClothingReferencePresetGrid[\s\S]*grid-cols-4/)
  assert.match(source, /isClothingReferencePresetGrid \? 'aspect-\[9\/16\]' : 'aspect-\[3\/4\]'/)
  assert.match(source, /isClothingReferencePresetGrid[\s\S]*truncate\s+whitespace-nowrap/)
  assert.doesNotMatch(source, /isClothingReferencePresetGrid \? 'min-h-8 line-clamp-2 whitespace-normal leading-4'/)
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
