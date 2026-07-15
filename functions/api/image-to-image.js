import { getCurrentUser } from '../_shared/auth.mjs';
import { consumeCredits, refundCredits } from '../_shared/credits.mjs';
import { calculateImageGenerationCredits } from '../_shared/generation-credits.mjs';

/**
 * Cloudflare Pages Function: Nano Banana Pro 生图 - 创建任务
 * 部署后地址：https://toolaze-web.pages.dev/api/image-to-image
 * 需设置环境变量：KIE_AI_API_KEY，可选 NANO_BANANA_DAILY_CAP
 */
const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
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
  return 'nano-banana-pro';
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
  return env.KIE_NANO_BANANA_MODEL || 'nano-banana-pro';
}

function getMaxImagesForModel(model) {
  if (model === 'nano-banana-2') return 14;
  if (model === 'seedream-4-5') return 14;
  if (model === 'seedream-5-0-lite') return 14;
  if (model === 'seedream-5-0-pro') return 14;
  if (model === 'wan-2-7-image') return 9;
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
  const requiredCredits = calculateImageGenerationCredits(model, resolution);

  if (!shouldUseCreditLedger(env)) {
    return {
      requiredCredits,
      credits: null,
      user: null,
      consumption: null,
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
      response: jsonResponse({
        error: 'Please sign in with Google to generate images.',
        requiredCredits,
      }, 401),
    };
  }

  const consumption = await consumeCredits(env, user.id, requiredCredits, {
    reason: 'image_generation',
    description: 'Image generation',
    metadata,
  });

  if (!consumption.ok) {
    return {
      requiredCredits,
      credits: { balance: consumption.balance, transactions: [] },
      user,
      consumption: null,
      response: jsonResponse({
        error: 'Insufficient credits to generate this image.',
        credits: { balance: consumption.balance, transactions: [] },
        requiredCredits,
      }, 402),
    };
  }

  return {
    requiredCredits,
    credits: { balance: consumption.balance, transactions: [] },
    user,
    consumption,
    response: null,
  };
}

async function refundGenerationCredits(env, creditContext, metadata) {
  if (!creditContext?.user || !creditContext?.consumption?.consumptionId) return;

  await refundCredits(env, creditContext.user.id, creditContext.requiredCredits, {
    reason: 'image_generation_refund',
    description: 'Image generation refund',
    consumptionId: creditContext.consumption.consumptionId,
    metadata,
  }).catch(() => null);
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
    const isImageToImage = formData.get('isImageToImage') === 'true';
    const model = resolveModel(formData.get('model'));
    const normalizedResolution =
      model === 'wan-2-7-image' && isImageToImage && resolution === '4K'
        ? '2K'
        : (resolution === '2K' || resolution === '4K' ? resolution : '1K');
    const aspectRatio = requestedAspectRatio || (model === 'seedream-4-5' || model === 'seedream-5-0-lite' || model === 'seedream-5-0-pro' || model === 'wan-2-7-image' ? '1:1' : undefined);
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
    });
    if (creditContext.response) return creditContext.response;

    const input = model === 'seedream-4-5'
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
    const mappedFormat = mapOutputFormat(outputFormat);
    if (mappedFormat) {
      input.output_format = mappedFormat;
    }
    if (isImageToImage && imageUrls.length > 0) {
      if (model === 'seedream-4-5' || model === 'seedream-5-0-lite' || model === 'seedream-5-0-pro') {
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
      await refundGenerationCredits(env, creditContext, {
        model,
        providerModelId,
        resolution: normalizedResolution,
        error: String(msg || 'Failed to create task'),
      });
      return jsonResponse({ error: msg || 'Failed to create task' }, response.status);
    }

    if (result?.code === 200 && result?.data?.taskId) {
      return jsonResponse({
        taskId: result.data.taskId,
        credits: creditContext.credits,
        requiredCredits: creditContext.requiredCredits,
        creditHold: creditContext.consumption?.consumptionId
          ? {
              provider: 'credit-ledger',
              taskId: result.data.taskId,
              consumptionId: creditContext.consumption.consumptionId,
              requiredCredits: creditContext.requiredCredits,
            }
          : null,
      });
    }

    await refundGenerationCredits(env, creditContext, {
      model,
      providerModelId,
      resolution: normalizedResolution,
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    });
    return jsonResponse({
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    }, 500);
  } catch (e) {
    await refundGenerationCredits(env, creditContext, {
      error: e instanceof Error ? e.message : 'Internal server error',
    });
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
