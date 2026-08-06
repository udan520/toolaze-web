import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'veo-3-1-ai-video-generator'
const taskId = '2026-08-06-veo-3-1-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const demoVideoUrl = 'https://assets.toolaze.com/generated/a669b2ab0b54498c9ca9c0cc9b52bccd.mp4'

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readSource(path) {
  return readFileSync(join(root, path), 'utf8')
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'defaultMode',
    'duration',
    'featuredColumn',
    'height',
    'href',
    'icon',
    'in_menu',
    'layout',
    'media',
    'mode',
    'modelId',
    'poster',
    'prompt',
    'published',
    'sectionsOrder',
    'seoFactoryTaskId',
    'sourceHistory',
    'src',
    'topComponent',
    'type',
    'uploadDate',
    'width',
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

test('Veo 3.1 model page exposes English and localized routes', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')), 'English model route should exist')

  const localizedRouteSource = readSource('src/app/[locale]/model/[model]/page.tsx')
  assert.match(localizedRouteSource, new RegExp(`'${slug}'`), 'localized model route should map the Veo 3.1 slug')
})

test('Veo 3.1 content is published for every locale and traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.status === 'ready_for_publish'))

  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.equal(task.canonicalPath, `/model/${slug}`)
  assert.match(task.releaseBoundary, /model route/i)
  assert.match(task.releaseBoundary, /model menu/i)
  assert.match(task.releaseBoundary, /model hub/i)
  assert.match(task.releaseBoundary, /footer/i)
  assert.match(task.releaseBoundary, /sitemap/i)

  const englishContent = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const expectedSections = [
    'modelIntro',
    'performanceMetrics',
    'howToUse',
    'promptExamples',
    'troubleshooting',
    'scenes',
    'modelComparison',
    'workflowComparison',
    'faq',
  ]

  for (const locale of locales) {
    const publicContent = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))
    const visibleCopy = collectVisibleStrings(publicContent).join('\n')

    assert.deepEqual(factoryContent, publicContent, `${locale} Factory content should match public data`)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.equal(publicContent.topTool.modelId, 'veo-3-1-fast')
    assert.equal(publicContent.heroDemoVideo?.src, demoVideoUrl)
    assert.equal(publicContent.heroDemoVideo?.poster, undefined, `${locale} should not output a fake poster for the remote demo video`)
    assert.equal(publicContent.heroDemoVideo?.duration, 'PT8S')
    assert.deepEqual(publicContent.sectionsOrder, expectedSections)
    assert.equal(publicContent.promptExamples.items.length, 4, `${locale} should keep four visible prompt examples`)
    assert.equal(publicContent.howToUse.steps.length, 4, `${locale} should keep four how-to steps`)
    assert.equal(publicContent.performanceMetrics.metrics.length, 8, `${locale} should include hard-spec capability rows`)
    assert.equal(publicContent.faq.length, 10, `${locale} should answer the high-intent Veo 3.1 questions`)
    const wanRelatedCard = publicContent.moreToolsLinks.find((item) => item.href === '/model/wan-2-7-ai-video-generator')
    assert.equal(wanRelatedCard?.media?.type, 'image', `${locale} Wan 2.7 related card should use a stable image preview`)
    assert.equal(
      wanRelatedCard?.media?.src,
      'https://assets.toolaze.com/uploads/6e2548965fc5487ca41221f9d663dfcb.webp',
      `${locale} Wan 2.7 related card should reuse the reachable poster asset`,
    )

    assert.doesNotMatch(
      visibleCopy,
      /\bSEO\b|keyword|ranking|search intent|AI Overview|Official Veo|official limits|current integration|provider route|API platform|Unlimited Free|Free Forever|No Login|No Signup|this page|the page is built|model page|video page/i,
      `${locale} visible copy should not expose SEO/editor/internal language or unverified access claims`,
    )

    if (locale !== 'en') {
      assert.notEqual(publicContent.metadata.title, englishContent.metadata.title, `${locale} metadata title should be localized`)
      assert.notEqual(publicContent.hero.desc, englishContent.hero.desc, `${locale} hero description should be localized`)
      assert.notEqual(publicContent.modelIntro.title, englishContent.modelIntro.title, `${locale} intro title should be localized`)
      assert.notEqual(publicContent.performanceMetrics.title, englishContent.performanceMetrics.title, `${locale} capability title should be localized`)
      assert.notEqual(publicContent.howToUse.title, englishContent.howToUse.title, `${locale} how-to title should be localized`)
      assert.notEqual(publicContent.promptExamples.title, englishContent.promptExamples.title, `${locale} prompt title should be localized`)
      assert.notEqual(publicContent.faqTitle, englishContent.faqTitle, `${locale} FAQ title should be localized`)
      assert.notEqual(publicContent.moreTools, englishContent.moreTools, `${locale} related model title should be localized`)
      assert.doesNotMatch(
        visibleCopy,
        /What Is|Capability Snapshot|How to Use|Prompt Examples|What You Can Create|AI Video Generator FAQ|Does Veo|How many|Choose a Veo|Weak prompt|Better prompt/i,
        `${locale} visible copy should not leave common English model-page fallback strings`,
      )
    }
  }
})

test('Veo 3.1 English copy foregrounds competitor-critical model decisions', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const visibleCopy = collectVisibleStrings(content).join('\n')

  assert.match(content.metadata.title, /First\/Last Frames/)
  assert.match(content.metadata.title, /Native Audio/)
  assert.match(content.hero.desc, /text prompts/)
  assert.match(content.hero.desc, /image anchors/)
  assert.match(content.hero.desc, /4\/6\/8/)
  assert.match(content.hero.desc, /720p or 1080p/)
  assert.match(content.hero.desc, /Lite, Fast, or Quality/)
  assert.match(visibleCopy, /first\/last-frame/i)
  assert.match(visibleCopy, /native audio/i)
  assert.match(visibleCopy, /up to three images/i)
  assert.match(visibleCopy, /4K/i)
  assert.match(visibleCopy, /30 Credits/)
  assert.match(visibleCopy, /60 Credits/)
  assert.match(visibleCopy, /450 Credits/)
})

test('Veo 3.1 public entry points are connected to model surfaces', () => {
  const navigationSource = readSource('src/components/Navigation.tsx')
  const footerSource = readSource('src/components/Footer.tsx')
  const modelHubSource = readSource('src/lib/model-hub.ts')
  const seoLoaderSource = readSource('src/lib/seo-loader.ts')
  const sitemapSource = readSource('src/app/sitemap.ts')
  const languageSwitchSource = readSource('src/lib/site-language-switch.ts')
  const toolL2Source = readSource('src/components/blocks/ToolL2PageContent.tsx')

  assert.match(navigationSource, new RegExp(`/model/${slug}`))
  assert.match(navigationSource, /veo31Video/)
  assert.match(footerSource, new RegExp(`/model/${slug}`))
  assert.match(modelHubSource, new RegExp(`'veo-3-1-fast': '/model/${slug}'`))
  assert.match(modelHubSource, new RegExp(`'veo-3-1-lite': '/model/${slug}'`))
  assert.match(modelHubSource, new RegExp(`'veo-3-1-quality': '/model/${slug}'`))
  assert.match(seoLoaderSource, new RegExp(`'${slug}'`))
  assert.match(sitemapSource, new RegExp(`'/model/${slug}': '2026-08-06'`))
  assert.match(sitemapSource, new RegExp(`'${slug}'`))
  assert.match(languageSwitchSource, new RegExp(`'${slug}': ALL_LOCALE_CODES`))
  assert.match(toolL2Source, new RegExp(`'${slug}': 'veo-3-1-fast'`))

  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.equal(typeof common.nav.veo31Video, 'string', `${locale} nav.veo31Video should exist`)
    assert.equal(typeof common.footer.veo31Video, 'string', `${locale} footer.veo31Video should exist`)
    assert.notEqual(common.nav.veo31Video.trim(), '', `${locale} nav.veo31Video should not be empty`)
    assert.notEqual(common.footer.veo31Video.trim(), '', `${locale} footer.veo31Video should not be empty`)
  }
})

test('Veo 3.1 tool configuration matches the SEO capability copy', () => {
  const configSource = readSource('src/lib/ai-video-generator-config.ts')
  const veoBlock = configSource.slice(
    configSource.indexOf("['veo-3-1-lite', 'Veo 3.1 Lite'"),
    configSource.indexOf("'pixverse-v6'", configSource.indexOf("['veo-3-1-lite', 'Veo 3.1 Lite'")),
  )
  const nativeAudioSet = configSource.slice(
    configSource.indexOf('const NATIVE_AUDIO_OUTPUT_MODEL_IDS'),
    configSource.indexOf('const MULTI_SHOT_MODEL_IDS'),
  )

  assert.match(veoBlock, /maxImages:\s*2/)
  assert.match(veoBlock, /supportsFirstLastFrame:\s*true/)
  assert.match(veoBlock, /durations:\s*\[4,\s*6,\s*8\]/)
  assert.match(veoBlock, /resolutions:\s*\['720p',\s*'1080p'\]/)
  assert.match(nativeAudioSet, /'veo-3-1-lite'/)
  assert.match(nativeAudioSet, /'veo-3-1-fast'/)
  assert.match(nativeAudioSet, /'veo-3-1-quality'/)
})
