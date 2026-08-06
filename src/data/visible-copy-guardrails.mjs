const ignoredVisibleCopyKeys = new Set([
  'avatar',
  'canonical',
  'canonicalPath',
  'defaultMode',
  'featuredColumn',
  'href',
  'icon',
  'iconType',
  'in_menu',
  'layout',
  'logoSrc',
  'mode',
  'modelId',
  'poster',
  'published',
  'sectionsOrder',
  'seoFactoryTaskId',
  'sourceHistory',
  'src',
  'status',
  'topComponent',
  'url',
])

const visibleCopyGuardrailRules = [
  {
    rule: 'toolaze-internal-model-labeling',
    pattern:
      /\bToolaze\s+(?:marks?|marked|labels?|labeled|labelled|classifies|classified|categorizes|categorized|flags?|flagged|treats?)\s+(?:Wan|Kling|Seedance|Grok|Veo|GPT|Nano)\b/i,
  },
  {
    rule: 'toolaze-supports-model-config',
    pattern: /\bToolaze\s+supports\s+(?:Wan|Kling|Seedance|Grok|Veo|GPT|Nano)\b/i,
  },
  {
    rule: 'model-marked-as',
    pattern:
      /\b(?:Wan|Kling|Seedance|Grok|Veo|GPT|Nano)[\w\s./-]{0,60}\b(?:is|was|gets|has been)\s+(?:marked|labeled|labelled|classified|categorized|flagged)\s+as\b/i,
  },
  {
    rule: 'internal-implementation-language',
    pattern:
      /\b(?:current integration|current configuration|model registry|provider route|API platform|backend integration|schema-only|uploadProvider|uploadPath|provider-hosted|client-side model config|browser-visible generation payload|generation payload|FormData)\b/i,
  },
]

function formatChildPath(parentPath, key) {
  if (/^\d+$/.test(key)) return `${parentPath}[${key}]`
  return parentPath ? `${parentPath}.${key}` : key
}

export function collectVisibleStrings(value, path = '') {
  const key = path.replace(/\[\d+\]$/, '').split('.').at(-1)
  if (ignoredVisibleCopyKeys.has(key)) return []
  if (typeof value === 'string') return [{ path, value }]
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectVisibleStrings(item, formatChildPath(path, String(index))))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([entryKey, entryValue]) =>
      collectVisibleStrings(entryValue, formatChildPath(path, entryKey)),
    )
  }
  return []
}

export function findVisibleCopyGuardrailIssues(content, options = {}) {
  const source = options.source || 'unknown'

  return collectVisibleStrings(content).flatMap(({ path, value }) =>
    visibleCopyGuardrailRules.flatMap(({ rule, pattern }) => {
      const match = value.match(pattern)
      if (!match) return []
      return [
        {
          source,
          path,
          rule,
          match: match[0],
          value,
        },
      ]
    }),
  )
}
