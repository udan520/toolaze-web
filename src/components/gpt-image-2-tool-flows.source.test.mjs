import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const watermarkSource = readFileSync(new URL('./WatermarkRemover.tsx', import.meta.url), 'utf8')
const l2Source = readFileSync(new URL('./blocks/ToolL2PageContent.tsx', import.meta.url), 'utf8')
const featuresSource = readFileSync(new URL('./blocks/Features.tsx', import.meta.url), 'utf8')
const promptExamplesSource = readFileSync(new URL('./blocks/PromptExamples.tsx', import.meta.url), 'utf8')
const aiImageToolSource = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
const navigationSource = readFileSync(new URL('./Navigation.tsx', import.meta.url), 'utf8')
const footerSource = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')
const homePageSource = readFileSync(new URL('./home/HomePageMain.tsx', import.meta.url), 'utf8')
const homeModelCardImagesSource = readFileSync(new URL('../lib/home-model-card-images.ts', import.meta.url), 'utf8')
const aiToolsCopySource = readFileSync(new URL('../app/ai-tools/copy.ts', import.meta.url), 'utf8')
const siteLanguageSwitchSource = readFileSync(new URL('../lib/site-language-switch.ts', import.meta.url), 'utf8')
const sitemapSource = readFileSync(new URL('../app/sitemap.ts', import.meta.url), 'utf8')
const localeAiDancePageSource = readFileSync(new URL('../app/[locale]/ai-dance-generator/page.tsx', import.meta.url), 'utf8')
const aiDanceContent = JSON.parse(readFileSync(new URL('../data/en/ai-dance-generator.json', import.meta.url), 'utf8'))
const aiDanceFactoryContent = JSON.parse(readFileSync('_codex/seo-pipeline/tasks/2026-07-20-ai-dance-generator/content/en.json', 'utf8'))
const aiDanceLocales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW']
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

test('AI Dance is discoverable from global navigation, footer, homepage, and AI Tools hub', () => {
  assert.match(navigationSource, /aiDanceGenerator/)
  assert.match(navigationSource, /href=\{getLocalizedHref\('\/ai-dance-generator'\)\}/)
  assert.doesNotMatch(
    navigationSource,
    /href=\{getLocalizedHref\('\/ai-dance-generator'\)\}\s+onClick=\{\(\) => setOpenDesktopMenu\(null\)\}\s+className="order-[0-9]+ hover:text-indigo-600 transition-colors whitespace-nowrap"/s,
  )
  assert.match(footerSource, /aiDanceGenerator/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-dance-generator'\)\}/)
  assert.match(homePageSource, /loadToolData\(\s*'ai-dance-generator'/)
  assert.match(homeModelCardImagesSource, /'ai-dance-generator'/)
  assert.match(aiToolsCopySource, /cardAssets\.dance/)
  assert.match(aiToolsCopySource, /\/model-assets\/ai-dance-generator\/ai-dance-demo-source\.png/)
  assert.doesNotMatch(aiToolsCopySource, /Grok/)
})

test('Grok 1.5 Video is discoverable from AI Video navigation, footer, and homepage models', () => {
  assert.match(navigationSource, /grok15Video/)
  assert.match(navigationSource, /href=\{getLocalizedHref\('\/ai-video-generator'\)\}[\s\S]*grok15Video/)
  assert.match(footerSource, /grok15Video/)
  assert.match(footerSource, /href=\{getLocalizedHref\('\/ai-video-generator'\)\}[\s\S]*grok15Video/)
  assert.match(homePageSource, /tool: 'grok-1-5-video'/)
  assert.match(homePageSource, /href: '\/ai-video-generator'/)
})

test('AI Video model links follow Dance and show manufacturer icons', () => {
  const desktopAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* 一级菜单：AI Video */}')),
  )
  const mobileAiVideoBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Video 部分 */}'),
    navigationSource.indexOf("href={getLocalizedHref('/pricing')}", navigationSource.indexOf('{/* AI Video 部分 */}')),
  )

  for (const block of [desktopAiVideoBlock, mobileAiVideoBlock]) {
    const orderedRoutes = [
      '/ai-dance-generator',
      '/model/seedance-2-5',
      '/model/seedance-2',
      '/model/kling-3',
      '/model/grok-imagine-video-1-5',
    ]
    const routeIndexes = orderedRoutes.map((route) => block.indexOf(`href={getLocalizedHref('${route}')}`))

    assert.ok(routeIndexes.every((index) => index >= 0))
    assert.deepEqual(routeIndexes, [...routeIndexes].sort((a, b) => a - b))
    assert.match(block, /href=\{getLocalizedHref\('\/model\/seedance-2-5'\)\}[\s\S]*?<img src="\/model-logos\/bytedance\.svg"/)
    assert.match(block, /href=\{getLocalizedHref\('\/model\/seedance-2'\)\}[\s\S]*?<img src="\/model-logos\/bytedance\.svg"/)
    assert.match(block, /href=\{getLocalizedHref\('\/model\/kling-3'\)\}[\s\S]*?<img src="\/model-logos\/kling\.svg"/)
    assert.match(block, /href=\{getLocalizedHref\('\/model\/grok-imagine-video-1-5'\)\}[\s\S]*?<img src="\/model-logos\/grok\.svg"/)
  }
})

test('AI Image model links show their manufacturer icons on desktop and mobile', () => {
  const desktopAiImageBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Image */}'),
    navigationSource.indexOf('{/* 一级菜单：AI Video */}'),
  )
  const mobileAiImageBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Image 部分 */}'),
    navigationSource.indexOf('{/* AI Video 部分 */}'),
  )
  const modelIcons = [
    ['/model/gpt-image-2', '/model-logos/openai.svg'],
    ['/model/seedream-5-0-pro', '/model-logos/bytedance.svg'],
    ['/model/wan-2-7-image', '/model-logos/wan.ico'],
    ['/model/nano-banana-pro', '/model-logos/google-gemini.png'],
    ['/model/nano-banana-2', '/model-logos/google-gemini.png'],
    ['/model/seedream-4-5', '/model-logos/bytedance.svg'],
    ['/model/seedream-5-0-lite', '/model-logos/bytedance.svg'],
  ]

  for (const block of [desktopAiImageBlock, mobileAiImageBlock]) {
    for (const [route, icon] of modelIcons) {
      const linkStart = block.indexOf(`href={getLocalizedHref('${route}')}`)
      const nextLink = block.indexOf('<Link', linkStart + 1)
      const link = block.slice(linkStart, nextLink >= 0 ? nextLink : block.length)
      assert.ok(linkStart >= 0, `${route} should be present in AI Image navigation`)
      assert.match(link, new RegExp(`<img src="${icon.replaceAll('.', '\\.')}`))
    }
  }
})

test('AI Dance is the first AI Tools menu item with a localized Hot label', () => {
  const desktopAiToolsBlock = navigationSource.slice(
    navigationSource.indexOf('{/* 一级菜单：AI Tools */}'),
    navigationSource.indexOf('{/* 一级菜单：AI Image */}'),
  )
  const mobileAiToolsBlock = navigationSource.slice(
    navigationSource.indexOf('{/* AI Tools 部分 */}'),
    navigationSource.indexOf('{/* AI Image 部分 */}'),
  )

  for (const block of [desktopAiToolsBlock, mobileAiToolsBlock]) {
    const danceIndex = block.indexOf("href={getLocalizedHref('/ai-dance-generator')}")
    const hairstyleIndex = block.indexOf("href={getLocalizedHref('/ai-hairstyle-changer')}")
    const worldCupIndex = block.indexOf("href={getLocalizedHref('/world-cup-ai-image-generator')}")
    const watermarkIndex = block.indexOf("href={getLocalizedHref('/watermark-remover')}")
    const restorationIndex = block.indexOf("href={getLocalizedHref('/photo-restoration')}")
    const viewAllIndex = block.indexOf("href={getLocalizedHref('/ai-tools')}")

    assert.notEqual(danceIndex, -1)
    assert.notEqual(hairstyleIndex, -1)
    assert.notEqual(worldCupIndex, -1)
    assert.notEqual(watermarkIndex, -1)
    assert.notEqual(restorationIndex, -1)
    assert.notEqual(viewAllIndex, -1)
    assert.ok(danceIndex < hairstyleIndex)
    assert.ok(worldCupIndex < watermarkIndex)
    assert.ok(watermarkIndex < restorationIndex)
    assert.ok(restorationIndex < viewAllIndex)
    assert.match(block, /navTranslations\.hot \|\| defaultNavTranslations\.hot/)
    assert.match(block, /bg-red-500 px-1\.5 py-0\.5 text-\[10px\] font-extrabold leading-none text-white/)
    assert.doesNotMatch(block, /bg-rose-50/)
  }
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
  assert.match(navigationSource, /className="hidden lg:flex gap-4 xl:gap-5 text-sm font-bold text-slate-700 items-center"/)
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

test('AI Dance demo uses the latest generated video sample', () => {
  const expectedVideoUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo.mp4'
  const expectedSourceImageUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/ai-dance-generator/ai-dance-demo-source.png'

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
  assert.match(aiImageToolSource, /calculateImageGenerationCredits\(selectedModelId, resolution, videoDurationSeconds\)/)
  assert.match(aiImageToolSource, /getConfiguredVideoDurationSeconds\(defaultVideoDurationSeconds\)/)
  assert.match(l2Source, /defaultVideoDurationSeconds=\{typeof content\.topTool\?\.defaultVideoDurationSeconds === 'number'/)
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
