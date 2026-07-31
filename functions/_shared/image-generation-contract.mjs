export const SUPPORTED_IMAGE_GENERATION_MODEL_IDS = Object.freeze([
  'nano-banana-pro',
  'nano-banana-2',
  'nano-banana-2-lite',
  'gpt-image-2',
  'gpt-image-1-5',
  'grok-1-5-image',
  'grok-video-1-5',
  'seedream-4-5',
  'seedream-5-0-lite',
  'seedream-5-0-pro',
  'wan-2-7-image',
  'flux-2-pro',
  'flux-2-flex',
]);

function hashContract(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export const IMAGE_GENERATION_CONTRACT_VERSION = `image-models-${hashContract(
  [...SUPPORTED_IMAGE_GENERATION_MODEL_IDS].sort().join('|')
)}`;
