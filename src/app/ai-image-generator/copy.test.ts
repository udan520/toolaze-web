import assert from 'node:assert/strict'
import test from 'node:test'
import {
  AI_IMAGE_GENERATOR_LOCALES,
  type AiImageGeneratorPageCopy,
  getAiImageGeneratorPageCopy,
} from './copy'

type AiImageGeneratorPageCopyLocale = (typeof AI_IMAGE_GENERATOR_LOCALES)[number]

function shouldAllowSharedEnglishPath(path: string, locale: AiImageGeneratorPageCopyLocale): boolean {
  return path.includes('.prompt')
    || path.includes('.href')
    || path.includes('.image')
    || path.includes('.imageId')
    || path.includes('.url')
    || path.includes('.width')
    || path.includes('.height')
    || path.includes('.output')
    || path.endsWith('.model')
    || /^models\.cards\[\d+\]\.title$/.test(path)
    || /^related\.cards\[\d+\]\.title$/.test(path)
    || (locale === 'fr' && path === 'modes.headers.label')
    || (locale === 'it' && path === 'modes.rows[2].label')
}

function flattenStrings(value: unknown, prefix = ''): Array<[string, string]> {
  const strings: Array<[string, string]> = []

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      strings.push(...flattenStrings(item, `${prefix}[${index}]`))
    })
    return strings
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, child]) => {
      strings.push(...flattenStrings(child, prefix ? `${prefix}.${key}` : key))
    })
    return strings
  }

  if (typeof value === 'string') {
    strings.push([prefix, value])
  }

  return strings
}

const localizedEnglishResidueTerms = [
  /\bAI Image Generator\b/i,
  /\bImage Generator\b/i,
  /\bCreate\b/i,
  /\bImages\b/i,
  /\bIdeas\b/i,
  /\bBest\b/i,
  /\bModels\b/i,
  /\bGenerate\b/i,
  /\bThumbnail(s)?\b/i,
  /\bMockup(s)?\b/i,
  /\bWorkflow(s)?\b/i,
  /\bReference\b/i,
  /\bCompare\b/i,
  /\bStart\b/i,
  /\bCommercial\b/i,
  /\bPrompt(s)?\b/i,
  /\bFAQ\b/i,
  /\bproduct visuals\b/i,
  /\bposters\b/i,
  /\bcommercial design drafts\b/i,
  /\becommerce\b/i,
  /\bconcept art\b/i,
]

function shouldAllowLocalizedEnglishResidue(path: string, value: string): boolean {
  return path.includes('.prompt')
    || path.includes('.href')
    || path.includes('.image')
    || path.includes('.imageId')
    || path.includes('.url')
    || path.includes('.width')
    || path.includes('.height')
    || path.includes('.output')
    || path.endsWith('.model')
    || value.includes('GPT Image 2')
    || value.includes('Wan 2.7 Image')
    || value.includes('Nano Banana Pro')
    || value.includes('Nano Banana 2')
    || value.includes('Seedream 4.5')
    || value.includes('Seedream 5.0 Lite')
    || value.includes('YouTube')
    || value.includes('TikTok')
    || value.includes('Instagram')
    || value.includes('WebP')
    || value.includes('HEIC')
    || value.includes('JPG')
    || value.includes('PNG')
    || /\bUI\b/.test(value)
}

test('AI Image Generator exposes localized page copy for every supported locale', () => {
  const en = getAiImageGeneratorPageCopy('en')
  const localizedLocales = AI_IMAGE_GENERATOR_LOCALES.filter((locale) => locale !== 'en')

  for (const locale of localizedLocales) {
    const copy = getAiImageGeneratorPageCopy(locale)

    assert.notEqual(copy.metadata.title, en.metadata.title, locale)
    assert.notEqual(copy.hero.description, en.hero.description, locale)
    assert.notEqual(copy.whatIs.title, en.whatIs.title, locale)
    assert.notEqual(copy.features.title, en.features.title, locale)
    assert.notEqual(copy.gallery.title, en.gallery.title, locale)
    assert.notEqual(copy.models.title, en.models.title, locale)
    assert.notEqual(copy.modes.title, en.modes.title, locale)
    assert.notEqual(copy.prompts.title, en.prompts.title, locale)
    assert.notEqual(copy.howTo.title, en.howTo.title, locale)
    assert.notEqual(copy.useCases.title, en.useCases.title, locale)
    assert.notEqual(copy.related.title, en.related.title, locale)
    assert.notEqual(copy.faq.title, en.faq.title, locale)
    assert.notEqual(copy.cta.title, en.cta.title, locale)
  }
})

test('AI Image Generator localizes all visible nested copy', () => {
  const en = getAiImageGeneratorPageCopy('en')
  const enStrings = new Map(flattenStrings(en))
  const failures: string[] = []

  for (const locale of AI_IMAGE_GENERATOR_LOCALES.filter((item) => item !== 'en')) {
    const copy = getAiImageGeneratorPageCopy(locale) as AiImageGeneratorPageCopy
    const untranslatedPaths = flattenStrings(copy)
      .filter(([path, value]) => !shouldAllowSharedEnglishPath(path, locale) && value === enStrings.get(path))
      .map(([path]) => path)

    if (untranslatedPaths.length > 0) {
      failures.push(`${locale}: ${untranslatedPaths.join(', ')}`)
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'))
})

test('AI Image Generator localized copy avoids visible English residue', () => {
  const failures: string[] = []

  for (const locale of ['pt'] as const) {
    const copy = getAiImageGeneratorPageCopy(locale) as AiImageGeneratorPageCopy
    const residuePaths = flattenStrings(copy)
      .filter(([path, value]) => !shouldAllowLocalizedEnglishResidue(path, value))
      .filter(([, value]) => localizedEnglishResidueTerms.some((term) => term.test(value)))
      .map(([path, value]) => `${path}: ${value}`)

    if (residuePaths.length > 0) {
      failures.push(`${locale}:\n${residuePaths.join('\n')}`)
    }
  }

  assert.deepEqual(failures, [], failures.join('\n'))
})

test('AI Image Generator localized copy keeps structural asset slots', () => {
  const en = getAiImageGeneratorPageCopy('en')

  for (const locale of AI_IMAGE_GENERATOR_LOCALES) {
    const copy = getAiImageGeneratorPageCopy(locale)

    assert.deepEqual(copy.samples.map((item) => item.url), en.samples.map((item) => item.url), locale)
    assert.deepEqual(copy.features.items.map((item) => item.image), en.features.items.map((item) => item.image), locale)
    assert.deepEqual(copy.gallery.examples.map((item) => item.image), en.gallery.examples.map((item) => item.image), locale)
    assert.deepEqual(copy.prompts.examples.map((item) => item.image), en.prompts.examples.map((item) => item.image), locale)
    assert.deepEqual(copy.related.cards.map((item) => item.href), en.related.cards.map((item) => item.href), locale)
  }
})

test('German AI Image Generator localizes the GPT Image 2 prompts related card title', () => {
  const en = getAiImageGeneratorPageCopy('en')
  const de = getAiImageGeneratorPageCopy('de')

  assert.notEqual(de.related.cards[4].title, en.related.cards[4].title)
  assert.equal(de.related.cards[4].title, 'GPT Image 2 Prompt-Beispiele')
})

test('AI Image Generator does not reuse another locale as fallback copy', () => {
  const de = getAiImageGeneratorPageCopy('de')
  const ja = getAiImageGeneratorPageCopy('ja')

  for (const locale of ['es', 'pt', 'fr', 'it'] as const) {
    const copy = getAiImageGeneratorPageCopy(locale)
    assert.notEqual(copy.hero.description, de.hero.description, locale)
    assert.notEqual(copy.faq.title, de.faq.title, locale)
  }

  for (const locale of ['zh-TW', 'ko'] as const) {
    const copy = getAiImageGeneratorPageCopy(locale)
    assert.notEqual(copy.hero.description, ja.hero.description, locale)
    assert.notEqual(copy.faq.title, ja.faq.title, locale)
  }
})
