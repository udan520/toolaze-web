import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'wan-2-7-ai-video-generator'
const taskId = '2026-08-01-wan-2-7-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const wan27DemoVideo = 'https://assets.toolaze.com/uploads/c07d1db481dd4e9b8e190ebb39611f08.png'
const wan27DemoPoster = 'https://assets.toolaze.com/uploads/6e2548965fc5487ca41221f9d663dfcb.webp'
const relatedVideoR2Assets = new Set([
  'https://assets.toolaze.com/uploads/d0d55df5eef346809067197fddb1b251.png',
  'https://assets.toolaze.com/uploads/56bb211041b34c5f8f27d3c0208322e7.png',
])
const r2UrlPattern = /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/.+/i

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function countOccurrences(source, value) {
  return source.split(value).length - 1
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'defaultMode',
    'featuredColumn',
    'href',
    'icon',
    'iconType',
    'in_menu',
    'layout',
    'logoAlt',
    'logoSrc',
    'mode',
    'modelId',
    'poster',
    'published',
    'sectionsOrder',
    'seoFactoryTaskId',
    'sourceHistory',
    'src',
    'topComponent',
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

function collectCopyablePrompts(content) {
  return [
    ...(content.promptExamples?.items || []).map((item, index) => [`promptExamples.items[${index}].prompt`, item.prompt]),
    ...(content.troubleshooting?.items || []).map((item, index) => [`troubleshooting.items[${index}].prompt`, item.prompt]),
  ].filter(([, prompt]) => typeof prompt === 'string')
}

test('Wan 2.7 model page exposes English and localized model routes', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')), 'English model route should exist')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}'`), 'localized model route should map the Wan 2.7 slug')
})

test('Wan 2.7 content is published for every supported locale and traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.status === 'ready_for_publish'))
  assert.match(wan27DemoVideo, r2UrlPattern, 'Wan 2.7 demo video should use R2 before publishing')
  assert.match(wan27DemoPoster, r2UrlPattern, 'Wan 2.7 demo poster should use R2 before publishing')

  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.match(task.releaseBoundary, /navigation/i)
  assert.match(task.releaseBoundary, /Footer/i)
  assert.match(task.releaseBoundary, /AI Tools/i)
  assert.match(task.releaseBoundary, /sitemap/i)

  const englishContent = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  for (const locale of locales) {
    const publicContent = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))

    assert.deepEqual(factoryContent, publicContent, `${locale} Factory content should match public data`)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.equal(publicContent.topTool.modelId, 'wan-2-7')
    assert.equal(publicContent.heroDemoVideo?.src, wan27DemoVideo)
    assert.equal(publicContent.heroDemoVideo?.poster, wan27DemoPoster)
    assert.equal(publicContent.heroDemoVideo?.width, 16)
    assert.equal(publicContent.heroDemoVideo?.height, 9)
    assert.equal(publicContent.heroDemoVideo?.duration, 'PT5.01S')
    assert.match(publicContent.heroDemoVideo?.sourceHistory || '', /User-provided Wan 2\.7 demo video · 16:9 · 5\.01s · 1920x1080/)
    assert.equal(publicContent.promptExamples.items.length, 4)
    assert.equal(publicContent.howToUse.steps.length, 4)
    assert.ok(publicContent.modelIntro.title)
    assert.ok(publicContent.workflowComparison.rows.length >= 4)
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /\bworkflow\b|model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder|KIE|API platform|No Signup|No Login|Unlimited Free|Free Forever/i,
      `${locale} visible copy should not expose SEO/editor/internal page language or unverified access claims`
    )
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /Wan-2\.5-Video|Wan 2\.5 video of a night market/i,
      `${locale} visible copy should not carry stale Wan 2.5 prompt text on the Wan 2.7 page`
    )
    if (locale !== 'en') {
      assert.doesNotMatch(
        collectVisibleStrings(publicContent).join('\n'),
        /AI Video Generator|AI Video Model|\bcredits\b|model availability|\bProvider\b|Text-to-video|Image-to-video/i,
        `${locale} visible copy should not leave common English fallback terms`
      )
      assert.notEqual(publicContent.metadata.title, englishContent.metadata.title, `${locale} metadata title should be localized`)
      assert.notEqual(publicContent.hero.desc, englishContent.hero.desc, `${locale} hero description should be localized`)
      assert.notEqual(publicContent.modelIntro.title, englishContent.modelIntro.title, `${locale} intro title should be localized`)
      assert.notEqual(publicContent.promptExamples.title, englishContent.promptExamples.title, `${locale} prompt section title should be localized`)
      assert.notEqual(publicContent.howToUse.title, englishContent.howToUse.title, `${locale} how-to title should be localized`)
      assert.notEqual(publicContent.faqTitle, englishContent.faqTitle, `${locale} FAQ title should be localized`)
      assert.notEqual(publicContent.moreTools, englishContent.moreTools, `${locale} related model section title should be localized`)
    }
  }
})

test('Wan 2.7 copyable prompts keep UI-selected ratio and duration out of the prompt text', () => {
  const uiSelectedParameterPattern =
    /\b\d+\s*:\s*\d+\b|\b\d+\s*-?\s*(?:second(?:s)?|segundos?|secondes?|secondi|sekündig(?:e[snm]?|es)?)\b|\b\d+\s*-?\s*(?:秒|초)/i

  for (const locale of locales) {
    const content = readJson(join(root, 'src', 'data', locale, `${slug}.json`))

    for (const [promptPath, prompt] of collectCopyablePrompts(content)) {
      assert.doesNotMatch(
        prompt,
        uiSelectedParameterPattern,
        `${locale} ${promptPath} should not put aspect ratio or generation duration in copyable prompt text`
      )
    }
  }
})

test('Wan 2.7 SEO sections follow the conversion-first order without duplicate use-case blocks', () => {
  const expectedEnglishOrder = [
    'modelIntro',
    'performanceMetrics',
    'howToUse',
    'promptExamples',
    'troubleshooting',
    'scenes',
    'modelComparison',
    'workflowComparison',
    'testimonials',
    'faq',
  ]

  for (const locale of locales) {
    const content = readJson(join(root, 'src', 'data', locale, `${slug}.json`))

    assert.deepEqual(content.sectionsOrder, expectedEnglishOrder, `${locale} should use the translated final SEO + conversion order`)
    assert.equal(content.sectionsOrder.includes('modelSelectionGuide'), false, `${locale} should not render the compact specs bar`)
    assert.equal('modelSelectionGuide' in content, false, `${locale} should remove the compact specs data`)
    assert.equal('featureCards' in content.modelIntro, false, `${locale} should not render duplicate intro feature cards`)
    assert.equal(content.scenes.length, 6, `${locale} should keep the single expanded use-case block`)
    assert.ok(content.modelComparison?.subtitle, `${locale} same-family Wan comparison should explain the choice criteria`)
    assert.equal(content.modelComparison?.featuredColumn, 'baseline', `${locale} same-family comparison should highlight the leftmost Wan 2.7 column`)
    assert.equal(content.modelComparison?.columnHeaders?.baseline, 'Wan 2.7', `${locale} same-family comparison should place Wan 2.7 in the leftmost column`)
    assert.equal(content.modelComparison?.columnHeaders?.middle, 'Wan 2.6', `${locale} same-family comparison should split Wan 2.6 into its own column`)
    assert.equal(content.modelComparison?.columnHeaders?.target, 'Wan 2.5', `${locale} same-family comparison should place Wan 2.5 after newer Wan options`)
    assert.ok(content.modelComparison?.rows?.length >= 6, `${locale} should include decision-useful same-family Wan comparison rows`)
    assert.ok(content.modelComparison.rows.every((row) => row.baseline && row.middle && row.target), `${locale} each same-family comparison row should compare all three Wan versions`)
    assert.equal(content.sectionsOrder.includes('features'), false, `${locale} should not render the generic Toolaze feature block`)
    assert.equal(content.sectionsOrder.includes('performanceMetrics'), true, `${locale} should render the official capability snapshot after the intro`)
    assert.ok(content.performanceMetrics?.title, `${locale} capability snapshot should have a localized title`)
    assert.ok(content.performanceMetrics?.metrics?.length >= 7, `${locale} capability snapshot should include official Wan 2.7 capability rows`)
    assert.equal(content.sectionsOrder.includes('testimonials'), true, `${locale} should include user comments before FAQ`)
    assert.equal(content.testimonials?.items?.length, 3, `${locale} should include three practical testimonials`)
    if (locale === 'en') {
      assert.match(content.performanceMetrics?.title || '', /Capability Snapshot/)
      assert.ok(
        content.troubleshooting?.items?.every((item) => /Weak prompt:/i.test(item.desc || '') && item.prompt),
        `${locale} prompt tips should include weak and stronger prompt rewrites`
      )
    } else {
      assert.notEqual(content.performanceMetrics?.title, 'Wan 2.7 Capability Snapshot', `${locale} capability snapshot title should be localized`)
      assert.notEqual(content.testimonials?.title, 'Creator Notes on Wan 2.7', `${locale} testimonials title should be localized`)
    }
    assert.ok(content.workflowComparison?.rows?.length >= 4, `${locale} should keep a cross-model comparison`)
    assert.doesNotMatch(
      JSON.stringify(content.workflowComparison),
      /Wan 2\.6|Wan 2\.5/i,
      `${locale} cross-model comparison should not repeat same-family Wan models`
    )
    assert.ok(
      content.sectionsOrder.indexOf('howToUse') < content.sectionsOrder.indexOf('promptExamples'),
      `${locale} how-to should appear before prompt examples`
    )
    assert.ok(
      content.sectionsOrder.indexOf('workflowComparison') < content.sectionsOrder.indexOf('faq'),
      `${locale} cross-model comparison should appear before FAQ`
    )
    assert.ok(Array.isArray(content.moreToolsLinks), `${locale} should define related video model cards`)
    assert.ok(content.moreToolsLinks.length >= 3, `${locale} should keep related video model cards`)
    assert.ok(
      content.moreToolsLinks.every((item) => item.media?.src && (item.media.type === 'image' || item.media.type === 'video')),
      `${locale} each related video model card should render demo image or video media`
    )
    for (const item of content.moreToolsLinks) {
      assert.ok(item.media?.alt, `${locale} ${item.title} related model media should include accessible alt text`)
      if (relatedVideoR2Assets.has(item.media.src)) {
        assert.equal(
          item.media.type,
          'video',
          `${locale} ${item.title} related model media should render the R2 demo as video, not a broken image`
        )
      }
    }
  }
})

test('Wan 2.7 production release media can be gated to R2 URLs', { skip: process.env.TOOLAZE_RELEASE_CHECK === '1' ? false : 'Set TOOLAZE_RELEASE_CHECK=1 before publishing Wan 2.7' }, () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const aiToolsCopy = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')

  assert.match(content.heroDemoVideo.src, r2UrlPattern, 'Wan 2.7 hero demo video should use an R2 URL before production release')
  assert.match(content.heroDemoVideo.poster, r2UrlPattern, 'Wan 2.7 hero demo poster should use an R2 URL before production release')
  for (const item of content.moreToolsLinks) {
    assert.match(item.media.src, r2UrlPattern, `${item.title} related model media should use an R2 URL before production release`)
  }
  assert.doesNotMatch(aiToolsCopy, /\/model-assets\/wan-2-7-ai-video-generator\//, 'AI Tools Wan 2.7 card should not ship local Wan 2.7 demo assets')
})

test('Wan 2.7 same-family comparison uses concrete Toolaze differences', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const modelComparisonText = JSON.stringify(content.modelComparison)

  assert.match(modelComparisonText, /up to five total image or video references/i)
  assert.match(modelComparisonText, /5, 10, or 15 seconds/i)
  assert.match(modelComparisonText, /2 to 15 seconds/i)
  assert.match(modelComparisonText, /Audio-video synchronization/i)
  assert.match(modelComparisonText, /First-frame, first-and-last-frame, video continuation/i)
  assert.match(modelComparisonText, /Starts at 120 Credits/)
  assert.match(modelComparisonText, /Starts at 140 Credits/)
  assert.match(modelComparisonText, /Starts at 64 Credits/)
})

test('Wan 2.7 public entry points are wired into navigation, footer, hubs, sitemap, and language data', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const aiToolsCopy = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')
  const modelCopy = readFileSync(join(root, 'src', 'app', 'model', 'copy.ts'), 'utf8')
  const modelHub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')

  assert.equal(countOccurrences(navigation, `/model/${slug}`), 1, 'Navigation should include the AI Video model menu')
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
  assert.match(aiToolsCopy, new RegExp(`href:\\s*['"]/model/${slug}['"]`))
  assert.match(aiToolsCopy, new RegExp(`wan27Video:[\\s\\S]*['"]${wan27DemoPoster.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`))
  assert.match(aiToolsCopy, new RegExp(`wan27Video:[\\s\\S]*['"]${wan27DemoVideo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`))
  assert.match(modelCopy, new RegExp(`href:\\s*['"]/model/${slug}['"]`))
  assert.match(modelHub, new RegExp(`'wan-2-7':\\s*'/model/${slug}'`))
  assert.match(sitemap, new RegExp(`['"]${slug}['"]`))
  assert.match(languageSwitch, new RegExp(`'${slug}': ALL_LOCALE_CODES`))
  assert.match(seoLoader, new RegExp(`importL2FlatJson\\('${slug}'`))

  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.ok(common.nav.wan27Video, `${locale} nav.wan27Video should exist`)
    assert.ok(common.footer.wan27Video, `${locale} footer.wan27Video should exist`)
  }
})

test('Wan 2.7 keeps current Toolaze settings while English copy follows official Wan 2.7 capabilities', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const credits = readFileSync(join(root, 'src', 'lib', 'generation-credits.ts'), 'utf8')
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  assert.match(config, /id:\s*'wan-2-7'[\s\S]*durations:\s*Array\.from\(\{\s*length:\s*9\s*\},\s*\(_,\s*index\)\s*=>\s*index\s*\+\s*2\)/)
  assert.match(config, /id:\s*'wan-2-7'[\s\S]*resolutions:\s*\['720p',\s*'1080p'\]/)
  assert.match(config, /id:\s*'wan-2-7'[\s\S]*maxImages:\s*2/)
  assert.match(credits, /'wan-2-7':\s*\{[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*32,\s*'1080p':\s*48\s*\}/)
  assert.ok(
    content.faq.some((item) => /Toolaze Credits/i.test(item.q) && /64 Credits/.test(item.a)),
    'FAQ should keep the Toolaze Credits guidance'
  )
  const visibleCopy = collectVisibleStrings(content).join('\n')
  assert.match(visibleCopy, /reference-to-video/i)
  assert.match(visibleCopy, /first-and-last-frame/i)
  assert.match(visibleCopy, /video continuation/i)
  assert.match(visibleCopy, /audio-video synchronization/i)
  assert.match(visibleCopy, /2 to 15 second/i)
})
