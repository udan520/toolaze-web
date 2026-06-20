#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pagePath = path.join(root, 'src/app/world-cup-ai-image-generator/page.tsx')
const pageCopyPath = path.join(root, 'src/app/world-cup-ai-image-generator/copy.ts')
const localizedPagePath = path.join(root, 'src/app/[locale]/world-cup-ai-image-generator/page.tsx')
const sitemapPath = path.join(root, 'src/app/sitemap.ts')
const aiToolsPagePath = path.join(root, 'src/app/ai-tools/page.tsx')
const homePageMainPath = path.join(root, 'src/components/home/HomePageMain.tsx')
const navigationPath = path.join(root, 'src/components/Navigation.tsx')
const footerPath = path.join(root, 'src/components/Footer.tsx')
const browserLocaleRedirectPath = path.join(root, 'src/lib/browser-locale-redirect.ts')
const siteLanguageSwitchPath = path.join(root, 'src/lib/site-language-switch.ts')
const homeAdvancedAiCardImagesPath = path.join(root, 'src/lib/home-advanced-ai-card-images.ts')
const r2AssetManifestPaths = [
  path.join(root, '_codex/world-cup-assets/r2-page-assets-manifest-2026-06-19.json'),
  path.join(root, '_codex/world-cup-assets/r2-page-assets-extra-manifest-2026-06-19.json'),
]
const generatedTemplateManifestPath = path.join(root, '_codex/world-cup-assets/template-expansion-manifest-2026-06-19.json')
const localizedCommonPaths = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'].map((locale) => ({
  locale,
  path: path.join(root, `src/data/${locale}/common.json`),
}))
const r2AssetManifest = r2AssetManifestPaths.flatMap((manifestPath) =>
  fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : []
)
const generatedTemplateManifest = fs.existsSync(generatedTemplateManifestPath)
  ? JSON.parse(fs.readFileSync(generatedTemplateManifestPath, 'utf8'))
  : []
const generatedPageTemplateItems = generatedTemplateManifest.filter((item) => /^wc-(03[0-9]|04[0-9])$/.test(item.id))
const localizedCommonData = localizedCommonPaths.map((item) => ({
  locale: item.locale,
  data: fs.existsSync(item.path) ? JSON.parse(fs.readFileSync(item.path, 'utf8')) : null,
}))
const worldCupAssetUrls = r2AssetManifest.map((item) => item.url)
const localWorldCupAssetPaths = r2AssetManifest
  .map((item) => item.localPath)
  .filter((localPath) => !localPath.includes('/references/'))
const getAssetUrl = (localPath) => r2AssetManifest.find((item) => item.localPath === localPath)?.url
const referenceAssetPaths = [
  'public/model-assets/world-cup-2026/references/male-reference.webp',
  'public/model-assets/world-cup-2026/references/female-reference.webp',
].map((assetPath) => path.join(root, assetPath))
const primaryTemplateAssetUrls = [
  '/model-assets/world-cup-2026/fan-poster.webp',
  '/model-assets/world-cup-2026/fan-edit.webp',
  '/model-assets/world-cup-2026/sticker-pack.webp',
  '/model-assets/world-cup-2026/retro-travel-poster.webp',
].map(getAssetUrl)
const expandedTemplateAssetUrls = Array.from({ length: 29 }, (_, index) =>
  getAssetUrl(`/model-assets/world-cup-2026/templates/wc-${String(index + 1).padStart(3, '0')}.webp`)
)
const allExpandedTemplateIds = Array.from({ length: 29 }, (_, index) => `wc-${String(index + 1).padStart(3, '0')}`)
const newTemplateManifestItems = Array.from({ length: 9 }, (_, index) =>
  r2AssetManifest.find((item) => item.localPath === `/model-assets/world-cup-2026/templates/wc-${String(index + 21).padStart(3, '0')}.webp`)
)
const checks = []

function read(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : ''
}

const page = read(pagePath)
const pageCopy = read(pageCopyPath)
const sitemap = read(sitemapPath)
const aiToolsPage = read(aiToolsPagePath)
const homePageMain = read(homePageMainPath)
const navigation = read(navigationPath)
const footer = read(footerPath)
const browserLocaleRedirect = read(browserLocaleRedirectPath)
const siteLanguageSwitch = read(siteLanguageSwitchPath)
const homeAdvancedAiCardImages = read(homeAdvancedAiCardImagesPath)
const templateGalleryPath = path.join(root, 'src/components/WorldCupTemplateGallery.tsx')
const templateGallery = read(templateGalleryPath)
const nanoBananaToolPath = path.join(root, 'src/components/NanoBananaTool.tsx')
const nanoBananaTool = read(nanoBananaToolPath)
const pageAndCopy = `${page}\n${pageCopy}`
const pageAndCopyLower = pageAndCopy.toLowerCase()

checks.push({
  name: 'World Cup page route exists',
  pass: fs.existsSync(pagePath),
})

checks.push({
  name: 'World Cup localized page route exists',
  pass:
    fs.existsSync(localizedPagePath) &&
    read(localizedPagePath).includes('generateStaticParams') &&
    read(localizedPagePath).includes('WorldCupAiImageGeneratorPageContent'),
})

checks.push({
  name: 'World Cup page component is named for image generation',
  pass:
    page.includes('export default async function WorldCupAiImageGeneratorPage()') &&
    !page.includes('WorldCupAiVideoGeneratorPage'),
})

checks.push({
  name: 'World Cup page targets image-only SEO intent',
  pass:
    pageAndCopy.includes('World Cup AI Image Generator') &&
    pageAndCopy.includes('AI football poster generator') &&
    pageAndCopy.includes('football fan poster maker') &&
    page.includes('world-cup-ai-image-generator') &&
    !pageAndCopy.includes('Generate World Cup inspired football posters, fan edits, stickers, watch-party ads, and social visuals with GPT Image 2, then animate the best results with Toolaze video models.'),
})

checks.push({
  name: 'World Cup page places GPT Image 2 generator at the top',
  pass:
    page.includes('NanoBananaTool') &&
    page.includes('modelId="gpt-image-2"') &&
    page.includes('id="world-cup-gpt-image-2-generator"') &&
    page.indexOf('id="world-cup-gpt-image-2-generator"') < page.indexOf('copy.templateSection.eyebrow'),
})

checks.push({
  name: 'World Cup first screen uses a light Toolaze theme',
  pass:
    page.includes('radial-gradient(circle_at_15%_10%') &&
    page.includes('bg-white p-3 text-slate-950') &&
    !page.includes('overflow-hidden bg-[#0B172A] px-4 pb-12 pt-5 text-white'),
})

checks.push({
  name: 'World Cup page removes the old tournament fact strip from the first screen',
  pass:
    !page.includes('const tournamentFacts') &&
    !page.includes('Tournament window') &&
    !page.includes('Host countries') &&
    !page.includes('Best Toolaze use') &&
    !page.includes('GPT Image 2 football creator'),
})

checks.push({
  name: 'World Cup page works without template images',
  pass:
    !page.includes('<img') &&
    !page.includes('imagegen') &&
    !page.includes('template images can be added later') &&
    !page.includes('current integration') &&
    !page.includes('the page should'),
})

checks.push({
  name: 'World Cup page stays focused on image generation instead of video workflows',
  pass:
    !page.includes('Make the football visual before you make the video') &&
    !page.includes('Use the image model for direction, then video for motion') &&
    !page.includes('A simple workflow for football AI content') &&
    !page.includes('Image to Stadium Reaction Video') &&
    !page.includes('Make video') &&
    !page.includes('/model/seedance-2') &&
    !page.includes('/model/kling-3'),
})

checks.push({
  name: 'World Cup page includes approved image-focused SEO sections',
  pass:
    pageAndCopy.includes('What can you create with this World Cup AI image generator?') &&
    pageAndCopy.includes('How to make a World Cup AI image') &&
    pageAndCopy.includes('Choose a template style') &&
    pageAndCopy.includes('Prompt tips for better football images') &&
    pageAndCopy.includes('World Cup AI image ideas for creators and small businesses') &&
    pageAndCopy.includes('Why use Toolaze for World Cup AI images?'),
})

checks.push({
  name: 'World Cup page reflects current template content in landing copy',
  pass:
    pageAndCopyLower.includes('country-color cheer photos') &&
    pageAndCopyLower.includes('face flag sticker selfies') &&
    pageAndCopyLower.includes('couple and friend fan photos') &&
    pageAndCopyLower.includes('fan trading cards') &&
    pageAndCopyLower.includes('comic reactions') &&
    pageAndCopyLower.includes('boarding-pass travel graphics'),
})

checks.push({
  name: 'World Cup page shows generated image templates',
  pass:
    page.includes('WorldCupTemplateGallery') &&
    primaryTemplateAssetUrls.every((url) => url && page.includes(url)) &&
    page.includes('Create a cinematic football fan poster') &&
    page.includes('Create a clean football fan sticker pack'),
})

checks.push({
  name: 'World Cup page includes all generated template assets',
  pass:
    allExpandedTemplateIds.every((id) => page.includes(`id: '${id}'`)) &&
    expandedTemplateAssetUrls.every((url) => url && page.includes(url)),
})

checks.push({
  name: 'World Cup page includes the latest generated World Cup template assets',
  pass:
    generatedPageTemplateItems.length >= 18 &&
    generatedPageTemplateItems.every(
      (item) =>
        page.includes(`id: '${item.id}'`) &&
        page.includes(`title: '${item.title}'`) &&
        page.includes(item.r2Url) &&
        page.includes(`referenceImage: '${item.referenceImage}'`) &&
        item.mime === 'image/webp' &&
        item.size <= 100 * 1024 &&
        item.width * 4 === item.height * 3
    ),
})

checks.push({
  name: 'World Cup page places latest generated templates first',
  pass: page.includes('const allTemplateExamples = [...latestGeneratedTemplateExamples, ...templateExamples, ...expandedTemplateExamples]'),
})

checks.push({
  name: 'World Cup original template assets use R2 URLs and no stale local page paths',
  pass:
    r2AssetManifest.length >= 24 &&
    [...primaryTemplateAssetUrls, ...expandedTemplateAssetUrls].every((url) => url && url.startsWith('https://')) &&
    localWorldCupAssetPaths.every((localPath) => !page.includes(localPath)),
})

checks.push({
  name: 'World Cup discovery thumbnails use existing R2 images, not removed local assets',
  pass:
    !aiToolsPage.includes('/model-assets/world-cup-2026/fan-poster.webp') &&
    !homeAdvancedAiCardImages.includes('/model-assets/world-cup-2026/fan-poster.webp') &&
    !navigation.includes('/model-assets/world-cup-2026/fan-poster.webp') &&
    [aiToolsPage, homeAdvancedAiCardImages, navigation].every((source) =>
      source.includes('https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp')
    ),
})

checks.push({
  name: 'World Cup discovery copy stays focused on still images',
  pass:
    !aiToolsPage.includes('video key frames') &&
    !homePageMain.includes('video key frame') &&
    !aiToolsPage.includes('animate the best results'),
})

checks.push({
  name: 'World Cup discovery text is translated in every supported site locale',
  pass: localizedCommonData.every(({ data }) => {
    const navLabel = data?.nav?.worldCupAiImageGenerator
    const footerLabel = data?.footer?.worldCupAiImageGenerator
    const card = data?.home?.homepageToolCardSummaries?.['world-cup-ai-image-generator']
    return (
      typeof navLabel === 'string' &&
      navLabel.trim() &&
      typeof footerLabel === 'string' &&
      footerLabel.trim() &&
      typeof card?.cardTitle === 'string' &&
      card.cardTitle.trim() &&
      typeof card?.summary === 'string' &&
      card.summary.trim() &&
      !card.summary.includes('video key frame') &&
      !card.summary.includes('video keyframe')
    )
  }),
})

checks.push({
  name: 'World Cup uploaded template assets do not fall back to local page paths',
  pass: localWorldCupAssetPaths.every((localPath) => !page.includes(localPath)),
})

checks.push({
  name: 'World Cup new template manifest assets are optimized WebP files under 100KB',
  pass: newTemplateManifestItems.every((item) => item && item.mime === 'image/webp' && item.size <= 100 * 1024),
})

checks.push({
  name: 'World Cup template previews show full images without cropping',
  pass: templateGallery.includes('object-contain') && !templateGallery.includes('object-cover'),
})

checks.push({
  name: 'World Cup template gallery uses four cards per row with copy and create actions',
  pass:
    templateGallery.includes('lg:grid-cols-4') &&
    page.includes('labels={copy.templateGallery}') &&
    templateGallery.includes('galleryLabels.copyPrompt') &&
    templateGallery.includes('galleryLabels.createSimilar') &&
    templateGallery.includes('navigator.clipboard.writeText') &&
    !templateGallery.includes('md:grid-cols-[0.9fr_1.1fr]'),
})

checks.push({
  name: 'World Cup template gallery visible labels are locale-aware',
  pass:
    page.includes('localizeTemplateItems(') &&
    page.includes('copy.templateGallery.templateTitlePrefix') &&
    templateGallery.includes('labels: {') &&
    templateGallery.includes('galleryLabels.allCategory') &&
    !templateGallery.includes("labels?:") &&
    !templateGallery.includes("copyPrompt: 'Copy prompt'") &&
    !templateGallery.includes("allCategory: 'All'") &&
    ['All', 'Alle', 'Todo', 'Tout', 'Tutto', 'Tudo', 'すべて', '전체', '全部'].every((label) =>
      pageCopy.includes(`allCategory: '${label}'`)
    ) &&
    ['Template', 'Vorlage', 'Plantilla', 'Modèle', 'Modello', 'Modelo', 'テンプレート', '템플릿', '模板'].every((label) =>
      pageCopy.includes(`templateTitlePrefix: '${label}'`)
    ),
})

checks.push({
  name: 'World Cup template prompt text scrolls after three lines',
  pass:
    templateGallery.includes('h-[4.5rem]') &&
    templateGallery.includes('overflow-y-auto') &&
    !templateGallery.includes('WebkitLineClamp: 3'),
})

checks.push({
  name: 'World Cup generator fills the first screen and keeps prompt/demo areas constrained',
  pass:
    page.includes('flex h-[100svh] flex-col overflow-hidden') &&
    nanoBananaTool.includes('flex min-h-0 flex-1 flex-col overflow-hidden') &&
    nanoBananaTool.includes('h-[10.5rem] w-full resize-none overflow-y-auto') &&
    nanoBananaTool.includes('rows={6}') &&
    nanoBananaTool.includes('max-h-full max-w-full') &&
    nanoBananaTool.includes("height: '100%'") &&
    nanoBananaTool.includes("width: 'auto'"),
})

checks.push({
  name: 'World Cup Create similar positions inserted prompts at the first line',
  pass:
    nanoBananaTool.includes('textarea.setSelectionRange(0, 0)') &&
    nanoBananaTool.includes('textarea.scrollTop = 0'),
})

checks.push({
  name: 'World Cup Create similar uses source reference images instead of rendered results',
  pass:
    page.includes('referenceImage:') &&
    worldCupAssetUrls.includes('https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/2f7e02a626ad467085366dbd5b438d53.webp') &&
    worldCupAssetUrls.includes('https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/ca3b5b87ba61497aacecfbd0b80713b6.webp') &&
    page.includes('/model-assets/world-cup-2026/references/male-reference.webp') &&
    page.includes('/model-assets/world-cup-2026/references/female-reference.webp') &&
    referenceAssetPaths.every((assetPath) => fs.existsSync(assetPath) && fs.statSync(assetPath).size <= 100 * 1024) &&
    templateGallery.includes('referenceImage?: string') &&
    templateGallery.includes('const referenceImage = item.referenceImage') &&
    templateGallery.includes('imageUrl: referenceImage') &&
    templateGallery.includes('demoImageUrl: item.image') &&
    !templateGallery.includes('imageUrl: item.image'),
})

checks.push({
  name: 'World Cup page avoids heavy rights and brand-safety sections',
  pass:
    !pageAndCopy.includes('World Cup content ideas that do not need official footage') &&
    !pageAndCopy.includes('Rights and quality checks') &&
    !pageAndCopy.includes('Keep football content brand-safe') &&
    !pageAndCopy.includes('Use official sources for tournament details') &&
    pageAndCopy.includes('Toolaze is an independent creative tool and is not affiliated with FIFA.'),
})

checks.push({
  name: 'World Cup page avoids internal SEO and planning language',
  pass:
    !page.includes('keyword strategy') &&
    !page.includes('AI Overview') &&
    !page.includes('GEO Summary') &&
    !page.includes('Answer First') &&
    !page.includes('Prompt Remix System') &&
    !page.includes('the page should') &&
    !page.includes('current integration'),
})

checks.push({
  name: 'World Cup page is included in sitemap',
  pass:
    sitemap.includes('/world-cup-ai-image-generator') &&
    sitemap.includes('${locale}/world-cup-ai-image-generator') &&
    sitemap.includes("if (locale === 'en') return") &&
    !sitemap.includes('/world-cup-ai-video-generator'),
})

checks.push({
  name: 'World Cup tool is discoverable from AI tools hub',
  pass:
    aiToolsPage.includes('/world-cup-ai-image-generator') &&
    aiToolsPage.includes('World Cup AI Image Generator'),
})

checks.push({
  name: 'World Cup tool is discoverable from homepage Advanced AI tools',
  pass:
    homePageMain.includes('/world-cup-ai-image-generator') &&
    homePageMain.includes('World Cup AI Image Generator'),
})

checks.push({
  name: 'World Cup tool is discoverable from desktop and mobile AI Tools navigation',
  pass:
    navigation.includes('/world-cup-ai-image-generator') &&
    navigation.includes('worldCupAiImageGenerator'),
})

checks.push({
  name: 'World Cup tool is discoverable from footer AI Tools navigation',
  pass:
    footer.includes('/world-cup-ai-image-generator') &&
    footer.includes('worldCupAiImageGenerator'),
})

checks.push({
  name: 'World Cup route supports language switching instead of forcing English',
  pass:
    siteLanguageSwitch.includes("'world-cup-ai-image-generator': ALL_LOCALE_CODES") &&
    !siteLanguageSwitch.includes("new Set<string>(['world-cup-ai-image-generator'])") &&
    !browserLocaleRedirect.includes("root==='world-cup-ai-image-generator'"),
})

checks.push({
  name: 'World Cup page body copy is localized beyond shared navigation labels',
  pass:
    fs.existsSync(pageCopyPath) &&
    page.includes('getWorldCupPageCopy(locale)') &&
    page.includes('copy.hero.highlight') &&
    page.includes('copy.faq.items.map') &&
    read(localizedPagePath).includes('getWorldCupPageCopy(locale)') &&
    pageCopy.includes('WM-KI-Bildgenerator') &&
    pageCopy.includes('ワールドカップAI画像ジェネレーター') &&
    pageCopy.includes('Generador de imágenes con IA para el Mundial') &&
    pageCopy.includes('Gerador de imagens de IA da Copa do Mundo') &&
    pageCopy.includes('世界盃 AI 圖像生成器'),
})

checks.push({
  name: 'World Cup localized SEO sections do not inherit the English body copy',
  pass:
    pageCopy.includes("const de = buildCopy({") &&
    pageCopy.includes("const es = buildCopy({") &&
    pageCopy.includes("const fr = buildCopy({") &&
    pageCopy.includes("const it = buildCopy({") &&
    pageCopy.includes("const pt = buildCopy({") &&
    pageCopy.includes("const ja = buildCopy({") &&
    pageCopy.includes("const ko = buildCopy({") &&
    pageCopy.includes("const zhTW = buildCopy({") &&
    !pageCopy.includes('localize(en') &&
    !pageCopy.includes("const de = localize") &&
    !pageCopy.includes("const ja = localize") &&
    pageCopy.includes('Warum Toolaze') &&
    pageCopy.includes('Ideas de imagen') &&
    pageCopy.includes('画像アイデア') &&
    pageCopy.includes('이미지 아이디어') &&
    pageCopy.includes('圖像想法'),
})

const failed = checks.filter((check) => !check.pass)

for (const check of checks) {
  console.log(`${check.pass ? '✓' : '✗'} ${check.name}`)
}

if (failed.length > 0) {
  console.error(`\n${failed.length} World Cup page checks failed.`)
  process.exit(1)
}

console.log('\nWorld Cup page checks passed.')
