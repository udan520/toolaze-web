import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const slug = 'ai-hairstyle-changer'

const pages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8'))]),
)
const commonPages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(`src/data/${locale}/common.json`, 'utf8'))]),
)

const aiImageToolSource = readFileSync('src/components/AiImageGenerationTool.tsx', 'utf8')
const toolL2Source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')

const bangsPresetLabels = {
  en: ['Blunt Bangs', 'Side-Swept Bangs'],
  de: ['Gerader Pony', 'Seitlicher Pony'],
  ja: ['ぱっつん前髪', '斜め前髪'],
  es: ['Flequillo recto', 'Flequillo lateral'],
  'zh-TW': ['齊瀏海', '斜瀏海'],
  pt: ['Franja reta', 'Franja lateral'],
  fr: ['Frange droite', 'Frange sur le côté'],
  ko: ['일자 앞머리', '사이드뱅'],
  it: ['Frangia dritta', 'Frangia laterale'],
}

const bangsPresetImages = [
  'https://assets.toolaze.com/ai-hairstyle-changer/templates/women/blunt-bangs.webp',
  'https://assets.toolaze.com/ai-hairstyle-changer/templates/women/side-swept-bangs.webp',
]

test('all shared image generators move output settings into the fixed action bar', () => {
  assert.doesNotMatch(toolL2Source, /compactOutputSettings=/)
  assert.match(aiImageToolSource, /compactOutputSettings\?: boolean/)
  assert.match(aiImageToolSource, /compactOutputSettings = true/)
  assert.match(
    aiImageToolSource,
    /const useCompactOutputSettings = compactOutputSettings && selectedMediaType === 'image'/,
  )
  assert.match(aiImageToolSource, /!useCompactOutputSettings && !isCouplePhotoMakerMode/)
  assert.match(aiImageToolSource, /\{useCompactOutputSettings && \(/)
  assert.doesNotMatch(aiImageToolSource, /\{useCompactOutputSettings && !isCouplePhotoMakerMode && \(/)
  assert.match(aiImageToolSource, /orderImageAspectRatios\(modelConfig\.aspectRatios\)/)
  assert.match(aiImageToolSource, /function getAspectRatioShapeDimensions\(value: string\)/)
  assert.equal(
    aiImageToolSource.match(/getAspectRatioShapeDimensions\(/g)?.length,
    3,
    'the aspect-ratio options and summary must share one shape calculation',
  )
  assert.match(
    aiImageToolSource,
    /data-compact-output-settings-trigger[\s\S]*style=\{\{ width: selectedAspectRatioShape\.width, height: selectedAspectRatioShape\.height \}\}/,
  )
  assert.match(aiImageToolSource, /showAllCompactAspectRatios \? compactOrderedAspectRatios : compactPrimaryAspectRatios/)
  assert.match(
    aiImageToolSource,
    /data-generate-action-bar[\s\S]*data-compact-output-settings-panel[\s\S]*data-compact-more-aspect-ratios[\s\S]*data-compact-output-settings-trigger[\s\S]*data-generate-button/,
  )
  assert.match(aiImageToolSource, /aria-expanded=\{isCompactOutputSettingsOpen\}/)
  assert.match(aiImageToolSource, /data-compact-less-aspect-ratios/)
  assert.match(aiImageToolSource, /setShowAllCompactAspectRatios\(false\)/)
  assert.match(aiImageToolSource, /const aspectRatiosByMode = useState|useState<Record<ImageGenerationMode, string>>/)
  assert.match(aiImageToolSource, /const handleGenerationModeChange = useCallback/)
  assert.match(aiImageToolSource, /handleGenerationModeChange\('image-to-image'\)/)
  assert.match(aiImageToolSource, /handleGenerationModeChange\('text-to-image'\)/)
  assert.doesNotMatch(aiImageToolSource, /data-output-aspect-ratio-select|data-output-resolution-select/)
  for (const locale of locales) {
    assert.ok(commonPages[locale].common.nanoBananaTool.showLess, `${locale} is missing the compact settings collapse label`)
  }
})

test('compact output settings close on outside interaction without closing for inside clicks', () => {
  assert.match(aiImageToolSource, /const compactOutputSettingsRef = useRef<HTMLDivElement>\(null\)/)
  assert.match(aiImageToolSource, /ref=\{compactOutputSettingsRef\}[\s\S]*data-compact-output-settings/)
  assert.match(
    aiImageToolSource,
    /if \(!isCompactOutputSettingsOpen\) return[\s\S]*const closeCompactOutputSettings = \(\) => \{[\s\S]*setIsCompactOutputSettingsOpen\(false\)[\s\S]*setShowAllCompactAspectRatios\(false\)/,
  )
  assert.match(
    aiImageToolSource,
    /compactOutputSettingsRef\.current\.contains\(event\.target\)[\s\S]*closeCompactOutputSettings\(\)[\s\S]*event\.key === 'Escape'/,
  )
  assert.match(
    aiImageToolSource,
    /document\.addEventListener\('mousedown', handlePointerDown\)[\s\S]*document\.addEventListener\('keydown', handleKeyDown\)[\s\S]*document\.removeEventListener\('mousedown', handlePointerDown\)[\s\S]*document\.removeEventListener\('keydown', handleKeyDown\)/,
  )
})

test('AI Hairstyle Changer keeps Women, Men, and Custom as the top-level hairstyle tabs', () => {
  for (const locale of locales) {
    const page = pages[locale]
    assert.equal(page.topComponent, 'gpt-image-2')
    assert.equal(page.topTool.mode, 'image-to-image')
    assert.equal(page.topTool.modelId, 'gpt-image-2')
    assert.equal(page.topTool.maxUploadImages, 1)
    assert.equal(page.topTool.functionalAcceptance.defaultPromptPresetTabId, 'women')
    assert.deepEqual(page.topTool.functionalAcceptance.presetTabs.map((tab) => tab.id), ['women', 'men', 'custom'])
    assert.ok(page.topTool.functionalAcceptance.presets.some((preset) => preset.group === 'women'))
    assert.ok(page.topTool.functionalAcceptance.presets.some((preset) => preset.group === 'men'))
  }
})

test('AI Hairstyle Changer offers blunt and side-swept bangs in every Women preset group', () => {
  for (const locale of locales) {
    const presets = pages[locale].topTool.functionalAcceptance.presets
    const womenPresets = presets.filter((preset) => preset.group === 'women')

    for (const [index, label] of bangsPresetLabels[locale].entries()) {
      const preset = womenPresets.find((candidate) => candidate.label === label)
      assert.ok(preset, `${locale} is missing ${label}`)
      assert.ok(preset.prompt.trim(), `${locale} ${label} must keep its hidden generation prompt`)
      assert.equal(preset.image, bangsPresetImages[index], `${locale} ${label} must use its matching template`)
      assert.match(preset.image, /^https:\/\/assets\.toolaze\.com\/ai-hairstyle-changer\/templates\/women\/.+\.webp$/)
    }

    assert.match(womenPresets.find((preset) => preset.label === bangsPresetLabels[locale][0]).prompt, /blunt bangs/i)
    assert.match(womenPresets.find((preset) => preset.label === bangsPresetLabels[locale][1]).prompt, /side-swept bangs/i)
  }
})

test('AI Hairstyle Changer Custom tab supports prompt or hairstyle-reference input, not both at once', () => {
  for (const locale of locales) {
    const page = pages[locale]
    assert.equal(page.topTool.defaultAspectRatio, 'auto')
    assert.equal(page.topTool.functionalAcceptance.hidePresetPromptInput, true)
    assert.equal(page.topTool.functionalAcceptance.customPromptTabId, 'custom')
    assert.equal(page.topTool.functionalAcceptance.hidePresetReferenceUploader, true)
    assert.equal(page.topTool.functionalAcceptance.enableCustomReferenceImageUpload, true)
    assert.notEqual(page.topTool.functionalAcceptance.inlinePresetReferenceUpload, true)
    assert.notEqual(page.topTool.functionalAcceptance.combineCustomReferenceAndPrompt, true)
    assert.equal(page.topTool.functionalAcceptance.showPresetSelectedState, true)
    assert.match(page.topTool.functionalAcceptance.customReferencePrompt, /hairstyle reference image/i)
    assert.ok(page.topTool.textOverrides.presetChoiceTitle)
    assert.ok(page.topTool.textOverrides.customTextModeLabel)
    assert.ok(page.topTool.textOverrides.customReferenceModeLabel)
    assert.ok(page.topTool.textOverrides.customReferenceUploadTitle)
    assert.equal(page.topTool.textOverrides.customReferenceUploadHelper, undefined)
  }

  assert.equal(pages.en.topTool.textOverrides.customTextModeLabel, 'Describe hair style')
  assert.equal(pages.en.topTool.textOverrides.customReferenceModeLabel, 'Reference hair style')
  assert.match(toolL2Source, /hidePresetReferenceUploader=\{content\.topTool\?\.functionalAcceptance\?\.hidePresetReferenceUploader === true\}/)
  assert.match(toolL2Source, /enableCustomReferenceImageUpload=\{content\.topTool\?\.functionalAcceptance\?\.enableCustomReferenceImageUpload === true\}/)
  assert.match(toolL2Source, /customReferencePrompt=\{content\.topTool\?\.functionalAcceptance\?\.customReferencePrompt\}/)
  assert.match(toolL2Source, /defaultPromptPresetTabId=\{content\.topTool\?\.functionalAcceptance\?\.defaultPromptPresetTabId\}/)
  assert.match(aiImageToolSource, /defaultPromptPresetTabId\?: string/)
  assert.match(aiImageToolSource, /getInitialPromptPresetTabId/)
  assert.match(aiImageToolSource, /workflowPresetTabCount = Math\.max\(promptPresetTabs\.length, 1\)/)
  assert.match(aiImageToolSource, /gridTemplateColumns: `repeat\(\$\{workflowPresetTabCount\}, minmax\(0, 1fr\)\)`/)
  assert.doesNotMatch(aiImageToolSource, /data-workflow-preset-tabs[\s\S]{0,200}grid-cols-2/)
  assert.match(aiImageToolSource, /shouldRenderWorkflowTabsAboveUpload[\s\S]*'grid grid-cols-4 gap-2'/)
  assert.match(aiImageToolSource, /shouldShowCustomInputModeSwitch = combineCustomReferenceAndPrompt \? false : \([\s\S]*activePromptPresetTab === customPromptTabId[\s\S]*enableCustomReferenceImageUpload/)
  assert.match(aiImageToolSource, /shouldUseReferenceOnlyCustomMode = shouldShowCustomInputModeSwitch && customInputMode === 'reference'/)
  assert.match(aiImageToolSource, /!\(\(hidePresetPromptInput && activePromptPresetTab !== customPromptTabId\) \|\| shouldUseCustomReferenceUploader\)/)
})

test('AI Hairstyle Changer Custom reference mode enables generate from uploaded references', () => {
  assert.match(
    aiImageToolSource,
    /const currentEffectivePrompt = shouldUseCombinedCustomReference[\s\S]*shouldUseReferenceOnlyCustomMode[\s\S]*customReferencePrompt\.trim\(\)/,
  )
  assert.match(
    aiImageToolSource,
    /const canGenerate = Boolean\(currentEffectivePrompt\)[\s\S]*?&& \(activeTab !== 'image-to-image' \|\| hasCurrentReferenceImages\)/,
  )
  assert.match(aiImageToolSource, /disabled=\{!canGenerate\}/)
  assert.doesNotMatch(
    aiImageToolSource,
    /disabled=\{!prompt\.trim\(\) \|\| \(activeTab === 'image-to-image' && imageFiles\.length === 0 && remoteImageUrls\.length === 0\)\}/,
  )
})

test('AI Hairstyle Changer preset tabs do not require a second reference image', () => {
  assert.match(
    aiImageToolSource,
    /const shouldUseSelectedPresetReference = isClothingReferencePresetGrid[\s\S]*Boolean\(selectedPromptPresetReferenceImage\)/,
  )
  assert.match(
    aiImageToolSource,
    /const hasCurrentReferenceImages = shouldIncludeSecondaryReference[\s\S]*: hasCurrentPersonReferenceImages/,
  )
})

test('AI Hairstyle Changer does not restore a deleted default person image when switching tabs', () => {
  assert.match(aiImageToolSource, /const clearedDefaultPersonImageUrlsRef = useRef\(new Set<string>\(\)\)/)
  assert.match(
    aiImageToolSource,
    /const baseImageUrls = defaultImageUrls\.filter\([\s\S]*!presetReferenceImages\.has\(url\)[\s\S]*&& !clearedDefaultPersonImageUrlsRef\.current\.has\(url\)/,
  )
  assert.match(
    aiImageToolSource,
    /const removeRemotePersonImage = \(index: number, url: string\) => \{[\s\S]*clearedDefaultPersonImageUrlsRef\.current\.add\(url\)[\s\S]*setRemoteImageUrls/,
  )
  assert.match(aiImageToolSource, /onRemove: \(\) => removeRemotePersonImage\(index, url\)/)
  assert.match(
    aiImageToolSource,
    /const replaceRemoteImageWithFile = \(index: number, url: string, file: File\) => \{[\s\S]*clearedDefaultPersonImageUrlsRef\.current\.add\(url\)/,
  )
})
