import assert from 'node:assert/strict'
import test from 'node:test'

import {
  analyzePhotoAbstractReferenceImage,
  compilePhotoAbstractPrompt,
  compilePhotoAbstractPromptFromImage,
  isPhotoAbstractPosterTool,
} from './photo-abstract-editorial-compiler.mjs'

test('photo abstract compiler matches only the existing Photo Abstract tool', () => {
  assert.equal(isPhotoAbstractPosterTool('ai-photo-abstract-poster-generator'), true)
  assert.equal(isPhotoAbstractPosterTool('ai-zine-poster-generator'), false)
  assert.equal(isPhotoAbstractPosterTool(''), false)
})

test('photo abstract analyzer requests strict visual facts and normalizes them', async () => {
  let requestBody = null
  const analysis = await analyzePhotoAbstractReferenceImage({
    imageUrl: 'https://example.com/reference.webp',
    env: {
      OPENAI_API_KEY: 'openai-test-key',
      PHOTO_ABSTRACT_VISION_MODEL: 'gpt-photo-vision',
    },
    fetchImpl: async (url, init) => {
      assert.equal(String(url), 'https://api.openai.com/v1/responses')
      requestBody = JSON.parse(String(init.body))
      return Response.json({
        output: [{
          content: [{
            type: 'output_text',
            text: JSON.stringify({
              orientation: 'landscape',
              subjectType: 'landscape',
              spatialFacts: [
                'a low horizon crosses the upper third',
                'two dark cliffs frame pale water',
                'the brightest opening sits right of center',
              ],
              structuralAxes: ['low horizontal horizon'],
              movementDirection: 'left to right toward open water',
              spatialRhythm: 'two dense masses separated by a wide pause',
              tonalHierarchy: 'dark stone, pale sky, bright water opening',
              negativeSpace: 'open sky and water between the cliffs',
              colorRoles: {
                dominant: 'muted sea blue',
                dark: 'charcoal stone',
                light: 'warm cloud white',
                accents: ['rust brown'],
              },
              suggestedTitle: 'Between Quiet Cliffs',
              safetyNotes: [],
            }),
          }],
        }],
      })
    },
  })

  assert.equal(requestBody.model, 'gpt-photo-vision')
  assert.equal(requestBody.input[0].content[1].type, 'input_image')
  assert.equal(requestBody.input[0].content[1].image_url, 'https://example.com/reference.webp')
  assert.equal(requestBody.text.format.type, 'json_schema')
  assert.equal(requestBody.text.format.strict, true)
  assert.equal(requestBody.text.format.schema.properties.spatialFacts.minItems, 3)
  assert.equal(requestBody.text.format.schema.properties.spatialFacts.maxItems, 6)
  assert.equal(analysis.orientation, 'landscape')
  assert.equal(analysis.spatialFacts.length, 3)
  assert.equal(analysis.suggestedTitle, 'Between Quiet Cliffs')
})

test('photo abstract compiler preserves the original photo and applies the full editorial system', () => {
  const prompt = compilePhotoAbstractPrompt({
    imageUrl: 'https://example.com/reference.webp',
    orientation: 'portrait',
    subjectType: 'crowd',
    spatialFacts: [
      'three people form an uneven diagonal group',
      'the tallest figure stands left of center',
      'warm light opens behind the group',
    ],
    structuralAxes: ['a gentle rising diagonal'],
    movementDirection: 'lower left to upper right',
    spatialRhythm: 'three close marks followed by a wide pause',
    tonalHierarchy: 'dark figures against a pale background',
    negativeSpace: 'open light above and to the right',
    colorRoles: {
      dominant: 'muted sand beige',
      dark: 'deep blue-gray',
      light: 'warm ivory',
      accents: ['rust red'],
    },
    suggestedTitle: 'Light Between Us',
  })

  assert.match(prompt, /sole content source/i)
  assert.match(prompt, /preserve the uploaded photograph/i)
  assert.match(prompt, /do not redraw, replace, extend, retouch/i)
  assert.match(prompt, /vertical editorial diptych/i)
  assert.match(prompt, /#F3F0E8/i)
  assert.match(prompt, /65%–80%|65-80%/i)
  assert.match(prompt, /one primary mark family/i)
  assert.match(prompt, /no more than two supporting/i)
  assert.match(prompt, /only from the original photograph/i)
  assert.match(prompt, /continuous, irregular short vertical/i)
  assert.match(prompt, /two to five English words/i)
  assert.match(prompt, /Light Between Us/)
  assert.match(prompt, /no frame, shadow, collage, tape, or mockup/i)
  assert.match(prompt, /Return only one finished work/i)
})

test('photo abstract compiler uses the same deterministic fallback without vision access', async () => {
  const first = await compilePhotoAbstractPromptFromImage({
    imageUrl: 'https://example.com/reference.webp',
    env: {},
  })
  const second = await compilePhotoAbstractPromptFromImage({
    imageUrl: 'https://example.com/reference.webp',
    env: {},
  })

  assert.equal(first.analysis.source, 'fallback')
  assert.equal(first.prompt, second.prompt)
  assert.match(first.prompt, /three to six observable spatial facts/i)
  assert.doesNotMatch(first.prompt, /sea cliffs|specific person|specific building/i)
})
