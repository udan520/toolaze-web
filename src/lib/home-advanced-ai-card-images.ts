/**
 * Homepage section "More AI-Powered Creative Tools" (#advanced-ai-tools): card thumbnails.
 * Use the same visual as each tool’s landing demo (template / sample), not emoji.
 *
 * Asset rules: see .cursorrules **HOMEPAGE ADVANCED AI TOOL CARDS**.
 * Source files can be prepared locally, but homepage should consume uploaded R2 URLs.
 */
export const HOME_ADVANCED_AI_CARD_IMAGES = {
  'unrestricted-ai-image-generator': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/unrestricted-ai-image-generator/pool-bikini-demo.webp',
    width: 512,
    height: 512,
    alt: 'Unrestricted / Unlimited AI Image Generator flexible creative image preview',
  },
  'world-cup-ai-image-generator': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
    width: 358,
    height: 357,
    alt: 'World Cup AI Image Generator — football fan poster template preview',
  },
  'ai-hair-color-changer': {
    src: '/ai-hair-color-changer/rose-pink-before-after.webp',
    width: 1200,
    height: 450,
    alt: 'AI Hair Color Changer rose pink before and after preview',
  },
  'ai-clothes-changer': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/84b9bf50f4414a2c962ebd3f74cb07f0.webp',
    width: 1600,
    height: 900,
    alt: 'AI Clothes Changer before and after outfit preview',
  },
  'ai-bikini-generator': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/6bcf91ffd06e45a8bcda2ea867015141.webp',
    width: 1600,
    height: 900,
    alt: 'AI Bikini Generator normal outfit to bikini before and after preview',
  },
  'ai-breast-expansion': {
    src: '/ai-breast-expansion/demo-before-after.webp',
    width: 1200,
    height: 675,
    alt: 'AI Breast Expansion before and after demo preview',
  },
  'ai-baby-generator': {
    src: '/ai-baby-generator/hero-baby-portrait.webp',
    width: 1200,
    height: 1600,
    alt: 'AI Baby Generator cute baby portrait preview',
  },
  'ai-couple-photo-maker': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/ai-couple-photo-maker.jpg',
    width: 800,
    height: 600,
    alt: 'AI Couple Photo Maker — sample romantic scene template preview',
  },
  /** L2 has no static hero image; matches /ai-tools and marketing sample (portrait with watermark use-case). */
  'watermark-remover': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover-demo-before-after.webp',
    width: 1200,
    height: 675,
    alt: 'Watermark Remover before and after demo preview',
  },
  /** Same source as the Photo Restoration page demo. */
  'photo-restoration': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/photo-restoration-demo-before-after.webp',
    width: 1200,
    height: 675,
    alt: 'Photo restoration — before and after style sample preview',
  },
} as const

export type HomeAdvancedAiCardToolId = keyof typeof HOME_ADVANCED_AI_CARD_IMAGES

export function getHomeAdvancedAiCardImage(toolId: string) {
  return HOME_ADVANCED_AI_CARD_IMAGES[toolId as HomeAdvancedAiCardToolId]
}
