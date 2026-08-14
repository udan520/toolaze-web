import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const slug = 'age-filter'
const taskId = '2026-08-14-age-filter'
const demoImage = 'https://assets.toolaze.com/uploads/02d85340f9614a4c8bb0a10595fae49f.webp'
const expectedStages = ['Baby Look', 'Child Look', 'Young Adult', 'Middle Age', 'Older Adult']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('Age Filter uses the focused one-image GPT Image 2 flow', () => {
  const page = readJson(`src/data/en/${slug}.json`)

  assert.equal(page.topComponent, 'gpt-image-2')
  assert.equal(page.topTool.mode, 'image-to-image')
  assert.equal(page.topTool.maxUploadImages, 1)
  assert.equal(page.topTool.defaultAspectRatio, 'auto')
  assert.equal(page.topTool.hideModelBranding, true)
  assert.equal(page.topTool.compactResultPanel, true)
  assert.equal(page.topTool.functionalAcceptance.presetTitle, 'Choose a Life Stage')
  assert.deepEqual(page.topTool.functionalAcceptance.presetTabs.map((item) => item.id), ['life-stages', 'custom'])
  assert.deepEqual(page.topTool.functionalAcceptance.presets.map((item) => item.label), expectedStages)
  assert.equal(page.topTool.functionalAcceptance.defaultPromptPresetTabId, 'life-stages')
  assert.equal(page.topTool.functionalAcceptance.showPresetSelectedState, true)
  assert.equal(page.topTool.functionalAcceptance.hidePresetPromptInput, true)
  assert.equal(page.topTool.functionalAcceptance.customPromptTabId, 'custom')
  assert.equal(page.topTool.textOverrides.promptLabel, 'Describe the age you want')
  assert.match(page.topTool.textOverrides.promptPlaceholder, /70 years old/)
  assert.equal(page.topTool.sampleImages[0].url, demoImage)
})

test('Age Filter Older Adult preset ages visible skin as well as hair', () => {
  for (const locale of locales) {
    const page = readJson(`src/data/${locale}/${slug}.json`)
    const olderAdultPreset = page.topTool.functionalAcceptance.presets.at(-1)

    assert.match(olderAdultPreset.prompt, /visible facial skin, neck, and hands/i)
    assert.match(olderAdultPreset.prompt, /fine lines and wrinkles/i)
    assert.match(olderAdultPreset.prompt, /natural age spots/i)
  }
})

test('Age Filter presets define the distinct physical details of every life stage', () => {
  const requiredDetails = [
    /rounder cheeks and softer facial contours/i,
    /child-sized facial proportions/i,
    /firm youthful skin/i,
    /subtle volume loss/i,
    /visible facial skin, neck, and hands/i,
  ]

  for (const locale of locales) {
    const page = readJson(`src/data/${locale}/${slug}.json`)
    const prompts = page.topTool.functionalAcceptance.presets.map((preset) => preset.prompt)

    requiredDetails.forEach((detail, index) => assert.match(prompts[index], detail))
    assert.match(page.topTool.defaultPrompt, /firm youthful skin/i)
  }
})

test('Age Filter answers photo-quality and Preset-versus-Custom questions in the page body', () => {
  const page = readJson(`src/data/en/${slug}.json`)
  const visibleCopy = JSON.stringify([
    page.promptExamples,
    page.howToUse,
    page.intro,
    page.features,
    page.faq,
  ])

  assert.match(page.howToUse.steps[0].desc, /well-lit/i)
  assert.match(page.howToUse.steps[1].desc, /Use Custom/i)
  assert.match(page.intro.content[0].text, /face, hair, skin, neck, hands, and clothing/i)
  assert.match(page.features.items[1].title, /Preset or Custom/i)
  assert.match(visibleCopy, /front-facing portrait/i)
})

test('Age Filter content has the approved proof-first SEO structure in every locale', () => {
  for (const locale of locales) {
    const page = readJson(`src/data/${locale}/${slug}.json`)
    const factory = readJson(`_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`)

    assert.deepEqual(page.sectionsOrder, ['promptExamples', 'howToUse', 'intro', 'features', 'faq'])
    assert.equal(page.promptExamples.items.length, 4)
    assert.ok(page.promptExamples.items.every((item) => item.aspectRatio === '16:9'))
    assert.equal(page.features.items.length, 3)
    assert.ok(page.faq.length <= 6)
    assert.ok(page.hero.h1.trim())
    assert.ok(page.metadata.title.trim())
    assert.ok(page.hero.desc.trim())
    assert.equal(page.moreToolsLinks.length, 3)
    for (const tool of page.moreToolsLinks) {
      assert.match(tool.media.src, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.webp$/)
    }
    assert.doesNotMatch(JSON.stringify(page), /Unlimited Free|Free Forever|No Login/i)
    assert.equal(factory.taskId, taskId)
    assert.equal(factory.slug, slug)
    assert.equal(factory.locale, locale)
  }
})

test('Age Filter limits its approved Free and No Sign-Up promise to the image tool', () => {
  const english = readJson(`src/data/en/${slug}.json`)
  const visibleCopy = JSON.stringify(english)

  assert.match(visibleCopy, /Free AI Age Filter Online/)
  assert.match(visibleCopy, /No Sign-Up/)
  assert.doesNotMatch(visibleCopy, /Unlimited Free|Free Forever|No Login/)
})

test('Age Filter exposes canonical routes and only published R2 media', () => {
  for (const path of [`src/app/${slug}/page.tsx`, `src/app/[locale]/${slug}/page.tsx`]) {
    assert.ok(existsSync(path), `${path} should exist`)
  }

  const englishRoute = readFileSync(`src/app/${slug}/page.tsx`, 'utf8')
  const localeRoute = readFileSync(`src/app/[locale]/${slug}/page.tsx`, 'utf8')
  const english = readJson(`src/data/en/${slug}.json`)
  const images = [
    english.topTool.sampleImages[0].url,
    ...english.promptExamples.items.map((item) => item.image),
  ]

  assert.match(englishRoute, /generateHreflangAlternates\('en', '\/age-filter'\)/)
  assert.match(localeRoute, /redirect\('\/age-filter'\)/)
  for (const image of images) {
    assert.match(image, /^https:\/\/assets\.toolaze\.com\/uploads\/[a-f0-9]+\.webp$/)
  }
})

test('Age Filter is loaded, localized, and named correctly in generation history', () => {
  const loader = readFileSync('src/lib/seo-loader.ts', 'utf8')
  const languageSwitch = readFileSync('src/lib/site-language-switch.ts', 'utf8')
  const historyMetadata = readFileSync('src/lib/generation-history-tool-metadata.ts', 'utf8')
  const historyDisplay = readFileSync('src/lib/generation-history-display.ts', 'utf8')

  assert.match(loader, /tool === 'age-filter'/)
  assert.match(languageSwitch, /'age-filter': ALL_LOCALE_CODES/)
  assert.match(historyMetadata, /'age-filter': 'AI Age Filter'/)
  assert.match(historyDisplay, /'age-filter': 'AI Age Filter'/)
})
