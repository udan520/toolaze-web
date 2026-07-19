import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('./AiImageGenerationTool.tsx', import.meta.url), 'utf8')
const creditModalSource = source.slice(
  source.indexOf('{creditExhaustedModalOpen && ('),
  source.indexOf('{/* Toast Container */'),
)

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
  assert.ok(source.includes("trackToolazeEvent('image_generate_click'"))
  assert.ok(source.includes("trackToolazeEvent('credit_insufficient_modal_view'"))
  assert.ok(source.includes("trackToolazeEvent('credit_insufficient_buy_credits_button_click'"))
  assert.ok(source.includes("trackToolazeEvent('credit_insufficient_earn_free_credits_button_click'"))
  assert.ok(source.includes('handleCreditInsufficientBuyCreditsClick'))
  assert.ok(source.includes('handleCreditInsufficientEarnFreeCreditsClick'))
  assert.ok(!source.includes("trackToolazeEvent('credit_paywall_view'"))
  assert.ok(!source.includes("trackToolazeEvent('credit_paywall_cta_click'"))
})

test('analytics payload excludes sensitive prompt, image, user, and balance data', () => {
  const analyticsPayloadSource = source.slice(
    source.indexOf('const getGenerationAnalyticsPayload'),
    source.indexOf('const handleGenerate'),
  )

  assert.ok(analyticsPayloadSource.includes('model_id'))
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
