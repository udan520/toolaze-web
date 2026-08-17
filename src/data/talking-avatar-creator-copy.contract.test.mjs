import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const pagePath = join(root, 'src/data/en/talking-avatar-creator.json')
const factoryPath = join(root, '_codex/seo-pipeline/tasks/2026-07-31-talking-avatar-creator/content/en.json')
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'))

test('Talking Avatar English copy owns the portrait plus voice workflow', () => {
  const page = readJson(pagePath)

  assert.equal(page.metadata.title, 'AI Talking Avatar Creator From Photo & Audio | Toolaze')
  assert.equal(page.hero.h1, 'Create a Talking Avatar From a Photo and Voice')
  assert.equal(page.howToUse.title, 'How to Create a Talking Avatar Video')
  assert.equal(page.faq.length, 6)
  assert.deepEqual(
    page.faq.map((item) => item.q),
    [
      'What is an AI talking avatar creator?',
      'What photo works best?',
      'What audio works best?',
      'Can I use my own voice?',
      'Should I choose 480p or 720p?',
      'How is this different from image-to-video generation?',
    ],
  )
  assert.doesNotMatch(JSON.stringify(page), /History-ready results|Practical creator guidance|before you spend credits/)
})

test('Talking Avatar SEO Factory English content mirrors the published English page', () => {
  assert.deepEqual(readJson(factoryPath), readJson(pagePath))
})
