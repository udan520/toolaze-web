import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'wan-2-5-ai-video-generator'
const taskId = '2026-07-30-wan-2-5-ai-video-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const heroDemoVideo = '/model-assets/grok-imagine-video-1-5/grok-hero-demo-16x9.mp4'
const heroDemoPoster = 'https://assets.toolaze.com/model-assets/grok-imagine-video-1-5/grok-hero-demo-16x9-poster.webp'

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

const weakPromptLabels = [
  'Weak prompt',
  'Schwacher Prompt',
  'Prompt débil',
  'Prompt faible',
  'Prompt debole',
  '弱いプロンプト',
  '약한 프롬프트',
  'Prompt fraco',
  '較弱提示詞',
]

const betterPromptLabels = [
  'Better prompt',
  'Besserer Prompt',
  'Prompt mejorado',
  'Meilleur prompt',
  'Prompt migliore',
  '改善したプロンプト',
  '더 나은 프롬프트',
  'Prompt melhor',
  '更好的提示詞',
]

const awkwardVisibleTerms = /preflight|low-stakes|SKU fidelity|\bSKU\b|\bSFX\b|保真|飞行前|飛行前|无关紧要|無關緊要|低風險問題|프리플라이트|低コストpreflight|preflight budget|preflight économique|preflight economico|preflight económico/i

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function canRenderWeakBetterPromptTip(desc) {
  const weakPattern = weakPromptLabels.map(escapeRegExp).join('|')
  const betterPattern = betterPromptLabels.map(escapeRegExp).join('|')
  return new RegExp(`^\\s*(${weakPattern})\\s*[:：]\\s*[\\s\\S]+?\\s*(${betterPattern})\\s*[:：]\\s*$`, 'iu').test(desc || '')
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
    assert.equal(publicContent.heroDemoVideo?.src, heroDemoVideo)
    assert.equal(publicContent.heroDemoVideo?.poster, heroDemoPoster)
    assert.equal(publicContent.heroDemoVideo?.width, 16)
    assert.equal(publicContent.heroDemoVideo?.height, 9)
    assert.equal(publicContent.heroDemoVideo?.duration, 'PT5.042S')
    assert.equal(publicContent.heroDemoVideo?.uploadDate, '2026-08-04T20:01:05.000Z')
    assert.equal(publicContent.heroDemoVideo?.type, 'video')
    assert.match(publicContent.heroDemoVideo?.poster || '', /\.webp$/)
    assert.match(publicContent.heroDemoVideo?.sourceHistory || '', /16:9/)
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
      `${locale} Wan 2.5 should use the compact budget-screening section order`,
    )
    assert.equal(publicContent.promptExamples.items.length, 4, `${locale} Wan 2.5 should keep four prompt examples`)
    assert.equal(publicContent.troubleshooting.items.length, 3, `${locale} Wan 2.5 should keep three prompt tips`)
    assert.ok(
      publicContent.troubleshooting.items.every((item) => canRenderWeakBetterPromptTip(item.desc) && item.prompt),
      `${locale} Wan 2.5 prompt tips should render separated weak/better rows with red cross and green check icons`,
    )
    assert.doesNotMatch(
      publicContent.troubleshooting.items.map((item) => item.desc).join('\n'),
      /Weak brief|弱簡報|Schwaches Briefing|Brief débil|brief faible|brief debole|ブリーフ|브리프|briefing/i,
      `${locale} Wan 2.5 prompt tips should use parser-supported prompt labels, not brief labels`,
    )
    assert.equal(publicContent.workflowComparison, undefined, `${locale} compact Wan 2.5 should remove cross-model comparison`)
    assert.equal(publicContent.scenesTitle, undefined, `${locale} compact Wan 2.5 should remove the use-case section title`)
    assert.equal(publicContent.scenes, undefined, `${locale} compact Wan 2.5 should remove the six-card use-case section`)
    assert.equal(publicContent.testimonials.maxItems, 3, `${locale} compact Wan 2.5 should render three testimonial cards`)
    assert.equal(publicContent.testimonials.showStars, false, `${locale} Wan 2.5 should avoid fake star ratings`)
    assert.equal(publicContent.testimonials.showAvatars, true, `${locale} Wan 2.5 should use avatar-style testimonial cards`)
    assert.equal(publicContent.testimonials.items.length, 3, `${locale} Wan 2.5 should keep three focused testimonials`)
    assert.equal(new Set(publicContent.testimonials.items.map((item) => item.avatar)).size, 3, `${locale} testimonials should use distinct non-human avatar icons`)
    assert.equal(new Set(publicContent.testimonials.items.map((item) => item.role)).size, 3, `${locale} testimonials should cover distinct creator roles`)
    if (locale === 'en') {
      assert.ok(
        publicContent.testimonials.items.every((item) => item.quote.split(/\s+/).length >= 28),
        'English testimonials should read like specific user notes, not short generic blurbs'
      )
      assert.ok(
        publicContent.sectionsOrder.indexOf('testimonials') > publicContent.sectionsOrder.indexOf('modelComparison'),
        'English testimonials should appear after model comparisons'
      )
      assert.ok(
        publicContent.sectionsOrder.indexOf('testimonials') < publicContent.sectionsOrder.indexOf('faq'),
        'English testimonials should appear before FAQ'
      )
    }
    assert.equal(publicContent.howToUse.steps.length, 4)
    assert.doesNotMatch(
      [publicContent.howToUse.title, ...publicContent.howToUse.steps.flatMap((step) => [step.title, step.desc])].join('\n'),
      awkwardVisibleTerms,
      `${locale} Wan 2.5 How To copy should avoid awkward internal preflight / fidelity language`,
    )
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      awkwardVisibleTerms,
      `${locale} Wan 2.5 visible copy should avoid internal SKU / preflight / SFX language`,
    )
    assert.ok(publicContent.modelIntro.title)
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /\bworkflow\b|model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder/i,
      `${locale} visible copy should not expose SEO/editor/internal page language`
    )
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /Wan 2\.6|Wan 2\.7|\b2\.6\b|\b2\.7\b/i,
      `${locale} Wan 2.5 visible copy should not mention higher Wan versions`
    )
    if (locale !== 'en') {
      assert.doesNotMatch(
        collectVisibleStrings(publicContent).join('\n'),
        /AI Video Generator|AI Video Model|\bcredits\b|model availability|\bProvider\b/i,
        `${locale} visible copy should not leave common English fallback terms`
      )
    }
    if (locale === 'en') {
      assert.match(publicContent.hero.desc, /lower-cost|micro clips|deserve more credits/i)
    }
  }

  assert.ok(
    existsSync(join(root, 'public', 'model-assets', 'grok-imagine-video-1-5', 'grok-hero-demo-16x9.mp4')),
    '16:9 demo video should exist'
  )
})

test('Wan 2.5 public entry points are wired into navigation, footer, hubs, sitemap, and language data', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const modelCopy = readFileSync(join(root, 'src', 'app', 'model', 'copy.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')

  assert.equal(countOccurrences(navigation, `/model/${slug}`), 1, 'Navigation should include the AI Video model menu')
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
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

  assert.match(config, /'wan-2-5', 'Wan 2\.5', 120, \[5, 10\], \['720p', '1080p'\]/)
  assert.match(content.performanceMetrics.metrics.find((metric) => metric.label === 'Duration')?.value || '', /5 or 10 seconds/)
  assert.match(content.performanceMetrics.metrics.find((metric) => metric.label === 'Output')?.value || '', /720p or 1080p/)
  assert.match(howToUse, /md:grid-cols-4/)
})

test('Wan 2.5 keeps compact line-character testimonials', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const pageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')

  assert.equal(content.testimonials.maxItems, 3)
  assert.equal(content.testimonials.items.length, 3)
  assert.equal(content.testimonials.showAvatars, true)
  assert.ok(content.testimonials.items.every((item) => item.avatar), 'Each Wan 2.5 testimonial should select a line-drawn character avatar')
  assert.match(pageContent, /maxItems\?: number/)
  assert.match(pageContent, /showAvatars\?: boolean/)
  assert.match(pageContent, /avatar\?: TestimonialAvatarVariant/)
  assert.match(pageContent, /function TestimonialAvatar/)
  assert.match(pageContent, /data-avatar-style="line-character"/)
  assert.match(pageContent, /viewBox="0 0 64 64"/)
  assert.match(pageContent, /aria-label="Line-drawn creator avatar"/)
  assert.match(pageContent, /className="testimonial-avatar-head/)
  assert.match(pageContent, /className="testimonial-avatar-shoulders/)
  assert.match(pageContent, /aria-hidden="true"/)
  assert.doesNotMatch(pageContent, /const iconClass = 'h-5 w-5'/)
  assert.doesNotMatch(pageContent, /getTestimonialInitials/)
  assert.match(pageContent, /const visibleCount = section\.maxItems \?\? 3/)
  assert.match(pageContent, /section\.items\.slice\(0, visibleCount\)/)
})
