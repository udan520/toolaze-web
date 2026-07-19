import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const checkedFiles = [
  'src/app/ai-image-generator/copy.ts',
  'src/app/ai-image-to-image-generator/copy.ts',
  'src/app/image-compressor/page.tsx',
  'src/app/image-converter/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/pricing/PricingCheckoutButton.tsx',
  'src/app/world-cup-ai-image-generator/copy.ts',
  'src/components/AiImageGenerationTool.tsx',
  'src/components/CreditsPageClient.tsx',
  'src/components/EarnCreditsPageClient.tsx',
  'src/components/FontGenerator.tsx',
  'src/components/HistoryPageClient.tsx',
  'src/components/ImageCompressor.tsx',
  'src/components/ImageConverter.tsx',
  'src/components/Navigation.tsx',
  'src/components/blocks/PerformanceMetrics.tsx',
  'src/components/blocks/PromptExamples.tsx',
  'src/components/blocks/Specs.tsx',
  'src/components/blocks/TrustBar.tsx',
  'src/components/blocks/WhyToolaze.tsx',
  'src/lib/seedream-5-0-lite-landing-copy.ts',
  'src/lib/seedream-5-0-pro-landing-copy.ts',
]

const forbiddenButtonCopy = [
  'Buy credits',
  'Checkout coming soon',
  'Copy prompt',
  'Copied prompt',
  'Earn free credits',
  'Opening checkout',
  'Start generating',
  'Use prompt',
]

test('visible English button and short title copy avoids known sentence-case variants', () => {
  for (const file of checkedFiles) {
    const source = readFileSync(file, 'utf8')
    for (const text of forbiddenButtonCopy) {
      assert.equal(
        source.includes(text),
        false,
        `${file} still contains "${text}"`,
      )
    }
  }
})

test('public UI files do not force ordinary copy to uppercase', () => {
  for (const file of checkedFiles) {
    const source = readFileSync(file, 'utf8')
    assert.equal(
      source.includes('uppercase'),
      false,
      `${file} still forces visible UI copy to uppercase`,
    )
  }
})
