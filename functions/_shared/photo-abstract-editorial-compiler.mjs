const PHOTO_ABSTRACT_TOOL_SLUG = 'ai-photo-abstract-poster-generator'

const SUBJECT_TYPES = new Set([
  'portrait',
  'crowd',
  'landscape',
  'architecture',
  'organic-group',
  'object',
  'ordinary-scene',
])

function normalizeText(value, fallback = '') {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  return text || fallback
}

function normalizeList(value, fallback = [], maxItems = 6) {
  if (!Array.isArray(value)) return [...fallback]
  const items = value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, maxItems)
  return items.length ? items : [...fallback]
}

function normalizeOrientation(value) {
  const orientation = normalizeText(value, 'unknown').toLowerCase()
  return ['landscape', 'portrait', 'square'].includes(orientation) ? orientation : 'unknown'
}

function normalizeSubjectType(value) {
  const subjectType = normalizeText(value, 'ordinary-scene').toLowerCase()
  return SUBJECT_TYPES.has(subjectType) ? subjectType : 'ordinary-scene'
}

function normalizeTitle(value) {
  const words = normalizeText(value, 'Observed Intervals')
    .replace(/[^A-Za-z' -]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)

  return words.length >= 2 ? words.join(' ') : 'Observed Intervals'
}

function fallbackPhotoAbstractAnalysis(imageUrl) {
  return {
    orientation: 'unknown',
    subjectType: 'ordinary-scene',
    spatialFacts: [
      'identify three to six observable spatial facts in the uploaded photograph',
      'preserve the strongest relative positions, intervals, and direction',
      'retain the photograph\'s actual tonal hierarchy and negative space',
    ],
    structuralAxes: ['use only structural axes visibly supported by the uploaded photograph'],
    movementDirection: 'follow the clearest observed direction without inventing motion',
    spatialRhythm: 'derive intervals and pauses directly from the uploaded photograph',
    tonalHierarchy: 'retain the observed dark, middle, and light roles',
    negativeSpace: 'preserve the source photograph\'s observed open areas',
    colorRoles: {
      dominant: 'the dominant muted color observed in the photograph',
      dark: 'the darkest structural color observed in the photograph',
      light: 'the lightest neutral color observed in the photograph',
      accents: [],
    },
    suggestedTitle: 'Observed Intervals',
    safetyNotes: [],
    imageUrl,
    source: 'fallback',
  }
}

function normalizeAnalysis(value, imageUrl) {
  const fallback = fallbackPhotoAbstractAnalysis(imageUrl)
  const colorRoles = value?.colorRoles && typeof value.colorRoles === 'object'
    ? value.colorRoles
    : {}

  return {
    orientation: normalizeOrientation(value?.orientation),
    subjectType: normalizeSubjectType(value?.subjectType),
    spatialFacts: normalizeList(value?.spatialFacts, fallback.spatialFacts, 6),
    structuralAxes: normalizeList(value?.structuralAxes, fallback.structuralAxes, 3),
    movementDirection: normalizeText(value?.movementDirection, fallback.movementDirection),
    spatialRhythm: normalizeText(value?.spatialRhythm, fallback.spatialRhythm),
    tonalHierarchy: normalizeText(value?.tonalHierarchy, fallback.tonalHierarchy),
    negativeSpace: normalizeText(value?.negativeSpace, fallback.negativeSpace),
    colorRoles: {
      dominant: normalizeText(colorRoles.dominant, fallback.colorRoles.dominant),
      dark: normalizeText(colorRoles.dark, fallback.colorRoles.dark),
      light: normalizeText(colorRoles.light, fallback.colorRoles.light),
      accents: normalizeList(colorRoles.accents, [], 2),
    },
    suggestedTitle: normalizeTitle(value?.suggestedTitle),
    safetyNotes: normalizeList(value?.safetyNotes, [], 5),
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

function subjectGuidance(subjectType) {
  if (subjectType === 'portrait' || subjectType === 'crowd') {
    return 'For people, use continuous, irregular short vertical marks or gently tapered blocks; never draw separate heads, limbs, faces, or clothing.'
  }
  if (subjectType === 'architecture') {
    return 'For landmark architecture, retain at most one to three identity cues and omit windows, masonry, railings, ornament, and surface detail.'
  }
  if (subjectType === 'organic-group') {
    return 'For organic groups, use a compact set of overlapping soft masses to express gathering, rising, or dispersing without realistic highlights or interior detail.'
  }
  if (subjectType === 'landscape') {
    return 'For landscape, water, horizons, or roads, retain direction, density, intervals, hierarchy, and at most one or two fine structural axes; discard complete object outlines.'
  }
  if (subjectType === 'object') {
    return 'For representative objects, keep only two or three planar marks and establish recognition through scale and position without realistic volume or material detail.'
  }
  return 'For the observed scene, preserve relationships first and discard contours, surface texture, background noise, and low-information ornament.'
}

function photoPanelProportion(orientation, subjectType) {
  if (orientation === 'landscape') {
    return 'Use the photograph for about 38%–52% of the final height and the panel for about 48%–62%.'
  }
  if (orientation === 'portrait' || subjectType === 'portrait' || subjectType === 'architecture') {
    return 'Use the photograph for about 55%–68% of the final height and the panel for about 32%–45%.'
  }
  return 'Use the photograph for about 48%–58% of the final height and the panel for about 42%–52%; adjust modestly to protect the complete subject.'
}

export function isPhotoAbstractPosterTool(toolSlug) {
  return normalizeText(toolSlug) === PHOTO_ABSTRACT_TOOL_SLUG
}

export async function analyzePhotoAbstractReferenceImage({
  imageUrl,
  env = {},
  fetchImpl = fetch,
} = {}) {
  const apiKey = env.PHOTO_ABSTRACT_OPENAI_API_KEY || env.OPENAI_API_KEY || ''
  if (!apiKey || !/^https?:\/\//i.test(String(imageUrl || ''))) {
    return fallbackPhotoAbstractAnalysis(imageUrl)
  }

  const model = env.PHOTO_ABSTRACT_VISION_MODEL || env.MEDIA_LIBRARY_VISION_MODEL || 'gpt-5'

  try {
    const response = await fetchImpl('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: [{
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                'Analyze the uploaded photograph only for a restrained photo-derived abstract editorial diptych.',
                'Return observable visual facts, not identities, stories, brands, copyrighted characters, or invented content.',
                'Identify three to six decisive spatial facts, structural axes, direction, rhythm, tonal hierarchy, negative space, muted color roles, and one grounded two-to-five-word English title.',
              ].join(' '),
            },
            { type: 'input_image', image_url: imageUrl },
          ],
        }],
        text: {
          format: {
            type: 'json_schema',
            name: 'photo_abstract_editorial_analysis',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: [
                'orientation',
                'subjectType',
                'spatialFacts',
                'structuralAxes',
                'movementDirection',
                'spatialRhythm',
                'tonalHierarchy',
                'negativeSpace',
                'colorRoles',
                'suggestedTitle',
                'safetyNotes',
              ],
              properties: {
                orientation: { type: 'string', enum: ['landscape', 'portrait', 'square', 'unknown'] },
                subjectType: {
                  type: 'string',
                  enum: [...SUBJECT_TYPES],
                },
                spatialFacts: {
                  type: 'array',
                  items: { type: 'string' },
                  minItems: 3,
                  maxItems: 6,
                },
                structuralAxes: {
                  type: 'array',
                  items: { type: 'string' },
                  maxItems: 3,
                },
                movementDirection: { type: 'string' },
                spatialRhythm: { type: 'string' },
                tonalHierarchy: { type: 'string' },
                negativeSpace: { type: 'string' },
                colorRoles: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['dominant', 'dark', 'light', 'accents'],
                  properties: {
                    dominant: { type: 'string' },
                    dark: { type: 'string' },
                    light: { type: 'string' },
                    accents: {
                      type: 'array',
                      items: { type: 'string' },
                      maxItems: 2,
                    },
                  },
                },
                suggestedTitle: { type: 'string' },
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

    if (!response.ok) return fallbackPhotoAbstractAnalysis(imageUrl)
    return normalizeAnalysis(JSON.parse(extractOpenAIResponseText(await response.json())), imageUrl)
  } catch {
    return fallbackPhotoAbstractAnalysis(imageUrl)
  }
}

export function compilePhotoAbstractPrompt(analysis = {}) {
  const normalized = normalizeAnalysis(analysis, analysis?.imageUrl)
  const facts = normalized.spatialFacts.map((fact, index) => `${index + 1}. ${fact}`).join(' ')
  const axes = normalized.structuralAxes.join('; ')
  const accents = normalized.colorRoles.accents.length
    ? normalized.colorRoles.accents.join(', ')
    : 'no extra accent unless one is visibly present'

  return [
    `Treat the uploaded image strictly as the sole content source. Create one complete vertical editorial diptych made of an original-photo area above and a restrained abstract memory panel below. Preserve the uploaded photograph faithfully: keep its subjects, people, architecture, light, colors, spatial relationships, and photographic character. Permit only proportional scaling or a slight crop needed for the join. Do not redraw, replace, extend, retouch, filter, embellish, outpaint, or otherwise alter the photograph.`,
    `Internally follow DECONSTRUCT → SELECTIVE PRESERVATION → ABSTRACT / DISTILL → RECONSTRUCT. Base the abstraction on these observed facts: ${facts} Structural axes: ${axes}. Movement direction: ${normalized.movementDirection}. Spatial rhythm: ${normalized.spatialRhythm}. Tonal hierarchy: ${normalized.tonalHierarchy}. Negative space: ${normalized.negativeSpace}. Reconstruct relationships rather than silhouettes; do not create a thumbnail, tracing, posterized photograph, vector icon, complete illustration, or style transfer. ${subjectGuidance(normalized.subjectType)}`,
    `Join the two sections directly. ${photoPanelProportion(normalized.orientation, normalized.subjectType)} Preserve the photograph's aspect ratio and complete subject; do not force equal halves. Use a completely flat, continuous, untextured neutral ivory lower panel in #F3F0E8 or a harmonious color from the same family. Keep about 65%–80% clean whitespace. Place a restrained motif in the lower-middle, center, or an asymmetrical position supported by the source. Use one primary mark family and no more than two supporting mark families. Use no frame, shadow, collage, tape, or mockup effect; also exclude torn-paper edges and dimensional cards.`,
    `Extract the muted palette only from the original photograph: dominant role ${normalized.colorRoles.dominant}; dark structural role ${normalized.colorRoles.dark}; light neutral role ${normalized.colorRoles.light}; accents ${accents}. Lower saturation and reduce the number of colors. Every mark and color must correspond to a visible fact; do not invent decorative colors, symbols, objects, symmetry, gradients, grain, paper texture, glow, haze, stains, scan noise, or lighting effects.`,
    `Render exactly one original title, "${normalized.suggestedTitle}", using two to five English words in a restrained editorial serif. Place it only on the ivory panel, lower-left or bottom-centered according to balance, never in the photograph, inside the motif, at the lower right, or on the edge. A three-to-seven-word subtitle is optional only if it adds meaning. Do not add labels, dates, title options, explanatory copy, logos, signatures, or watermarks. Return only one finished work with no commentary or analysis.`,
  ].join('\n\n')
}

export async function compilePhotoAbstractPromptFromImage({
  imageUrl,
  env = {},
  fetchImpl = fetch,
} = {}) {
  const analysis = await analyzePhotoAbstractReferenceImage({ imageUrl, env, fetchImpl })
  return {
    analysis,
    prompt: compilePhotoAbstractPrompt(analysis),
  }
}
