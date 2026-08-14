import assert from 'node:assert/strict'
import test from 'node:test'
import { AI_TOOLS_LOCALES, getAiToolsPageCopy } from './copy'

const expectedRoutes = [
  '/unrestricted-ai-image-generator',
  '/world-cup-ai-image-generator',
  '/ai-zine-poster-generator',
  '/ai-photo-abstract-poster-generator',
  '/ai-couple-photo-maker',
  '/ai-baby-generator',
  '/ai-dance-generator',
  '/ai-kissing-video-generator',
  '/talking-avatar-creator',
  '/ai-hairstyle-changer',
  '/age-filter',
  '/buzz-cut-filter',
  '/bald-filter',
  '/bangs-filter',
  '/perm-filter',
  '/ai-hair-color-changer',
  '/ai-clothes-changer',
  '/ai-bikini-generator',
  '/ai-breast-expansion',
  '/ai-asmr-video-generator',
  '/model/kling-2-6-pro-motion-control',
  '/model/wan-2-7-ai-video-generator',
  '/watermark-remover',
  '/photo-restoration',
]

const excludedNonToolRoutes = [
  '/ai-image-generator',
  '/text-to-image-generator',
  '/ai-image-to-image-generator',
  '/ai-video-generator',
  '/text-to-video-generator',
  '/image-to-video-generator',
  '/model/wan-2-5-ai-video-generator',
]

const hairstyleDemoImage = '/ai-hairstyle-changer/hero-before-after.webp?v=20260711-no-divider-label-padding'

test('AI Tools hub includes every global AI tool in every locale', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const cards = getAiToolsPageCopy(locale).cards
    assert.deepEqual(cards.map((card) => card.href), expectedRoutes, `${locale} has missing or mismatched tools`)
    assert.equal(cards.filter((card) => card.category === 'image').length, 18)
    assert.equal(cards.filter((card) => card.category === 'video').length, 6)
  }
})

test('AI Age Filter hub cards are localized and reuse the hero demo image', () => {
  const demoImage = 'https://assets.toolaze.com/uploads/02d85340f9614a4c8bb0a10595fae49f.webp'
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/age-filter')

  assert.ok(englishCard, 'English AI Tools hub should include AI Age Filter')
  assert.equal(englishCard.image, demoImage)
  assert.equal(englishCard.category, 'image')

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/age-filter')
    assert.ok(localizedCard, `${locale} AI Tools hub should include AI Age Filter`)
    assert.equal(localizedCard.image, demoImage)
    assert.notEqual(localizedCard.title, englishCard.title, `${locale} title should not fall back to English`)
    assert.notEqual(
      localizedCard.description,
      englishCard.description,
      `${locale} description should not fall back to English`,
    )
  }
})

test('AI Hairstyle Changer hub cards use the current page demo image', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const hairstyleCard = getAiToolsPageCopy(locale).cards.find(
      (card) => card.href === '/ai-hairstyle-changer',
    )

    assert.ok(hairstyleCard, `${locale} is missing AI Hairstyle Changer`)
    assert.equal(hairstyleCard.image, hairstyleDemoImage)
  }
})

test('P0 hairstyle filter hub cards are localized and use page demo images', () => {
  const expectedImages = {
    '/bald-filter': 'https://assets.toolaze.com/model-assets/bald-filter/bald-filter-before-after-demo.webp',
    '/bangs-filter': 'https://assets.toolaze.com/model-assets/bangs-filter/bangs-filter-blunt-bangs-before-after-demo.webp',
    '/perm-filter': 'https://assets.toolaze.com/model-assets/perm-filter/perm-filter-before-after-demo.webp',
  }

  for (const [href, image] of Object.entries(expectedImages)) {
    const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === href)
    assert.ok(englishCard, `English AI Tools hub should include ${href}`)
    assert.equal(englishCard.image, image)
    assert.equal(englishCard.category, 'image')

    for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
      const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === href)

      assert.ok(localizedCard, `${locale} AI Tools hub should include ${href}`)
      assert.equal(localizedCard.image, image)
      assert.notEqual(localizedCard.title, englishCard.title, `${locale} ${href} title should not fall back to English`)
      assert.notEqual(
        localizedCard.description,
        englishCard.description,
        `${locale} ${href} description should not fall back to English`,
      )
    }
  }
})

test('AI Tools hub lists Motion Control as a localized video tool', () => {
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/model/kling-2-6-pro-motion-control')

  assert.ok(englishCard, 'English AI Tools hub should include Motion Control')
  assert.equal(englishCard.category, 'video')
  assert.match(englishCard.title, /Motion Control/)
  assert.match(englishCard.description, /character image/i)
  assert.match(englishCard.description, /motion reference video/i)
  assert.equal(englishCard.image, 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo-poster.webp')
  assert.equal(englishCard.video, 'https://assets.toolaze.com/model-assets/kling-2-6-pro-motion-control/motion-control-demo.mp4')

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/model/kling-2-6-pro-motion-control')

    assert.ok(localizedCard, `${locale} AI Tools hub should include Motion Control`)
    assert.equal(localizedCard.category, 'video')
    assert.notEqual(localizedCard.title, englishCard.title, `${locale} Motion Control title should be localized`)
    assert.notEqual(localizedCard.description, englishCard.description, `${locale} Motion Control description should be localized`)
  }
})

test('AI Tools hub excludes generic generators and non-featured model entry points', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const routes = getAiToolsPageCopy(locale).cards.map((card) => card.href)

    for (const route of excludedNonToolRoutes) {
      assert.ok(!routes.includes(route), `${locale} should not list ${route} as an AI tool`)
    }
  }
})

test('AI Tools hub exposes localized category labels', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const filters = getAiToolsPageCopy(locale).filters
    assert.ok(filters.all)
    assert.ok(filters.image)
    assert.ok(filters.video)
  }
})

test('Photo Restoration cards use the shared page demo image instead of the old stock photo', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const restorationCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/photo-restoration')

    assert.ok(restorationCard, `${locale} is missing Photo Restoration`)
    assert.equal(restorationCard.image, 'https://assets.toolaze.com/home-advanced-ai/photo-restoration-demo-before-after.webp')
    assert.doesNotMatch(restorationCard.image, /images.unsplash.com/)
  }
})

test('Watermark Remover cards use the shared page demo image instead of the old stock photo', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const watermarkCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/watermark-remover')

    assert.ok(watermarkCard, `${locale} is missing Watermark Remover`)
    assert.equal(watermarkCard.image, 'https://assets.toolaze.com/home-advanced-ai/watermark-remover-demo-before-after.webp')
    assert.doesNotMatch(watermarkCard.image, /images.unsplash.com/)
  }
})

test('AI Clothes Changer hub card is localized outside English', () => {
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/ai-clothes-changer')
  assert.ok(englishCard)

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/ai-clothes-changer')

    assert.ok(localizedCard, `${locale} is missing the AI Clothes Changer hub card`)
    assert.notEqual(localizedCard.title, englishCard.title, `${locale} title should not fall back to English`)
    assert.notEqual(
      localizedCard.description,
      englishCard.description,
      `${locale} description should not fall back to English`,
    )
  }
})

test('AI Bikini Generator hub card is localized outside English', () => {
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/ai-bikini-generator')
  assert.ok(englishCard)
  assert.equal(englishCard.image, 'https://assets.toolaze.com/uploads/6bcf91ffd06e45a8bcda2ea867015141.webp')

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/ai-bikini-generator')

    assert.ok(localizedCard, `${locale} is missing the AI Bikini Generator hub card`)
    assert.notEqual(localizedCard.title, englishCard.title, `${locale} title should not fall back to English`)
    assert.notEqual(
      localizedCard.description,
      englishCard.description,
      `${locale} description should not fall back to English`,
    )
  }
})

test('Unrestricted AI Image Generator hub card is localized and keeps unlimited keyword coverage', () => {
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/unrestricted-ai-image-generator')
  assert.ok(englishCard)
  assert.match(englishCard.title, /Unlimited/)
  assert.match(englishCard.description, /unlimited-style/)

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/unrestricted-ai-image-generator')

    assert.ok(localizedCard, `${locale} is missing the Unrestricted AI Image Generator hub card`)
    assert.match(localizedCard.title, /Unrestricted|Unlimited/, `${locale} title should keep the SEO entry keyword`)
    assert.match(localizedCard.description, /unlimited-style/, `${locale} description should keep unlimited-style coverage`)
    assert.notEqual(
      localizedCard.description,
      englishCard.description,
      `${locale} description should not fall back to English`,
    )
  }
})

test('AI Zine Poster Generator hub card is localized and uses the page demo image', () => {
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/ai-zine-poster-generator')
  assert.ok(englishCard)
  assert.equal(
    englishCard.image,
    'https://assets.toolaze.com/model-assets/ai-zine-poster-generator/zine-poster-demo.webp',
  )

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/ai-zine-poster-generator')

    assert.ok(localizedCard, `${locale} is missing the AI Zine Poster Generator hub card`)
    assert.equal(localizedCard.category, 'image')
    assert.notEqual(localizedCard.title, englishCard.title, `${locale} title should not fall back to English`)
    assert.notEqual(
      localizedCard.description,
      englishCard.description,
      `${locale} description should not fall back to English`,
    )
  }
})

test('Photo Abstract Poster Generator hub card is localized and uses the page demo image', () => {
  const englishCard = getAiToolsPageCopy('en').cards.find((card) => card.href === '/ai-photo-abstract-poster-generator')
  assert.ok(englishCard)
  assert.equal(
    englishCard.image,
    '/model-assets/ai-photo-abstract-poster-generator/photo-abstract-poster-demo.webp',
  )
  assert.equal(englishCard.category, 'image')
  assert.doesNotMatch(englishCard.description, /GPT Image|gpt-image-2|image-to-image/i)

  for (const locale of AI_TOOLS_LOCALES.filter((locale) => locale !== 'en')) {
    const localizedCard = getAiToolsPageCopy(locale).cards.find(
      (card) => card.href === '/ai-photo-abstract-poster-generator',
    )

    assert.ok(localizedCard, `${locale} is missing the Photo Abstract Poster Generator hub card`)
    assert.equal(localizedCard.category, 'image')
    assert.notEqual(localizedCard.title, englishCard.title, `${locale} title should not fall back to English`)
    assert.notEqual(
      localizedCard.description,
      englishCard.description,
      `${locale} description should not fall back to English`,
    )
  }
})

test('AI Talking Avatar hub card uses the shared R2 demo poster', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const talkingAvatarCard = getAiToolsPageCopy(locale).cards.find((card) => card.href === '/talking-avatar-creator')

    assert.ok(talkingAvatarCard, `${locale} is missing AI Talking Avatar`)
    assert.equal(
      talkingAvatarCard.image,
      'https://assets.toolaze.com/landing-pages/talking-avatar-creator/demo-poster.webp',
    )
    assert.doesNotMatch(talkingAvatarCard.image, /^\/ai-image-generator\//)
  }
})

test('AI Tools video category cards provide real video previews', () => {
  for (const locale of AI_TOOLS_LOCALES) {
    const videoCards = getAiToolsPageCopy(locale).cards.filter((card) => card.category === 'video')

    assert.equal(videoCards.length, 6)
    for (const card of videoCards) {
      assert.ok(card.video, `${locale} ${card.href} should provide a video preview`)
      assert.match(card.video, /^(https:\/\/assets\.toolaze\.com\/|\/model-assets\/)/)
      assert.ok(card.image, `${locale} ${card.href} should keep a poster image`)
    }
  }
})
