#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = join(currentDir, '..')
const pageDataPath = join(root, 'src/data/en/ai-hairstyle-changer.json')
const assetsRoot = join(root, '_codex/ai-hairstyle-changer-assets')
const sourceDir = join(assetsRoot, 'source')
const publicAssetDir = join(root, 'public/ai-hairstyle-changer')
const processorPath = join(currentDir, 'process-ai-hairstyle-assets.py')
const apiBase = 'https://api.kie.ai/api/v1/jobs'
const defaultModel = 'gpt-image-2-text-to-image'
const defaultAspectRatio = '1:1'
const pageData = JSON.parse(readFileSync(pageDataPath, 'utf8'))

const sharedIdentityConstraints = [
  'Use the supplied portrait as the only identity and composition reference.',
  'Change only the hairstyle.',
  'Do not beautify or redraw the face.',
  'No accessories, text, labels, watermark, extra people, or background changes.',
  'Keep the full top of the hairstyle and the visible shoulder line inside frame.',
]

const groupIdentityConstraints = {
  women: [
    ...sharedIdentityConstraints,
    'Keep the exact same face, facial features, skin tone, age, natural smile, gaze, head angle, shoulders, black tank top, white studio background, camera position, lighting, color balance, and framing.',
  ].join(' '),
  men: [
    ...sharedIdentityConstraints,
    'Keep the exact same face, facial features, skin tone, age, broad natural smile, teeth, gaze, head angle, shoulders, black T-shirt, white studio background, camera position, lighting, color balance, and framing.',
  ].join(' '),
}

function createStyleList(group) {
  return pageData.topTool.functionalAcceptance.presets
    .filter((preset) => preset.group === group)
  .map((preset) => ({
    id: preset.image.split('/').at(-1).replace(/\.webp$/i, ''),
    label: preset.label,
    prompt: preset.prompt,
    publicPath: preset.image,
    group,
  }))
}

export const WOMEN_STYLES = createStyleList('women')
export const MEN_STYLES = createStyleList('men')

export function getStylesForGroup(group) {
  if (group === 'women') return WOMEN_STYLES
  if (group === 'men') return MEN_STYLES
  throw new Error(`Unsupported hairstyle group: ${group}`)
}

export function buildGenerationPrompt(style) {
  const constraints = groupIdentityConstraints[style.group]
  if (!constraints) throw new Error(`Unsupported hairstyle group: ${style.group}`)
  return `Target hairstyle: ${style.label}. ${style.prompt} ${constraints}`
}

export function buildTaskPayload(style, referenceUrl, model = defaultModel, aspectRatio = defaultAspectRatio) {
  return {
    model,
    input: {
      prompt: buildGenerationPrompt(style),
      input_urls: [referenceUrl],
      aspect_ratio: aspectRatio,
      resolution: '1K',
      output_format: 'png',
    },
  }
}

export function resolvePublicAssetPath(publicPath) {
  return join(root, 'public', publicPath.replace(/^\//, ''))
}

function getGeneratedDir(group) {
  return join(assetsRoot, 'generated', group)
}

function getManifestPath(group) {
  return group === 'women'
    ? join(assetsRoot, 'manifest.json')
    : join(assetsRoot, `${group}-manifest.json`)
}

export function extractImageUrl(result) {
  const data = result?.data || result
  if (!data) return undefined

  if (data.resultJson) {
    const parsed = typeof data.resultJson === 'string'
      ? JSON.parse(data.resultJson)
      : data.resultJson
    if (Array.isArray(parsed?.resultUrls) && parsed.resultUrls[0]) {
      return parsed.resultUrls[0]
    }
    if (Array.isArray(parsed?.urls) && parsed.urls[0]) {
      return parsed.urls[0]
    }
    if (parsed?.url) return parsed.url
  }

  if (Array.isArray(data.resultUrls) && data.resultUrls[0]) {
    return data.resultUrls[0]
  }
  if (data.imageUrl) return data.imageUrl
  return undefined
}

function loadEnvFile(file) {
  if (!existsSync(file)) return
  for (const rawLine of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line
    const equalsIndex = normalized.indexOf('=')
    if (equalsIndex === -1) continue
    const key = normalized.slice(0, equalsIndex).trim()
    let value = normalized.slice(equalsIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

function getArgument(name) {
  const prefix = `${name}=`
  const match = process.argv.find((argument) => argument.startsWith(prefix))
  return match ? match.slice(prefix.length).trim() : ''
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms))
}

async function fetchWithRetry(url, options, label, attempts = 4) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`${label} returned HTTP ${response.status}`)
        await sleep(2500 * attempt)
        continue
      }
      return response
    } catch (error) {
      lastError = error
      await sleep(2500 * attempt)
    }
  }
  throw lastError
}

function loadManifest(manifestPath) {
  if (!existsSync(manifestPath)) {
    return {
      sourceUrl: '',
      model: '',
      heroStyle: '',
      generatedAt: '',
      styles: {},
    }
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'))
}

function saveManifest(manifest, manifestPath) {
  mkdirSync(dirname(manifestPath), { recursive: true })
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

async function createTask(style, referenceUrl, apiKey, model, aspectRatio = defaultAspectRatio) {
  const response = await fetchWithRetry(
    `${apiBase}/createTask`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildTaskPayload(style, referenceUrl, model, aspectRatio)),
    },
    `createTask ${style.id}`,
  )
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result?.code !== 200 || !result?.data?.taskId) {
    throw new Error(
      result?.message
      || result?.msg
      || `createTask ${style.id} failed with HTTP ${response.status}`,
    )
  }
  return result.data.taskId
}

async function pollTask(taskId, styleId, apiKey) {
  for (let attempt = 1; attempt <= 90; attempt += 1) {
    await sleep(attempt <= 3 ? 4000 : 7000)
    const response = await fetchWithRetry(
      `${apiBase}/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
      `recordInfo ${styleId}`,
    )
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(
        result?.message
        || result?.msg
        || `recordInfo ${styleId} failed with HTTP ${response.status}`,
      )
    }
    const data = result?.data || result
    const state = data?.state || data?.status
    if (state === 'success' || state === 'SUCCEEDED') {
      const imageUrl = extractImageUrl(result)
      if (!imageUrl) {
        throw new Error(`Task ${taskId} for ${styleId} succeeded without an image URL`)
      }
      return imageUrl
    }
    if (state === 'fail' || state === 'FAILED') {
      throw new Error(
        data?.failMsg
        || data?.message
        || `Task ${taskId} failed for ${styleId}`,
      )
    }
    if (attempt % 5 === 0) {
      console.log(`[poll] ${styleId}: pending after ${attempt} checks`)
    }
  }
  throw new Error(`Timed out waiting for ${styleId}`)
}

async function downloadImage(url, file) {
  const response = await fetchWithRetry(url, undefined, `download ${file}`)
  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}`)
  }
  writeFileSync(file, Buffer.from(await response.arrayBuffer()))
}

function runProcessor(args) {
  const result = spawnSync('python3', [processorPath, ...args], {
    cwd: root,
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || 'Image processor failed')
  }
}

function prepareReferenceAssets(inputFile, group) {
  const archivedSource = join(sourceDir, `${group}-reference.png`)
  const publicReference = join(publicAssetDir, 'default-reference.png')
  const publicPreview = join(publicAssetDir, 'default-reference-preview.webp')

  mkdirSync(sourceDir, { recursive: true })
  mkdirSync(publicAssetDir, { recursive: true })
  if (resolve(inputFile) !== resolve(archivedSource)) {
    copyFileSync(inputFile, archivedSource)
  }
  if (group === 'women') {
    copyFileSync(archivedSource, publicReference)
    runProcessor(['preview', archivedSource, publicPreview])
  }
  return archivedSource
}

function processTemplate(highResolutionFile, publicFile) {
  mkdirSync(dirname(publicFile), { recursive: true })
  runProcessor(['template', highResolutionFile, publicFile])
}

function buildHero(referenceFile, resultFile, heroStyle) {
  const archivedHero = join(root, '_codex/ai-hairstyle-changer-assets/hero-before-after.png')
  const publicHero = join(publicAssetDir, 'hero-before-after.webp')
  runProcessor(['hero', referenceFile, resultFile, archivedHero, publicHero])
  return {
    archivedHero,
    publicHero,
    heroStyle,
  }
}

async function runWithConcurrency(items, concurrency, worker) {
  let nextIndex = 0
  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const item = items[nextIndex]
        nextIndex += 1
        await worker(item)
      }
    },
  )
  await Promise.all(runners)
}

async function generateStyle({
  style,
  referenceUrl,
  apiKey,
  model,
  aspectRatio,
  force,
  manifest,
  generatedDir,
  manifestPath,
}) {
  const highResolutionFile = join(generatedDir, `${style.id}.png`)
  const publicFile = resolvePublicAssetPath(style.publicPath)

  if (!force && existsSync(highResolutionFile) && existsSync(publicFile)) {
    console.log(`[skip] ${style.id}: generated files already exist`)
    return
  }

  console.log(`[create] ${style.id}: ${style.label}`)
  const taskId = await createTask(style, referenceUrl, apiKey, model, aspectRatio)
  manifest.styles[style.id] = {
    label: style.label,
    taskId,
    prompt: buildGenerationPrompt(style),
    status: 'pending',
  }
  saveManifest(manifest, manifestPath)

  const resultUrl = await pollTask(taskId, style.id, apiKey)
  await downloadImage(resultUrl, highResolutionFile)
  processTemplate(highResolutionFile, publicFile)

  manifest.styles[style.id] = {
    ...manifest.styles[style.id],
    status: 'success',
    resultUrl,
    highResolutionFile: highResolutionFile.replace(`${root}/`, ''),
    publicFile: publicFile.replace(`${root}/`, ''),
    generatedAt: new Date().toISOString(),
  }
  saveManifest(manifest, manifestPath)
  console.log(
    `[done] ${style.id}: ${Math.round(statSync(highResolutionFile).size / 1024)} KB source`,
  )
}

async function main() {
  loadEnvFile(join(root, '.env.local'))
  loadEnvFile(join(root, '.dev.vars'))

  const apiKey = (
    process.env.KIE_AI_API_KEY
    || process.env.ZHEN_AI_API_KEY
    || ''
  ).trim()
  const model = (process.env.KIE_GPT_IMAGE_2_MODEL || defaultModel).trim()
  const aspectRatio = (getArgument('--aspect-ratio') || defaultAspectRatio).trim()
  const group = getArgument('--group') || 'women'
  const styles = getStylesForGroup(group)
  const generatedDir = getGeneratedDir(group)
  const manifestPath = getManifestPath(group)
  const inputFile = getArgument('--input-file')
    || join(sourceDir, `${group}-reference.png`)
  const referenceUrl = getArgument('--input-url')
    || (
      existsSync(join(sourceDir, `${group}-reference-url.txt`))
        ? readFileSync(join(sourceDir, `${group}-reference-url.txt`), 'utf8').trim()
        : group === 'women' && existsSync(join(sourceDir, 'reference-url.txt'))
          ? readFileSync(join(sourceDir, 'reference-url.txt'), 'utf8').trim()
        : ''
    )
  const only = new Set(
    getArgument('--only')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  )
  const force = process.argv.includes('--force')
  const heroStyleArgument = getArgument('--hero-style')

  if (!apiKey) throw new Error('KIE image generation API key is not configured')
  if (!referenceUrl) throw new Error('Pass --input-url or create source/reference-url.txt')
  if (!existsSync(inputFile)) throw new Error(`Reference image does not exist: ${inputFile}`)

  const referenceFile = prepareReferenceAssets(inputFile, group)
  mkdirSync(generatedDir, { recursive: true })

  const selectedStyles = only.size
    ? styles.filter((style) => only.has(style.id))
    : styles
  if (selectedStyles.length === 0) {
    throw new Error('No matching women hairstyle presets selected')
  }

  const manifest = loadManifest(manifestPath)
  manifest.group = group
  manifest.sourceUrl = referenceUrl
  manifest.model = model
  manifest.aspectRatio = aspectRatio
  manifest.generatedAt = new Date().toISOString()
  manifest.styles ||= {}
  saveManifest(manifest, manifestPath)

  const failed = []
  await runWithConcurrency(selectedStyles, 2, async (style) => {
    try {
      await generateStyle({
        style,
        referenceUrl,
        apiKey,
        model,
        aspectRatio,
        force,
        manifest,
        generatedDir,
        manifestPath,
      })
    } catch (error) {
      failed.push(style.id)
      manifest.styles[style.id] = {
        ...(manifest.styles[style.id] || {}),
        label: style.label,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        failedAt: new Date().toISOString(),
      }
      saveManifest(manifest, manifestPath)
      console.error(`[fail] ${style.id}: ${error instanceof Error ? error.message : error}`)
    }
  })

  if (failed.length > 0) {
    throw new Error(`Failed hairstyles: ${failed.join(', ')}`)
  }

  if (group === 'women' && !only.size) {
    const heroCandidates = [
      heroStyleArgument,
      'big-waves',
      'pixie-cut',
      'top-bun',
      'two-braids',
    ].filter(Boolean)
    const heroStyle = heroCandidates.find((styleId) =>
      existsSync(join(generatedDir, `${styleId}.png`)),
    )
    if (!heroStyle) throw new Error('No generated hairstyle is available for the hero demo')
    buildHero(
      referenceFile,
      join(generatedDir, `${heroStyle}.png`),
      heroStyle,
    )
    manifest.heroStyle = heroStyle
    saveManifest(manifest, manifestPath)
  }

  console.log(`Generated ${selectedStyles.length} ${group} hairstyle assets with ${model}`)
}

const isDirectExecution = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
