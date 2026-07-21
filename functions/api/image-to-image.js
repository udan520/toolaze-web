import { getCurrentUser } from '../_shared/auth.mjs';
import { consumeCredits, getCreditSummary, refundCredits } from '../_shared/credits.mjs';
import { calculateImageGenerationCredits } from '../_shared/generation-credits.mjs';
import {
  getImageGenerationCreditDescription,
  getImageGenerationCreditRefundDescription,
} from '../_shared/generation-credit-label.mjs';
import {
  createModerationExternalId,
  moderatePromptBeforeGeneration,
} from '../_shared/creem-moderation.mjs';

/**
 * Cloudflare Pages Function: Nano Banana Pro 生图 - 创建任务
 * 部署后地址：https://toolaze-web.pages.dev/api/image-to-image
 * 需设置环境变量：KIE_AI_API_KEY，可选 NANO_BANANA_DAILY_CAP
 */
const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const GROK_VIDEO_MODEL_ID = 'grok-video-1-5';
const GROK_VIDEO_PROVIDER_MODEL_ID = 'grok-imagine-video-1-5-preview';
const GROK_VIDEO_DEFAULT_DURATION_SECONDS = 8;
const GROK_VIDEO_MIN_DURATION_SECONDS = 1;
const GROK_VIDEO_MAX_DURATION_SECONDS = 15;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

let dailyCount = { date: '', count: 0 };

function getDailyCap(env) {
  const cap = env.NANO_BANANA_DAILY_CAP;
  if (cap === undefined || cap === '') return undefined;
  const n = parseInt(String(cap), 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function checkAndIncrementDaily(env) {
  const cap = getDailyCap(env);
  if (cap === undefined) return true;
  const today = new Date().toISOString().slice(0, 10);
  if (dailyCount.date !== today) {
    dailyCount.date = today;
    dailyCount.count = 0;
  }
  if (dailyCount.count >= cap) return false;
  dailyCount.count += 1;
  return true;
}

function getApiKey(env) {
  return env.KIE_AI_API_KEY;
}

function mapOutputFormat(format) {
  if (!format) return undefined;
  const f = String(format).toLowerCase();
  if (f === 'auto') return undefined;
  if (f === 'jpg' || f === 'jpeg') return 'jpg';
  if (f === 'png') return 'png';
  return 'png';
}

function mapAspectRatio(aspectRatio) {
  if (!aspectRatio) return undefined;
  const v = String(aspectRatio).trim().toLowerCase();
  if (!v || v === 'auto') return undefined;
  return String(aspectRatio).trim();
}

function resolveModel(model) {
  const m = String(model || '').trim().toLowerCase();
  if (m === 'gpt-image-2') return 'gpt-image-2';
  if (m === 'nano-banana-2') return 'nano-banana-2';
  if (m === 'seedream-4-5') return 'seedream-4-5';
  if (m === 'seedream-5-0-lite') return 'seedream-5-0-lite';
  if (m === 'seedream-5-0-pro') return 'seedream-5-0-pro';
  if (m === 'wan-2-7-image') return 'wan-2-7-image';
  if (m === 'grok-1-5-image') return 'grok-1-5-image';
  if (m === GROK_VIDEO_MODEL_ID || m === 'grok-imagine-video-1-5-preview') return GROK_VIDEO_MODEL_ID;
  return 'nano-banana-pro';
}

function isVideoGenerationModel(model) {
  return model === GROK_VIDEO_MODEL_ID;
}

function getGenerationMediaType(model) {
  return isVideoGenerationModel(model) ? 'video' : 'image';
}

function normalizeVideoDurationSeconds(duration) {
  const value = Math.round(Number(duration || GROK_VIDEO_DEFAULT_DURATION_SECONDS));
  if (!Number.isFinite(value)) return GROK_VIDEO_DEFAULT_DURATION_SECONDS;
  return Math.max(GROK_VIDEO_MIN_DURATION_SECONDS, Math.min(GROK_VIDEO_MAX_DURATION_SECONDS, value));
}

function normalizeResolution(model, isImageToImage, resolution) {
  const value = String(resolution || '').trim();
  const lowerValue = value.toLowerCase();

  if (isVideoGenerationModel(model)) {
    if (lowerValue === '720p') return '720p';
    if (lowerValue === '1080p') return '1080p';
    return '480p';
  }

  if (model === 'wan-2-7-image' && isImageToImage && value === '4K') return '2K';
  return value === '2K' || value === '4K' ? value : '1K';
}

function resolveProviderModelId(model, env, isImageToImage, resolution) {
  if (model === 'gpt-image-2') {
    if (isImageToImage) {
      return env.KIE_GPT_IMAGE_2_IMAGE_MODEL || env.KIE_GPT_IMAGE_2_EDIT_MODEL || env.KIE_GPT_IMAGE_2_IMAGE_TO_IMAGE_MODEL || env.KIE_GPT_IMAGE_2_MODEL || 'gpt-image-2-image-to-image';
    }
    return env.KIE_GPT_IMAGE_2_TEXT_MODEL || env.KIE_GPT_IMAGE_2_MODEL || 'gpt-image-2-text-to-image';
  }
  if (model === 'seedream-4-5') {
    if (isImageToImage) {
      return env.KIE_SEEDREAM_4_5_EDIT_MODEL || 'seedream/4.5-edit';
    }
    return env.KIE_SEEDREAM_4_5_TEXT_MODEL || 'seedream/4.5-text-to-image';
  }
  if (model === 'seedream-5-0-lite') {
    if (isImageToImage) {
      return env.KIE_SEEDREAM_5_0_LITE_EDIT_MODEL || env.KIE_SEEDREAM_5_LITE_EDIT_MODEL || 'seedream/5-lite-image-to-image';
    }
    return env.KIE_SEEDREAM_5_0_LITE_TEXT_MODEL || env.KIE_SEEDREAM_5_LITE_TEXT_MODEL || 'seedream/5-lite-text-to-image';
  }
  if (model === 'seedream-5-0-pro') {
    if (isImageToImage) {
      return env.KIE_SEEDREAM_5_0_PRO_EDIT_MODEL || env.KIE_SEEDREAM_5_PRO_EDIT_MODEL || 'seedream/5-pro-image-to-image';
    }
    return env.KIE_SEEDREAM_5_0_PRO_TEXT_MODEL || env.KIE_SEEDREAM_5_PRO_TEXT_MODEL || 'seedream/5-pro-text-to-image';
  }
  if (model === 'nano-banana-2') {
    return env.KIE_NANO_BANANA_2_MODEL || 'nano-banana-2';
  }
  if (model === 'wan-2-7-image') {
    if (!isImageToImage && resolution === '4K') {
      return env.KIE_WAN_2_7_IMAGE_PRO_MODEL || 'wan/2-7-image-pro';
    }
    return env.KIE_WAN_2_7_IMAGE_MODEL || 'wan/2-7-image';
  }
  if (model === 'grok-1-5-image') {
    return env.KIE_GROK_1_5_IMAGE_MODEL || 'grok-1.5-image';
  }
  if (model === GROK_VIDEO_MODEL_ID) {
    return env.KIE_GROK_VIDEO_1_5_MODEL || GROK_VIDEO_PROVIDER_MODEL_ID;
  }
  return env.KIE_NANO_BANANA_MODEL || 'nano-banana-pro';
}

function getMaxImagesForModel(model) {
  if (model === 'nano-banana-2') return 14;
  if (model === 'seedream-4-5') return 14;
  if (model === 'seedream-5-0-lite') return 14;
  if (model === 'seedream-5-0-pro') return 14;
  if (model === 'wan-2-7-image') return 9;
  if (model === 'grok-1-5-image') return 1;
  if (isVideoGenerationModel(model)) return 1;
  return model === 'gpt-image-2' ? 16 : 8;
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

async function consumeGenerationCredits(env, request, model, resolution, metadata) {
  const requiredCredits = calculateImageGenerationCredits(model, resolution, metadata?.durationSeconds);

  if (!shouldUseCreditLedger(env)) {
    return {
      requiredCredits,
      credits: null,
      user: null,
      consumption: null,
      metadata,
      response: null,
    };
  }

  const user = await getCurrentUser(env, request);
  if (!user) {
    return {
      requiredCredits,
      credits: null,
      user: null,
      consumption: null,
      metadata,
      response: jsonResponse({
        error: 'Please sign in with Google to generate images.',
        requiredCredits,
      }, 401),
    };
  }

  const consumption = await consumeCredits(env, user.id, requiredCredits, {
    reason: 'image_generation',
    description: getImageGenerationCreditDescription(model, metadata?.isImageToImage),
    metadata,
  });

  if (!consumption.ok) {
    const credits = await getCreditSummary(env, user.id);
    return {
      requiredCredits,
      credits,
      user,
      consumption: null,
      metadata,
      response: jsonResponse({
        error: 'Insufficient credits to generate this image.',
        credits,
        requiredCredits,
      }, 402),
    };
  }

  const credits = await getCreditSummary(env, user.id);
  return {
    requiredCredits,
    credits,
    user,
    consumption,
    metadata,
    response: null,
  };
}

async function refundGenerationCredits(env, creditContext, metadata) {
  if (!creditContext?.user || !creditContext?.consumption?.consumptionId) return null;

  const refund = await refundCredits(env, creditContext.user.id, creditContext.requiredCredits, {
    reason: 'image_generation_refund',
    description: getImageGenerationCreditRefundDescription(metadata?.model, metadata?.isImageToImage),
    consumptionId: creditContext.consumption.consumptionId,
    metadata,
  }).catch(() => null);

  if (!refund) return null;
  return getCreditSummary(env, creditContext.user.id).catch(() => null);
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  let creditContext = null;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  try {
    const formData = await request.formData();
    const imageUrl = (formData.get('imageUrl') || '').trim();
    const imageUrlsJson = formData.get('imageUrls');
    const prompt = (formData.get('prompt') || '').trim();
    const requestedAspectRatio = mapAspectRatio(formData.get('aspectRatio'));
    const outputFormat = formData.get('outputFormat') || 'Auto';
    const resolution = formData.get('resolution') || '1K';
    const durationSeconds = normalizeVideoDurationSeconds(formData.get('duration'));
    const isImageToImage = formData.get('isImageToImage') === 'true';
    const model = resolveModel(formData.get('model'));
    const mediaType = getGenerationMediaType(model);
    const normalizedResolution = normalizeResolution(model, isImageToImage, resolution);
    const aspectRatio = requestedAspectRatio || (isVideoGenerationModel(model) ? '16:9' : (model === 'seedream-4-5' || model === 'seedream-5-0-lite' || model === 'seedream-5-0-pro' || model === 'wan-2-7-image' ? '1:1' : undefined));
    const providerModelId = resolveProviderModelId(model, env, isImageToImage, normalizedResolution);
    const maxImages = getMaxImagesForModel(model);
    const quality = String(formData.get('quality') || '').trim().toLowerCase();

    if (!prompt) {
      return jsonResponse({ error: 'Prompt is required' }, 400);
    }

    let imageUrls = [];
    if (imageUrlsJson) {
      try {
        const arr = JSON.parse(String(imageUrlsJson));
        imageUrls = Array.isArray(arr) ? arr : [];
      } catch {
        imageUrls = [];
      }
    }
    if (imageUrl && imageUrls.length === 0) {
      imageUrls = [imageUrl];
    }

    if (isImageToImage && imageUrls.length === 0) {
      return jsonResponse({
        error: 'Image-to-image requires a public image URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL to your upload endpoint.',
      }, 400);
    }
    if (isImageToImage && imageUrls.length > maxImages) {
      return jsonResponse({ error: `Maximum ${maxImages} images allowed` }, 400);
    }

    const moderation = await moderatePromptBeforeGeneration({
      prompt,
      env,
      externalId: createModerationExternalId(`image-${model}`),
    });
    if (!moderation.allowed) {
      return jsonResponse(moderation.body, moderation.status);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (KIE_AI_API_KEY)' }, 500);
    }

    if (!checkAndIncrementDaily(env)) {
      return jsonResponse(
        { error: 'Daily generation limit reached. Please try again tomorrow.' },
        429
      );
    }

    creditContext = await consumeGenerationCredits(env, request, model, normalizedResolution, {
      model,
      providerModelId,
      resolution: normalizedResolution,
      isImageToImage,
      mediaType,
      durationSeconds: isVideoGenerationModel(model) ? durationSeconds : undefined,
    });
    if (creditContext.response) return creditContext.response;

    const input = isVideoGenerationModel(model)
      ? {
          prompt,
          resolution: normalizedResolution,
          duration: durationSeconds,
        }
      : model === 'seedream-4-5'
      ? { prompt }
      : {
          prompt,
          resolution: normalizedResolution,
        };
    if (model === 'seedream-4-5' || model === 'seedream-5-0-lite' || model === 'seedream-5-0-pro') {
      input.quality = quality === 'ultra' ? 'ultra' : quality === 'high' ? 'high' : 'basic';
    }
    if (model === 'wan-2-7-image') {
      input.thinking_mode = !isImageToImage;
      input.nsfw_checker = true;
    }
    if (aspectRatio) input.aspect_ratio = aspectRatio;
    const mappedFormat = isVideoGenerationModel(model) ? undefined : mapOutputFormat(outputFormat);
    if (mappedFormat) {
      input.output_format = mappedFormat;
    }
    if (isImageToImage && imageUrls.length > 0) {
      if (isVideoGenerationModel(model) || model === 'seedream-4-5' || model === 'seedream-5-0-lite' || model === 'seedream-5-0-pro') {
        input.image_urls = imageUrls.slice(0, maxImages);
      } else if (model === 'gpt-image-2' || model === 'wan-2-7-image') {
        input.input_urls = imageUrls.slice(0, maxImages);
      } else {
        input.image_input = imageUrls.slice(0, maxImages);
      }
    }

    const createTask = (modelId) => fetch(`${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        input,
      }),
    });

    let response = await createTask(providerModelId);
    let result = await response.json().catch(() => ({}));
    const unsupportedMsg = String(result?.message ?? result?.msg ?? '');
    const defaultGptImage2ModelId = isImageToImage ? 'gpt-image-2-image-to-image' : 'gpt-image-2-text-to-image';
    if (
      model === 'gpt-image-2' &&
      /model name you specified is not supported/i.test(unsupportedMsg) &&
      providerModelId !== defaultGptImage2ModelId
    ) {
      response = await createTask(defaultGptImage2ModelId);
      result = await response.json().catch(() => ({}));
    }
    if (!response.ok) {
      let msg = result?.message ?? result?.msg ?? await response.text();
      if (model === 'gpt-image-2' && /model name you specified is not supported/i.test(String(msg))) {
        msg = 'Current KIE key does not support GPT Image 2. Set KIE_GPT_IMAGE_2_TEXT_MODEL or KIE_GPT_IMAGE_2_IMAGE_MODEL to your account-enabled model id.';
      }
      const credits = await refundGenerationCredits(env, creditContext, {
        model,
        providerModelId,
        resolution: normalizedResolution,
        isImageToImage,
        durationSeconds: isVideoGenerationModel(model) ? durationSeconds : undefined,
        error: String(msg || 'Failed to create task'),
      });
      return jsonResponse({ error: msg || 'Failed to create task', credits }, response.status);
    }

    if (result?.code === 200 && result?.data?.taskId) {
      return jsonResponse({
        taskId: result.data.taskId,
        mediaType,
        credits: creditContext.credits,
        requiredCredits: creditContext.requiredCredits,
        creditHold: creditContext.consumption?.consumptionId
          ? {
              provider: 'credit-ledger',
              taskId: result.data.taskId,
              consumptionId: creditContext.consumption.consumptionId,
              requiredCredits: creditContext.requiredCredits,
              model,
              isImageToImage,
              mediaType,
              durationSeconds: isVideoGenerationModel(model) ? durationSeconds : undefined,
            }
          : null,
      });
    }

    const credits = await refundGenerationCredits(env, creditContext, {
      model,
      providerModelId,
      resolution: normalizedResolution,
      isImageToImage,
      durationSeconds: isVideoGenerationModel(model) ? durationSeconds : undefined,
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    });
    return jsonResponse({
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
      credits,
    }, 500);
  } catch (e) {
    const credits = await refundGenerationCredits(env, creditContext, {
      ...(creditContext?.metadata || {}),
      error: e instanceof Error ? e.message : 'Internal server error',
    });
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
      credits,
    }, 500);
  }
}
