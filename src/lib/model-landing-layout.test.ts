import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()

const independentModelLandingPages = [
  {
    name: 'GPT Image 2',
    file: 'src/components/GptImage2LandingPage.tsx',
  },
  {
    name: 'Wan 2.7 Image',
    file: 'src/components/Wan27ImageLandingPage.tsx',
  },
  {
    name: 'Seedream 4.5',
    file: 'src/components/Seedream45LandingPage.tsx',
  },
]

test('independent model landing pages render hero copy inside NanoBananaTool', () => {
  for (const page of independentModelLandingPages) {
    const source = readFileSync(join(projectRoot, page.file), 'utf8')

    assert.equal(
      source.includes('mx-auto mb-12 max-w-4xl pt-8 text-center'),
      false,
      `${page.name} should not render a centered hero block above the generator`,
    )
    assert.match(source, /heroBreadcrumbItems=\{\[/, `${page.name} should pass breadcrumbs into NanoBananaTool`)
    assert.match(source, /heroTitle=\{/, `${page.name} should pass the H1 into NanoBananaTool`)
    assert.match(source, /heroDescription=\{copy\.hero\.description\}/, `${page.name} should pass hero description into NanoBananaTool`)
  }
})
