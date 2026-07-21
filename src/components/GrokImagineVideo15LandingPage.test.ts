import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import {
  GROK_IMAGINE_VIDEO_15_LOCALES,
  getGrokImagineVideo15LandingCopy,
} from '../lib/grok-imagine-video-1-5-landing-copy'

const projectRoot = process.cwd()
const componentPath = join(projectRoot, 'src', 'components', 'GrokImagineVideo15LandingPage.tsx')
const routePath = join(projectRoot, 'src', 'app', 'model', 'grok-imagine-video-1-5', 'page.tsx')
const seoJsonPath = join(projectRoot, 'src', 'data', 'en', 'grok-imagine-video-1-5.json')
const copyPath = join(projectRoot, 'src', 'lib', 'grok-imagine-video-1-5-landing-copy.ts')

test('Grok Imagine Video 1.5 page mirrors GPT Image 2 landing page section structure', () => {
  const source = readFileSync(componentPath, 'utf8')
  const expectedSections = [
    'id="grok-imagine-video-1-5-generator"',
    'data-section="what-is"',
    'id="features"',
    'id="examples"',
    'id="compare"',
    'id="how-to"',
    'id="prompts"',
    'data-section="prompt-formula"',
    'data-section="common-problems"',
    'data-section="related"',
    'id="faq"',
    'data-section="final-cta"',
  ]

  const missing = expectedSections.filter((section) => !source.includes(section))
  assert.deepEqual(missing, [])
})

test('Grok route uses the dedicated landing page instead of generic L2 content', () => {
  const source = readFileSync(routePath, 'utf8')

  assert.match(source, /GrokImagineVideo15LandingPage/)
  assert.doesNotMatch(source, /ToolL2PageContent/)
})

test('Grok page supports every site locale with localized visible copy', () => {
  const expectedLocales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

  assert.deepEqual([...GROK_IMAGINE_VIDEO_15_LOCALES], expectedLocales)

  const english = getGrokImagineVideo15LandingCopy('en')
  for (const locale of expectedLocales.slice(1)) {
    const localized = getGrokImagineVideo15LandingCopy(locale)
    assert.notEqual(localized.metadata.description, english.metadata.description, `${locale} metadata`)
    assert.notEqual(localized.hero.description, english.hero.description, `${locale} hero`)
    assert.notEqual(localized.features.text, english.features.text, `${locale} features`)
    assert.notEqual(localized.gallery.text, english.gallery.text, `${locale} use cases`)
    assert.notEqual(localized.comparison.text, english.comparison.text, `${locale} comparison`)
    assert.notEqual(localized.promptFormula.text, english.promptFormula.text, `${locale} prompt guidance`)
    assert.notEqual(localized.quality.text, english.quality.text, `${locale} fixes`)
    assert.notEqual(localized.faq.items[0].a, english.faq.items[0].a, `${locale} FAQ`)
    assert.equal(localized.prompts.examples[0].prompt, english.prompts.examples[0].prompt, `${locale} prompt`)
  }
})

test('localized Grok route renders the dedicated landing page and localized metadata', () => {
  const source = readFileSync(join(projectRoot, 'src', 'app', '[locale]', 'model', '[model]', 'page.tsx'), 'utf8')

  assert.match(source, /getGrokImagineVideo15PageMetadata/)
  assert.match(source, /<GrokImagineVideo15LandingPage locale=\{locale\}/)
})

test('Grok public landing page copy does not expose implementation provider branding', () => {
  const publicSources = [
    ['component', readFileSync(componentPath, 'utf8')],
    ['landing copy', readFileSync(copyPath, 'utf8')],
    ['seo json', readFileSync(seoJsonPath, 'utf8')],
  ] as const
  const forbiddenVisibleCopy =
    /\bKIE\b|\bKie\b|kie\.ai|\bprovider\b|\bProvider\b|API platform|server-side|Server-Side|backend integration|current integration|provider route|\bSEO\b|keyword|ranking|AI Overview|this page covers|page is built|these examples show|direct answers for searches|single generator page/

  for (const [label, source] of publicSources) {
    assert.doesNotMatch(source, forbiddenVisibleCopy, label)
  }
})

test('Grok page copy is centralized in a landing-copy source', () => {
  const componentSource = readFileSync(componentPath, 'utf8')
  const copySource = readFileSync(copyPath, 'utf8')

  assert.match(componentSource, /getGrokImagineVideo15LandingCopy/)
  assert.match(copySource, /export function getGrokImagineVideo15LandingCopy/)
  assert.match(copySource, /one reference image/i)
  assert.match(copySource, /480p/)
  assert.match(copySource, /720p/)
  assert.match(copySource, /20MB/)
  assert.match(copySource, /1-15 second/i)
  assert.match(copySource, /default 5-second/i)
  assert.doesNotMatch(copySource, /8-second|8s/)
})

test('Grok comparison table uses researched concrete model capabilities', () => {
  const copySource = readFileSync(copyPath, 'utf8')

  assert.doesNotMatch(copySource, /Use Grok when the job is short video motion/)
  assert.match(copySource, /generally available/i)
  assert.match(copySource, /image-to-video model/i)
  assert.match(copySource, /starting image/i)
  assert.match(copySource, /Text, image, audio, and video/i)
  assert.match(copySource, /up to 9 images, 3 clips, 3 audio files/i)
  assert.match(copySource, /Text, images, audio, video/i)
  assert.match(copySource, /Up to 15 seconds/i)
  assert.match(copySource, /voiceover/i)
  assert.match(copySource, /Veo 3\.1/i)
  assert.match(copySource, /native audio support/i)
})

test('Grok comparison table keeps model cells concise and decision-ready', () => {
  const copy = getGrokImagineVideo15LandingCopy('en')
  const cells = copy.comparison.rows.flatMap((row) => [row.grok, row.seedance, row.kling, row.veo])

  for (const cell of cells) {
    const words = cell.split(/\s+/).filter(Boolean)
    assert.ok(words.length <= 18, `comparison cell should stay concise: ${cell}`)
    assert.doesNotMatch(cell, /\bToolaze\b/, `comparison cells should compare model traits, not platform wording: ${cell}`)
  }

  assert.match(copy.comparison.rows.find((row) => row.capability === 'Output and length')?.kling || '', /Up to 15 seconds/i)
})

test('Grok visible copy avoids KIE, internal SEO language, and decorative all-caps labels', () => {
  const copySource = readFileSync(copyPath, 'utf8')
  const source = `${readFileSync(componentPath, 'utf8')}\n${copySource}\n${readFileSync(seoJsonPath, 'utf8')}`
  const forbidden = /\bKIE\b|\bKie\b|kie\.ai|API platform|provider route|current integration|keyword|ranking|AI Overview/
  const noisyAllCaps = /IMAGE-TO-VIDEO \+ TEXT-TO-VIDEO|TOOLAZE VIDEO|GROK WORKFLOW/
  const decorativeWorkflowLabels = /Toolaze Video|Grok workflow/

  assert.doesNotMatch(source, forbidden)
  assert.doesNotMatch(source, noisyAllCaps)
  assert.doesNotMatch(source, decorativeWorkflowLabels)
})

test('Grok first-screen generator does not add a redundant width wrapper', () => {
  const source = readFileSync(componentPath, 'utf8')
  const generatorIndex = source.indexOf('id="grok-imagine-video-1-5-generator"')
  const toolIndex = source.indexOf('<AiVideoGeneratorTool')

  assert.notEqual(generatorIndex, -1, 'generator section should exist')
  assert.notEqual(toolIndex, -1, 'real video generator should render in the first section')
  assert.ok(generatorIndex < toolIndex, 'tool should sit inside the generator section')
  assert.doesNotMatch(source, /<div className="w-full max-w-full">\s*<AiVideoGeneratorTool/, 'generator section should pass directly into the tool without an extra wrapper div')
})

test('Grok page uses real 16:9 video assets for the hero demo and prompt examples', () => {
  const source = readFileSync(componentPath, 'utf8')
  const copy = getGrokImagineVideo15LandingCopy('en')
  const videoPaths = [
    copy.hero.demoVideo.src,
    ...copy.prompts.examples.map((item) => item.videoSrc),
  ]

  assert.match(source, /demoVideo=\{copy\.hero\.demoVideo\}/, 'hero generator should receive the real demo video asset')
  assert.match(source, /data-grok-demo-video/, 'prompt examples should render real video media')
  assert.match(copy.hero.demoVideo.src, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\//)

  for (const item of copy.prompts.examples) {
    assert.match(item.videoSrc, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\//, `${item.id} should use an R2 video asset`)
    assert.match(item.videoLabel, /16:9/, `${item.id} label should document the video ratio`)
  }
  assert.equal(new Set(videoPaths).size, videoPaths.length)
})

test('Grok feature items define unique 16:9 image assets with accessible labels', () => {
  const copy = getGrokImagineVideo15LandingCopy('en')
  const imagePaths = copy.features.items.map((item) => item.imageSrc)

  assert.equal(new Set(imagePaths).size, copy.features.items.length)

  for (const item of copy.features.items) {
    assert.match(item.imageSrc, /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/)
    assert.ok(item.imageAlt.trim().length > 0, `${item.slot} should have descriptive alt text`)
  }
})

test('Grok features render their generated images in a responsive 16:9 component', () => {
  const source = readFileSync(componentPath, 'utf8')

  assert.match(source, /import Image from 'next\/image'/)
  assert.match(source, /data-grok-feature-image/)
  assert.match(source, /src=\{item\.imageSrc\}/)
  assert.match(source, /alt=\{item\.imageAlt\}/)
  assert.match(source, /aspect-video/)
})

test('Grok use cases define eight unique 16:9 image assets with accessible labels', () => {
  const copy = getGrokImagineVideo15LandingCopy('en')
  const imagePaths = copy.gallery.examples.map((item) => item.imageSrc)

  assert.equal(copy.gallery.examples.length, 8)
  assert.equal(new Set(imagePaths).size, copy.gallery.examples.length)

  for (const item of copy.gallery.examples) {
    assert.match(item.imageSrc || '', /^https:\/\/pub-[a-z0-9]+\.r2\.dev\/uploads\/[a-z0-9]+\.webp$/)
    assert.ok(item.imageAlt?.trim(), `${item.slot} should have descriptive alt text`)
  }
})

test('Grok use-case cards render generated images instead of generic placeholders', () => {
  const source = readFileSync(componentPath, 'utf8')

  assert.match(source, /data-grok-use-case-image/)
  assert.match(source, /src=\{item\.imageSrc!\}/)
  assert.match(source, /alt=\{item\.imageAlt!\}/)
})

test('Grok SEO refresh removes duplicate sections and adds actionable guidance', () => {
  const source = readFileSync(componentPath, 'utf8')

  assert.doesNotMatch(source, /data-section="audiences"/)
  assert.doesNotMatch(source, /data-section="video-guides"/)
  assert.doesNotMatch(source, /data-section="social-examples"/)
  assert.match(source, /data-section="prompt-formula"/)
  assert.match(source, /data-section="common-problems"/)
})

test('Grok features focus on model capabilities and the comparison stays video-only', () => {
  const copy = getGrokImagineVideo15LandingCopy('en')
  const featureTitles = copy.features.items.map((item) => item.title).join(' ')
  const comparisonSource = JSON.stringify(copy.comparison)

  assert.match(featureTitles, /Audio and Speech/i)
  assert.match(featureTitles, /Motion and Physics/i)
  assert.doesNotMatch(featureTitles, /Preview|Download|Save the Result/i)
  assert.match(comparisonSource, /Veo 3\.1/i)
  assert.doesNotMatch(comparisonSource, /GPT Image 2|gptImage/i)
})
