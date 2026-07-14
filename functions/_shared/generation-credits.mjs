const BASE_CREDITS = {
  'gpt-image-2': 10,
  'nano-banana-2': 10,
  'seedream-4.5': 10,
  'seedream-4-5': 10,
  'seedream-5-0-lite': 10,
  'seedream-5-0-pro': 10,
  'wan-2-7-image': 10,
  'nano-banana-pro': 20,
};

const RESOLUTION_MULTIPLIER = {
  '2K': 1.5,
  '4K': 2,
};

export function calculateImageGenerationCredits(modelId, resolution) {
  const normalizedModel = String(modelId || 'nano-banana-pro').trim();
  const normalizedResolution = String(resolution || '1K').trim().toUpperCase();

  if (normalizedModel === 'seedream-5-0-pro') {
    return normalizedResolution === '2K' ? 20 : 10;
  }

  const baseCredits = BASE_CREDITS[normalizedModel] || BASE_CREDITS['nano-banana-pro'];
  const multiplier = RESOLUTION_MULTIPLIER[normalizedResolution] || 1;
  return Math.ceil(baseCredits * multiplier);
}
