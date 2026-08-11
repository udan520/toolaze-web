import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const taskId = '2026-08-10-seedance-2-5-live-generator'

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'))
}

function collectShape(value, path = '$', shape = []) {
  if (Array.isArray(value)) {
    shape.push(`${path}:array:${value.length}`)
    value.forEach((item, index) => collectShape(item, `${path}[${index}]`, shape))
    return shape
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort()
    shape.push(`${path}:object:${keys.join(',')}`)
    keys.forEach((key) => collectShape(value[key], path === '$' ? key : `${path}.${key}`, shape))
    return shape
  }
  shape.push(`${path}:${typeof value}`)
  return shape
}

function collectStrings(value, path = '$', strings = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${path}[${index}]`, strings))
    return strings
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) =>
      collectStrings(item, path === '$' ? key : `${path}.${key}`, strings),
    )
    return strings
  }
  if (typeof value === 'string') strings.push([path, value])
  return strings
}

function collectNumberFields(value, path = '$', numbers = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectNumberFields(item, `${path}[${index}]`, numbers))
    return numbers
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) =>
      collectNumberFields(item, path === '$' ? key : `${path}.${key}`, numbers),
    )
    return numbers
  }
  if (typeof value === 'number') numbers[path] = value
  return numbers
}

function isTechnicalString(path) {
  return (
    path === 'topComponent' ||
    path === 'modelIntro.modelName' ||
    path.startsWith('sectionsOrder[') ||
    path.startsWith('topTool.') ||
    /^heroDemoVideo\.(?:type|src|poster|duration|uploadDate|sourceHistory)$/.test(path) ||
    /\.media\.(?:type|src|poster|duration)$/.test(path) ||
    /^modelComparison\.(?:featuredColumn|columnHeaders\.(?:baseline|target))$/.test(path)
  )
}

const faqTopicPatterns = {
  en: [/audio/i, /4K/i, /specific area|local region/i],
  de: [/Audio/i, /4K/i, /Bereich|lokale Bearbeitung/i],
  es: [/audio/i, /4K/i, /zona|edición local/i],
  fr: [/audio/i, /4K/i, /zone|retouche locale/i],
  it: [/audio/i, /4K/i, /area|modifica locale/i],
  ja: [/音声/, /4K/, /一部|部分編集/],
  ko: [/오디오|소리/, /4K/, /영역|부분 편집/],
  pt: [/áudio/i, /4K/i, /área|edição local/i],
  'zh-TW': [/音訊|聲音/, /4K/, /區域|局部/],
}

function validateLocalizedContent(locale, content, englishContent) {
  assert.deepEqual(collectShape(content), collectShape(englishContent), `${locale} structure mismatch`)

  const localizedStrings = new Map(collectStrings(content))
  const englishStrings = new Map(collectStrings(englishContent))
  const localizedTechnicalFields = Object.fromEntries(
    [...localizedStrings].filter(([path]) => isTechnicalString(path)),
  )
  const englishTechnicalFields = Object.fromEntries(
    [...englishStrings].filter(([path]) => isTechnicalString(path)),
  )
  assert.deepEqual(
    localizedTechnicalFields,
    englishTechnicalFields,
    `${locale} technical field mismatch`,
  )
  assert.deepEqual(
    collectNumberFields(content),
    collectNumberFields(englishContent),
    `${locale} numeric field mismatch`,
  )

  const faqPatterns = faqTopicPatterns[locale]
  assert.equal(faqPatterns?.length, content.faq.length, `${locale} FAQ topic contract missing`)
  content.faq.forEach((item, index) => {
    assert.match(`${item.q}\n${item.a}`, faqPatterns[index], `${locale} FAQ topic ${index} mismatch`)
  })

  const localizedNumbers = Object.fromEntries(
    [...localizedStrings].map(([path, value]) => [
      path,
      (value.match(/\d+(?:\.\d+)?/g) || []).sort(),
    ]),
  )
  const englishNumbers = Object.fromEntries(
    [...englishStrings].map(([path, value]) => [
      path,
      (value.match(/\d+(?:\.\d+)?/g) || []).sort(),
    ]),
  )
  assert.deepEqual(localizedNumbers, englishNumbers, `${locale} numeric contract mismatch`)

  for (const [path, englishValue] of englishStrings) {
    if (locale === 'en') continue
    if (isTechnicalString(path)) continue
    const isSubstantialSentence = englishValue.length >= 40 && englishValue.trim().split(/\s+/).length >= 6
    if (isSubstantialSentence && localizedStrings.get(path) === englishValue) {
      assert.fail(`${locale} English fallback at ${path}`)
    }
  }
}

test('localized content validator rejects structural, English fallback, and FAQ topic regressions', () => {
  assert.equal(typeof validateLocalizedContent, 'function')

  const englishContent = readJson('src/data/en/seedance-2-5.json')
  const germanContent = readJson('src/data/de/seedance-2-5.json')

  assert.doesNotThrow(() => validateLocalizedContent('en', englishContent, englishContent))
  assert.doesNotThrow(() => validateLocalizedContent('de', germanContent, englishContent))

  const missingComparisonRow = structuredClone(germanContent)
  missingComparisonRow.modelComparison.rows.pop()
  assert.throws(() => validateLocalizedContent('de', missingComparisonRow, englishContent), /structure/i)

  const changedMediaUrl = structuredClone(germanContent)
  changedMediaUrl.featureStories.items[0].media.src = 'https://assets.toolaze.com/wrong-video.mp4'
  assert.throws(() => validateLocalizedContent('de', changedMediaUrl, englishContent), /technical field/i)

  const changedReferenceLimit = structuredClone(germanContent)
  changedReferenceLimit.featureStories.items[1].paragraphs[0] = changedReferenceLimit.featureStories.items[1].paragraphs[0].replace('50', '60')
  assert.throws(() => validateLocalizedContent('de', changedReferenceLimit, englishContent), /numeric contract/i)

  const changedHeroRatio = structuredClone(germanContent)
  changedHeroRatio.heroDemoVideo.width = 4
  assert.throws(() => validateLocalizedContent('de', changedHeroRatio, englishContent), /numeric field/i)

  const englishFallback = structuredClone(germanContent)
  englishFallback.featureStories.items[2].paragraphs[0] = englishContent.featureStories.items[2].paragraphs[0]
  assert.throws(() => validateLocalizedContent('de', englishFallback, englishContent), /English fallback/i)

  const wrongFaqTopics = structuredClone(germanContent)
  wrongFaqTopics.faq = wrongFaqTopics.faq.map(() => structuredClone(wrongFaqTopics.faq[0]))
  assert.throws(() => validateLocalizedContent('de', wrongFaqTopics, englishContent), /FAQ topic/i)

  const wrongEnglishFaqTopics = structuredClone(englishContent)
  wrongEnglishFaqTopics.faq = wrongEnglishFaqTopics.faq.map(() =>
    structuredClone(wrongEnglishFaqTopics.faq[0]),
  )
  assert.throws(
    () => validateLocalizedContent('en', wrongEnglishFaqTopics, englishContent),
    /FAQ topic/i,
  )
})

test('Seedance 2.5 landing page renders the live shared video generator', () => {
  const l2Source = readFileSync(join(root, 'src/components/blocks/ToolL2PageContent.tsx'), 'utf8')
  const configSource = readFileSync(join(root, 'src/lib/ai-video-generator-config.ts'), 'utf8')

  assert.match(l2Source, /'seedance-2-5': 'seedance-2-5'/)
  assert.doesNotMatch(l2Source, /Seedance25LaunchUpdates/)
  assert.match(configSource, /id: 'seedance-2-5'[\s\S]*supportsMultimodalReferences: true/)
})

test('Seedance 2.5 localized content and SEO Factory records match the live KIE contract', () => {
  const forbidden = /this page|the page is designed|search intent|keyword|ranking|SEO|AI Overview|API platform|provider route|Unlimited Free|Free Forever|No Signup|No Login|waitlist|launch updates|access alerts/i
  const englishContent = readJson('src/data/en/seedance-2-5.json')
  assert.equal(englishContent.faq.length, 3, 'final FAQ should contain only additive questions')

  for (const locale of locales) {
    const publicContent = readJson(`src/data/${locale}/seedance-2-5.json`)
    const factoryContent = readJson(`_codex/seo-pipeline/tasks/${taskId}/content/${locale}.json`)
    assert.deepEqual(factoryContent, publicContent, locale)
    assert.deepEqual(publicContent.sectionsOrder, englishContent.sectionsOrder, `${locale} section order`)
    assert.equal(publicContent.featureStories.items.length, 4, `${locale} feature story count`)
    assert.equal(publicContent.howToUse.steps.length, 4, `${locale} How To step count`)
    assert.equal(publicContent.faq.length, englishContent.faq.length, `${locale} FAQ count`)
    for (const story of publicContent.featureStories.items) {
      assert.equal('timelineTitle' in story, false, `${locale} should not show a planning timeline title`)
      assert.equal('timeline' in story, false, `${locale} should not show a planning timeline`)
    }
    validateLocalizedContent(locale, publicContent, englishContent)
    if (locale !== 'en') {
      assert.notEqual(publicContent.hero.desc, englishContent.hero.desc, `${locale} Hero should be localized`)
      assert.notEqual(publicContent.featureStories.title, englishContent.featureStories.title, `${locale} Key Features title should be localized`)
      assert.notEqual(publicContent.howToUse.title, englishContent.howToUse.title, `${locale} How To title should be localized`)
      assert.notEqual(publicContent.faqTitle, englishContent.faqTitle, `${locale} FAQ title should be localized`)
    }
    assert.equal(publicContent.topTool.modelId, 'seedance-2-5', locale)
    assert.equal(publicContent.topTool.defaultMode, 'image-to-video', locale)
    assert.equal(publicContent.modelComparison.featuredColumn, 'baseline', `${locale} should highlight the leftmost Seedance 2.5 column`)
    assert.equal(publicContent.modelComparison.columnHeaders.baseline, 'Seedance 2.5', `${locale} should place the page model in the first model column`)
    assert.equal(publicContent.modelComparison.columnHeaders.target, 'Seedance 2.0', `${locale} should place the previous version after the page model`)
    assert.deepEqual(publicContent.sectionsOrder.slice(-2), ['performanceMetrics', 'faq'], locale)
    assert.ok(publicContent.faq.length <= 6, `${locale} FAQ should not exceed six questions`)
    assert.equal('launchUpdates' in publicContent, false, locale)
    assert.match(JSON.stringify(publicContent), /30/)
    assert.match(JSON.stringify(publicContent), /10/)
    assert.match(JSON.stringify(publicContent), /480p/)
    assert.match(JSON.stringify(publicContent), /720p/)
    assert.doesNotMatch(JSON.stringify(publicContent), forbidden, locale)
  }
})

test('English Seedance 2.5 copy explains the verified upgrade without overstating Toolaze controls', () => {
  const publicContent = readJson('src/data/en/seedance-2-5.json')
  const factoryContent = readJson(`_codex/seo-pipeline/tasks/${taskId}/content/en.json`)
  const visibleCopy = JSON.stringify(publicContent)

  assert.deepEqual(factoryContent, publicContent)
  assert.deepEqual(publicContent.sectionsOrder, [
    'featureStories',
    'modelComparison',
    'howToUse',
    'performanceMetrics',
    'faq',
  ])
  assert.match(publicContent.metadata.title, /^Seedance 2\.5 AI Video Generator/)
  assert.ok(publicContent.metadata.description.length >= 140)
  assert.ok(publicContent.metadata.description.length <= 160)
  assert.match(publicContent.hero.h1, /Seedance 2\.5[\s\S]*AI Video Generator/)
  assert.match(publicContent.hero.desc, /text[\s\S]*images[\s\S]*video[\s\S]*audio/i)
  assert.match(publicContent.hero.desc, /30 seconds/i)
  assert.match(publicContent.hero.desc, /50 (?:multimodal )?references/i)
  assert.match(publicContent.hero.desc, /motion|interact|camera/i)
  assert.equal('seedanceProof' in publicContent, false)
  assert.equal(publicContent.featureStories.title, 'Key Features of Seedance 2.5')
  assert.deepEqual(
    publicContent.featureStories.items.map((item) => item.title),
    [
      'Build a Complete 30-Second Scene',
      'Direct with Up to 50 Multimodal References',
      'Choreograph Motion, Space, and Interaction',
      'Control the Opening and Ending Frames',
    ],
  )
  for (const story of publicContent.featureStories.items) {
    assert.ok(story.paragraphs.length >= 2, `${story.title} needs decision-grade depth`)
    assert.ok(story.paragraphs.every((paragraph) => paragraph.length >= 80), `${story.title} has thin copy`)
    assert.match(story.media.src, /^https:\/\/assets\.toolaze\.com\/.+/)
    assert.ok(story.media.alt?.trim())
    assert.equal('caption' in story.media, false, `${story.title} should not render editorial media notes`)
  }
  const firstStory = publicContent.featureStories.items[0]
  assert.equal(firstStory.media.duration, 'PT5.042S')
  assert.equal('timelineTitle' in firstStory, false)
  assert.equal('timeline' in firstStory, false)
  assert.deepEqual(publicContent.modelComparison.columnHeaders, {
    metric: 'Feature',
    baseline: 'Seedance 2.5',
    target: 'Seedance 2.0',
  })
  assert.equal(publicContent.modelComparison.featuredColumn, 'baseline')
  assert.match(publicContent.modelComparison.rows[0].baseline, /30 seconds/i)
  assert.match(publicContent.modelComparison.rows[0].target, /4-15 seconds/i)
  assert.equal(
    publicContent.modelComparison.rows.filter((row) => /reference/i.test(row.label)).length,
    1,
    'comparison should not repeat reference capacity in a second row',
  )
  assert.equal('scenes' in publicContent, false)
  assert.equal('scenesTitle' in publicContent, false)
  assert.equal('scenesSubtitle' in publicContent, false)
  assert.deepEqual(publicContent.sectionsOrder.slice(-2), ['performanceMetrics', 'faq'])
  assert.match(visibleCopy, /480p/)
  assert.match(visibleCopy, /720p/)
  assert.match(visibleCopy, /30 reference images/)
  assert.match(visibleCopy, /10 reference videos/)
  assert.match(visibleCopy, /10 reference audio/)
  assert.doesNotMatch(visibleCopy, /2\.5 (?:adds|introduces) (?:multimodal|native audio)/i)
  assert.doesNotMatch(visibleCopy, /Toolaze[^.]{0,120}(?:4K|180 seconds|local(?:ized)? edit)/i)
  assert.doesNotMatch(visibleCopy, /stronger continuity|better quality|more stable|production-ready/i)
  assert.doesNotMatch(visibleCopy, /native 4K|10-bit|180-second|region-level editing|faster generation|20%|better prompt adherence/i)
  assert.doesNotMatch(
    visibleCopy,
    /documented|visible limits|planning burden|decision point|actual controls|not a guarantee|not entirely new|assuming every option described elsewhere|delivery requirement|best approached as|not a substitute for|this comparison does not assume|unprovided differences/i,
  )
  assert.equal(publicContent.modelComparison.columnHeaders.metric, 'Feature')
})

test('English Seedance 2.5 copy passes the final humanizer claim ledger', () => {
  const content = readJson('src/data/en/seedance-2-5.json')
  const surfaces = {
    hero: JSON.stringify(content.hero),
    featureStories: JSON.stringify(content.featureStories),
    modelComparison: JSON.stringify(content.modelComparison),
    howToUse: JSON.stringify(content.howToUse),
    performanceMetrics: JSON.stringify(content.performanceMetrics),
    faq: JSON.stringify(content.faq),
  }
  const surfacesMatching = (pattern) =>
    Object.entries(surfaces)
      .filter(([, copy]) => pattern.test(copy))
      .map(([name]) => name)

  assert.deepEqual(surfacesMatching(/(?:4-)?30[- ]second/i), [
    'hero',
    'featureStories',
    'modelComparison',
  ])
  assert.deepEqual(surfacesMatching(/50 (?:multimodal )?reference/i), [
    'hero',
    'featureStories',
    'modelComparison',
  ])
  assert.doesNotMatch(JSON.stringify(content.faq), /30[- ]second|50 (?:multimodal )?reference/i)
  assert.doesNotMatch(
    content.faq.map((item) => item.q).join('\n'),
    /What is Seedance 2\.5|How many references/i,
  )
  assert.ok(content.faq.length <= 6)
  assert.match(content.hero.desc, /Turn|Create|Bring/i)
})

test('English Seedance 2.5 page renders reusable editorial feature stories with real media', () => {
  const publicContent = readJson('src/data/en/seedance-2-5.json')
  const factoryContent = readJson(`_codex/seo-pipeline/tasks/${taskId}/content/en.json`)
  const l2Source = readFileSync(join(root, 'src/components/blocks/ToolL2PageContent.tsx'), 'utf8')
  const featureStoriesPath = join(root, 'src/components/blocks/ModelFeatureStories.tsx')
  const howTo = publicContent.howToUse
  const agentsSource = readFileSync(join(root, 'AGENTS.md'), 'utf8')

  assert.deepEqual(factoryContent, publicContent)
  assert.equal(existsSync(featureStoriesPath), true)
  const featureStoriesSource = readFileSync(featureStoriesPath, 'utf8')
  assert.equal(howTo.steps.length, 4)
  assert.equal(howTo.steps.filter((step) => step.media?.type === 'image').length, 4)
  assert.equal(howTo.steps.filter((step) => step.media?.type === 'video').length, 0)
  for (const step of howTo.steps) {
    assert.match(step.media.src, /^https:\/\/assets\.toolaze\.com\/.+\.webp$/)
    assert.ok(step.media.alt?.trim())
  }
  const historyStep = howTo.steps[3]
  assert.equal(historyStep.title, 'Open History and compare takes')
  assert.match(historyStep.desc, /Demo[\s\S]*History/i)
  assert.match(historyStep.media.alt, /History/i)
  assert.notEqual(historyStep.media.src, publicContent.heroDemoVideo.poster)
  assert.ok(publicContent.faq.length <= 6)
  assert.match(agentsSource, /FAQ[^\n]*(?:最多|不超过)[^\n]*6\s*(?:个|条)/i)
  assert.match(l2Source, /import ModelFeatureStories from '@\/components\/blocks\/ModelFeatureStories'/)
  assert.match(l2Source, /import Seedance25HowTo from '@\/components\/blocks\/Seedance25HowTo'/)
  assert.match(l2Source, /import Seedance25UseCases from '@\/components\/blocks\/Seedance25UseCases'/)
  assert.match(l2Source, /featureStories:\s*\(bgClass: string\)/)
  assert.match(l2Source, /<ModelFeatureStories/)
  assert.match(l2Source, /topComp === 'seedance-2-5'[\s\S]*<Seedance25HowTo/)
  assert.match(l2Source, /topComp === 'seedance-2-5'[\s\S]*<Seedance25UseCases/)
  assert.match(featureStoriesSource, /object-contain/)
  assert.match(featureStoriesSource, /media\.type === 'video'/)
  assert.match(featureStoriesSource, /lg:order-1/)
  assert.match(featureStoriesSource, /lg:order-2/)
  assert.doesNotMatch(featureStoriesSource, /eyebrow|kicker|badge|icon/)
  assert.doesNotMatch(featureStoriesSource, /figcaption|media\.caption/)
  assert.ok(featureStoriesSource.indexOf('<h3') < featureStoriesSource.indexOf('<figure'))
})

test('Seedance 2.5 content headings lead every custom section and the rule is documented', () => {
  const proofSource = readFileSync(join(root, 'src/components/blocks/Seedance25Proof.tsx'), 'utf8')
  const howToSource = readFileSync(join(root, 'src/components/blocks/Seedance25HowTo.tsx'), 'utf8')
  const useCasesSource = readFileSync(join(root, 'src/components/blocks/Seedance25UseCases.tsx'), 'utf8')
  const agentsSource = readFileSync(join(root, 'AGENTS.md'), 'utf8')
  const uiGuideSource = readFileSync(join(root, 'docs/UI_STYLE_GUIDE.md'), 'utf8')

  assert.doesNotMatch(`${proofSource}\n${howToSource}\n${useCasesSource}`, /eyebrow/)
  assert.ok(howToSource.indexOf('<h3') < howToSource.indexOf('Step {index + 1}'))
  assert.doesNotMatch(useCasesSource, /padStart\(2, '0'\)/)
  assert.match(agentsSource, /H1.*H2.*H3[\s\S]*(?:首个视觉信息|first visual information)/i)
  assert.match(agentsSource, /(?:eyebrow|kicker|badge|眉题|标签)/i)
  assert.match(uiGuideSource, /H1.*H2.*H3[\s\S]*(?:首个视觉信息|first visual information)/i)
})

test('Seedance 2.5 use cases fill the section with a responsive task matrix', () => {
  const useCasesSource = readFileSync(
    join(root, 'src/components/blocks/Seedance25UseCases.tsx'),
    'utf8',
  )

  assert.match(useCasesSource, /<ol className="[^"]*grid[^"]*sm:grid-cols-2/)
  assert.doesNotMatch(useCasesSource, /lg:sticky|lg:grid-cols-\[0\.82fr_1\.18fr\]/)
})

test('Seedance 2.5 proof and workflow use light Toolaze surfaces', () => {
  const proofSource = readFileSync(join(root, 'src/components/blocks/Seedance25Proof.tsx'), 'utf8')
  const howToSource = readFileSync(join(root, 'src/components/blocks/Seedance25HowTo.tsx'), 'utf8')

  assert.doesNotMatch(`${proofSource}\n${howToSource}`, /bg-slate-950|border-slate-950|border-white\/10|text-slate-300/)
  assert.match(proofSource, /bg-indigo-50/)
  assert.match(proofSource, /bg-white/)
  assert.match(howToSource, /bg-indigo-50 object-contain/)
})

test('Seedance 2.5 custom section headings use vertical full-width layouts', () => {
  const proofSource = readFileSync(join(root, 'src/components/blocks/Seedance25Proof.tsx'), 'utf8')
  const howToSource = readFileSync(join(root, 'src/components/blocks/Seedance25HowTo.tsx'), 'utf8')
  const useCasesSource = readFileSync(join(root, 'src/components/blocks/Seedance25UseCases.tsx'), 'utf8')

  assert.doesNotMatch(proofSource, /lg:grid-cols-\[1fr_1\.1fr\]/)
  assert.doesNotMatch(proofSource, /<h2 className="max-w-3xl/)
  assert.match(
    proofSource,
    /<h2[^>]*>[\s\S]*?<\/h2>[\s\S]*?description && \([\s\S]*?<p className="mt-5 max-w-5xl/,
  )

  assert.match(howToSource, /<div className="mx-auto max-w-6xl text-center">/)
  assert.match(howToSource, /subtitle && \([\s\S]*?<p className="mx-auto mt-5 max-w-5xl/)

  assert.match(useCasesSource, /<div className="max-w-6xl">/)
  assert.match(useCasesSource, /subtitle && <p className="mt-5 max-w-5xl/)
  assert.doesNotMatch(`${proofSource}\n${howToSource}\n${useCasesSource}`, /md:text-5xl/)
})

test('Seedance 2.5 SEO Factory task is ready for the existing model route', () => {
  const task = readJson(`_codex/seo-pipeline/tasks/${taskId}/task.json`)
  const queue = readJson('_codex/seo-pipeline/queue/ready.json')

  assert.equal(task.slug, 'seedance-2-5')
  assert.equal(task.pageType, 'model')
  assert.equal(task.status, 'ready_for_publish')
  assert.equal(task.canonicalPath, '/model/seedance-2-5')
  assert.ok(queue.tasks.some((entry) => entry.taskId === taskId && entry.status === 'ready_for_publish'))
})
