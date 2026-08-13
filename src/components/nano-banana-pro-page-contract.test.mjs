import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const slug = 'nano-banana-pro'
const taskId = '2026-08-13-nano-banana-pro-seo-rewrite'

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function collectVisibleStrings(value, path = []) {
  const ignoredKeys = new Set([
    'featuredColumn',
    'href',
    'icon',
    'iconType',
    'image',
    'layout',
    'modelId',
    'sectionsOrder',
    'seoFactoryTaskId',
    'src',
    'topComponent',
  ])
  const key = path[path.length - 1]
  if (ignoredKeys.has(key)) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap((item, index) => collectVisibleStrings(item, [...path, String(index)]))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([entryKey, entryValue]) => collectVisibleStrings(entryValue, [...path, entryKey]))
  }
  return []
}

test('Nano Banana Pro English copy is traceable to its SEO Factory task', () => {
  const queue = readJson(join(root, '_codex', 'seo-pipeline', 'queue', 'ready.json'))
  assert.ok(queue.tasks.some((task) => task.taskId === taskId && task.slug === slug && task.pageType === 'model' && task.status === 'ready_for_publish'))

  const taskPath = join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'task.json')
  const factoryContentPath = join(root, '_codex', 'seo-pipeline', 'tasks', taskId, 'content', 'en.json')
  assert.ok(existsSync(taskPath), 'Factory task should exist')
  assert.ok(existsSync(factoryContentPath), 'Factory English content should exist')

  const task = readJson(taskPath)
  const publicContent = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  assert.equal(task.slug, slug)
  assert.equal(task.pageType, 'model')
  assert.equal(task.status, 'ready_for_publish')
  assert.deepEqual(readJson(factoryContentPath), publicContent)
  assert.equal(publicContent.seoFactoryTaskId, taskId)
})

test('Nano Banana Pro English page states supported controls and a real Nano Banana 2 choice boundary', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const visibleCopy = collectVisibleStrings(content).join('\n')

  assert.match(content.metadata.title, /Nano Banana Pro AI Image Generator/i)
  assert.match(content.hero.h1, /Free/i)
  assert.match(content.hero.h1, /No Sign Up/i)
  assert.match(content.hero.desc, /8 reference images/i)
  assert.equal(content.modelIntro.description.length, 2, 'What Is should be a concise two-paragraph model-positioning section')
  assert.match(content.modelIntro.description[0], /Gemini 3 Pro Image/i)
  assert.match(content.modelIntro.description[0], /accurate in-image text/i)
  assert.match(content.modelIntro.description[0], /multilingual creative/i)
  assert.match(content.modelIntro.description[1], /posters, product concepts, infographics/i)
  assert.match(content.modelIntro.description[1], /start from a prompt or add reference images/i)
  assert.doesNotMatch(content.modelIntro.description.join('\n'), /up to eight|JPG|PNG|WebP|output ratio|export format/i)
  assert.match(visibleCopy, /1K, 2K, or 4K/i)
  assert.match(visibleCopy, /JPG, PNG, and WebP/i)
  assert.equal('features' in content, false, 'template feature cards should be replaced with evidence-led feature stories')
  assert.equal(content.featureStories.items.length, 4)
  assert.deepEqual(
    content.featureStories.items.map((item) => item.title),
    [
      'Multilingual In-Image Text',
      'Reference Consistency',
      'Visual Reasoning',
      'Up to 4K Output',
    ],
  )
  for (const genericTitle of ['Turn Several Visual Cues Into One Product Direction', 'Create Text-Led Poster Concepts From a Clear Brief', 'Guide a New Scene With Character, Wardrobe, and Mood References']) {
    assert.doesNotMatch(visibleCopy, new RegExp(genericTitle, 'i'), `generic task title should be removed: ${genericTitle}`)
  }
  assert.match(visibleCopy, /legible text directly in the image/i)
  assert.match(visibleCopy, /multiple languages/i)
  assert.match(visibleCopy, /Reference Consistency/i)
  assert.match(visibleCopy, /1K, 2K, or 4K/i)
  assert.doesNotMatch(visibleCopy, /pixel-perfect identity matching|review the result before using it/i)
  for (const item of content.featureStories.items) {
    assert.equal(item.media.type, 'image')
    assert.match(item.media.src, /^https:\/\/assets\.toolaze\.com\//, 'feature proof should use a public R2 image')
  }
  assert.equal(content.featureStories.items[3].media.src, 'https://assets.toolaze.com/uploads/53dc44735bb14fdf94e14e39d2012731.jpg')
  assert.equal(content.promptExamples.items.length, 4)
  assert.ok(content.faq.length <= 6)
  assert.equal('rating' in content, false)
  assert.ok(content.modelComparison.rows.some((row) => row.label === 'Maximum reference images' && /8/.test(row.baseline) && /14/.test(row.target)))
  assert.ok(content.modelComparison.rows.some((row) => row.label === 'When to choose it' && /reference-heavy/i.test(row.target)))
  assert.match(content.modelComparison.subtitle, /Choose Nano Banana Pro when/i)
  assert.deepEqual(
    content.scenes.map((scene) => scene.title),
    ['Product Launch Creative Direction', 'Text-Led Poster Concepts', 'Reference-Guided Character Frames'],
  )
  assert.match(visibleCopy, /upload a product shot, palette, and styling references/i)
  assert.match(visibleCopy, /use one reference for the character and others for wardrobe, setting, and mood/i)
})

test('Nano Banana Pro English copy excludes unsupported template promises and editorial wording', () => {
  const content = readJson(join(root, 'src', 'data', 'en', `${slug}.json`))
  const visibleCopy = collectVisibleStrings(content).join('\n')

  for (const phrase of ['4.9/5', '10K+ creators', 'hidden fees', 'commercial purposes', 'lightning-fast', 'in seconds', 'this page', 'search intent', 'ranking', 'provider route']) {
    assert.doesNotMatch(visibleCopy, new RegExp(phrase, 'i'), `visible copy should not include ${phrase}`)
  }
})
