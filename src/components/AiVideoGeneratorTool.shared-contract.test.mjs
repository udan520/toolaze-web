import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const componentPath = join(process.cwd(), 'src', 'components', 'AiVideoGeneratorTool.tsx')
const referenceUploaderPath = join(process.cwd(), 'src', 'components', 'ReferenceImageUploader.tsx')
const configPath = join(process.cwd(), 'src', 'lib', 'ai-video-generator-config.ts')
const l2PagePath = join(process.cwd(), 'src', 'components', 'blocks', 'ToolL2PageContent.tsx')
const l3PagePath = join(process.cwd(), 'src', 'app', '[locale]', '[tool]', '[slug]', 'ToolSlugPageContent.tsx')
const aiVideoGeneratorDataPath = join(process.cwd(), 'src', 'data', 'en', 'ai-video-generator.json')
const promptExamplesPath = join(process.cwd(), 'src', 'components', 'blocks', 'PromptExamples.tsx')
const promptVideoSourcePath = join(process.cwd(), '_codex', 'ai-video-generator-assets', 'prompt-template-videos.source.json')
const aiVideoGeneratorDemoPath = join(process.cwd(), 'public', 'videos', 'ai-video-generator-grok-demo.mp4')
const aiVideoGeneratorDemoSourcePath = join(process.cwd(), 'public', 'videos', 'ai-video-generator-grok-demo.source.json')
const seoFactoryContentDir = join(process.cwd(), '_codex', 'seo-pipeline', 'tasks', '2026-07-21-ai-video-generator-localization', 'content')
const seedanceSlugPagePath = join(process.cwd(), 'src', 'app', 'model', 'seedance-2', '[slug]', 'page.tsx')
const legacySeedanceSlugPagePath = join(process.cwd(), 'src', 'app', 'seedance-2', '[slug]', 'page.tsx')
const seedanceAllToolsPagePath = join(process.cwd(), 'src', 'app', 'model', 'seedance-2', 'all-tools', 'page.tsx')
const localizedLocales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const localizedFreeCreditPatterns = {
  en: /20 free credits/i,
  de: /20 kostenlose Credits/i,
  ja: /20無料credits|20\s*無料credits/i,
  es: /20 créditos gratis/i,
  'zh-TW': /20 點免費 credits/i,
  pt: /20 créditos grátis/i,
  fr: /20 crédits gratuits/i,
  ko: /20 무료 크레딧|무료 크레딧 20개/i,
  it: /20 crediti gratis/i,
}
const staleTenCreditGrantPattern = /10\s*(?:free credits|kostenlose Credits|無料(?:credits|クレジット)|créditos gratis|créditos grátis|crédits gratuits|무료 크레딧|點免費 credits|crediti gratis)/i

test('AI video generator can initialize a selected model from the URL query', () => {
  const toolSource = readFileSync(componentPath, 'utf8')
  const initEffect = toolSource.match(
    /useEffect\(\(\) => \{[\s\S]*?window\.location\.search[\s\S]*?\}, \[defaultMode, modelId\]\)/,
  )?.[0] || ''

  assert.notEqual(initEffect, '', 'video generator should inspect URL search params when initializing')
  assert.match(initEffect, /new URLSearchParams\(window\.location\.search\)\.get\('model'\)/)
  assert.match(initEffect, /AI_VIDEO_GENERATOR_MODEL_OPTIONS\.some\(\(option\) => option\.id === queryModelId\)/)
  assert.match(initEffect, /queryModelId as AiVideoGeneratorModelId/)
  assert.match(initEffect, /applyModelSelection\(nextModel\)/)
  assert.match(toolSource, /const applyModelSelection = \(nextModel: AiVideoGeneratorModelConfig\) => \{[\s\S]*setSelectedModelId\(nextModel\.id\)/)
  assert.match(toolSource, /const applyModelSelection = \(nextModel: AiVideoGeneratorModelConfig\) => \{[\s\S]*setActiveModelGroupId\(getAiVideoGeneratorModelGroupId\(nextModel\.id\)\)/)
})

test('switching video models keeps the current page URL unchanged', () => {
  const toolSource = readFileSync(componentPath, 'utf8')
  const modelChangeHandler = toolSource.match(
    /const handleModelChange = \(nextModelId: AiVideoGeneratorModelId\) => \{[\s\S]*?\n  \}\n\n  const renderModelGroupMark/,
  )?.[0] || ''

  assert.notEqual(modelChangeHandler, '', 'video model change handler should be present')
  assert.doesNotMatch(modelChangeHandler, /window\.history\.(?:pushState|replaceState)/)
  assert.doesNotMatch(modelChangeHandler, /router\.(?:push|replace)/)
})

test('landing-page demo video keeps autoplay muted while exposing native controls', () => {
  const toolSource = readFileSync(componentPath, 'utf8')
  const demoVideo = toolSource.match(/<video\s+data-video-demo-media[\s\S]*?\/>/)?.[0] || ''

  assert.match(demoVideo, /\bcontrols\b/)
  assert.match(demoVideo, /\bautoPlay\b/)
  assert.match(demoVideo, /\bloop\b/)
  assert.match(demoVideo, /\bmuted\b/)
  assert.match(demoVideo, /\bplaysInline\b/)
})

test('video model cards expose native-audio and shot-structure capability tags', () => {
  const toolSource = readFileSync(componentPath, 'utf8')

  assert.match(toolSource, /Native Audio/)
  assert.match(toolSource, /No Native Audio/)
  assert.match(toolSource, /Multi-shot/)
  assert.match(toolSource, /Single-shot/)
  assert.match(toolSource, /supportsNativeAudioOutput/)
  assert.match(toolSource, /supportsMultiShot/)
})

test('video mode tabs stay switchable and incompatible models fall back with a warning', () => {
  const toolSource = readFileSync(componentPath, 'utf8')
  const configSource = readFileSync(configPath, 'utf8')

  assert.match(configSource, /supportedModes:\s*AiVideoGeneratorModeId\[\]/)
  assert.match(configSource, /'seedance-1-pro-fast'/)
  assert.match(toolSource, /getAiVideoGeneratorModelGroupsForMode\(activeMode\)/)
  assert.match(toolSource, /getAiVideoGeneratorFallbackModel\(nextMode\)/)
  assert.match(toolSource, /handleModeChange\(mode\.id\)/)
  assert.match(toolSource, /applyModelSelection/)
  assert.match(toolSource, /type:\s*['"]warning['"]/)
  assert.doesNotMatch(toolSource, /disabled=\{!isModeSupported\}/)
})

function getValueShape(value) {
  if (Array.isArray(value)) return value.map(getValueShape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, getValueShape(value[key])]))
  }
  return typeof value
}

test('AI video pages reuse the shared video generator component', () => {
  assert.ok(existsSync(componentPath), 'shared AiVideoGeneratorTool component should exist')
  assert.ok(existsSync(configPath), 'shared AI video model config should exist')

  const componentSource = readFileSync(componentPath, 'utf8')
  const referenceUploaderSource = readFileSync(referenceUploaderPath, 'utf8')
  const configSource = readFileSync(configPath, 'utf8')
  const l2PageSource = readFileSync(l2PagePath, 'utf8')
  const l3PageSource = readFileSync(l3PagePath, 'utf8')

  assert.match(componentSource, /data-video-model-selector/, 'video tool should render the reusable model selector')
  assert.match(componentSource, /<ReferenceImageUploader/, 'video models should use the global reference image uploader')
  assert.match(referenceUploaderSource, /max-w-60/, 'the global uploader should provide the larger single-reference tile')
  assert.match(componentSource, /getAiVideoGeneratorModelGroupsForMode/, 'video tool should use mode-filtered grouped video model config')
  assert.match(componentSource, /md:w-\[640px\] md:grid-cols-\[210px_minmax\(0,430px\)\]/, 'video model selector should keep the image-tool two-level dropdown shape')
  assert.match(componentSource, /data-generation-tool-shell/, 'video tool should share the image-tool shell contract')
  assert.match(componentSource, /data-left-generation-panel/, 'video tool should expose the shared left settings panel')
  assert.match(componentSource, /fetch\('\/api\/ai-video-generator'/, 'video tool should call the video generation API')
  assert.match(componentSource, /toolaze:use-prompt/, 'video tool should accept prompts from shared prompt example cards')
  assert.match(componentSource, /setPrompt\(promptText\)/, 'video tool should write prompt examples into the left prompt textarea')
  assert.doesNotMatch(componentSource, /VideoModeId = 'text-to-video' \| 'image-to-video' \| 'video-reference' \| 'audio-reference'/, 'video tool should not keep the temporary local-only shell modes')

  assert.match(configSource, /'grok-1-5-video'/, 'model config should include Grok video')
  assert.match(configSource, /'seedance-2'/, 'model config should include Seedance video')
  assert.match(configSource, /'seedance-2-mini'/, 'model config should include Seedance Mini video')
  assert.match(configSource, /'kling-3'/, 'model config should include Kling video')

  assert.match(l2PageSource, /const VIDEO_GENERATOR_DEFAULT_MODELS[\s\S]*= \{[\s\S]*'ai-video-generator': 'grok-1-5-video'[\s\S]*'seedance-2': 'seedance-2'[\s\S]*'kling-3': 'kling-3'/, 'video landing pages should map to their page-specific default models')
  assert.match(l2PageSource, /'ai-asmr-video-generator': 'grok-1-5-video'/, 'AI ASMR should default to Grok video')
  assert.match(l2PageSource, /videoGeneratorDefaultModel \? \([\s\S]*<AiVideoGeneratorTool[\s\S]*modelId=\{videoGeneratorDefaultModel\}[\s\S]*allowModelSelect/, 'video landing pages should share one selectable generator branch')
  assert.equal((l2PageSource.match(/<AiVideoGeneratorTool/g) || []).length, 1, 'L2 video landing pages should render one shared generator implementation')
  assert.match(componentSource, /defaultMode\?: AiVideoGeneratorModeId/, 'shared video generator should accept a page-level default mode')
  assert.match(componentSource, /getInitialVideoMode\(modelConfig, defaultMode\)/, 'shared video generator should resolve page mode against the active model')
  assert.match(l2PageSource, /initialImageUrls=\{Array\.isArray\(content\.topTool\?\.initialImageUrls\)/, 'video landing pages should pass initial reference image URLs from page data')
  assert.match(l2PageSource, /initialMotionVideoUrls=\{Array\.isArray\(content\.topTool\?\.initialMotionVideoUrls\)/, 'video landing pages should pass initial motion reference video URLs from page data')
  assert.match(l2PageSource, /initialMotionVideoDurationSeconds=\{[\s\S]*content\.topTool\?\.initialMotionVideoDurationSeconds/, 'video landing pages should pass initial motion reference duration from page data')
  assert.match(l2PageSource, /initialCharacterOrientation=\{[\s\S]*content\.topTool\?\.initialCharacterOrientation === 'image'[\s\S]*content\.topTool\?\.initialCharacterOrientation === 'video'/, 'video landing pages should pass initial character orientation from page data')
  assert.doesNotMatch(l3PageSource, /\/model\/seedance-2\/text-to-video|\/model\/seedance-2\/image-to-video/, 'Seedance workflow URLs should not be emitted as model L3 links')
  assert.doesNotMatch(l3PageSource, /SeedanceHeroPlaceholder/, 'video workflow pages should not keep the legacy Seedance placeholder')
  assert.doesNotMatch(l2PageSource, /<SeedanceHeroPlaceholder/, 'Seedance should not keep the legacy placeholder generator')
  assert.doesNotMatch(l2PageSource, /<KlingHeroPlaceholder/, 'Kling should not keep the legacy placeholder generator')
})

test('AI video generator preserves provider routing while polling Veo tasks', () => {
  const componentSource = readFileSync(componentPath, 'utf8')

  assert.match(componentSource, /taskProvider\?: string/)
  assert.match(componentSource, /const taskProvider = String\(createResult\.taskProvider \|\| ''\)\.trim\(\)/)
  assert.match(componentSource, /pollVideoStatus\(taskId, creditHold, taskProvider\)/)
  assert.match(componentSource, /JSON\.stringify\(\{ taskId, creditHold: creditHold \|\| null, taskProvider: taskProvider \|\| null \}\)/)
})

test('AI video generator page includes prompt examples after how-to guidance', () => {
  const pageData = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const promptExamplesSource = readFileSync(promptExamplesPath, 'utf8')
  const promptVideoSource = JSON.parse(readFileSync(promptVideoSourcePath, 'utf8'))
  const howToIndex = pageData.sectionsOrder.indexOf('howToUse')
  const promptIndex = pageData.sectionsOrder.indexOf('promptExamples')

  assert.notEqual(howToIndex, -1, 'AI Video Generator should keep the how-to section')
  assert.notEqual(promptIndex, -1, 'AI Video Generator should include prompt examples like the image generator page')
  assert.equal(promptIndex, howToIndex + 1, 'prompt examples should follow how-to guidance so users can copy prompts after learning the workflow')
  assert.ok(Array.isArray(pageData.promptExamples?.items), 'prompt examples should use the shared PromptExamples data shape')
  assert.ok(pageData.promptExamples.items.length >= 4, 'AI Video Generator should include multiple practical video prompt examples')
  assert.ok(
    pageData.promptExamples.items.every((item) => item.title && item.prompt),
    'each prompt example should include a title and copyable prompt'
  )
  assert.ok(
    pageData.promptExamples.items.every((item) => /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/ai-video-generator\/prompt-templates\/.+\.mp4$/.test(item.video)),
    'each AI video prompt example should reference its stable R2-hosted MP4'
  )
  assert.match(promptExamplesSource, /video\?: string/, 'shared prompt examples should accept optional video media')
  assert.match(promptExamplesSource, /poster\?: string/, 'shared prompt examples should accept a stable poster for video SEO')
  assert.match(promptExamplesSource, /item\.video\s*\?\s*\(/, 'shared prompt examples should prefer video media when configured')
  assert.match(promptExamplesSource, /IntersectionObserver/, 'prompt videos should defer playback until their cards enter the viewport')
  assert.match(promptExamplesSource, /preload="none"/, 'prompt videos should not request all permanent videos during initial page load')
  assert.match(promptExamplesSource, /poster=\{item\.poster\}/, 'prompt videos should render their stable poster')
  assert.match(promptExamplesSource, /\)\s*:\s*item\.image\s*\?\s*\(/, 'shared prompt examples should keep the existing image fallback')
  assert.match(promptExamplesSource, /\)\s*:\s*\(\s*<div className="aspect-\[(?:4\/3|9\/16)\]/, 'shared prompt examples should keep the decorative placeholder fallback')
  assert.equal(promptVideoSource.assets.length, pageData.promptExamples.items.length, 'source manifest should cover every prompt video')
  const sourceAssetsByTitle = new Map(promptVideoSource.assets.map((asset) => [asset.title, asset]))
  for (const item of pageData.promptExamples.items) {
    const sourceAsset = sourceAssetsByTitle.get(item.title)
    assert.ok(sourceAsset, `${item.title} should have a source manifest entry`)
    assert.equal(sourceAsset.pagePrompt, item.prompt, `${item.title} source prompt should match the page prompt`)
    assert.equal(sourceAsset.publicUrl, item.video, `${item.title} source URL should match the page video`)
    assert.equal(sourceAsset.poster, item.poster, `${item.title} source poster should match the page poster`)
    assert.equal(sourceAsset.description, item.description, `${item.title} source description should match the page description`)
    assert.equal(sourceAsset.uploadDate, item.uploadDate, `${item.title} source upload date should match the page metadata`)
    assert.equal(`PT${sourceAsset.durationSeconds}S`, item.duration, `${item.title} source duration should match the page metadata`)
    assert.match(
      item.poster,
      /^https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/ai-video-generator\/prompt-templates\/.+\.webp$/,
      `${item.title} poster should use its stable R2-hosted WebP`,
    )
  }

  const productAd = pageData.promptExamples.items.find((item) => item.title === 'Product Ad Prompt')
  assert.match(productAd.prompt, /5-second/i, 'Product Ad prompt should match the permanent five-second video')
  assert.match(productAd.prompt, /9:16/i, 'Product Ad prompt should match the permanent vertical video')
  assert.doesNotMatch(productAd.prompt, /15-second|16:9/i, 'Product Ad prompt should not promise settings that the permanent video does not use')
})

test('AI video generator localizes the complete visible page and copied prompts', () => {
  const english = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const localeMarkers = {
    de: /KI-Videos|Videogenerator/,
    ja: /動画|生成/,
    es: /videos con IA|Generador/,
    'zh-TW': /影片|產生器/,
    pt: /vídeos com IA|Gerador/,
    fr: /vidéos IA|Générateur/,
    ko: /동영상|생성기/,
    it: /video IA|Generatore/,
  }

  for (const locale of localizedLocales) {
    const localePath = join(process.cwd(), 'src', 'data', locale, 'ai-video-generator.json')
    assert.ok(existsSync(localePath), `${locale} AI Video Generator data should exist`)
    const localized = JSON.parse(readFileSync(localePath, 'utf8'))

    assert.deepEqual(getValueShape(localized), getValueShape(english), `${locale} should preserve the complete English data shape`)
    assert.match(`${localized.metadata.title} ${localized.hero.h1} ${localized.hero.desc}`, localeMarkers[locale], `${locale} should render language-specific hero copy`)
    assert.notEqual(localized.metadata.title, english.metadata.title, `${locale} metadata title should be localized`)
    assert.notEqual(localized.faqTitle, english.faqTitle, `${locale} FAQ title should be localized`)
    assert.equal(localized.promptExamples.items.length, english.promptExamples.items.length, `${locale} should preserve every prompt card`)

    localized.promptExamples.items.forEach((item, index) => {
      const sourceItem = english.promptExamples.items[index]
      assert.notEqual(item.title, sourceItem.title, `${locale} prompt ${index + 1} title should be localized`)
      assert.notEqual(item.prompt, sourceItem.prompt, `${locale} prompt ${index + 1} copied text should be localized`)
      assert.notEqual(item.description, sourceItem.description, `${locale} prompt ${index + 1} video description should be localized`)
      assert.equal(item.video, sourceItem.video, `${locale} prompt ${index + 1} should preserve the R2 video`)
      assert.equal(item.poster, sourceItem.poster, `${locale} prompt ${index + 1} should preserve the poster`)
      assert.equal(item.duration, sourceItem.duration, `${locale} prompt ${index + 1} should preserve the ISO duration`)
      assert.equal(item.uploadDate, sourceItem.uploadDate, `${locale} prompt ${index + 1} should preserve the upload date`)
    })

    const visibleCopy = JSON.stringify(localized)
    assert.doesNotMatch(
      visibleCopy,
      /\b(Create|Choose|Start|Upload|Generate|How to|What is|Why does|Can I|Should I|Free AI Video Generator)\b/,
      `${locale} should not contain partial English UI or prompt copy`,
    )
  }
})

test('AI video generator SEO Factory preview records contain renderable locale content', () => {
  for (const locale of ['en', ...localizedLocales]) {
    const publicData = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', locale, 'ai-video-generator.json'), 'utf8'))
    const previewData = JSON.parse(readFileSync(join(seoFactoryContentDir, `${locale}.json`), 'utf8'))

    assert.deepEqual(previewData, publicData, `${locale} SEO Factory preview content should match the public locale data`)
  }
})

test('AI video generator SEO copy is direct, objective, and non-duplicative', () => {
  const pageData = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const visibleCopy = JSON.stringify({
    metadata: pageData.metadata,
    hero: pageData.hero,
    sectionsOrder: pageData.sectionsOrder,
    modelIntro: pageData.modelIntro,
    performanceMetrics: pageData.performanceMetrics,
    modelSelectionGuide: pageData.modelSelectionGuide,
    troubleshooting: pageData.troubleshooting,
    faq: pageData.faq,
  })

  assert.match(pageData.metadata.title, /\bFree AI Video Generator\b/i, 'video metadata should cover the verified free-generator intent')
  assert.match(pageData.hero.h1, /\bFree AI Video Generator\b/i, 'video H1 should state the verified free offer')
  assert.doesNotMatch(pageData.hero.desc, /20 free credits|sign[- ]up|eligible settings/i, 'hero description should stay concise and leave free-credit conditions to the FAQ')
  assert.doesNotMatch(pageData.hero.desc, /Grok|Seedance|Kling/i, 'hero description should lead with creation value instead of listing models')
  assert.match(visibleCopy, /20 free credits/i, 'visible copy should disclose the exact new-user credit grant')
  assert.match(visibleCopy, /sign[- ]up/i, 'visible copy should disclose that the free credits require sign-up')
  assert.match(visibleCopy, /Grok[\s\S]*eligible|eligible[\s\S]*Grok/i, 'visible copy should scope the free generation to eligible Grok settings')
  assert.doesNotMatch(visibleCopy, /unlimited free|free forever|no sign[- ]up/i, 'video copy should not imply unlimited or registration-free generation')
  assert.ok(pageData.metadata.description.length <= 160, 'meta description should stay concise enough for common result layouts')
  assert.doesNotMatch(
    visibleCopy,
    /the page is built|one model page|a broad ai video generator should|the same page|this page also covers|check the page/i,
    'visible copy should not expose editorial or page-positioning language'
  )
  assert.equal(pageData.sectionsOrder.includes('features'), false, 'duplicate generic feature copy should not render')
  assert.equal(pageData.sectionsOrder.includes('intro'), false, 'duplicate generic intro copy should not render')
  assert.equal(pageData.sectionsOrder.includes('rating'), false, 'hidden rating content should not remain in the page order')
  assert.equal('comparison' in pageData, false, 'unsupported generic competitor claims should be removed from page-owned data')
  assert.equal('rating' in pageData, false, 'unused rating content should be removed from page-owned data')
  assert.ok(Array.isArray(pageData.troubleshooting?.items), 'page should include reusable troubleshooting guidance')
  assert.ok(pageData.troubleshooting.items.length >= 4, 'troubleshooting should cover common generation failures')
  assert.ok(pageData.modelSelectionGuide.items.every((item) => !/highest|best/i.test(item.badge)), 'model guide badges should use measurable capabilities')
  assert.ok(pageData.performanceMetrics.metrics.every((item) => /credits/i.test(item.value)), 'each model row should expose its credit estimate')
  assert.ok(pageData.faq.some((item) => /credits/i.test(item.q) && /shown|estimate/i.test(item.a)), 'FAQ should answer the credit question directly')
  assert.ok(pageData.faq.some((item) => /audio/i.test(item.q) && /Kling 3\.0|720p|1080p/i.test(item.a)), 'FAQ should state the available native-audio behavior directly')
})

test('AI video generator localized copy discloses the 20-credit signup grant', () => {
  for (const locale of ['en', ...localizedLocales]) {
    const pageData = JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', locale, 'ai-video-generator.json'), 'utf8'))
    const visibleCopy = JSON.stringify({
      metadata: pageData.metadata,
      faq: pageData.faq,
    })

    assert.match(visibleCopy, localizedFreeCreditPatterns[locale], `${locale} copy should disclose 20 signup credits`)
    assert.doesNotMatch(visibleCopy, staleTenCreditGrantPattern, `${locale} copy should not mention a stale 10-credit signup grant`)
  }
})

test('AI video generator exposes FAQ and permanent prompt videos as structured data', () => {
  const l2PageSource = readFileSync(l2PagePath, 'utf8')

  assert.match(l2PageSource, /'@graph'/, 'shared L2 schema should combine page entities in a graph')
  assert.match(l2PageSource, /'@type': 'FAQPage'/, 'shared L2 schema should describe visible FAQ content')
  assert.match(l2PageSource, /'@type': 'VideoObject'/, 'shared L2 schema should describe permanent prompt videos')
  assert.match(l2PageSource, /thumbnailUrl:[\s\S]*uploadDate:[\s\S]*duration:[\s\S]*contentUrl:/, 'video schema should expose stable searchable metadata')
})

test('legacy Seedance generic generator URL permanently redirects to the model page', () => {
  const slugPageSource = readFileSync(seedanceSlugPagePath, 'utf8')
  const legacySlugPageSource = readFileSync(legacySeedanceSlugPagePath, 'utf8')
  const allToolsSource = readFileSync(seedanceAllToolsPagePath, 'utf8')

  assert.match(slugPageSource, /import \{ permanentRedirect \} from 'next\/navigation'/, 'legacy route should use a permanent redirect')
  assert.match(slugPageSource, /\[\.\.\.new Set\(\[\.\.\.slugs, 'ai-video-generator'\]\)\]/, 'legacy redirect slug should be included in static generation')
  assert.match(slugPageSource, /await params[\s\S]*permanentRedirect\('\/model\/seedance-2'\)/, 'legacy slugs should redirect to the canonical Seedance model page')
  assert.match(slugPageSource, /robots:[\s\S]*index: false[\s\S]*follow: true/, 'legacy slug metadata should not compete in search while redirecting')
  assert.match(slugPageSource, /canonical: 'https:\/\/toolaze\.com\/model\/seedance-2'/, 'legacy slug canonical should point to the L2 model page')
  assert.doesNotMatch(slugPageSource, /permanentRedirect\(`\/model\/seedance-2\/\$\{[^}]+\}`\)/, 'Seedance L3 model workflow URLs should not become canonical targets')
  assert.match(legacySlugPageSource, /import \{ permanentRedirect \} from 'next\/navigation'/, 'legacy alias route should use a permanent redirect')
  assert.match(legacySlugPageSource, /\[\.\.\.new Set\(\[\.\.\.slugs, 'ai-video-generator'\]\)\]/, 'legacy alias route should generate the generic video slug')
  assert.match(legacySlugPageSource, /await params[\s\S]*permanentRedirect\('\/model\/seedance-2'\)/, 'legacy aliases should permanently redirect to the Seedance model page')
  assert.doesNotMatch(legacySlugPageSource, /permanentRedirect\(`\/model\/seedance-2\/\$\{[^}]+\}`\)/, 'legacy aliases should not redirect to Seedance L3 URLs')
  assert.match(allToolsSource, /permanentRedirect\('\/model\/seedance-2'\)/, 'Seedance all-tools alias should redirect to the model page')
  assert.doesNotMatch(allToolsSource, /ToolCard|\/model\/seedance-2\/\$\{slug\}/, 'Seedance all-tools should not emit model L3 workflow links')
})

test('AI video generator page main copy stays model agnostic', () => {
  const pageData = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const mainCopy = {
    metadata: pageData.metadata,
    hero: pageData.hero,
    modelIntro: pageData.modelIntro,
    howToUse: pageData.howToUse,
    promptExamples: pageData.promptExamples,
    scenesTitle: pageData.scenesTitle,
    scenes: pageData.scenes,
  }

  assert.doesNotMatch(
    JSON.stringify(mainCopy),
    /Seedance\s*2\.0|\/model\/seedance-2/i,
    'top-level AI Video Generator copy should not foreground a single video model'
  )
  assert.equal(pageData.modelIntro.modelName, 'AI Video Generator')
})

test('AI video generator page includes a model selection guide after settings', () => {
  const pageData = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const l2PageSource = readFileSync(l2PagePath, 'utf8')
  const settingsIndex = pageData.sectionsOrder.indexOf('performanceMetrics')
  const guideIndex = pageData.sectionsOrder.indexOf('modelSelectionGuide')
  const scenesIndex = pageData.sectionsOrder.indexOf('scenes')
  const guide = pageData.modelSelectionGuide

  assert.notEqual(settingsIndex, -1, 'AI Video Generator should keep the settings table')
  assert.notEqual(guideIndex, -1, 'AI Video Generator should include a model selection guide')
  assert.equal(guideIndex, settingsIndex + 1, 'model selection should follow the supported settings table')
  assert.ok(guideIndex < scenesIndex, 'model selection should appear before generic use cases')
  assert.equal(guide.title, 'AI Video Model Selection Guide')
  assert.deepEqual(
    guide.items.map((item) => item.title),
    ['Grok 1.5 Video', 'Seedance 2.0', 'Seedance 2.0 Mini', 'Kling 3.0']
  )
  assert.ok(
    guide.items.every((item) => item.badge && item.desc && item.prompt),
    'each model selection card should include a badge, decision copy, and choose-when guidance'
  )
  assert.match(l2PageSource, /modelSelectionGuide:[\s\S]*<StrategyCardGrid/, 'model selection guide should render through the shared card-grid section')
})

test('AI video generator page covers concrete user scenarios', () => {
  const pageData = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const scenes = pageData.scenes || []

  assert.equal(pageData.scenesTitle, 'Popular AI Video Generator Use Cases')
  assert.equal(scenes.length, 6, 'AI Video Generator should cover enough user scenarios for SEO depth')
  assert.deepEqual(
    scenes.map((scene) => scene.title),
    [
      'Social Media Shorts',
      'Product Ads and Ecommerce Motion',
      'Storyboards and Pre-Production Clips',
      'Explainer and Educational Videos',
      'Creator UGC and Promo Concepts',
      'Game, Character, and Concept Scenes',
    ]
  )
  assert.ok(
    scenes.every((scene) => /text prompt|image-to-video|durations|prompts|draft models|higher-control models|reference image/i.test(scene.desc)),
    'each use case should include workflow, input, setting, or model-selection guidance'
  )
})

test('AI video generator page uses the selected Grok history video as the hero demo', () => {
  const pageData = JSON.parse(readFileSync(aiVideoGeneratorDataPath, 'utf8'))
  const l2PageSource = readFileSync(l2PagePath, 'utf8')
  const sourceMeta = JSON.parse(readFileSync(aiVideoGeneratorDemoSourcePath, 'utf8'))

  assert.ok(existsSync(aiVideoGeneratorDemoPath), 'AI Video Generator Grok demo video should be a local public asset')
  assert.equal(
    pageData.heroDemoVideo?.src,
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ai-video-generator/ai-video-generator-grok-demo.mp4',
  )
  assert.match(pageData.heroDemoVideo?.ariaLabel || '', /Grok 1\.5 Video image-to-video demo/)
  assert.equal(sourceMeta.history.createdAt, '2026-07-21 12:31:57')
  assert.equal(sourceMeta.history.model, 'Grok 1.5 Video')
  assert.equal(sourceMeta.history.mode, 'Image to Video')
  assert.equal(sourceMeta.history.aspectRatio, 'auto')
  assert.equal(sourceMeta.history.duration, '5s')
  assert.equal(sourceMeta.history.resolution, '480p')
  assert.match(l2PageSource, /demoVideo=\{content\.heroDemoVideo/, 'AI Video Generator should pass the page demo video into the shared video tool')
})

test('Wan image-to-video follows the reference image aspect ratio instead of exposing manual ratio buttons', () => {
  const toolSource = readFileSync(componentPath, 'utf8')
  const configSource = readFileSync(configPath, 'utf8')

  assert.match(
    configSource,
    /imageToVideoAspectRatioMode\?: 'manual' \| 'reference-image'/,
    'model config should support image-to-video models whose output shape follows the reference image',
  )
  assert.match(
    configSource,
    /imageToVideoAspectRatioMode:\s*'reference-image'/,
    'Wan image-to-video models should be marked as following the uploaded reference image shape',
  )
  assert.match(
    toolSource,
    /const followsReferenceImageAspectRatio = activeMode === 'image-to-video' && modelConfig\.imageToVideoAspectRatioMode === 'reference-image'/,
    'the generator should detect reference-image aspect-ratio mode at render time',
  )
  assert.match(
    toolSource,
    /data-video-reference-aspect-ratio-note/,
    'the generator should render a read-only note instead of manual ratio buttons for this mode',
  )
  assert.match(toolSource, /Match Reference/)
  assert.match(toolSource, /disabled[\s\S]*\{text\.referenceImageAspectRatioLabel\}/)
})

test('desktop video history keeps long prompts scrollable above the reference image', () => {
  const toolSource = readFileSync(componentPath, 'utf8')
  const promptPreview = toolSource.match(/const renderPromptPreview = [\s\S]*?\n  \)/)?.[0] || ''
  const desktopHistoryRenderer = toolSource.match(/const renderDesktopVideoHistoryItem = [\s\S]*?\n  const renderDesktopVideoResultFeed/)?.[0] || ''

  assert.match(promptPreview, /max-h-\[6rem\]/, 'history prompts should be capped at four 1.5rem lines before scrolling')
  assert.match(promptPreview, /overflow-y-auto/, 'overflowing history prompts should scroll inside the prompt block')
  assert.match(desktopHistoryRenderer, /data-video-history-prompt-block/, 'desktop history should isolate prompt content in its own block')
  assert.match(desktopHistoryRenderer, /data-video-history-reference-image/, 'desktop history should render the reference image in a separate block')
  assert.ok(
    desktopHistoryRenderer.indexOf('data-video-history-prompt-block') < desktopHistoryRenderer.indexOf('data-video-history-reference-image'),
    'the reference image should be rendered below the prompt block',
  )
  assert.match(desktopHistoryRenderer, /lg:min-h-\[260px\]/, 'desktop history details should avoid fixed-height clipping that can overlap content')
})
