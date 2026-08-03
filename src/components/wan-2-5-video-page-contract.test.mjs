import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'wan-2-5-ai-video-generator'
const taskId = '2026-07-30-wan-2-5-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function countOccurrences(source, value) {
  return source.split(value).length - 1
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'defaultMode',
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

test('Wan 2.5 model page exposes English and localized model routes', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')), 'English model route should exist')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}'`), 'localized model route should map the Wan 2.5 slug')
})

test('Wan 2.5 content is published for every supported locale and traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.status === 'ready_for_publish'))

  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.match(task.releaseBoundary, /navigation/i)
  assert.match(task.releaseBoundary, /Footer/i)
  assert.match(task.releaseBoundary, /AI Tools/i)
  assert.match(task.releaseBoundary, /sitemap/i)

  for (const locale of locales) {
    const publicContent = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))

    assert.deepEqual(factoryContent, publicContent, `${locale} Factory content should match public data`)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.equal(publicContent.topTool.modelId, 'wan-2-5')
    assert.equal(publicContent.heroDemoVideo?.src, '/model-assets/grok-imagine-video-1-5/grok-hero-demo-16x9.mp4')
    assert.equal(publicContent.heroDemoVideo?.poster, undefined)
    assert.equal(publicContent.heroDemoVideo?.width, 16)
    assert.equal(publicContent.heroDemoVideo?.height, 9)
    assert.match(publicContent.heroDemoVideo?.sourceHistory || '', /16:9/)
    assert.equal(publicContent.promptExamples.items.length, 4)
    assert.ok(
      publicContent.promptExamples.items.every((item) => item.aspectRatio === '9:16'),
      `${locale} prompt placeholders should all use 9:16 media framing`
    )
    assert.ok(
      publicContent.promptExamples.items.every((item) => !item.video && !item.poster && !item.duration && !item.uploadDate),
      `${locale} prompt examples should stay as placeholders until final Wan 2.5 videos are generated`
    )
    assert.doesNotMatch(
      JSON.stringify(publicContent.promptExamples),
      /16:9/,
      `${locale} prompt examples should not mention 16:9 while the placeholder media is 9:16`
    )
    assert.equal(publicContent.howToUse.steps.length, 4)
    assert.ok(publicContent.modelIntro.title)
    assert.ok(publicContent.workflowComparison.rows.length >= 5)
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /\bworkflow\b|model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder/i,
      `${locale} visible copy should not expose SEO/editor/internal page language`
    )
    if (locale !== 'en') {
      assert.doesNotMatch(
        collectVisibleStrings(publicContent).join('\n'),
        /AI Video Generator|AI Video Model|\bcredits\b|model availability|\bProvider\b/i,
        `${locale} visible copy should not leave common English fallback terms`
      )
    }
    assert.doesNotMatch(publicContent.hero.desc, /Wan 2\.7/i, `${locale} hero should not describe Wan 2.7`)
  }

  assert.ok(
    existsSync(join(root, 'public', 'model-assets', 'grok-imagine-video-1-5', 'grok-hero-demo-16x9.mp4')),
    '16:9 demo video should exist'
  )
})

test('Wan 2.5 public entry points are wired into navigation, footer, hubs, sitemap, and language data', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const aiToolsCopy = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')
  const modelCopy = readFileSync(join(root, 'src', 'app', 'model', 'copy.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')

  assert.equal(countOccurrences(navigation, `/model/${slug}`), 1, 'Navigation should include the AI Video model menu')
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
  assert.match(aiToolsCopy, new RegExp(`href:\\s*['"]/model/${slug}['"]`))
  assert.match(modelCopy, new RegExp(`href:\\s*['"]/model/${slug}['"]`))
  assert.match(sitemap, new RegExp(`['"]${slug}['"]`))
  assert.match(languageSwitch, new RegExp(`'${slug}': ALL_LOCALE_CODES`))
  assert.match(seoLoader, new RegExp(`importL2FlatJson\\('${slug}'`))

  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.ok(common.nav.wan25Video, `${locale} nav.wan25Video should exist`)
    assert.ok(common.footer.wan25Video, `${locale} footer.wan25Video should exist`)
  }
})

test('Wan 2.5 uses the real video model settings and How-to supports four steps in one row', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const howToUse = readFileSync(join(root, 'src', 'components', 'blocks', 'HowToUse.tsx'), 'utf8')

  assert.match(config, /'wan-2-5', 'Wan 2\.5', 100, \[5, 10\], \['720p', '1080p'\]/)
  assert.equal(content.performanceMetrics.metrics.find((metric) => metric.label === 'Duration')?.value, '5 seconds or 10 seconds')
  assert.equal(content.performanceMetrics.metrics.find((metric) => metric.label === 'Resolution')?.value, '720p or 1080p')
  assert.match(howToUse, /md:grid-cols-4/)
})
