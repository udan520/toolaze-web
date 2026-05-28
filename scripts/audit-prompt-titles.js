const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '..', 'public', 'prompts-data.json')
const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

const acronymWhitelist = new Set([
  'AI',
  'API',
  'ASMR',
  'CCTV',
  'CEO',
  'CGI',
  'FPV',
  'GPT',
  'GRWM',
  'HD',
  'HK',
  'IMAX',
  'IPL',
  'JSON',
  'KFC',
  'MV',
  'NYC',
  'POV',
  'SEO',
  'SWAT',
  'TV',
  'UGC',
  'UI',
  'UK',
  'US',
  'WWII',
  'X',
  'Y2K',
])

const brandCaseWhitelist = new Set([
  'C-500',
  "Chang'e",
  "Clavicular's",
  'iPad',
  'iPhone',
  'K-Drama',
  'K-Pop',
  "Leviathan's",
  'Sumi-E',
  'Ukiyo-E',
])

const sourceArtifacts = [
  /i used/i,
  /use this/i,
  /copy-?paste/i,
  /bookmark/i,
  /prompt image/i,
  /scene\s+\d/i,
  /\bshot\s+\d/i,
  /\b\d{1,2}s\b/i,
  /\b\d{2}:\d{2}/,
  /@[\w_]+/,
  /[{}[\]]/,
  /[🎞️📸✈️👌😉😊👉👇⤵️�]/u,
]

const genericStarts = /^(a|an|the|create|generate|use|make|show|replace|animate|style|shot|prompt|role|subject|description|image|without|in|on)\b/i
const genericWords = /\b(prompt|subject|description|parameters|version|generation_request|meta_data|task_type)\b/i

function cleanTitle(title) {
  return String(title || '')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function titleWords(title) {
  return cleanTitle(title)
    .replace(/[()".,:;{}[\]]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function isBadTitleCase(word) {
  if (!/[A-Za-z]/.test(word)) return false

  const normalized = word.replace(/[^A-Za-z0-9-]/g, '')
  if (!normalized) return false
  if (brandCaseWhitelist.has(word)) return false
  if (acronymWhitelist.has(normalized)) return false
  if (/^\d+[DK]$/i.test(normalized)) return false
  if (/^[A-Z][a-z0-9]+(?:-[A-Z0-9][a-z0-9]+)*$/.test(normalized)) return false

  return true
}

function auditItem(item) {
  const title = cleanTitle(item.title)
  const words = titleWords(title)
  const flags = []

  if (!title) flags.push('empty')
  if (words.length > 7) flags.push('too_long')
  if (genericStarts.test(title)) flags.push('raw_sentence_start')
  if (genericWords.test(title)) flags.push('generic_word')
  if (sourceArtifacts.some((pattern) => pattern.test(title))) flags.push('source_artifact')
  if (/[,.，。:：;；]$/.test(title)) flags.push('trailing_punctuation')

  const badCaseWords = words.filter(isBadTitleCase)
  if (badCaseWords.length > 0) flags.push(`title_case:${badCaseWords.join('|')}`)

  return flags
}

const findings = items
  .map((item) => ({
    rank: item.rank,
    tweetId: item.tweetId,
    model: item.model,
    title: cleanTitle(item.title),
    flags: auditItem(item),
  }))
  .filter((item) => item.flags.length > 0)

if (findings.length > 0) {
  console.log('rank\ttweetId\tmodel\tflags\ttitle')
  for (const item of findings) {
    console.log(
      [
        item.rank,
        item.tweetId || '',
        item.model || '',
        item.flags.join(','),
        item.title,
      ].join('\t'),
    )
  }
  console.error(`\nFound ${findings.length} prompt title issue(s).`)
  process.exitCode = 1
} else {
  console.log(`Checked ${items.length} prompt titles. No title issues found.`)
}
