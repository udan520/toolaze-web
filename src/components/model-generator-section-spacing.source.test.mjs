import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const landingPageFiles = [
  'GptImage2LandingPage.tsx',
  'Seedream45LandingPage.tsx',
  'Seedream50LiteLandingPage.tsx',
  'Seedream50ProLandingPage.tsx',
  'Wan27ImageLandingPage.tsx',
]

test('model generator wrapper does not add extra horizontal padding around the shared tool', () => {
  for (const file of landingPageFiles) {
    const source = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8')
    const generatorSection = source.match(/<section id="[^"]+-generator" className="([^"]*)">/)?.[1] || ''

    assert.notEqual(generatorSection, '', file)
    assert.match(generatorSection, /\bpx-0\b/, file)
    assert.doesNotMatch(generatorSection, /\bpr-2\b|\bmd:pr-4\b|\bxl:pr-6\b|\b2xl:pr-8\b/, file)
    assert.doesNotMatch(generatorSection, /\bpl-0\b|\bmd:pl-0\b|\bxl:pl-0\b|\b2xl:pl-0\b/, file)
  }
})
