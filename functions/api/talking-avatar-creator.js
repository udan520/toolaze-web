import { getCurrentUser } from '../_shared/auth.mjs';
import { consumeCredits, getCreditSummary, refundCredits } from '../_shared/credits.mjs';
import {
  getVideoGenerationCreditDescription,
  getVideoGenerationCreditRefundDescription,
} from '../_shared/generation-credit-label.mjs';
import { attachGenerationTaskIdToConsumption } from '../_shared/generation-task-access.mjs';

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const INFINITALK_MODEL_ID = 'infinitalk';
const INFINITALK_PROVIDER_MODEL = 'infinitalk/from-audio';
const GENERATION_SERVICE_UNAVAILABLE_MESSAGE =
  'Video generation is temporarily unavailable. Please try again in a few minutes.';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function shouldUseCreditLedger(env) {
  return Boolean(env?.DB);
}

function readString(formData, key) {
  return String(formData.get(key) || '').trim();
}

function normalizeResolution(value) {
  const resolution = String(value || '').trim();
  return resolution === '720p' ? '720p' : '480p';
}

function getRequiredCredits(resolution) {
  // Initial fixed ladder for the Infinitalk MVP until product pricing is finalized.
  return resolution === '720p' ? 90 : 45;
}

async function consumeTalkingAvatarCredits(env, request, requiredCredits, metadata) {
  if (!shouldUseCreditLedger(env)) {
    return { credits: null, user: null, consumption: null, response: null };
  }

  const user = await getCurrentUser(env, request);
  if (!user) {
    return {
      credits: null,
      user: null,
      consumption: null,
      response: jsonResponse({ error: 'Please sign in with Google to create a talking avatar video.', requiredCredits }, 401),
    };
  }

  const consumption = await consumeCredits(env, user.id, requiredCredits, {
    reason: 'video_generation',
    description: getVideoGenerationCreditDescription(metadata.model, 'image-to-video', metadata),
    metadata,
  });

  if (!consumption.ok) {
    const credits = await getCreditSummary(env, user.id);
    return {
      credits,
      user,
      consumption: null,
      response: jsonResponse({
        error: 'Insufficient credits to create this talking avatar video.',
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

async function refundTalkingAvatarCredits(env, creditContext, metadata) {
  if (!creditContext?.user || !creditContext?.consumption?.consumptionId) return null;

  const refund = await refundCredits(env, creditContext.user.id, metadata.requiredCredits, {
    reason: 'video_generation_refund',
    description: getVideoGenerationCreditRefundDescription(metadata.model, 'image-to-video', metadata),
    consumptionId: creditContext.consumption.consumptionId,
    metadata,
  }).catch(() => null);

  if (!refund) return null;
  return getCreditSummary(env, creditContext.user.id).catch(() => null);
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed', allow: 'POST, OPTIONS' }, 405);
  }

  let creditContext = null;
  let creditMetadata = null;

  try {
    const formData = await request.formData();
    const imageUrl = readString(formData, 'imageUrl');
    const audioUrl = readString(formData, 'audioUrl');
    const prompt = readString(formData, 'prompt');
    const resolution = normalizeResolution(readString(formData, 'resolution'));

    if (!imageUrl) return jsonResponse({ error: 'Portrait image URL is required.' }, 400);
    if (!audioUrl) return jsonResponse({ error: 'Audio URL is required.' }, 400);
    if (!prompt) return jsonResponse({ error: 'Prompt is required.' }, 400);

    const apiKey = env.KIE_AI_API_KEY;
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (KIE_AI_API_KEY)' }, 500);
    }

    const requiredCredits = getRequiredCredits(resolution);
    creditMetadata = {
      model: INFINITALK_MODEL_ID,
      modelLabel: 'Infinitalk',
      providerModel: INFINITALK_PROVIDER_MODEL,
      mode: 'image-to-video',
      mediaType: 'video',
      resolution,
      requiredCredits,
      toolSlug: 'talking-avatar-creator',
      toolLabel: 'AI Talking Avatar',
    };

    creditContext = await consumeTalkingAvatarCredits(env, request, requiredCredits, creditMetadata);
    if (creditContext.response) return creditContext.response;

    const response = await fetch(`${KIE_AI_BASE}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: env.KIE_INFINITALK_MODEL || INFINITALK_PROVIDER_MODEL,
        input: {
          image_url: imageUrl,
          audio_url: audioUrl,
          prompt,
          resolution,
        },
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text();
      const credits = await refundTalkingAvatarCredits(env, creditContext, {
        ...creditMetadata,
        error: String(msg || 'Failed to create talking avatar task'),
      });
      console.error('KIE Infinitalk task creation failed', {
        status: response.status,
        error: String(msg || 'Failed to create talking avatar task'),
      });
      return jsonResponse({ error: GENERATION_SERVICE_UNAVAILABLE_MESSAGE, code: 'UPSTREAM_GENERATION_ERROR', credits }, response.status);
    }

    const taskId = result?.data?.taskId ?? result?.taskId;
    if (taskId) {
      const payload = { taskId, requiredCredits };
      if (creditContext?.consumption?.consumptionId) {
        await attachGenerationTaskIdToConsumption(
          env,
          creditContext.user.id,
          creditContext.consumption.consumptionId,
          taskId
        ).catch((error) => {
          console.error('Failed to bind talking avatar task to credit consumption', {
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
          model: INFINITALK_MODEL_ID,
          modelLabel: creditMetadata.modelLabel,
          mode: 'image-to-video',
          mediaType: 'video',
          toolSlug: creditMetadata.toolSlug,
          toolLabel: creditMetadata.toolLabel,
        };
      }
      return jsonResponse(payload);
    }

    const videoUrl = result?.data?.videoUrl ?? result?.videoUrl;
    if (videoUrl) {
      return jsonResponse({
        videoUrl,
        requiredCredits,
        ...(creditContext?.credits ? { credits: creditContext.credits } : {}),
      });
    }

    const credits = await refundTalkingAvatarCredits(env, creditContext, {
      ...creditMetadata,
      error: result?.message ?? result?.msg ?? 'Unexpected response format',
    });
    return jsonResponse({ error: GENERATION_SERVICE_UNAVAILABLE_MESSAGE, code: 'UPSTREAM_GENERATION_ERROR', credits }, 500);
  } catch (error) {
    const credits = await refundTalkingAvatarCredits(env, creditContext, {
      ...(creditMetadata || {}),
      error: error instanceof Error ? error.message : 'Internal server error',
    });
    return jsonResponse({
      error: error instanceof Error ? error.message : 'Internal server error',
      ...(credits ? { credits } : {}),
    }, 500);
  }
}
