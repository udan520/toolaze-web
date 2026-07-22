import { calculateVideoGenerationCredits } from '../_shared/generation-credits.mjs';

/**
 * Cloudflare Pages Function: AI 视频生成 - 创建 Kie 视频任务
 * 部署后地址：https://toolaze-web.pages.dev/api/ai-video-generator
 * 需设置环境变量：KIE_AI_API_KEY
 */
const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
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
    maxImages: 9,
    defaultAspectRatio: '16:9',
    aspectRatios: new Set(['16:9', '9:16', '1:1', '4:3', '3:4']),
    defaultResolution: '480p',
    resolutions: new Set(['480p', '720p', '1080p', '4K']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10, 15]),
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 2.0',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 2.0',
    tooManyImagesError: 'Seedance 2.0 supports up to 9 reference images',
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
    maxImages: 9,
    defaultAspectRatio: 'adaptive',
    aspectRatios: new Set(['adaptive', '16:9', '9:16', '1:1', '4:3', '3:4', '21:9']),
    defaultResolution: '720p',
    resolutions: new Set(['480p', '720p']),
    defaultDuration: 5,
    allowedDurations: new Set([5, 10, 15]),
    unsupportedAspectRatioError: 'Unsupported aspect ratio for Seedance 2.0 Mini',
    unsupportedResolutionError: 'Unsupported resolution for Seedance 2.0 Mini',
    tooManyImagesError: 'Seedance 2.0 Mini supports up to 9 reference images',
    unsupportedDurationError: 'Duration must be 5, 10, or 15 seconds for Seedance 2.0 Mini',
    unconfiguredError: 'Seedance 2.0 Mini video model is not configured',
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
};

const DEFAULT_VIDEO_MODEL_ID = 'grok-1-5-video';

function getApiKey(env) {
  return env.KIE_AI_API_KEY;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
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

function getProviderModel(config, env) {
  return String(env[config.envKey] || config.fallbackProviderModel || '').trim();
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
    input.generate_audio = boolFormValue(formData, 'generateAudio');
    input.return_last_frame = boolFormValue(formData, 'returnLastFrame');
    input.web_search = boolFormValue(formData, 'webSearch');
    if (mode === 'image-to-video') {
      input.reference_image_urls = imageUrls;
    }
    return input;
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

  input.nsfw_checker = true;
  if (mode === 'image-to-video') {
    input.image_urls = imageUrls;
  }
  return input;
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

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
    const nativeAudio = modelConfig.inputSchema === 'kling' && boolFormValue(formData, 'nativeAudio');
    if (nativeAudio && !modelConfig.nativeAudioResolutions?.has(resolution.value)) {
      return jsonResponse({ error: 'Native Audio for Kling 3.0 supports 720p and 1080p only' }, 400);
    }

    const providerModel = getProviderModel(modelConfig, env);
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
    const requiredCredits = calculateVideoGenerationCredits(
      modelConfig.creditModelId,
      resolution.value,
      duration.value,
      { nativeAudio }
    );

    const response = await fetch(`${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: providerModel,
        input,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text();
      return jsonResponse({ error: msg || 'Failed to create video task' }, response.status);
    }

    const taskId = result?.data?.taskId ?? result?.taskId;
    if (taskId) {
      return jsonResponse(requiredCredits ? { taskId, requiredCredits } : { taskId });
    }

    const videoUrl = result?.data?.videoUrl ?? result?.videoUrl;
    if (videoUrl) {
      return jsonResponse(requiredCredits ? { videoUrl, requiredCredits } : { videoUrl });
    }

    return jsonResponse({
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
      raw: result,
    }, 500);
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
