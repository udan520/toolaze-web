/**
 * Homepage section "More AI-Powered Creative Tools" (#advanced-ai-tools): card thumbnails.
 * Use the same visual as each tool’s landing demo (template / sample), not emoji.
 *
 * Asset rules: see .cursorrules **HOMEPAGE ADVANCED AI TOOL CARDS**.
 * Source files can be prepared locally, but homepage should consume uploaded R2 URLs.
 */
export const HOME_ADVANCED_AI_CARD_IMAGES = {
  'world-cup-ai-image-generator': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/uploads/d67aebd7cde5431abd3a7bb74a89bac1.webp',
    width: 358,
    height: 357,
    alt: 'World Cup AI Image Generator — football fan poster template preview',
  },
  'ai-couple-photo-maker': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/ai-couple-photo-maker.jpg',
    width: 800,
    height: 600,
    alt: 'AI Couple Photo Maker — sample romantic scene template preview',
  },
  /** L2 has no static hero image; matches /ai-tools and marketing sample (portrait with watermark use-case). */
  'watermark-remover': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/watermark-remover.jpg',
    width: 533,
    height: 800,
    alt: 'Sample photo for AI watermark removal preview',
  },
  /** Same source as PhotoRestoration.tsx DEMO_IMAGE_URL (optimized local file). */
  'photo-restoration': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-advanced-ai/photo-restoration.jpg',
    width: 800,
    height: 533,
    alt: 'Photo restoration — before and after style sample preview',
  },
} as const

export type HomeAdvancedAiCardToolId = keyof typeof HOME_ADVANCED_AI_CARD_IMAGES

export function getHomeAdvancedAiCardImage(toolId: string) {
  return HOME_ADVANCED_AI_CARD_IMAGES[toolId as HomeAdvancedAiCardToolId]
}
