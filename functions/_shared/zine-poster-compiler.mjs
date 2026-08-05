const ZINE_POSTER_TOOL_SLUG = 'ai-zine-poster-generator'

const LAYOUTS = [
  'center-fragment',
  'lower-left-float',
  'upper-right-block',
  'dual-panel',
  'irregular-cutout',
  'type-led',
  'dot-orbit',
  'single-specimen',
]

const ANCHORS = [
  'tiny faded photo',
  'torn-paper clipping',
  'flat silhouette',
  'solid color block',
  'old printed illustration',
  'object specimen',
  'translucent geometric overlay',
  'abstract texture window',
]

const TYPOGRAPHY = [
  'fragmented floating letters',
  'short phrase pressed against image edge',
  'archive microtext with date/weather',
  'diagonal scattered words',
  'low-contrast gray ghost text',
  'headline-as-object with rough letterpress',
  'text inside a color block or cutout',
  'almost textless, only a tiny caption',
]

const TEXTURES = [
  'xerox softness',
  'risograph grain',
  'letterpress ink bleed',
  'halftone degradation',
  'film grain photo',
  'scan noise and paper fibers',
  'aged paper mottling',
  'soft motion blur on selected text',
]

const MOODS = [
  'quiet',
  'summer',
  'solitude',
  'childhood',
  'seaside',
  'afternoon',
  'night',
  'memory',
  'slight surrealism',
]

const ACCENT_COLORS = [
  'fully saturated cobalt-blue risograph ink',
  'opaque ultramarine cutout',
  'clean tomato-red printed block',
  'vivid pear-green flat silhouette',
  'saturated cyan paper fragment',
  'dense violet letterpress type',
  'lemon-yellow printed block',
  'bright orange risograph patch',
  'magenta-pink ink fragment',
]

const SUBJECT_BIASES = {
  person: {
    layouts: ['center-fragment', 'lower-left-float', 'single-specimen'],
    anchors: ['tiny faded photo', 'torn-paper clipping', 'old printed illustration'],
  },
  portrait: {
    layouts: ['center-fragment', 'lower-left-float', 'single-specimen'],
    anchors: ['tiny faded photo', 'torn-paper clipping', 'old printed illustration'],
  },
  product: {
    layouts: ['single-specimen', 'center-fragment', 'upper-right-block'],
    anchors: ['object specimen', 'solid color block', 'flat silhouette'],
  },
  object: {
    layouts: ['single-specimen', 'center-fragment', 'dot-orbit'],
    anchors: ['object specimen', 'torn-paper clipping', 'flat silhouette'],
  },
  plant: {
    layouts: ['single-specimen', 'irregular-cutout', 'lower-left-float'],
    anchors: ['object specimen', 'old printed illustration', 'flat silhouette'],
  },
  pet: {
    layouts: ['center-fragment', 'single-specimen', 'lower-left-float'],
    anchors: ['tiny faded photo', 'old printed illustration', 'torn-paper clipping'],
  },
  room: {
    layouts: ['upper-right-block', 'dual-panel', 'irregular-cutout'],
    anchors: ['abstract texture window', 'torn-paper clipping', 'tiny faded photo'],
  },
  landscape: {
    layouts: ['upper-right-block', 'dual-panel', 'center-fragment'],
    anchors: ['torn-paper clipping', 'abstract texture window', 'tiny faded photo'],
  },
}

function stableHash(value) {
  const text = String(value || '')
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function pick(list, hash, offset = 0) {
  if (!list.length) return undefined
  return list[(hash + offset) % list.length]
}

function normalizeText(value, fallback) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  return text || fallback
}

function normalizeList(value, fallback = []) {
  if (!Array.isArray(value)) return fallback
  const items = value
    .map((item) => normalizeText(item, ''))
    .filter(Boolean)
    .slice(0, 5)
  return items.length ? items : fallback
}

function normalizeSubjectType(value) {
  const normalized = normalizeText(value, 'object').toLowerCase()
  if (/person|people|human|portrait|face/.test(normalized)) return 'portrait'
  if (/product|packaging|bottle|shoe|bag|device/.test(normalized)) return 'product'
  if (/plant|flower|tree|leaf/.test(normalized)) return 'plant'
  if (/pet|dog|cat|animal/.test(normalized)) return 'pet'
  if (/room|interior|home|kitchen|bedroom|studio/.test(normalized)) return 'room'
  if (/landscape|seascape|sea|ocean|mountain|sky|cliff|water/.test(normalized)) return 'landscape'
  return normalized.includes('object') ? 'object' : normalized
}

function fallbackZineAnalysis(imageUrl) {
  return {
    subjectType: 'object',
    mainSubject: 'the clearest subject in the uploaded reference image',
    visualFragment: 'one recognizable visual fragment from the reference',
    moodHints: ['quiet', 'memory'],
    dominantColors: [],
    suggestedShortText: 'quiet is enough.',
    safetyNotes: [],
    imageUrl,
    source: 'fallback',
  }
}

function normalizeAnalysis(value, imageUrl) {
  const fallback = fallbackZineAnalysis(imageUrl)
  const subjectType = normalizeSubjectType(value?.subjectType || fallback.subjectType)
  return {
    subjectType,
    mainSubject: normalizeText(value?.mainSubject, fallback.mainSubject),
    visualFragment: normalizeText(value?.visualFragment, fallback.visualFragment),
    moodHints: normalizeList(value?.moodHints, fallback.moodHints),
    dominantColors: normalizeList(value?.dominantColors, fallback.dominantColors),
    suggestedShortText: normalizeText(value?.suggestedShortText, fallback.suggestedShortText).slice(0, 80),
    safetyNotes: normalizeList(value?.safetyNotes, []),
    imageUrl,
    source: value?.source || 'vision',
  }
}

function extractOpenAIResponseText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text
  }

  const text = payload?.output
    ?.flatMap((item) => item?.content || [])
    ?.find((content) => content?.type === 'output_text' && typeof content.text === 'string')
    ?.text

  if (!text) throw new Error('OpenAI response did not include structured output text.')
  return text
}

function parseAnalysisPayload(payload, imageUrl) {
  return normalizeAnalysis(JSON.parse(extractOpenAIResponseText(payload)), imageUrl)
}

export function isZinePosterTool(toolSlug) {
  return String(toolSlug || '').trim() === ZINE_POSTER_TOOL_SLUG
}

export async function analyzeZineReferenceImage({
  imageUrl,
  env = {},
  fetchImpl = fetch,
} = {}) {
  const apiKey = env.ZINE_POSTER_OPENAI_API_KEY || env.OPENAI_API_KEY || ''
  if (!apiKey || !/^https?:\/\//i.test(String(imageUrl || ''))) {
    return fallbackZineAnalysis(imageUrl)
  }

  const model = env.ZINE_POSTER_VISION_MODEL || env.MEDIA_LIBRARY_VISION_MODEL || 'gpt-5'

  try {
    const response = await fetchImpl('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: [
                  'Analyze this uploaded reference image for a minimal zine poster generator.',
                  'Return only visual facts and safe, non-identifying descriptions.',
                  'Identify the main imageable subject, a useful visual fragment, mood hints, dominant colors, and one very short readable poster phrase.',
                  'Do not name private people, brands, copyrighted characters, or logos.',
                ].join(' '),
              },
              {
                type: 'input_image',
                image_url: imageUrl,
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'zine_reference_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: [
                'subjectType',
                'mainSubject',
                'visualFragment',
                'moodHints',
                'dominantColors',
                'suggestedShortText',
                'safetyNotes',
              ],
              properties: {
                subjectType: {
                  type: 'string',
                  enum: ['person', 'portrait', 'object', 'product', 'plant', 'pet', 'room', 'landscape', 'abstract'],
                },
                mainSubject: { type: 'string' },
                visualFragment: { type: 'string' },
                moodHints: {
                  type: 'array',
                  items: { type: 'string' },
                  maxItems: 5,
                },
                dominantColors: {
                  type: 'array',
                  items: { type: 'string' },
                  maxItems: 5,
                },
                suggestedShortText: { type: 'string' },
                safetyNotes: {
                  type: 'array',
                  items: { type: 'string' },
                  maxItems: 5,
                },
              },
            },
          },
        },
      }),
    })

    if (!response.ok) return fallbackZineAnalysis(imageUrl)
    return parseAnalysisPayload(await response.json(), imageUrl)
  } catch {
    return fallbackZineAnalysis(imageUrl)
  }
}

export function selectZinePosterRecipe({
  imageUrl = '',
  subjectType = 'object',
  mainSubject = '',
  moodHints = [],
  dominantColors = [],
  seed = '',
} = {}) {
  const normalizedSubjectType = normalizeSubjectType(subjectType)
  const bias = SUBJECT_BIASES[normalizedSubjectType] || SUBJECT_BIASES.object
  const hash = stableHash([
    imageUrl,
    normalizedSubjectType,
    mainSubject,
    normalizeList(moodHints).join('|'),
    normalizeList(dominantColors).join('|'),
    seed,
  ].join('|'))

  const moodPool = normalizeList(moodHints)
    .map((item) => normalizeSubjectType(item) === 'landscape' ? 'seaside' : item.toLowerCase())
    .filter((item) => MOODS.includes(item))

  return {
    layout: pick(bias.layouts || LAYOUTS, hash, 0),
    anchor: pick(bias.anchors || ANCHORS, hash, 3),
    typography: pick(TYPOGRAPHY, hash, 7),
    texture: pick(TEXTURES, hash, 11),
    mood: moodPool[0] || pick(MOODS, hash, 13),
    accentColor: selectAccentColor({ dominantColors, hash }),
  }
}

function selectAccentColor({ dominantColors = [], hash }) {
  const colors = normalizeList(dominantColors).join(' ').toLowerCase()
  if (/blue|cyan|ocean|sea|water/.test(colors)) return 'fully saturated cobalt-blue risograph ink'
  if (/red|tomato|rose/.test(colors)) return 'clean tomato-red printed block'
  if (/green|leaf|plant/.test(colors)) return 'vivid pear-green flat silhouette'
  if (/yellow|sun|gold|sand/.test(colors)) return 'lemon-yellow printed block'
  if (/orange/.test(colors)) return 'bright orange risograph patch'
  if (/pink|magenta/.test(colors)) return 'magenta-pink ink fragment'
  if (/violet|purple/.test(colors)) return 'dense violet letterpress type'
  return pick(ACCENT_COLORS, hash, 17)
}

export function compileZinePosterPrompt({ analysis, recipe }) {
  const normalizedAnalysis = normalizeAnalysis(analysis, analysis?.imageUrl)
  const selectedRecipe = recipe || selectZinePosterRecipe(normalizedAnalysis)
  const shortText = normalizedAnalysis.suggestedShortText.replace(/"/g, "'")
  const mood = selectedRecipe.mood || 'quiet'

  return [
    `Create a paper poster that follows the requested output canvas: full-frame aged off-white paper, no border, no mockup. Keep 70% to 90% calm negative space, with one small visual cluster occupying about 8% to 25% of the canvas, using a ${selectedRecipe.layout} composition placed away from the edges. Do not force an alternate crop or nested frame.`,
    `Use the uploaded reference only to reinterpret ${normalizedAnalysis.mainSubject} as one imageable zine anchor. Focus on ${normalizedAnalysis.visualFragment}; render it as a ${selectedRecipe.anchor} with ${selectedRecipe.texture}, softened paper edges, halftone wear, scan noise, subtle ink bleed, and slight misregistration while keeping the subject recognizable.`,
    `Add sparse serif, typewriter, or monospaced typography in the ${selectedRecipe.typography} mode, including the short readable phrase "${shortText}" plus optional tiny archive marks. Use one unmistakable high-chroma accent: ${selectedRecipe.accentColor}, as a visible printed block, cutout, subject fragment, or type element occupying about 0.8% to 2.5% of the whole canvas or 15% to 35% of the small cluster.`,
    `Keep the whole image flat like an orthographic scanned paper sheet with matte absorbent texture, diffuse light, low-to-medium contrast, and a ${mood}, poetic Japanese or Korean indie editorial zine mood. Avoid full-bleed scenes, commercial headlines, logo lockups, CTA layout, glossy mockups, clean digital UI white, cinematic lighting, 3D depth, neon, cute cartoon style, dense scrapbook collage, too many colors, and long clean text blocks.`,
  ].join('\n\n')
}

export async function compileZinePosterPromptFromImage({
  imageUrl,
  env = {},
  fetchImpl = fetch,
  seed = '',
} = {}) {
  const analysis = await analyzeZineReferenceImage({ imageUrl, env, fetchImpl })
  const recipe = selectZinePosterRecipe({
    ...analysis,
    imageUrl,
    seed,
  })
  const prompt = compileZinePosterPrompt({ analysis, recipe })

  return { analysis, recipe, prompt }
}
