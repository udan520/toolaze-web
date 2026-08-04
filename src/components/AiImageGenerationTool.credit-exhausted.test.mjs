import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
const creditModalSource = source.slice(
  source.indexOf('{creditExhaustedModalOpen && ('),
  source.indexOf('{/* Toast Container */'),
)

function extractConstFunctionSource(name) {
  const start = source.indexOf(`const ${name} =`)
  assert.notEqual(start, -1, `${name} should exist`)

  const bodyStart = source.indexOf('{', start)
  assert.notEqual(bodyStart, -1, `${name} should have a function body`)

  let depth = 0
  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index]
    if (char === '{') depth += 1
    if (char === '}') depth -= 1
    if (depth === 0) return source.slice(start, index + 1)
  }

  assert.fail(`${name} should have a complete function body`)
}

test('credit exhausted modal relies on icon close instead of a text close action', () => {
  assert.ok(creditModalSource.includes('aria-label="Close credits dialog"'))
  assert.ok(!creditModalSource.includes('toolText.creditsUsedUpAction'))
})

test('credit exhausted modal only shows title description and CTAs', () => {
  assert.ok(!creditModalSource.includes('Credits balance'))
  assert.ok(!creditModalSource.includes('Fastest'))
  assert.ok(!creditModalSource.includes('Free option'))
  assert.ok(!creditModalSource.includes('One-time packs'))
  assert.ok(!creditModalSource.includes('Daily rewards'))
})

test('generation and credit paywall actions are tracked in GA4', () => {
  const oldImageCreditViewEvent = ['credit', 'low', 'modal', 'view'].join('_')
  const oldVideoCreditPrefix = ['video', 'credit'].join('_')

  assert.ok(source.includes("trackToolazeEvent('generate_click'"))
  assert.ok(source.includes("trackToolazeEvent('credit_low_view'"))
  assert.ok(source.includes("trackToolazeEvent('credit_low_buy_click'"))
  assert.ok(source.includes("trackToolazeEvent('credit_low_earn_click'"))
  assert.ok(!source.includes(`trackToolazeEvent('${oldImageCreditViewEvent}'`))
  assert.ok(!source.includes(`trackToolazeEvent('${oldVideoCreditPrefix}_low_view'`))
  assert.ok(!source.includes(`trackToolazeEvent('${oldVideoCreditPrefix}_buy_click'`))
  assert.ok(!source.includes(`trackToolazeEvent('${oldVideoCreditPrefix}_earn_click'`))
  assert.ok(!source.includes("trackToolazeEvent('credit_insufficient_buy_credits_button_click'"))
  assert.ok(!source.includes("trackToolazeEvent('credit_insufficient_earn_free_credits_button_click'"))
  assert.ok(source.includes('handleCreditInsufficientBuyCreditsClick'))
  assert.ok(source.includes('handleCreditInsufficientEarnFreeCreditsClick'))
  assert.ok(!source.includes("trackToolazeEvent('credit_paywall_view'"))
  assert.ok(!source.includes("trackToolazeEvent('credit_paywall_cta_click'"))
})


test('image generation funnel uses unified GA4 events', () => {
  const generateFlow = extractConstFunctionSource('handleGenerate')
  const oldImageGeneratePrefix = ['image', 'generate'].join('_')

  assert.ok(source.includes("trackToolazeEvent('generate_click'"))
  assert.ok(source.includes("trackToolazeEvent('generate_start'"))
  assert.ok(source.includes("trackToolazeEvent('generate_success'"))
  assert.ok(source.includes("trackToolazeEvent('generate_fail'"))
  assert.ok(!source.includes(`trackToolazeEvent('${oldImageGeneratePrefix}_click'`))
  assert.ok(!source.includes(`trackToolazeEvent('${oldImageGeneratePrefix}_success'`))
  assert.ok(!source.includes(`trackToolazeEvent('${oldImageGeneratePrefix}_fail'`))
  assert.match(source, /trackToolazeEvent\('generate_success', getGenerationAnalyticsPayload\(\{[\s\S]*result_delivery:[\s\S]*history_persisted:[\s\S]*\}\)\)/)
  assert.match(source, /trackToolazeEvent\('generate_fail', getGenerationAnalyticsPayload\(\{[\s\S]*failure_stage:[\s\S]*\}\)\)/)
  assert.ok(
    generateFlow.indexOf("trackToolazeEvent('generate_click'") <
      generateFlow.indexOf('await ensureSignedInForGeneration(requestCreditCost)'),
    'generate click should be tracked before auth and credits preflight',
  )
  assert.ok(
    generateFlow.indexOf("trackToolazeEvent('generate_start'") >
      generateFlow.indexOf('uploadRemoteReferenceUrlsForGeneration'),
    'generate start should be tracked after required reference uploads',
  )
  assert.ok(
    generateFlow.indexOf("trackToolazeEvent('generate_start'") <
      generateFlow.indexOf('requestImageGenerationTask(formData, toolText)'),
    'generate start should be tracked immediately before the generation API request',
  )

  const analyticsPayloadSource = source.slice(
    source.indexOf('const getGenerationAnalyticsPayload'),
    source.indexOf('useEffect(() => {\n    if (!creditExhaustedModalOpen)'),
  )
  assert.ok(!analyticsPayloadSource.includes('prompt'))
  assert.ok(!analyticsPayloadSource.includes('imageUrls'))
  assert.ok(!analyticsPayloadSource.includes('errorMessage'))
})

test('analytics payload excludes sensitive prompt, image, user, and balance data', () => {
  const analyticsPayloadSource = source.slice(
    source.indexOf('const getGenerationAnalyticsPayload'),
    source.indexOf('const handleGenerate'),
  )

  assert.ok(analyticsPayloadSource.includes('model_id'))
  assert.ok(analyticsPayloadSource.includes('media_type'))
  assert.ok(analyticsPayloadSource.includes('credit_cost'))
  assert.ok(!analyticsPayloadSource.includes('prompt'))
  assert.ok(!analyticsPayloadSource.includes('imageUrls'))
  assert.ok(!analyticsPayloadSource.includes('user'))
  assert.ok(!analyticsPayloadSource.includes('balance'))
})

test('default image tool button labels use Title Case', () => {
  assert.match(source, /sampleImage: 'Sample Image'/)
  assert.match(source, /copyPrompt: 'Copy Prompt'/)
  assert.match(source, /resultRetentionLogin: 'Log In'/)
  assert.match(source, /viewAll: 'View All'/)
  assert.match(source, /creditsUsedUpBuyAction: 'Buy Credits'/)
  assert.match(source, /creditsUsedUpEarnAction: 'Earn Free Credits'/)
})
