import assert from 'node:assert/strict'
import test from 'node:test'

import {
  analyzeZineReferenceImage,
  compileZinePosterPrompt,
  selectZinePosterRecipe,
} from './zine-poster-compiler.mjs'

test('zine poster compiler builds a four-paragraph skill prompt from analysis and recipe', () => {
  const recipe = selectZinePosterRecipe({
    imageUrl: 'https://example.com/seaside-reference.webp',
    subjectType: 'landscape',
    mainSubject: 'quiet sea cliffs and blue water',
  })

  const prompt = compileZinePosterPrompt({
    analysis: {
      subjectType: 'landscape',
      mainSubject: 'quiet sea cliffs and blue water',
      visualFragment: 'a narrow horizon strip with rock formations',
      moodHints: ['seaside', 'quiet', 'memory'],
      dominantColors: ['sand beige', 'pale blue', 'stone gray'],
      suggestedShortText: 'quiet is enough.',
    },
    recipe,
  })

  const paragraphs = prompt.split(/\n{2,}/)
  assert.equal(paragraphs.length, 4)
  assert.match(paragraphs[0], /70% to 90%/)
  assert.match(paragraphs[0], /visual cluster/i)
  assert.doesNotMatch(paragraphs[0], /tall vertical|3:5|selected output frame/i)
  assert.match(paragraphs[1], /quiet sea cliffs and blue water/i)
  assert.match(paragraphs[2], new RegExp(recipe.accentColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
  assert.match(paragraphs[2], /0\.8% to 2\.5%/)
  assert.match(paragraphs[3], /Avoid full-bleed/i)
})

test('zine poster analyzer calls OpenAI vision and normalizes structured output', async () => {
  let requestBody = null
  const analysis = await analyzeZineReferenceImage({
    imageUrl: 'https://example.com/reference.webp',
    env: { OPENAI_API_KEY: 'openai-test-key', ZINE_POSTER_VISION_MODEL: 'gpt-test-vision' },
    fetchImpl: async (url, init) => {
      assert.equal(String(url), 'https://api.openai.com/v1/responses')
      requestBody = JSON.parse(String(init.body))
      return Response.json({
        output: [
          {
            content: [
              {
                type: 'output_text',
                text: JSON.stringify({
                  subjectType: 'landscape',
                  mainSubject: 'sea cliffs',
                  visualFragment: 'blue water between pale stone cliffs',
                  moodHints: ['seaside', 'quiet'],
                  dominantColors: ['blue', 'sand'],
                  suggestedShortText: 'quiet is enough.',
                  safetyNotes: [],
                }),
              },
            ],
          },
        ],
      })
    },
  })

  assert.equal(requestBody.model, 'gpt-test-vision')
  assert.equal(requestBody.input[0].content[1].type, 'input_image')
  assert.equal(requestBody.input[0].content[1].image_url, 'https://example.com/reference.webp')
  assert.equal(analysis.mainSubject, 'sea cliffs')
  assert.deepEqual(analysis.moodHints, ['seaside', 'quiet'])
  assert.equal(analysis.suggestedShortText, 'quiet is enough.')
})
