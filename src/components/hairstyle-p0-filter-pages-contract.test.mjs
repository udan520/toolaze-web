import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const pages = [
  {
    slug: 'bald-filter',
    taskId: '2026-08-07-bald-filter',
    firstPreset: 'Bald',
    tabs: ['men', 'custom'],
    defaultImage: 'https://assets.toolaze.com/model-assets/bald-filter/bald-reference.webp',
    demoImage: 'https://assets.toolaze.com/model-assets/bald-filter/bald-filter-before-after-demo.webp',
  },
  {
    slug: 'bangs-filter',
    taskId: '2026-08-07-bangs-filter',
    firstPreset: 'Blunt Bangs',
    tabs: ['women', 'custom'],
    defaultImage: 'https://assets.toolaze.com/model-assets/bangs-filter/bangs-reference.webp',
    demoImage: 'https://assets.toolaze.com/model-assets/bangs-filter/bangs-filter-blunt-bangs-before-after-demo.webp',
  },
  {
    slug: 'perm-filter',
    taskId: '2026-08-07-perm-filter',
    firstPreset: 'Soft Wave Perm',
    tabs: ['women', 'men', 'custom'],
    defaultImage: 'https://assets.toolaze.com/model-assets/perm-filter/perm-reference.webp',
    demoImage: 'https://assets.toolaze.com/model-assets/perm-filter/perm-filter-before-after-demo.webp',
  },
]

const hairstylePages = Object.fromEntries(
  locales.map((locale) => [locale, JSON.parse(readFileSync(`src/data/${locale}/ai-hairstyle-changer.json`, 'utf8'))]),
)

const ignoredVisibleCopyKeys = new Set([
  'color',
  'customReferencePrompt',
  'defaultImageUrls',
  'defaultPrompt',
  'href',
  'id',
  'image',
  'modelId',
  'mode',
  'pageGroup',
  'prompt',
  'published',
  'recommendedMode',
  'sectionsOrder',
  'sourceData',
  'src',
  'status',
  'taskId',
  'topComponent',
  'url',
  'visiblePageType',
])

function childPath(parentPath, key) {
  if (/^\d+$/.test(key)) return `${parentPath}[${key}]`
  return parentPath ? `${parentPath}.${key}` : key
}

function collectVisibleStrings(value, path = '') {
  const key = path.replace(/\[\d+\]$/, '').split('.').at(-1)
  if (ignoredVisibleCopyKeys.has(key)) return []
  if (path.includes('topTool.functionalAcceptance.presets')) return []
  if (typeof value === 'string') return [{ path, value }]
  if (Array.isArray(value)) return value.flatMap((item, index) => collectVisibleStrings(item, childPath(path, String(index))))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([entryKey, entryValue]) =>
      collectVisibleStrings(entryValue, childPath(path, entryKey)),
    )
  }
  return []
}

function assertPublishedAsset(path) {
  assert.match(
    path,
    /^https:\/\/assets\.toolaze\.com\/model-assets\/(?:bald-filter|bangs-filter|perm-filter)\/.+\.webp$/,
  )
}

test('P0 hairstyle filter pages are wired with focused generator defaults', () => {
  const loader = readFileSync('src/lib/seo-loader.ts', 'utf8')
  const languageSwitch = readFileSync('src/lib/site-language-switch.ts', 'utf8')

  for (const pageInfo of pages) {
    assert.ok(existsSync(`src/data/en/${pageInfo.slug}.json`))
    assert.ok(existsSync(`src/app/${pageInfo.slug}/page.tsx`))
    assert.ok(existsSync(`src/app/[locale]/${pageInfo.slug}/page.tsx`))

    const page = JSON.parse(readFileSync(`src/data/en/${pageInfo.slug}.json`, 'utf8'))
    const rootRoute = readFileSync(`src/app/${pageInfo.slug}/page.tsx`, 'utf8')
    const localeRoute = readFileSync(`src/app/[locale]/${pageInfo.slug}/page.tsx`, 'utf8')

    assert.equal(page.topComponent, 'gpt-image-2')
    assert.equal(page.topTool.mode, 'image-to-image')
    assert.equal(page.topTool.maxUploadImages, 1)
    assert.equal(page.topTool.defaultAspectRatio, 'auto')
    assert.deepEqual(page.topTool.defaultImageUrls, [pageInfo.defaultImage])
    assert.equal(page.topTool.sampleImages?.[0]?.url, pageInfo.demoImage)
    assert.equal(page.topTool.sampleImages?.[0]?.width, 1600)
    assert.equal(page.topTool.sampleImages?.[0]?.height, 900)
    assert.equal(page.topTool.functionalAcceptance.presets[0].label, pageInfo.firstPreset)
    assert.equal(page.topTool.functionalAcceptance.presets.at(-1).label, 'Custom')
    assert.deepEqual(page.topTool.functionalAcceptance.presetTabs.map((tab) => tab.id), pageInfo.tabs)
    assert.equal(page.topTool.functionalAcceptance.defaultPromptPresetTabId, pageInfo.tabs[0])
    assert.equal(page.topTool.functionalAcceptance.hidePresetPromptInput, true)
    assert.equal(page.topTool.functionalAcceptance.showPresetSelectedState, true)
    assert.equal(page.topTool.functionalAcceptance.hidePresetReferenceUploader, true)
    assert.equal(page.topTool.functionalAcceptance.enableCustomReferenceImageUpload, true)
    assert.equal(page.topTool.textOverrides.customTextModeLabel, 'Describe hair style')
    assert.equal(page.topTool.textOverrides.customReferenceModeLabel, 'Reference hair style')
    assert.deepEqual(page.sectionsOrder, ['howToUse', 'intro', 'features', 'photoTips', 'faq'])
    assert.equal('promptExamples' in page, false)
    assert.equal(page.howToUse.steps.length, 3)
    assert.equal(page.features.items.length, 3)
    assert.equal(page.photoTips.items.length, 4)
    assert.equal(page.faq.length, 7)
    assert.match(page.metadata.title, /Free/)
    assert.match(page.metadata.description, /free|Perm Filter/i)
    assert.match(page.hero.h1, /^Free AI/)
    assert.match(rootRoute, new RegExp(`generateHreflangAlternates\\('en', '/${pageInfo.slug}'\\)`))
    assert.match(localeRoute, new RegExp(`hasLocaleL2JsonFile\\('${pageInfo.slug}', locale\\)`))
    assert.match(loader, new RegExp(`tool === '${pageInfo.slug}'`))
    assert.match(languageSwitch, new RegExp(`'${pageInfo.slug}': ALL_LOCALE_CODES`))
    assertPublishedAsset(pageInfo.defaultImage)
    assertPublishedAsset(pageInfo.demoImage)
  }
})

test('Bangs and Perm filters reuse the complete Women hairstyle list with the landing-page target first', () => {
  for (const locale of locales) {
    const mainWomen = hairstylePages[locale].topTool.functionalAcceptance.presets
      .filter((preset) => preset.group === 'women')
      .map((preset) => preset.label)
    for (const pageInfo of pages.filter((page) => page.slug === 'bangs-filter' || page.slug === 'perm-filter')) {
      const page = JSON.parse(readFileSync(`src/data/${locale}/${pageInfo.slug}.json`, 'utf8'))
      const womenLabels = page.topTool.functionalAcceptance.presets
        .filter((preset) => preset.group === 'women')
        .map((preset) => preset.label)
      const expected = pageInfo.slug === 'bangs-filter'
        ? [mainWomen[4], ...mainWomen.filter((_, index) => index !== 4)]
        : [womenLabels[0], ...mainWomen]
      assert.deepEqual(womenLabels, expected, `${locale} ${pageInfo.slug} Women presets should match the main hairstyle list`)
      assert.equal(page.topTool.functionalAcceptance.defaultPromptPresetTabId, 'women')
      assert.equal(page.topTool.functionalAcceptance.showPresetSelectedState, true)
      assert.equal(page.topTool.functionalAcceptance.presets[0].label, womenLabels[0])
    }
  }
})

test('P0 hairstyle filter pages have locale data and SEO Factory records', () => {
  const queue = JSON.parse(readFileSync('_codex/seo-pipeline/queue/ready.json', 'utf8'))

  for (const pageInfo of pages) {
    const task = JSON.parse(readFileSync(`_codex/seo-pipeline/tasks/${pageInfo.taskId}/task.json`, 'utf8'))
    assert.equal(task.slug, pageInfo.slug)
    assert.equal(task.status, 'ready_for_publish')
    assert.deepEqual(task.localeCoverage, locales)
    assert.ok(queue.tasks.some((entry) => entry.taskId === pageInfo.taskId && entry.slug === pageInfo.slug))

    for (const locale of locales) {
      const pagePath = `src/data/${locale}/${pageInfo.slug}.json`
      const factoryPath = `_codex/seo-pipeline/tasks/${pageInfo.taskId}/content/${locale}.json`
      assert.ok(existsSync(pagePath), `${locale} page data should exist for ${pageInfo.slug}`)
      assert.ok(existsSync(factoryPath), `${locale} factory content should exist for ${pageInfo.slug}`)

      const page = JSON.parse(readFileSync(pagePath, 'utf8'))
      const factory = JSON.parse(readFileSync(factoryPath, 'utf8'))
      assert.equal(factory.taskId, pageInfo.taskId)
      assert.equal(factory.slug, pageInfo.slug)
      assert.equal(factory.status, 'ready_for_publish')
      assert.equal(factory.locale, locale)
      assert.equal(page.topTool.defaultAspectRatio, 'auto')
      assert.equal(page.topTool.sampleImages?.[0]?.url, pageInfo.demoImage)
      assert.deepEqual(page.topTool.functionalAcceptance.presetTabs.map((tab) => tab.id), pageInfo.tabs)
      assert.ok(page.topTool.textOverrides.customTextModeLabel)
      assert.ok(page.topTool.textOverrides.customReferenceModeLabel)
    }
  }
})

test('P0 hairstyle filter pages are linked from public entry points', () => {
  const sitemap = readFileSync('src/app/sitemap.ts', 'utf8')
  const navigation = readFileSync('src/components/Navigation.tsx', 'utf8')
  const footer = readFileSync('src/components/Footer.tsx', 'utf8')
  const aiTools = readFileSync('src/app/ai-tools/copy.ts', 'utf8')
  const home = readFileSync('src/components/home/HomePageMain.tsx', 'utf8')

  for (const { slug } of pages) {
    const href = `/${slug}`
    assert.match(sitemap, new RegExp(`path: '${href}'`))
    assert.match(navigation, new RegExp(`href: '${href}'`))
    assert.match(footer, new RegExp(`getLocalizedHref\\('${href}'\\)`))
    assert.match(aiTools, new RegExp(`href: '${href}'`))
    assert.match(home, new RegExp(`localizeHomeHref\\('${href}'\\)`))
  }
})

test('P0 hairstyle filter visible copy avoids internal planning language and duplicated English fallback', () => {
  const banned = [
    /search intent/i,
    /\bSEO\b/i,
    /keyword/i,
    /AI Overview/i,
    /this page is built/i,
    /the page covers/i,
    /API platform/i,
    /provider route/i,
    /Unlimited Free/i,
    /Free Forever/i,
    /No Login/i,
  ]

  for (const { slug } of pages) {
    const english = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
    const englishVisible = new Map(collectVisibleStrings(english).map((entry) => [entry.path, entry.value]))

    for (const locale of locales) {
      const localized = JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8'))
      for (const { path, value } of collectVisibleStrings(localized)) {
        for (const pattern of banned) {
          assert.doesNotMatch(value, pattern, `${locale} ${slug} ${path} should avoid internal copy: ${value}`)
        }
        if (locale !== 'en') {
          const englishValue = englishVisible.get(path)
          const shouldIgnoreExactFallback =
            !englishValue ||
            value.length < 16 ||
            path.includes('topTool.displayName') ||
            path.includes('metadata.title') ||
            path.includes('moreToolsLinks') ||
            path.includes('sampleImages') ||
            /\bToolaze\b/.test(value)
          if (!shouldIgnoreExactFallback) {
            assert.notEqual(value, englishValue, `${locale} ${slug} ${path} should not reuse English copy`)
          }
        }
      }
    }
  }
})

test('Bangs and Perm filters fully localize controls, hairstyle labels, and FAQ pairs', () => {
  const slugs = ['bangs-filter', 'perm-filter']
  const englishResidue = /\b(?:Curtain Bangs|Wispy Bangs|Blunt Bangs|Side Bangs|See-Through Bangs|Curly Bangs|Soft Wave Perm|Loose Digital Perm|Men's Wavy Perm|Choose a|Upload person photo|Custom Hairstyle Instruction)\b/i

  for (const slug of slugs) {
    const english = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
    for (const locale of locales.filter((item) => item !== 'en')) {
      const localized = JSON.parse(readFileSync(`src/data/${locale}/${slug}.json`, 'utf8'))
      assert.equal(localized.faq.length, english.faq.length)

      for (let index = 0; index < english.faq.length; index += 1) {
        assert.notEqual(localized.faq[index].q, english.faq[index].q, `${locale} ${slug} FAQ ${index} question must be localized`)
        assert.notEqual(localized.faq[index].a, english.faq[index].a, `${locale} ${slug} FAQ ${index} answer must be localized`)
      }

      for (const path of [
        'topTool.displayName',
        'topTool.functionalAcceptance.presetTitle',
        'topTool.textOverrides.promptLabel',
        'topTool.textOverrides.personUploadTitle',
        'topTool.textOverrides.presetChoiceTitle',
        'faqTitle',
        'moreTools',
      ]) {
        const value = path.split('.').reduce((current, key) => current[key], localized)
        const englishValue = path.split('.').reduce((current, key) => current[key], english)
        assert.notEqual(value, englishValue, `${locale} ${slug} ${path} must be localized`)
      }

      const visibleText = collectVisibleStrings(localized)
        .filter(({ path }) => !path.includes('moreToolsLinks'))
        .map(({ value }) => value)
        .join('\n')
      assert.doesNotMatch(visibleText, englishResidue, `${locale} ${slug} should not contain English hairstyle/control residue`)
    }
  }
})
