export type ModelDemoImageId =
  | 'nano-banana-pro'
  | 'nano-banana-2'
  | 'gpt-image-2'
  | 'seedream-4-5'
  | 'seedream-5-0-lite'
  | 'seedream-5-0-pro'
  | 'wan-2-7-image'

type ModelDemoImage = {
  src: string
  width: number
  height: number
  alt: string
}

export const MODEL_DEMO_IMAGES: Record<ModelDemoImageId, ModelDemoImage> = {
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
    src: '/model-assets/gpt-image-2/prompt-product-poster.webp',
    width: 1280,
    height: 960,
    alt: 'GPT Image 2 product poster sample output preview',
  },
  'seedream-4-5': {
    src: '/model-assets/seedream-4-5/gallery-ecommerce-product.webp',
    width: 1280,
    height: 960,
    alt: 'Seedream 4.5 commercial image generation preview',
  },
  'seedream-5-0-lite': {
    src: 'https://pub-efeb0c7b9b53478d960218de80c52e3d.r2.dev/model-assets/seedream-5-0-lite/gallery-search-grounded-product.webp',
    width: 1280,
    height: 960,
    alt: 'Seedream 5.0 Lite search grounded product image preview',
  },
  'seedream-5-0-pro': {
    src: '/model-assets/seedream-5-0-pro/gallery-ad-campaign.webp',
    width: 1200,
    height: 900,
    alt: 'Seedream 5.0 Pro cinematic campaign image preview',
  },
  'wan-2-7-image': {
    src: '/model-assets/wan-2-7-image/gallery-event-poster.webp',
    width: 960,
    height: 720,
    alt: 'Wan 2.7 Image structured poster and text layout preview',
  },
}

export function getModelDemoImage(modelId: string): ModelDemoImage {
  return MODEL_DEMO_IMAGES[modelId as ModelDemoImageId] || MODEL_DEMO_IMAGES['nano-banana-pro']
}

export function shouldUseDirectImageForDemo(src: string): boolean {
  return Boolean(src)
}
