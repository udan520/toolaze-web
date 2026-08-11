import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync('src/components/blocks/ToolL2PageContent.tsx', 'utf8')
const ownershipMatch = source.match(
  /const toolHeroOwnsBreadcrumb = Boolean\(videoGeneratorDefaultModel\) \|\| \[([\s\S]*?)\]\.includes\(topComp\)/,
)
const allowedExplicitOwners = [
  'ai-baby-generator',
  'ai-couple-photo-maker',
  'gpt-image-2',
  'nano-banana-2',
  'nano-banana-pro',
  'photo-abstract-poster',
  'photo-restoration',
  'talking-avatar-creator',
  'watermark-remover',
]

test('Seedance 2.5 resolves through the shared video generator model configuration', () => {
  assert.match(
    source,
    /const VIDEO_GENERATOR_DEFAULT_MODELS:[\s\S]*?['"]seedance-2-5['"]:\s*['"]seedance-2-5['"]/,
    'Seedance 2.5 should resolve to its shared generator model without a breadcrumb ownership entry',
  )
  assert.match(
    source,
    /const videoGeneratorDefaultModel = getTopToolVideoModelId\(content\.topTool\?\.modelId\) \|\| VIDEO_GENERATOR_DEFAULT_MODELS\[topComp\]/,
    'video generator ownership should use the content modelId or configured top-component fallback',
  )
})

test('a resolved video generator model structurally gives its hero breadcrumb ownership', () => {
  assert.ok(ownershipMatch, 'resolved video generator models should suppress the outer breadcrumb')
})

test('the shared video generator hero receives the breadcrumb items it owns', () => {
  assert.match(
    source,
    /\) : videoGeneratorDefaultModel \? \([\s\S]*?<AiVideoGeneratorTool[\s\S]*?modelId=\{videoGeneratorDefaultModel\}[\s\S]*?heroBreadcrumbItems=\{breadcrumbItems\}/,
    'the videoGeneratorDefaultModel branch should render its breadcrumb inside AiVideoGeneratorTool',
  )
})

test('only approved non-video heroes use explicit breadcrumb ownership entries', () => {
  assert.ok(ownershipMatch, 'toolHeroOwnsBreadcrumb ownership expression should exist')

  const explicitOwners = [...ownershipMatch[1].matchAll(/['"]([^'"]+)['"]/g)]
    .map((match) => match[1])
    .sort()

  assert.deepEqual(explicitOwners, allowedExplicitOwners)
})
