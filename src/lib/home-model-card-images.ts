/**
 * Homepage sections: AI Video Generator, AI Image Generator, Trending models (#ai-video-generator,
 * #ai-image-generator, #trending-models). Card thumbnails = same samples as each image model’s
 * `NanoBananaTool` `SAMPLE_IMAGES` (R2 URLs), re-exported to dedicated R2 card paths.
 *
 * Video L2 pages (`SeedanceHeroPlaceholder` / `KlingHeroPlaceholder`) only show emoji placeholders
 * today; cards use curated cinema stills until an on-page video preview exists. Replace
 * `seedance-2.jpg` / `kling-3.jpg` when real demos ship.
 *
 * Asset rules: same as **HOMEPAGE ADVANCED AI TOOL CARDS** — long edge ≤800px, target ≈≤100KB.
 * Final delivery path should use R2 public URLs (not local public assets).
 * Paths must stay in sync with `HOME_MODEL_CARD_IMAGES` in `scripts/admin-seo-server.js`.
 */
export const HOME_MODEL_CARD_IMAGES = {
  'nano-banana-pro': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/nano-banana-pro.jpg',
    width: 800,
    height: 597,
    alt: 'Nano Banana Pro sample output preview',
  },
  'nano-banana-2': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/nano-banana-2.jpg',
    width: 800,
    height: 597,
    alt: 'Nano Banana 2 sample output preview',
  },
  'gpt-image-2': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/gpt-image-2.jpg',
    width: 800,
    height: 600,
    alt: 'GPT Image 2 sample output preview',
  },
  'seedream-4-5': {
    src: '/model-assets/seedream-4-5/gallery-ecommerce-product.webp',
    width: 1280,
    height: 960,
    alt: 'Seedream 4.5 commercial image generation preview',
  },
  'seedance-2': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/seedance-2.jpg',
    width: 800,
    height: 540,
    alt: 'AI video — cinematic scene preview for Seedance 2.0',
  },
  'kling-3': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/home-model-cards/kling-3.jpg',
    width: 800,
    height: 640,
    alt: 'AI video — cinematic still preview for Kling 3.0',
  },
} as const

export type HomeModelCardToolId = keyof typeof HOME_MODEL_CARD_IMAGES

export function getHomeModelCardImage(toolId: string) {
  return HOME_MODEL_CARD_IMAGES[toolId as HomeModelCardToolId]
}
