import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { getPageDemoTargets } from './page-demo-targets'

const tempDirs: string[] = []

test.after(() => {
  for (const tempDir of tempDirs) {
    rmSync(tempDir, { recursive: true, force: true })
  }
})

test('discovers searchable page demo targets from public Toolaze pages', async () => {
  const targets = await getPageDemoTargets()
  const urls = new Set(targets.map((target) => target.url))

  assert.ok(urls.has('/image-to-video-generator'))
  assert.ok(urls.has('/ai-clothes-changer'))
  assert.ok(urls.has('/model/kling-3-motion-control'))
  assert.ok(urls.has('/font-generator/gothic'))
  assert.ok(!urls.has('/admin/media-library'))
  assert.ok(!urls.has('/prompts/models/kling'))
  assert.ok(!urls.has('/wan-2-6-ai-video-generator'))
  assert.ok(urls.has('/model/wan-2-6-ai-video-generator'))

  const clothesTarget = targets.find((target) => target.url === '/ai-clothes-changer')
  assert.equal(clothesTarget?.slug, 'ai-clothes-changer')
  assert.match(clothesTarget?.title || '', /Clothes/i)

  const motionTarget = targets.find((target) => target.url === '/model/kling-3-motion-control')
  assert.equal(motionTarget?.slug, 'model/kling-3-motion-control')
  assert.match(`${motionTarget?.title || ''} ${motionTarget?.keywords.join(' ') || ''}`, /motion/i)
})

test('sorts english landing page targets by newest publish date first', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-page-demo-targets-'))
  tempDirs.push(tempDir)
  const dataDir = join(tempDir, 'src', 'data', 'en')
  const appDir = join(tempDir, 'src', 'app')
  const tasksDir = join(tempDir, '_codex', 'seo-pipeline', 'tasks')
  mkdirSync(dataDir, { recursive: true })
  mkdirSync(appDir, { recursive: true })

  writeLandingPageJson(join(dataDir, 'alpha-old.json'), {
    seoFactoryTaskId: '2026-07-20-alpha-old',
    metadata: { title: 'Alpha Old Page' },
  })
  writeLandingPageJson(join(dataDir, 'zeta-new.json'), {
    metadata: { title: 'Zeta New Page' },
  })
  writeTaskJson(join(tasksDir, '2026-08-03-zeta-new', 'task.json'), {
    slug: 'zeta-new',
    createdAt: '2026-08-03T00:00:00.000Z',
  })
  writeLandingPageJson(join(dataDir, 'middle.json'), {
    metadata: {
      title: 'Middle Page',
      publishedAt: '2026-07-31T10:00:00.000Z',
    },
  })

  const targets = await getPageDemoTargets({
    appDir,
    dataDir,
    tasksDir,
    externalAppDirs: [],
    externalDataDirs: [],
    externalTasksDirs: [],
  })

  assert.deepEqual(targets.map((target) => target.url), [
    '/zeta-new',
    '/middle',
    '/alpha-old',
  ])
  assert.equal(targets[0].publishedAt, '2026-08-03T00:00:00.000Z')
})

test('discovers page demo targets from an external model-page worktree', async () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-page-demo-external-targets-'))
  tempDirs.push(tempDir)
  const appDir = join(tempDir, 'main', 'src', 'app')
  const dataDir = join(tempDir, 'main', 'src', 'data', 'en')
  const tasksDir = join(tempDir, 'main', '_codex', 'seo-pipeline', 'tasks')
  const externalAppDir = join(tempDir, 'worktree', 'src', 'app')
  const externalDataDir = join(tempDir, 'worktree', 'src', 'data', 'en')
  const externalTasksDir = join(tempDir, 'worktree', '_codex', 'seo-pipeline', 'tasks')

  mkdirSync(join(appDir, 'image-to-video-generator'), { recursive: true })
  writeFileSync(join(appDir, 'image-to-video-generator', 'page.tsx'), 'export default function Page() { return null }\n', 'utf8')
  mkdirSync(join(externalAppDir, 'model', 'veo-3-1-ai-video-generator'), { recursive: true })
  writeFileSync(join(externalAppDir, 'model', 'veo-3-1-ai-video-generator', 'page.tsx'), 'export default function Page() { return null }\n', 'utf8')
  writeLandingPageJson(join(externalDataDir, 'veo-3-1-ai-video-generator.json'), {
    pageGroup: 'model',
    topTool: { displayName: 'Veo 3.1' },
    metadata: { title: 'Veo 3.1 AI Video Generator | Toolaze' },
  })
  writeTaskJson(join(externalTasksDir, '2026-08-04-veo-3-1-ai-video-generator', 'task.json'), {
    slug: 'veo-3-1-ai-video-generator',
    canonicalPath: '/model/veo-3-1-ai-video-generator',
    sourceData: 'src/data/en/veo-3-1-ai-video-generator.json',
    createdAt: '2026-08-04T00:00:00.000Z',
  })

  const targets = await getPageDemoTargets({
    appDir,
    dataDir,
    tasksDir,
    externalAppDirs: [externalAppDir],
    externalDataDirs: [externalDataDir],
    externalTasksDirs: [externalTasksDir],
  })
  const target = targets.find((item) => item.url === '/model/veo-3-1-ai-video-generator')

  assert.equal(target?.slug, 'model/veo-3-1-ai-video-generator')
  assert.equal(target?.title, 'Veo 3.1')
  assert.equal(target?.publishedAt, '2026-08-04T00:00:00.000Z')
})

function writeLandingPageJson(filePath: string, data: Record<string, unknown>): void {
  mkdirSync(join(filePath, '..'), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function writeTaskJson(filePath: string, data: Record<string, unknown>): void {
  mkdirSync(join(filePath, '..'), { recursive: true })
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}
