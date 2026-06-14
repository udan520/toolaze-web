#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const files = {
  page: path.join(root, 'src/app/model/seedream-4-5/page.tsx'),
  component: path.join(root, 'src/components/Seedream45LandingPage.tsx'),
  tool: path.join(root, 'src/components/NanoBananaTool.tsx'),
  api: path.join(root, 'functions/api/image-to-image.js'),
  localCreateApi: path.join(root, 'src/app/api/image-to-image/route.js'),
  localStatusApi: path.join(root, 'src/app/api/image-to-image/status/route.js'),
  localSaveApi: path.join(root, 'src/app/api/save-image-to-r2/route.js'),
  localAltApi: path.join(root, 'src/app/api/generate-alt/route.js'),
  sitemap: path.join(root, 'src/app/sitemap.ts'),
  browserRedirect: path.join(root, 'src/lib/browser-locale-redirect.ts'),
  breadcrumb: path.join(root, 'src/components/Breadcrumb.tsx'),
  localizedPage: path.join(root, 'src/app/[locale]/model/[model]/page.tsx'),
  copyModule: path.join(root, 'src/lib/seedream-4-5-landing-copy.ts'),
}

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '')
const page = read(files.page)
const component = read(files.component)
const tool = read(files.tool)
const api = read(files.api)
const localCreateApi = read(files.localCreateApi)
const localStatusApi = read(files.localStatusApi)
const localSaveApi = read(files.localSaveApi)
const localAltApi = read(files.localAltApi)
const sitemap = read(files.sitemap)
const browserRedirect = read(files.browserRedirect)
const breadcrumb = read(files.breadcrumb)
const localizedPage = read(files.localizedPage)
const copyModule = read(files.copyModule)
const allPageSources = `${page}\n${component}`
const promptExamplesSection = component.slice(
  component.indexOf('copy.prompts.title'),
  component.indexOf('copy.related.title'),
)
const imageAssetDir = path.join(root, 'public/model-assets/seedream-4-5')
const copyDir = path.join(root, 'src/data/seedream-4-5-landing-copy')
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const enCopy = readJson(path.join(copyDir, 'en.json'))
const localizedCopies = locales.map((locale) => ({ locale, copy: readJson(path.join(copyDir, `${locale}.json`)) }))

function shapeOf(value) {
  if (Array.isArray(value)) return value.map(shapeOf)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shapeOf(item)]))
  }
  return typeof value
}

const englishCopySource = JSON.stringify(enCopy)
const allLocalizedCopySource = localizedCopies.map(({ copy }) => JSON.stringify(copy)).join('\n')

const expectedSections = [
  enCopy.metadata.title,
  enCopy.schema.pageName,
  enCopy.whatIs.title,
  enCopy.features.title,
  ...enCopy.features.items.map((item) => item.title),
  enCopy.gallery.title,
  enCopy.audiences.title,
  enCopy.comparison.title,
  enCopy.howTo.title,
  enCopy.prompts.title,
  enCopy.related.title,
  enCopy.faq.title,
  enCopy.cta.title,
]

const imageSlots = [
  'feature-reference-consistency',
  'feature-4k-output',
  'feature-typography',
  'feature-commercial-design',
  'feature-prompt-adherence',
  'gallery-ecommerce-product',
  'gallery-poster-layout',
  'gallery-fragrance-detail',
  'gallery-saas-promo',
  'gallery-wedding-invitation',
  'gallery-beauty-kv',
  'gallery-character-reference',
  'gallery-multilingual-layout',
  'prompt-product-poster',
  'prompt-character-reference-edit',
  'prompt-education-infographic',
  'prompt-interior-redesign',
  'prompt-event-poster',
  'final-cta',
]

const checks = [
  {
    name: 'Seedream 4.5 page route exists and exports metadata',
    pass:
      fs.existsSync(files.page) &&
      page.includes('Seedream45LandingPage') &&
      page.includes('getSeedream45PageMetadata') &&
      copyModule.includes('https://toolaze.com/model/seedream-4-5'),
  },
  {
    name: 'functional area uses the real Toolaze generator component',
    pass:
      component.includes('<NanoBananaTool') &&
      component.includes('modelId="seedream-4-5"') &&
      component.includes('id="seedream-4-5-generator"') &&
      component.indexOf('id="seedream-4-5-generator"') < component.indexOf('copy.whatIs.title') &&
      component.includes('<Breadcrumb') &&
      component.includes('bg-[#F8FAFF]') &&
      component.includes('text-[40px]') &&
      component.includes('text-[36px]') &&
      component.includes('bg-gradient-to-r from-indigo-600 to-purple-600'),
  },
  {
    name: 'Seedream 4.5 provider model ids are wired for text-to-image and edit',
    pass:
      tool.includes("'seedream-4-5'") &&
      tool.includes('Seedream 4.5') &&
      api.includes("seedream/4.5-text-to-image") &&
      api.includes("seedream/4.5-edit") &&
      api.includes('KIE_SEEDREAM_4_5_TEXT_MODEL') &&
      api.includes('KIE_SEEDREAM_4_5_EDIT_MODEL') &&
      api.includes('input.image_urls') &&
      api.includes('input.quality'),
  },
  {
    name: 'local Next dev API shims reuse Cloudflare Functions for generation',
    pass:
      fs.existsSync(files.localCreateApi) &&
      fs.existsSync(files.localStatusApi) &&
      fs.existsSync(files.localSaveApi) &&
      fs.existsSync(files.localAltApi) &&
      localCreateApi.includes("functions/api/image-to-image.js") &&
      localStatusApi.includes("functions/api/image-to-image/status.js") &&
      localSaveApi.includes("functions/api/save-image-to-r2.js") &&
      localAltApi.includes("functions/api/generate-alt.js") &&
      localCreateApi.includes('process.env') &&
      localStatusApi.includes('process.env'),
  },
  {
    name: 'provider-supported settings are represented in the generator',
    pass:
      tool.includes("{ value: '21:9', label: '21:9' }") &&
      tool.includes('maxImages: 14') &&
      tool.includes('supportsHighResolution: true') &&
      tool.includes("modelId === 'seedream-4-5' ? '1:1'") &&
      tool.includes("modelId === 'seedream-4-5'") &&
      tool.includes('resolution === \'4K\' ? \'High\''),
  },
  {
    name: 'Seedream 4.5 never submits an empty aspect ratio to the provider',
    pass:
      api.includes("model === 'seedream-4-5' ? '1:1'") &&
      api.includes('const requestedAspectRatio = mapAspectRatio'),
  },
  {
    name: 'SEO sections and source-safe claims are present',
    pass:
      expectedSections.every((snippet) => englishCopySource.includes(snippet)) &&
      englishCopySource.includes('ByteDance Seed') &&
      englishCopySource.includes('Basic') &&
      englishCopySource.includes('High') &&
      englishCopySource.includes('up to 14 reference images') &&
      englishCopySource.includes('JPEG, PNG, and WEBP') &&
      !allLocalizedCopySource.includes('Kie') &&
      !allLocalizedCopySource.includes('kie.ai') &&
      !allLocalizedCopySource.includes('The page should') &&
      !allLocalizedCopySource.includes('Focus the page') &&
      !allLocalizedCopySource.includes('These slots show') &&
      !allLocalizedCopySource.includes('differ from the gallery') &&
      !allLocalizedCopySource.includes('current integration') &&
      !allLocalizedCopySource.includes('future access policy') &&
      !allLocalizedCopySource.includes('perfect typography') &&
      !allLocalizedCopySource.includes('the best AI image model') &&
      !allLocalizedCopySource.includes('Trusted by') &&
      !allLocalizedCopySource.includes('10K+'),
  },
  {
    name: 'gallery has eight examples and prompt examples have copy buttons',
    pass:
      enCopy.gallery.examples.length === 8 &&
      component.includes('grid gap-6 md:grid-cols-2 xl:grid-cols-4') &&
      enCopy.prompts.examples.length >= 5 &&
      component.includes('<PromptCopyButton') &&
      component.includes('copy.prompts.title'),
  },
  {
    name: 'prompt examples cover diverse non-product use cases with image on the right',
    pass:
      englishCopySource.includes('Product Launch Poster') &&
      englishCopySource.includes('Character Reference Edit') &&
      englishCopySource.includes('Educational Infographic') &&
      englishCopySource.includes('Interior Redesign From Reference') &&
      englishCopySource.includes('Event Poster With Dense Text') &&
      component.includes("lg:grid-cols-[minmax(0,1fr)_320px]") &&
      promptExamplesSection.indexOf('<PromptCopyButton') < promptExamplesSection.indexOf('<ImagePlaceholder slot={item.slot} label={item.title} />') &&
      !JSON.stringify(enCopy.prompts).includes('E-Commerce Detail Image') &&
      !JSON.stringify(enCopy.prompts).includes('Beauty Key Visual'),
  },
  {
    name: 'YouTube section embeds Seedream 4.5 community videos',
    pass:
      Array.isArray(enCopy.youtube?.examples) &&
      enCopy.youtube.examples.length >= 3 &&
      enCopy.youtube.examples.every((item) => item.href.includes('youtube.com/watch') && item.videoId && item.title && item.text) &&
      component.includes('copy.youtube.title') &&
      component.includes('https://www.youtube.com/embed/${item.videoId}') &&
      localizedCopies.every(({ copy }) => Array.isArray(copy.youtube?.examples) && copy.youtube.examples.length === enCopy.youtube.examples.length),
  },
  {
    name: 'visual slots are placeholders under model-assets path and not live local file paths',
    pass:
      component.includes('function ImagePlaceholder') &&
      component.includes('<img src={src} alt={label}') &&
      imageSlots.filter((slot) => slot !== 'final-cta').every((slot) => englishCopySource.includes(`"slot":"${slot}"`)) &&
      component.includes("'final-cta': '/model-assets/seedream-4-5/final-cta.png'") &&
      component.includes('/model-assets/seedream-4-5/') &&
      !component.includes('public/model/seedream-4-5') &&
      !component.includes('_codex/'),
  },
  {
    name: 'all Seedream 4.5 visual assets exist in public model-assets directory',
    pass:
      fs.existsSync(imageAssetDir) &&
      imageSlots.every((slot) => fs.existsSync(path.join(imageAssetDir, `${slot}.png`))),
  },
  {
    name: 'related links use existing Toolaze routes',
    pass:
      englishCopySource.includes('"href":"/model/gpt-image-2"') &&
      englishCopySource.includes('"href":"/model/gpt-image-2-0"') &&
      englishCopySource.includes('"href":"/model/nano-banana-pro"') &&
      englishCopySource.includes('"href":"/model/nano-banana-2"') &&
      englishCopySource.includes('"href":"/model/nano-banana"') &&
      englishCopySource.includes('"href":"/model"'),
  },
  {
    name: 'all Seedream 4.5 locale copy files exist with matching structure',
    pass:
      locales.every((locale) => fs.existsSync(path.join(copyDir, `${locale}.json`))) &&
      localizedCopies.every(({ copy }) => JSON.stringify(shapeOf(copy)) === JSON.stringify(shapeOf(enCopy))) &&
      localizedCopies.every(({ copy }) => copy.hero.modelName === 'Seedream 4.5') &&
      localizedCopies.every(({ copy }) => copy.features.items.every((item) => imageSlots.includes(item.slot))) &&
      localizedCopies.every(({ copy }) => copy.gallery.examples.every((item) => imageSlots.includes(item.slot))) &&
      localizedCopies.every(({ copy }) => copy.prompts.examples.every((item) => imageSlots.includes(item.slot))),
  },
  {
    name: 'sitemap, locale redirect, and breadcrumbs include Seedream 4.5',
    pass:
      sitemap.includes("'seedream-4-5'") &&
      browserRedirect.includes("parts[1]==='seedream-4-5'") &&
      breadcrumb.includes("'/model/seedream-4-5'") &&
      localizedPage.includes("'seedream-4-5': 'seedream-4-5'") &&
      localizedPage.includes('<Seedream45LandingPage locale={locale} />') &&
      localizedPage.includes('getSeedream45PageMetadata'),
  },
]

let failed = 0

for (const check of checks) {
  if (check.pass) {
    console.log(`✓ ${check.name}`)
  } else {
    failed += 1
    console.error(`✗ ${check.name}`)
  }
}

if (failed > 0) {
  console.error(`\nSeedream 4.5 landing page checks failed: ${failed}`)
  process.exit(1)
}

console.log('\nSeedream 4.5 landing page checks passed.')
