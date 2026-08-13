#!/usr/bin/env node

const { createHash, createHmac } = require('node:crypto')
const { mkdir, readFile, stat, writeFile } = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

const root = path.resolve(__dirname, '..')
const outputDir = path.join('/tmp', 'ai-clothes-changer-mens-and-demo')
const apiBase = (process.env.KIE_API_BASE_URL || 'https://api.kie.ai').replace(/\/$/, '')
const publicBaseUrl = (process.env.R2_PUBLIC_BASE_URL || 'https://assets.toolaze.com').replace(/\/$/, '')
const model = 'gpt-image-2-text-to-image'
const verifyOnly = process.argv.includes('--verify-only')
const publishExisting = process.argv.includes('--publish-existing')

const mensReferencePrompt = [
  'Create a photorealistic premium fashion reference image for an AI clothes changer.',
  'Show exactly one adult man standing naturally, fully visible from head to toe with shoes visible.',
  'Use a simple neutral studio backdrop and soft editorial lighting.',
  'Make the complete outfit easy to read: garment layers, silhouette, hem, fabric, shoes, and accessories.',
  'No text, watermark, brand logo, other people, cropped body, isolated garment, sexualized pose, nudity, or transparent clothing.',
].join(' ')

const assets = [
  ['midnight-tuxedo', 'Midnight Tuxedo', 'A midnight navy black-tie tuxedo with satin peak lapels, a crisp white dress shirt, black bow tie, tailored black trousers, and polished black oxford shoes.'],
  ['sage-double-breasted-suit', 'Sage Suit', 'A sage green double-breasted Italian suit with a cream knit polo, tailored trousers, and brown leather loafers.'],
  ['camel-overcoat', 'Camel Coat', 'A camel cashmere overcoat over a black turtleneck, tailored charcoal trousers, and dark brown Chelsea boots.'],
  ['velvet-dinner-jacket', 'Velvet Dinner', 'A deep burgundy velvet dinner jacket with black trousers, a black silk shirt, and polished loafers.'],
  ['white-resort-linen', 'White Resort', 'An ivory resort linen shirt and matching relaxed trousers with tan suede loafers, elegant coastal styling.'],
  ['leather-aviator', 'Leather Aviator', 'A rich brown leather aviator jacket with a cream knit sweater, dark tailored denim, and brown leather boots.'],
  ['monochrome-techwear', 'Monochrome Tech', 'A premium monochrome black technical jacket with layered black trousers, refined utility details, and sculptural black sneakers.'],
  ['indigo-tailoring', 'Indigo Tailoring', 'An indigo blue tailored suit with an open-collar white shirt, patterned silk pocket square, and brown monk-strap shoes.'],
].map(([slug, label, outfit]) => ({ slug, label, group: 'men', aspectRatio: '9:16', prompt: `${mensReferencePrompt} ${outfit}` }))

assets.push({
  slug: 'ivory-couture-before-after',
  group: 'demo',
  aspectRatio: '16:9',
  prompt: [
    'Create a photorealistic horizontal before-and-after fashion transformation image for an AI clothes changer landing page.',
    'Split the composition into two equal vertical panels with a subtle center divider.',
    'Show the same adult female fashion model, full body and front-facing, standing in the same neutral studio with identical soft lighting, pose, expression, camera angle, and proportions in both panels.',
    'Left panel: a simple elegant charcoal sleeveless top and straight black trousers with understated black heels.',
    'Right panel: transform the same model into an ivory architectural couture gown with structured pleats, sculptural cape-like shoulders, a full-length skirt, and understated heels.',
    'The right panel must clearly look like the same person after the outfit change. No text, labels, logos, watermark, collage borders, cropped body, extra people, nudity, or sexualized styling.',
  ].join(' '),
})

function loadEnvFile(file) {
  try {
    const content = require('node:fs').readFileSync(file, 'utf8')
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const normalized = line.startsWith('export ') ? line.slice(7).trim() : line
      const separator = normalized.indexOf('=')
      if (separator === -1) continue
      const key = normalized.slice(0, separator).trim()
      let value = normalized.slice(separator + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (key && process.env[key] === undefined) process.env[key] = value
    }
  } catch {}
}

function getRequiredEnv(key) {
  const value = String(process.env[key] || '').trim()
  if (!value) throw new Error(`${key} is not configured`)
  return value
}

function getApiKey() {
  return String(process.env.KIE_AI_API_KEY || process.env.ZHEN_AI_API_KEY || '').trim()
}

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex')
}

function hmac(key, value, encoding) {
  return createHmac('sha256', key).update(value).digest(encoding)
}

function getSigningKey(secretAccessKey, dateStamp) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmac(dateKey, 'auto')
  const serviceKey = hmac(regionKey, 's3')
  return hmac(serviceKey, 'aws4_request')
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(url, options, label, attempts = 4) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options)
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`${label} returned HTTP ${response.status}`)
        await sleep(2000 * attempt)
        continue
      }
      return response
    } catch (error) {
      lastError = error
      await sleep(2000 * attempt)
    }
  }
  throw lastError
}

function publicUrlFor(asset) {
  const prefix = asset.group === 'demo'
    ? 'landing-pages/ai-clothes-changer/demo'
    : `landing-pages/ai-clothes-changer/presets/${asset.group}`
  return `${publicBaseUrl}/${prefix}/${asset.slug}.webp`
}

async function createTask(asset, apiKey) {
  const response = await fetchWithRetry(`${apiBase}/api/v1/jobs/createTask`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      input: { prompt: asset.prompt, aspect_ratio: asset.aspectRatio, quality: 'basic', output_format: 'png' },
    }),
  }, `createTask ${asset.slug}`)
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result?.code !== 200 || !result?.data?.taskId) {
    throw new Error(result?.message || result?.msg || `createTask failed with HTTP ${response.status}`)
  }
  return result.data.taskId
}

function extractImageUrl(result) {
  const data = result?.data || result
  const resultJson = data?.resultJson
  const parsed = typeof resultJson === 'string' ? JSON.parse(resultJson) : resultJson
  return parsed?.resultUrls?.[0] || parsed?.urls?.[0] || parsed?.url || data?.resultUrls?.[0] || data?.imageUrl
}

async function pollTask(taskId, slug, apiKey) {
  for (let attempt = 1; attempt <= 90; attempt += 1) {
    await sleep(attempt <= 3 ? 4000 : 7000)
    const response = await fetchWithRetry(`${apiBase}/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    }, `recordInfo ${slug}`)
    const result = await response.json().catch(() => ({}))
    const data = result?.data || result
    const state = data?.state || data?.status
    if (state === 'success' || state === 'SUCCEEDED') {
      const url = extractImageUrl(result)
      if (!url) throw new Error(`${slug} succeeded without an image URL`)
      return url
    }
    if (state === 'fail' || state === 'FAILED') {
      throw new Error(data?.failMsg || data?.message || `${slug} generation failed`)
    }
  }
  throw new Error(`${slug} generation timed out`)
}

async function download(url, file) {
  const response = await fetchWithRetry(url, undefined, `download ${path.basename(file)}`)
  if (!response.ok) throw new Error(`download failed with HTTP ${response.status}`)
  await writeFile(file, Buffer.from(await response.arrayBuffer()))
}

async function uploadToR2(file, asset) {
  const accessKeyId = getRequiredEnv('R2_ACCESS_KEY_ID')
  const secretAccessKey = getRequiredEnv('R2_SECRET_ACCESS_KEY')
  const endpointUrl = getRequiredEnv('R2_ENDPOINT_URL').replace(/\/+$/, '')
  const bucket = String(process.env.R2_BUCKET || 'toolaze').trim()
  const key = asset.group === 'demo'
    ? `landing-pages/ai-clothes-changer/demo/${asset.slug}.webp`
    : `landing-pages/ai-clothes-changer/presets/${asset.group}/${asset.slug}.webp`
  const bytes = await readFile(file)
  const endpoint = new URL(endpointUrl)
  const objectPath = `/${bucket}/${key}`
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = sha256Hex(bytes)
  const canonicalHeaders = `host:${endpoint.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = ['PUT', objectPath, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, sha256Hex(canonicalRequest)].join('\n')
  const signature = hmac(getSigningKey(secretAccessKey, dateStamp), stringToSign, 'hex')
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
  const response = await fetch(`${endpoint.origin}${objectPath}`, {
    method: 'PUT',
    headers: {
      Authorization: authorization,
      'Content-Type': 'image/webp',
      'Content-Length': String(bytes.length),
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
    },
    body: bytes,
  })
  if (!response.ok) throw new Error(`R2 upload ${asset.slug} failed with HTTP ${response.status}`)
}

async function verifyAsset(asset) {
  const response = await fetch(publicUrlFor(asset), { method: 'GET' })
  if (!response.ok) throw new Error(`${asset.slug} is not publicly available (HTTP ${response.status})`)
  const input = Buffer.from(await response.arrayBuffer())
  const metadata = await sharp(input).metadata()
  const validOrientation = asset.aspectRatio === '16:9'
    ? metadata.width > metadata.height
    : metadata.height > metadata.width
  if (metadata.format !== 'webp' || !metadata.width || !metadata.height || !validOrientation) {
    throw new Error(`${asset.slug} must be a ${asset.aspectRatio} WebP image`)
  }
  console.log(`[verified] ${asset.slug}: ${metadata.width}x${metadata.height}`)
}

async function generateAndPublish(asset, apiKey) {
  const pngFile = path.join(outputDir, `${asset.slug}.png`)
  const webpFile = path.join(outputDir, `${asset.slug}.webp`)
  console.log(`[create] ${asset.slug}`)
  const taskId = await createTask(asset, apiKey)
  console.log(`[task] ${asset.slug}: ${taskId}`)
  await download(await pollTask(taskId, asset.slug, apiKey), pngFile)
  const resize = asset.aspectRatio === '16:9'
    ? { width: 1600, withoutEnlargement: true }
    : { height: 1440, withoutEnlargement: true }
  await sharp(pngFile).resize(resize).webp({ quality: 82, effort: 6 }).toFile(webpFile)
  const metadata = await sharp(webpFile).metadata()
  const validOrientation = asset.aspectRatio === '16:9'
    ? metadata.width > metadata.height
    : metadata.height > metadata.width
  if (!metadata.width || !metadata.height || !validOrientation) throw new Error(`${asset.slug} must remain ${asset.aspectRatio}`)
  await uploadToR2(webpFile, asset)
  await verifyAsset(asset)
  const size = Math.round((await stat(webpFile)).size / 1024)
  console.log(`[published] ${asset.slug}: ${size} KB`)
}

async function main() {
  loadEnvFile(path.join(root, '.env.local'))
  if (verifyOnly) {
    for (const asset of assets) await verifyAsset(asset)
    return
  }
  if (publishExisting) {
    for (const asset of assets) {
      const file = path.join(outputDir, `${asset.slug}.webp`)
      try {
        await stat(file)
      } catch {
        continue
      }
      await uploadToR2(file, asset)
      await verifyAsset(asset)
      console.log(`[published] ${asset.slug}`)
    }
    return
  }
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('KIE_AI_API_KEY or ZHEN_AI_API_KEY is not configured')
  await mkdir(outputDir, { recursive: true })
  for (const asset of assets) {
    const existingFile = path.join(outputDir, `${asset.slug}.webp`)
    try {
      await stat(existingFile)
    } catch {
      await generateAndPublish(asset, apiKey)
      continue
    }
    try {
      await verifyAsset(asset)
      console.log(`[skipped] ${asset.slug} is already published`)
      continue
    } catch {}
    await generateAndPublish(asset, apiKey)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
