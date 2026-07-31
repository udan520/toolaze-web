import { getCurrentUser } from '../_shared/auth.mjs';
import { consumeCredits, getCreditSummary, refundCredits } from '../_shared/credits.mjs';
import { calculateVideoGenerationCredits } from '../_shared/generation-credits.mjs';
import {
  getVideoGenerationCreditDescription,
  getVideoGenerationCreditRefundDescription,
} from '../_shared/generation-credit-label.mjs';
import { attachGenerationTaskIdToConsumption } from '../_shared/generation-task-access.mjs';

/**
 * Cloudflare Pages Function: AI 视频生成 - 创建 Kie 视频任务
 * 部署后地址：https://toolaze-web.pages.dev/api/ai-video-generator
 * 需设置环境变量：KIE_AI_API_KEY
 */
const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const KIE_VEO_CREATE_URL = 'https://api.kie.ai/api/v1/veo/generate';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const VIDEO_MODEL_CONFIGS = {
  'grok-1-5-video': {
    displayName: 'Grok Imagine Video 1.5',
    envKey: 'KIE_GROK_VIDEO_MODEL',
    fallbackProviderModel: 'grok-imagine-video-1-5-preview',
    creditModelId: 'grok-1-5-video',
    aliases: ['grok-imagine-video-1-5', 'grok-imagine-video-1-5-preview'],
    maxImages: 1,
    defaultAspectRatio: 'auto',
    aspectRatios: new Set(['auto', '1:1', '16:9', '9:16', '3:2', '2:3']),
    defaultResolution: '480p',
    resolutions: new Set(['480p', '720p']),
    defaultDuration: 3,
    minDuration: 1,
    maxDuration: 15,
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Grok Imagine Video 1.5',
    unsupportedResolutionError: 'Unsupported resolution for Grok Imagine Video 1.5',
    tooManyImagesError: 'Grok Imagine Video 1.5 supports exactly one reference image',
    unconfiguredError: 'Grok Imagine Video 1.5 video model is not configured',
  },
  'seedance-2': {
    displayName: 'Seedance 2.0',
    envKey: 'KIE_SEEDANCE_2_VIDEO_MODEL',
    fallbackProviderModel: 'bytedance/seedance-2',
    creditModelId: 'seedance-2',
    aliases: ['seedance-2-0'],
    inputSchema: 'seedance',
    maxImages: 2,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '4:3', '3:4']),
    defaultResolution: '480p',
    resolutions: new Set(['480p', '720p', '1080p', '4K']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10, 15]),
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 2.0',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 2.0',
    tooManyImagesError: 'Seedance 2.0 supports a first and optional last frame',
    unsupportedDurationError: 'Duration must be 5, 10, or 15 seconds for Seedance 2.0',
    unconfiguredError: 'Seedance 2.0 video model is not configured',
  },
  'seedance-2-mini': {
    displayName: 'Seedance 2.0 Mini',
    envKey: 'KIE_SEEDANCE_2_MINI_VIDEO_MODEL',
    fallbackProviderModel: 'bytedance/seedance-2-mini',
    aliases: ['seedance-2-0-mini', 'bytedance/seedance-2-mini', 'bytedance/seedance-2 mini'],
    inputSchema: 'seedance',
    creditModelId: 'seedance-2-mini',
    maxImages: 2,
    defaultAspectRatio: 'adaptive',
    aspectRatios: new Set(['adaptive', '16:9', '9:16', '1:1', '4:3', '3:4', '21:9']),
    defaultResolution: '720p',
    resolutions: new Set(['480p', '720p']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10, 15]),
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 2.0 Mini',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 2.0 Mini',
    tooManyImagesError: 'Seedance 2.0 Mini supports a first and optional last frame',
    unsupportedDurationError: 'Duration must be 5, 10, or 15 seconds for Seedance 2.0 Mini',
    unconfiguredError: 'Seedance 2.0 Mini video model is not configured',
  },
  'seedance-2-fast': {
    displayName: 'Seedance 2.0 Fast',
    envKey: 'KIE_SEEDANCE_2_FAST_VIDEO_MODEL',
    fallbackProviderModel: 'bytedance/seedance-2-fast',
    aliases: [],
    inputSchema: 'seedance',
    creditModelId: 'seedance-2-fast',
    maxImages: 2,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '4:3', '3:4']),
    defaultResolution: '480p',
    resolutions: new Set(['480p', '720p']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10, 15]),
    unsupportedDurationError: 'Duration must be 5, 10, or 15 seconds for Seedance 2.0 Fast',
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 2.0 Fast',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 2.0 Fast',
    tooManyImagesError: 'Seedance 2.0 Fast supports a first and optional last frame',
    unconfiguredError: 'Seedance 2.0 Fast video model is not configured',
  },
  'seedance-1-5-pro': {
    displayName: 'Seedance 1.5 Pro',
    envKey: 'KIE_SEEDANCE_1_5_PRO_VIDEO_MODEL',
    fallbackProviderModel: 'bytedance/seedance-1.5-pro',
    aliases: [],
    inputSchema: 'seedance-1-5',
    creditModelId: 'seedance-1-5-pro',
    maxImages: 2,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '4:3', '3:4']),
    defaultResolution: '480p',
    resolutions: new Set(['480p', '720p', '1080p']),
    nativeAudioResolutions: new Set(['480p', '720p', '1080p']),
    defaultDuration: 4,
    allowedDurations: new Set([4, 8, 12]),
    unsupportedDurationError: 'Duration must be 4, 8, or 12 seconds for Seedance 1.5 Pro',
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 1.5 Pro',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 1.5 Pro',
    tooManyImagesError: 'Seedance 1.5 Pro supports up to two input images',
    unconfiguredError: 'Seedance 1.5 Pro video model is not configured',
  },
  'seedance-1-pro-fast': {
    displayName: 'Seedance 1.0 Pro Fast',
    envKey: 'KIE_SEEDANCE_1_PRO_FAST_VIDEO_MODEL',
    fallbackProviderModel: 'bytedance/v1-pro-fast-image-to-video',
    aliases: [],
    inputSchema: 'seedance-1-pro-fast',
    creditModelId: 'seedance-1-pro-fast',
    supportedModes: new Set(['image-to-video']),
    maxImages: 1,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '4:3', '3:4']),
    defaultResolution: '720p',
    resolutions: new Set(['720p', '1080p']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10]),
    unsupportedDurationError: 'Seedance 1.0 Pro Fast supports 5 or 10 seconds',
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 1.0 Pro Fast',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 1.0 Pro Fast',
    tooManyImagesError: 'Seedance 1.0 Pro Fast supports one reference image',
    unsupportedModeError: 'Seedance 1.0 Pro Fast supports image-to-video only',
    unconfiguredError: 'Seedance 1.0 Pro Fast video model is not configured',
  },
  ...Object.fromEntries([
    ['seedance-1-pro', 'Seedance 1.0 Pro', 'bytedance/v1-pro-text-to-video', 'bytedance/v1-pro-image-to-video'],
    ['seedance-1-lite', 'Seedance 1.0 Lite', 'bytedance/v1-lite-text-to-video', 'bytedance/v1-lite-image-to-video'],
  ].map(([id, displayName, textModel, imageModel]) => [id, {
    displayName,
    envKey: `KIE_${id.replaceAll('-', '_').toUpperCase()}_VIDEO_MODEL`,
    providerModelsByMode: { 'text-to-video': textModel, 'image-to-video': imageModel },
    aliases: [],
    inputSchema: 'seedance-1',
    creditModelId: id,
    maxImages: 1,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '4:3', '3:4']),
    defaultResolution: '480p',
    resolutions: new Set(['480p', '720p', '1080p']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10]),
    unsupportedDurationError: `${displayName} supports 5 or 10 seconds`,
    unsupportedAspectRatioError: `Unsupported aspect ratio for ${displayName}`,
    unsupportedResolutionError: `Unsupported resolution for ${displayName}`,
    tooManyImagesError: `${displayName} supports one reference image`,
    unconfiguredError: `${displayName} video model is not configured`,
  }])),
  'wan-2-7': {
    displayName: 'Wan 2.7',
    envKey: 'KIE_WAN_2_7_VIDEO_MODEL',
    providerModelsByMode: {
      'text-to-video': 'wan/2-7-text-to-video',
      'image-to-video': 'wan/2-7-image-to-video',
    },
    creditModelId: 'wan-2-7',
    inputSchema: 'wan',
    aliases: [],
    imageField: 'first_frame_url',
    maxImages: 2,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1']),
    defaultResolution: '720p',
    resolutions: new Set(['720p', '1080p']),
    defaultDuration: 5,
    minDuration: 2,
    maxDuration: 10,
    unsupportedDurationError: 'Duration must be between 2 and 10 seconds for Wan 2.7',
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Wan 2.7',
    unsupportedResolutionError: 'Unsupported resolution for Wan 2.7',
    tooManyImagesError: 'Wan 2.7 supports a first frame and an optional last frame',
    unconfiguredError: 'Wan 2.7 video model is not configured',
  },
  ...Object.fromEntries([
    ['wan-2-6', 'Wan 2.6', 'wan/2-6-text-to-video', 'wan/2-6-image-to-video', [5, 10, 15], ['720p', '1080p'], 'image_urls'],
    ['wan-2-5', 'Wan 2.5', 'wan/2-5-text-to-video', 'wan/2-5-image-to-video', [5, 10], ['720p', '1080p'], 'image_url'],
    ['wan-2-2', 'Wan 2.2', 'wan/2-2-a14b-text-to-video-turbo', 'wan/2-2-a14b-image-to-video-turbo', [5], ['480p', '720p'], 'image_url'],
  ].map(([id, displayName, textModel, imageModel, durations, resolutions, imageField]) => [id, {
    displayName,
    envKey: `KIE_${id.replaceAll('-', '_').toUpperCase()}_VIDEO_MODEL`,
    providerModelsByMode: { 'text-to-video': textModel, 'image-to-video': imageModel },
    creditModelId: id,
    inputSchema: 'wan',
    aliases: [],
    imageField,
    maxImages: 1,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1']),
    defaultResolution: resolutions[0],
    resolutions: new Set(resolutions),
    defaultDuration: 5,
    allowedDurations: new Set(durations),
    unsupportedDurationError: `Unsupported duration for ${displayName}`,
    unsupportedAspectRatioError: `Unsupported aspect ratio for ${displayName}`,
    unsupportedResolutionError: `Unsupported resolution for ${displayName}`,
    tooManyImagesError: `${displayName} supports one reference image`,
    unconfiguredError: `${displayName} video model is not configured`,
  }])),
  'kling-3-turbo': {
    displayName: 'Kling 3 Turbo',
    envKey: 'KIE_KLING_3_TURBO_VIDEO_MODEL',
    providerModelsByMode: {
      'text-to-video': 'kling/v3-turbo-text-to-video',
      'image-to-video': 'kling/v3-turbo-image-to-video',
    },
    creditModelId: 'kling-3-turbo',
    inputSchema: 'kling-versioned',
    aliases: [],
    imageField: 'image_urls',
    maxImages: 2,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1']),
    defaultResolution: '720p',
    resolutions: new Set(['720p', '1080p']),
    nativeAudioResolutions: new Set(['720p', '1080p']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10]),
    unsupportedDurationError: 'Duration must be 5 or 10 seconds for Kling 3 Turbo',
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Kling 3 Turbo',
    unsupportedResolutionError: 'Unsupported resolution for Kling 3 Turbo',
    tooManyImagesError: 'Kling 3 Turbo supports a start frame and an optional end frame',
    unconfiguredError: 'Kling 3 Turbo video model is not configured',
  },
  'kling-3': {
    displayName: 'Kling 3.0',
    envKey: 'KIE_KLING_3_VIDEO_MODEL',
    fallbackProviderModel: 'kling-3.0/video',
    creditModelId: 'kling-3',
    inputSchema: 'kling',
    aliases: ['kling'],
    maxImages: 4,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '21:9']),
    defaultResolution: '720p',
    resolutions: new Set(['720p', '1080p', '4K']),
    modeByResolution: {
      '720p': 'std',
      '1080p': 'pro',
      '4K': '4K',
    },
    nativeAudioResolutions: new Set(['720p', '1080p']),
    defaultDuration: 5,
    minDuration: 3,
    maxDuration: 15,
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Kling 3.0',
    unsupportedResolutionError: 'Unsupported resolution for Kling 3.0',
    tooManyImagesError: 'Kling 3.0 supports up to 4 reference images',
    unsupportedDurationError: 'Duration must be between 3 and 15 seconds for Kling 3.0',
    unconfiguredError: 'Kling 3.0 video model is not configured',
  },
  ...Object.fromEntries([
    ['kling-2-6', 'Kling 2.6', 'kling-2.6/text-to-video', 'kling-2.6/image-to-video', ['720p', '1080p'], true],
    ['kling-2-5', 'Kling 2.5 Turbo Pro', 'kling/v2-5-turbo-text-to-video-pro', 'kling/v2-5-turbo-image-to-video-pro', ['1080p'], false],
    ['kling-2-1', 'Kling 2.1 Master', 'kling/v2-1-master-text-to-video', 'kling/v2-1-master-image-to-video', ['1080p'], false],
  ].map(([id, displayName, textModel, imageModel, resolutions, supportsAudio]) => [id, {
    displayName,
    envKey: `KIE_${id.replaceAll('-', '_').toUpperCase()}_VIDEO_MODEL`,
    providerModelsByMode: { 'text-to-video': textModel, 'image-to-video': imageModel },
    creditModelId: id,
    inputSchema: 'kling-versioned',
    aliases: [],
    imageField: 'image_url',
    maxImages: 1,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1']),
    defaultResolution: resolutions[0],
    resolutions: new Set(resolutions),
    nativeAudioResolutions: supportsAudio ? new Set(resolutions) : undefined,
    defaultDuration: 5,
    allowedDurations: new Set([5, 10]),
    unsupportedDurationError: `Duration must be 5 or 10 seconds for ${displayName}`,
    unsupportedAspectRatioError: `Unsupported aspect ratio for ${displayName}`,
    unsupportedResolutionError: `Unsupported resolution for ${displayName}`,
    tooManyImagesError: `${displayName} supports one reference image`,
    unconfiguredError: `${displayName} video model is not configured`,
  }])),
  ...Object.fromEntries([
    ['veo-3-1-lite', 'Veo 3.1 Lite', 'veo3_lite', 45],
    ['veo-3-1-fast', 'Veo 3.1 Fast', 'veo3_fast', 90],
    ['veo-3-1-quality', 'Veo 3.1 Quality', 'veo3_quality', 375],
  ].map(([id, displayName, fallbackProviderModel]) => [id, {
    displayName,
    envKey: `KIE_${id.replaceAll('-', '_').toUpperCase()}_VIDEO_MODEL`,
    fallbackProviderModel,
    creditModelId: id,
    inputSchema: 'veo',
    taskProvider: 'veo',
    aliases: [],
    maxImages: 2,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16']),
    defaultResolution: '720p',
    resolutions: new Set(['720p', '1080p']),
    defaultDuration: 8,
    allowedDurations: new Set([4, 6, 8]),
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Veo 3.1',
    unsupportedResolutionError: 'Unsupported resolution for Veo 3.1',
    tooManyImagesError: 'Veo 3.1 supports up to two reference images',
    unsupportedDurationError: 'Duration must be 4, 6, or 8 seconds for Veo 3.1',
    unconfiguredError: 'Veo 3.1 video model is not configured',
  }])),
  'pixverse-v6': {
    displayName: 'PixVerse V6',
    envKey: 'KIE_PIXVERSE_V6_VIDEO_MODEL',
    providerModelsByMode: {
      'text-to-video': 'pixverse/v6/text-to-video',
      'image-to-video': 'pixverse/v6/image-to-video',
    },
    creditModelId: 'pixverse-v6',
    inputSchema: 'pixverse',
    aliases: [],
    maxImages: 1,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '4:3', '1:1', '3:4', '9:16', '2:3', '3:2', '21:9']),
    defaultResolution: '720p',
    resolutions: new Set(['360p', '540p', '720p', '1080p']),
    nativeAudioResolutions: new Set(['360p', '540p', '720p', '1080p']),
    defaultDuration: 5,
    minDuration: 1,
    maxDuration: 15,
    unsupportedDurationError: 'Duration must be between 1 and 15 seconds for PixVerse V6',
    unsupportedAspectRatioError: 'Unsupported aspect ratio for PixVerse V6',
    unsupportedResolutionError: 'Unsupported resolution for PixVerse V6',
    tooManyImagesError: 'PixVerse V6 supports one reference image',
    unconfiguredError: 'PixVerse V6 video model is not configured',
  },
  ...Object.fromEntries([
    ['happyhorse-1-1', 'HappyHorse 1.1', 'happyhorse-1-1/text-to-video', 'happyhorse-1-1/image-to-video'],
    ['happyhorse', 'HappyHorse', 'happyhorse/text-to-video', 'happyhorse/image-to-video'],
  ].map(([id, displayName, textModel, imageModel]) => [id, {
    displayName,
    envKey: `KIE_${id.replaceAll('-', '_').toUpperCase()}_VIDEO_MODEL`,
    providerModelsByMode: { 'text-to-video': textModel, 'image-to-video': imageModel },
    creditModelId: id,
    inputSchema: 'happyhorse',
    aliases: [],
    maxImages: 1,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set([
      '16:9',
      '9:16',
      '1:1',
      '4:3',
      '3:4',
      ...(id === 'happyhorse-1-1' ? ['4:5', '5:4', '9:21', '21:9'] : []),
    ]),
    defaultResolution: '1080p',
    resolutions: new Set(['720p', '1080p']),
    defaultDuration: 5,
    minDuration: 3,
    maxDuration: 15,
    unsupportedDurationError: `${displayName} duration must be between 3 and 15 seconds`,
    unsupportedAspectRatioError: `Unsupported aspect ratio for ${displayName}`,
    unsupportedResolutionError: `Unsupported resolution for ${displayName}`,
    tooManyImagesError: `${displayName} supports one reference image`,
    unconfiguredError: `${displayName} video model is not configured`,
  }])),
};

const DEFAULT_VIDEO_MODEL_ID = 'grok-1-5-video';
const GENERATION_SERVICE_UNAVAILABLE_MESSAGE =
  'The generation service is temporarily unavailable. Please try again later.';

function getApiKey(env) {
  return env.KIE_AI_API_KEY;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function shouldUseCreditLedger(env) {
  return Boolean(env?.DB);
}

async function consumeVideoGenerationCredits(env, request, requiredCredits, metadata) {
  if (!shouldUseCreditLedger(env)) {
    return {
      credits: null,
      user: null,
      consumption: null,
      response: null,
    };
  }

  const user = await getCurrentUser(env, request);
  if (!user) {
    return {
      credits: null,
      user: null,
      consumption: null,
      response: jsonResponse({
        error: 'Please sign in with Google to generate videos.',
        requiredCredits,
      }, 401),
    };
  }

  const consumption = await consumeCredits(env, user.id, requiredCredits, {
    reason: 'video_generation',
    description: getVideoGenerationCreditDescription(metadata.model, metadata.mode),
    metadata,
  });

  if (!consumption.ok) {
    const credits = await getCreditSummary(env, user.id);
    return {
      credits,
      user,
      consumption: null,
      response: jsonResponse({
        error: 'Insufficient credits to generate this video.',
        credits,
        requiredCredits,
      }, 402),
    };
  }

  return {
    credits: await getCreditSummary(env, user.id),
    user,
    consumption,
    response: null,
  };
}

async function refundVideoGenerationCredits(env, creditContext, metadata) {
  if (!creditContext?.user || !creditContext?.consumption?.consumptionId) return null;

  const refund = await refundCredits(env, creditContext.user.id, metadata.requiredCredits, {
    reason: 'video_generation_refund',
    description: getVideoGenerationCreditRefundDescription(metadata.model, metadata.mode),
    consumptionId: creditContext.consumption.consumptionId,
    metadata,
  }).catch(() => null);

  if (!refund) return null;
  return getCreditSummary(env, creditContext.user.id).catch(() => null);
}

function normalizeMode(formData) {
  const mode = String(formData.get('mode') || '').trim();
  if (mode === 'text-to-video') return 'text-to-video';
  if (mode === 'image-to-video') return 'image-to-video';
  return formData.get('isImageToVideo') === 'true' ? 'image-to-video' : 'text-to-video';
}

function getModelConfig(modelId) {
  const normalized = String(modelId || '').trim();
  if (!normalized) return VIDEO_MODEL_CONFIGS[DEFAULT_VIDEO_MODEL_ID];
  if (VIDEO_MODEL_CONFIGS[normalized]) return VIDEO_MODEL_CONFIGS[normalized];

  return Object.values(VIDEO_MODEL_CONFIGS).find((config) =>
    config.aliases?.includes(normalized)
  ) || VIDEO_MODEL_CONFIGS[DEFAULT_VIDEO_MODEL_ID];
}

function getProviderModel(config, env, mode) {
  return String(env[config.envKey] || config.providerModelsByMode?.[mode] || config.fallbackProviderModel || '').trim();
}

function normalizeDuration(value, config) {
  const raw = String(value || '').trim();
  if (!raw) return { value: config.defaultDuration };

  const duration = Number(raw);
  if (!Number.isFinite(duration) || !Number.isInteger(duration)) {
    return { error: config.unsupportedDurationError || 'Invalid duration' };
  }

  if (config.allowedDurations && !config.allowedDurations.has(duration)) {
    return { error: config.unsupportedDurationError };
  }

  if (
    typeof config.minDuration === 'number'
    && typeof config.maxDuration === 'number'
    && (duration < config.minDuration || duration > config.maxDuration)
  ) {
    return { error: config.unsupportedDurationError || `Duration must be between ${config.minDuration} and ${config.maxDuration} seconds` };
  }

  return { value: duration };
}

function normalizeAspectRatio(value, config) {
  const aspectRatio = String(value || '').trim().toLowerCase() || config.defaultAspectRatio;
  if (!config.aspectRatios.has(aspectRatio)) {
    return { error: config.unsupportedAspectRatioError };
  }
  return { value: aspectRatio };
}

function normalizeResolution(value, config) {
  const resolution = String(value || '').trim() || config.defaultResolution;
  if (!config.resolutions.has(resolution)) {
    return { error: config.unsupportedResolutionError };
  }
  return { value: resolution };
}

function parseImageUrls(formData) {
  const imageUrlsJson = formData.get('imageUrls');
  const imageUrl = String(formData.get('imageUrl') || '').trim();

  if (imageUrlsJson) {
    try {
      const parsed = JSON.parse(String(imageUrlsJson));
      if (Array.isArray(parsed)) {
        return parsed
          .map((url) => String(url || '').trim())
          .filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return imageUrl ? [imageUrl] : [];
}

function boolFormValue(formData, key) {
  return String(formData.get(key) || '').trim().toLowerCase() === 'true';
}

function buildProviderInput({
  formData,
  modelConfig,
  mode,
  prompt,
  imageUrls,
  aspectRatio,
  resolution,
  duration,
  nativeAudio,
}) {
  const input = {
    prompt,
    aspect_ratio: aspectRatio,
    resolution,
    duration,
  };

  if (modelConfig.inputSchema === 'seedance') {
    input.generate_audio = Boolean(nativeAudio) || boolFormValue(formData, 'generateAudio');
    input.return_last_frame = boolFormValue(formData, 'returnLastFrame');
    input.web_search = boolFormValue(formData, 'webSearch');
    if (mode === 'image-to-video') {
      input.first_frame_url = imageUrls[0];
      if (imageUrls[1]) {
        input.last_frame_url = imageUrls[1];
      }
    }
    return input;
  }

  if (modelConfig.inputSchema === 'seedance-1-5') {
    return {
      prompt,
      ...(mode === 'image-to-video' ? { input_urls: imageUrls } : {}),
      aspect_ratio: aspectRatio,
      resolution,
      duration,
      fixed_lens: false,
      generate_audio: Boolean(nativeAudio),
      nsfw_checker: true,
    };
  }

  if (modelConfig.inputSchema === 'seedance-1-pro-fast') {
    return {
      prompt,
      image_url: imageUrls[0],
      resolution,
      duration: String(duration),
      nsfw_checker: true,
    };
  }

  if (modelConfig.inputSchema === 'seedance-1') {
    return {
      prompt,
      ...(mode === 'image-to-video' ? { image_url: imageUrls[0] } : { aspect_ratio: aspectRatio }),
      resolution,
      duration: String(duration),
      camera_fixed: false,
      seed: -1,
      enable_safety_checker: true,
      nsfw_checker: true,
    };
  }

  if (modelConfig.inputSchema === 'wan') {
    if (mode === 'image-to-video') {
      if (modelConfig.imageField === 'image_urls') input.image_urls = imageUrls;
      else if (modelConfig.imageField === 'first_frame_url') {
        input.first_frame_url = imageUrls[0];
        if (imageUrls[1]) input.last_frame_url = imageUrls[1];
      } else input.image_url = imageUrls[0];
    }
    return input;
  }

  if (modelConfig.inputSchema === 'kling-versioned') {
    const versionedInput = {
      prompt,
      aspect_ratio: aspectRatio,
      duration: String(duration),
      ...(modelConfig.resolutions.size > 1 ? { resolution } : {}),
      ...(modelConfig.nativeAudioResolutions ? { sound: Boolean(nativeAudio) } : {}),
    };
    if (mode === 'image-to-video') {
      versionedInput[modelConfig.imageField] = modelConfig.imageField === 'image_urls'
        ? imageUrls
        : imageUrls[0];
    }
    return versionedInput;
  }

  if (modelConfig.inputSchema === 'kling') {
    const providerMode = modelConfig.modeByResolution?.[resolution] || 'std';
    return {
      prompt,
      aspect_ratio: aspectRatio,
      mode: providerMode,
      duration,
      sound: Boolean(nativeAudio),
      multi_shots: false,
      ...(mode === 'image-to-video' ? { image_urls: imageUrls } : {}),
    };
  }

  if (modelConfig.inputSchema === 'veo') {
    return {
      prompt,
      ...(mode === 'image-to-video' ? { imageUrls } : {}),
      model: getProviderModel(modelConfig, {}, mode),
      generationType: mode === 'image-to-video'
        ? 'FIRST_AND_LAST_FRAMES_2_VIDEO'
        : 'TEXT_2_VIDEO',
      aspect_ratio: aspectRatio,
      enableTranslation: true,
    };
  }

  if (modelConfig.inputSchema === 'pixverse') {
    return {
      prompt,
      duration,
      quality: resolution,
      aspect_ratio: aspectRatio,
      generate_audio_switch: Boolean(nativeAudio),
      generate_multi_clip_switch: false,
      ...(mode === 'image-to-video' ? { image_urls: imageUrls } : {}),
    };
  }

  if (modelConfig.inputSchema === 'happyhorse') {
    return {
      prompt,
      resolution,
      duration,
      ...(mode === 'text-to-video' ? { aspect_ratio: aspectRatio } : {}),
      ...(mode === 'image-to-video' ? { image_urls: imageUrls } : {}),
    };
  }

  input.nsfw_checker = true;
  if (mode === 'image-to-video') {
    input.image_urls = imageUrls;
  }
  return input;
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  let creditContext = null;
  let creditMetadata = null;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  try {
    const formData = await request.formData();
    const mode = normalizeMode(formData);
    const modelConfig = getModelConfig(formData.get('model'));
    const prompt = String(formData.get('prompt') || '').trim();
    const imageUrls = parseImageUrls(formData);

    if (!prompt) {
      return jsonResponse({ error: 'Prompt is required' }, 400);
    }
    if (modelConfig.supportedModes && !modelConfig.supportedModes.has(mode)) {
      return jsonResponse({ error: modelConfig.unsupportedModeError }, 400);
    }
    if (mode === 'image-to-video' && imageUrls.length === 0) {
      return jsonResponse({ error: 'Image-to-video requires at least one image URL' }, 400);
    }
    if (mode === 'image-to-video' && imageUrls.length > modelConfig.maxImages) {
      return jsonResponse({ error: modelConfig.tooManyImagesError }, 400);
    }

    const aspectRatio = normalizeAspectRatio(formData.get('aspectRatio'), modelConfig);
    if (aspectRatio.error) {
      return jsonResponse({ error: aspectRatio.error }, 400);
    }

    const resolution = normalizeResolution(formData.get('resolution'), modelConfig);
    if (resolution.error) {
      return jsonResponse({ error: resolution.error }, 400);
    }

    const duration = normalizeDuration(formData.get('duration'), modelConfig);
    if (duration.error) {
      return jsonResponse({ error: duration.error }, 400);
    }
    const nativeAudio = Boolean(modelConfig.nativeAudioResolutions)
      && boolFormValue(formData, 'nativeAudio');
    if (nativeAudio && !modelConfig.nativeAudioResolutions?.has(resolution.value)) {
      return jsonResponse({ error: 'Native Audio for Kling 3.0 supports 720p and 1080p only' }, 400);
    }

    const providerModel = getProviderModel(modelConfig, env, mode);
    if (!providerModel) {
      return jsonResponse({ error: modelConfig.unconfiguredError }, 500);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (KIE_AI_API_KEY)' }, 500);
    }

    const input = buildProviderInput({
      formData,
      modelConfig,
      mode,
      prompt,
      imageUrls,
      aspectRatio: aspectRatio.value,
      resolution: resolution.value,
      duration: duration.value,
      nativeAudio,
    });
    if (modelConfig.inputSchema === 'veo') input.model = providerModel;
    const requiredCredits = calculateVideoGenerationCredits(
      modelConfig.creditModelId,
      resolution.value,
      duration.value,
      { nativeAudio }
    );
    if (!Number.isInteger(requiredCredits) || requiredCredits <= 0) {
      return jsonResponse({ error: 'Video pricing is not configured for this model.' }, 500);
    }

    creditMetadata = {
      model: modelConfig.creditModelId,
      providerModel,
      mode,
      mediaType: 'video',
      resolution: resolution.value,
      aspectRatio: aspectRatio.value,
      duration: duration.value,
      nativeAudio,
      requiredCredits,
    };

    creditContext = await consumeVideoGenerationCredits(
      env,
      request,
      requiredCredits,
      creditMetadata
    );
    if (creditContext.response) return creditContext.response;

    const response = await fetch(
      modelConfig.inputSchema === 'veo' ? KIE_VEO_CREATE_URL : `${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
        body: JSON.stringify(modelConfig.inputSchema === 'veo' ? input : {
          model: providerModel,
          input,
        }),
      }
    );

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text();
      const credits = await refundVideoGenerationCredits(env, creditContext, {
        ...creditMetadata,
        requiredCredits,
        error: String(msg || 'Failed to create video task'),
      });
      console.error('KIE video task creation failed', {
        status: response.status,
        model: modelConfig.creditModelId,
        providerModel,
        error: String(msg || 'Failed to create video task'),
      });
      return jsonResponse({
        error: GENERATION_SERVICE_UNAVAILABLE_MESSAGE,
        code: 'UPSTREAM_GENERATION_ERROR',
        credits,
      }, response.status);
    }

    const taskId = result?.data?.taskId ?? result?.taskId;
    if (taskId) {
      const payload = {
        taskId,
        requiredCredits,
        ...(modelConfig.taskProvider ? { taskProvider: modelConfig.taskProvider } : {}),
      };
      if (creditContext.consumption?.consumptionId) {
        await attachGenerationTaskIdToConsumption(
          env,
          creditContext.user.id,
          creditContext.consumption.consumptionId,
          taskId
        ).catch((error) => {
          console.error('Failed to bind video task to credit consumption', {
            consumptionId: creditContext.consumption.consumptionId,
            taskId,
            error: error instanceof Error ? error.message : String(error),
          });
        });
        payload.credits = creditContext.credits;
        payload.creditHold = {
          provider: 'credit-ledger',
          taskId,
          consumptionId: creditContext.consumption.consumptionId,
          requiredCredits,
          model: modelConfig.creditModelId,
          mode,
          mediaType: 'video',
        };
      }
      return jsonResponse(payload);
    }

    const videoUrl = result?.data?.videoUrl ?? result?.videoUrl;
    if (videoUrl) {
      const payload = {
        videoUrl,
        requiredCredits,
      };
      if (creditContext.credits) payload.credits = creditContext.credits;
      return jsonResponse(payload);
    }

    const credits = await refundVideoGenerationCredits(env, creditContext, {
      ...creditMetadata,
      requiredCredits,
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    });
    console.error('KIE video task returned an unexpected response', {
      model: modelConfig.creditModelId,
      providerModel,
      code: result?.code,
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    });
    return jsonResponse({
      error: GENERATION_SERVICE_UNAVAILABLE_MESSAGE,
      code: 'UPSTREAM_GENERATION_ERROR',
      credits,
    }, 500);
  } catch (e) {
    const credits = await refundVideoGenerationCredits(env, creditContext, {
      ...(creditMetadata || {}),
      requiredCredits: creditMetadata?.requiredCredits,
      error: e instanceof Error ? e.message : 'Internal server error',
    });
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
      credits,
    }, 500);
  }
}
