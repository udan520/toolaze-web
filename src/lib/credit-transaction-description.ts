const UPPERCASE_WORDS = new Set(['ai', 'api', 'cta', 'ga4', 'gpt', 'jpg', 'png', 'ui', 'url', 'x'])

function titleCaseWord(word: string) {
  const match = word.match(/^(\W*)([\w]+)(\W*)$/)
  if (!match) return word

  const [, prefix, core, suffix] = match
  const lowerCore = core.toLowerCase()
  const nextCore = UPPERCASE_WORDS.has(lowerCore)
    ? lowerCore.toUpperCase()
    : `${core.charAt(0).toUpperCase()}${core.slice(1).toLowerCase()}`

  return `${prefix}${nextCore}${suffix}`
}

export function formatCreditTransactionDescription(description: string) {
  const normalized = description.trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')
  if (!normalized) return description

  return normalized
    .split(' ')
    .map((word) => word ? titleCaseWord(word) : word)
    .join(' ')
}
