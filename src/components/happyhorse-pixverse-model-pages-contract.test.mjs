import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const localizedLocales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const r2VideoUploadKeys = [
  'c07d1db481dd4e9b8e190ebb39611f08.png',
  '56bb211041b34c5f8f27d3c0208322e7.png',
  'd0d55df5eef346809067197fddb1b251.png',
  'd38c8d15f5e64bb4a0e563c257b5429f.mp4',
  'd6c7c4472b1f4a6b9148fca922d1a107.mp4',
]

const pages = [
  {
    slug: 'happyhorse-ai-video-generator',
    taskId: '2026-08-06-happyhorse-ai-video-generator',
    modelIds: ['happyhorse-1-1', 'happyhorse'],
    routeExport: 'HappyHorseAiVideoGeneratorModelPage',
    requiredPhrases: [
      /HappyHorse 1\.1/i,
      /base HappyHorse model/i,
      /3 to 15 seconds/i,
      /4:5, 5:4, 9:21, and 21:9/i,
      /native audio/i,
      /multi-shot/i,
      /20MB/i,
      /10MB/i,
    ],
    forbiddenPageText: [/PixVerse V6/i],
    forbiddenModelComparisonText: [/Wan 2\.6/i, /Classic/i],
  },
  {
    slug: 'pixverse-v6-ai-video-generator',
    taskId: '2026-08-06-pixverse-v6-ai-video-generator',
    modelIds: ['pixverse-v6'],
    routeExport: 'PixVerseV6AiVideoGeneratorModelPage',
    requiredPhrases: [
      /PixVerse V6/i,
      /two reference images/i,
      /1 to 15 seconds/i,
      /360p, 540p, 720p, and 1080p/i,
      /native audio/i,
      /multi-shot/i,
      /21:9/i,
      /Starts at 8 Credits/i,
    ],
    forbiddenPageText: [/base HappyHorse model/i],
    forbiddenModelComparisonText: [],
  },
]

const modelAliasRedirects = [
  ['pixverse-v6', 'pixverse-v6-ai-video-generator'],
  ['happyhorse', 'happyhorse-ai-video-generator'],
  ['happyhorse-1-1', 'happyhorse-ai-video-generator'],
]

const negativeVisiblePhrases = [
  /this page is built/i,
  /the page is designed/i,
  /search intent/i,
  /keyword/i,
  /ranking/i,
  /SEO/i,
  /AI Overview/i,
  /API platform/i,
  /integration/i,
  /provider route/i,
  /Unlimited Free/i,
  /Free Forever/i,
  /No Login/i,
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function visibleTextBlob(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(visibleTextBlob).join('\n')
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([key]) => !['href', 'src', 'poster', 'logoSrc', 'sourceHistory', 'seoFactoryTaskId'].includes(key))
      .map(([, nested]) => visibleTextBlob(nested))
      .join('\n')
  }
  return ''
}

test('HappyHorse and PixVerse model pages have routes, data, and SEO Factory records', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')

  for (const page of pages) {
    const routePath = join(root, 'src', 'app', 'model', page.slug, 'page.tsx')
    const dataPath = join(root, 'src', 'data', 'en', `${page.slug}.json`)
    const factoryPath = join(root, '_codex', 'seo-pipeline', 'tasks', page.taskId, 'content', 'en.json')
    const taskPath = join(root, '_codex', 'seo-pipeline', 'tasks', page.taskId, 'task.json')

    assert.ok(existsSync(routePath), `${page.slug} route must exist`)
    assert.ok(existsSync(dataPath), `${page.slug} English content must exist`)
    assert.ok(existsSync(factoryPath), `${page.slug} SEO Factory content must exist`)
    assert.ok(existsSync(taskPath), `${page.slug} SEO Factory task must exist`)

    const route = readFileSync(routePath, 'utf8')
    const content = readJson(dataPath)
    const factory = readJson(factoryPath)
    const task = readJson(taskPath)

    assert.match(route, new RegExp(page.routeExport), `${page.slug} should export a named model page component`)
    assert.equal(factory.sourceData, `src/data/en/${page.slug}.json`)
    assert.equal(task.taskId, page.taskId)
    assert.equal(task.slug, page.slug)
    assert.equal(task.pageType, 'l2')
    assert.equal(task.status, 'ready_for_publish')
    assert.ok(task.files.includes(`src/data/en/${page.slug}.json`))
    assert.ok(task.files.includes(`src/app/model/${page.slug}/page.tsx`))
    assert.ok(queue.tasks.some((item) => item.taskId === page.taskId && item.slug === page.slug && item.status === 'ready_for_publish'))
    assert.match(seoLoader, new RegExp(`tool === '${page.slug}'`))
    assert.match(localizedRoute, new RegExp(`'${page.slug}': '${page.slug}'`))
    assert.equal(content.metadata.published, true)
    assert.equal(content.topComponent, 'ai-video-generator')
    assert.equal(page.modelIds.includes(content.topTool.modelId), true)
    assert.equal(content.topTool.defaultMode, 'text-to-video')
  }
})

test('HappyHorse and PixVerse content keeps model-specific sections concise', () => {
  const expectedOrder = [
    'modelIntro',
    'howToUse',
    'promptExamples',
    'troubleshooting',
    'scenes',
    'modelComparison',
    'workflowComparison',
    'faq',
  ]

  for (const page of pages) {
    const content = readJson(join(root, 'src', 'data', 'en', `${page.slug}.json`))
    const text = visibleTextBlob(content)

    assert.deepEqual(content.sectionsOrder, expectedOrder)
    assert.equal(content.promptExamples.items.length, 4)
    assert.equal(content.troubleshooting.items.length, 3)
    assert.equal(content.scenes.length, 6)
    assert.equal(content.faq.length <= 5, true, `${page.slug} FAQ should stay under five questions`)
    assert.equal(content.sectionsOrder.includes('performanceMetrics'), false)
    assert.equal(content.sectionsOrder.includes('capabilitySnapshot'), false)
    assert.equal(content.sectionsOrder.includes('competitorComparison'), false)
    assert.equal(content.sectionsOrder.includes('testimonials'), false)
    assert.ok(content.hero.desc.length > 170, `${page.slug} hero description should answer input, output, core capability, and use case`)

    for (const phrase of page.requiredPhrases) {
      assert.match(text, phrase, `${page.slug} should include model-specific detail: ${phrase}`)
    }
    for (const phrase of page.forbiddenPageText) {
      assert.doesNotMatch(text, phrase, `${page.slug} should not borrow the other model page copy`)
    }
    for (const phrase of page.forbiddenModelComparisonText) {
      assert.doesNotMatch(
        visibleTextBlob(content.modelComparison),
        phrase,
        `${page.slug} same-family comparison should not include stale model text: ${phrase}`,
      )
    }
    for (const phrase of negativeVisiblePhrases) {
      assert.doesNotMatch(text, phrase, `${page.slug} visible copy should avoid internal wording: ${phrase}`)
    }
  }
})

test('HappyHorse and PixVerse public entry points are wired into model surfaces', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const modelHub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const siteLanguageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')

  for (const page of pages) {
    assert.match(sitemap, new RegExp(`'${page.slug}'`))
    assert.match(navigation, new RegExp(`/model/${page.slug}`))
    assert.match(footer, new RegExp(`/model/${page.slug}`))
    assert.match(siteLanguageSwitch, new RegExp(`'${page.slug}': ALL_LOCALE_CODES`))
  }

  assert.match(modelHub, /'pixverse-v6': '\/model\/pixverse-v6-ai-video-generator'/)
  assert.match(modelHub, /'happyhorse-1-1': '\/model\/happyhorse-ai-video-generator'/)
  assert.match(modelHub, /'happyhorse': '\/model\/happyhorse-ai-video-generator'/)
  assert.match(navigation, /labelKey: 'pixverseV6'/)
  assert.match(navigation, /labelKey: 'happyHorse'/)
  assert.match(footer, /translations\.pixverseV6/)
  assert.match(footer, /translations\.happyHorse/)
})

test('HappyHorse and PixVerse model-id aliases redirect to canonical pages without being advertised', () => {
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  const localizedToolSlugRoute = readFileSync(join(root, 'src', 'app', '[locale]', '[tool]', '[slug]', 'page.tsx'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')

  for (const [alias, canonical] of modelAliasRedirects) {
    const aliasPage = readFileSync(join(root, 'src', 'app', 'model', alias, 'page.tsx'), 'utf8')

    assert.match(aliasPage, new RegExp(`permanentRedirect\\(['"]/model/${canonical}['"]\\)`))
    assert.match(localizedRoute, new RegExp(`'${alias}': '${canonical}'`))
    assert.match(localizedToolSlugRoute, new RegExp(`'${alias}': '${canonical}'`))
    assert.doesNotMatch(sitemap, new RegExp(`'${alias}'(?!-)`), `${alias} should not be in sitemap`)
    assert.doesNotMatch(navigation, new RegExp(`/model/${alias}(?!-)`), `${alias} should not be linked in navigation`)
    assert.doesNotMatch(footer, new RegExp(`/model/${alias}(?!-)`), `${alias} should not be linked in footer`)
  }

  assert.match(localizedRoute, /const MODEL_REDIRECT_MAP/)
  assert.match(localizedRoute, /permanentRedirect\(locale === 'en' \? `\/model\/\$\{canonicalModel\}` : `\/\$\{locale\}\/model\/\$\{canonicalModel\}`\)/)
  assert.match(localizedToolSlugRoute, /const MODEL_ALIAS_REDIRECTS/)
  assert.match(localizedToolSlugRoute, /resolvedParams\.tool === 'model' && MODEL_ALIAS_REDIRECTS\[resolvedParams\.slug\]/)
})

test('HappyHorse and PixVerse localized content exists for every supported locale', () => {
  for (const page of pages) {
    for (const locale of localizedLocales) {
      const publicDataPath = join(root, 'src', 'data', locale, `${page.slug}.json`)
      const factoryPath = join(root, '_codex', 'seo-pipeline', 'tasks', page.taskId, 'content', `${locale}.json`)

      assert.ok(existsSync(publicDataPath), `${page.slug} must have ${locale} public data`)
      assert.ok(existsSync(factoryPath), `${page.slug} must have ${locale} SEO Factory content`)

      const publicData = readJson(publicDataPath)
      const factory = readJson(factoryPath)
      assert.equal(factory.sourceData, `src/data/${locale}/${page.slug}.json`)
      assert.equal(publicData.metadata.published, true)
      assert.ok(publicData.hero?.h1, `${page.slug} ${locale} should translate hero H1`)
      assert.ok(publicData.moreToolsLinks?.length >= 3, `${page.slug} ${locale} should translate related model cards`)
    }
  }
})

test('HappyHorse and PixVerse localized pages do not reuse English body copy', () => {
  const localizedCriticalPaths = [
    ['metadata', 'title'],
    ['metadata', 'description'],
    ['hero', 'h1'],
    ['hero', 'desc'],
    ['modelIntro', 'title'],
    ['howToUse', 'title'],
    ['promptExamples', 'title'],
    ['troubleshooting', 'title'],
    ['scenesTitle'],
    ['modelComparison', 'title'],
    ['workflowComparison', 'title'],
    ['faqTitle'],
    ['moreTools'],
  ]

  const getAtPath = (object, path) => path.reduce((current, key) => current?.[key], object)

  for (const page of pages) {
    const english = readJson(join(root, 'src', 'data', 'en', `${page.slug}.json`))
    for (const locale of localizedLocales) {
      const localized = readJson(join(root, 'src', 'data', locale, `${page.slug}.json`))

      for (const path of localizedCriticalPaths) {
        const englishValue = getAtPath(english, path)
        const localizedValue = getAtPath(localized, path)
        assert.notEqual(
          localizedValue,
          englishValue,
          `${page.slug} ${locale} should localize ${path.join('.')}`,
        )
      }

      assert.notEqual(localized.faq?.[0]?.q, english.faq?.[0]?.q, `${page.slug} ${locale} FAQ questions should be localized`)
      assert.notEqual(localized.scenes?.[0]?.desc, english.scenes?.[0]?.desc, `${page.slug} ${locale} scene copy should be localized`)
      assert.notEqual(localized.moreToolsLinks?.[0]?.description, english.moreToolsLinks?.[0]?.description, `${page.slug} ${locale} related card copy should be localized`)
    }
  }
})

test('HappyHorse and PixVerse localized content stays in sync and avoids wrong-language residue', () => {
  const forbiddenByLocale = {
    fr: [
      /¿/,
      /\bElige\b/i,
      /\bSí\./,
      /\bnecesites\b/i,
      /\bborradores\b/i,
      /\bproporciones\b/i,
      /\btexto a video\b/i,
      /\bimagen a video\b/i,
      /\bComece\b/i,
      /\bO Toolaze oferece\b/i,
      /\bproporcao\b/i,
      /\brascunhos\b/i,
    ],
    it: [
      /¿/,
      /\bElige\b/i,
      /\bSí\./,
      /\bnecesites\b/i,
      /\bborradores\b/i,
      /\bproporciones\b/i,
      /\btexto a video\b/i,
      /\bimagen a video\b/i,
      /\bComece\b/i,
      /\bO Toolaze oferece\b/i,
      /\bproporcao\b/i,
      /\brascunhos\b/i,
    ],
    pt: [
      /¿/,
      /\bElige\b/i,
      /\bSí\./,
      /\bnecesites\b/i,
      /\bborradores\b/i,
      /\bproporciones\b/i,
      /\btexto a video\b/i,
      /\bimagen a video\b/i,
    ],
  }

  for (const page of pages) {
    for (const locale of localizedLocales) {
      const publicData = readJson(join(root, 'src', 'data', locale, `${page.slug}.json`))
      const factory = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', page.taskId, 'content', `${locale}.json`))
      const { sourceData, ...factoryContent } = factory

      assert.equal(sourceData, `src/data/${locale}/${page.slug}.json`)
      assert.deepEqual(factoryContent, publicData, `${page.slug} ${locale} SEO Factory content should match public data`)

      const text = visibleTextBlob(publicData)
      for (const phrase of forbiddenByLocale[locale] || []) {
        assert.doesNotMatch(text, phrase, `${page.slug} ${locale} should not include wrong-language residue: ${phrase}`)
      }
    }
  }
})

test('HappyHorse and PixVerse video-backed R2 media renders as video in reusable cards', () => {
  for (const page of pages) {
    const content = readJson(join(root, 'src', 'data', 'en', `${page.slug}.json`))
    const mediaItems = [
      content.heroDemoVideo,
      ...(content.moreToolsLinks || []).map((item) => item.media).filter(Boolean),
    ]

    for (const media of mediaItems) {
      if (!r2VideoUploadKeys.some((key) => String(media?.src || '').includes(key))) continue
      assert.equal(media.type, 'video', `${page.slug} must mark ${media.src} as video media`)
      assert.ok(media.poster, `${page.slug} video media ${media.src} should provide a poster`)
    }
  }
})
