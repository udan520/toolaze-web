#!/usr/bin/env node

const fs = require('node:fs/promises')
const path = require('node:path')

const DEFAULT_ALLOWED_KEYS = [
  'CREEM_API_KEY',
  'CREEM_MODERATION_API_KEY',
  'KIE_AI_API_KEY',
  'NEXT_PUBLIC_IMAGE_UPLOAD_URL',
  'ZHEN_AI_API_KEY',
  'ZHEN_AI_FLUX_BASE_URL',
  'KIE_GEMINI_MODEL',
  'KIE_GEMINI_CHAT_SLUG',
  'AUTH_COOKIE_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_TOKEN_URL',
  'GOOGLE_JWKS_URL',
  'ACCOUNT_API_BACKEND',
  'SITE_URL',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT_URL',
  'R2_BUCKET',
  'R2_PUBLIC_BASE_URL',
]

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function findSharedEnvPath(projectRoot) {
  let dir = path.resolve(projectRoot)
  const { root } = path.parse(dir)

  while (true) {
    const candidate = path.join(dir, '.toolaze-shared.env.local')
    if (await pathExists(candidate)) return candidate
    if (dir === root) break
    dir = path.dirname(dir)
  }

  return path.resolve(projectRoot, '..', '.toolaze-shared.env.local')
}

function parseEnv(content, allowedKeys = DEFAULT_ALLOWED_KEYS) {
  const allowed = new Set(allowedKeys)
  const values = new Map()
  const skippedBlank = []

  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue

    const key = match[1]
    const value = match[2].trim()
    if (!allowed.has(key)) continue
    if (!value) {
      skippedBlank.push(key)
      continue
    }
    values.set(key, value)
  }

  return { values, skippedBlank }
}

async function syncLocalEnv(options = {}) {
  const projectRoot = options.projectRoot || process.cwd()
  const sharedEnvPath = options.sharedEnvPath || await findSharedEnvPath(projectRoot)
  const targetEnvPath = options.targetEnvPath || path.join(projectRoot, '.env.local')
  const allowedKeys = options.allowedKeys || DEFAULT_ALLOWED_KEYS

  const sharedContent = await fs.readFile(sharedEnvPath, 'utf8')
  const { values, skippedBlank } = parseEnv(sharedContent, allowedKeys)
  const targetContent = await fs.readFile(targetEnvPath, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return ''
    throw error
  })

  let lines = targetContent.split(/\r?\n/)
  if (lines.length === 1 && lines[0] === '') lines = []

  const updated = []
  const seen = new Set()
  lines = lines.map((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/)
    if (!match) return line

    const key = match[1]
    if (!values.has(key)) return line

    seen.add(key)
    updated.push(key)
    return `${key}=${values.get(key)}`
  })

  const added = []
  for (const [key, value] of values) {
    if (seen.has(key)) continue
    if (lines.length && lines[lines.length - 1] !== '') lines.push('')
    lines.push(`${key}=${value}`)
    added.push(key)
  }

  await fs.writeFile(targetEnvPath, `${lines.join('\n').replace(/\n*$/, '')}\n`, 'utf8')

  return {
    source: sharedEnvPath,
    target: targetEnvPath,
    added,
    updated,
    skippedBlank,
    synced: added.length + updated.length,
  }
}

function formatList(label, values) {
  return values.length ? `${label}: ${values.join(', ')}` : `${label}: none`
}

async function main() {
  const result = await syncLocalEnv()
  console.log(`Synced local env from ${result.source}`)
  console.log(`Target: ${result.target}`)
  console.log(formatList('Added', result.added))
  console.log(formatList('Updated', result.updated))
  if (result.skippedBlank.length) console.log(formatList('Skipped blank', result.skippedBlank))
  console.log(`Total synced: ${result.synced}`)
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}

module.exports = {
  DEFAULT_ALLOWED_KEYS,
  findSharedEnvPath,
  parseEnv,
  syncLocalEnv,
}
