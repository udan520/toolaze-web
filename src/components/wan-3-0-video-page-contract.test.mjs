import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'wan-3-0-ai-video-generator'
const taskId = '2026-08-08-wan-3-0-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function normalizedTokenSet(value) {
  return new Set(
    JSON.stringify(value)
      .toLowerCase()
      .replace(/wan\s*[23](?:\.\d)?/g, 'wan-model')
      .match(/[a-z0-9]+/g) || []
  )
}

function jaccard(left, right) {
  const intersection = [...left].filter((token) => right.has(token)).length
  return intersection / (left.size + right.size - intersection)
}

function contentShape(value) {
  if (Array.isArray(value)) return value.map(contentShape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, contentShape(nested)]))
  }
  return typeof value
}

function countOccurrences(source, needle) {
  return source.split(needle).length - 1
}

test('Wan 3.0 model page exposes canonical and localized routes', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')))
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}'`))
})

test('Wan 3.0 content is localized and traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.status === 'ready_for_publish'))
  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  const english = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  assert.equal(english.topTool.modelId, 'wan-2-7')
  assert.equal(english.comingSoon, true)
  assert.match(english.hero.h1, /Coming Soon/i)
  assert.equal(english.promptExamples.items.length, 4)
  assert.ok(english.performanceMetrics.metrics.length >= 6)
  for (const locale of locales) {
    const publicContent = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))
    assert.deepEqual(factoryContent, publicContent)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.deepEqual(contentShape(publicContent), contentShape(english), `${locale} must keep the complete English content structure`)
    assert.equal(publicContent.faq.length, 12)
    assert.equal(publicContent.workflowComparison.rows.length, 4)
    assert.equal(publicContent.modelComparison.rows.length, 8)
  }
})

test('Wan 3.0 localized copy removes the obsolete unverified-launch framing', () => {
  const obsoleteFraming = /not officially|not yet announced|unverified|noch nicht offiziell|pas encore.{0,30}officiel|todav[ií]a no.{0,30}(anunciado|oficial)|ainda n[aã]o.{0,30}oficial|non .{0,20}ancora.{0,30}(annunciat|ufficial)|正式.{0,12}(発表|公告)|공식.{0,20}(발표|출시)/i

  for (const locale of locales) {
    const content = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    assert.doesNotMatch(JSON.stringify(content), obsoleteFraming, `${locale} still contains obsolete launch-verification copy`)
  }
})

test('Wan 3.0 localized prompt tips use labels supported by the shared parser', () => {
  const labels = {
    en: [/Weak prompt:/i, /Better prompt:/i],
    de: [/Schwacher Prompt:/i, /Besserer Prompt:/i],
    ja: [/弱いプロンプト:/, /改善したプロンプト:/],
    es: [/Prompt débil:/i, /Prompt mejorado:/i],
    'zh-TW': [/較弱提示詞:/, /更好的提示詞:/],
    pt: [/Prompt fraco:/i, /Prompt melhor:/i],
    fr: [/Prompt faible\s*:/i, /Meilleur prompt\s*:/i],
    ko: [/약한 프롬프트:/, /더 나은 프롬프트:/],
    it: [/Prompt debole:/i, /Prompt migliore:/i],
  }

  for (const locale of locales) {
    const content = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    for (const item of content.troubleshooting.items) {
      assert.match(item.desc, labels[locale][0])
      assert.match(item.desc, labels[locale][1])
    }
  }
})

test('Wan 3.0 is available in the real video generator and model hub', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const hub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  assert.match(config, /'wan-3-0'/)
  assert.match(hub, /wan-3-0/)
})

test('Wan 3.0 canonical URL is included in sitemap and model navigation', () => {
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const modelCopy = readFileSync(join(root, 'src', 'app', 'model', 'copy.ts'), 'utf8')
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  assert.match(sitemap, /wan-3-0-ai-video-generator/)
  assert.match(modelCopy, /wan-3-0-ai-video-generator/)
  assert.equal(countOccurrences(navigation, `/model/${slug}`), 1)
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1)
  const videoModelGroup = footer.slice(
    footer.indexOf('{translations.aiVideoModel ||'),
    footer.indexOf('{translations.company ||'),
  )
  assert.match(videoModelGroup, new RegExp(`/model/${slug}`), 'Footer must place Wan 3.0 in the AI Video Model group')
  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.ok(common.nav.wan30Video, `${locale} navigation must localize Wan 3.0`)
    assert.ok(common.footer.wan30Video, `${locale} footer must localize Wan 3.0`)
  }
})

test('Wan 3.0 keeps the shared video generator and defaults to the latest available Wan model', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const pageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')
  assert.equal(content.comingSoon, true)
  assert.equal(content.topTool.modelId, 'wan-2-7')
  assert.doesNotMatch(pageContent, /topComp === 'wan-3-0-ai-video-generator'/)
})

test('Wan 3.0 scenario icon keys render as SVG icons instead of visible text', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const scenarios = readFileSync(join(root, 'src', 'components', 'blocks', 'Scenarios.tsx'), 'utf8')
  const iconKeys = ['package', 'user', 'film', 'shopping-bag', 'layout', 'music']

  assert.deepEqual(content.scenes.map((scene) => scene.icon), iconKeys)
  for (const iconKey of iconKeys) {
    assert.match(scenarios, new RegExp(`(?:['\"]${iconKey}['\"]|${iconKey})\\s*:`))
  }
  assert.match(scenarios, /<svg aria-hidden="true"/)
  assert.match(scenarios, /iconName\s*\?\s*<ScenarioIcon/)
})

test('Wan 3.0 copy leads with model value, version upgrades, and first-tier comparisons', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const visible = JSON.stringify(content)
  assert.match(visible, /native 4K/i)
  assert.match(visible, /30.second/i)
  assert.match(visible, /six connected shots/i)
  assert.match(visible, /12 reference images/i)
  assert.match(visible, /synchronized audio/i)
  assert.match(visible, /Wan 2\.7/)
  assert.match(visible, /Seedance 2\.0/)
  assert.match(visible, /Kling 3\.0/)
  assert.match(visible, /Veo 3\.1/)
  assert.doesNotMatch(visible, /what (?:is|remains) (?:confirmed|unverified)|not officially (?:announced|confirmed|released)|model card|generation contract/i)
  assert.equal(content.sectionsOrder.includes('testimonials'), false)
  assert.equal('testimonials' in content, false)
  assert.deepEqual(content.sectionsOrder, ['modelIntro', 'performanceMetrics', 'modelComparison', 'workflowComparison', 'howToUse', 'scenes', 'promptExamples', 'troubleshooting', 'faq'])
  assert.equal(content.modelComparison.columnHeaders.middle, 'Wan 2.7')
  assert.ok(content.workflowComparison.rows.some((row) => row[0] === 'Seedance 2.0'))
})

test('Wan 3.0 visible content is materially different from Wan 2.7', () => {
  const wan30 = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const wan27 = readJson(join(root, 'src', 'data', 'en', 'wan-2-7-ai-video-generator.json'))
  const ratio = jaccard(normalizedTokenSet(wan30), normalizedTokenSet(wan27))
  assert.ok(ratio < 0.8, `Wan 3.0/Wan 2.7 token Jaccard should be below 0.80, got ${ratio.toFixed(3)}`)
})
