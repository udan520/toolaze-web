import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'kling-ai-video-generator'
const taskId = '2026-07-30-kling-ai-video-generator'
const kling3HeroDemo = readJson(join(root, 'src', 'data', 'en', 'kling-3.json')).heroDemoVideo
const localizedLocales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const untranslatedVisiblePhrases = [
  'lets creators test',
  'Settings in Toolaze',
  'Input modes',
  'Text to video or image to video',
  'Reference images',
  'Up to 4 images',
  'Credit estimate',
  'Starts at 60+ credits',
  'Kling model comparison',
  'Default on this page',
  'Fast native-audio drafts',
  'Efficient audio option',
  'Use for polished social clips',
  'prompt examples',
  'Cinematic Product Reveal',
  'Urban Night Car Scene',
  'Creator Lifestyle Short',
  'Image-Guided Fashion Motion',
  'Good for testing',
  'Choose the starting mode',
  'Write one clear scene direction',
  'Select Kling settings',
  'Generate and refine',
  'Improve Kling Video Results',
  'Most weak video generations',
  'Motion looks unstable',
  'Use one main action',
  'Audio does not match',
  'Name the sound',
  'Reference details drift',
  'Preserve specifics',
  'The clip feels generic',
  'Add shot language',
  'Why Create Kling Videos on Toolaze',
  'Kling Starts Selected',
  'Create in Your Browser',
  'Draft Before High-Quality Runs',
  'What is Kling AI Video Generator?',
  'Which Kling model does this page use?',
  'Does Kling support image-to-video?',
  'Can Kling generate native audio?',
  'How many credits does Kling use?',
  'How do I get better Kling video prompts?',
  'Open the broader video generator',
  'Animate a product photo',
  'Explore Kling 3.0 settings',
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function sliceBetween(source, startNeedle, endNeedle) {
  const start = source.indexOf(startNeedle)
  assert.notEqual(start, -1, `missing start marker: ${startNeedle}`)
  const end = source.indexOf(endNeedle, start + startNeedle.length)
  assert.notEqual(end, -1, `missing end marker after ${startNeedle}: ${endNeedle}`)
  return source.slice(start, end)
}

test('kling AI video generator has a root page, data, loader mapping, and SEO Factory record', () => {
  const pagePath = join(root, 'src', 'app', slug, 'page.tsx')
  const dataPath = join(root, 'src', 'data', 'en', `${slug}.json`)
  const factoryPath = join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', 'en.json')
  const taskPath = join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json')
  const queuePath = join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json')
  const seoLoaderSource = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')

  assert.ok(existsSync(pagePath), 'root route must exist')
  assert.ok(existsSync(dataPath), 'English L2 data must exist')
  assert.ok(existsSync(factoryPath), 'SEO Factory English content must exist')
  assert.ok(existsSync(taskPath), 'SEO Factory task record must exist')

  const page = readJson(dataPath)
  const factory = readJson(factoryPath)
  const task = readJson(taskPath)
  const queue = readJson(queuePath)

  assert.equal(page.topComponent, 'kling-ai-video-generator')
  assert.equal(page.topTool.modelId, 'kling-3')
  assert.equal(page.promptExamples.items.length, 4)
  assert.equal(page.modelSelectionGuide.items.length, 5)
  assert.deepEqual(
    page.modelSelectionGuide.items.map((item) => item.title),
    ['Kling 3.0', 'Kling 3 Turbo', 'Kling 2.6', 'Kling 2.5 Turbo Pro', 'Kling 2.1 Master']
  )
  assert.ok(page.modelSelectionGuide.items.every((item) => item.logoSrc === '/model-logos/kling.svg'))
  assert.ok(page.modelSelectionGuide.items.every((item) => item.title.startsWith('Kling ')))
  assert.equal(page.heroDemoVideo.src, kling3HeroDemo.src)
  assert.equal(page.heroDemoVideo.width, 16)
  assert.equal(page.heroDemoVideo.height, 9)
  assert.match(page.heroDemoVideo.ariaLabel, /16:9/)
  assert.doesNotMatch(JSON.stringify(page.modelSelectionGuide), /Seedance|Grok/)
  assert.doesNotMatch(JSON.stringify(page.modelSelectionGuide), /Best for/)
  assert.doesNotMatch(JSON.stringify(page.faq), /video page/)
  assert.doesNotMatch(JSON.stringify(page.features), /The page opens/)
  assert.doesNotMatch(JSON.stringify(page.moreToolsLinks), /Model Page|model page/)
  assert.doesNotMatch(JSON.stringify(page.moreToolsLinks), /Seedance|Grok/)
  assert.doesNotMatch(JSON.stringify(page), /workflow/i)
  assert.deepEqual(factory, page)
  assert.equal(task.taskId, taskId)
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.ok(task.files.includes('src/app/kling-ai-video-generator/page.tsx'))
  assert.ok(task.files.includes('src/data/en/kling-ai-video-generator.json'))
  assert.ok(queue.tasks.some((item) => item.taskId === taskId && item.slug === slug && item.status === 'ready_for_publish'))
  assert.match(seoLoaderSource, /tool === 'kling-ai-video-generator'/)
})

test('kling AI video generator is localized for every supported site locale', () => {
  const englishPage = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const englishCommon = readJson(join(root, 'src', 'data', 'en', 'common.json'))
  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))

  for (const locale of localizedLocales) {
    const localeDataPath = join(root, 'src', 'data', locale, `${slug}.json`)
    const factoryPath = join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`)

    assert.ok(existsSync(localeDataPath), `${locale} L2 data must exist`)
    assert.ok(existsSync(factoryPath), `${locale} SEO Factory content must exist`)
    assert.ok(task.files.includes(`src/data/${locale}/${slug}.json`), `${locale} data path should be tracked in SEO Factory task`)
    assert.ok(task.files.includes(`_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`), `${locale} Factory content path should be tracked in SEO Factory task`)

    const page = readJson(localeDataPath)
    const factory = readJson(factoryPath)
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))

    assert.deepEqual(factory, page, `${locale} page data and SEO Factory content should match`)
    assert.deepEqual(page.sectionsOrder, englishPage.sectionsOrder)
    assert.equal(page.topTool.modelId, 'kling-3')
    assert.equal(page.promptExamples.items.length, 4)
    assert.equal(page.modelSelectionGuide.items.length, 5)
    assert.equal(page.heroDemoVideo.src, englishPage.heroDemoVideo.src)
    assert.equal(page.heroDemoVideo.width, 16)
    assert.equal(page.heroDemoVideo.height, 9)
    assert.notEqual(page.heroDemoVideo.ariaLabel, englishPage.heroDemoVideo.ariaLabel)
    assert.equal(page.faq.length, englishPage.faq.length)
    assert.equal(page.scenes.length, englishPage.scenes.length)
    assert.equal(page.moreToolsLinks.length, englishPage.moreToolsLinks.length)

    assert.notEqual(page.metadata.title, englishPage.metadata.title)
    assert.notEqual(page.hero.desc, englishPage.hero.desc)
    assert.notEqual(page.modelIntro.description[0], englishPage.modelIntro.description[0])
    assert.notEqual(page.promptExamples.subtitle, englishPage.promptExamples.subtitle)
    assert.ok(common.nav.klingAiVideoGenerator, `${locale} nav should expose a Kling generator label`)
    assert.ok(common.footer.klingAiVideoGenerator, `${locale} footer should expose a Kling generator label`)
    assert.notEqual(common.nav.klingAiVideoGenerator, englishCommon.nav.klingAiVideoGenerator, `${locale} nav should not fall back to English`)
    assert.notEqual(common.footer.klingAiVideoGenerator, englishCommon.footer.klingAiVideoGenerator, `${locale} footer should not fall back to English`)

    assert.ok(page.modelSelectionGuide.items.every((item) => item.title.startsWith('Kling ')))
    assert.doesNotMatch(JSON.stringify(page), /video page|model page|Model Page|the page opens|Best for|workflow/i)
    assert.doesNotMatch(JSON.stringify(page.modelSelectionGuide), /Seedance|Grok/)
    for (const phrase of untranslatedVisiblePhrases) {
      assert.doesNotMatch(JSON.stringify(page), new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${locale} should not keep visible English phrase: ${phrase}`)
    }
  }
})

test('kling AI video generator has public entry points across release-sensitive surfaces', () => {
  const sitemapSource = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  assert.match(sitemapSource, /kling-ai-video-generator/)

  const siteLanguageSwitchSource = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  assert.match(siteLanguageSwitchSource, /'kling-ai-video-generator': ALL_LOCALE_CODES/)

  const navSource = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  assert.match(navSource, /klingAiVideoGenerator/)
  assert.match(navSource, /getLocalizedHref\('\/kling-ai-video-generator'\)/)
  const desktopAiVideoMenu = sliceBetween(
    navSource,
    "href={getLocalizedHref('/ai-video-generator')}",
    "href={getLocalizedHref('/pricing')}"
  )
  const desktopGenericVideoIndex = desktopAiVideoMenu.indexOf("href={getLocalizedHref('/ai-video-generator')}")
  const desktopImageToVideoIndex = desktopAiVideoMenu.indexOf("href={getLocalizedHref('/image-to-video-generator')}")
  const desktopKlingModelIndex = desktopAiVideoMenu.indexOf("href={getLocalizedHref('/model/kling-3')}")
  const desktopKlingGeneratorIndex = desktopAiVideoMenu.indexOf("href={getLocalizedHref('/kling-ai-video-generator')}")
  assert.ok(desktopKlingGeneratorIndex > desktopKlingModelIndex, 'desktop Kling generator entry should sit with video model entries')
  assert.ok(
    desktopKlingGeneratorIndex > desktopImageToVideoIndex && desktopImageToVideoIndex > desktopGenericVideoIndex,
    'desktop Kling generator entry should not sit between generic video tools'
  )

  const footerSource = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  assert.match(footerSource, /klingAiVideoGenerator/)
  assert.match(footerSource, /getLocalizedHref\('\/kling-ai-video-generator'\)/)
  const footerAiVideoTools = footerSource.slice(
    footerSource.indexOf('{translations.aiVideo ||'),
    footerSource.indexOf('{translations.aiImageModel ||')
  )
  const footerAiVideoModels = footerSource.slice(
    footerSource.indexOf('{translations.aiVideoModel ||'),
    footerSource.indexOf('{/* 基础导航链接 */')
  )
  assert.doesNotMatch(footerAiVideoTools, /\/kling-ai-video-generator/, 'footer AI Video tools should stay functional/scenario-only')
  assert.match(footerAiVideoModels, /\/kling-ai-video-generator/, 'footer Kling generator entry should sit with video model links')

  const aiToolsSource = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')
  assert.doesNotMatch(aiToolsSource, /href:\s*'\/kling-ai-video-generator'/, 'model-specific pages should not appear in AI Tools Hub cards')

  const homePageSource = readFileSync(join(root, 'src', 'components', 'home', 'HomePageMain.tsx'), 'utf8')
  assert.doesNotMatch(homePageSource, /loadToolData\(\s*'kling-ai-video-generator'/, 'model-specific generator pages should not be inserted as homepage tool cards')

  const homeModelImagesSource = readFileSync(join(root, 'src', 'lib', 'home-model-card-images.ts'), 'utf8')
  assert.doesNotMatch(homeModelImagesSource, /'kling-ai-video-generator'/, 'homepage model thumbnails should use the canonical model id, not the generator route')
})
