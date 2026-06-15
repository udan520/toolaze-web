#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const outputDir = path.join(root, 'public/model-assets/seedream-4-5')
const apiBase = 'https://api.kie.ai/api/v1/jobs'
const defaultModel = 'seedream/4.5-text-to-image'

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line
    const eq = normalized.indexOf('=')
    if (eq === -1) continue
    const key = normalized.slice(0, eq).trim()
    let value = normalized.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile(path.join(root, '.env.local'))

const apiKey = (process.env.KIE_AI_API_KEY || '').trim()
const model = (process.env.KIE_SEEDREAM_4_5_TEXT_MODEL || defaultModel).trim()
const only = new Set(
  process.argv
    .filter((arg) => arg.startsWith('--only='))
    .flatMap((arg) => arg.slice('--only='.length).split(','))
    .map((item) => item.trim())
    .filter(Boolean),
)
const force = process.argv.includes('--force')

const sharedStyle =
  'Create a polished Seedream 4.5 landing page asset. Use a professional commercial visual style, strong composition, crisp detail, and a clean background. Avoid cartoon style unless explicitly requested. Avoid laptop screens, desktop monitors, browser windows, or fake UI screenshots unless the prompt asks for an interface. Do not include watermarks, real logos, brand names, or illegible filler text.'

const assets = [
  {
    slot: 'feature-reference-consistency',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Show reference consistency through a flat editorial board: the same original female character appears in three coherent variations with matching face, hair, and outfit details, plus small material swatches and arrows. Use a clean studio background, subtle labels, and a premium design-review mood.`,
  },
  {
    slot: 'feature-4k-output',
    aspectRatio: '4:3',
    quality: 'high',
    prompt:
      `${sharedStyle} Create a high-resolution showcase image that clearly communicates 4K output. Use one striking detailed landscape-product hybrid visual with sharp texture, a large readable "4K" mark, small readable "HIGH QUALITY OUTPUT" text, and no computer screen. The image should feel like a premium resolution sample board.`,
  },
  {
    slot: 'feature-typography',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a dense typography poster layout with many readable blocks of English and Chinese text, clear hierarchy, section dividers, captions, numbers, and small icons. The title should read "Design Notes". Make the page demonstrate strong text rendering and spacing.`,
  },
  {
    slot: 'feature-commercial-design',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a commercial poster and product design sheet for a premium ceramic smart speaker. Show product hero photography, packaging side panel, headline area, three feature callouts, clean reflections, and a refined blue-white-silver palette. Make it useful for marketing production.`,
  },
  {
    slot: 'feature-prompt-adherence',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Visualize prompt adherence and layout control as a structured creative canvas: numbered zones, arrows, subject placement guides, color chips, and a final composed poster mockup. Use flat design mixed with refined print layout, no computer screen.`,
  },
  {
    slot: 'gallery-ecommerce-product',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a marketplace-ready product image for a modular desk lamp. White background, realistic shadows, product close-up, three readable feature labels, small comparison strip, and polished e-commerce lighting. It should look commercially usable, not decorative.`,
  },
  {
    slot: 'gallery-poster-layout',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a bold cultural event poster layout titled "Night Market 2026". Include readable date, venue, three schedule items, expressive food and light motifs, strong hierarchy, and a modern editorial composition.`,
  },
  {
    slot: 'gallery-fragrance-detail',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a premium fragrance product detail visual. Use a glass perfume bottle, ingredient notes, texture swatches, scent pyramid blocks, elegant typography, soft light, and a refined cream-blue palette. Avoid using a real brand name.`,
  },
  {
    slot: 'gallery-saas-promo',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a SaaS promo visual without showing a computer screen: floating flat interface cards, analytics shapes, feature badges, workflow arrows, and readable short text such as "Launch Faster" and "Automate Reports". Use a polished startup campaign style.`,
  },
  {
    slot: 'gallery-wedding-invitation',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create an elegant wedding invitation concept with readable names "Mira & Leo", date "June 18, 2026", venue line, floral border, fine paper texture, gold accents, and balanced spacing. Keep it refined and print-ready.`,
  },
  {
    slot: 'gallery-beauty-kv',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a beauty key visual for a fictional serum bottle named "Luma C". Show realistic bottle texture, peach and pearl palette, soft flower shadows, water droplets, clean headline area, and polished editorial advertising composition.`,
  },
  {
    slot: 'gallery-character-reference',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a character reference edit board. Show one consistent stylized explorer character in three poses with the same face, outfit colors, backpack, and scarf, plus small notes and material swatches. Make identity consistency obvious.`,
  },
  {
    slot: 'gallery-multilingual-layout',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a multilingual information card layout with readable English, Chinese, and Japanese text blocks, clear section headings, numbers, icons, and generous spacing. Use a clean museum guide or travel guide style.`,
  },
  {
    slot: 'prompt-product-poster',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a 4K product launch poster for a premium sparkling tea can. Use a clean composition, readable headline "Bright Citrus Tea", subtitle "zero sugar, real fruit aroma", citrus slices, condensation, studio light, and polished commercial layout.`,
  },
  {
    slot: 'prompt-character-reference-edit',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a cinematic rainy street scene featuring the same recognizable character from a reference board style: consistent face, hairstyle, eye color, jacket, and scarf. Use reflective pavement and soft neon light, with no computer screen.`,
  },
  {
    slot: 'prompt-education-infographic',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Design a clean educational infographic titled "How Solar Energy Works". Include four clear steps, readable labels, flat diagrams, arrows, concise captions, blue and yellow accents, and a classroom-friendly layout.`,
  },
  {
    slot: 'prompt-interior-redesign',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a warm Japandi interior design proposal image. Show a room redesign board with oak furniture, linen textures, neutral walls, soft lighting, material swatches, and a matching room view. No computer screen or device mockup.`,
  },
  {
    slot: 'prompt-event-poster',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create a modern event poster for "Future Design Week 2026". Include readable schedule text for three sessions, speaker names, date, venue, ticket note, and a bold abstract visual system with strong hierarchy.`,
  },
  {
    slot: 'final-cta',
    aspectRatio: '4:3',
    prompt:
      `${sharedStyle} Create an inspiring Toolaze-style AI image creation collage without using the Toolaze logo: poster, product image, infographic, character edit, and interior concept arranged as premium printed panels on a soft purple-indigo gradient background. Add subtle readable text "Create with Seedream 4.5".`,
  },
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

async function createTask(asset) {
  const response = await fetchWithRetry(`${apiBase}/createTask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: {
        prompt: asset.prompt,
        aspect_ratio: asset.aspectRatio,
        quality: asset.quality || 'basic',
        output_format: 'png',
      },
    }),
  }, `createTask ${asset.slot}`)
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result?.code !== 200 || !result?.data?.taskId) {
    throw new Error(result?.message || result?.msg || `createTask failed with HTTP ${response.status}`)
  }
  return result.data.taskId
}

function extractImageUrl(result) {
  const data = result?.data || result
  if (!data) return undefined
  if (data.resultJson) {
    const parsed = typeof data.resultJson === 'string' ? JSON.parse(data.resultJson) : data.resultJson
    if (Array.isArray(parsed?.resultUrls) && parsed.resultUrls[0]) return parsed.resultUrls[0]
    if (Array.isArray(parsed?.urls) && parsed.urls[0]) return parsed.urls[0]
    if (parsed?.url) return parsed.url
  }
  if (Array.isArray(data.resultUrls) && data.resultUrls[0]) return data.resultUrls[0]
  if (data.imageUrl) return data.imageUrl
  return undefined
}

async function pollTask(taskId, slot) {
  for (let attempt = 1; attempt <= 90; attempt += 1) {
    await sleep(attempt <= 3 ? 4000 : 7000)
    const response = await fetchWithRetry(`${apiBase}/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }, `recordInfo ${slot}`)
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(result?.message || result?.msg || `recordInfo failed with HTTP ${response.status}`)
    }
    const data = result?.data || result
    const state = data?.state || data?.status
    if (state === 'success' || state === 'SUCCEEDED') {
      const url = extractImageUrl(result)
      if (!url) throw new Error(`Task ${taskId} for ${slot} succeeded without an image URL`)
      return url
    }
    if (state === 'fail' || state === 'FAILED') {
      throw new Error(data?.failMsg || data?.message || `Task ${taskId} failed for ${slot}`)
    }
    if (attempt % 5 === 0) {
      console.log(`[poll] ${slot}: still pending after ${attempt} checks`)
    }
  }
  throw new Error(`Timed out waiting for ${slot}`)
}

async function downloadImage(url, file) {
  const response = await fetchWithRetry(url, undefined, `download ${path.basename(file)}`)
  if (!response.ok) throw new Error(`download failed with HTTP ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(file, buffer)
}

async function generateOne(asset) {
  const file = path.join(outputDir, `${asset.slot}.png`)
  if (!force && fs.existsSync(file)) {
    console.log(`[skip] ${asset.slot}: file exists`)
    return
  }
  console.log(`[create] ${asset.slot}`)
  const taskId = await createTask(asset)
  console.log(`[task] ${asset.slot}: ${taskId}`)
  const imageUrl = await pollTask(taskId, asset.slot)
  await downloadImage(imageUrl, file)
  const sizeKb = Math.round(fs.statSync(file).size / 1024)
  console.log(`[done] ${asset.slot}: ${path.relative(root, file)} (${sizeKb} KB)`)
}

async function main() {
  if (!apiKey) throw new Error('KIE_AI_API_KEY is not configured')
  fs.mkdirSync(outputDir, { recursive: true })
  const selected = only.size ? assets.filter((asset) => only.has(asset.slot)) : assets
  if (selected.length === 0) throw new Error('No matching assets selected')
  console.log(`Generating ${selected.length} Seedream 4.5 landing page assets with ${model}`)
  const failed = []
  for (const asset of selected) {
    try {
      await generateOne(asset)
    } catch (error) {
      failed.push(asset.slot)
      console.error(`[fail] ${asset.slot}: ${error instanceof Error ? error.message : error}`)
    }
  }
  if (failed.length > 0) {
    throw new Error(`Failed assets: ${failed.join(', ')}`)
  }
  console.log('Seedream 4.5 asset generation finished.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
