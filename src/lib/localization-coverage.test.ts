import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import {
  TEXT_TO_IMAGE_GENERATOR_LOCALES,
  getTextToImageGeneratorPageCopy,
} from '@/app/text-to-image-generator/copy'
import {
  SEEDREAM_5_0_LITE_LOCALES,
  getSeedream50LiteLandingCopy,
} from '@/lib/seedream-5-0-lite-landing-copy'
import {
  SEEDREAM_5_0_PRO_LOCALES,
  getSeedream50ProLandingCopy,
} from '@/lib/seedream-5-0-pro-landing-copy'
import {
  MODEL_PAGE_LOCALES,
  getModelPageCopy,
} from '@/app/model/copy'
import { loadCommonTranslations } from '@/lib/seo-loader'

const projectRoot = process.cwd()
const supportedLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it'] as const
const localizedLocales = supportedLocales.filter((locale) => locale !== 'en')

function readProjectFile(path: string) {
  return readFileSync(join(projectRoot, path), 'utf8')
}

function readJson(path: string) {
  return JSON.parse(readProjectFile(path))
}

function valueAtPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, part) => {
    if (value == null) return undefined
    const key = /^\d+$/.test(part) ? Number(part) : part
    return (value as Record<string | number, unknown>)[key]
  }, source)
}

function assertLocalizedFieldsDoNotReuseEnglish(
  pageName: string,
  englishCopy: unknown,
  localizedCopy: unknown,
  locale: string,
  paths: string[],
) {
  for (const path of paths) {
    const englishValue = valueAtPath(englishCopy, path)
    const localizedValue = valueAtPath(localizedCopy, path)

    assert.equal(typeof localizedValue, 'string', `${pageName}.${locale}.${path}`)
    assert.notEqual(localizedValue, englishValue, `${pageName}.${locale}.${path}`)
  }
}

function collectStringValues(source: unknown, currentPath = ''): Array<{ path: string; value: string }> {
  if (typeof source === 'string') return [{ path: currentPath, value: source }]
  if (Array.isArray(source)) {
    return source.flatMap((item, index) => collectStringValues(item, `${currentPath}.${index}`))
  }
  if (source && typeof source === 'object') {
    return Object.entries(source).flatMap(([key, value]) =>
      collectStringValues(value, currentPath ? `${currentPath}.${key}` : key),
    )
  }
  return []
}

test('Text to Image Generator does not reuse English copy for localized routes', () => {
  const en = getTextToImageGeneratorPageCopy('en')

  for (const locale of TEXT_TO_IMAGE_GENERATOR_LOCALES.filter((item) => item !== 'en')) {
    const copy = getTextToImageGeneratorPageCopy(locale)

    assert.notEqual(copy.metadata.title, en.metadata.title, `${locale} metadata.title`)
    assert.notEqual(copy.hero.description, en.hero.description, `${locale} hero.description`)
    assert.notEqual(copy.whatIs.title, en.whatIs.title, `${locale} whatIs.title`)
    assert.notEqual(copy.promise.title, en.promise.title, `${locale} promise.title`)
    assert.notEqual(copy.features.title, en.features.title, `${locale} features.title`)
    assert.notEqual(copy.gallery.title, en.gallery.title, `${locale} gallery.title`)
    assert.notEqual(copy.howTo.title, en.howTo.title, `${locale} howTo.title`)
    assert.notEqual(copy.faq.title, en.faq.title, `${locale} faq.title`)
    assert.notEqual(copy.cta.title, en.cta.title, `${locale} cta.title`)
  }
})

test('localized model route map includes every localized model advertised by sitemap', () => {
  const localizedModelPage = readProjectFile('src/app/[locale]/model/[model]/page.tsx')

  for (const model of ['seedream-5-0-lite', 'seedream-5-0-pro']) {
    assert.match(localizedModelPage, new RegExp(`['"]${model}['"]\\s*:`), `${model} missing from localized route map`)
  }
})

test('AI tools hub has localized page copy instead of redirecting localized routes to English', () => {
  const localizedAiToolsPage = readProjectFile('src/app/[locale]/ai-tools/page.tsx')
  const rootAiToolsPage = readProjectFile('src/app/ai-tools/page.tsx')

  assert.match(localizedAiToolsPage, /if \(locale === ['"]en['"]\) \{\s*redirect\(['"]\/ai-tools['"]\)/)
  assert.match(localizedAiToolsPage, /getAiToolsPageCopy/)
  assert.match(rootAiToolsPage, /getAiToolsPageCopy\(['"]en['"]\)/)
})

test('Model hub has localized page copy instead of redirecting localized routes to English', () => {
  const localizedModelPage = readProjectFile('src/app/[locale]/model/page.tsx')
  const rootModelPage = readProjectFile('src/app/model/page.tsx')

  assert.match(localizedModelPage, /if \(locale === ['"]en['"]\) \{\s*redirect\(['"]\/model['"]\)/)
  assert.match(localizedModelPage, /getModelPageCopy/)
  assert.match(rootModelPage, /getModelPageCopy\(['"]en['"]\)/)
})

test('Model hub does not reuse English copy for localized routes', () => {
  const en = getModelPageCopy('en')

  for (const locale of MODEL_PAGE_LOCALES.filter((item) => item !== 'en')) {
    const copy = getModelPageCopy(locale)

    assert.notEqual(copy.metadata.title, en.metadata.title, `${locale} metadata.title`)
    assert.notEqual(copy.hero.title, en.hero.title, `${locale} hero.title`)
    assert.notEqual(copy.hero.description, en.hero.description, `${locale} hero.description`)
    assert.notEqual(copy.about.title, en.about.title, `${locale} about.title`)
    assert.notEqual(copy.about.paragraphs[0], en.about.paragraphs[0], `${locale} about.paragraphs.0`)
    assert.notEqual(copy.cards[0].description, en.cards[0].description, `${locale} cards.0.description`)
    assert.notEqual(copy.cards[0].cta, en.cards[0].cta, `${locale} cards.0.cta`)
  }
})

test('Prompt example controls are locale-aware instead of hardcoded English', () => {
  const promptExamples = readProjectFile('src/components/blocks/PromptExamples.tsx')

  assert.doesNotMatch(promptExamples, /label:\s*['"]Women['"]/)
  assert.doesNotMatch(promptExamples, /label:\s*['"]Men['"]/)
  assert.doesNotMatch(promptExamples, />\s*Use Prompt\s*</)
  assert.doesNotMatch(promptExamples, /['"]Copy Prompt['"]/)
  assert.doesNotMatch(promptExamples, /['"]Copied['"]/)
})

test('Nano Banana credit exhausted text exists for every supported non-English locale', () => {
  const requiredKeys = ['creditsUsedUpTitle', 'creditsUsedUpMessage', 'creditsUsedUpAction']

  for (const locale of localizedLocales) {
    const data = readJson(`src/data/${locale}/common.json`)
    for (const key of requiredKeys) {
      assert.equal(typeof data.common?.nanoBananaTool?.[key], 'string', `${locale}.${key}`)
      assert.notEqual(data.common.nanoBananaTool[key], readJson('src/data/en/common.json').common.nanoBananaTool[key], `${locale}.${key}`)
    }
  }
})

test('top navigation common copy includes every visible model and AI tool menu key', () => {
  const requiredNavKeys = [
    'aiBabyGenerator',
    'aiHairstyleChanger',
    'aiHairColorChanger',
    'worldCupAiImageGenerator',
    'aiImageGenerator',
    'textToImageGenerator',
    'aiImageToImageGenerator',
    'pricing',
    'wan27Image',
    'seedream50Lite',
    'seedream50Pro',
    'seedance25',
  ]
  const keysThatMustTranslate = [
    'aiBabyGenerator',
    'aiHairstyleChanger',
    'aiHairColorChanger',
    'worldCupAiImageGenerator',
    'aiImageGenerator',
    'textToImageGenerator',
    'aiImageToImageGenerator',
    'pricing',
  ]
  const englishNav = readJson('src/data/en/common.json').nav

  for (const locale of supportedLocales) {
    const nav = readJson(`src/data/${locale}/common.json`).nav

    for (const key of requiredNavKeys) {
      assert.equal(typeof nav?.[key], 'string', `${locale}.nav.${key}`)
      assert.notEqual(nav[key].trim(), '', `${locale}.nav.${key}`)
    }

    if (locale !== 'en') {
      for (const key of keysThatMustTranslate) {
        assert.notEqual(nav[key], englishNav[key], `${locale}.nav.${key}`)
      }
    }
  }
})

test('server common translation loader returns localized navigation copy', async () => {
  const zhTW = await loadCommonTranslations('zh-TW')
  const de = await loadCommonTranslations('de')

  assert.equal(zhTW?.nav?.aiBabyGenerator, 'AI 寶寶生成器')
  assert.equal(zhTW?.nav?.textToImageGenerator, '文字轉圖像生成器')
  assert.equal(zhTW?.nav?.pricing, '價格')
  assert.equal(de?.nav?.aiBabyGenerator, 'KI-Babygenerator')
  assert.equal(de?.nav?.pricing, 'Preise')
})

test('History page common copy exists for every supported locale', () => {
  const requiredHistoryPageKeys = [
    'metadataTitle',
    'metadataDescription',
    'title',
    'description',
    'loading',
    'signInRequired',
    'loadError',
    'emptyTitle',
    'emptyDescription',
    'previewLabel',
    'previewImageLabel',
    'previewReferenceMedia',
    'closePreview',
    'referenceMedia',
    'prompt',
    'copyPrompt',
    'createSimilar',
    'download',
    'delete',
    'deleting',
    'deleteHistoryConfirm',
    'deleteError',
    'modeVideo',
    'modeTextToImage',
    'modeImageToImage',
  ]
  const englishHistoryPage = readJson('src/data/en/common.json').historyPage
  const localizedKeysThatMustTranslate = [
    'metadataTitle',
    'metadataDescription',
    'title',
    'description',
    'loading',
    'signInRequired',
    'loadError',
    'emptyTitle',
    'emptyDescription',
    'previewLabel',
    'previewImageLabel',
    'previewReferenceMedia',
    'closePreview',
    'referenceMedia',
    'copyPrompt',
    'createSimilar',
    'download',
    'delete',
    'deleting',
    'deleteHistoryConfirm',
    'deleteError',
    'modeTextToImage',
    'modeImageToImage',
  ]

  for (const locale of supportedLocales) {
    const historyPage = readJson(`src/data/${locale}/common.json`).historyPage

    for (const key of requiredHistoryPageKeys) {
      assert.equal(typeof historyPage?.[key], 'string', `${locale}.historyPage.${key}`)
      assert.notEqual(historyPage[key].trim(), '', `${locale}.historyPage.${key}`)
    }

    if (locale !== 'en') {
      for (const key of localizedKeysThatMustTranslate) {
        assert.notEqual(historyPage[key], englishHistoryPage[key], `${locale}.historyPage.${key}`)
      }
    }
  }
})

test('localized home hero includes image-to-image CTA copy', () => {
  const englishCta = readJson('src/data/en/common.json').home?.ctaImageEdit

  assert.equal(typeof englishCta, 'string', 'en.home.ctaImageEdit')
  assert.notEqual(englishCta.trim(), '', 'en.home.ctaImageEdit')

  for (const locale of localizedLocales) {
    const cta = readJson(`src/data/${locale}/common.json`).home?.ctaImageEdit

    assert.equal(typeof cta, 'string', `${locale}.home.ctaImageEdit`)
    assert.notEqual(cta.trim(), '', `${locale}.home.ctaImageEdit`)
    assert.notEqual(cta, englishCta, `${locale}.home.ctaImageEdit`)
  }
})

test('localized homepage passes common translations into shared navigation and footer', () => {
  const homePageMain = readProjectFile('src/components/home/HomePageMain.tsx')

  assert.match(homePageMain, /<Navigation\s+initialTranslations=\{common\}\s*\/>/)
  assert.match(homePageMain, /<Footer\s+initialTranslations=\{common\}\s*\/>/)
})

test('global AI Tools links remain locale-aware in navigation and breadcrumbs', () => {
  const navigation = readProjectFile('src/components/Navigation.tsx')
  const breadcrumb = readProjectFile('src/components/Breadcrumb.tsx')
  const localeLessPaths = breadcrumb.match(/const LOCALE_LESS_PATHS = \[([^\]]*)\]/)

  assert.doesNotMatch(navigation, /window\.location\.href\s*=\s*['"]\/ai-tools['"]/)
  assert.ok(localeLessPaths, 'Breadcrumb LOCALE_LESS_PATHS should stay explicit')
  assert.doesNotMatch(localeLessPaths[1], /['"]\/ai-tools['"]/)
})

test('common breadcrumb copy includes every global AI tool label', () => {
  const requiredBreadcrumbKeys = [
    'aiTools',
    'aiBabyGenerator',
    'aiImageGenerator',
    'textToImageGenerator',
    'aiImageToImageGenerator',
    'worldCupAiImageGenerator',
    'watermarkRemover',
    'photoRestoration',
    'aiCouplePhotoMaker',
  ]
  const englishBreadcrumb = readJson('src/data/en/common.json').breadcrumb
  const keysThatMustTranslate = requiredBreadcrumbKeys.filter((key) => key !== 'aiTools')

  for (const locale of supportedLocales) {
    const breadcrumb = readJson(`src/data/${locale}/common.json`).breadcrumb

    for (const key of requiredBreadcrumbKeys) {
      assert.equal(typeof breadcrumb?.[key], 'string', `${locale}.breadcrumb.${key}`)
      assert.notEqual(breadcrumb[key].trim(), '', `${locale}.breadcrumb.${key}`)
    }

    if (locale !== 'en') {
      for (const key of keysThatMustTranslate) {
        assert.notEqual(breadcrumb[key], englishBreadcrumb[key], `${locale}.breadcrumb.${key}`)
      }
    }
  }
})

test('breadcrumb component maps every global AI tool label through translations', () => {
  const breadcrumb = readProjectFile('src/components/Breadcrumb.tsx')
  const expectedMappings = [
    ['AI Tools', 'aiTools'],
    ['AI Baby Generator', 'aiBabyGenerator'],
    ['AI Image Generator', 'aiImageGenerator'],
    ['Text to Image Generator', 'textToImageGenerator'],
    ['AI Image to Image Generator', 'aiImageToImageGenerator'],
    ['World Cup AI Image Generator', 'worldCupAiImageGenerator'],
    ['Watermark Remover', 'watermarkRemover'],
    ['Photo Restoration', 'photoRestoration'],
    ['AI Couple Photo Maker', 'aiCouplePhotoMaker'],
  ]

  for (const [label, key] of expectedMappings) {
    assert.match(breadcrumb, new RegExp(`${key}: ['"]`), `default breadcrumb missing ${key}`)
    assert.match(breadcrumb, new RegExp(`label === ['"]${label}['"]`), `label mapping missing ${label}`)
  }
})

test('workspace sidebar labels are localized instead of hardcoded English', () => {
  const workspaceShell = readProjectFile('src/components/GlobalWorkspaceShell.tsx')

  assert.match(workspaceShell, /WORKSPACE_MENU_TRANSLATIONS/)
  assert.doesNotMatch(workspaceShell, /label:\s*['"]Home['"]/)
  assert.doesNotMatch(workspaceShell, /label:\s*['"]Create Image['"]/)
  assert.doesNotMatch(workspaceShell, /label:\s*['"]Edit Image['"]/)
  assert.doesNotMatch(workspaceShell, /label:\s*['"]Image Tools['"]/)
  assert.doesNotMatch(workspaceShell, /label:\s*['"]Models['"]/)
  assert.doesNotMatch(workspaceShell, /label:\s*['"]Library['"]/)
  assert.match(workspaceShell, /['"]zh-TW['"][\s\S]*首頁/)
  assert.match(workspaceShell, /['"]zh-TW['"][\s\S]*建立圖像/)
  assert.match(workspaceShell, /['"]zh-TW['"][\s\S]*編輯圖像/)
  assert.match(workspaceShell, /['"]zh-TW['"][\s\S]*圖像工具/)
  assert.match(workspaceShell, /['"]zh-TW['"][\s\S]*模型/)
  assert.match(workspaceShell, /['"]zh-TW['"][\s\S]*作品庫/)
})

test('Traditional Chinese JSON values do not contain pinyin tone marks', () => {
  const toneMarks = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i
  const files = [
    'ai-baby-generator.json',
    'ai-couple-photo-maker.json',
    'ai-hair-color-changer.json',
    'ai-hairstyle-changer.json',
    'common.json',
    'seedance-2-5.json',
  ]

  for (const file of files) {
    const values = collectStringValues(readJson(`src/data/zh-TW/${file}`))
    const hit = values.find(({ value }) => toneMarks.test(value))

    assert.equal(hit, undefined, `src/data/zh-TW/${file}.${hit?.path}: ${hit?.value}`)
  }
})

test('German Font Generator keeps the same visible section keys as English', () => {
  const en = readJson('src/data/en/font-generator.json')
  const de = readJson('src/data/de/font-generator.json')

  for (const key of ['title', 'vs', 'smartChoice', 'otherTools', 'toolazeFeatures', 'othersFeatures']) {
    assert.equal(typeof de.comparison?.[key], 'string', `comparison.${key}`)
    if (key !== 'vs') {
      assert.notEqual(de.comparison[key], en.comparison[key], `comparison.${key}`)
    }
  }

  assert.equal(typeof de.scenesTitle, 'string', 'scenesTitle')
  assert.equal(typeof de.faqTitle, 'string', 'faqTitle')
  assert.notEqual(de.scenesTitle, en.scenesTitle, 'scenesTitle')
  assert.notEqual(de.faqTitle, en.faqTitle, 'faqTitle')
})

test('Seedream 5.0 Lite localized pages translate remaining visible support copy', () => {
  const en = getSeedream50LiteLandingCopy('en')
  const paths = [
    'metadata.openGraphDescription',
    'metadata.twitterDescription',
    'related.text',
    'youtube.examples.0.text',
    'youtube.examples.1.text',
    'x.items.0.body',
    'x.items.1.body',
    'faq.title',
  ]

  for (const locale of SEEDREAM_5_0_LITE_LOCALES.filter((item) => item !== 'en')) {
    assertLocalizedFieldsDoNotReuseEnglish(
      'seedream-5-0-lite',
      en,
      getSeedream50LiteLandingCopy(locale),
      locale,
      paths,
    )
  }
})

test('Seedream 5.0 Pro localized pages translate visible support copy', () => {
  const en = getSeedream50ProLandingCopy('en')
  const paths = [
    'schema.pageName',
    'schema.appName',
    'whatIs.paragraphs.0',
    'whatIs.paragraphs.1',
    'comparison.title',
    'gallery.title',
    'gallery.text',
    'useCases.text',
    'faq.title',
    'cta.title',
    'cta.text',
    'cta.button',
  ]

  for (const locale of SEEDREAM_5_0_PRO_LOCALES.filter((item) => item !== 'en')) {
    assertLocalizedFieldsDoNotReuseEnglish(
      'seedream-5-0-pro',
      en,
      getSeedream50ProLandingCopy(locale),
      locale,
      paths,
    )
  }

  const pt = getSeedream50ProLandingCopy('pt')

  assert.match(pt.faq.items[0].q, /Posso usar/)
  assert.doesNotMatch(JSON.stringify(pt.faq), /Posso usare|Quali immagini|Come scrivo|Serve per/)
  assert.doesNotMatch(JSON.stringify(pt.cta), /Inizia|pianificare|immagini/)
})

test('AI tool landing JSON localizes visible sample and related tool titles', () => {
  const locales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const coupleEn = readJson('src/data/en/ai-couple-photo-maker.json')
  const hairColorEn = readJson('src/data/en/ai-hair-color-changer.json')
  const hairstyleEn = readJson('src/data/en/ai-hairstyle-changer.json')
  const coupleTitleFields = [
    'metadata.title',
    'metadata.description',
    'hero.h1',
    'intro.title',
    'comparison.title',
    'faq.0.q',
  ]

  for (const locale of locales) {
    const couple = readJson(`src/data/${locale}/ai-couple-photo-maker.json`)

    assertLocalizedFieldsDoNotReuseEnglish(
      'ai-couple-photo-maker',
      coupleEn,
      couple,
      locale,
      ['rating.title'],
    )

    for (const path of coupleTitleFields) {
      const value = valueAtPath(couple, path)

      assert.equal(typeof value, 'string', `${locale}.${path}`)
      assert.doesNotMatch(value as string, /AI Couple Photo Maker/i, `${locale}.${path}`)
    }

    assertLocalizedFieldsDoNotReuseEnglish(
      'ai-hair-color-changer',
      hairColorEn,
      readJson(`src/data/${locale}/ai-hair-color-changer.json`),
      locale,
      [
        'topTool.sampleImages.0.title',
        'topTool.sampleImages.1.title',
        'topTool.sampleImages.2.title',
      ],
    )

    assertLocalizedFieldsDoNotReuseEnglish(
      'ai-hairstyle-changer',
      hairstyleEn,
      readJson(`src/data/${locale}/ai-hairstyle-changer.json`),
      locale,
      [
        'moreToolsLinks.0.title',
        'moreToolsLinks.1.title',
        'moreToolsLinks.2.title',
      ],
    )
  }
})

test('core model landing JSON localizes visible comparison and FAQ titles', () => {
  const locales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
  const seedanceEn = readJson('src/data/en/seedance-2-5.json')

  for (const locale of locales) {
    assertLocalizedFieldsDoNotReuseEnglish(
      'seedance-2-5',
      seedanceEn,
      readJson(`src/data/${locale}/seedance-2-5.json`),
      locale,
      ['modelComparison.title', 'rating.rating'],
    )
  }

  assertLocalizedFieldsDoNotReuseEnglish(
    'seedance-2-5',
    seedanceEn,
    readJson('src/data/de/seedance-2-5.json'),
    'de',
    ['features.items.5.title', 'scenes.2.title', 'faqTitle'],
  )

  for (const locale of ['ja', 'ko']) {
    assertLocalizedFieldsDoNotReuseEnglish(
      'seedance-2-5',
      seedanceEn,
      readJson(`src/data/${locale}/seedance-2-5.json`),
      locale,
      ['faqTitle'],
    )
  }

  assertLocalizedFieldsDoNotReuseEnglish(
    'kling-3',
    readJson('src/data/en/kling-3.json'),
    readJson('src/data/de/kling-3.json'),
    'de',
    ['features.items.2.title'],
  )
})
