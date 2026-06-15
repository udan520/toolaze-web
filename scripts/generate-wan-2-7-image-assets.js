#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = path.resolve(__dirname, '..')
const outputDir = path.join(root, 'public/model-assets/wan-2-7-image')
const apiBase = 'https://api.kie.ai/api/v1/jobs'
const defaultModel = 'wan/2-7-image'
const defaultProModel = 'wan/2-7-image-pro'
const maxWebpBytes = 100 * 1024

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
const model = (process.env.KIE_WAN_2_7_IMAGE_MODEL || defaultModel).trim()
const proModel = (process.env.KIE_WAN_2_7_IMAGE_PRO_MODEL || defaultProModel).trim()
const only = new Set(
  process.argv
    .filter((arg) => arg.startsWith('--only='))
    .flatMap((arg) => arg.slice('--only='.length).split(','))
    .map((item) => item.trim())
    .filter(Boolean),
)
const force = process.argv.includes('--force')
const optimizeOnly = process.argv.includes('--optimize-only')

const sharedStyle =
  'Create a professional Wan 2.7 Image landing page asset. Use a clean commercial or editorial visual style, crisp detail, strong composition, and a light background. Avoid cartoon style unless the prompt explicitly asks for a stylized character. Avoid laptop screens, desktop monitors, browser windows, or fake UI screenshots unless the prompt asks for interface cards. Do not include watermarks, real logos, real brands, or unreadable filler text.'

const assets = [
  {
    slot: 'thinking-mode',
    prompt:
      `${sharedStyle} Show thinking mode for complex prompts as a clean visual planning board. Include a central finished poster concept, visible layout guides, numbered prompt notes, object relationship arrows, color chips, and a readable heading "Prompt Plan". Make it look like a design strategy board, not a computer screen.`,
  },
  {
    slot: 'text-rendering',
    prompt:
      `${sharedStyle} Create a dense typography and information poster that demonstrates readable text rendering. Use the title "City Food Guide", six short sections, prices, icons, map labels, and English plus Chinese text blocks. Keep the text clean, aligned, and legible.`,
  },
  {
    slot: 'image-editing',
    prompt:
      `${sharedStyle} Create a before-and-after image editing board for a blue running shoe. Left side shows a plain product photo, right side shows the same shoe with a new studio background, lighting, and color accents. Use clear arrows and short readable labels "before" and "edited".`,
  },
  {
    slot: 'multi-reference',
    prompt:
      `${sharedStyle} Show multi-reference image fusion as a flat editorial board. Include nine small reference tiles for product, material, palette, lighting, packaging, background, logo shape, angle, and mood, all feeding into one final campaign visual for a ceramic travel mug. No real brand names.`,
  },
  {
    slot: 'resolution',
    model: 'pro',
    resolution: '4K',
    prompt:
      `${sharedStyle} Create a high-resolution sample board that clearly communicates 4K output. Use one detailed premium landscape and product scene with sharp textures, a large readable "4K" mark, and small readable text "high detail output". No computer screen.`,
  },
  {
    slot: 'image-sets',
    prompt:
      `${sharedStyle} Create a consistent image set board with six related campaign frames for a fictional botanical tea collection. Keep the same product shape, color palette, typography system, and lighting across every frame. Use readable frame labels 01 to 06.`,
  },
  {
    slot: 'gallery-product-ad',
    prompt:
      `${sharedStyle} Create a clean commercial product ad for a matte black wireless speaker. Include hero product lighting, readable headline "Room-filling sound", three short benefit callouts, and a refined white-gray background. Make it commercially usable.`,
  },
  {
    slot: 'gallery-event-poster',
    prompt:
      `${sharedStyle} Create a modern event poster layout titled "Future Design Week 2026". Include readable date, venue, three schedule blocks, speaker names, ticket note, and bold abstract shapes with strong hierarchy.`,
  },
  {
    slot: 'gallery-packaging',
    prompt:
      `${sharedStyle} Create a packaging concept board for a fictional oat snack bar. Show front label, side panel, material swatches, flavor color system, nutrition callout blocks, and shelf-ready presentation. No real brands.`,
  },
  {
    slot: 'gallery-infographic',
    prompt:
      `${sharedStyle} Create a clean educational infographic explaining how rainwater harvesting works. Include four numbered steps, readable labels, simple flat diagrams, arrows, blue-green palette, and generous spacing.`,
  },
  {
    slot: 'gallery-character',
    prompt:
      `${sharedStyle} Create a stylized character reference edit board. Show the same friendly courier character in three poses with matching face, jacket, cap, satchel, and color palette. Include small notes and material swatches. Make identity consistency obvious.`,
  },
  {
    slot: 'gallery-interior',
    prompt:
      `${sharedStyle} Create an interior design revision board for a small reading room. Show one final room view, material swatches, furniture notes, lighting plan, and calm Japandi palette. No screens or devices.`,
  },
  {
    slot: 'gallery-storyboard',
    prompt:
      `${sharedStyle} Create a storyboard frame sheet for a coffee shop campaign. Use six cinematic frames with matching color grade, short readable captions, shot numbers, and consistent subject styling. Keep it like a printed creative board.`,
  },
  {
    slot: 'gallery-brand-board',
    prompt:
      `${sharedStyle} Create a brand visual board for a fictional mineral water label. Include typography samples, palette chips, bottle mockup, packaging notes, social card layout, and a readable heading "Brand System". No real logo.`,
  },
  {
    slot: 'prompt-product-ad',
    prompt:
      `${sharedStyle} Create a vertical product launch poster for a premium sparkling yuzu drink. Include readable headline "Yuzu Spark", subtitle "bright citrus, zero sugar", one hero can with condensation, sliced yuzu fruit, clean white and citrus-yellow background, and small benefit callouts.`,
  },
  {
    slot: 'prompt-text-poster',
    prompt:
      `${sharedStyle} Create a dense text event poster for "Future Design Week 2026". Include readable schedule blocks for three sessions, speaker names, date, venue, ticket note, and a bold abstract visual system with generous spacing.`,
  },
  {
    slot: 'prompt-reference-fusion',
    prompt:
      `${sharedStyle} Create a multi-reference fusion campaign board for a ceramic travel mug. Show small reference tiles for product shape, lighting, and color palette, then a final campaign visual that keeps the mug shape unchanged while applying the lighting and colors.`,
  },
  {
    slot: 'prompt-character-edit',
    prompt:
      `${sharedStyle} Create a rainy neon street character edit image. Keep one recognizable character with the same face, hairstyle, jacket, and scarf while changing the scene to reflective pavement, cinematic rim light, and a calm confident pose.`,
  },
  {
    slot: 'prompt-infographic',
    prompt:
      `${sharedStyle} Create a classroom-friendly infographic titled "How Solar Energy Works". Include four numbered steps, short readable labels, simple icons, arrows, blue and yellow accents, and clean hierarchy.`,
  },
  {
    slot: 'prompt-interior',
    prompt:
      `${sharedStyle} Create a warm Japandi living room redesign proposal. Keep the same room layout, window position, and camera angle while showing oak furniture, linen texture, warm indirect lighting, neutral walls, and material swatches.`,
  },
  {
    slot: 'final-cta',
    prompt:
      `${sharedStyle} Create a Toolaze-style AI image creation collage without using the Toolaze logo. Arrange a product ad, typography poster, infographic, character edit, and interior design board as premium printed panels on a soft purple-indigo background. Add readable text "Create with Wan 2.7".`,
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
  const selectedModel = asset.model === 'pro' ? proModel : model
  const response = await fetchWithRetry(`${apiBase}/createTask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: selectedModel,
      input: {
        prompt: asset.prompt,
        n: 1,
        enable_sequential: false,
        resolution: asset.resolution || '2K',
        thinking_mode: true,
        aspect_ratio: '4:3',
        nsfw_checker: true,
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
    if (Array.isArray(parsed?.images) && parsed.images[0]) return parsed.images[0]
    if (parsed?.url) return parsed.url
  }
  if (Array.isArray(data.resultUrls) && data.resultUrls[0]) return data.resultUrls[0]
  if (Array.isArray(data.urls) && data.urls[0]) return data.urls[0]
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

async function optimizeWebp(sourceFile, webpFile) {
  for (const width of [960, 880, 800, 720]) {
    for (const quality of [78, 70, 62, 54, 46, 38]) {
      const buffer = await sharp(sourceFile)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer()
      if (buffer.length <= maxWebpBytes || (width === 720 && quality === 38)) {
        fs.writeFileSync(webpFile, buffer)
        return buffer.length
      }
    }
  }
}

async function generateOne(asset) {
  const sourceFile = path.join(outputDir, `${asset.slot}.png`)
  const webpFile = path.join(outputDir, `${asset.slot}.webp`)
  if (!force && fs.existsSync(webpFile)) {
    console.log(`[skip] ${asset.slot}: webp exists`)
    return
  }

  if (!optimizeOnly && (force || !fs.existsSync(sourceFile))) {
    console.log(`[create] ${asset.slot}`)
    const taskId = await createTask(asset)
    console.log(`[task] ${asset.slot}: ${taskId}`)
    const imageUrl = await pollTask(taskId, asset.slot)
    await downloadImage(imageUrl, sourceFile)
    const sizeKb = Math.round(fs.statSync(sourceFile).size / 1024)
    console.log(`[source] ${asset.slot}: ${path.relative(root, sourceFile)} (${sizeKb} KB)`)
  }

  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Missing source image for ${asset.slot}`)
  }
  const bytes = await optimizeWebp(sourceFile, webpFile)
  console.log(`[webp] ${asset.slot}: ${Math.round(bytes / 1024)} KB`)
}

async function main() {
  if (!apiKey && !optimizeOnly) throw new Error('KIE_AI_API_KEY is not configured')
  fs.mkdirSync(outputDir, { recursive: true })
  const selected = only.size ? assets.filter((asset) => only.has(asset.slot)) : assets
  if (selected.length === 0) throw new Error('No matching assets selected')
  console.log(`${optimizeOnly ? 'Optimizing' : 'Generating'} ${selected.length} Wan 2.7 Image landing page assets`)
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
  console.log('Wan 2.7 Image asset generation finished.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
