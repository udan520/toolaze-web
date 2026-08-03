import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'kling-3-motion-control'
const taskId = '2026-08-02-kling-3-motion-control'
const klingDemoVideo = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/56bb211041b34c5f8f27d3c0208322e7.png'
const seedance25DemoImage = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d0d55df5eef346809067197fddb1b251.png'
const supportedLocales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW']
const localizedLocales = supportedLocales.filter((locale) => locale !== 'en')
const seedance25Locales = supportedLocales

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function countOccurrences(source, value) {
  return source.split(value).length - 1
}

function extractConstBlock(source, constName) {
  const start = source.indexOf(`const ${constName}`)
  assert.notEqual(start, -1, `${constName} should exist`)
  const nextConst = source.indexOf('\n  const ', start + 1)
  return nextConst === -1 ? source.slice(start) : source.slice(start, nextConst)
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'defaultMode',
    'duration',
    'featuredColumn',
    'href',
    'icon',
    'iconType',
    'image',
    'layout',
    'logoAlt',
    'logoSrc',
    'media',
    'modelId',
    'poster',
    'published',
    'referenceImage',
    'sectionsOrder',
    'seoFactoryTaskId',
    'sourceHistory',
    'src',
    'topComponent',
    'video',
    'type',
    'width',
    'height',
  ])
  const key = path[path.length - 1]
  if (ignoredKeys.has(key)) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectVisibleStrings(item, [...path, String(index)]))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([entryKey, entryValue]) => collectVisibleStrings(entryValue, [...path, entryKey]))
  }
  return []
}

function collectVisibleEntries(value, path = []) {
  const ignoredKeys = new Set([
    'defaultMode',
    'duration',
    'featuredColumn',
    'href',
    'icon',
    'iconType',
    'image',
    'layout',
    'logoAlt',
    'logoSrc',
    'media',
    'modelId',
    'poster',
    'published',
    'referenceImage',
    'sectionsOrder',
    'seoFactoryTaskId',
    'sourceHistory',
    'src',
    'topComponent',
    'video',
    'type',
    'width',
    'height',
  ])
  const key = path[path.length - 1]
  if (ignoredKeys.has(key)) return []
  if (typeof value === 'string') return [{ path: path.join('.'), value }]
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectVisibleEntries(item, [...path, String(index)]))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([entryKey, entryValue]) => collectVisibleEntries(entryValue, [...path, entryKey]))
  }
  return []
}

function isAllowedSharedLocalizedString(value) {
  const normalized = value.replace(/<[^>]+>/g, '').trim()
  return (
    /^(Kling|Wan|Seedance|Maya Chen|Jordan Lee|Nina Patel|Toolaze)/.test(normalized) ||
    /^(JPEG|PNG|JPG|MP4|QuickTime|Reels|TikTok|Shorts|720p|1080p|4K|10MB|100MB)$/.test(normalized) ||
    /^[\d\s:.,+/\-–pKMB]+$/.test(normalized)
  )
}

test('Kling 3 Motion Control exposes localized model routes and hreflang alternates', () => {
  const englishRoutePath = join(root, 'src', 'app', 'model', slug, 'page.tsx')
  assert.ok(existsSync(englishRoutePath), 'English model route should exist')
  const englishRoute = readFileSync(englishRoutePath, 'utf8')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  const browserRedirect = readFileSync(join(root, 'src', 'lib', 'browser-locale-redirect.ts'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}':\\s*'${slug}'`), 'localized model route should expose Kling 3 Motion Control')
  assert.match(localizedRoute, /generateHreflangAlternates\(locale,\s*`\/model\/\$\{model\}`\)/, 'localized model metadata should advertise hreflang alternates')
  assert.match(englishRoute, /generateHreflangAlternates\('en',\s*`\/model\/\$\{slug\}`\)/, 'English route should advertise all localized hreflang alternates')
  assert.doesNotMatch(englishRoute, /languages:\s*\{\s*en:\s*canonical,?\s*\}/, 'localized launch should not advertise English-only alternates')
  assert.doesNotMatch(browserRedirect, new RegExp(`parts\\[1\\]===['"]${slug}['"]`), 'Browser locale redirect should allow localized Kling 3 Motion Control URLs')
})

test('Kling 3 Motion Control localized content is traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.status === 'ready_for_publish'))

  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.deepEqual(task.localeCoverage, supportedLocales)
  assert.match(task.releaseBoundary, /navigation/i)
  assert.match(task.releaseBoundary, /Footer/i)
  assert.match(task.releaseBoundary, /model hub/i)
  assert.match(task.releaseBoundary, /sitemap/i)
  assert.match(task.releaseBoundary, /localized content/i)
  assert.match(task.releaseBoundary, /hreflang/i)

  const localizedContent = Object.fromEntries(
    supportedLocales.map((locale) => [locale, readJson(join(root, 'src', 'data', locale, `${slug}.json`))])
  )

  for (const locale of supportedLocales) {
    const publicContent = localizedContent[locale]
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))
    assert.deepEqual(factoryContent, publicContent, `${locale} Factory content should match public data`)
    assert.ok(task.files.includes(`src/data/${locale}/${slug}.json`), `${locale} public data path should be tracked in SEO Factory task`)
    assert.ok(task.files.includes(`_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`), `${locale} Factory content path should be tracked in SEO Factory task`)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.equal(publicContent.topTool.modelId, 'kling-3-motion-control')
    assert.equal(publicContent.topTool.defaultMode, 'image-to-video')
    assert.match(publicContent.topTool.displayName, /Kling 3/)
    assert.equal(publicContent.heroDemoVideo?.src, klingDemoVideo)
    assert.equal(publicContent.heroDemoVideo?.width, 16)
    assert.equal(publicContent.heroDemoVideo?.height, 9)
    assert.deepEqual(
      publicContent.sectionsOrder,
      ['modelIntro', 'performanceMetrics', 'howToUse', 'scenes', 'modelComparison', 'competitorComparison', 'testimonials', 'faq'],
      `${locale} Kling 3 Motion Control should keep the approved 2.6-style SEO section order`
    )
    assert.equal(publicContent.promptExamples, undefined, `${locale} Motion Control rewrite should not render a standalone prompt examples section`)
    assert.equal(publicContent.troubleshooting, undefined, `${locale} Motion Control rewrite should not render a standalone prompt tips section`)
    assert.equal(publicContent.howToUse.steps.length, 4)
    assert.ok(!publicContent.sectionsOrder.includes('features'), `${locale} model page should not include a standalone Why Toolaze feature-card section`)
    assert.ok(!publicContent.sectionsOrder.includes('promptExamples'), `${locale} section order should remove prompt examples for this rewrite`)
    assert.ok(!publicContent.sectionsOrder.includes('troubleshooting'), `${locale} section order should remove prompt tips for this rewrite`)
    assert.equal(publicContent.features, undefined, `${locale} model page should not carry a standalone features section`)
    assert.ok(publicContent.modelIntro.title)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /720p/.test(`${item.value || ''}`)), `${locale} specs should show 720p support`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /1080p/.test(`${item.value || ''}`)), `${locale} specs should show 1080p support`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /3-10/.test(`${item.value || ''}`)), `${locale} specs should show Image orientation reference-video duration limits`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /3-30/.test(`${item.value || ''}`)), `${locale} specs should show Video orientation reference-video duration limits`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /JPEG.*PNG.*JPG|JPG.*JPEG.*PNG/.test(`${item.value || ''}`)), `${locale} specs should show provider-supported image formats`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /MP4.*QuickTime|QuickTime.*MP4/.test(`${item.value || ''}`)), `${locale} specs should show provider-supported motion video formats`)
    assert.ok(!publicContent.performanceMetrics.metrics.some((item) => /Matroska|WebM/i.test(`${item.value || ''}`)), `${locale} specs should not inherit unsupported 2.6/WebM video format copy`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /40.*54|54.*40/.test(`${item.value || ''}`)), `${locale} specs should show verified credit guidance`)
    assert.ok(publicContent.testimonials?.items?.length >= 3, `${locale} structure should include modest creator comments`)
    assert.ok(publicContent.modelComparison.rows.length >= 5, `${locale} same-family comparison should include decision rows`)
    assert.ok(publicContent.competitorComparison.rows.length >= 4, `${locale} cross-model comparison should include decision rows`)

    const visibleCopy = collectVisibleStrings(publicContent).join('\n')
    assert.doesNotMatch(
      visibleCopy,
      /model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder|KIE|API platform|provider route|No Signup|No Login|Unlimited Free|Free Forever/i,
      `${locale} visible copy should not expose SEO/editor/internal page language or unverified access claims`
    )
    assert.doesNotMatch(visibleCopy, /Why Use .* On Toolaze/i, `${locale} visible copy should not include the removed Why Toolaze block`)
  }

  const publicContent = localizedContent.en
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /720p.*1080p|1080p.*720p/i.test(`${item.value || ''}`)), 'specs should show Toolaze resolutions')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /3-10|3 to 10/i.test(`${item.value || ''}`)), 'specs should show Image orientation reference-video duration limits')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /3-30|3 to 30/i.test(`${item.value || ''}`)), 'specs should show Video orientation reference-video duration limits')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /Output duration follows/i.test(`${item.value || ''}`)), 'specs should show reference-video-derived output duration')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /JPEG.*PNG.*JPG|JPG.*JPEG.*PNG/i.test(`${item.value || ''}`)), 'specs should show provider-supported image formats')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /MP4.*QuickTime|QuickTime.*MP4/i.test(`${item.value || ''}`)), 'specs should show provider-supported motion video formats')
  assert.ok(!publicContent.performanceMetrics.metrics.some((item) => /Matroska|WebM/i.test(`${item.value || ''}`)), 'Kling 3.0 specs should not inherit unsupported 2.6/WebM video format copy')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /Image.*Video|Video.*Image/i.test(`${item.value || ''}`)), 'specs should show character orientation choices')
  assert.ok(publicContent.performanceMetrics.metrics.some((item) => /40.*54|54.*40/.test(`${item.value || ''}`)), 'specs should show verified KIE-derived credit guidance')
  assert.ok(publicContent.testimonials?.items?.length >= 3, '2.6-style SEO structure should include modest creator comments')
  assert.ok(publicContent.modelComparison.rows.length >= 5, 'same-family comparison should include decision rows')
  assert.ok(publicContent.competitorComparison.rows.length >= 4, 'cross-model comparison should include decision rows')

  const visibleCopy = collectVisibleStrings(publicContent).join('\n')
  assert.doesNotMatch(
    visibleCopy,
    /model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder|KIE|API platform|provider route|No Signup|No Login|Unlimited Free|Free Forever/i,
    'visible copy should not expose SEO/editor/internal page language or unverified access claims'
  )
  assert.doesNotMatch(visibleCopy, /Why Use .* On Toolaze/i, 'visible copy should not include the removed Why Toolaze block')
  assert.match(visibleCopy, /character image/i, 'copy should explain the required character image')
  assert.match(visibleCopy, /motion reference video/i, 'copy should explain the required motion reference video')
  assert.match(visibleCopy, /720p/i, 'copy should expose 720p support')
  assert.match(visibleCopy, /1080p/i, 'copy should expose 1080p support')
  assert.match(visibleCopy, /Prompt is optional|prompt is optional/i, 'copy should explain that media inputs are required and prompt is optional')
  assert.match(visibleCopy, /reference video duration|Output duration follows/i, 'copy should explain that duration follows the uploaded reference video')

  const englishVisibleStrings = new Set(collectVisibleStrings(publicContent).filter((value) => value.trim().length > 18))
  const englishResidue = /character image|motion reference video|output duration|Prompt is optional|AI Video Generator|What Is|How To Use|What You Can Create|Capability Snapshot|Decision Point|Good fit|What to check first|Prompt style|Reference guidance|When to choose another model|Creator Comments|Fashion motion draft|Product video planning|Avatar gesture test|Choose Kling|Upload a|Set quality|Credits scale/i
  for (const locale of localizedLocales) {
    assert.notEqual(localizedContent[locale].metadata.description, publicContent.metadata.description, `${locale} metadata should be localized`)
    assert.notEqual(localizedContent[locale].hero.desc, publicContent.hero.desc, `${locale} hero copy should be localized`)
    assert.notEqual(localizedContent[locale].faqTitle, publicContent.faqTitle, `${locale} FAQ title should be localized`)

    for (const entry of collectVisibleEntries(localizedContent[locale])) {
      assert.doesNotMatch(entry.value, englishResidue, `${locale} visible copy contains English residue at ${entry.path}: ${entry.value}`)
      if (englishVisibleStrings.has(entry.value) && !isAllowedSharedLocalizedString(entry.value)) {
        assert.fail(`${locale} visible copy reuses English at ${entry.path}: ${entry.value}`)
      }
    }
  }
})

test('Kling 3 Motion Control prompt tips render weak and better rewrites as separated rows', () => {
  const l2PageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')

  assert.match(l2PageContent, /function parsePromptRewrite/, 'prompt rewrite parser should exist')
  assert.match(l2PageContent, /Weak prompt\|Weak\|较差/, 'parser should support English and Chinese weak labels')
  assert.match(l2PageContent, /Better prompt\|Better\|较好/, 'parser should support English and Chinese better labels')
  assert.match(l2PageContent, /❌/, 'weak prompts should render with a clear negative icon')
  assert.match(l2PageContent, /✅/, 'better prompts should render with a clear positive icon')
  assert.match(l2PageContent, /border-t border-slate-200 pt-3/, 'better prompt should be visually separated from weak prompt')
})

test('Kling 3 Motion Control related video model cards respect explicit video media type for R2 keys ending in png', () => {
  const l2PageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')
  const wan27 = readJson(join(root, 'src', 'data', 'en', 'wan-2-7-ai-video-generator.json'))
  const wan27Factory = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', '2026-08-01-wan-2-7-ai-video-generator', 'content', 'en.json'))
  const seedance25 = readJson(join(root, 'src', 'data', 'en', 'seedance-2-5.json'))
  const kling3Motion = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  assert.equal(wan27.heroDemoVideo?.type, 'video', 'Wan 2.7 R2 png-key demo loads as video/mp4 and must render as video')
  assert.equal(wan27Factory.heroDemoVideo?.type, 'video', 'queued Wan 2.7 SEO Factory content must keep the same video media type')
  assert.equal(seedance25.heroDemoVideo?.type, 'video', 'Seedance 2.5 R2 png-key demo loads as video/mp4 and must render as video')
  assert.equal(kling3Motion.heroDemoVideo?.type, 'video', 'Kling 3 Motion Control R2 png-key demo loads as video/mp4 and must render as video')
  assert.match(l2PageContent, /function getHeroDemoMediaType/, 'related-card media should support explicit hero demo media types')
  assert.match(l2PageContent, /heroDemoVideo\.(type|mediaType)/, 'related-card media should not rely only on file extension inference')
  assert.doesNotMatch(
    l2PageContent,
    /type:\s*'video',\s*\n\s*src:\s*data\.heroDemoVideo\.src/,
    'hero demo media should not force every related card into a video tag'
  )
})

test('Seedance 2.5 related model card has demo media in every public locale', () => {
  for (const locale of seedance25Locales) {
    const content = readJson(join(root, 'src', 'data', locale, 'seedance-2-5.json'))
    assert.equal(content.heroDemoVideo?.src, seedance25DemoImage, `${locale} Seedance 2.5 should provide reusable top demo media`)
    assert.equal(content.heroDemoVideo?.width, 16, `${locale} Seedance 2.5 demo media should be 16:9 width metadata`)
    assert.equal(content.heroDemoVideo?.height, 9, `${locale} Seedance 2.5 demo media should be 16:9 height metadata`)
    assert.ok(content.heroDemoVideo?.ariaLabel?.trim(), `${locale} Seedance 2.5 demo media should have alt/aria copy`)
  }
})

test('Kling 3 Motion Control uses the real Toolaze model configuration and KIE-derived credit rates', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const credits = readFileSync(join(root, 'src', 'lib', 'generation-credits.ts'), 'utf8')
  const functionCredits = readFileSync(join(root, 'functions', '_shared', 'generation-credits.mjs'), 'utf8')
  const apiRoute = readFileSync(join(root, 'functions', 'api', 'ai-video-generator.js'), 'utf8')
  const generator = readFileSync(join(root, 'src', 'components', 'AiVideoGeneratorTool.tsx'), 'utf8')

  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*name:\s*'Kling 3 Motion Control'/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*supportedModes:\s*\['image-to-video'\]/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*maxVideos:\s*1/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*maxVideoFileSizeMb:\s*100/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*supportsMotionReferenceVideo:\s*true/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*durationMode:\s*'reference-video'/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*acceptedMotionVideoFormats:\s*\['MP4',\s*'QuickTime'\]/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*referenceImageAspectRatioMin:\s*2\s*\/\s*5/)
  assert.match(config, /id:\s*'kling-3-motion-control'[\s\S]*referenceImageAspectRatioMax:\s*5\s*\/\s*2/)
  assert.match(credits, /'kling-3-motion-control':\s*\{[\s\S]*Kie pricing: 720p \$0\.10\/output second, 1080p \$0\.135\/output second[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*40,\s*'1080p':\s*54\s*\}/)
  assert.match(functionCredits, /'kling-3-motion-control':\s*\{[\s\S]*Kie pricing: 720p \$0\.10\/output second, 1080p \$0\.135\/output second[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*40,\s*'1080p':\s*54\s*\}/)
  assert.match(apiRoute, /'kling-3-motion-control':\s*\{[\s\S]*fallbackProviderModel:\s*'kling-3\.0\/motion-control'/)
  assert.match(apiRoute, /'kling-3-motion-control':\s*\{[\s\S]*inputSchema:\s*'kling-motion-control'/)
  assert.match(apiRoute, /input_urls:\s*imageUrls\.slice\(0, 1\)[\s\S]*video_urls:\s*videoUrls\.slice\(0, 1\)[\s\S]*character_orientation/)
  assert.match(generator, /MotionReferenceVideoUploader/, 'motion reference video should use previewable uploader')
  assert.match(generator, /data-character-orientation/, 'motion-control generator should show character orientation control')
  assert.match(generator, /modelConfig\.durationMode === 'reference-video'/, 'reference-video duration mode should hide the manual duration selector')
  assert.doesNotMatch(generator, /formData\.append\('characterOrientation', 'image'\)/, 'character orientation should not be hard-coded to image')
})

test('Kling 3 Motion Control public entry points stay on model surfaces', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const aiToolsCopy = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')
  const homePage = readFileSync(join(root, 'src', 'components', 'home', 'HomePageMain.tsx'), 'utf8')
  const modelHub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')
  const l2PageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')
  const breadcrumb = readFileSync(join(root, 'src', 'components', 'Breadcrumb.tsx'), 'utf8')
  const aiVideoToolMenu = extractConstBlock(navigation, 'AI_VIDEO_TOOL_MENU_ITEMS')
  const aiVideoModelMenu = extractConstBlock(navigation, 'AI_VIDEO_MODEL_MENU_ITEMS')
  const promptMenuGroups = extractConstBlock(navigation, 'promptMenuGroups')
  const desktopPromptMenuStart = navigation.indexOf("toggleDesktopMenu('prompts')")
  assert.notEqual(desktopPromptMenuStart, -1, 'desktop Prompts menu should exist')
  const desktopPromptMenuEnd = navigation.indexOf('{promptMenuGroups.map', desktopPromptMenuStart)
  assert.notEqual(desktopPromptMenuEnd, -1, 'desktop Prompts menu should render prompt groups')
  const desktopPromptMenuIntro = navigation.slice(desktopPromptMenuStart, desktopPromptMenuEnd)

  assert.match(aiVideoToolMenu, /\/ai-asmr-video-generator/, 'AI Video tool dropdown should keep AI ASMR Video Generator')
  assert.match(aiVideoModelMenu, new RegExp(`/model/${slug}`), 'AI Video model dropdown should include Kling 3 Motion Control')
  assert.doesNotMatch(desktopPromptMenuIntro, /\/ai-asmr-video-generator/, 'Prompts dropdown should not include generator landing pages such as AI ASMR Video Generator')
  for (const href of [
    '/model/kling-3-motion-control',
    '/model/wan-2-7-ai-video-generator',
    '/model/wan-2-6-ai-video-generator',
    '/model/wan-2-5-ai-video-generator',
    '/model/seedance-2-5',
    '/model/kling-2-6-pro-motion-control',
  ]) {
    assert.doesNotMatch(promptMenuGroups, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'Prompts model menu should only include models with prompt-library pages')
  }
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
  assert.doesNotMatch(aiToolsCopy, new RegExp(`href:\\s*['"]/model/${slug}['"]`), 'model pages should stay out of AI Tools Hub cards')
  assert.doesNotMatch(homePage, new RegExp(`loadToolData\\(\\s*['"]${slug}['"]`), 'model pages should stay out of homepage tool cards')
  assert.match(modelHub, new RegExp(`'kling-3-motion-control':\\s*'/model/${slug}'`))
  assert.match(sitemap, new RegExp(`['"]${slug}['"]`))
  assert.match(sitemap, new RegExp(`LOCALIZED_MODEL_SLUGS = \\[[^\\]]*'${slug}'`), 'sitemap should include localized Kling 3 Motion Control model URLs')
  assert.match(seoLoader, new RegExp(`VIDEO_MODEL_L2S = \\[[^\\]]*'${slug}'`))
  assert.match(seoLoader, new RegExp(`importL2FlatJson\\('${slug}'`))
  assert.match(l2PageContent, new RegExp(`'${slug}':\\s*'kling-3-motion-control'`))
  assert.match(breadcrumb, new RegExp(`/model/${slug}`))

  const common = readJson(join(root, 'src', 'data', 'en', 'common.json'))
  assert.ok(common.nav.kling3MotionControl, 'English nav.kling3MotionControl should exist')
  assert.ok(common.footer.kling3MotionControl, 'English footer.kling3MotionControl should exist')
})
