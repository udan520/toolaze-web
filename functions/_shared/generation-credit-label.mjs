const MODEL_LABELS = {
  'gpt-image-2': 'GPT Image 2',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana-2': 'Nano Banana 2',
  'seedream-4-5': 'Seedream 4.5',
  'seedream-5-0-lite': 'Seedream 5.0 Lite',
  'seedream-5-0-pro': 'Seedream 5.0 Pro',
  'wan-2-7-image': 'Wan 2.7 Image',
};

function fallbackModelLabel(model) {
  return String(model || 'AI image')
    .split('-')
    .filter(Boolean)
    .map((part) => {
      if (/^\d/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

export function getImageGenerationCreditDescription(model, isImageToImage = false) {
  const label = MODEL_LABELS[String(model || '').toLowerCase()] || fallbackModelLabel(model);
  const mode = isImageToImage ? 'image-to-image' : 'text-to-image';
  return `${label} ${mode} generation`;
}

export function getImageGenerationCreditRefundDescription(model, isImageToImage = false) {
  return `${getImageGenerationCreditDescription(model, isImageToImage)} refund`;
}
