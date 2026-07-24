import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const localizedLocales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

test('text-to-video generator page is wired as a localized L2 tool page', () => {
  assert.equal(existsSync('src/app/text-to-video-generator/page.tsx'), true)
  assert.equal(existsSync('src/app/[locale]/text-to-video-generator/page.tsx'), true)
  assert.equal(existsSync('src/data/en/text-to-video-generator.json'), true)

  const pageSource = readFileSync('src/app/text-to-video-generator/page.tsx', 'utf8')
  assert.match(pageSource, /getL2SeoContent\('text-to-video-generator', 'en'\)/)
  assert.match(pageSource, /generateHreflangAlternates\('en', '\/text-to-video-generator'\)/)
  assert.match(pageSource, /<ToolL2PageContent locale="en" tool="text-to-video-generator" \/>/)

  const localePageSource = readFileSync('src/app/[locale]/text-to-video-generator/page.tsx', 'utf8')
  assert.match(localePageSource, /getL2SeoContent\('text-to-video-generator', locale\)/)
  assert.match(localePageSource, /hasLocaleL2JsonFile\('text-to-video-generator', locale\)/)
  assert.match(localePageSource, /redirect\('\/text-to-video-generator'\)/)
})

test('text-to-video generator is discoverable from release-sensitive surfaces', () => {
  const sitemapSource = readFileSync('src/app/sitemap.ts', 'utf8')
  assert.match(sitemapSource, /['"]text-to-video-generator['"]/)

  const navSource = readFileSync('src/components/Navigation.tsx', 'utf8')
  assert.match(navSource, /textToVideoGenerator/)
  assert.match(navSource, /getLocalizedHref\('\/text-to-video-generator'\)/)

  const footerSource = readFileSync('src/components/Footer.tsx', 'utf8')
  assert.match(footerSource, /getLocalizedHref\('\/text-to-video-generator'\)/)

  const aiToolsSource = readFileSync('src/app/ai-tools/copy.ts', 'utf8')
  assert.match(aiToolsSource, /href:\s*'\/text-to-video-generator'/)

  const toolL2Source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')
  assert.match(toolL2Source, /defaultMode=\{content\.topTool\?\.mode/)

  const readyQueue = readFileSync('_codex/seo-pipeline/queue/ready.json', 'utf8')
  assert.match(readyQueue, /"slug": "text-to-video-generator"/)
})

test('text-to-video generator English copy covers competitor-backed decision points', () => {
  const page = JSON.parse(readFileSync('src/data/en/text-to-video-generator.json', 'utf8'))
  const aiVideoPage = JSON.parse(readFileSync('src/data/en/ai-video-generator.json', 'utf8'))

  assert.match(page.metadata.title, /Text to Video Generator/)
  assert.match(page.metadata.description, /script|prompt|model|credit/i)

  const featureTitles = page.modelIntro.featureCards.map((item) => item.title)
  assert.ok(featureTitles.includes('Script and storyboard prompts'))

  const metricLabels = page.performanceMetrics.metrics.map((item) => item.label)
  assert.ok(metricLabels.includes('Aspect ratios'))
  assert.ok(metricLabels.includes('Audio and subtitles'))
  assert.ok(metricLabels.includes('Text-to-video fit'))

  const modelGuideIndex = page.sectionsOrder.indexOf('modelSelectionGuide')
  const promptExamplesIndex = page.sectionsOrder.indexOf('promptExamples')
  assert.equal(modelGuideIndex > page.sectionsOrder.indexOf('performanceMetrics'), true)
  assert.equal(modelGuideIndex < promptExamplesIndex, true)

  assert.equal(page.modelSelectionGuide.title, 'Choose a Text-to-Video Model')
  assert.match(page.modelSelectionGuide.subtitle, /prompt-only|text prompt/i)
  const modelGuideTitles = page.modelSelectionGuide.items.map((item) => item.title)
  assert.deepEqual(modelGuideTitles, ['Seedance 2.0', 'Seedance 2.0 Mini', 'Kling 3.0'])
  assert.equal(JSON.stringify(page.modelSelectionGuide).includes('Grok'), false)
  assert.equal(JSON.stringify(page.modelSelectionGuide).includes('image-to-video'), false)

  const promptTitles = page.promptExamples.items.map((item) => item.title)
  assert.equal(page.promptExamples.items.length, 4)
  assert.deepEqual(promptTitles, [
    'Editorial portrait shot prompt',
    'Renewable explainer B-roll prompt',
    'Bridge tracking shot prompt',
    'Travel product concept prompt',
  ])
  assert.equal(JSON.stringify(page.promptExamples).includes('SaaS launch hook prompt'), false)
  assert.match(page.promptExamples.items[0].prompt, /portrait|head turn|window/i)
  const aiVideoPromptTitles = new Set(aiVideoPage.promptExamples.items.map((item) => item.title))
  assert.deepEqual(promptTitles.filter((title) => aiVideoPromptTitles.has(title)), [])

  const aiVideoPromptVideos = new Set(aiVideoPage.promptExamples.items.map((item) => item.video).filter(Boolean))

  const fourthPromptExample = page.promptExamples.items[3]
  assert.equal(page.heroDemoVideo.src, fourthPromptExample.video)
  assert.equal(page.heroDemoVideo.poster, fourthPromptExample.poster)
  assert.equal(page.heroDemoVideo.sourceHistory, fourthPromptExample.sourceHistory)
  assert.match(page.heroDemoVideo.ariaLabel, /travel product concept prompt/i)
  assert.equal(aiVideoPromptVideos.has(page.heroDemoVideo.src), false)

  const reusedPromptVideos = page.promptExamples.items
    .filter((item) => item.video && aiVideoPromptVideos.has(item.video))
    .map((item) => item.title)
  assert.deepEqual(reusedPromptVideos, [])

  for (const item of page.promptExamples.items) {
    assert.match(item.video, /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\//)
    assert.match(item.poster, /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/.*\.webp$/)
    assert.equal(item.aspectRatio, '16:9')
    assert.equal(item.duration, 'PT5S')
    assert.match(item.uploadDate, /^2026-07-22T/)
    assert.match(item.sourceHistory, /^Grok text-to-video · .+ · 5s · /)
  }

  const sceneTitles = page.scenes.map((item) => item.title)
  assert.equal(page.scenes.length, 6)
  assert.ok(sceneTitles.includes('Portrait motion clips'))

  const faqQuestions = page.faq.map((item) => item.q)
  assert.ok(faqQuestions.includes('How long can text-to-video clips be?'))
  assert.ok(faqQuestions.includes('Does text to video include audio or subtitles?'))
  assert.ok(faqQuestions.includes('What is the difference between text-to-video and image-to-video?'))
  assert.ok(faqQuestions.includes('Can I use generated text-to-video clips commercially?'))

  const relatedHrefs = page.moreToolsLinks.map((item) => item.href)
  assert.equal(page.moreToolsLinks.length >= 6, true)
  assert.ok(relatedHrefs.includes('/model/kling-3'))
  assert.ok(relatedHrefs.includes('/model/grok-imagine-video-1-5'))
})

test('prompt example videos can render in a 16:9 container', () => {
  const promptExamplesSource = readFileSync('src/components/blocks/PromptExamples.tsx', 'utf8')
  assert.match(promptExamplesSource, /item\.aspectRatio === '16:9'/)
  assert.match(promptExamplesSource, /flex aspect-video items-center justify-center bg-slate-100/)
  assert.match(promptExamplesSource, /<video[\s\S]*suppressHydrationWarning[\s\S]*preload="none"/)
})

test('localized text-to-video pages mirror the current English media and section structure', () => {
  const englishPage = JSON.parse(readFileSync('src/data/en/text-to-video-generator.json', 'utf8'))
  const englishFourthPrompt = englishPage.promptExamples.items[3]

  for (const locale of localizedLocales) {
    const page = JSON.parse(readFileSync(`src/data/${locale}/text-to-video-generator.json`, 'utf8'))

    assert.equal(page.promptExamples.items.length, 4, `${locale} prompt examples should match English count`)
    assert.equal(page.scenes.length, 6, `${locale} use cases should match English count`)
    assert.equal(page.moreToolsLinks.length, englishPage.moreToolsLinks.length, `${locale} related tools should match English count`)
    assert.equal(page.faq.length, englishPage.faq.length, `${locale} FAQ should match English count`)

    assert.equal(page.heroDemoVideo.src, englishPage.heroDemoVideo.src)
    assert.equal(page.heroDemoVideo.poster, englishFourthPrompt.poster)
    assert.equal(page.heroDemoVideo.poster, page.promptExamples.items[3].poster)
    assert.notEqual(page.heroDemoVideo.ariaLabel, englishPage.heroDemoVideo.ariaLabel)

    for (const [index, item] of page.promptExamples.items.entries()) {
      const englishItem = englishPage.promptExamples.items[index]
      assert.equal(item.prompt, englishItem.prompt, `${locale} keeps the real generation prompt text for video traceability`)
      assert.equal(item.video, englishItem.video)
      assert.equal(item.poster, englishItem.poster)
      assert.equal(item.aspectRatio, '16:9')
      assert.equal(item.duration, 'PT5S')
      assert.equal(item.sourceHistory, englishItem.sourceHistory)
      assert.notEqual(item.title, englishItem.title)
      assert.notEqual(item.description, englishItem.description)
      assert.notEqual(item.note, englishItem.note)
    }

    assert.equal(JSON.stringify(page).includes('/prompt-templates/social-short.webp'), false)
  }
})

test('localized text-to-video pages avoid obvious English residue', () => {
  const bannedVisiblePhrases = [
    'Prompt to AI Video',
    'Text + reference options',
    'Draft friendly',
    'Audio and high resolution',
    'Best for',
    'Motion is too busy',
    'Scene lacks direction',
    'Credits are too high',
    'Product ad prompt',
    'Storyboard scene prompt',
    'Editorial portrait shot prompt',
    'Renewable explainer B-roll prompt',
    'Bridge tracking shot prompt',
    'Travel product concept prompt',
    'Text to Video Prompt Templates',
    'Popular Text to Video Use Cases',
    'Portrait motion clips',
    'Text to Video Generator FAQ',
    'Text to video demo generated',
    'Related AI Video Tools',
    'Social media clips',
    'Product ads',
    'Explainers',
  ]

  for (const locale of localizedLocales) {
    const body = readFileSync(`src/data/${locale}/text-to-video-generator.json`, 'utf8')
    for (const phrase of bannedVisiblePhrases) {
      assert.equal(body.includes(phrase), false, `${locale} contains English residue: ${phrase}`)
    }
  }
})
