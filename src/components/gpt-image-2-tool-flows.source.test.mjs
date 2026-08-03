import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const watermarkSource = readFileSync(new URL('./WatermarkRemover.tsx', import.meta.url), 'utf8')
const l2Source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')
const featuresSource = readFileSync(new URL('./blocks/Features.tsx', import.meta.url), 'utf8')
const promptExamplesSource = readFileSync(new URL('./blocks/PromptExamples.tsx', import.meta.url), 'utf8')
const aiImageToolSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
const imageToImageFunctionSource = readFileSync(
  new URL('../../functions/api/image-to-image.js', import.meta.url),
  'utf8',
)
const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const footerSource = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')
const homePageSource = readFileSync(new URL('./home/HomePageMain.tsx', import.meta.url), 'utf8')
const homeTrendingToolsRailSource = readFileSync(new URL('./home/HomeTrendingToolsRail.tsx', import.meta.url), 'utf8')
const homeModelCardsRailPath = new URL('./home/HomeModelCardsRail.tsx', import.meta.url)
const homeModelCardsRailSource = existsSync(homeModelCardsRailPath)
  ? readFileSync(homeModelCardsRailPath, 'utf8')
  : ''
const homepageGridToolsSource = readFileSync(new URL('../lib/homepage-grid-tools.ts', import.meta.url), 'utf8')
const homeAdvancedAiCardImagesSource = readFileSync(
  new URL('../lib/home-advanced-ai-card-images.ts', import.meta.url),
  'utf8',
)
const homeModelCardImagesSource = readFileSync(new URL('../lib/home-model-card-images.ts', import.meta.url), 'utf8')
const adminSeoServerSource = readFileSync(new URL('../../scripts/admin-seo-server.js', import.meta.url), 'utf8')
const aiToolsCopySource = readFileSync(new URL('../app/ai-tools/copy.ts', import.meta.url), 'utf8')
const siteLanguageSwitchSource = readFileSync(new URL('../lib/site-language-switch.ts', import.meta.url), 'utf8')
const aiImageGeneratorConfigSource = readFileSync(
  new URL('../lib/ai-image-generator-config.ts', import.meta.url),
  'utf8',
)
const sitemapSource = readFileSync(new URL('../app/sitemap.ts', import.meta.url), 'utf8')
const localeAiDancePageSource = readFileSync(
  new URL('../app/[locale]/ai-dance-generator/page.tsx', import.meta.url),
  'utf8',
)
const localeAiClothesChangerPageSource = readFileSync(
  new URL('../app/[locale]/ai-clothes-changer/page.tsx', import.meta.url),
  'utf8',
)
const aiDanceContent = JSON.parse(readFileSync(new URL('../data/en/ai-dance-generator.json', import.meta.url), 'utf8'))
const aiDanceFactoryContent = JSON.parse(
  readFileSync('_codex/seo-pipeline/tasks/2026-07-20-ai-dance-generator/content/en.json', 'utf8'),
)
const aiClothesChangerContent = JSON.parse(
  readFileSync(new URL('../data/en/ai-clothes-changer.json', import.meta.url), 'utf8'),
)
const aiBikiniGeneratorPath = new URL('../data/en/ai-bikini-generator.json', import.meta.url)
const aiBikiniGeneratorContent = existsSync(aiBikiniGeneratorPath)
  ? JSON.parse(readFileSync(aiBikiniGeneratorPath, 'utf8'))
  : null
const aiBreastExpansionContent = JSON.parse(
  readFileSync(new URL('../data/en/ai-breast-expansion.json', import.meta.url), 'utf8'),
)
const aiDanceLocales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW']
const localizedFreeCreditPatterns = {
  en: /20 free credits/i,
  de: /20 kostenlose Credits/i,
  es: /20 créditos gratis/i,
  fr: /20 crédits gratuits/i,
  it: /20 crediti gratis/i,
  ja: /20無料クレジット|20\s*無料クレジット/i,
  ko: /20 무료 크레딧|무료 크레딧 20개/i,
  pt: /20 créditos grátis/i,
  'zh-TW': /20 點免費 credits/i,
}
const staleTenCreditGrantPattern =
  /10\s*(?:free credits|kostenlose Credits|créditos gratis|crédits gratuits|crediti gratis|無料(?:credits|クレジット)|무료 크레딧|créditos grátis|點免費 credits)/i
const aiDanceLocaleContent = Object.fromEntries(
  aiDanceLocales.map((locale) => [
    locale,
    JSON.parse(readFileSync(new URL(`../data/${locale}/ai-dance-generator.json`, import.meta.url), 'utf8')),
  ]),
)
const aiDanceFactoryLocaleContent = Object.fromEntries(
  aiDanceLocales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`_codex/seo-pipeline/tasks/2026-07-20-ai-dance-generator/content/${locale}.json`, 'utf8')),
  ]),
)

function sourceBetween(source, start, end) {
  const startIndex = source.indexOf(start)
  const endIndex = source.indexOf(end, startIndex + start.length)
  assert.notEqual(startIndex, -1, `missing source marker: ${start}`)
  assert.notEqual(endIndex, -1, `missing source marker: ${end}`)
  return source.slice(startIndex, endIndex)
}

const aiVideoToolMenuSource = sourceBetween(
  navigationSource,
  'const AI_VIDEO_TOOL_MENU_ITEMS',
  'type AiVideoNavLabelKey',
)
const aiVideoModelMenuSource = sourceBetween(
  navigationSource,
  'const AI_VIDEO_MODEL_MENU_ITEMS',
  'function getInitialNavTranslations',
)
const aiImageModelMenuSource = sourceBetween(
  navigationSource,
  'const AI_IMAGE_MODEL_MENU_ITEMS',
  'type AiVideoNavLabelKey',
)

test('AI tools hub exposes baby, couple, dance, watermark, and World Cup entries', () => {
  for (const href of [
    '/ai-baby-generator',
    '/ai-couple-photo-maker',
    '/ai-dance-generator',
    '/watermark-remover',
    '/world-cup-ai-image-generator',
  ]) {
    assert.match(aiToolsCopySource, new RegExp(`href: '${href}'`))
  }

  assert.doesNotMatch(aiToolsCopySource, /REVIEW_HIDDEN_AI_TOOL_HREFS/)
})

test('homepage AI Tools tabs include every concrete tool from the hub', () => {
  for (const href of [
    '/unrestricted-ai-image-generator',
    '/world-cup-ai-image-generator',
    '/ai-couple-photo-maker',
    '/ai-baby-generator',
    '/ai-dance-generator',
    '/ai-kissing-video-generator',
    '/talking-avatar-creator',
    '/ai-hairstyle-changer',
    '/ai-hair-color-changer',
    '/ai-clothes-changer',
    '/ai-bikini-generator',
    '/ai-breast-expansion',
    '/ai-asmr-video-generator',
    '/watermark-remover',
    '/photo-restoration',
  ]) {
    const slug = href.replace(/^\//, '')
    const explicitHref = new RegExp(`localizeHomeHref\\('${href}'\\)`)
    const dynamicSlug = new RegExp(`'${slug}'`)

    assert.ok(
      explicitHref.test(homePageSource) || dynamicSlug.test(homePageSource),
      `homepage AI Tools should expose ${href}`,
    )
  }

  assert.match(homePageSource, /navCopy\.aiAsmrVideoGenerator \|\| 'AI ASMR Video Generator'/)
  assert.match(homePageSource, /getHomeModelCardImage\('ai-asmr-video-generator'\)/)
  assert.doesNotMatch(homePageSource, /localizeHomeHref\('\/model\/wan-2-5-ai-video-generator'\)/)
})

test('homepage quick launch buttons use compact labels instead of generator suffixes', () => {
  assert.match(homePageSource, /imageToVideo: 'Image to Video'/)
  assert.match(homePageSource, /textToVideo: 'Text to Video'/)
  assert.match(homePageSource, /imageToImage: 'Image to Image'/)
  assert.match(homePageSource, /textToImage: 'Text to Image'/)

  assert.doesNotMatch(homePageSource, /label: navCopy\.imageToVideoGenerator/)
  assert.doesNotMatch(homePageSource, /label: navCopy\.textToVideoGenerator/)
  assert.doesNotMatch(homePageSource, /label: navCopy\.aiImageToImageGenerator/)
  assert.doesNotMatch(homePageSource, /label: navCopy\.textToImageGenerator/)
  assert.match(
    homePageSource,
    /label: navCopy\.videoTools \|\| 'Video Tools', href: localizeHomeHref\('\/ai-tools\?tab=video'\)/,
  )
  assert.match(
    homePageSource,
    /label: navCopy\.imageTools \|\| 'Image Tools', href: localizeHomeHref\('\/ai-tools\?tab=image'\)/,
  )
  assert.doesNotMatch(homePageSource, /label: navCopy\.videoTools \|\| 'Video Tools', href: '#ai-tools-hub'/)
  assert.doesNotMatch(homePageSource, /label: navCopy\.imageTools \|\| 'Image Tools', href: '#ai-tools-hub'/)
  assert.ok(
    homePageSource.includes('border border-slate-200 bg-white/85 px-5') &&
      homePageSource.includes('text-slate-700'),
  )
  assert.doesNotMatch(homePageSource, /border-indigo-600 bg-indigo-600 text-white/)
  assert.doesNotMatch(homePageSource, /border-slate-950 bg-slate-950 text-white/)
  assert.doesNotMatch(homePageSource, /dashboardCopy\.videoEditor/)
  assert.doesNotMatch(homePageSource, /Video Editor/)
  assert.doesNotMatch(homePageSource, /quickActionCopy\.aiDance/)
  assert.doesNotMatch(homePageSource, /quickActionCopy\.watermark/)
  assert.doesNotMatch(homePageSource, /quickActionCopy\.restorePhoto/)
})

test('homepage quick launch cards link to the main video, image, and AI tools hubs', () => {
  const firstScreenSource = sourceBetween(homePageSource, '{/* Dashboard-style first screen */}', '{/* AI Tools hub')

  assert.match(homePageSource, /cardHref: localizeHomeHref\('\/ai-video-generator'\)/)
  assert.match(homePageSource, /cardHref: localizeHomeHref\('\/ai-image-generator'\)/)
  assert.match(homePageSource, /cardHref: localizeHomeHref\('\/ai-tools'\)/)
  assert.match(firstScreenSource, /href=\{group\.cardHref\}/)
  assert.match(firstScreenSource, /aria-label=\{`Open \$\{group\.title\}`\}/)
  assert.match(firstScreenSource, /pointer-events-none/)
  assert.match(firstScreenSource, /pointer-events-auto/)
  assert.match(firstScreenSource, /className="absolute inset-0 z-0"\n\s*\/>/)
  assert.match(
    firstScreenSource,
    /<div className="pointer-events-auto relative z-10 flex flex-wrap gap-3">\n\s*\{group\.links\.map/,
  )
})

test('homepage quick launch cards provide restrained hover motion', () => {
  const firstScreenSource = sourceBetween(homePageSource, '{/* Dashboard-style first screen */}', '{/* AI Tools hub')

  assert.match(firstScreenSource, /motion-safe:hover:-translate-y-1/)
  assert.match(firstScreenSource, /motion-safe:hover:scale-\[1\.01\]/)
  assert.match(firstScreenSource, /hover:shadow-\[0_24px_70px_rgba\(79,70,229,0\.14\)\]/)
  assert.match(firstScreenSource, /group-hover:-translate-y-0\.5/)
  assert.match(firstScreenSource, /group-hover:scale-x-110/)
  assert.match(firstScreenSource, /\[transition-timing-function:cubic-bezier\(0\.22,1,0\.36,1\)\]/)
})

test('homepage first screen removes numbered cards and the outer framed container', () => {
  const firstScreenSource = sourceBetween(homePageSource, '{/* Dashboard-style first screen */}', '{/* AI Tools hub')

  assert.doesNotMatch(firstScreenSource, /index: '0[123]'/)
  assert.doesNotMatch(firstScreenSource, /group\.index/)
  assert.doesNotMatch(
    firstScreenSource,
    /max-w-\[1500px\][^"']*border border-indigo-100[^"']*bg-white[^"']*shadow-soft/,
  )
  assert.match(firstScreenSource, /<section className="bg-\[#F8FAFF\] px-2 pb-12 pt-3 sm:px-3 lg:px-4">/)
  assert.match(firstScreenSource, /<div className="min-w-0">/)
})

test('homepage Trending prioritizes Kissing, Dance, and ASMR before the rest of AI Tools', () => {
  const trendingHrefBlock = sourceBetween(
    homePageSource,
    'const featuredTrendingHrefs = [',
    'const featuredTrendingCards',
  )

  assert.ok(
    trendingHrefBlock.indexOf("localizeHomeHref('/ai-kissing-video-generator')") <
      trendingHrefBlock.indexOf("localizeHomeHref('/ai-dance-generator')"),
  )
  assert.ok(
    trendingHrefBlock.indexOf("localizeHomeHref('/ai-dance-generator')") <
      trendingHrefBlock.indexOf("localizeHomeHref('/ai-asmr-video-generator')"),
  )
  assert.match(
    homePageSource,
    /\.\.\.allAiToolCards\.filter\(\(item\) => !featuredTrendingHrefSet\.has\(item\.href\)\)/,
  )
  assert.match(
    homePageSource,
    /<HomeTrendingToolsRail title=\{dashboardCopy\.trending\} cards=\{dashboardTrendingCards\} \/>/,
  )
})

test('homepage Trending renders video media without relying on file extension', () => {
  assert.match(homeTrendingToolsRailSource, /card\.media\.type === 'video'/)
  assert.match(homeTrendingToolsRailSource, /<video[\s\S]*src=\{card\.media\.src\}/)
  assert.doesNotMatch(homeTrendingToolsRailSource, /canRenderVideo/)
  assert.match(
    homePageSource,
    /src: 'https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/83a8c5b91a4945beb66275c38a731dbf\.png'/,
  )
})

test('homepage AI Models cards use light purple-tinted surfaces on the white home page', () => {
  const firstScreenSource = sourceBetween(homePageSource, '{/* Dashboard-style first screen */}', '{/* AI Tools hub')
  const modelBlock = sourceBetween(firstScreenSource, '<section aria-labelledby="home-ai-models-title">', '</section>')

  assert.match(modelBlock, /bg-\[radial-gradient\(circle_at_top_left,_rgba\(99,102,241,0\.12\),_transparent_42%\)\]/)
  assert.match(modelBlock, /bg-white p-5 text-slate-950/)
  assert.match(modelBlock, /border border-indigo-100\/80/)
  assert.match(modelBlock, /bg-indigo-50 text-indigo-700/)
  assert.match(homePageSource, /text-slate-950/)
  assert.match(homePageSource, /text-slate-600/)
  assert.doesNotMatch(modelBlock, /bg-slate-950 p-5 text-white/)
  assert.doesNotMatch(modelBlock, /border border-slate-800\/80/)
  assert.doesNotMatch(modelBlock, /bg-indigo-400\/10 text-indigo-100/)
  assert.doesNotMatch(homePageSource, /text-slate-50 drop-shadow-md/)
  assert.doesNotMatch(homePageSource, /text-slate-200 drop-shadow-sm/)
  assert.doesNotMatch(modelBlock, /getHomeModelCardImage\(item\.tool\)/)
  assert.doesNotMatch(modelBlock, /<Image/)
  assert.doesNotMatch(modelBlock, /object-cover/)
  assert.doesNotMatch(modelBlock, /bg-gradient-to-t from-slate-950\/98 via-slate-950\/94 to-slate-950\/86/)
  assert.doesNotMatch(homePageSource, /opacity-85 transition-transform/)
  assert.doesNotMatch(homePageSource, /bg-gradient-to-t from-slate-950\/84 via-slate-950\/62 to-slate-950\/36/)
  assert.doesNotMatch(homePageSource, /bg-white\/76 backdrop-blur/)
  assert.doesNotMatch(homePageSource, /text-white\/86/)
})

test('homepage left hero banner restores image treatment with Seedance 2.0 Mini copy', () => {
  const firstScreenSource = sourceBetween(homePageSource, '{/* Dashboard-style first screen */}', '{/* AI Tools hub')
  const heroBannerSource = sourceBetween(
    firstScreenSource,
    '<div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.95fr)]">',
    '<section aria-labelledby="home-ai-models-title">',
  )

  assert.match(homePageSource, /import Image from 'next\/image'/)
  assert.match(homePageSource, /title: 'Seedance 2\.0 Mini'/)
  assert.match(homePageSource, /href: localizeHomeHref\('\/ai-video-generator\?model=seedance-2-mini'\)/)
  assert.match(homePageSource, /Create faster 480p and 720p video drafts/)
  assert.match(homePageSource, /const featuredLaunchThumb = getHomeModelCardImage\('seedance-2-5'\)/)
  assert.match(heroBannerSource, /<Image/)
  assert.match(heroBannerSource, /src=\{featuredLaunchThumb\.src\}/)
  assert.match(heroBannerSource, /alt=\{`\$\{featuredLaunch\.title\} video generation preview`\}/)
  assert.match(heroBannerSource, /object-cover transition-transform duration-500 group-hover:scale-\[1\.03\]/)
  assert.match(heroBannerSource, /from-slate-950\/78 via-slate-950\/42 to-slate-950\/10/)
  assert.match(heroBannerSource, /dashboardCopy\.liveNowSuffix/)
  assert.doesNotMatch(homePageSource, /modelId: 'seedance-2-mini'/)
  assert.doesNotMatch(homePageSource, /'480p \/ 720p drafts'/)
  assert.doesNotMatch(heroBannerSource, /from-indigo-600 via-violet-600 to-sky-500/)
  assert.doesNotMatch(heroBannerSource, /data-home-featured-mini-card/)
  assert.doesNotMatch(heroBannerSource, /Mini workflow/)
})

test('homepage model sections use one-row rails with Trending arrow controls', () => {
  const aiImageSectionSource = sourceBetween(homePageSource, '{/* AI Image Generator - aiease structure */}', '{/* AI Video Generator - aiease structure */}')
  const aiVideoSectionSource = sourceBetween(homePageSource, '{/* AI Video Generator - aiease structure */}', '{/* Why Toolaze */}')

  assert.match(homePageSource, /import HomeModelCardsRail, \{ type HomeModelCardsRailCard \}/)
  assert.match(homePageSource, /const imageModelCards: HomeModelCardsRailCard\[\]/)
  assert.match(homePageSource, /const videoModelCards: HomeModelCardsRailCard\[\]/)
  assert.match(aiImageSectionSource, /<HomeModelCardsRail cards=\{imageModelCards\} mediaKind="image" \/>/)
  assert.match(aiVideoSectionSource, /<HomeModelCardsRail cards=\{videoModelCards\} mediaKind="video" \/>/)
  assert.doesNotMatch(aiImageSectionSource, /grid grid-cols-1 md:grid-cols-3/)
  assert.doesNotMatch(aiVideoSectionSource, /grid grid-cols-1 md:grid-cols-3/)
  assert.match(homeModelCardsRailSource, /const railRef = useRef<HTMLDivElement>\(null\)/)
  assert.match(homeModelCardsRailSource, /scrollByPage\(direction: -1 \| 1\)/)
  assert.match(homeModelCardsRailSource, /aria-label=\{`Previous \$\{mediaKind\} models`\}/)
  assert.match(homeModelCardsRailSource, /aria-label=\{`Next \$\{mediaKind\} models`\}/)
  assert.match(homeModelCardsRailSource, /flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors hover:border-indigo-200 hover:text-indigo-700/)
  assert.match(homeModelCardsRailSource, /flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2 \[scrollbar-width:none\] \[&::-webkit-scrollbar\]:hidden/)
  assert.match(homeModelCardsRailSource, /basis-\[82%\][\s\S]*sm:basis-\[48%\][\s\S]*xl:basis-\[calc\(\(100%_-_4rem\)\/3\)\]/)
})

test('homepage AI Video Models section renders model landing page demo videos', () => {
  const aiVideoSectionSource = sourceBetween(homePageSource, '{/* AI Video Generator - aiease structure */}', '{/* Why Toolaze */}')

  assert.match(homePageSource, /heroDemoVideo\?: \{ src\?: string; poster\?: string; ariaLabel\?: string \}/)
  assert.match(homePageSource, /heroDemoVideo: data\?\.heroDemoVideo/)
  assert.match(homePageSource, /function getHomeVideoModelDemoMedia\(item: ToolCard\)/)
  assert.match(homePageSource, /'seedance-2-5': \{[\s\S]*prompt-templates\/storyboard-scene\.mp4/)
  assert.match(homePageSource, /getHomeVideoModelDemoMedia\(item\)/)
  assert.match(homeModelCardsRailSource, /data-home-video-model-demo/)
  assert.match(homeModelCardsRailSource, /src=\{card\.media\.src\}/)
  assert.match(homeModelCardsRailSource, /poster=\{card\.media\.poster\}/)
  assert.match(homeModelCardsRailSource, /\bautoPlay\b/)
  assert.match(homeModelCardsRailSource, /\bloop\b/)
  assert.match(homeModelCardsRailSource, /\bmuted\b/)
  assert.match(homeModelCardsRailSource, /\bplaysInline\b/)
  assert.match(homeModelCardsRailSource, /preload="metadata"/)
  assert.doesNotMatch(aiVideoSectionSource, /const thumb = getHomeModelCardImage\(item\.tool\)[\s\S]{0,900}<Image/)
})

test('homepage model block uses All Models label for the whole row', () => {
  const firstScreenSource = sourceBetween(homePageSource, '{/* Dashboard-style first screen */}', '{/* AI Tools hub')
  const modelBlock = sourceBetween(firstScreenSource, '<div className="mt-7">', '<HomeTrendingToolsRail')
  const labelIndex = modelBlock.indexOf('id="home-ai-models-title"')
  const modelGridIndex = modelBlock.indexOf('className="grid gap-6 xl:grid-cols')
  const sideSectionIndex = modelBlock.indexOf('<section aria-labelledby="home-ai-models-title">')

  assert.match(homePageSource, /aiModels: 'All Models'/)
  assert.match(modelBlock, /<Link\s+href=\{localizeHomeHref\('\/model'\)\}/)
  assert.notEqual(labelIndex, -1)
  assert.notEqual(modelGridIndex, -1)
  assert.notEqual(sideSectionIndex, -1)
  assert.ok(labelIndex < modelGridIndex, 'All Models label should sit above the whole model row')
  assert.ok(sideSectionIndex > modelGridIndex, 'right-side card section should sit inside the model row')
  assert.doesNotMatch(
    modelBlock,
    /<section aria-labelledby="home-ai-models-title">[\s\S]{0,200}<h2 id="home-ai-models-title"/,
  )
})

test('AI Dance is discoverable from global navigation, footer, homepage, and AI Tools hub', () => {
  assert.match(navigationSource, /aiDanceGenerator/)
  assert.match(aiVideoToolMenuSource, /href: '\/ai-dance-generator'/)
  assert.doesNotMatch(
    navigationSource,
    /href=\{getLocalizedHref\('\/ai-dance-generator'\)\}\s+onClick=\{\(\) => setOpenDesktopMenu\(null\)\}\s+className="order-[0-9]+ hover:text-indigo-600 transition-colors whitespace-nowrap"/s,
  )
  assert.match(footerSource, /aiDanceGenerator/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-dance-generator'\)\}/)
  assert.match(homePageSource, /href: localizeHomeHref\('\/ai-dance-generator'\)/)
  assert.match(homeModelCardImagesSource, /'ai-dance-generator'/)
  assert.match(aiToolsCopySource, /cardAssets\.dance/)
  assert.match(aiToolsCopySource, /\/model-assets\/ai-dance-generator\/ai-dance-demo-source\.png/)
  assert.doesNotMatch(aiToolsCopySource, /Grok/)
})

test('AI Kissing is discoverable from global navigation, footer, homepage, and AI Tools hub before AI Dance', () => {
  const videoToolsBlock = aiVideoToolMenuSource
  const sceneNavKeysBlock = l2Source.slice(
    l2Source.indexOf('const sceneNavKeys = ['),
    l2Source.indexOf('const sceneFooterKeys = ['),
  )
  const sceneFooterKeysBlock = l2Source.slice(
    l2Source.indexOf('const sceneFooterKeys = ['),
    l2Source.indexOf('const pageTranslations ='),
  )

  const kissingIndex = videoToolsBlock.indexOf("href: '/ai-kissing-video-generator'")
  const danceIndex = videoToolsBlock.indexOf("href: '/ai-dance-generator'")
  assert.notEqual(kissingIndex, -1)
  assert.notEqual(danceIndex, -1)
  assert.ok(kissingIndex < danceIndex)

  assert.match(navigationSource, /aiKissingVideoGenerator/)
  assert.match(footerSource, /aiKissingVideoGenerator/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-kissing-video-generator'\)\}/)
  assert.match(homePageSource, /href: localizeHomeHref\('\/ai-kissing-video-generator'\)/)
  assert.match(homeModelCardImagesSource, /'ai-kissing-video-generator'/)
  assert.match(aiToolsCopySource, /href: '\/ai-kissing-video-generator'/)
  assert.match(aiToolsCopySource, /cardAssets\.kissing/)
  assert.match(sceneNavKeysBlock, /'aiKissingVideoGenerator'/)
  assert.match(sceneFooterKeysBlock, /'aiKissingVideoGenerator'/)
  assert.match(siteLanguageSwitchSource, /'ai-kissing-video-generator': ALL_LOCALE_CODES/)
})

test('Kling 2.6 Motion Control is discoverable from AI Tools menu and homepage video tools', () => {
  assert.match(
    aiVideoToolMenuSource,
    /href: '\/model\/kling-2-6-pro-motion-control'[\s\S]*labelKey: 'aiMotionControlGenerator'[\s\S]*imageKey: 'motionControlGenerator'/,
  )
  assert.match(
    navigationSource,
    /motionControlGenerator:\s*'https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/model-assets\/kling-2-6-pro-motion-control\/motion-control-demo-poster\.webp'/,
  )
  assert.match(
    homePageSource,
    /title: navCopy\.aiMotionControlGenerator \|\| 'AI Motion Control Generator'/,
  )
  assert.match(homePageSource, /alt: navCopy\.aiMotionControlGenerator \|\| 'AI Motion Control Generator'/)
  assert.match(homePageSource, /href: localizeHomeHref\('\/model\/kling-2-6-pro-motion-control'\)/)
  assert.match(homePageSource, /motion-control-demo\.mp4/)
  assert.match(homePageSource, /motion-control-demo-poster\.webp/)
  assert.match(aiToolsCopySource, /href: '\/model\/kling-2-6-pro-motion-control'/)
})

test('Grok 1.5 Video is discoverable from AI Video navigation, footer, and homepage models', () => {
  assert.match(navigationSource, /grok15Video/)
  assert.match(aiVideoModelMenuSource, /href: '\/model\/grok-imagine-video-1-5'[\s\S]*labelKey: 'grok15Video'/)
  assert.match(footerSource, /grok15Video/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-video-generator'\)\}[\s\S]*grok15Video/)
  assert.match(homePageSource, /tool: 'grok-1-5-video'/)
  assert.match(homePageSource, /href: '\/ai-video-generator'/)
})

test('Wan 2.5 Video has a homepage card image and admin preview coverage', () => {
  assert.match(homeModelCardImagesSource, /'wan-2-5-ai-video-generator': \{/)
  assert.match(homeModelCardImagesSource, /prompt-templates\/storyboard-scene\.webp/)
  assert.match(homeModelCardImagesSource, /alt: 'Wan 2\.5 AI video storyboard motion preview'/)
  assert.match(homePageSource, /'wan-2-5-ai-video-generator': '\/model\/wan-2-5-ai-video-generator'/)
  assert.match(
    adminSeoServerSource,
    /const HOME_PREVIEW_VIDEO_MODEL_L2S = \['wan-2-5-ai-video-generator', 'seedance-2-5', 'seedance-2', 'kling-3', 'grok-imagine-video-1-5'\]/,
  )
  assert.match(
    adminSeoServerSource,
    /'wan-2-5-ai-video-generator': 'https:\/\/pub-efeb0c7b9b53478d960218de80c52e3d\.r2\.dev\/uploads\/ai-video-generator\/prompt-templates\/storyboard-scene\.webp'/,
  )
  assert.match(adminSeoServerSource, /'wan-2-5-ai-video-generator': '\/model\/wan-2-5-ai-video-generator'/)
})

test('AI Video model tags are separated from tool links and show manufacturer icons', () => {
  const orderedRoutes = ['/model/seedance-2-5', '/model/seedance-2', '/model/kling-3', '/model/grok-imagine-video-1-5']
  const routeIndexes = orderedRoutes.map((route) => aiVideoModelMenuSource.indexOf(`href: '${route}'`))

  assert.ok(routeIndexes.every((index) => index >= 0))
  assert.deepEqual(
    routeIndexes,
    [...routeIndexes].sort((a, b) => a - b),
  )
  assert.doesNotMatch(aiVideoModelMenuSource, /href: '\/kling-ai-video-generator'/)
  assert.doesNotMatch(aiVideoModelMenuSource, /labelKey: 'klingAiVideoGenerator'/)
  assert.doesNotMatch(aiVideoModelMenuSource, /href: '\/ai-dance-generator'/)
  assert.doesNotMatch(aiVideoModelMenuSource, /href: '\/talking-avatar-creator'/)
  assert.match(
    aiVideoModelMenuSource,
    /href: '\/model\/wan-2-5-ai-video-generator'[\s\S]*logoSrc: '\/model-logos\/wan\.ico'/,
  )
  assert.match(aiVideoModelMenuSource, /href: '\/model\/seedance-2-5'[\s\S]*logoSrc: '\/model-logos\/bytedance\.svg'/)
  assert.match(
    aiVideoModelMenuSource,
    /href: '\/model\/seedance-2'[\s\S]*logoSrc: '\/model-logos\/bytedance\.svg'[\s\S]*badgeKey: 'hot'/,
  )
  assert.match(aiVideoModelMenuSource, /href: '\/model\/kling-3'[\s\S]*logoSrc: '\/model-logos\/kling\.svg'/)
  assert.match(
    aiVideoModelMenuSource,
    /href: '\/model\/grok-imagine-video-1-5'[\s\S]*logoSrc: '\/model-logos\/grok\.svg'[\s\S]*badgeKey: 'bestValue'/,
  )
  assert.match(navigationSource, /data-ai-video-section="models"[\s\S]*AI_VIDEO_MODEL_MENU_ITEMS\.map/)
  assert.match(navigationSource, /navTranslations\.bestValue \|\| defaultNavTranslations\.bestValue/)
})

test('AI Image model links show their manufacturer icons on desktop and mobile', () => {
  const modelIcons = [
    ['/model/gpt-image-2', '/model-logos/openai.svg', "badgeKey: 'hot'"],
    ['/model/seedream-5-0-pro', '/model-logos/bytedance.svg', "badgeKey: 'new'"],
    ['/model/nano-banana-pro', '/model-logos/google-gemini.png'],
    ['/model/seedream-5-0-lite', '/model-logos/bytedance.svg'],
    ['/model/wan-2-7-image', '/model-logos/wan.ico'],
    ['/model/nano-banana-2', '/model-logos/google-gemini.png'],
    ['/model/seedream-4-5', '/model-logos/bytedance.svg'],
  ]

  const routeIndexes = modelIcons.map(([route]) => aiImageModelMenuSource.indexOf(`href: '${route}'`))

  assert.ok(routeIndexes.every((index) => index >= 0))
  assert.deepEqual(
    routeIndexes,
    [...routeIndexes].sort((a, b) => a - b),
  )
  for (const [route, icon, badge] of modelIcons) {
    const routeStart = aiImageModelMenuSource.indexOf(`href: '${route}'`)
    const nextItem = aiImageModelMenuSource.indexOf('\n  { href:', routeStart + 1)
    const itemSource = aiImageModelMenuSource.slice(
      routeStart,
      nextItem >= 0 ? nextItem : aiImageModelMenuSource.length,
    )
    assert.match(itemSource, new RegExp(`logoSrc: '${icon.replaceAll('.', '\\.')}'`))
    if (badge) {
      assert.match(itemSource, new RegExp(badge))
    }
  }
  assert.match(
    navigationSource,
    /AI_IMAGE_MODEL_MENU_ITEMS\.map\(\(item\) => renderAiImageModelMenuItem\(item, 'desktop'\)\)/,
  )
  assert.match(
    navigationSource,
    /AI_IMAGE_MODEL_MENU_ITEMS\.map\(\(item\) => renderAiImageModelMenuItem\(item, 'mobile'\)\)/,
  )
  assert.match(navigationSource, /data-ai-image-model-tag/)
})

test('AI Kissing and AI Dance show localized Hot labels in AI Tools navigation', () => {
  const videoToolsBlock = navigationSource.slice(
    navigationSource.indexOf('const AI_VIDEO_TOOL_MENU_ITEMS'),
    navigationSource.indexOf('function getInitialNavTranslations'),
  )
  const sharedToolRenderer = navigationSource.slice(
    navigationSource.indexOf('const renderAiToolMenuItem'),
    navigationSource.indexOf('const getDefaultAiToolsExpandedSubmenus'),
  )

  assert.match(videoToolsBlock, /aiKissingVideoGenerator[\s\S]*hot: true/)
  assert.match(videoToolsBlock, /aiDanceGenerator[\s\S]*hot: true/)
  assert.match(sharedToolRenderer, /navTranslations\.hot \|\| defaultNavTranslations\.hot/)
  assert.match(sharedToolRenderer, /bg-red-500 px-1\.5 py-0\.5 text-\[10px\] font-extrabold leading-none text-white/)
  assert.doesNotMatch(sharedToolRenderer, /bg-rose-50/)
})

test('AI Dance supports localized route switching and localized shell copy', () => {
  const sceneNavKeysBlock = l2Source.slice(
    l2Source.indexOf('const sceneNavKeys = ['),
    l2Source.indexOf('const sceneFooterKeys = ['),
  )
  const sceneFooterKeysBlock = l2Source.slice(
    l2Source.indexOf('const sceneFooterKeys = ['),
    l2Source.indexOf('const pageTranslations ='),
  )

  assert.match(siteLanguageSwitchSource, /'ai-dance-generator': ALL_LOCALE_CODES/)
  assert.match(localeAiDancePageSource, /generateStaticParams/)
  assert.match(localeAiDancePageSource, /hasLocaleL2JsonFile\('ai-dance-generator', locale\)/)
  assert.match(sitemapSource, /\/ai-dance-generator/)
  assert.match(sitemapSource, /`\$\{baseUrl\}\/\$\{locale\}\/ai-dance-generator`/)
  assert.match(sceneNavKeysBlock, /'aiDanceGenerator'/)
  assert.match(sceneFooterKeysBlock, /'aiDanceGenerator'/)
})

test('AI Clothes Changer supports localized route switching, sitemap, and shell entry points', () => {
  const sceneNavKeysBlock = l2Source.slice(
    l2Source.indexOf('const sceneNavKeys = ['),
    l2Source.indexOf('const sceneFooterKeys = ['),
  )
  const sceneFooterKeysBlock = l2Source.slice(
    l2Source.indexOf('const sceneFooterKeys = ['),
    l2Source.indexOf('const pageTranslations ='),
  )

  assert.match(navigationSource, /aiClothesChanger/)
  assert.match(navigationSource, /href: '\/ai-clothes-changer'/)
  assert.match(footerSource, /aiClothesChanger/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-clothes-changer'\)\}/)
  assert.match(homepageGridToolsSource, /\{ id: 'ai-clothes-changer', usesAi: true \}/)
  assert.match(homeAdvancedAiCardImagesSource, /'ai-clothes-changer'/)
  assert.match(homePageSource, /for \(const tool of HOME_ADVANCED_AI_TOOL_IDS\)/)
  assert.match(aiToolsCopySource, /href: '\/ai-clothes-changer'/)
  assert.match(aiToolsCopySource, /supplemental\.clothes/)
  assert.match(siteLanguageSwitchSource, /'ai-clothes-changer': ALL_LOCALE_CODES/)
  assert.match(localeAiClothesChangerPageSource, /generateStaticParams/)
  assert.match(localeAiClothesChangerPageSource, /hasLocaleL2JsonFile\('ai-clothes-changer', locale\)/)
  assert.match(
    sitemapSource,
    /const path = locale === 'en' \? '\/ai-clothes-changer' : `\/\$\{locale\}\/ai-clothes-changer`/,
  )
  assert.match(sceneNavKeysBlock, /'aiHairstyleChanger'/)
  assert.match(sceneNavKeysBlock, /'aiHairColorChanger'/)
  assert.match(sceneNavKeysBlock, /'aiClothesChanger'/)
  assert.match(sceneNavKeysBlock, /'hot'/)
  assert.match(sceneFooterKeysBlock, /'aiHairstyleChanger'/)
  assert.match(sceneFooterKeysBlock, /'aiHairColorChanger'/)
  assert.match(sceneFooterKeysBlock, /'aiClothesChanger'/)
})

test('AI Dance localizes the top upload title in page data and Seo Factory content', () => {
  const expectedUploadTitles = {
    en: 'Upload your image',
    de: 'Lade dein Bild hoch',
    es: 'Sube tu imagen',
    fr: 'Importez votre image',
    it: 'Carica la tua immagine',
    ja: '画像をアップロード',
    ko: '이미지 업로드',
    pt: 'Envie sua imagem',
    'zh-TW': '上傳你的圖片',
  }

  for (const locale of aiDanceLocales) {
    assert.equal(aiDanceLocaleContent[locale].topTool?.textOverrides?.uploadTitle, expectedUploadTitles[locale])
    assert.equal(aiDanceFactoryLocaleContent[locale].topTool?.textOverrides?.uploadTitle, expectedUploadTitles[locale])
  }
})

test('AI Dance top navigation keeps language switch clickable at tablet widths', () => {
  assert.match(navigationSource, /className="absolute right-4 z-50 flex items-center gap-2 lg:hidden"/)
  assert.match(
    navigationSource,
    /className="hidden lg:flex gap-4 xl:gap-5 text-sm font-bold text-slate-700 items-center"/,
  )
  assert.match(navigationSource, /className="hidden xl:inline">\{navCurrentLocaleInfo\.name\}<\/span>/)
  assert.match(navigationSource, /className="absolute right-6 hidden lg:flex items-center gap-3"/)
})

test('photo restoration root page uses GPT Image 2 shared image-to-image flow', () => {
  const restorationBranch = l2Source.slice(
    l2Source.indexOf("topComp === 'photo-restoration'"),
    l2Source.indexOf("topComp === 'ai-couple-photo-maker'"),
  )

  assert.match(restorationBranch, /<AiImageGenerationTool/)
  assert.match(restorationBranch, /modelId="gpt-image-2"/)
  assert.match(restorationBranch, /defaultMode="image-to-image"/)
  assert.match(restorationBranch, /defaultPrompt=\{PHOTO_RESTORATION_PROMPT\}/)
  assert.match(restorationBranch, /hidePromptInput/)
  assert.match(restorationBranch, /generateLabel: 'Restore Photo'/)
})

test('watermark remover sends GPT Image 2 image-to-image generation requests', () => {
  assert.match(watermarkSource, /formData\.append\('isImageToImage', 'true'\)/)
  assert.match(watermarkSource, /formData\.append\('model', 'gpt-image-2'\)/)
  assert.match(watermarkSource, /fetch\('\/api\/image-to-image'/)
  assert.match(watermarkSource, /fetch\('\/api\/image-to-image\/status'/)
  assert.doesNotMatch(watermarkSource, /fetch\('\/api\/qwen-image-edit'/)
  assert.doesNotMatch(watermarkSource, /form\.append\('model', 'nano-banana'\)/)
})

test('generic GPT Image 2 top component can use a JSON-configured model id', () => {
  const gptTopBranch = l2Source.slice(
    l2Source.indexOf("topComp === 'gpt-image-2'"),
    l2Source.indexOf("topComp === 'seedance-2-5'"),
  )

  assert.match(gptTopBranch, /modelId=\{getTopToolImageModelId\(content\.topTool\?\.modelId, 'gpt-image-2'\)\}/)
  assert.doesNotMatch(gptTopBranch, /modelId="gpt-image-2"/)
})

test('AI Clothes Changer keeps workflow tabs above upload and clothing presets below upload', () => {
  assert.equal(aiClothesChangerContent.topTool?.mode, 'image-to-image')
  assert.equal(aiClothesChangerContent.topTool?.maxUploadImages, 2)
  assert.deepEqual(
    aiClothesChangerContent.topTool?.functionalAcceptance?.presetTabs?.map((tab) => tab.id),
    ['clothing-reference', 'custom'],
  )

  const workflowTabsIndex = aiImageToolSource.indexOf('data-workflow-preset-tabs')
  const uploaderIndex = aiImageToolSource.indexOf('<ReferenceImageUploader')
  const clothingUploaderIndex = aiImageToolSource.indexOf('testIdPrefix="clothing-reference"')
  const presetCardsIndex = aiImageToolSource.indexOf('visiblePromptPresets.map')

  assert.ok(workflowTabsIndex > -1, 'workflow tabs should render as the top-level clothes changer mode switch')
  assert.ok(uploaderIndex > workflowTabsIndex, 'upload component should sit directly under the workflow tabs')
  assert.ok(
    clothingUploaderIndex > uploaderIndex,
    'clothing reference mode should render a dedicated clothing upload component',
  )
  assert.ok(
    presetCardsIndex > clothingUploaderIndex,
    'clothing preset cards should stay below the clothing upload component',
  )
  assert.deepEqual(aiClothesChangerContent.topTool?.defaultImageUrls, [])
  assert.match(
    aiClothesChangerContent.topTool?.sampleImages?.[0]?.url,
    /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/,
  )
  assert.equal(aiClothesChangerContent.topTool?.sampleImages?.[0]?.width, 1600)
  assert.equal(aiClothesChangerContent.topTool?.sampleImages?.[0]?.height, 900)
  assert.match(aiImageToolSource, /preset\.referenceImage \|\| preset\.image/)
  assert.match(aiImageToolSource, /requestClothingReferenceFiles/)
  assert.match(aiImageToolSource, /requestClothingReferenceRemoteUrls/)
})

test('AI Clothes Changer renders clothing presets as four compact import shortcuts', () => {
  const presetShortcutBlock = aiImageToolSource.slice(
    aiImageToolSource.indexOf('{visiblePromptPresets.map((preset) => {'),
    aiImageToolSource.indexOf('})}', aiImageToolSource.indexOf('{visiblePromptPresets.map((preset) => {')) + 3,
  )

  assert.match(aiImageToolSource, /shouldRenderWorkflowTabsAboveUpload\s*\? 'grid grid-cols-4 gap-2'/)
  assert.match(presetShortcutBlock, /aspect-\[3\/4\]/)
  assert.match(presetShortcutBlock, /object-contain/)
  assert.doesNotMatch(presetShortcutBlock, /aria-pressed/)
  assert.doesNotMatch(presetShortcutBlock, /isSelected\s*\?|ring-2 ring-\[#4F46E5\]/)
  assert.match(
    aiImageToolSource,
    /if \(promptPresetTabs\.length > 0\) \{[\s\S]*setSelectedPromptPreset\(''\)[\s\S]*applyPromptPresetReferenceImage\(undefined\)[\s\S]*return/,
  )
})

test('AI Clothes Changer uses Seedream 5.0 Lite for generation', () => {
  assert.equal(aiClothesChangerContent.topTool?.modelId, 'seedream-5-0-lite')
  assert.doesNotMatch(JSON.stringify(aiClothesChangerContent), /GPT Image 2/)
})

test('AI Breast Expansion renders three full-width line illustration prompt choices', () => {
  const presets = aiBreastExpansionContent.topTool?.functionalAcceptance?.presets || []

  assert.equal(presets.length, 3)
  for (const preset of presets) {
    assert.equal(preset.group, 'breast-expansion-level')
    assert.equal(preset.image, undefined)
    assert.equal(preset.referenceImage, undefined)
    assert.equal(preset.swatch, undefined)
  }
  assert.match(aiImageToolSource, /BREAST_EXPANSION_PRESET_GROUP = 'breast-expansion-level'/)
  assert.match(aiImageToolSource, /const BreastExpansionPresetIcon/)
  assert.match(aiImageToolSource, /hasBreastExpansionPromptPresets[\s\S]*\? 'grid grid-cols-3 gap-2'/)
})

test('AI Breast Expansion is discoverable from public Toolaze entry points in every locale', () => {
  assert.match(navigationSource, /aiBreastExpansion/)
  assert.match(navigationSource, /href: '\/ai-breast-expansion'/)
  assert.match(footerSource, /aiBreastExpansion/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-breast-expansion'\)\}/)
  assert.match(homepageGridToolsSource, /\{ id: 'ai-breast-expansion', usesAi: true \}/)
  assert.match(homeAdvancedAiCardImagesSource, /'ai-breast-expansion'/)
  assert.match(homeAdvancedAiCardImagesSource, /\/ai-breast-expansion\/demo-before-after\.webp/)
  assert.match(aiToolsCopySource, /breastExpansion:/)
  assert.match(aiToolsCopySource, /href: '\/ai-breast-expansion'/)
  assert.match(aiToolsCopySource, /cardAssets\.breastExpansion/)
  assert.match(aiToolsCopySource, /'\/ai-breast-expansion': supplemental\.breastExpansion/)

  for (const locale of aiDanceLocales) {
    const common = JSON.parse(readFileSync(new URL(`../data/${locale}/common.json`, import.meta.url), 'utf8'))
    assert.ok(common.nav?.aiBreastExpansion?.trim(), `${locale} nav.aiBreastExpansion should exist`)
    assert.ok(common.footer?.aiBreastExpansion?.trim(), `${locale} footer.aiBreastExpansion should exist`)
    assert.ok(
      common.home?.homepageToolCardSummaries?.['ai-breast-expansion']?.summary?.trim(),
      `${locale} home summary should exist`,
    )
  }
})

test('AI Clothes Changer presets use four generated R2 clothing references', () => {
  const presets =
    aiClothesChangerContent.topTool?.functionalAcceptance?.presets?.filter(
      (preset) => preset.group === 'clothing-reference',
    ) || []

  assert.equal(presets.length, 4)
  for (const preset of presets) {
    assert.match(preset.image, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/)
    assert.equal(preset.referenceImage, preset.image)
  }
})

test('AI Clothes Changer prompt ideas use four 9:16 R2 images', () => {
  const promptItems = aiClothesChangerContent.promptExamples?.items || []

  assert.equal(promptItems.length, 4)
  for (const item of promptItems) {
    assert.match(item.image, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/)
  }
  assert.match(promptExamplesSource, /aspect-\[9\/16\]/)
})

test('AI Bikini Generator uses Seedream 5.0 Lite and preserves the source person except swimwear', () => {
  assert.ok(aiBikiniGeneratorContent, 'AI Bikini Generator content should exist')
  assert.equal(aiBikiniGeneratorContent.topComponent, 'gpt-image-2')
  assert.equal(aiBikiniGeneratorContent.topTool?.mode, 'image-to-image')
  assert.equal(aiBikiniGeneratorContent.topTool?.maxUploadImages, 2)
  assert.equal(aiBikiniGeneratorContent.topTool?.modelId, 'seedream-5-0-lite')
  assert.doesNotMatch(JSON.stringify(aiBikiniGeneratorContent), /GPT Image 2/i)
  assert.match(
    aiBikiniGeneratorContent.topTool?.sampleImages?.[0]?.url || '',
    /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/,
  )
  assert.equal(aiBikiniGeneratorContent.topTool?.sampleImages?.[0]?.width, 1600)
  assert.equal(aiBikiniGeneratorContent.topTool?.sampleImages?.[0]?.height, 900)

  const bikiniReferencePresets =
    aiBikiniGeneratorContent.topTool?.functionalAcceptance?.presets?.filter(
      (preset) => preset.group === 'bikini-reference',
    ) || []
  assert.equal(bikiniReferencePresets.length, 10)
  assert.equal(bikiniReferencePresets[0]?.label, 'Classic Black Bikini')
  for (const preset of bikiniReferencePresets) {
    assert.match(preset.image, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/)
    assert.equal(preset.referenceImage, preset.image)
  }

  const prompts = [
    aiBikiniGeneratorContent.topTool?.defaultPrompt,
    ...(aiBikiniGeneratorContent.topTool?.functionalAcceptance?.presets || []).map((preset) => preset.prompt),
  ]
    .filter(Boolean)
    .join('\n')

  for (const required of [
    'Keep everything else exactly the same',
    'face',
    'identity',
    'body shape',
    'body proportions',
    'pose',
    'background',
    'lighting',
    'Do not slim',
    'Do not enlarge',
    'Do not retouch',
    'Do not reshape',
    'only the visible clothing',
  ]) {
    assert.match(prompts, new RegExp(required, 'i'))
  }
})

test('AI Bikini Generator prompt ideas mirror eight bikini reference styles in every locale', () => {
  const factoryContentDirectory = '_codex/seo-pipeline/tasks/2026-07-31-ai-bikini-generator/content'

  for (const locale of aiDanceLocales) {
    const pageContent = JSON.parse(
      readFileSync(new URL(`../data/${locale}/ai-bikini-generator.json`, import.meta.url), 'utf8'),
    )
    const factoryContent = JSON.parse(readFileSync(`${factoryContentDirectory}/${locale}.json`, 'utf8'))

    for (const content of [pageContent, factoryContent]) {
      const referencePresets =
        content.topTool?.functionalAcceptance?.presets?.filter((preset) => preset.group === 'bikini-reference') || []
      const promptItems = content.promptExamples?.items || []

      assert.equal(promptItems.length, 8, locale)
      assert.match(promptExamplesSource, /lg:grid-cols-4/)

      referencePresets.slice(0, 8).forEach((preset, index) => {
        const promptItem = promptItems[index]
        assert.equal(promptItem.title, preset.label, `${locale} prompt title ${index}`)
        assert.equal(promptItem.image, preset.image, `${locale} prompt image ${index}`)
        assert.equal(promptItem.referenceImage, preset.referenceImage, `${locale} prompt reference image ${index}`)
        assert.equal(promptItem.prompt, preset.prompt, `${locale} prompt text ${index}`)
        assert.match(promptItem.image, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/)
      })
    }
  }
})

test('AI Bikini Generator visible SEO copy is user-facing and free-claim qualified', () => {
  const factoryContentDirectory = '_codex/seo-pipeline/tasks/2026-07-31-ai-bikini-generator/content'
  const skippedKeys = new Set([
    'defaultPrompt',
    'prompt',
    'image',
    'referenceImage',
    'url',
    'color',
    'swatch',
    'recommendedMode',
    'customPromptTabId',
  ])
  const collectStrings = (value, path = []) => {
    if (typeof value === 'string') {
      if (path.includes('sectionsOrder')) return []
      return skippedKeys.has(path.at(-1)) ? [] : [value]
    }
    if (Array.isArray(value)) {
      return value.flatMap((item, index) => collectStrings(item, [...path, String(index)]))
    }
    if (value && typeof value === 'object') {
      return Object.entries(value).flatMap(([key, item]) => collectStrings(item, [...path, key]))
    }
    return []
  }

  for (const locale of aiDanceLocales) {
    const pageContent = JSON.parse(
      readFileSync(new URL(`../data/${locale}/ai-bikini-generator.json`, import.meta.url), 'utf8'),
    )
    const factoryContent = JSON.parse(readFileSync(`${factoryContentDirectory}/${locale}.json`, 'utf8'))

    for (const content of [pageContent, factoryContent]) {
      const visibleCopy = collectStrings(content).join('\n')
      assert.doesNotMatch(
        visibleCopy,
        /\b(use this page|the page is designed|search intent|SEO|keyword|ranking|AI Overview|API platform|integration)\b/i,
        locale,
      )
      assert.doesNotMatch(visibleCopy, /\b(unlimited free|free forever|no signup|no login)\b/i, locale)
      assert.match(visibleCopy, localizedFreeCreditPatterns[locale], `${locale} copy should disclose 20 signup credits`)
      assert.doesNotMatch(
        visibleCopy,
        staleTenCreditGrantPattern,
        `${locale} copy should not mention a stale 10-credit signup grant`,
      )
      if (locale !== 'en') {
        assert.doesNotMatch(
          visibleCopy,
          /prompt|outfit|ecommerce|creator|thumbnail|moodboard|shooting|styling|business|identity|pixel-level|location/i,
          locale,
        )
      }
    }
  }

  const englishVisibleCopy = collectStrings(aiBikiniGeneratorContent).join('\n')
  assert.match(englishVisibleCopy, /20 free credits/i)
  assert.match(englishVisibleCopy, /sign-up/i)
  assert.match(englishVisibleCopy, /Seedream 5\.0 Lite/i)
  assert.match(englishVisibleCopy, /10 credits/i)
})

test('AI Bikini Generator localizes visible SEO copy beyond metadata in every locale', () => {
  const englishContent = aiBikiniGeneratorContent
  const comparedPaths = [
    'metadata.description',
    'hero.desc',
    'topTool.textOverrides.uploadHelper',
    'topTool.functionalAcceptance.presetTitle',
    'topTool.functionalAcceptance.presetTabs.0.label',
    'intro.title',
    'intro.content.0.title',
    'intro.content.0.text',
    'intro.content.1.title',
    'intro.content.1.text',
    'howToUse.title',
    'howToUse.steps.0.title',
    'howToUse.steps.0.desc',
    'photoTips.title',
    'photoTips.subtitle',
    'workflowComparison.title',
    'workflowComparison.subtitle',
    'scenesTitle',
    'features.title',
    'faqTitle',
    'faq.0.q',
    'faq.0.a',
    'moreToolsLinks.0.description',
  ]
  const readPath = (content, path) => path.split('.').reduce((current, key) => current?.[key], content)

  for (const locale of aiDanceLocales.filter((item) => item !== 'en')) {
    const pageContent = JSON.parse(
      readFileSync(new URL(`../data/${locale}/ai-bikini-generator.json`, import.meta.url), 'utf8'),
    )
    const factoryContent = JSON.parse(
      readFileSync(`_codex/seo-pipeline/tasks/2026-07-31-ai-bikini-generator/content/${locale}.json`, 'utf8'),
    )

    for (const content of [pageContent, factoryContent]) {
      for (const path of comparedPaths) {
        assert.notEqual(readPath(content, path), readPath(englishContent, path), `${locale} ${path}`)
      }

      const localizedPrompts = [
        content.topTool?.defaultPrompt,
        ...(content.topTool?.functionalAcceptance?.presets || []).map((preset) => preset.prompt),
        ...(content.promptExamples?.items || []).map((item) => item.prompt),
      ]
        .filter(Boolean)
        .join('\n')
      assert.doesNotMatch(
        localizedPrompts,
        /Image 1 is|Image 2 is|original person photo|Keep everything else exactly the same|Do not slim|Do not enlarge|Do not retouch|Do not reshape|adult swimwear preview/i,
        `${locale} localized prompt text`,
      )
    }
  }
})

test('AI Dance uses a single-image upload flow without style presets', () => {
  for (const content of [aiDanceContent, aiDanceFactoryContent]) {
    assert.equal(content.topTool?.mode, 'image-to-image')
    assert.equal(content.topTool?.maxUploadImages, 1)
    assert.equal(content.topTool?.modelId, 'grok-video-1-5')
    assert.equal(content.topTool?.functionalAcceptance, undefined)
    assert.doesNotMatch(JSON.stringify(content.topTool), /preset|style/i)
    assert.doesNotMatch(JSON.stringify(content), /preset|Dance Styles|text-to-image|\bstyle\b/i)
  }
})

test('AI Dance Grok Video results are handled as video media', () => {
  assert.match(aiImageToolSource, /'grok-video-1-5'/)
  assert.match(aiImageToolSource, /const requestMediaType = getGenerationMediaType\(requestModelId\)/)
  assert.match(aiImageToolSource, /statusResult\.videoUrl/)
  assert.match(aiImageToolSource, /mediaType: requestMediaType/)
  assert.match(aiImageToolSource, /item\.mediaType === 'video'/)
  assert.match(aiImageToolSource, /<video/)
})

test('Grok Video 1.5 image upload flow supports KIE multi-image references', () => {
  const grokConfigBlock = aiImageToolSource.slice(
    aiImageToolSource.indexOf("'grok-video-1-5': {"),
    aiImageToolSource.indexOf("'seedream-4-5': {"),
  )
  const grokModelOptionBlock = aiImageToolSource.slice(
    aiImageToolSource.indexOf("id: 'grok-video-1-5'"),
    aiImageToolSource.indexOf("id: 'grok-1-5-image'"),
  )

  assert.match(grokConfigBlock, /maxImages:\s*7/)
  assert.doesNotMatch(grokModelOptionBlock, /one reference image/i)
  assert.match(imageToImageFunctionSource, /if \(isVideoGenerationModel\(model\)\) return 7;/)
  assert.match(
    aiImageGeneratorConfigSource,
    /'grok-video-1-5': \{[\s\S]*setting: \{ kind: 'resolution', options: \['480p', '720p'\], defaultValue: '480p' \}/,
  )
  assert.match(
    aiImageToolSource,
    /const getResolutionOptionsForModel = \(id: ImageModelId\): string\[] =>\s+MODEL_CONFIG\[id\]\.setting\.options/,
  )
})

test('AI Kissing Video Generator keeps its upload, duration, and prompt contracts in every locale', () => {
  const localeDirectories = readdirSync(new URL('../data/', import.meta.url)).filter((locale) =>
    existsSync(new URL(`../data/${locale}/ai-kissing-video-generator.json`, import.meta.url)),
  )
  const factoryContentDirectory = new URL(
    '../../_codex/seo-pipeline/tasks/2026-07-23-ai-kissing-video-generator/content/',
    import.meta.url,
  )

  for (const locale of localeDirectories) {
    const pageContent = JSON.parse(
      readFileSync(new URL(`../data/${locale}/ai-kissing-video-generator.json`, import.meta.url), 'utf8'),
    )
    const factoryContent = JSON.parse(readFileSync(new URL(`${locale}.json`, factoryContentDirectory), 'utf8'))

    for (const content of [pageContent, factoryContent]) {
      assert.equal(content.topTool?.maxUploadImages, 2, locale)
      assert.equal(content.topTool?.defaultVideoDurationSeconds, 5, locale)
      assert.deepEqual(content.topTool?.videoDurationOptions, [3, 5, 8, 10], locale)
      assert.equal(content.promptExamples?.items?.length, 4, locale)
    }
  }

  assert.match(l2Source, /videoDurationOptions=\{Array\.isArray\(content\.topTool\?\.videoDurationOptions\)/)
  assert.match(aiImageToolSource, /configuredVideoDurationOptions\.map\(\(option\)/)
})

test('AI Dance demo uses the latest generated video sample', () => {
  const expectedVideoUrl =
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo.mp4'
  const expectedSourceImageUrl =
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo-source.png'

  for (const content of [aiDanceContent, aiDanceFactoryContent]) {
    const sample = content.topTool?.sampleImages?.[0]
    assert.equal(sample?.mediaType, 'video')
    assert.equal(sample?.url, expectedVideoUrl)
    assert.equal(sample?.width, 16)
    assert.equal(sample?.height, 9)
    assert.deepEqual(content.topTool?.defaultImageUrls, [expectedSourceImageUrl])
  }

  assert.match(aiImageToolSource, /mediaType: image\.mediaType === 'video'/)
  assert.match(aiImageToolSource, /displayedSampleMediaType === 'video'/)
})

test('AI Dance prompt ideas support one-row 9:16 video examples', () => {
  const expectedVideos = [
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/prompt-hip-hop-stage.mp4',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/prompt-ballet-motion.mp4',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/prompt-k-pop-performance.mp4',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/prompt-latin-dance.mp4',
    'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/prompt-street-dance.mp4',
  ]

  for (const content of [aiDanceContent, aiDanceFactoryContent]) {
    assert.deepEqual(
      content.promptExamples.items.map((item) => item.video),
      expectedVideos,
    )
  }

  assert.match(promptExamplesSource, /video\?: string/)
  assert.match(promptExamplesSource, /item\.video/)
  assert.match(promptExamplesSource, /<video/)
  assert.match(promptExamplesSource, /aspect-\[9\/16\]/)
  assert.match(promptExamplesSource, /grid-flow-col/)
  assert.match(l2Source, /video\?: string/)
})

test('AI Dance Grok Video exposes duration selection and submits duration', () => {
  assert.match(aiImageToolSource, /VIDEO_DURATION_OPTIONS/)
  assert.match(aiImageToolSource, /const \[videoDurationSeconds, setVideoDurationSeconds\]/)
  assert.match(aiImageToolSource, /Video Duration/)
  assert.match(aiImageToolSource, /formData\.append\('duration', String\(requestVideoDurationSeconds\)\)/)
  assert.match(
    aiImageToolSource,
    /calculateImageGenerationCredits\(selectedModelId, resolution, videoDurationSeconds\)/,
  )
  assert.match(
    aiImageToolSource,
    /getConfiguredVideoDurationSeconds\(defaultVideoDurationSeconds, configuredVideoDurationOptions\)/,
  )
  assert.match(
    l2Source,
    /defaultVideoDurationSeconds=\{typeof content\.topTool\?\.defaultVideoDurationSeconds === 'number'/,
  )
  for (const content of [aiDanceContent, aiDanceFactoryContent]) {
    assert.equal(content.topTool?.defaultVideoDurationSeconds, 5)
  }
})

test('AI Dance public copy does not expose the provider model name', () => {
  for (const content of [aiDanceContent, aiDanceFactoryContent]) {
    assert.doesNotMatch(JSON.stringify(content), /Grok Video 1\.5/)
    assert.doesNotMatch(JSON.stringify(content), /Which model does the AI Dance Generator use\?/)
    assert.equal(content.topTool?.modelId, 'grok-video-1-5')
  }
})

test('AI Dance features section uses the wide card layout', () => {
  assert.match(featuresSource, /layout\?: 'default' \| 'wide'/)
  assert.match(featuresSource, /layout === 'wide'/)
  assert.match(featuresSource, /sectionStyle: React\.CSSProperties = isWideLayout/)
  assert.match(featuresSource, /width: '100%'/)
  assert.match(featuresSource, /max-w-6xl/)
  assert.match(featuresSource, /lg:grid-cols-2/)
  assert.doesNotMatch(featuresSource, /max-w-\[1680px\]/)
  assert.doesNotMatch(featuresSource, /2xl:grid-cols-3/)
  assert.match(l2Source, /layout=\{tool === 'ai-dance-generator' \? 'wide' : 'default'\}/)
})
