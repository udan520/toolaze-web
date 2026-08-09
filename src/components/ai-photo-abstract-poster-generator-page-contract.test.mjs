import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const slug = 'ai-photo-abstract-poster-generator'
const taskId = '2026-08-05-ai-photo-abstract-poster-generator'
const referenceImage = '/model-assets/ai-photo-abstract-poster-generator/photo-abstract-poster-reference.webp'
const demoImage = '/model-assets/ai-photo-abstract-poster-generator/photo-abstract-poster-demo.webp'

const pages = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8')),
  ]),
)
const factories = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`, 'utf8')),
  ]),
)
const page = pages.en
const factory = factories.en
const l2Source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')
const localToolSource = existsSync('src/components/PhotoAbstractPosterGeneratorTool.tsx')
  ? readFileSync('src/components/PhotoAbstractPosterGeneratorTool.tsx', 'utf8')
  : ''
const rootRouteSource = readFileSync(`src/app/${slug}/page.tsx`, 'utf8')
const localeRouteSource = readFileSync(`src/app/[locale]/${slug}/page.tsx`, 'utf8')
const sitemapSource = readFileSync('src/app/sitemap.ts', 'utf8')
const fallbackSource = readFileSync('src/lib/localized-route-fallbacks.ts', 'utf8')
const languageSwitchSource = readFileSync('src/lib/site-language-switch.ts', 'utf8')
const historyMetadataSource = readFileSync('src/lib/generation-history-tool-metadata.ts', 'utf8')
const seoLoaderSource = readFileSync('src/lib/seo-loader.ts', 'utf8')
const navigationSource = readFileSync('src/components/Navigation.tsx', 'utf8')
const footerSource = readFileSync('src/components/Footer.tsx', 'utf8')
const homeSource = readFileSync('src/components/home/HomePageMain.tsx', 'utf8')
const homeGridSource = readFileSync('src/lib/homepage-grid-tools.ts', 'utf8')
const homeImagesSource = readFileSync('src/lib/home-advanced-ai-card-images.ts', 'utf8')
const aiToolsCopySource = readFileSync('src/app/ai-tools/copy.ts', 'utf8')
const adminSeoSource = readFileSync('scripts/admin-seo-server.js', 'utf8')
const task = JSON.parse(readFileSync(`_codex/seo-pipeline/tasks/${taskId}/task.json`, 'utf8'))

function visiblePageCopy(pageData) {
  return JSON.stringify({
    metadata: pageData.metadata,
    hero: pageData.hero,
    topToolText: pageData.topTool?.textOverrides,
    heroDemoVideo: {
      ariaLabel: pageData.heroDemoVideo?.ariaLabel,
    },
    intro: pageData.intro,
    howToUse: pageData.howToUse,
    features: pageData.features,
    photoTips: pageData.photoTips,
    scenesTitle: pageData.scenesTitle,
    scenes: pageData.scenes,
    faqTitle: pageData.faqTitle,
    faq: pageData.faq,
    moreTools: pageData.moreTools,
    moreToolsLinks: pageData.moreToolsLinks,
  })
}

test('AI Photo Abstract Poster Generator uses local code composition instead of an AI image model', () => {
  for (const locale of locales) {
    const current = pages[locale]
    assert.equal(current.topComponent, 'photo-abstract-poster')
    assert.equal(current.topTool.mode, 'local-code-composition')
    assert.equal(current.topTool.maxUploadImages, 1)
    assert.equal(current.topTool.defaultAspectRatio, 'auto')
    assert.equal('modelId' in current.topTool, false)
    assert.equal('defaultPrompt' in current.topTool, false)
    assert.doesNotMatch(JSON.stringify(current.topTool), /gpt-image-2|GPT Image|image-to-image|OpenAI|KIE_AI/i)
  }
  assert.match(l2Source, /topComp === 'photo-abstract-poster'/)
  assert.match(l2Source, /<PhotoAbstractPosterGeneratorTool/)
  assert.match(localToolSource, /canvas/i)
  assert.match(localToolSource, /toDataURL\('image\/png'\)/)
  assert.doesNotMatch(localToolSource, /fetch\(['"]\/api\/image-to-image/)
  assert.doesNotMatch(localToolSource, /KIE_AI|OpenAI|gpt-image-2/i)
})

test('AI Photo Abstract Poster Generator mirrors the Zine-style top tool layout', () => {
  assert.match(localToolSource, /data-photo-abstract-tool-shell/)
  assert.match(localToolSource, /data-left-generation-panel/)
  assert.match(localToolSource, /data-desktop-result-card/)
  assert.match(localToolSource, /data-photo-abstract-result-tabs/)
  assert.match(localToolSource, /data-photo-abstract-result-tab="demo"/)
  assert.match(localToolSource, /data-photo-abstract-result-tab="history"/)
  assert.match(localToolSource, /setRightMode\('history'\)/)
  assert.match(localToolSource, /md:h-\[calc\(100dvh-6rem\)\]/)
})

test('AI Photo Abstract Poster Generator keeps the top UI aligned with the image generator shell', () => {
  const desktopHeroBlock = localToolSource.slice(
    localToolSource.indexOf('data-photo-abstract-desktop-hero'),
    localToolSource.indexOf('data-desktop-result-card'),
  )
  const demoPanelBlock = localToolSource.slice(
    localToolSource.indexOf('const renderDemoPanel'),
    localToolSource.indexOf('const renderHistoryPanel'),
  )
  const uploaderBlock = localToolSource.slice(
    localToolSource.indexOf('<ReferenceImageUploader'),
    localToolSource.indexOf('testIdPrefix="photo-abstract-poster-reference"'),
  )
  const ratioStart = localToolSource.indexOf('data-output-ratio-options')
  const ratioBlock = localToolSource.slice(ratioStart, ratioStart + 1200)

  assert.match(desktopHeroBlock, /data-desktop-result-breadcrumbs className="mb-1 flex justify-start/)
  assert.match(l2Source, /'photo-abstract-poster',/)
  assert.doesNotMatch(desktopHeroBlock, /Local canvas poster|textOverrides\?\.eyebrow/)
  assert.doesNotMatch(localToolSource, /<p className="mb-3 inline-flex/)
  assert.doesNotMatch(demoPanelBlock, /Skill logic|skillLogicLabel|previewTitle|previewDescription/)
  assert.match(uploaderBlock, /size="compact"/)
  assert.match(ratioBlock, /VISIBLE_ASPECT_OPTIONS\.map/)
  assert.match(ratioBlock, /className="inline-flex w-fit/)
  assert.doesNotMatch(ratioBlock, /grid-cols-1|min-h-10|w-full|getAspectHelper|aspectHelpers/)
  assert.doesNotMatch(ratioBlock, /\{ASPECT_OPTIONS\.map/)
  assert.doesNotMatch(ratioBlock, /9:16|4:5|1:1|16:9/)
  assert.doesNotMatch(localToolSource, /handleUseSample|useSampleLabel|Use sample photo/)
  assert.match(localToolSource, /textOverrides\?\.generateLabel \|\| 'Generate'/)
  assert.doesNotMatch(localToolSource, /Generate for Free/)
})

test('AI Photo Abstract Poster Generator demo image fits without crop or stretch', () => {
  const demoPanelBlock = localToolSource.slice(
    localToolSource.indexOf('const renderDemoPanel'),
    localToolSource.indexOf('const renderHistoryPanel'),
  )
  const mobileDemoBlock = localToolSource.slice(
    localToolSource.indexOf('data-photo-abstract-mobile-demo-panel'),
    localToolSource.indexOf('data-left-generation-panel'),
  )

  assert.match(demoPanelBlock, /data-photo-abstract-demo-frame/)
  assert.match(demoPanelBlock, /data-photo-abstract-demo-image/)
  assert.match(demoPanelBlock, /className="block h-auto max-h-full w-auto max-w-full object-contain"/)
  assert.doesNotMatch(demoPanelBlock, /className="h-full max-h-full max-w-full object-contain"/)
  assert.match(mobileDemoBlock, /className="block h-auto max-h-full w-auto max-w-full object-contain"/)
})

test('AI Photo Abstract Poster Generator uses a Skill-like visual fact recipe', () => {
  assert.match(localToolSource, /type VisualFactMap =/)
  assert.match(localToolSource, /function extractVisualFactMap/)
  assert.match(localToolSource, /rowBands/)
  assert.match(localToolSource, /darkMarks/)
  assert.match(localToolSource, /function drawLandscapeMemoryPanel/)
  assert.match(localToolSource, /function drawDesertMemoryPanel/)
  assert.match(localToolSource, /function drawBrokenHorizonBand/)
  assert.match(localToolSource, /function drawGroundBand/)
  assert.match(localToolSource, /function drawShrubCluster/)
  assert.match(localToolSource, /function drawMemoryFigureMark/)
  assert.match(localToolSource, /function drawAbstractSubjectMass/)
  assert.match(localToolSource, /subtitle/)
  assert.match(localToolSource, /Running Toward Haze/)
  assert.doesNotMatch(localToolSource, /const bars = 9/)
  assert.doesNotMatch(localToolSource, /legX|legHeight/)
  assert.doesNotMatch(localToolSource, /Upper' : signal\.centroidY > 0\.62 \? 'Low' : 'Middle'/)
})

test('AI Photo Abstract Poster Generator does not reuse the desert demo recipe for every landscape upload', () => {
  const titleBlock = localToolSource.slice(
    localToolSource.indexOf('function makeTitle'),
    localToolSource.indexOf('function loadCanvasImage'),
  )
  const panelBlock = localToolSource.slice(
    localToolSource.indexOf('function drawAbstractPanel'),
    localToolSource.indexOf('function composePoster'),
  )

  assert.match(localToolSource, /function isDesertMemorySignal/)
  assert.match(titleBlock, /isDesertMemorySignal\(signal\)/)
  assert.match(panelBlock, /isDesertMemorySignal\(signal\)/)
  assert.doesNotMatch(titleBlock, /if \(signal\.isLandscape && signal\.facts\.darkMarks\.length > 0\)/)
  assert.doesNotMatch(panelBlock, /else if \(signal\.isLandscape\) \{\s*drawDesertMemoryPanel/)
})

test('AI Photo Abstract Poster Generator wires page-owned demo and reference assets', () => {
  for (const locale of locales) {
    const current = pages[locale]
    assert.deepEqual(current.topTool.defaultImageUrls, [referenceImage])
    assert.equal(current.topTool.referenceImage?.url, referenceImage)
    assert.equal(current.topTool.sampleImages?.[0]?.url, demoImage)
    assert.equal(current.topTool.referenceImage?.width, 1200)
    assert.equal(current.topTool.referenceImage?.height, 800)
    assert.equal(current.topTool.sampleImages?.[0]?.width, 1024)
    assert.equal(current.topTool.sampleImages?.[0]?.height, 1516)
    assert.equal(current.heroDemoVideo?.type, 'image')
    assert.equal(current.heroDemoVideo?.src, demoImage)
    assert.equal(current.heroDemoVideo?.width, 1024)
    assert.equal(current.heroDemoVideo?.height, 1516)
    assert.doesNotMatch(JSON.stringify(current.topTool), /horse landscape|pferdelandschaft/i)
    assert.doesNotMatch(JSON.stringify(current.heroDemoVideo), /horse landscape|pferdelandschaft/i)
  }
  assert.match(page.topTool.referenceImage?.title, /desert running source photo/i)
  assert.match(page.topTool.sampleImages?.[0]?.title, /Running Toward Haze/i)
  assert.match(page.heroDemoVideo?.ariaLabel, /desert running photo/i)
  for (const asset of [referenceImage, demoImage]) {
    const localPath = `public${asset}`
    assert.ok(existsSync(localPath), `${asset} should exist`)
    assert.match(asset, /\.webp$/)
    assert.ok(statSync(localPath).size <= 100 * 1024, `${asset} should stay near the page asset budget`)
  }
})

test('AI Photo Abstract Poster Generator omits prompt examples for the upload-only user flow', () => {
  const expectedGenerateLabels = {
    de: 'Generieren',
    en: 'Generate',
    es: 'Generar',
    fr: 'Générer',
    it: 'Genera',
    ja: '生成',
    ko: '생성',
    pt: 'Gerar',
    'zh-TW': '生成',
  }

  for (const locale of locales) {
    const current = pages[locale]
    assert.equal('promptExamples' in current, false)
    assert.equal('useSampleLabel' in current.topTool.textOverrides, false)
    assert.equal('aspectHelpers' in current.topTool.textOverrides, false)
    assert.equal(current.topTool.textOverrides.generateLabel, expectedGenerateLabels[locale])
    assert.equal(current.sectionsOrder.includes('promptExamples'), false)
    assert.deepEqual(current.sectionsOrder, [
      'intro',
      'howToUse',
      'features',
      'photoTips',
      'scenes',
      'faq',
    ])
  }
})

test('AI Photo Abstract Poster Generator has multilingual route, hreflang, and SEO Factory wiring', () => {
  assert.deepEqual(task.localeCoverage, locales)
  assert.match(rootRouteSource, /generateHreflangAlternates\('en', '\/ai-photo-abstract-poster-generator'\)/)
  assert.match(localeRouteSource, /generateStaticParams/)
  assert.match(localeRouteSource, /redirect\('\/ai-photo-abstract-poster-generator'\)/)
  assert.match(localeRouteSource, /hasLocaleL2JsonFile\('ai-photo-abstract-poster-generator', locale\)/)
  assert.match(localeRouteSource, /<ToolL2PageContent locale=\{locale\} tool="ai-photo-abstract-poster-generator" \/>/)
  assert.match(languageSwitchSource, /'ai-photo-abstract-poster-generator': ALL_LOCALE_CODES/)
  assert.doesNotMatch(fallbackSource, /ai-photo-abstract-poster-generator/)
  assert.match(seoLoaderSource, /ai-photo-abstract-poster-generator/)
  assert.match(sitemapSource, /path: '\/ai-photo-abstract-poster-generator'/)

  for (const locale of locales) {
    assert.equal(factories[locale].sourceData, `src/data/${locale}/${slug}.json`)
    assert.equal(factories[locale].taskId, taskId)
    assert.equal(factories[locale].status, 'ready_for_publish')
    assert.equal(factories[locale].generatorType, 'local-code-composition')
    assert.equal(factories[locale].locale, locale)
  }
})

test('AI Photo Abstract Poster Generator is discoverable from public entry points', () => {
  assert.match(navigationSource, /photoAbstractPosterGenerator: 'Photo Abstract Poster Generator'/)
  assert.match(navigationSource, /href: '\/ai-photo-abstract-poster-generator'/)
  assert.match(navigationSource, /imageKey: 'photoAbstractPosterGenerator'/)
  assert.match(footerSource, /photoAbstractPosterGenerator: 'Photo Abstract Poster Generator'/)
  assert.match(footerSource, /getLocalizedHref\('\/ai-photo-abstract-poster-generator'\)/)
  assert.match(homeSource, /navCopy\.photoAbstractPosterGenerator/)
  assert.match(homeSource, /localizeHomeHref\('\/ai-photo-abstract-poster-generator'\)/)
  assert.match(homeGridSource, /id: 'ai-photo-abstract-poster-generator', usesAi: true/)
  assert.match(homeImagesSource, /'ai-photo-abstract-poster-generator'/)
  assert.match(aiToolsCopySource, /photoAbstract/)
  assert.match(aiToolsCopySource, /href: '\/ai-photo-abstract-poster-generator'/)
  assert.match(adminSeoSource, /'ai-photo-abstract-poster-generator'/)
  assert.match(historyMetadataSource, /'ai-photo-abstract-poster-generator': 'AI Photo Abstract Poster Generator'/)
})

test('AI Photo Abstract Poster Generator common translations exist for all entry surfaces', () => {
  for (const locale of locales) {
    const common = JSON.parse(readFileSync(`src/data/${locale}/common.json`, 'utf8'))
    assert.ok(common.nav?.photoAbstractPosterGenerator, `${locale} nav label should exist`)
    assert.ok(common.footer?.photoAbstractPosterGenerator, `${locale} footer label should exist`)
    assert.ok(common.breadcrumb?.photoAbstractPosterGenerator, `${locale} breadcrumb label should exist`)
    assert.ok(
      common.home?.homepageToolCardSummaries?.['ai-photo-abstract-poster-generator']?.summary,
      `${locale} homepage summary should exist`,
    )
  }
})

test('AI Photo Abstract Poster Generator visible copy is localized beyond the English source', () => {
  for (const locale of locales.filter((item) => item !== 'en')) {
    const current = pages[locale]
    assert.notEqual(current.metadata.title, page.metadata.title, `${locale} metadata title should be localized`)
    assert.notEqual(current.hero.desc, page.hero.desc, `${locale} hero description should be localized`)
    assert.notEqual(
      current.topTool.textOverrides.uploadTitle,
      page.topTool.textOverrides.uploadTitle,
      `${locale} tool upload label should be localized`,
    )
    assert.notEqual(current.faq[0].q, page.faq[0].q, `${locale} FAQ questions should be localized`)
    assert.notEqual(current.scenes[0].desc, page.scenes[0].desc, `${locale} use-case copy should be localized`)
  }
})

test('AI Photo Abstract Poster Generator visible copy avoids internal SEO and implementation language', () => {
  const blockedTerms = [
    /this page is built/i,
    /the page covers/i,
    /search intent/i,
    /\bSEO\b/i,
    /AI Overview/i,
    /API platform/i,
    /provider route/i,
    /Unlimited Free/i,
    /Free Forever/i,
    /No Signup/i,
    /No Login/i,
    /GPT Image/i,
    /gpt-image-2/i,
    /image-to-image/i,
  ]

  for (const locale of locales) {
    const visibleCopy = visiblePageCopy(pages[locale])
    for (const term of blockedTerms) {
      assert.doesNotMatch(visibleCopy, term, `${locale} visible copy should not include ${term}`)
    }
  }
})
