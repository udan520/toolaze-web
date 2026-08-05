import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = JSON.parse(readFileSync('src/data/en/ai-zine-poster-generator.json', 'utf8'))
const factory = JSON.parse(
  readFileSync('_codex/seo-pipeline/tasks/2026-08-05-ai-zine-poster-generator/content/en.json', 'utf8'),
)
const localeFactory = JSON.parse(
  readFileSync('_codex/seo-pipeline/tasks/2026-08-05-ai-zine-poster-generator/content/de.json', 'utf8'),
)
const featuresSource = readFileSync('src/components/blocks/Features.tsx', 'utf8')
const l2Source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')
const rootRouteSource = readFileSync('src/app/ai-zine-poster-generator/page.tsx', 'utf8')
const localeRouteSource = readFileSync('src/app/[locale]/ai-zine-poster-generator/page.tsx', 'utf8')
const sitemapSource = readFileSync('src/app/sitemap.ts', 'utf8')
const fallbackSource = readFileSync('src/lib/localized-route-fallbacks.ts', 'utf8')
const languageSwitchSource = readFileSync('src/lib/site-language-switch.ts', 'utf8')
const navigationSource = readFileSync('src/components/Navigation.tsx', 'utf8')
const footerSource = readFileSync('src/components/Footer.tsx', 'utf8')
const aiToolsCopySource = readFileSync('src/app/ai-tools/copy.ts', 'utf8')
const homePageSource = readFileSync('src/components/home/HomePageMain.tsx', 'utf8')
const homeGridSource = readFileSync('src/lib/homepage-grid-tools.ts', 'utf8')
const homeImageSource = readFileSync('src/lib/home-advanced-ai-card-images.ts', 'utf8')
const adminSeoServerSource = readFileSync('scripts/admin-seo-server.js', 'utf8')
const referenceImage = 'https://assets.toolaze.com/model-assets/ai-zine-poster-generator/zine-poster-reference.webp'
const demoImage = 'https://assets.toolaze.com/model-assets/ai-zine-poster-generator/zine-poster-demo.webp'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('AI Zine Poster Generator uses one-image GPT Image 2 flow with hidden prompt input', () => {
  assert.equal(page.topComponent, 'gpt-image-2')
  assert.equal(page.topTool.mode, 'image-to-image')
  assert.equal(page.topTool.modelId, 'gpt-image-2')
  assert.equal(page.topTool.maxUploadImages, 1)
  assert.equal(page.topTool.hidePromptInput, true)
  assert.equal(page.topTool.hideModelBranding, true)
  assert.equal(page.topTool.defaultAspectRatio, '9:16')
  assert.match(page.topTool.defaultPrompt, /minimal zine poster/i)
  assert.match(page.topTool.defaultPrompt, /70% to 90% calm negative space/i)
  assert.doesNotMatch(page.topTool.defaultPrompt, /tall vertical|3:5|selected output frame/i)
  assert.doesNotMatch(JSON.stringify(page.howToUse), /vertical default|poster format/i)
  assert.equal('safetyHelper' in (page.topTool.textOverrides || {}), false)
  assert.doesNotMatch(JSON.stringify(page), /Upload an image you own or have permission to transform/)
})

test('AI Zine Poster Generator wires the zine demo and built-in reference image', () => {
  assert.deepEqual(page.topTool.defaultImageUrls, [referenceImage])
  assert.equal(page.topTool.sampleImages?.[0]?.url, demoImage)
  assert.equal(page.topTool.sampleImages?.[0]?.width, 1200)
  assert.equal(page.topTool.sampleImages?.[0]?.height, 675)
  assert.equal(page.heroDemoVideo?.type, 'image')
  assert.equal(page.heroDemoVideo?.src, demoImage)
  assert.match(page.heroDemoVideo?.sourceHistory || '', /R2/)
})

test('AI Zine Poster Generator omits prompt examples for the upload-only user flow', () => {
  assert.equal('promptExamples' in page, false)
  assert.equal(page.sectionsOrder.includes('promptExamples'), false)
  assert.deepEqual(page.sectionsOrder, [
    'intro',
    'howToUse',
    'features',
    'photoTips',
    'scenes',
    'faq',
  ])
  assert.match(page.faq[0].a, /Upload one image/)
})

test('AI Zine Poster Generator style features use a complete 2x3 recipe grid with distinct supported icons', () => {
  const featureItems = page.features?.items || []
  const allowedFeatureCounts = new Set([3, 6])
  const iconTypes = featureItems.map((item) => item.iconType)

  assert.equal(allowedFeatureCounts.has(featureItems.length), true)
  assert.equal(featureItems.length, 6)
  assert.deepEqual(iconTypes, ['layout', 'anchor', 'texture', 'typography', 'mood', 'accent'])
  assert.equal(new Set(iconTypes).size, featureItems.length)
  for (const iconType of iconTypes) {
    assert.match(featuresSource, new RegExp(`${iconType}: \\(`))
  }
  assert.doesNotMatch(featuresSource, /return icons\[type\] \|\| icons\.privacy/)
})

test('AI Zine Poster Generator is traceable through SEO Factory and localized route wiring', () => {
  assert.equal(factory.sourceData, 'src/data/en/ai-zine-poster-generator.json')
  assert.equal(factory.status, 'ready_for_publish')
  assert.equal(localeFactory.sourceData, 'src/data/de/ai-zine-poster-generator.json')
  assert.equal(localeFactory.locale, 'de')
  assert.match(l2Source, /hidePromptInput=\{content\.topTool\?\.hidePromptInput === true\}/)
  assert.match(l2Source, /defaultAspectRatio=\{typeof content\.topTool\?\.defaultAspectRatio === 'string'/)
  assert.match(rootRouteSource, /generateHreflangAlternates\('en', '\/ai-zine-poster-generator'\)/)
  assert.match(localeRouteSource, /ToolL2PageContent locale=\{locale\} tool="ai-zine-poster-generator"/)
  assert.match(localeRouteSource, /redirect\('\/ai-zine-poster-generator'\)/)
  assert.match(sitemapSource, /\/ai-zine-poster-generator/)
  assert.doesNotMatch(fallbackSource, /ai-zine-poster-generator/)
  assert.match(languageSwitchSource, /'ai-zine-poster-generator': ALL_LOCALE_CODES/)
})

test('AI Zine Poster Generator has localized page data without English-only body fallback', () => {
  const englishTitle = page.features.items[0].title

  for (const locale of locales) {
    const localized = JSON.parse(readFileSync(`src/data/${locale}/ai-zine-poster-generator.json`, 'utf8'))
    assert.equal(localized.topTool.defaultImageUrls[0], referenceImage, `${locale} should use the R2 reference image`)
    assert.equal(localized.heroDemoVideo.src, demoImage, `${locale} should use the R2 demo image`)
    assert.equal(localized.features.items.length, 6, `${locale} should keep the 2x3 recipe grid`)
    assert.equal(localized.scenes.length, 3, `${locale} should keep exactly 3 use-case cards`)
    assert.equal('promptExamples' in localized, false, `${locale} should keep the upload-only flow`)

    if (locale !== 'en') {
      assert.notEqual(localized.metadata.title, page.metadata.title, `${locale} title should be localized`)
      assert.notEqual(localized.features.items[0].title, englishTitle, `${locale} feature copy should be localized`)
      assert.notEqual(localized.faq[0].q, page.faq[0].q, `${locale} FAQ should be localized`)
    }
  }
})

test('AI Zine Poster Generator is exposed through public entry points', () => {
  assert.match(navigationSource, /aiZinePosterGenerator/)
  assert.match(navigationSource, /href: '\/ai-zine-poster-generator'/)
  assert.match(navigationSource, new RegExp(demoImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.match(footerSource, /getLocalizedHref\('\/ai-zine-poster-generator'\)/)
  assert.match(aiToolsCopySource, /href: '\/ai-zine-poster-generator'/)
  assert.match(homePageSource, /localizeHomeHref\('\/ai-zine-poster-generator'\)/)
  assert.match(homeGridSource, /id: 'ai-zine-poster-generator'/)
  assert.match(homeImageSource, new RegExp(demoImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.match(adminSeoServerSource, /'ai-zine-poster-generator'/)

  for (const locale of locales) {
    const common = JSON.parse(readFileSync(`src/data/${locale}/common.json`, 'utf8'))
    assert.ok(common.nav.aiZinePosterGenerator, `${locale} nav label should exist`)
    assert.ok(common.footer.aiZinePosterGenerator, `${locale} footer label should exist`)
    assert.ok(common.breadcrumb.aiZinePosterGenerator, `${locale} breadcrumb label should exist`)
    assert.ok(common.home.homepageToolCardSummaries['ai-zine-poster-generator'], `${locale} homepage summary should exist`)
  }
})
