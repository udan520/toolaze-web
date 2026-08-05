import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'wan-2-6-ai-video-generator'
const taskId = '2026-08-03-wan-2-6-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function countOccurrences(source, value) {
  return source.split(value).length - 1
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'avatar',
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

test('Wan 2.6 model page exposes English route and localized hreflang mapping', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')), 'English model route should exist')
  const englishRoute = readFileSync(join(root, 'src', 'app', 'model', slug, 'page.tsx'), 'utf8')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}'`), 'localized model route should map the Wan 2.6 slug')
  assert.match(englishRoute, /generateHreflangAlternates/, 'English route should generate localized hreflang alternates')
  assert.doesNotMatch(englishRoute, /languages:\s*\{\s*en:\s*canonical\s*\}/, 'Localized route should not be limited to English hreflang only')
})

test('Wan 2.6 localized content is published and traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  const englishContent = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  assert.ok(queue.tasks.some((item) => item.taskId === taskId && item.slug === slug && item.status === 'ready_for_publish'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.deepEqual(task.localeCoverage, locales)

  for (const locale of locales) {
    const publicContent = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))

    assert.deepEqual(factoryContent, publicContent, `${locale} Factory content should match public data`)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.equal(publicContent.topTool.modelId, 'wan-2-6')
    assert.equal(publicContent.topTool.defaultMode, 'text-to-video')
    assert.deepEqual(
      publicContent.sectionsOrder,
      [
        'modelIntro',
        'performanceMetrics',
        'howToUse',
        'promptExamples',
        'troubleshooting',
        'modelComparison',
        'testimonials',
        'faq',
      ],
      `${locale} Wan 2.6 should omit the low-value use-case card section`,
    )
    assert.equal(publicContent.promptExamples.items.length, 4, `${locale} Wan 2.6 should keep four prompt examples`)
    assert.equal(publicContent.troubleshooting.items.length, 3, `${locale} Wan 2.6 should keep three prompt tips`)
    assert.equal(publicContent.workflowComparison, undefined, `${locale} compact Wan 2.6 should remove cross-model comparison`)
    assert.equal(publicContent.howToUse.steps.length, 4)
    assert.equal(publicContent.scenesTitle, undefined, `${locale} Wan 2.6 should remove the use-case section title`)
    assert.equal(publicContent.scenes, undefined, `${locale} Wan 2.6 should remove the six-card use-case section`)
    assert.equal(publicContent.testimonials.maxItems, 3, `${locale} Wan 2.6 should render three testimonial cards`)
    assert.equal(publicContent.testimonials.showStars, false, `${locale} Wan 2.6 should avoid fake star ratings`)
    assert.equal(publicContent.testimonials.showAvatars, true, `${locale} Wan 2.6 should use line-drawn character avatars`)
    assert.equal(publicContent.testimonials.items.length, 3, `${locale} Wan 2.6 should include three focused testimonials`)
    assert.equal(new Set(publicContent.testimonials.items.map((item) => item.avatar)).size, 3, `${locale} Wan 2.6 testimonials should use distinct non-human avatar variants`)
    assert.equal(new Set(publicContent.testimonials.items.map((item) => item.role)).size, 3, `${locale} Wan 2.6 testimonials should cover distinct creator roles`)
    assert.ok(publicContent.performanceMetrics.metrics.length >= 7)
    assert.ok(publicContent.modelComparison.rows.length >= 5)
    assert.ok(publicContent.faq.length >= 8)
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /\bworkflow\b|model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder|KIE|API platform|No Signup|No Login|Unlimited Free|Free Forever|Toolaze marks|Toolaze marked|marks Wan|marked Wan|Toolaze supports Wan|Creator Notes|Six practical notes/i,
      `${locale} visible copy should not expose SEO/editor/internal page language or unverified access claims`,
    )
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /Wan 2\.7|\b2\.7\b|first\/last|higher-control|middle Wan/i,
      `${locale} Wan 2.6 visible copy should not mention higher Wan versions`,
    )
    if (locale === 'en') {
      assert.ok(
        publicContent.testimonials.items.every((item) => item.quote.split(/\s+/).length >= 28),
        'English Wan 2.6 testimonials should read like specific user notes, not short generic blurbs',
      )
    } else {
      assert.notEqual(publicContent.metadata.title, englishContent.metadata.title, `${locale} metadata title should be localized`)
      assert.notEqual(publicContent.hero.desc, englishContent.hero.desc, `${locale} hero description should be localized`)
      assert.notEqual(publicContent.testimonials.title, englishContent.testimonials.title, `${locale} testimonials title should be localized`)
    }
  }
})

test('Wan 2.6 review-cut page keeps focused copyable prompt sections', () => {
  for (const locale of locales) {
    const content = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    assert.equal(collectCopyablePrompts(content).length, 7, `${locale} Wan 2.6 should expose four examples and three prompt tips`)
  }
})

test('Wan 2.6 SEO sections follow review-cut page order and leftmost comparison', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const expectedOrder = [
    'modelIntro',
    'performanceMetrics',
    'howToUse',
    'promptExamples',
    'troubleshooting',
    'modelComparison',
    'testimonials',
    'faq',
  ]

  assert.deepEqual(content.sectionsOrder, expectedOrder)
  assert.equal(content.sectionsOrder.includes('features'), false)
  assert.equal(content.sectionsOrder.includes('scenes'), false)
  assert.equal(content.scenesTitle, undefined)
  assert.equal(content.scenes, undefined)
  assert.equal(content.modelComparison.featuredColumn, 'baseline')
  assert.equal(content.modelComparison.columnHeaders.baseline, 'Wan 2.6')
  assert.equal(content.modelComparison.columnHeaders.middle, undefined)
  assert.equal(content.modelComparison.columnHeaders.target, 'Wan 2.5')
  assert.equal(content.promptExamples.items.length, 4)
  assert.equal(content.troubleshooting.items.length, 3)
  assert.equal(content.workflowComparison, undefined)
})

test('Wan 2.6 public entry points are wired for all localized model pages', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const modelHub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')
  const toolContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')

  assert.equal(countOccurrences(navigation, `/model/${slug}`), 1, 'Navigation should include the AI Video model menu')
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
  assert.match(modelHub, new RegExp(`'wan-2-6':\\s*'/model/${slug}'`))
  assert.match(sitemap, new RegExp(`['"]${slug}['"]`))
  assert.match(sitemap, new RegExp(`LOCALIZED_MODEL_SLUGS[\\s\\S]*['"]${slug}['"]`), 'Localized page should enter localized sitemap slugs')
  assert.match(languageSwitch, new RegExp(`'${slug}': ALL_LOCALE_CODES`))
  assert.match(seoLoader, new RegExp(`importL2FlatJson\\('${slug}'`))
  assert.match(toolContent, new RegExp(`'${slug}':\\s*'wan-2-6'`))
  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.ok(common.nav.wan26Video, `${locale} nav.wan26Video should exist`)
    assert.ok(common.footer.wan26Video, `${locale} footer.wan26Video should exist`)
  }
})

test('Wan 2.6 uses current Toolaze video settings and credit math', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const credits = readFileSync(join(root, 'src', 'lib', 'generation-credits.ts'), 'utf8')
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  assert.match(config, /'wan-2-6', 'Wan 2\.6', 140, \[5, 10, 15\], \['720p', '1080p'\]/)
  assert.match(credits, /'wan-2-6':\s*\{[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*28,\s*'1080p':\s*42\s*\}/)
  assert.match(content.performanceMetrics.metrics.find((metric) => metric.label === 'Duration')?.value || '', /5, 10, or 15 seconds/)
  assert.match(content.performanceMetrics.metrics.find((metric) => metric.label === 'Resolution')?.value || '', /720p or 1080p/)
  assert.ok(
    content.faq.some((item) => /Toolaze Credits/i.test(item.q) && /140 Credits/.test(item.a)),
    'FAQ should keep the Toolaze Credits guidance',
  )
})
