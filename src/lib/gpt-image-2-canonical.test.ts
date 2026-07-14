import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const projectRoot = process.cwd()

function readProjectFile(path: string) {
  return readFileSync(join(projectRoot, path), 'utf8')
}

function collectSourceFiles(dir: string): string[] {
  const absoluteDir = join(projectRoot, dir)
  const files: string[] = []

  for (const entry of readdirSync(absoluteDir)) {
    const absolutePath = join(absoluteDir, entry)
    const relativePath = absolutePath.slice(projectRoot.length + 1)

    if (entry === 'node_modules' || entry === '.next') continue

    if (statSync(absolutePath).isDirectory()) {
      files.push(...collectSourceFiles(relativePath))
      continue
    }

    if (/\.(tsx?|jsx?|json)$/.test(entry)) {
      files.push(relativePath)
    }
  }

  return files
}

test('GPT Image 2.0 route redirects permanently to the canonical GPT Image 2 page', () => {
  const aliasPage = readProjectFile('src/app/model/gpt-image-2-0/page.tsx')
  const localizedModelPage = readProjectFile('src/app/[locale]/model/[model]/page.tsx')

  assert.match(aliasPage, /permanentRedirect\(['"]\/model\/gpt-image-2['"]\)/)
  assert.doesNotMatch(aliasPage, /export\s+\{[^}]*\}\s+from\s+['"]\.\.\/gpt-image-2\/page['"]/)
  assert.match(localizedModelPage, /model\s*===\s*['"]gpt-image-2-0['"]/)
  assert.match(localizedModelPage, /permanentRedirect\(locale === ['"]en['"] \? ['"]\/model\/gpt-image-2['"] : `\/\$\{locale\}\/model\/gpt-image-2`\)/)
})

test('GPT Image 2.0 alias is not advertised as a canonical or internal link', () => {
  const sitemapSource = readProjectFile('src/app/sitemap.ts')
  const languageSwitchSource = readProjectFile('src/lib/site-language-switch.ts')

  assert.doesNotMatch(sitemapSource, /gpt-image-2-0/, 'sitemap should only include /model/gpt-image-2')
  assert.doesNotMatch(languageSwitchSource, /gpt-image-2-0/, 'language switch should not advertise the alias')

  for (const file of collectSourceFiles('src')) {
    if (file === 'src/lib/gpt-image-2-canonical.test.ts') continue

    const source = readProjectFile(file)
    assert.doesNotMatch(
      source,
      /href["']?\s*[:=]\s*(?:\{)?["'`][^"'`]*\/model\/gpt-image-2-0/,
      `${file} should not link to /model/gpt-image-2`,
    )
  }
})

test('related content does not present GPT Image 2.0 as a second landing page', () => {
  const files = [
    'src/components/GptImage2LandingPage.tsx',
    'src/components/Seedream45LandingPage.tsx',
    'src/lib/gpt-image-2-landing-copy.ts',
    ...collectSourceFiles('src/data/seedream-4-5-landing-copy'),
  ]

  for (const file of files) {
    const source = readProjectFile(file)
    assert.doesNotMatch(source, /GPT Image 2\.0/, `${file} should not advertise GPT Image 2.0 as a separate page`)
  }
})
