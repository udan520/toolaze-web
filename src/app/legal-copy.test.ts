import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'
import { getAiToolsPageCopy } from './ai-tools/copy'
import { BROWSER_LOCALE_REDIRECT_SCRIPT } from '../lib/browser-locale-redirect'
import {
  filterPaymentReviewSections,
  sanitizePaymentReviewCommonTranslations,
  shouldRenderPaymentReviewSocialProofSection,
} from '../lib/payment-review-visibility'
import { getPreferredLocalizedUrl } from '../lib/site-language-switch'
import { getContactPageCopy, getSupportPolicyCopy } from './support-pages/support-page-copy'

const projectRoot = process.cwd()
const supportedLocales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-TW'] as const
const copyRoots = ['src/app', 'src/components', 'src/data']
const bannedCopyPatterns = [
  /locally in your browser/i,
  /local processing/i,
  /local ai/i,
  /never leave(?:s)? your device/i,
  /never leave(?:s)? your computer/i,
  /files? never leave/i,
  /never uploaded/i,
  /never transmitted/i,
  /nothing is sent to our servers/i,
  /do not upload/i,
  /no server uploads?/i,
  /stored locally/i,
  /stays local/i,
  /happens locally/i,
  /100%\s*(?:private|privacy|local)/i,
  /run(?:s)? entirely in your browser/i,
  /works? entirely in your browser/i,
  /entirely in your browser/i,
  /all .* happens in your browser/i,
  /browser-based compressor/i,
]

function readProjectFile(path: string) {
  return readFileSync(join(projectRoot, path), 'utf8')
}

function readJson(path: string) {
  return JSON.parse(readProjectFile(path))
}

function walkFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolute = join(directory, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) return walkFiles(absolute)
    return [absolute]
  })
}

function visibleCopyFiles() {
  return copyRoots
    .flatMap((root) => walkFiles(join(projectRoot, root)))
    .filter((file) => /\.(tsx|json)$/.test(file))
    .filter((file) => !file.endsWith('.test.tsx') && !file.endsWith('.test.ts'))
}

test('public site copy no longer promises browser-only or no-upload processing', () => {
  const violations = visibleCopyFiles().flatMap((file) => {
    const content = readFileSync(file, 'utf8')
    return bannedCopyPatterns
      .filter((pattern) => pattern.test(content))
      .map((pattern) => `${relative(projectRoot, file)} -> ${pattern}`)
  })

  assert.deepEqual(violations, [])
})

test('legal policy pages exist and cover AI generation, credits, refunds, and acceptable use', () => {
  const requiredPages = [
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/refund-policy/page.tsx',
    'src/app/acceptable-use/page.tsx',
  ]

  for (const page of requiredPages) {
    assert.equal(existsSync(join(projectRoot, page)), true, `${page} should exist`)
  }

  const privacy = readProjectFile('src/app/privacy/page.tsx')
  assert.match(privacy, /AI generation/i)
  assert.match(privacy, /prompts/i)
  assert.match(privacy, /uploaded images/i)
  assert.match(privacy, /third-party AI providers/i)
  assert.match(privacy, /Creem/i)
  assert.match(privacy, /credits/i)

  const terms = readProjectFile('src/app/terms/page.tsx')
  assert.match(terms, /credits/i)
  assert.match(terms, /failed generation/i)
  assert.match(terms, /commercial use/i)
  assert.match(terms, /Acceptable Use Policy/i)
  assert.match(terms, /NSFW|sexual/i)
  assert.match(terms, /third-party model/i)

  const refund = JSON.stringify(getSupportPolicyCopy('refundPolicy', 'en'))
  assert.match(refund, /unused credits/i)
  assert.match(refund, /used credits/i)
  assert.match(refund, /failed generation/i)
  assert.match(refund, /12 months/i)
  assert.match(refund, /support@toolaze\.com/i)

  const acceptableUse = JSON.stringify(getSupportPolicyCopy('acceptableUse', 'en'))
  assert.match(acceptableUse, /NSFW/i)
  assert.match(acceptableUse, /sexual/i)
  assert.match(acceptableUse, /illegal/i)
  assert.match(acceptableUse, /deepfake|impersonation/i)
  assert.match(acceptableUse, /minors/i)
  assert.match(acceptableUse, /copyright/i)
})

test('footer, sitemap, and locale redirects expose the required legal routes', () => {
  const footer = readProjectFile('src/components/Footer.tsx')
  assert.match(footer, /\/refund-policy/)
  assert.match(footer, /\/acceptable-use/)
  assert.match(footer, /\/contact/)

  const sitemap = readProjectFile('src/app/sitemap.ts')
  assert.match(sitemap, /refund-policy/)
  assert.match(sitemap, /acceptable-use/)
  assert.match(sitemap, /contact/)

  assert.equal(getPreferredLocalizedUrl('/refund-policy', 'de'), '/de/refund-policy')
  assert.equal(getPreferredLocalizedUrl('/acceptable-use', 'zh-TW'), '/zh-TW/acceptable-use')
  assert.equal(getPreferredLocalizedUrl('/contact', 'fr'), '/fr/contact')
  assert.doesNotMatch(BROWSER_LOCALE_REDIRECT_SCRIPT, /englishOnlyRoots[\s\S]*refund-policy/)
  assert.doesNotMatch(BROWSER_LOCALE_REDIRECT_SCRIPT, /englishOnlyRoots[\s\S]*acceptable-use/)
  assert.doesNotMatch(BROWSER_LOCALE_REDIRECT_SCRIPT, /englishOnlyRoots[\s\S]*contact/)
})

test('localized common legal copy removes old local-only promises', () => {
  for (const locale of supportedLocales) {
    const common = readJson(`src/data/${locale}/common.json`)
    const legalCopy = JSON.stringify({
      footer: common.footer,
      about: common.about,
      privacy: common.privacy,
      terms: common.terms,
      breadcrumb: common.breadcrumb,
    })

    for (const pattern of bannedCopyPatterns) {
      assert.doesNotMatch(legalCopy, pattern, `${locale} still contains ${pattern}`)
    }

    assert.match(legalCopy, /AI|KI|IA|AI|人工|인공|providers|payment|credits|退款|払い戻し|Rückerstattung|reembolso|rimborso/i)
  }
})

test('Creem-facing homepage and about copy match credit-based AI generation', () => {
  const homePage = readProjectFile('src/components/home/HomePageMain.tsx')
  const aboutPage = readProjectFile('src/app/about/page.tsx')
  const homeCommon = JSON.stringify(readJson('src/data/en/common.json').home)
  const combined = `${homePage}\n${aboutPage}\n${homeCommon}`

  const misleadingAiClaims = [
    /all free, no sign up required/i,
    /no signup and no paywall/i,
    /no sign up, no limits/i,
    /no credit card, no daily limits/i,
    /100%\s*free/i,
    /free AI image generator and AI video generator online/i,
    /AI image generator is 100%\s*free/i,
    /Keep your wallet shut/i,
    /expensive server bills/i,
  ]

  for (const pattern of misleadingAiClaims) {
    assert.doesNotMatch(combined, pattern)
  }

  assert.match(combined, /Free to try/i)
  assert.match(combined, /purchase credits/i)
  assert.match(combined, /third-party AI models/i)
  assert.match(combined, /cloud infrastructure/i)
})

test('public support and model-provider disclaimers are visible for Creem review', () => {
  assert.equal(existsSync(join(projectRoot, 'src/app/contact/page.tsx')), true)

  const contact = JSON.stringify(getContactPageCopy('en'))
  assert.match(contact, /support@toolaze\.com/i)
  assert.match(contact, /3 business days/i)
  assert.match(contact, /refund/i)
  assert.match(contact, /abuse/i)

  const footer = readProjectFile('src/components/Footer.tsx')
  assert.match(footer, /\/contact/)
  assert.match(footer, /independent AI creative platform/i)
  assert.match(footer, /custom interface for supported third-party AI model workflows/i)
  assert.match(footer, /not affiliated with or endorsed by those model creators unless explicitly stated/i)
  assert.doesNotMatch(footer, /powered by supported AI model providers/i)

  const navigation = readProjectFile('src/components/Navigation.tsx')
  assert.match(navigation, /Help & Support/)
  assert.match(navigation, /support@toolaze\.com/)

  const terms = readProjectFile('src/app/terms/page.tsx')
  assert.match(terms, /independent AI creative platform/i)
  assert.match(terms, /model names belong to their respective owners/i)
  assert.match(terms, /not affiliated with or endorsed by model creators unless a page explicitly says otherwise/i)

  const englishCommonTerms = JSON.stringify(readJson('src/data/en/common.json').terms)
  assert.match(englishCommonTerms, /independent AI creative platform/i)
  assert.match(englishCommonTerms, /not affiliated with or endorsed by model creators unless a page explicitly says otherwise/i)
})

test('model pages avoid repeated AI wrapper disclosure while keeping model titles unchanged', () => {
  const modelSurfaces = [
    'src/app/model/ModelPageContent.tsx',
    'src/components/blocks/ToolL2PageContent.tsx',
    'src/components/GptImage2LandingPage.tsx',
    'src/components/Seedream45LandingPage.tsx',
    'src/components/Seedream50LiteLandingPage.tsx',
    'src/components/Seedream50ProLandingPage.tsx',
    'src/components/Wan27ImageLandingPage.tsx',
  ]

  assert.equal(existsSync(join(projectRoot, 'src/components/ModelWorkflowDisclosure.tsx')), false)
  for (const file of modelSurfaces) {
    assert.doesNotMatch(
      readProjectFile(file),
      /ModelWorkflowDisclosure|Model workflow notice/i,
      `${file} should rely on the global footer disclosure instead of repeating a page-level notice`,
    )
  }

  const unchangedTitleFiles = [
    'src/app/model/gpt-image-2/page.tsx',
    'src/app/model/nano-banana-pro/page.tsx',
    'src/app/model/nano-banana-2/page.tsx',
    'src/app/model/kling-3/page.tsx',
    'src/app/model/seedance-2/page.tsx',
  ]

  for (const file of unchangedTitleFiles) {
    const content = readProjectFile(file)
    assert.match(content, /metadata|generateMetadata|title:/, `${file} should keep its existing metadata title path`)
  }
})

test('sensitive creative tools show Creem-safe usage boundaries', () => {
  const hairstyle = readJson('src/data/en/ai-hairstyle-changer.json')
  const hairColor = readJson('src/data/en/ai-hair-color-changer.json')
  const watermark = readProjectFile('src/data/en/watermark-remover.json')
  const watermarkHowTo = readProjectFile('src/data/en/watermark-remover/how-to-remove-watermark.json')
  const watermarkTool = readProjectFile('src/components/WatermarkRemover.tsx')

  const hairstyleCopy = JSON.stringify(hairstyle)
  const hairColorCopy = JSON.stringify(hairColor)
  assert.match(hairstyleCopy, /changes hairstyle only|focused on hairstyle changes/i)
  assert.match(hairstyleCopy, /preserving the face and non-hair details/i)
  assert.match(hairColorCopy, /changes hair color only|focused on the visible hair area/i)
  assert.match(hairColorCopy, /keeping the face, hairstyle, skin tone, and background/i)
  assert.match(watermark, /own the image, have a license, or are authorized to edit/i)
  assert.match(watermarkHowTo, /own the image or have permission/i)
  assert.match(watermarkTool, /own this image or have permission/i)
})

test('payment review sensitive tools are hidden from public entry points', () => {
  const hiddenToolHrefs = ['/watermark-remover', '/ai-couple-photo-maker']
  const homeGrid = readProjectFile('src/lib/homepage-grid-tools.ts')
  const navigation = readProjectFile('src/components/Navigation.tsx')
  const footer = readProjectFile('src/components/Footer.tsx')
  const sitemap = readProjectFile('src/app/sitemap.ts')
  const seoLoader = readProjectFile('src/lib/seo-loader.ts')
  const aiToolsCopy = getAiToolsPageCopy('en')

  for (const href of hiddenToolHrefs) {
    assert.doesNotMatch(homeGrid, new RegExp(`id: '${href.slice(1)}'`))
    assert.doesNotMatch(navigation, new RegExp(`getLocalizedHref\\('${href}'\\)`))
    assert.doesNotMatch(footer, new RegExp(`getLocalizedHref\\('${href}'\\)`))
    assert.doesNotMatch(sitemap, new RegExp(href))
    assert.equal(aiToolsCopy.cards.some((card) => card.href === href), false)
  }

  const metadata = JSON.stringify(aiToolsCopy.metadata)
  assert.doesNotMatch(metadata, /Watermark Remover|AI Couple Photo Maker/i)
  assert.doesNotMatch(seoLoader, /tools\.push\(\{ tool: 'watermark-remover'/)
})

test('unverified social proof blocks are hidden during payment review', () => {
  assert.deepEqual(
    filterPaymentReviewSections(['howToUse', 'rating', 'features', 'testimonials', 'reviews', 'comments', 'faq']),
    ['howToUse', 'features', 'faq']
  )

  for (const section of ['rating', 'testimonials', 'reviews', 'comments']) {
    assert.equal(shouldRenderPaymentReviewSocialProofSection(section), false)
  }

  assert.equal(shouldRenderPaymentReviewSocialProofSection('faq'), true)

  const sanitized = sanitizePaymentReviewCommonTranslations({
    nav: { home: 'Home' },
    rating: { rating: '4.9/5 FROM 10K+ CREATORS' },
  })

  assert.equal('rating' in sanitized, false)
  assert.deepEqual(sanitized.nav, { home: 'Home' })
})

test('payment review bundles do not ship default fake social proof copy', () => {
  const sourceFiles = [
    'src/components/blocks/Rating.tsx',
    'src/components/blocks/ToolL2PageContent.tsx',
    'src/app/[locale]/[tool]/[slug]/ToolSlugPageContent.tsx',
    'src/lib/payment-review-visibility.ts',
  ]
  const riskyDefaults = [
    /4\.9\/5 FROM 10K/i,
    /Trusted by Thousands/i,
    /Join thousands of satisfied/i,
    /5 star review/i,
  ]

  const violations = sourceFiles.flatMap((file) => {
    const content = readProjectFile(file)
    return riskyDefaults.filter((pattern) => pattern.test(content)).map((pattern) => `${file} -> ${pattern}`)
  })

  assert.deepEqual(violations, [])
})
