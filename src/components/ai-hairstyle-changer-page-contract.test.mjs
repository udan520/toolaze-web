import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const slug = 'ai-hairstyle-changer'

const pages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8'))]),
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
