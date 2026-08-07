import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')
const breadcrumbSource = readFileSync('src/components/Breadcrumb.tsx', 'utf8')
const seoLoaderSource = readFileSync('src/lib/seo-loader.ts', 'utf8')

test('shared model registries drive the Model breadcrumb parent', () => {
  assert.match(
    source,
    /const isModelL2Page = \(VIDEO_MODEL_L2S\.includes\(tool\) \|\| IMAGE_MODEL_L2S\.includes\(tool\)\) && !isAiImageToolPage/,
  )
  assert.match(
    source,
    /isModelL2Page[\s\S]*?breadcrumbT\.model \|\| 'Model'[\s\S]*?href: '\/model'[\s\S]*?label: pageTitle/,
  )
})

test('model breadcrumbs are not maintained as a per-model allowlist', () => {
  const breadcrumbBlock = source.slice(
    source.indexOf('// 构建面包屑导航'),
    source.indexOf('const toolHeroOwnsBreadcrumb'),
  )

  for (const slug of [
    'happyhorse-ai-video-generator',
    'pixverse-v6-ai-video-generator',
    'wan-2-7-ai-video-generator',
    'veo-3-1-ai-video-generator',
    'seedance-2',
    'kling-3',
  ]) {
    assert.doesNotMatch(breadcrumbBlock, new RegExp(`tool === ['"]${slug}['"]`))
  }

  assert.match(breadcrumbBlock, /isAiImageToolPage[\s\S]*?breadcrumbT\.aiTools/)
})

test('the shared video model registry covers every ToolL2 model family', () => {
  const registry = seoLoaderSource.match(/export const VIDEO_MODEL_L2S = \[([^\]]*)\]/)

  assert.ok(registry)
  for (const slug of [
    'happyhorse-ai-video-generator',
    'pixverse-v6-ai-video-generator',
    'wan-2-7-ai-video-generator',
    'veo-3-1-ai-video-generator',
    'seedance-2',
    'kling-3',
  ]) {
    assert.match(registry[1], new RegExp(`['"]${slug}['"]`))
  }
})

test('the Model hub parent remains locale-aware', () => {
  const localeLessPaths = breadcrumbSource.match(/const LOCALE_LESS_PATHS = \[([^\]]*)\]/)

  assert.ok(localeLessPaths)
  assert.doesNotMatch(localeLessPaths[1], /['"]\/model['"]\s*,?/)
  assert.match(breadcrumbSource, /return `\/\$\{currentLocale\}\$\{href\}`/)
})
