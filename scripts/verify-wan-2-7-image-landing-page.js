#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const files = {
  page: path.join(root, 'src/app/model/wan-2-7-image/page.tsx'),
  component: path.join(root, 'src/components/Wan27ImageLandingPage.tsx'),
  copy: path.join(root, 'src/lib/wan-2-7-image-landing-copy.ts'),
  tool: path.join(root, 'src/components/NanoBananaTool.tsx'),
  api: path.join(root, 'functions/api/image-to-image.js'),
  localizedPage: path.join(root, 'src/app/[locale]/model/[model]/page.tsx'),
  navigation: path.join(root, 'src/components/Navigation.tsx'),
  footer: path.join(root, 'src/components/Footer.tsx'),
  homePage: path.join(root, 'src/components/home/HomePageMain.tsx'),
  modelHub: path.join(root, 'src/app/model/page.tsx'),
  sitemap: path.join(root, 'src/app/sitemap.ts'),
  breadcrumb: path.join(root, 'src/components/Breadcrumb.tsx'),
  browserRedirect: path.join(root, 'src/lib/browser-locale-redirect.ts'),
  homeModelCardImages: path.join(root, 'src/lib/home-model-card-images.ts'),
}

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '')
const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]))
const visibleSource = `${source.component}\n${source.copy}\n${source.modelHub}\n${source.homePage}\n${source.navigation}\n${source.footer}`
const wanLocales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const imageAssetDir = path.join(root, 'public/model-assets/wan-2-7-image')
const maxPageImageBytes = 100 * 1024
const imageSlots = [
  'thinking-mode',
  'text-rendering',
  'image-editing',
  'multi-reference',
  'resolution',
  'image-sets',
  'gallery-product-ad',
  'gallery-event-poster',
  'gallery-packaging',
  'gallery-infographic',
  'gallery-character',
  'gallery-interior',
  'gallery-storyboard',
  'gallery-brand-board',
  'prompt-product-ad',
  'prompt-text-poster',
  'prompt-reference-fusion',
  'prompt-character-edit',
  'prompt-infographic',
  'prompt-interior',
  'final-cta',
]

const appearsBefore = (text, first, second) => {
  const a = text.indexOf(first)
  const b = text.indexOf(second)
  return a >= 0 && b >= 0 && a < b
}

const objectBlock = (text, marker) => {
  const start = text.indexOf(marker)
  if (start < 0) return ''
  const braceStart = text.indexOf('{', start)
  if (braceStart < 0) return ''
  let depth = 0
  for (let i = braceStart; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1
    if (text[i] === '}') depth -= 1
    if (depth === 0) return text.slice(braceStart, i + 1)
  }
  return ''
}

const localizedNestedBlock = objectBlock(source.copy, 'const localizedNestedOverrides')
const localeNestedBlock = (locale) => {
  const marker = locale === 'zh-TW' ? "  'zh-TW':" : `  ${locale}:`
  return objectBlock(localizedNestedBlock, marker)
}
const countMatches = (text, pattern) => (text.match(pattern) || []).length
const localeHasCompleteNestedCopy = (locale) => {
  const block = localeNestedBlock(locale)
  return (
    block.includes('features:') &&
    block.includes('gallery:') &&
    block.includes('comparison:') &&
    block.includes('howTo:') &&
    block.includes('prompts:') &&
    block.includes('youtube:') &&
    block.includes('reddit:') &&
    block.includes('x:') &&
    block.includes('related:') &&
    block.includes('faq:') &&
    countMatches(block, /prompt:/g) >= 6 &&
    countMatches(block, /body:/g) >= 10 &&
    countMatches(block, /q:/g) >= 5
  )
}

const checks = [
  {
    name: 'Wan 2.7 Image page route exists and exports metadata',
    pass:
      fs.existsSync(files.page) &&
      source.page.includes('Wan27ImageLandingPage') &&
      source.page.includes('getWan27ImagePageMetadata'),
  },
  {
    name: 'Landing page uses generator first with H1 and consistent typography',
    pass:
      source.component.includes('<NanoBananaTool') &&
      source.component.includes('modelId="wan-2-7-image"') &&
      source.component.includes('id="wan-2-7-image-generator"') &&
      source.component.includes('text-[40px]') &&
      source.component.includes('text-[36px]') &&
      appearsBefore(source.component, 'id="wan-2-7-image-generator"', 'copy.whatIs.title'),
  },
  {
    name: 'Prompt examples include copy buttons and image containers on the right',
    pass:
      source.component.includes('<PromptCopyButton') &&
      source.component.includes('lg:grid-cols-[minmax(0,1fr)_320px]') &&
      source.component.includes('<ImagePlaceholder slot={item.slot} label={item.title} />'),
  },
  {
    name: 'All Wan visual slots are wired to local WebP model assets',
    pass:
      source.component.includes("'/model-assets/wan-2-7-image/final-cta.webp'") &&
      imageSlots.every((slot) => source.copy.includes(`slot: '${slot}'`) || slot === 'final-cta') &&
      imageSlots.every((slot) => source.component.includes(`/model-assets/wan-2-7-image/${slot}.webp`)) &&
      !source.component.includes('/model-assets/wan-2-7-image/thinking-mode.png') &&
      !source.component.includes('role="img"'),
  },
  {
    name: 'Gallery examples use a 4:3 image display area',
    pass:
      source.component.includes("variant?: 'default' | 'gallery'") &&
      source.component.includes("isGallery ? 'aspect-[4/3]' : 'min-h-[260px]'") &&
      source.component.includes('<ImagePlaceholder slot={item.slot} label={item.title} variant="gallery" />'),
  },
  {
    name: 'All Wan page-owned images exist as WebP files under 100KB',
    pass: imageSlots.every((slot) => {
      const file = path.join(imageAssetDir, `${slot}.webp`)
      return fs.existsSync(file) && fs.statSync(file).size <= maxPageImageBytes
    }),
  },
  {
    name: 'Model comparison table uses concise official-spec first values',
    pass:
      source.copy.includes('official-spec first comparison') &&
      source.copy.includes('Pro: 4K for text-to-image; image input/edit: 2K. Standard: 2K') &&
      source.copy.includes('0 to 9 input images') &&
      source.copy.includes('Up to 16 images for GPT image edit workflows') &&
      source.copy.includes('Official Seed page does not list a public max') &&
      source.copy.includes('Maximum 14 images per prompt') &&
      !source.copy.includes('4K-capable image generation workflows') &&
      !source.copy.includes('High-resolution image generation depending on selected model') &&
      !source.copy.includes('Flexible image input for edit workflows'),
  },
  {
    name: 'Wan page includes YouTube, Reddit, and X community sections',
    pass:
      source.copy.includes('Wan 2.7 Image Videos on YouTube') &&
      source.copy.includes('Wan 2.7 Image Discussions on Reddit') &&
      source.copy.includes('Wan 2.7 Image Examples on X') &&
      source.component.includes('iframe') &&
      source.component.includes('RedditMediaCarousel') &&
      source.component.includes('pbs.twimg.com/media'),
  },
  {
    name: 'YouTube community grid is three columns on desktop',
    pass:
      source.component.includes('<SectionHeader title={copy.youtube.title} text={copy.youtube.text} />') &&
      source.component.includes('<div className="grid gap-5 md:grid-cols-3">') &&
      appearsBefore(source.component, 'title={copy.youtube.title}', 'youtubeExamples.map') &&
      appearsBefore(source.component, 'youtubeExamples.map', 'title={copy.reddit.title}'),
  },
  {
    name: 'Community data uses real source-backed Wan media and avatars',
    pass:
      source.component.includes('https://www.reddit.com/r/budgetpixel/comments/1sa65s0/wan_27_and_wan_27_pro_image_models_are_now/') &&
      source.component.includes('https://www.reddit.com/r/AtlasCloudAI/comments/1sa93qw/wan_27_image_is_out_any_one_tested_it_yet/') &&
      source.component.includes('https://www.reddit.com/r/ArtificialInteligence/comments/1s9dtyc/wan_27image_just_dropped_when_will_wan_27_video/') &&
      source.component.includes('https://www.reddit.com/r/aicuriosity/comments/1s9oyaj/alibaba_launches_new_wan_27_image_ai_model_built/') &&
      source.component.includes('https://x.com/Alibaba_Wan/status/2039329029241872767') &&
      source.component.includes('https://x.com/browncatro1/status/2039702292522537326') &&
      source.component.includes('https://x.com/VORTEX_Promos/status/2039817954448093695') &&
      source.component.includes('https://pbs.twimg.com/profile_images/1955825038210555905/xtkxHg06_200x200.jpg') &&
      source.component.includes('https://pbs.twimg.com/profile_images/1647590193820737538/h1diIoPv_200x200.jpg') &&
      source.component.includes('https://pbs.twimg.com/profile_images/2048881737225433088/Z1_FvgiV_200x200.jpg'),
  },
  {
    name: 'X community grid has ten image cards in five desktop columns',
    pass:
      (source.component.match(/href: 'https:\/\/x\.com\//g) || []).length === 10 &&
      source.component.includes('lg:grid-cols-5') &&
      source.component.includes('https://x.com/poe_platform/status/2039721013001306451') &&
      source.component.includes('https://x.com/BrentLynch/status/2039384555103416683') &&
      source.component.includes('https://x.com/alisaqqt/status/2039241737592574255') &&
      source.component.includes('https://x.com/Designarena/status/2040869623546122697') &&
      source.component.includes('https://x.com/wavespeed_ai/status/2039351955462758567') &&
      source.component.includes('https://x.com/mark_k/status/2039413277965324342') &&
      source.component.includes('https://x.com/Alibaba_Wan/status/2041081738907283541') &&
      !source.component.includes('video.twimg.com'),
  },
  {
    name: 'Wan locale copy includes translated metadata and community labels',
    pass:
      source.copy.includes('Wan 2.7 Image 生成器') &&
      source.copy.includes('Wan 2.7 Image ジェネレーター') &&
      source.copy.includes('Generador Wan 2.7 Image') &&
      source.copy.includes('YouTube 上的 Wan 2.7 Image 影片') &&
      source.copy.includes('YouTubeのWan 2.7 Image動画') &&
      source.copy.includes('Vídeos de Wan 2.7 Image no YouTube'),
  },
  {
    name: 'Wan localized nested copy covers all visible repeated sections',
    pass:
      wanLocales.every(localeHasCompleteNestedCopy) &&
      source.copy.includes('適合複雜提示詞的思考模式') &&
      source.copy.includes('参照顔を使ったクリエイターテスト') &&
      source.copy.includes('Póster de lanzamiento de producto') &&
      source.copy.includes('Webinar créateur Wan2.7') &&
      source.copy.includes('최대 출력 해상도') &&
      source.copy.includes('Poster lancio prodotto'),
  },
  {
    name: 'Wan home card uses a real page-owned preview image',
    pass:
      source.homePage.includes("tool: 'wan-2-7-image'") &&
      source.homeModelCardImages.includes("'/model-assets/wan-2-7-image/gallery-event-poster.webp'"),
  },
  {
    name: 'Generator supports Wan 2.7 Image limits and defaults',
    pass:
      source.tool.includes("'wan-2-7-image'") &&
      source.tool.includes('maxImages: 9') &&
      source.tool.includes("modelId === 'wan-2-7-image'") &&
      source.tool.includes("modelId === 'seedream-4-5' || modelId === 'wan-2-7-image' ? '1:1'"),
  },
  {
    name: 'Backend sends Wan provider ids and request fields',
    pass:
      source.api.includes("return 'wan-2-7-image'") &&
      source.api.includes("'wan/2-7-image'") &&
      source.api.includes("'wan/2-7-image-pro'") &&
      source.api.includes('input.input_urls = imageUrls.slice(0, maxImages)') &&
      source.api.includes('input.thinking_mode = !isImageToImage') &&
      source.api.includes('input.nsfw_checker = true') &&
      source.api.includes('return 9'),
  },
  {
    name: 'Localized model route supports Wan 2.7 Image',
    pass:
      source.localizedPage.includes('Wan27ImageLandingPage') &&
      source.localizedPage.includes('getWan27ImagePageMetadata') &&
      source.localizedPage.includes("'wan-2-7-image': 'wan-2-7-image'"),
  },
  {
    name: 'Entry points include nav, footer, home, model hub, sitemap, breadcrumb, and redirect exception',
    pass:
      source.navigation.includes('/model/wan-2-7-image') &&
      appearsBefore(source.navigation, '/model/gpt-image-2-0', '/model/wan-2-7-image') &&
      source.footer.includes('/model/wan-2-7-image') &&
      source.homePage.includes("'wan-2-7-image': '/model/wan-2-7-image'") &&
      source.modelHub.includes('/model/wan-2-7-image') &&
      source.sitemap.includes("'wan-2-7-image'") &&
      source.breadcrumb.includes('/model/wan-2-7-image') &&
      source.browserRedirect.includes("parts[1]==='wan-2-7-image'"),
  },
  {
    name: 'Visible page copy does not foreground Kie or kie.ai',
    pass: !/\bkie\b|kie\.ai/i.test(visibleSource),
  },
]

const failed = checks.filter((check) => !check.pass)
for (const check of checks) {
  console.log(`${check.pass ? '✓' : '✗'} ${check.name}`)
}

if (failed.length > 0) {
  console.error(`\n${failed.length} Wan 2.7 Image landing page check(s) failed.`)
  process.exit(1)
}

console.log('\nWan 2.7 Image landing page checks passed.')
