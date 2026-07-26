/**
 * Cloudflare Pages Function: Nano Banana Pro 生图 - 查询任务状态
 * 部署后地址：https://toolaze-web.pages.dev/api/image-to-image/status
 * 需设置环境变量：KIE_AI_API_KEY
 */
import { getCurrentUser } from '../../_shared/auth.mjs';
import { getCreditSummary, refundCredits } from '../../_shared/credits.mjs';
import { getImageGenerationCreditRefundDescription } from '../../_shared/generation-credit-label.mjs';

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function isVideoGenerationModel(model) {
  return String(model || '').trim().toLowerCase() === 'grok-video-1-5';
}

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(String(url || '').trim());
}

function normalizeStatus(state) {
  const value = String(state || '').trim().toLowerCase();
  if (value === 'success' || value === 'succeeded' || value === 'completed') return 'SUCCEEDED';
  if (value === 'fail' || value === 'failed' || value === 'error') return 'FAILED';
  return 'PENDING';
}

function urlsFrom(value) {
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  if (!Array.isArray(value)) {
    if (value && typeof value === 'object') {
      return urlsFrom(value.url || value.videoUrl || value.video_url || value.imageUrl || value.image_url);
    }
    return [];
  }

  return value.flatMap((item) => urlsFrom(item));
}

function firstUrlFrom(value) {
  return urlsFrom(value)[0];
}

function firstVideoPreferredUrlFrom(value) {
  const urls = urlsFrom(value);
  return urls.find(isVideoUrl) || urls[0];
}

function parseResultJson(data) {
  if (!data?.resultJson) return null;

  try {
    return typeof data.resultJson === 'string'
      ? JSON.parse(data.resultJson)
      : data.resultJson;
  } catch {
    return null;
  }
}

function parseGenerationResultUrl(data, expectedMediaType) {
  const parsed = parseResultJson(data);

  if (expectedMediaType === 'video') {
    return firstVideoPreferredUrlFrom(data?.videoUrl)
      || firstVideoPreferredUrlFrom(data?.video_url)
      || firstVideoPreferredUrlFrom(data?.videos)
      || firstVideoPreferredUrlFrom(parsed?.videoUrls)
      || firstVideoPreferredUrlFrom(parsed?.video_urls)
      || firstVideoPreferredUrlFrom(parsed?.videos)
      || firstVideoPreferredUrlFrom(parsed?.resultUrls)
      || firstVideoPreferredUrlFrom(data?.resultUrls)
      || firstVideoPreferredUrlFrom(parsed?.url)
      || firstVideoPreferredUrlFrom(data?.url)
      || firstVideoPreferredUrlFrom(parsed?.videoUrl)
      || firstVideoPreferredUrlFrom(parsed?.video_url);
  }

  return firstUrlFrom(data?.imageUrl)
    || firstUrlFrom(data?.image_url)
    || firstUrlFrom(data?.images)
    || firstUrlFrom(parsed?.imageUrls)
    || firstUrlFrom(parsed?.image_urls)
    || firstUrlFrom(parsed?.images)
    || firstUrlFrom(parsed?.resultUrls)
    || firstUrlFrom(data?.resultUrls)
    || firstUrlFrom(parsed?.url)
    || firstUrlFrom(data?.url)
    || firstUrlFrom(parsed?.imageUrl)
    || firstUrlFrom(parsed?.image_url);
}

function getCreditHoldMediaType(body) {
  const creditHold = body?.creditHold;
  if (creditHold?.mediaType === 'video') return 'video';
  return isVideoGenerationModel(creditHold?.model) ? 'video' : 'image';
}

function getApiKey(env) {
  return env.KIE_AI_API_KEY;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function readCreditHold(body, taskId) {
  const creditHold = body?.creditHold;
  const requiredCredits = Number(creditHold?.requiredCredits);

  if (
    creditHold?.provider !== 'credit-ledger' ||
    creditHold?.taskId !== taskId ||
    !creditHold?.consumptionId ||
    !Number.isInteger(requiredCredits) ||
    requiredCredits <= 0
  ) {
    return null;
  }

  return {
    consumptionId: String(creditHold.consumptionId),
    requiredCredits,
    model: creditHold.model ? String(creditHold.model) : undefined,
    isImageToImage: Boolean(creditHold.isImageToImage),
    mediaType: creditHold.mediaType === 'video' ? 'video' : 'image',
  };
}

async function refundFailedGenerationCredits(env, request, body, taskId, message) {
  if (!env?.DB) return null;

  const creditHold = readCreditHold(body, taskId);
  if (!creditHold) return null;

  const user = await getCurrentUser(env, request);
  if (!user) return null;

  const refund = await refundCredits(env, user.id, creditHold.requiredCredits, {
    reason: 'image_generation_refund',
    description: getImageGenerationCreditRefundDescription(creditHold.model, creditHold.isImageToImage),
    consumptionId: creditHold.consumptionId,
    metadata: {
      taskId,
      model: creditHold.model,
      isImageToImage: creditHold.isImageToImage,
      error: message || 'Generation failed',
    },
  }).catch(() => null);

  if (!refund) return null;

  return {
    credits: await getCreditSummary(env, user.id),
    refundedCredits: refund.refunded,
  };
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
    const body = await request.json().catch(() => ({}));
    const taskId = body?.taskId;
    if (!taskId) {
      return jsonResponse({ error: 'Task ID is required' }, 400);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured' }, 500);
    }

    const response = await fetch(
      `${KIE_AI_BASE}/recordInfo?taskId=${encodeURIComponent(taskId)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const msg = result?.message ?? result?.msg ?? await response.text();
      return jsonResponse({ error: msg || 'Failed to get task status' }, response.status);
    }

    const data = result?.data ?? result;
    const expectedMediaType = getCreditHoldMediaType(body);
    const resultUrl = parseGenerationResultUrl(data, expectedMediaType);
    const status = normalizeStatus(data?.state ?? data?.status);
    const mediaType = expectedMediaType === 'video' || isVideoUrl(resultUrl) ? 'video' : 'image';
    const imageUrl = mediaType === 'image' ? resultUrl : undefined;
    const videoUrl = mediaType === 'video' ? resultUrl : undefined;
    const message = data?.failMsg ?? data?.message;
    const creditRefund = status === 'FAILED'
      ? await refundFailedGenerationCredits(env, request, body, taskId, message)
      : null;

    return jsonResponse({
      status,
      imageUrl,
      videoUrl,
      mediaType,
      message,
      ...(creditRefund || {}),
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
