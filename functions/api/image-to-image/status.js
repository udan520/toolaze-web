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
      error: message || 'Image generation failed',
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
    const state = data?.state;
    let imageUrl;

    if (data?.resultJson) {
      try {
        const parsed = typeof data.resultJson === 'string'
          ? JSON.parse(data.resultJson)
          : data.resultJson;
        const urls = parsed?.resultUrls;
        if (Array.isArray(urls) && urls.length > 0) {
          imageUrl = urls[0];
        }
      } catch {
        // ignore parse error
      }
    }

    const status = state === 'success' ? 'SUCCEEDED' : state === 'fail' ? 'FAILED' : 'PENDING';
    const message = data?.failMsg ?? data?.message;
    const creditRefund = status === 'FAILED'
      ? await refundFailedGenerationCredits(env, request, body, taskId, message)
      : null;

    return jsonResponse({
      status,
      imageUrl,
      message,
      ...(creditRefund || {}),
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
