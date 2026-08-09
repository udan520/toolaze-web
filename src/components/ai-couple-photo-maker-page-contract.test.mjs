import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const slug = 'ai-couple-photo-maker'

const pages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8'))]),
)

const aiImageToolSource = readFileSync('src/components/AiImageGenerationTool.tsx', 'utf8')
const toolL2Source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')
const imageModelConfigSource = readFileSync('src/lib/ai-image-generator-config.ts', 'utf8')

const coupleBranch = toolL2Source.slice(
  toolL2Source.indexOf("topComp === 'ai-couple-photo-maker'"),
  toolL2Source.indexOf("topComp === 'ai-baby-generator'"),
)

test('AI Couple uses fixed GPT Image 2 model with its existing Couple workflow', () => {
  assert.match(coupleBranch, /modelId="gpt-image-2"/)
  assert.match(coupleBranch, /modelName="GPT Image 2"/)
  assert.match(coupleBranch, /presetMode="ai-couple-photo-maker"/)
  assert.doesNotMatch(coupleBranch, /nano-banana-2|Nano Banana 2/)
})

test('AI Couple reuses compact output settings with Auto image-to-image default', () => {
  assert.match(aiImageToolSource, /if \(presetMode === 'ai-couple-photo-maker'\) return 'auto'/)
  assert.match(aiImageToolSource, /\{useCompactOutputSettings && \(/)
  assert.doesNotMatch(aiImageToolSource, /\{useCompactOutputSettings && !isCouplePhotoMakerMode && \(/)

  const coupleTemplateBlock = aiImageToolSource.slice(
    aiImageToolSource.indexOf('{isCouplePhotoMakerMode && ('),
    aiImageToolSource.indexOf('{/* Prompt */}'),
  )
  assert.doesNotMatch(coupleTemplateBlock, /wrappedRatioOptions|toolText\.aspectRatios/)
})

test('GPT Image 2 exposes the selectable 1K, 2K, and 4K resolution contract', () => {
  const gptImage2Config = imageModelConfigSource.slice(
    imageModelConfigSource.indexOf("'gpt-image-2':"),
    imageModelConfigSource.indexOf("'gpt-image-1-5':"),
  )

  assert.match(gptImage2Config, /options:\s*\['1K', '2K', '4K'\]/)
  assert.match(gptImage2Config, /defaultValue:\s*'1K'/)
})

test('all AI Couple locales describe GPT Image 2 and resolution-based credits', () => {
  for (const locale of locales) {
    const serialized = JSON.stringify(pages[locale])
    const settingsAnswer = pages[locale].faq[2].a
    const creditAnswer = pages[locale].faq[4].a

    assert.match(settingsAnswer, /GPT Image 2/, `${locale} settings FAQ must name GPT Image 2`)
    assert.match(settingsAnswer, /1K/)
    assert.match(settingsAnswer, /2K/)
    assert.match(settingsAnswer, /4K/)
    assert.match(creditAnswer, /10/)
    assert.match(creditAnswer, /15/)
    assert.match(creditAnswer, /24/)
    assert.doesNotMatch(serialized, /Nano Banana 2/, `${locale} still names the old model`)
    assert.doesNotMatch(serialized, /40(?:\s|-)*(?:credits?|cr[eé]ditos?|cr[eé]dits?|クレジット|크레딧|點|点)/i, `${locale} still claims fixed 40-credit pricing`)
  }
})
