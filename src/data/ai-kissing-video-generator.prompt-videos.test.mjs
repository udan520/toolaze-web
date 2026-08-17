import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
const locales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh-TW']
const localizedLocales = locales.filter((locale) => locale !== 'en')
const r2Base = 'https://assets.toolaze.com/uploads/'

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

test('AI kissing page exposes one horizontal Demo video and four vertical prompt videos in page and SEO data', async () => {
  for (const locale of locales) {
    const page = await readJson(path.join(root, 'src/data', locale, 'ai-kissing-video-generator.json'))
    const seo = await readJson(path.join(root, '_codex/seo-pipeline/tasks/2026-07-23-ai-kissing-video-generator/content', `${locale}.json`))
    for (const source of [page, seo]) {
      assert.equal(source.topTool?.sampleImages?.length, 1, `${locale} must expose one Demo video`)
      assert.equal(source.topTool.sampleImages[0].mediaType, 'video')
      assert.equal(source.topTool.sampleImages[0].width, 16)
      assert.equal(source.topTool.sampleImages[0].height, 9)
      assert.match(source.topTool.sampleImages[0].url, /\.png$/)
      assert.match(source.topTool.sampleImages[0].poster, /\.webp$/)
      const items = source.promptExamples?.items
      assert.equal(items?.length, 4, `${locale} must keep exactly four prompt examples`)
      for (const item of items) {
        assert.match(item.prompt, /9:16/)
        assert.match(item.video, new RegExp(`^${r2Base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
        assert.match(item.poster, new RegExp(`^${r2Base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*\\.webp$`))
        assert.equal(item.duration, 'PT5S')
        assert.match(item.uploadDate, /^2026-07-24T/)
      }
    }
  }
})

test('AI kissing page uses task-specific feature titles in page and SEO data', async () => {
  const expectedTitles = ['Kiss motion direction', 'Short kiss-video drafts']
  const genericTitles = ['Prompt-led video direction', 'Fast browser workflow']

  for (const sourcePath of [
    path.join(root, 'src/data/en/ai-kissing-video-generator.json'),
    path.join(root, '_codex/seo-pipeline/tasks/2026-07-23-ai-kissing-video-generator/content/en.json'),
  ]) {
    const source = await readJson(sourcePath)
    const titles = source.features?.items?.map((item) => item.title) || []

    for (const title of expectedTitles) assert.ok(titles.includes(title), `${sourcePath} must include ${title}`)
    for (const title of genericTitles) assert.ok(!titles.includes(title), `${sourcePath} must not retain ${title}`)
  }
})

test('AI kissing page localizes every visible copy block and mirrors it to Seo Factory content', async () => {
  const englishResidue = [
    'AI Kissing 16:9 demo video',
    'Sunset Couple Kiss',
    'Rainy Street Romance',
    'Wedding Moment',
    'Long-Distance Reunion',
    'Upload one or two photos',
    'Start with clear, well-lit photos',
    'Describe the romantic scene',
    'Generate and refine',
    'Couple story reels',
    'Wedding and proposal concepts',
    'Cinematic romance edits',
    'One or two photo upload',
    'Prompt-led video direction',
    'Romantic non-explicit scenes',
    'Fast browser workflow',
    'Couple-focused prompts',
    'Respect-first editing',
    'What is the AI Kissing Video Generator?',
    'Can I upload two separate photos?',
    'What prompts work best for AI kiss videos?',
    'Can I use this for wedding or anniversary videos?',
    'How do I get more natural results?',
    'Create short AI videos from text, images, video clips, or audio references.',
    'Upload one image and create short dance videos for choreography and social clips.',
    'Generate romantic couple portraits when you need still-image results.',
  ]

  for (const locale of localizedLocales) {
    const page = await readJson(path.join(root, 'src/data', locale, 'ai-kissing-video-generator.json'))
    const seo = await readJson(path.join(root, '_codex/seo-pipeline/tasks/2026-07-23-ai-kissing-video-generator/content', `${locale}.json`))

    assert.deepEqual(seo, page, `${locale} Seo Factory content must mirror page content`)
    const copy = JSON.stringify(page)

    for (const phrase of englishResidue) {
      assert.doesNotMatch(copy, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${locale} still contains ${phrase}`)
    }
  }
})

test('AI kissing page is registered in the L2 content loader for every locale', async () => {
  const loader = await readFile(path.join(root, 'src/lib/seo-loader.ts'), 'utf8')

  assert.match(
    loader,
    /tool === 'ai-kissing-video-generator'[\s\S]*?importL2FlatJson\('ai-kissing-video-generator', normalizedLocale\)/,
  )
})
