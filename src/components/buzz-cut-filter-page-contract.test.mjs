import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const slug = 'buzz-cut-filter'
const taskId = '2026-08-06-buzz-cut-filter'
const referenceImage = 'https://assets.toolaze.com/model-assets/buzz-cut-filter/buzz-cut-reference.webp'
const demoImage = 'https://assets.toolaze.com/model-assets/buzz-cut-filter/buzz-cut-before-after-demo.webp'
const ignoredVisibleCopyKeys = new Set([
  'color',
  'customReferencePrompt',
  'defaultImageUrls',
  'defaultPrompt',
  'href',
  'image',
  'modelId',
  'mode',
  'pageGroup',
  'prompt',
  'published',
  'recommendedMode',
  'sectionsOrder',
  'sourceData',
  'src',
  'status',
  'taskId',
  'topComponent',
  'url',
  'visiblePageType',
])
const ignoredFallbackPaths = [
  'moreToolsLinks',
  'topTool.functionalAcceptance.presets',
  'topTool.sampleImages',
]

function formatChildPath(parentPath, key) {
  if (/^\d+$/.test(key)) return `${parentPath}[${key}]`
  return parentPath ? `${parentPath}.${key}` : key
}

function collectVisibleStrings(value, path = '') {
  const key = path.replace(/\[\d+\]$/, '').split('.').at(-1)
  if (ignoredVisibleCopyKeys.has(key)) return []
  if (typeof value === 'string') return [{ path, value }]
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectVisibleStrings(item, formatChildPath(path, String(index))))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([entryKey, entryValue]) =>
      collectVisibleStrings(entryValue, formatChildPath(path, entryKey)),
    )
  }
  return []
}

test('Buzz Cut Filter page data and routes are wired', () => {
  assert.ok(existsSync(`src/data/en/${slug}.json`))
  assert.ok(existsSync(`src/app/${slug}/page.tsx`))
  assert.ok(existsSync(`src/app/[locale]/${slug}/page.tsx`))

  const page = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
  const rootRoute = readFileSync(`src/app/${slug}/page.tsx`, 'utf8')
  const localeRoute = readFileSync(`src/app/[locale]/${slug}/page.tsx`, 'utf8')
  const loader = readFileSync('src/lib/seo-loader.ts', 'utf8')

  assert.equal(page.topComponent, 'gpt-image-2')
  assert.equal(page.topTool.mode, 'image-to-image')
  assert.equal(page.topTool.maxUploadImages, 1)
  assert.equal(page.topTool.defaultAspectRatio, 'auto')
  assert.match(page.topTool.defaultPrompt, /buzz cut/i)
  assert.match(page.topTool.defaultPrompt, /preserve.*face/i)
  assert.equal(page.topTool.functionalAcceptance.presets[0].label, 'Buzz Cut')
  assert.equal(page.topTool.functionalAcceptance.presets.at(-1).label, 'Custom')
  assert.deepEqual(page.sectionsOrder, ['howToUse', 'intro', 'features', 'photoTips', 'faq'])
  assert.equal('promptExamples' in page, false)
  assert.match(page.metadata.title, /^Free Buzz Cut Filter Online \| No Signup/)
  assert.match(page.metadata.description, /free Buzz Cut Filter/i)
  assert.match(page.metadata.description, /no signup/i)
  assert.match(page.hero.h1, /^Free AI/)
  assert.match(page.hero.desc, /no signup/i)
  assert.equal(page.howToUse.steps.length, 3)
  assert.equal(page.features.items.length, 3)
  assert.equal(page.photoTips.items.length, 4)
  assert.equal(page.faq.length, 7)
  assert.ok(page.faq.some((item) => /free/i.test(item.q) && /signup/i.test(item.q)))
  assert.match(rootRoute, /generateHreflangAlternates\('en', '\/buzz-cut-filter'\)/)
  assert.match(localeRoute, /generateStaticParams/)
  assert.match(localeRoute, /hasLocaleL2JsonFile\('buzz-cut-filter', locale\)/)
  assert.match(loader, /tool === 'buzz-cut-filter'/)
})

test('Buzz Cut Filter reuses the male hairstyle preset library with Buzz Cut selected by default', () => {
  const page = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
  const hairstyleChanger = JSON.parse(readFileSync('src/data/en/ai-hairstyle-changer.json', 'utf8'))
  const maleHairstylePresets = hairstyleChanger.topTool.functionalAcceptance.presets.filter(
    (preset) => preset.group === 'men',
  )
  const buzzCutPresets = page.topTool.functionalAcceptance.presets
  const maleBuzzCutPresets = buzzCutPresets.filter((preset) => preset.group === 'men')
  const customPreset = buzzCutPresets.at(-1)
  const aiImageToolSource = readFileSync('src/components/AiImageGenerationTool.tsx', 'utf8')
  const toolL2Source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')

  assert.equal(page.topTool.functionalAcceptance.recommendedMode, 'gender-tab-preset-first-with-custom')
  assert.deepEqual(page.topTool.functionalAcceptance.presetTabs.map((tab) => tab.id), ['men', 'custom'])
  assert.equal(page.topTool.functionalAcceptance.hidePresetPromptInput, true)
  assert.equal(page.topTool.functionalAcceptance.customPromptTabId, 'custom')
  assert.equal(page.topTool.functionalAcceptance.showPresetSelectedState, true)
  assert.equal(page.topTool.functionalAcceptance.hidePresetReferenceUploader, true)
  assert.equal(page.topTool.functionalAcceptance.enableCustomReferenceImageUpload, true)
  assert.match(page.topTool.functionalAcceptance.customReferencePrompt, /hairstyle reference image/i)
  assert.match(page.topTool.textOverrides.personUploadTitle, /person photo/i)
  assert.match(page.topTool.textOverrides.customReferenceUploadTitle, /hairstyle reference/i)
  assert.match(page.topTool.textOverrides.presetChoiceTitle, /built-in men's hairstyles/i)
  assert.equal(page.topTool.textOverrides.customTextModeLabel, 'Describe hair style')
  assert.equal(page.topTool.textOverrides.customReferenceModeLabel, 'Reference hair style')
  assert.equal(page.topTool.textOverrides.customReferenceUploadHelper, undefined)

  assert.deepEqual(
    maleBuzzCutPresets.map((preset) => preset.label),
    maleHairstylePresets.map((preset) => preset.label),
  )
  assert.deepEqual(
    maleBuzzCutPresets.map((preset) => preset.prompt),
    maleHairstylePresets.map((preset) => preset.prompt),
  )
  assert.equal(maleBuzzCutPresets[0].label, 'Buzz Cut')
  assert.equal(customPreset.label, 'Custom')
  assert.equal(customPreset.group, 'custom')
  assert.equal(customPreset.prompt, '')
  assert.ok(!buzzCutPresets.some((preset) => preset.group === 'women'))

  assert.match(toolL2Source, /showPromptPresetSelectedState=\{content\.topTool\?\.functionalAcceptance\?\.showPresetSelectedState === true\}/)
  assert.match(toolL2Source, /hidePresetReferenceUploader=\{content\.topTool\?\.functionalAcceptance\?\.hidePresetReferenceUploader === true\}/)
  assert.match(toolL2Source, /enableCustomReferenceImageUpload=\{content\.topTool\?\.functionalAcceptance\?\.enableCustomReferenceImageUpload === true\}/)
  assert.match(toolL2Source, /customReferencePrompt=\{content\.topTool\?\.functionalAcceptance\?\.customReferencePrompt\}/)
  assert.match(aiImageToolSource, /showPromptPresetSelectedState = false/)
  assert.match(aiImageToolSource, /hidePresetReferenceUploader = false/)
  assert.match(aiImageToolSource, /enableCustomReferenceImageUpload = false/)
  assert.match(aiImageToolSource, /customInputMode, setCustomInputMode/)
  assert.match(aiImageToolSource, /shouldShowCustomInputModeSwitch = shouldRenderWorkflowTabsAboveUpload && activePromptPresetTab === customPromptTabId && enableCustomReferenceImageUpload/)
  assert.match(aiImageToolSource, /shouldUseCustomReferenceUploader = shouldShowCustomInputModeSwitch && customInputMode === 'reference'/)
  assert.match(aiImageToolSource, /setCustomInputMode\('prompt'\)/)
  assert.match(aiImageToolSource, /setCustomInputMode\('reference'\)/)
  assert.match(aiImageToolSource, /sceneText\?\.customTextModeLabel \|\| 'Describe hair style'/)
  assert.match(aiImageToolSource, /sceneText\?\.customReferenceModeLabel \|\| 'Reference hair style'/)
  assert.doesNotMatch(aiImageToolSource, /Optional: upload one hairstyle reference image, or describe the hairstyle below/)
  assert.match(aiImageToolSource, /!\(\(hidePresetPromptInput && activePromptPresetTab !== customPromptTabId\) \|\| shouldUseCustomReferenceUploader\)/)
  assert.match(aiImageToolSource, /shouldUsePresetReferenceUploader = shouldRenderWorkflowTabsAboveUpload && activePromptPresetTab !== customPromptTabId && !hidePresetReferenceUploader/)
  assert.match(aiImageToolSource, /effectiveRequestPrompt = shouldUseCustomReferenceUploader \? customReferencePrompt\.trim\(\) : requestPrompt/)
  assert.match(aiImageToolSource, /showPromptPresetSelectedState && selectedPromptPreset === preset\.label/)
  assert.match(aiImageToolSource, /setSelectedPromptPreset\(firstPreset\.label\)/)
})

test('Buzz Cut Filter has complete locale and SEO Factory records', () => {
  const task = JSON.parse(readFileSync(`_codex/seo-pipeline/tasks/${taskId}/task.json`, 'utf8'))
  const queue = JSON.parse(readFileSync('_codex/seo-pipeline/queue/ready.json', 'utf8'))
  assert.equal(task.slug, slug)
  assert.equal(task.status, 'ready_for_publish')
  assert.deepEqual(task.localeCoverage, locales)
  assert.ok(queue.tasks.some((entry) => entry.taskId === taskId && entry.slug === slug))

  for (const locale of locales) {
    const pagePath = `src/data/${locale}/${slug}.json`
    const factoryPath = `_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`
    assert.ok(existsSync(pagePath), `${locale} page data should exist`)
    assert.ok(existsSync(factoryPath), `${locale} factory content should exist`)
    const page = JSON.parse(readFileSync(pagePath, 'utf8'))
    const factory = JSON.parse(readFileSync(factoryPath, 'utf8'))
    assert.equal(factory.taskId, taskId)
    assert.equal(factory.slug, slug)
    assert.equal(factory.status, 'ready_for_publish')
    assert.equal(factory.locale, locale)
    assert.equal(page.faq.length, 7)
      assert.equal(page.features.items.length, 3)
    assert.equal(page.topTool.defaultAspectRatio, 'auto')
    assert.deepEqual(page.topTool.defaultImageUrls, [referenceImage])
    assert.equal(page.topTool.sampleImages?.[0]?.url, demoImage)
    assert.equal(page.topTool.sampleImages?.[0]?.width, 1600)
    assert.equal(page.topTool.sampleImages?.[0]?.height, 900)
    assert.deepEqual(page.topTool.functionalAcceptance.presetTabs.map((tab) => tab.id), ['men', 'custom'])
    assert.equal(page.topTool.functionalAcceptance.hidePresetPromptInput, true)
    assert.equal(page.topTool.functionalAcceptance.showPresetSelectedState, true)
    assert.ok(page.topTool.textOverrides.customTextModeLabel)
    assert.ok(page.topTool.textOverrides.customReferenceModeLabel)
  }
})

test('Buzz Cut Filter uses page-owned visual samples and public entry points', () => {
  const page = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
  const sitemap = readFileSync('src/app/sitemap.ts', 'utf8')
  const navigation = readFileSync('src/components/Navigation.tsx', 'utf8')
  const footer = readFileSync('src/components/Footer.tsx', 'utf8')
  const aiTools = readFileSync('src/app/ai-tools/copy.ts', 'utf8')
  const home = readFileSync('src/components/home/HomePageMain.tsx', 'utf8')

  assert.deepEqual(page.topTool.defaultImageUrls, [referenceImage])
  assert.equal(page.topTool.sampleImages?.[0]?.url, demoImage)
  assert.equal(page.topTool.sampleImages?.[0]?.width, 1600)
  assert.equal(page.topTool.sampleImages?.[0]?.height, 900)
  assert.match(page.topTool.sampleImages?.[0]?.title || '', /before.*after|demo/i)
  for (const assetUrl of [referenceImage, demoImage]) {
    assert.match(assetUrl, /^https:\/\/assets\.toolaze\.com\/model-assets\/buzz-cut-filter\/.+\.webp$/)
  }
  assert.ok(page.topTool.sampleImages.every((sample) => /buzz-cut/i.test(`${sample.url} ${sample.title}`)))
  assert.match(sitemap, /path: '\/buzz-cut-filter'/)
  assert.match(navigation, /href: '\/buzz-cut-filter'/)
  assert.match(footer, /getLocalizedHref\('\/buzz-cut-filter'\)/)
  assert.match(aiTools, /href: '\/buzz-cut-filter'/)
  assert.match(home, /localizeHomeHref\('\/buzz-cut-filter'\)/)
})

test('Buzz Cut Filter visible copy avoids internal language and English fallback', () => {
  const english = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
  const englishByPath = new Map(collectVisibleStrings(english).map((item) => [item.path, item.value]))
  const forbiddenPatterns = [
    /\bthis page\b/i,
    /\bthe page is designed\b/i,
    /\bsearch intent\b/i,
    /\bkeyword\b/i,
    /\branking\b/i,
    /\bSEO\b/,
    /\bAI Overview\b/i,
    /\bAPI platform\b/i,
    /\bintegration\b/i,
    /\bprovider route\b/i,
    /\bUnlimited Free\b/i,
    /\bFree Forever\b/i,
    /\bNo Login\b/i,
    /\bNo Watermark\b/i,
  ]

  for (const locale of locales) {
    const page = JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8'))
    for (const { path, value } of collectVisibleStrings(page)) {
      for (const pattern of forbiddenPatterns) {
        assert.doesNotMatch(value, pattern, `${locale} ${path} should not contain internal or unsupported copy`)
      }
      if (locale === 'en') continue
      if (ignoredFallbackPaths.some((ignoredPath) => path.startsWith(ignoredPath))) continue
      if (!/[A-Za-z]/.test(value) || value.length < 16) continue
      assert.notEqual(value, englishByPath.get(path), `${locale} ${path} should not fall back to English`)
    }
  }
})
