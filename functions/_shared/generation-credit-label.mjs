const MODEL_LABELS = {
  'gpt-image-2': 'GPT Image 2',
  'gpt-image-1-5': 'GPT Image 1.5',
  'flux-2-pro': 'Flux 2 Pro',
  'flux-2-flex': 'Flux 2 Flex',
  'nano-banana-pro': 'Nano Banana Pro',
  'nano-banana-2': 'Nano Banana 2',
  'seedream-4-5': 'Seedream 4.5',
  'seedream-5-0-lite': 'Seedream 5.0 Lite',
  'seedream-5-0-pro': 'Seedream 5.0 Pro',
  'wan-2-7-image': 'Wan 2.7 Image',
  'grok-1-5-image': 'Grok 1.5 Image',
  'grok-video-1-5': 'Grok Video 1.5',
};

const VIDEO_MODEL_LABELS = {
  'grok-1-5-video': 'Grok Imagine Video 1.5',
  'seedance-2': 'Seedance 2.0',
  'seedance-2-mini': 'Seedance 2.0 Mini',
  'seedance-2-fast': 'Seedance 2.0 Fast',
  'seedance-1-5-pro': 'Seedance 1.5 Pro',
  'seedance-1-pro': 'Seedance 1.0 Pro',
  'seedance-1-lite': 'Seedance 1.0 Lite',
  'kling-3': 'Kling 3.0',
  'pixverse-v6': 'PixVerse V6',
  'happyhorse-1-1': 'HappyHorse 1.1',
  'happyhorse': 'HappyHorse',
  'infinitalk': 'Infinitalk',
};

const WRAPPED_TOOL_LABELS = {
  'ai-baby-generator': 'AI Baby Generator',
  'ai-couple-photo-maker': 'AI Couple Photo Maker',
  'ai-hairstyle-changer': 'AI Hair Style Changer',
  'ai-hair-color-changer': 'AI Hair Color Changer',
  'ai-clothes-changer': 'Clothes Changer',
  'photo-restoration': 'Photo Restoration',
  'watermark-remover': 'Watermark Remover',
  'ai-dance-generator': 'AI Dance Generator',
  'ai-kissing-video-generator': 'AI Kissing Video Generator',
  'ai-asmr-video-generator': 'AI ASMR Video Generator',
  'talking-avatar-creator': 'AI Talking Avatar',
};

function isVideoGenerationModel(model) {
  return String(model || '').trim().toLowerCase() === 'grok-video-1-5';
}

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

function normalizeString(value) {
  return String(value || '').trim();
}

export function getImageGenerationModelLabel(model) {
  const normalizedModel = normalizeString(model).toLowerCase();
  return MODEL_LABELS[normalizedModel] || fallbackModelLabel(model);
}

export function getImageGenerationToolLabel(toolSlug, toolLabel) {
  const normalizedToolSlug = normalizeString(toolSlug).toLowerCase();
  if (WRAPPED_TOOL_LABELS[normalizedToolSlug]) return WRAPPED_TOOL_LABELS[normalizedToolSlug];
  return normalizeString(toolLabel);
}

export function getVideoGenerationToolLabel(toolSlug, toolLabel) {
  const normalizedToolSlug = normalizeString(toolSlug).toLowerCase();
  if (WRAPPED_TOOL_LABELS[normalizedToolSlug]) return WRAPPED_TOOL_LABELS[normalizedToolSlug];
  return normalizeString(toolLabel);
}

export function getImageGenerationCreditMetadata(model, isImageToImage = false, options = {}) {
  const metadata = {
    ...(options || {}),
    model,
    modelLabel: getImageGenerationModelLabel(model),
    isImageToImage: Boolean(isImageToImage),
  };
  const normalizedToolSlug = normalizeString(options.toolSlug).toLowerCase();
  const toolLabel = getImageGenerationToolLabel(normalizedToolSlug, options.toolLabel);
  const sourcePath = normalizeString(options.sourcePath);

  if (normalizedToolSlug) {
    metadata.toolSlug = normalizedToolSlug;
  } else {
    delete metadata.toolSlug;
  }

  if (toolLabel) {
    metadata.toolLabel = toolLabel;
  } else {
    delete metadata.toolLabel;
  }

  if (sourcePath) {
    metadata.sourcePath = sourcePath;
  } else {
    delete metadata.sourcePath;
  }

  Object.keys(metadata).forEach((key) => {
    if (metadata[key] === undefined || metadata[key] === null || metadata[key] === '') {
      delete metadata[key];
    }
  });

  return metadata;
}

export function getImageGenerationCreditDescription(model, isImageToImage = false, options = {}) {
  const toolLabel = getImageGenerationToolLabel(options.toolSlug, options.toolLabel);
  if (toolLabel) return toolLabel;

  const normalizedModel = String(model || '').toLowerCase();
  const label = getImageGenerationModelLabel(model);
  const mode = isVideoGenerationModel(normalizedModel)
    ? (isImageToImage ? 'image-to-video' : 'text-to-video')
    : (isImageToImage ? 'image-to-image' : 'text-to-image');
  return `${label} ${mode} generation`;
}

export function getImageGenerationCreditRefundDescription(model, isImageToImage = false, options = {}) {
  return `${getImageGenerationCreditDescription(model, isImageToImage, options)} refund`;
}

export function getVideoGenerationCreditDescription(model, mode = 'text-to-video', options = {}) {
  const toolLabel = getVideoGenerationToolLabel(options.toolSlug, options.toolLabel);
  if (toolLabel) return toolLabel;

  const normalizedModel = String(model || '').toLowerCase();
  const label = VIDEO_MODEL_LABELS[normalizedModel] || fallbackModelLabel(model);
  const normalizedMode = mode === 'image-to-video' ? 'image-to-video' : 'text-to-video';
  return `${label} ${normalizedMode} generation`;
}

export function getVideoGenerationCreditRefundDescription(model, mode = 'text-to-video', options = {}) {
  return `${getVideoGenerationCreditDescription(model, mode, options)} refund`;
}
