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

test('AI Hairstyle Changer Custom tab supports prompt or hairstyle-reference input, not both at once', () => {
  for (const locale of locales) {
    const page = pages[locale]
    assert.equal(page.topTool.defaultAspectRatio, 'auto')
    assert.equal(page.topTool.functionalAcceptance.hidePresetPromptInput, true)
    assert.equal(page.topTool.functionalAcceptance.customPromptTabId, 'custom')
    assert.equal(page.topTool.functionalAcceptance.hidePresetReferenceUploader, true)
    assert.equal(page.topTool.functionalAcceptance.enableCustomReferenceImageUpload, true)
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
  assert.match(aiImageToolSource, /shouldShowCustomInputModeSwitch = shouldRenderWorkflowTabsAboveUpload && activePromptPresetTab === customPromptTabId && enableCustomReferenceImageUpload/)
  assert.match(aiImageToolSource, /shouldUseCustomReferenceUploader = shouldShowCustomInputModeSwitch && customInputMode === 'reference'/)
  assert.match(aiImageToolSource, /!\(\(hidePresetPromptInput && activePromptPresetTab !== customPromptTabId\) \|\| shouldUseCustomReferenceUploader\)/)
})
