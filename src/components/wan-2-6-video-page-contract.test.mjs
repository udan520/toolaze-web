import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'wan-2-6-ai-video-generator'
const taskId = '2026-08-03-wan-2-6-ai-video-generator'

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

test('Wan 2.6 model page exposes English route and localized redirect mapping', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')), 'English model route should exist')
  const englishRoute = readFileSync(join(root, 'src', 'app', 'model', slug, 'page.tsx'), 'utf8')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}'`), 'localized model route should map the Wan 2.6 slug')
  assert.match(englishRoute, /languages:\s*\{\s*en:\s*canonical\s*\}/, 'English-only route should expose only the English hreflang alternate')
  assert.doesNotMatch(englishRoute, /generateHreflangAlternates/, 'English-only route should not generate localized hreflang alternates')
})

test('Wan 2.6 English content is published and traceable to SEO Factory', () => {
  const publicContent = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', 'en.json'))
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))

  assert.ok(queue.tasks.some((item) => item.taskId === taskId && item.slug === slug && item.status === 'ready_for_publish'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.deepEqual(factoryContent, publicContent, 'Factory English content should match public English data')
  assert.equal(publicContent.seoFactoryTaskId, taskId)
  assert.equal(publicContent.metadata.published, true)
  assert.equal(publicContent.topComponent, slug)
  assert.equal(publicContent.topTool.modelId, 'wan-2-6')
  assert.equal(publicContent.topTool.defaultMode, 'text-to-video')
  assert.equal(publicContent.promptExamples.items.length, 4)
  assert.equal(publicContent.howToUse.steps.length, 4)
  assert.equal(publicContent.testimonials.items.length, 3)
  assert.ok(publicContent.performanceMetrics.metrics.length >= 7)
  assert.ok(publicContent.modelComparison.rows.length >= 6)
  assert.ok(publicContent.workflowComparison.rows.length >= 4)
  assert.ok(publicContent.faq.length >= 10)
  assert.doesNotMatch(
    collectVisibleStrings(publicContent).join('\n'),
    /\bworkflow\b|model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder|KIE|API platform|No Signup|No Login|Unlimited Free|Free Forever|Toolaze marks|Toolaze marked|marks Wan|marked Wan|Toolaze supports Wan/i,
    'English visible copy should not expose SEO/editor/internal page language or unverified access claims',
  )
})

test('Wan 2.6 copyable prompts keep UI-selected ratio and duration out of the prompt text', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const uiSelectedParameterPattern = /\b\d+\s*:\s*\d+\b|\b\d+\s*-?\s*second(?:s)?\b/i

  for (const [promptPath, prompt] of collectCopyablePrompts(content)) {
    assert.doesNotMatch(
      prompt,
      uiSelectedParameterPattern,
      `${promptPath} should not put aspect ratio or generation duration in copyable prompt text`,
    )
  }
})

test('Wan 2.6 SEO sections follow model-page order and leftmost comparison', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const expectedOrder = [
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

  assert.deepEqual(content.sectionsOrder, expectedOrder)
  assert.equal(content.sectionsOrder.includes('features'), false)
  assert.equal(content.modelComparison.featuredColumn, 'baseline')
  assert.equal(content.modelComparison.columnHeaders.baseline, 'Wan 2.6')
  assert.equal(content.modelComparison.columnHeaders.middle, 'Wan 2.7')
  assert.equal(content.modelComparison.columnHeaders.target, 'Wan 2.5')
  assert.ok(
    content.troubleshooting.items.every((item) => /Weak prompt:/i.test(item.desc || '') && item.prompt),
    'Prompt tips should include weak and stronger prompt rewrites',
  )
  assert.deepEqual(
    content.scenes.map((scene) => scene.icon),
    ['🛍️', '🖼️', '🎧', '📱', '🎥', '🎬'],
    'Wan 2.6 use-case cards should use visual icons instead of text abbreviations',
  )
  assert.doesNotMatch(JSON.stringify(content.workflowComparison), /Wan 2\.7|Wan 2\.5/i)
})

test('Wan 2.6 public entry points are wired for an English-only model launch', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const modelHub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')
  const toolContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')
  const common = readJson(join(root, 'src', 'data', 'en', 'common.json'))

  assert.equal(countOccurrences(navigation, `/model/${slug}`), 2, 'Navigation should include the video model menu and Prompts model links')
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
  assert.match(modelHub, new RegExp(`'wan-2-6':\\s*'/model/${slug}'`))
  assert.match(sitemap, new RegExp(`['"]${slug}['"]`))
  assert.doesNotMatch(sitemap, new RegExp(`LOCALIZED_MODEL_SLUGS[\\s\\S]*['"]${slug}['"]`), 'English-only page should not enter localized sitemap slugs')
  assert.match(languageSwitch, new RegExp(`'${slug}':\\s*\\['en'\\]`))
  assert.match(seoLoader, new RegExp(`importL2FlatJson\\('${slug}'`))
  assert.match(toolContent, new RegExp(`'${slug}':\\s*'wan-2-6'`))
  assert.ok(common.nav.wan26Video, 'English nav.wan26Video should exist')
  assert.ok(common.footer.wan26Video, 'English footer.wan26Video should exist')
})

test('Wan 2.6 uses current Toolaze video settings and credit math', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const credits = readFileSync(join(root, 'src', 'lib', 'generation-credits.ts'), 'utf8')
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  assert.match(config, /'wan-2-6', 'Wan 2\.6', 140, \[5, 10, 15\], \['720p', '1080p'\]/)
  assert.match(credits, /'wan-2-6':\s*\{[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*28,\s*'1080p':\s*42\s*\}/)
  assert.equal(content.performanceMetrics.metrics.find((metric) => metric.label === 'Duration')?.value, '5, 10, or 15 seconds')
  assert.equal(content.performanceMetrics.metrics.find((metric) => metric.label === 'Resolution')?.value, '720p or 1080p')
  assert.ok(
    content.faq.some((item) => /Toolaze Credits/i.test(item.q) && /140 Credits/.test(item.a)),
    'FAQ should keep the Toolaze Credits guidance',
  )
})
