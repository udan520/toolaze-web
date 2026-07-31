import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const slug = 'unrestricted-ai-image-generator'
const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const poolsideDemoUrl = 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/unrestricted-ai-image-generator/pool-bikini-demo.webp'

test('unrestricted AI image generator publishes localized L2 content', () => {
  for (const locale of locales) {
    const dataPath = `src/data/${locale}/${slug}.json`
    assert.equal(existsSync(dataPath), true, `${locale} content file should exist`)

    const data = JSON.parse(readFileSync(dataPath, 'utf8'))
    assert.equal(data.pageGroup, 'ai-tools')
    assert.equal(data.visiblePageType, 'scene')
    assert.equal(data.topComponent, 'gpt-image-2')
    assert.equal(data.topTool.mode, 'text-to-image')
    assert.equal(data.topTool.modelId, 'wan-2-7-image')
    assert.notEqual(data.topTool.hideModelBranding, true)
    assert.equal(data.topTool.sampleImages[0].url, poolsideDemoUrl)
    assert.equal(data.topTool.sampleImages[0].width, 880)
    assert.equal(data.topTool.sampleImages[0].height, 495)
    assert.equal(data.promptExamples.items.length, 4)
    assert.equal(data.features.items.length, 6)
    assert.equal(data.faq.length, 6)
    const normalizedFaqQuestions = data.faq.map((item) => item.q.trim().toLowerCase())
    assert.equal(new Set(normalizedFaqQuestions).size, normalizedFaqQuestions.length, `${locale} FAQ questions should be unique`)
    assert.match(data.metadata.title, /Unrestricted|Unbeschr|無制限|sin restricciones|sem restrições|sans restrictions|제한 적은|senza restrizioni|不受限制/i)
  }
})

test('unrestricted AI image generator uses the poolside demo asset in entry cards', () => {
  const homeAdvancedAiCards = readFileSync('src/lib/home-advanced-ai-card-images.ts', 'utf8')
  const adminSeoServer = readFileSync('scripts/admin-seo-server.js', 'utf8')
  const navigationSource = readFileSync('src/components/Navigation.tsx', 'utf8')
  const aiToolsHubSource = readFileSync('src/app/ai-tools/copy.ts', 'utf8')

  assert.ok(homeAdvancedAiCards.includes(poolsideDemoUrl))
  assert.ok(adminSeoServer.includes(poolsideDemoUrl))
  assert.ok(navigationSource.includes(poolsideDemoUrl))
  assert.ok(aiToolsHubSource.includes(poolsideDemoUrl))
})

test('unrestricted AI image generator is registered in SEO Factory queue', () => {
  const queue = JSON.parse(readFileSync('_codex/seo-pipeline/queue/ready.json', 'utf8'))
  assert.ok(queue.tasks.some((task) => (
    task.taskId === '2026-07-31-unrestricted-ai-image-generator' &&
    task.slug === slug &&
    task.pageType === 'l2' &&
    task.status === 'ready_for_publish'
  )))

  assert.equal(existsSync(`_codex/seo-pipeline/tasks/2026-07-31-${slug}/task.json`), true)
  for (const locale of locales) {
    assert.equal(existsSync(`_codex/seo-pipeline/tasks/2026-07-31-${slug}/content/${locale}.json`), true)
  }
})

test('unrestricted AI image generator avoids unsafe absolute promises', () => {
  const data = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
  const visibleCopy = JSON.stringify(data)

  for (const unsafePhrase of [
    'zero filters',
    'anything you want',
    'no limits',
    'bypass',
    'uncensored',
  ]) {
    assert.equal(visibleCopy.toLowerCase().includes(unsafePhrase), false, `copy should not contain "${unsafePhrase}"`)
  }

  assert.match(visibleCopy, /creative boundaries/i)
  assert.match(visibleCopy, /permission/i)
})

test('unrestricted AI image generator covers unlimited keyword variants safely', () => {
  const data = JSON.parse(readFileSync(`src/data/en/${slug}.json`, 'utf8'))
  const visibleCopy = JSON.stringify(data)

  assert.match(visibleCopy, /unlimited ai image generator/i)
  assert.match(visibleCopy, /unlimited-style/i)
  assert.match(visibleCopy, /no-restriction ai image generator/i)
  assert.match(visibleCopy, /without rigid restrictions/i)
  assert.match(visibleCopy, /not literally unlimited/i)
})
