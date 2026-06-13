#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pagePath = path.join(root, 'src/app/model/gpt-image-2/page.tsx')
const componentPath = path.join(root, 'src/components/GptImage2LandingPage.tsx')
const localizedModelPagePath = path.join(root, 'src/app/[locale]/model/[model]/page.tsx')
const landingCopyPath = path.join(root, 'src/lib/gpt-image-2-landing-copy.ts')
const copyButtonPath = path.join(root, 'src/components/PromptCopyButton.tsx')
const redditCarouselPath = path.join(root, 'src/components/RedditMediaCarousel.tsx')
const page = fs.readFileSync(pagePath, 'utf8')
const component = fs.readFileSync(componentPath, 'utf8')
const localizedModelPage = fs.readFileSync(localizedModelPagePath, 'utf8')
const landingCopy = fs.existsSync(landingCopyPath) ? fs.readFileSync(landingCopyPath, 'utf8') : ''
const pageSources = `${page}\n${component}\n${landingCopy}\n${localizedModelPage}`
const copyButton = fs.readFileSync(copyButtonPath, 'utf8')
const redditCarousel = fs.readFileSync(redditCarouselPath, 'utf8')
const redditSection = component.slice(component.indexOf('const redditDiscussions'), component.indexOf('const xCommunityExamples'))
const xDataSection = component.slice(component.indexOf('const xCommunityExamples'), component.indexOf('const youtubeCommunityExamples'))
const xSection = component.slice(component.indexOf('copy.x.title'), component.indexOf('copy.related.title'))

const imageSlots = [
  'feature-text-rendering',
  'feature-4k-output',
  'feature-image-editing',
  'feature-ui-layouts',
  'feature-commercial-output',
  'feature-prompt-following',
  'gallery-product-poster',
  'gallery-social-ad',
  'gallery-ui-mockup',
  'gallery-ecommerce',
  'gallery-education',
  'gallery-text-logo',
  'gallery-reference-edit',
  'gallery-high-resolution',
  'prompt-multilingual-text',
  'prompt-print-layout',
  'prompt-character-sheet',
  'prompt-storyboard',
  'prompt-reference-edit',
  'prompt-travel-brochure',
  'final-cta',
]

const requiredSnippets = [
  'GPT Image 2 AI Image Generator | Free, No Signup',
  'Create 4K images, product posters, social ads, UI mockups',
  'What Is GPT Image 2?',
  'Key Features of GPT Image 2',
  'High-Accuracy Text Rendering',
  '4K Image Output',
  'Image Generation and Editing',
  'Structured Layout Control',
  'Commercial Creative Output',
  'Prompt Following',
  'Example Gallery for GPT Image 2',
  'GPT Image 2 vs Nano Banana vs Midjourney vs Flux',
  'How to Use GPT Image 2 for Free Without Signup on Toolaze',
  'Best GPT Image 2 Prompt Examples',
  'GPT Image 2 Discussions on Reddit',
  'GPT Image 2 Examples on X',
  'GPT Image 2 Videos on YouTube',
  'Explore More AI Models and Tools',
  'FAQs About GPT Image 2',
  'Create with GPT Image 2 on Toolaze for Free',
]

const localImageAssetMatches = [...component.matchAll(/'([^']+)': '\/model\/gpt-image-2\/([^']+)'/g)]
const localImageAssets = new Map(localImageAssetMatches.map(([, slot, file]) => [slot, file]))
const localImageAssetFilesExist = imageSlots.every((slot) => {
  const file = localImageAssets.get(slot)

  return file && fs.existsSync(path.join(root, 'public/model/gpt-image-2', file))
})

const xAvatarFiles = [
  'x-avatar-stark-nico99.jpg',
  'x-avatar-tamayo888.jpg',
  'x-avatar-mrlarus.jpg',
  'x-avatar-dotey.jpeg',
  'x-avatar-justinmfarrugia.jpg',
  'x-avatar-geekcatx.jpg',
]

const xAvatarFilesExist = xAvatarFiles.every((file) => fs.existsSync(path.join(root, 'public/model/gpt-image-2', file)))
const redditHrefs = [...redditSection.matchAll(/href: '([^']+)'/g)].map(([, href]) => href)
const redditDisplayMedia = [...redditSection.matchAll(/displayImage: redditImage\(/g)]
const xItems = [...xDataSection.matchAll(/title: '([^']+)'/g)]
const xDisplayMedia = [...xDataSection.matchAll(/displayImage: xImage\(/g)]
const englishCopyStart = landingCopy.indexOf('const englishCopy')
const galleryExamplesSection = landingCopy.slice(
  landingCopy.indexOf('gallery: {', englishCopyStart),
  landingCopy.indexOf('audiences: {', englishCopyStart)
)
const galleryExampleCount = [...galleryExamplesSection.matchAll(/slot: 'gallery-/g)].length
const supportedLandingLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

const checks = [
  {
    name: 'page renders the real GPT Image 2 generator in the functional area',
    pass:
      component.includes('<NanoBananaTool') &&
      component.includes('modelId="gpt-image-2"') &&
      component.includes('id="gpt-image-2-generator"'),
  },
  {
    name: 'GPT Image 2 landing page supports all Toolaze locales through the same page component',
    pass:
      component.includes('export async function GptImage2LandingPage') &&
      component.includes('locale = \'en\'') &&
      component.includes('getGptImage2LandingCopy(locale)') &&
      page.includes('getGptImage2PageMetadata') &&
      localizedModelPage.includes('GptImage2LandingPage') &&
      localizedModelPage.includes("tool === 'gpt-image-2'") &&
      localizedModelPage.includes('return <GptImage2LandingPage locale={locale} />') &&
      supportedLandingLocales.every((locale) =>
        locale === 'en'
          ? landingCopy.includes('const englishCopy')
          : new RegExp(`['"]?${locale.replace('-', '\\-')}['"]?:`).test(landingCopy)
      ) &&
      landingCopy.includes('KI-Bildgenerator') &&
      landingCopy.includes('Generador de imágenes con IA') &&
      landingCopy.includes('AI 画像ジェネレーター') &&
      landingCopy.includes('AI 圖像生成器') &&
      landingCopy.includes('Gerador de imagens com IA') &&
      landingCopy.includes("Générateur d'images IA") &&
      landingCopy.includes('AI 이미지 생성기') &&
      landingCopy.includes('Generatore di immagini AI'),
  },
  {
    name: 'localized GPT Image 2 copy includes non-English array content for every repeated section',
    pass:
      landingCopy.includes('const localizedArrayOverrides') &&
      landingCopy.includes('Produktposter zum Launch') &&
      landingCopy.includes('多語言文字版面提示詞') &&
      landingCopy.includes('Cartel de lanzamiento de producto') &&
      landingCopy.includes('Poster de lançamento de produto') &&
      landingCopy.includes('Affiche de lancement produit') &&
      landingCopy.includes('제품 출시 포스터') &&
      landingCopy.includes('Poster di lancio prodotto'),
  },
  {
    name: 'functional area follows Toolaze layout and contains the H1 copy',
    pass:
      component.indexOf('id="gpt-image-2-generator"') > -1 &&
      component.indexOf('<Breadcrumb') > component.indexOf('<Navigation') &&
      component.indexOf('<Breadcrumb') < component.indexOf('<main') &&
      component.includes('<section id="gpt-image-2-generator" className="bg-[#F8FAFF] px-6 pb-12"') &&
      landingCopy.includes('GPT Image 2 AI Image Generator') &&
      landingCopy.includes('Use GPT Image 2 online on Toolaze for free with no signup or login') &&
      component.indexOf('id="gpt-image-2-generator"') < component.indexOf('copy.whatIs.title') &&
      !pageSources.includes('simple browser workflow') &&
      pageSources.includes('directly in your browser'),
  },
  {
    name: 'heading sizes follow Toolaze page conventions and H1 highlights the model name',
    pass:
      component.includes('className="text-[40px] font-extrabold leading-tight tracking-tight text-slate-950"') &&
      component.includes('bg-gradient-to-r from-indigo-600 to-purple-600') &&
      component.includes('text-[36px] font-extrabold leading-tight tracking-tight') &&
      !component.includes('md:text-6xl') &&
      !component.includes('md:text-5xl'),
  },
  {
    name: 'new SEO sections are present',
    pass: requiredSnippets.every((snippet) => pageSources.includes(snippet)),
  },
  {
    name: 'feature section uses detailed H3 capability blocks instead of duplicate summary cards',
    pass:
      !pageSources.includes('const keyFeatures') &&
      !pageSources.includes('keyFeatures.map') &&
      pageSources.includes('High-Accuracy Text Rendering') &&
      pageSources.includes('4K Image Output') &&
      pageSources.includes('Image Generation and Editing') &&
      pageSources.includes('Structured Layout Control') &&
      pageSources.includes('Commercial Creative Output') &&
      pageSources.includes('Prompt Following'),
  },
  {
    name: 'image placeholder component is used for every planned visual slot',
    pass: imageSlots.every(
      (slot) => pageSources.includes(`slot="${slot}"`) || pageSources.includes(`slot: '${slot}'`)
    ),
  },
  {
    name: 'example gallery has exactly eight examples for a four-column two-row desktop layout',
    pass:
      galleryExampleCount === 8 &&
      component.includes('grid gap-6 md:grid-cols-2 xl:grid-cols-4'),
  },
  {
    name: 'all visual placeholders are inert containers, not generated assets',
    pass:
      component.includes('function ImagePlaceholder') &&
      !pageSources.includes('slot="hero"') &&
      !pageSources.includes("slot: 'hero'") &&
      !pageSources.includes('pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/gpt-image-2'),
  },
  {
    name: 'FAQ schema includes free, no-signup, 4K, editing, and comparison questions',
    pass:
      pageSources.includes('Does GPT Image 2 support 4K output?') &&
      pageSources.includes('Can I use GPT Image 2 without signup?') &&
      pageSources.includes('Can GPT Image 2 edit images?') &&
      pageSources.includes('Is GPT Image 2 better than Nano Banana, Midjourney, or Flux?'),
  },
  {
    name: 'public copy avoids fake social proof and unsupported perfect-text claims',
    pass:
      !pageSources.includes('perfect text rendering') &&
      !pageSources.includes('10K+ creators') &&
      !pageSources.includes('Trusted by Creators and Teams'),
  },
  {
    name: 'public page does not expose internal SEO keyword lists',
    pass:
      !pageSources.includes('Best entry queries') &&
      !pageSources.includes('<li>GPT Image 2 free</li>') &&
      !pageSources.includes('<li>GPT Image 2 no signup</li>'),
  },
  {
    name: 'public UI copy avoids forced all-caps styling and redundant X metadata',
    pass:
      !pageSources.includes('uppercase') &&
      !pageSources.includes('Public post'),
  },
  {
    name: 'prompt examples expose one-click copy controls',
    pass:
      component.includes("import PromptCopyButton from '@/components/PromptCopyButton'") &&
      component.includes('copyLabel={copy.prompts.copyButton}') &&
      component.includes('copiedLabel={copy.prompts.copiedButton}') &&
      copyButton.includes("'use client'") &&
      copyButton.includes('navigator.clipboard.writeText(prompt)') &&
      copyButton.includes("document.execCommand('copy')") &&
      copyButton.includes('{copied ? copiedLabel : copyLabel}'),
  },
  {
    name: 'approved semantic images are wired from local server paths',
    pass:
      imageSlots.every((slot) => localImageAssets.has(slot)) &&
      localImageAssetFilesExist &&
      !pageSources.includes('https://toolaze-web.pages.dev/api/download-image?url='),
  },
  {
    name: 'prompt examples avoid unnecessary device-screen scenes',
    pass:
      !pageSources.includes('phone screen') &&
      !pageSources.includes('computer screen') &&
      !pageSources.includes('desktop monitor') &&
      pageSources.includes('Multilingual Text Layout Prompt') &&
      pageSources.includes('Sequential Storyboard Prompt'),
  },
  {
    name: 'prompt examples use capability-specific image slots distinct from gallery slots',
    pass:
      pageSources.includes("slot: 'prompt-multilingual-text'") &&
      pageSources.includes("slot: 'prompt-print-layout'") &&
      pageSources.includes("slot: 'prompt-character-sheet'") &&
      pageSources.includes("slot: 'prompt-storyboard'") &&
      pageSources.includes("slot: 'prompt-reference-edit'") &&
      pageSources.includes("slot: 'prompt-travel-brochure'") &&
      !pageSources.includes("slot: 'prompt-social-ad'"),
  },
  {
    name: 'community discussion sections use real external Reddit and X links',
    pass:
      component.includes('https://www.reddit.com/r/ChatGPT/comments/1statrb/image_20_is_actually_insane_this_is_not_a_small/') &&
      component.includes('https://www.reddit.com/r/ImagineAiArt/comments/1u2bt9m/gpt_image_2_vs_nano_banana_2_who_wins_real/') &&
      component.includes('https://x.com/stark_nico99/status/2045836554451706125') &&
      component.includes('https://x.com/mrlarus/status/2044824800909054181') &&
      component.includes('target="_blank"') &&
      component.includes('rel="noopener noreferrer"'),
  },
  {
    name: 'external community cards include stable media previews',
    pass:
      (redditSection.match(/source: 'r\//g) || []).length === 10 &&
      redditHrefs.length === 10 &&
      new Set(redditHrefs).size === 10 &&
      (redditSection.match(/preview\.redd\.it/g) || []).length > 10 &&
      redditDisplayMedia.length > 10 &&
      component.includes('const redditImage = (id: string, extension =') &&
      !redditSection.includes('/model/gpt-image-2/') &&
      component.includes('function RedditLogo') &&
      component.includes('<RedditLogo />') &&
      component.includes('key={item.id}') &&
      !redditSection.includes('key={item.href}') &&
      component.includes("import RedditMediaCarousel from '@/components/RedditMediaCarousel'") &&
      component.includes('<RedditMediaCarousel media={item.media} title={item.title} />') &&
      redditCarousel.includes("'use client'") &&
      redditCarousel.includes('showPrevious') &&
      redditCarousel.includes('showNext') &&
      redditCarousel.includes('src={activeMedia.displayImage}') &&
      redditCarousel.includes('referrerPolicy="no-referrer"') &&
      component.includes('lg:grid-cols-5') &&
      xItems.length === 10 &&
      xDisplayMedia.length === 10 &&
      component.includes('const xImage = (url: string) =>') &&
      xSection.includes('xl:grid-cols-5') &&
      xSection.includes('src={item.displayImage}') &&
      xSection.includes('key={item.image}') &&
      !xSection.includes('border-l-[14px]') &&
      !xSection.includes('border-y-[9px]') &&
      component.includes('pbs.twimg.com/media/HGRFgOPaYAAkrdn.jpg') &&
      component.includes('pbs.twimg.com/media/HGCnWfOXwAAVCRn.jpg') &&
      component.includes('/model/gpt-image-2/x-avatar-stark-nico99.jpg') &&
      xAvatarFilesExist &&
      !component.includes('profile_images/') &&
      component.includes('alt={`${item.name} ${copy.x.title}`}') &&
      component.includes('https://www.youtube.com/embed/${item.videoId}') &&
      component.includes('{copy.youtube.watch}') &&
      pageSources.includes('Watch on YouTube'),
  },
  {
    name: 'YouTube community section appears before Reddit and X sections',
    pass:
      component.indexOf('copy.youtube.title') > -1 &&
      component.indexOf('copy.youtube.title') < component.indexOf('copy.reddit.title') &&
      component.indexOf('copy.reddit.title') < component.indexOf('copy.x.title'),
  },
  {
    name: 'final CTA uses the approved purple visual treatment',
    pass:
      component.includes('bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.22),transparent_34%)') &&
      component.includes('bg-indigo-700') &&
      !component.includes('bg-slate-950 px-4 py-14 text-white'),
  },
]

const failed = checks.filter((check) => !check.pass)

for (const check of checks) {
  console.log(`${check.pass ? '✓' : '✗'} ${check.name}`)
}

if (failed.length > 0) {
  console.error(`\n${failed.length} GPT Image 2 landing page checks failed.`)
  process.exit(1)
}

console.log('\nGPT Image 2 landing page checks passed.')
