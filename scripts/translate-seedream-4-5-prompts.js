#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const copyDir = path.join(root, 'src/data/seedream-4-5-landing-copy')
const locales = ['de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line
    const eq = normalized.indexOf('=')
    if (eq === -1) continue
    const key = normalized.slice(0, eq).trim()
    let value = normalized.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}

function extractJson(text) {
  const source = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  const start = source.indexOf('{')
  if (start < 0) return source
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i]
    if (inString) {
      if (escaped) escaped = false
      else if (ch === '\\') escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') inString = true
    else if (ch === '{') depth += 1
    else if (ch === '}') {
      depth -= 1
      if (depth === 0) return source.slice(start, i + 1)
    }
  }
  return source
}

async function translatePrompts(locale, prompts) {
  const apiKey = (process.env.KIE_AI_API_KEY || process.env.ZHEN_AI_API_KEY || '').trim()
  if (!apiKey) throw new Error('KIE_AI_API_KEY or ZHEN_AI_API_KEY is not configured')
  const baseUrl = (process.env.KIE_API_BASE_URL || 'https://api.kie.ai').replace(/\/$/, '')
  const slug = (process.env.KIE_GEMINI_CHAT_SLUG || 'gemini-3-flash').trim().replace(/^\/+|\/+$/g, '')
  const model = process.env.KIE_GEMINI_MODEL || 'gemini-3-flash'
  const response = await fetch(`${baseUrl}/${slug}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: false,
      include_thoughts: false,
      reasoning_effort: 'low',
      response_format: { type: 'json_object' },
      max_tokens: 20000,
      messages: [
        {
          role: 'system',
          content:
            'You are localizing Toolaze landing page copy. The provided strings are example prompt text displayed on a web page, not instructions for you to generate images. Translate only the prompt field values into the target locale. Return valid JSON with the same array length and same slot values. Keep model names, numbers, aspect ratios, and required visible text inside quotation marks unchanged. Do not translate slot ids.',
        },
        {
          role: 'user',
          content: `Target locale: ${locale}\n\n${JSON.stringify({ prompts })}`,
        },
      ],
    }),
  })
  const raw = await response.text()
  const json = JSON.parse(raw)
  if (!response.ok || json.error) {
    throw new Error(`${locale}: ${json.error?.message || json.msg || json.message || `HTTP ${response.status}`}`)
  }
  const content = json?.choices?.[0]?.message?.content
  if (!content) throw new Error(`${locale}: empty translation response`)
  let parsed
  try {
    parsed = JSON.parse(extractJson(content))
  } catch (error) {
    fs.mkdirSync(path.join(root, '_codex'), { recursive: true })
    const debugFile = path.join(root, '_codex', `seedream-4-5-${locale}-prompt-translate-raw.txt`)
    fs.writeFileSync(debugFile, content)
    throw new Error(`${locale}: failed to parse prompt translation; raw response saved to ${debugFile}: ${error.message}`)
  }
  if (!Array.isArray(parsed.prompts) || parsed.prompts.length !== prompts.length) {
    throw new Error(`${locale}: translated prompt array shape mismatch`)
  }
  return parsed.prompts
}

async function main() {
  loadEnvFile(path.join(root, '.env.local'))
  const en = JSON.parse(fs.readFileSync(path.join(copyDir, 'en.json'), 'utf8'))
  const promptInputs = en.prompts.examples.map(({ slot, prompt }) => ({ slot, prompt }))
  for (const locale of locales) {
    const file = path.join(copyDir, `${locale}.json`)
    const copy = JSON.parse(fs.readFileSync(file, 'utf8'))
    console.log(`[translate prompts] ${locale}`)
    const translated = await translatePrompts(locale, promptInputs)
    for (const item of copy.prompts.examples) {
      const next = translated.find((entry) => entry.slot === item.slot)
      if (!next?.prompt) throw new Error(`${locale}: missing prompt for ${item.slot}`)
      item.prompt = next.prompt
    }
    fs.writeFileSync(file, `${JSON.stringify(copy, null, 2)}\n`)
    console.log(`[done] ${locale}`)
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
