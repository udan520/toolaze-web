import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'kling-2-6-pro-motion-control'
const taskId = '2026-08-02-kling-2-6-pro-motion-control'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const klingReferenceImage = 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/character-reference.jpg'
const klingReferenceVideo = 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-reference-video.mp4'
const klingDemoVideo = 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo.mp4'
const klingDemoPoster = 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo-poster.webp'
const motionControlSectionOrder = ['modelIntro', 'performanceMetrics', 'howToUse', 'scenes', 'faq']

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function countOccurrences(source, value) {
  return source.split(value).length - 1
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'defaultMode',
    'duration',
    'featuredColumn',
    'href',
    'icon',
    'iconType',
    'image',
    'initialCharacterOrientation',
    'initialImageUrls',
    'initialMotionVideoDurationSeconds',
    'initialMotionVideoUrls',
    'layout',
    'logoAlt',
    'logoSrc',
    'media',
    'modelId',
    'poster',
    'published',
    'referenceImage',
    'sectionsOrder',
    'seoFactoryTaskId',
    'sourceHistory',
    'src',
    'topComponent',
    'uploadDate',
    'video',
    'width',
    'height',
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

test('Kling 2.6 Pro Motion Control exposes English and localized model routes', () => {
  assert.ok(existsSync(join(root, 'src', 'app', 'model', slug, 'page.tsx')), 'English model route should exist')
  const localizedRoute = readFileSync(join(root, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')
  assert.match(localizedRoute, new RegExp(`'${slug}'`), 'localized model route should map the Kling 2.6 motion control slug')
  assert.match(localizedRoute, /generateHreflangAlternates/, 'localized model routes should generate hreflang alternates')
  assert.match(localizedRoute, /languages:\s*hreflang\.languages/, 'localized model routes should expose alternate language URLs')
})

test('Kling 2.6 Pro Motion Control content is localized and traceable to SEO Factory', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.status === 'ready_for_publish'))

  const task = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json'))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'l2')
  assert.equal(task.status, 'ready_for_publish')
  assert.match(task.releaseBoundary, /navigation/i)
  assert.match(task.releaseBoundary, /Footer/i)
  assert.match(task.releaseBoundary, /model hub/i)
  assert.match(task.releaseBoundary, /sitemap/i)

  const englishContent = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))

  for (const locale of locales) {
    const publicContent = readJson(join(root, 'src', 'data', locale, `${slug}.json`))
    const factoryContent = readJson(join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', `${locale}.json`))

    assert.deepEqual(factoryContent, publicContent, `${locale} Factory content should match public data`)
    assert.ok(task.files.includes(`src/data/${locale}/${slug}.json`), `${locale} data path should be tracked in SEO Factory task`)
    assert.ok(task.files.includes(`_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`), `${locale} Factory content path should be tracked in SEO Factory task`)
    assert.equal(publicContent.seoFactoryTaskId, taskId)
    assert.equal(publicContent.metadata.published, true)
    assert.equal(publicContent.topComponent, slug)
    assert.equal(publicContent.topTool.modelId, 'kling-2-6-motion-control')
    assert.equal(publicContent.topTool.defaultMode, 'image-to-video')
    assert.match(publicContent.topTool.displayName, /Kling 2\.6/)
    assert.deepEqual(publicContent.topTool.initialImageUrls, [klingReferenceImage])
    assert.deepEqual(publicContent.topTool.initialMotionVideoUrls, [klingReferenceVideo])
    assert.equal(publicContent.topTool.initialMotionVideoDurationSeconds, 7.934)
    assert.equal(publicContent.topTool.initialCharacterOrientation, 'video')
    assert.equal(publicContent.heroDemoVideo?.src, klingDemoVideo)
    assert.equal(publicContent.heroDemoVideo?.poster, klingDemoPoster)
    assert.equal(publicContent.heroDemoVideo?.width, 16)
    assert.equal(publicContent.heroDemoVideo?.height, 9)
    assert.match(publicContent.heroDemoVideo?.src || '', /\.mp4$/)
    assert.match(publicContent.heroDemoVideo?.poster || '', /\.webp$/)
    assert.match(publicContent.topTool.initialImageUrls?.[0] || '', /\.(?:jpg|jpeg|png)$/)
    assert.match(publicContent.topTool.initialMotionVideoUrls?.[0] || '', /\.mp4$/)
    assert.ok(publicContent.topTool.initialImageUrls?.[0]?.startsWith('https://'), `${locale} reference image should use a public R2 URL`)
    assert.ok(publicContent.topTool.initialMotionVideoUrls?.[0]?.startsWith('https://'), `${locale} reference video should use a public R2 URL`)
    assert.ok(publicContent.heroDemoVideo?.src?.startsWith('https://'), `${locale} hero demo video should use a public R2 URL`)
    assert.ok(publicContent.heroDemoVideo?.poster?.startsWith('https://'), `${locale} hero demo poster should use a public R2 URL`)
    assert.deepEqual(publicContent.sectionsOrder, motionControlSectionOrder, `${locale} should follow the shortened model SEO section order`)
    assert.equal('promptExamples' in publicContent, false, `${locale} should omit Prompt Examples when the generator has no prompt input`)
    assert.equal('troubleshooting' in publicContent, false, `${locale} should omit Prompt Tips / Troubleshooting when the generator has no prompt input`)
    assert.equal(publicContent.howToUse.steps.length, 4)
    assert.ok([3, 6].includes(publicContent.scenes.length), `${locale} use-case cards should keep a 3- or 6-card layout`)
    assert.ok(publicContent.modelIntro.title)
    assert.equal('featureCards' in publicContent.modelIntro, false, `${locale} What Is block should not render extra feature cards under the new model SEO skill`)
    assert.match(publicContent.modelIntro.title, /Motion Control|动作控制|動作控制|モーション|Movimiento|Mouvement|Movimento|모션/i, `${locale} intro should be the model SEO What Is block for Motion Control`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /720p.*1080p|1080p.*720p/i.test(`${item.value || ''}`)), `${locale} specs should show Toolaze resolutions`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /100s?MB|100MB/i.test(`${item.value || ''}`)), `${locale} specs should show the motion reference video size limit`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /MP4/i.test(`${item.value || ''}`) && /QuickTime/i.test(`${item.value || ''}`) && /Matroska/i.test(`${item.value || ''}`)), `${locale} specs should show MP4, QuickTime, and Matroska as supported video formats`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /3\s*(?:-|–|to|a|à|bis|から|到|至|~)\s*30/i.test(`${item.value || ''}`)), `${locale} specs should show the 3-30 second motion reference video range`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /motion reference video|reference video|动作参考视频|動作參考影片|動作參考視頻|モーション参照動画|Bewegungsvideo|Bewegungsreferenzvideo|vídeo de movimiento|vídeo de referencia|video de movimiento|video de referencia|vídeo de movimento|vídeo de referência|vidéo de mouvement|vidéo de référence|video di movimento|video di riferimento|motion video|모션 참조 비디오|모션 참조 영상/i.test(`${item.value || ''}`)), `${locale} specs should show motion reference video support`)
    assert.ok(publicContent.performanceMetrics.metrics.some((item) => /22/.test(`${item.value || ''}`) && /duration|时长|時長|長さ|Dauer|duración|duração|durée|durata|길이/i.test(`${item.value || ''}`)), `${locale} specs should show credit guidance tied to reference-video duration`)
    assert.equal(publicContent.modelComparison, undefined, `${locale} rewrite should remove the same-family comparison block`)
    assert.equal(publicContent.competitorComparison, undefined, `${locale} rewrite should remove the cross-model comparison block`)
    assert.equal(publicContent.testimonials, undefined, `${locale} rewrite should remove generic creator comments`)
    if (locale === 'en') {
      assert.match(publicContent.scenesTitle, /When Kling 2\.6 Pro Motion Control Is Enough/i, 'English rewrite should rename use cases around 2.6-specific fit')
    }
    assert.doesNotMatch(
      collectVisibleStrings(publicContent).join('\n'),
      /model page|Best for|Use this section|the page|SEO|keyword|ranking|search intent|AI Overview|current integration|placeholder|KIE|API platform|provider route|No Signup|No Login|Unlimited Free|Free Forever/i,
      `${locale} visible copy should not expose SEO/editor/internal page language or unverified access claims`
    )
    const visibleCopy = collectVisibleStrings(publicContent).join('\n')
    assert.match(visibleCopy, /character image|角色图|角色圖片|参照画像|キャラクター画像|Bild|imagen|image|immagine|캐릭터 이미지/i, `${locale} copy should explain the required character image`)
    assert.match(visibleCopy, /motion reference video|动作参考视频|動作參考影片|動作參考視頻|モーション参照動画|Bewegungsvideo|Bewegungsreferenzvideo|vídeo de movimiento|vídeo de referencia|video de referencia|vídeo de movimento|vídeo de referência|vidéo de mouvement|vidéo de référence|video di movimento|video di riferimento|모션 참조 비디오|모션 참조 영상/i, `${locale} copy should explain the required motion reference video`)
    assert.match(visibleCopy, /image-to-video|image-plus-video|still character image|character image plus|图像转视频|圖片轉影片|圖片加影片|画像から動画|画像と動画|Bild-zu-Video|Bild-plus-Video|imagen a vídeo|imagen a video|imagen más vídeo|imagem para vídeo|imagem mais vídeo|image vers vidéo|image plus vidéo|immagine in video|immagine più video|이미지-투-비디오|이미지와 영상/i, `${locale} copy should describe Motion Control as image-to-video`)
    assert.match(visibleCopy, /MP4[\s\S]{0,80}QuickTime[\s\S]{0,80}Matroska/i, `${locale} visible copy should show KIE-supported motion video formats`)
    assert.match(visibleCopy, /3\s*(?:-|–|to|a|à|bis|から|到|至|~)\s*30/i, `${locale} visible copy should show the 3-30 second reference video length`)
    assert.match(visibleCopy, /duration follows|时长跟随|時長跟隨|長さは.*従|Dauer.*folgt|duración.*sigue|duração.*segue|durée.*suit|durata.*segue|길이.*따릅니다/i, `${locale} visible copy should explain output duration follows the uploaded motion reference video`)
    assert.match(visibleCopy, /native audio|generated sound|原生音频|生成聲音|原生音訊|生成音声|ネイティブ音声|natives Audio|nativem Audio|erzeugten Ton|audio nativo|áudio nativo|sonido generado|som gerado|audio généré|audio natif|suono generato|네이티브 오디오|생성 사운드/i, `${locale} visible copy should explain Motion Control can generate audio`)
    assert.doesNotMatch(visibleCopy, /visual video only|only visual video|只输出视觉|只輸出視覺|映像のみ|nur visuelle Videos|solo video visual|apenas vídeo visual|uniquement une vidéo visuelle|solo video visivo|시각 영상만/i, `${locale} visible copy should not say Motion Control is visual-only`)
    assert.doesNotMatch(visibleCopy, /WebM/i, `${locale} visible copy should not advertise WebM for KIE Motion Control`)
    assert.doesNotMatch(visibleCopy, /current 5 second credit preset|5 second credit preset|5秒.*preset|5 秒.*preset|5 secondes.*préréglage|preset.*5 secondi/i, `${locale} visible copy should not describe Motion Control as a fixed 5-second preset`)
    assert.doesNotMatch(
      visibleCopy,
      /text-led motion|prompt-led|Driving-Video Input|Not available in this Toolaze flow|Text-to-video and image-to-video|文本转视频和图像转视频|文字生成影片|text-to-video.*image-to-video/i,
      `${locale} copy should not retain the old standard Kling 2.6 positioning`
    )
    if (locale !== 'en') {
      assert.notEqual(publicContent.metadata.title, englishContent.metadata.title, `${locale} metadata title should be localized`)
      assert.notEqual(publicContent.hero.desc, englishContent.hero.desc, `${locale} hero description should be localized`)
      assert.notEqual(publicContent.modelIntro.title, englishContent.modelIntro.title, `${locale} intro title should be localized`)
      assert.notEqual(publicContent.howToUse.title, englishContent.howToUse.title, `${locale} how-to title should be localized`)
      assert.notEqual(publicContent.faqTitle, englishContent.faqTitle, `${locale} FAQ title should be localized`)
      assert.notEqual(publicContent.moreTools, englishContent.moreTools, `${locale} related model section title should be localized`)
    }
  }
})

test('Kling 2.6 Pro Motion Control uses the real Toolaze model configuration and credit rates', () => {
  const config = readFileSync(join(root, 'src', 'lib', 'ai-video-generator-config.ts'), 'utf8')
  const credits = readFileSync(join(root, 'src', 'lib', 'generation-credits.ts'), 'utf8')
  const functionCredits = readFileSync(join(root, 'functions', '_shared', 'generation-credits.mjs'), 'utf8')
  const apiRoute = readFileSync(join(root, 'functions', 'api', 'ai-video-generator.js'), 'utf8')
  const pricingCsv = readFileSync(join(root, 'docs', 'model-costs.csv'), 'utf8')
  const pricingMarkdown = readFileSync(join(root, 'docs', 'video-model-costs.md'), 'utf8')

  assert.match(config, /id:\s*'kling-2-6-motion-control'[\s\S]*name:\s*'Kling 2\.6 Motion Control'/)
  assert.match(config, /id:\s*'kling-2-6-motion-control'[\s\S]*supportedModes:\s*\['image-to-video'\]/)
  assert.match(config, /id:\s*'kling-2-6-motion-control'[\s\S]*maxVideos:\s*1/)
  assert.match(config, /id:\s*'kling-2-6-motion-control'[\s\S]*maxVideoFileSizeMb:\s*100/)
  assert.match(config, /id:\s*'kling-2-6-motion-control'[\s\S]*supportsMotionReferenceVideo:\s*true/)
  assert.match(credits, /'kling-2-6-motion-control':\s*\{[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*22,\s*'1080p':\s*22\s*\}/)
  assert.match(functionCredits, /'kling-2-6-motion-control':\s*\{[\s\S]*ratesByResolution:\s*\{\s*'720p':\s*22,\s*'1080p':\s*22\s*\}/)
  assert.match(apiRoute, /'kling-2-6-motion-control':\s*\{[\s\S]*fallbackProviderModel:\s*'kling-2\.6\/motion-control'/)
  assert.match(apiRoute, /'kling-2-6-motion-control':\s*\{[\s\S]*inputSchema:\s*'kling-motion-control'/)
  assert.match(apiRoute, /input_urls:\s*imageUrls\.slice\(0, 1\)[\s\S]*video_urls:\s*videoUrls\.slice\(0, 1\)[\s\S]*character_orientation/)
  assert.match(pricingCsv, /Kling 2\.6 Motion Control,kling-2-6-motion-control/)
  assert.match(pricingCsv, /KIE 独立成本待核实/)
  assert.match(pricingMarkdown, /Kling 2\.6 Motion Control \| `kling-2-6-motion-control`/)
})

test('Toolaze model pages separate weak and better prompt tips visually', () => {
  const l2PageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')

  assert.match(l2PageContent, /splitWeakBetterPrompt/, 'prompt tips should parse weak/better text instead of rendering one dense paragraph')
  assert.match(l2PageContent, /prompt-tip-weak/, 'weak prompt rows should have a stable marker for smoke tests')
  assert.match(l2PageContent, /prompt-tip-better/, 'better prompt rows should have a stable marker for smoke tests')
  assert.match(l2PageContent, /❌/, 'weak prompt rows should display a clear negative icon')
  assert.match(l2PageContent, /✅/, 'better prompt rows should display a clear positive icon')
})

test('Kling 2.6 Pro Motion Control public entry points include model surfaces and the AI Tools functional card', () => {
  const navigation = readFileSync(join(root, 'src', 'components', 'Navigation.tsx'), 'utf8')
  const footer = readFileSync(join(root, 'src', 'components', 'Footer.tsx'), 'utf8')
  const aiToolsCopy = readFileSync(join(root, 'src', 'app', 'ai-tools', 'copy.ts'), 'utf8')
  const homePage = readFileSync(join(root, 'src', 'components', 'home', 'HomePageMain.tsx'), 'utf8')
  const modelHub = readFileSync(join(root, 'src', 'lib', 'model-hub.ts'), 'utf8')
  const sitemap = readFileSync(join(root, 'src', 'app', 'sitemap.ts'), 'utf8')
  const languageSwitch = readFileSync(join(root, 'src', 'lib', 'site-language-switch.ts'), 'utf8')
  const seoLoader = readFileSync(join(root, 'src', 'lib', 'seo-loader.ts'), 'utf8')
  const l2PageContent = readFileSync(join(root, 'src', 'components', 'blocks', 'ToolL2PageContent.tsx'), 'utf8')
  const breadcrumb = readFileSync(join(root, 'src', 'components', 'Breadcrumb.tsx'), 'utf8')

  assert.equal(countOccurrences(navigation, `/model/${slug}`), 2, 'Navigation should include AI Tools and AI Video model menus')
  assert.equal(countOccurrences(footer, `/model/${slug}`), 1, 'Footer should include the video model link once')
  assert.match(aiToolsCopy, new RegExp(`href:\\s*['"]/model/${slug}['"]`), 'AI Tools Hub should include a functional Motion Control card')
  assert.match(navigation, /aiMotionControlGenerator/, 'AI Tools navigation should include Motion Control as a functional video tool')
  assert.match(homePage, new RegExp(`localizeHomeHref\\('/model/${slug}'\\)`), 'homepage AI Tools video tab should include Motion Control')
  assert.match(homePage, new RegExp(klingDemoVideo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'homepage should use the Motion Control demo video')
  assert.match(homePage, new RegExp(klingDemoPoster.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'homepage should use the Motion Control demo poster')
  assert.doesNotMatch(homePage, new RegExp(`loadToolData\\(\\s*['"]${slug}['"]`), 'model pages should stay out of homepage tool cards')
  assert.match(modelHub, new RegExp(`'kling-2-6-motion-control':\\s*'/model/${slug}'`))
  assert.doesNotMatch(modelHub, new RegExp(`'kling-2-6':\\s*'/model/${slug}'`))
  assert.match(sitemap, new RegExp(`['"]${slug}['"]`))
  assert.match(languageSwitch, new RegExp(`'${slug}': ALL_LOCALE_CODES`))
  assert.match(seoLoader, new RegExp(`VIDEO_MODEL_L2S = \\[[^\\]]*'${slug}'`))
  assert.match(seoLoader, new RegExp(`importL2FlatJson\\('${slug}'`))
  assert.match(l2PageContent, new RegExp(`'${slug}':\\s*'kling-2-6-motion-control'`))
  assert.match(l2PageContent, /reviewSafe/, 'ToolL2PageContent should allow explicitly review-safe user comments to render')
  assert.match(breadcrumb, new RegExp(`/model/${slug}`))

  for (const locale of locales) {
    const common = readJson(join(root, 'src', 'data', locale, 'common.json'))
    assert.ok(common.nav.aiMotionControlGenerator, `${locale} nav.aiMotionControlGenerator should exist`)
    assert.ok(common.nav.kling26MotionControl, `${locale} nav.kling26MotionControl should exist`)
    assert.ok(common.footer.kling26MotionControl, `${locale} footer.kling26MotionControl should exist`)
  }
})
