/**
 * Cloudflare Pages Function: AI 视频生成 - 查询 Kie 任务状态
 * 部署后地址：https://toolaze-web.pages.dev/api/ai-video-generator/status
 * 需设置环境变量：KIE_AI_API_KEY
 */
import { getCurrentUser } from '../../_shared/auth.mjs';
import { getCreditSummary, refundCredits } from '../../_shared/credits.mjs';
import { getVideoGenerationCreditRefundDescription } from '../../_shared/generation-credit-label.mjs';
import {
  GENERATION_TASK_ACCESS_ERROR,
  verifyGenerationTaskAccess,
} from '../../_shared/generation-task-access.mjs';

const KIE_AI_BASE = 'https://api.kie.ai/api/v1/jobs';
const KIE_VEO_BASE = 'https://api.kie.ai/api/v1/veo';
const KIE_MOTION_CONTROL_FILE_FORMAT_MESSAGE =
  'KIE rejected one of the uploaded files. Use a JPG/JPEG/PNG character image over 300px with a 2:5 to 5:2 aspect ratio, and an MP4/MOV/MKV motion reference video within the selected orientation duration limit.';
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

function shouldUseCreditLedger(env) {
  return Boolean(env?.DB);
}

function normalizeStatus(state) {
  const value = String(state || '').toLowerCase();
  if (value === 'success' || value === 'succeeded' || value === 'completed') return 'SUCCEEDED';
  if (value === 'fail' || value === 'failed' || value === 'error') return 'FAILED';
  return 'PENDING';
}

function normalizeVeoStatus(successFlag) {
  if (Number(successFlag) === 1) return 'SUCCEEDED';
  if (Number(successFlag) === 2 || Number(successFlag) === 3) return 'FAILED';
  return 'PENDING';
}

function normalizeProviderFailureMessage(message) {
  const normalized = String(message || '').trim();
  if (/file\s*format\s*not\s*support/i.test(normalized)) {
    return KIE_MOTION_CONTROL_FILE_FORMAT_MESSAGE;
  }
  return normalized;
}

function firstUrlFrom(value) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (!Array.isArray(value)) return undefined;

  for (const item of value) {
    if (typeof item === 'string' && item.trim()) return item.trim();
    if (item && typeof item === 'object') {
      const url = item.url || item.videoUrl || item.video_url;
      if (typeof url === 'string' && url.trim()) return url.trim();
    }
  }

  return undefined;
}

function parseVideoUrl(data) {
  const directUrl = firstUrlFrom(data?.videoUrl || data?.video_url || data?.url || data?.resultUrls);
  if (directUrl) return directUrl;

  if (!data?.resultJson) return undefined;

  try {
    const parsed = typeof data.resultJson === 'string'
      ? JSON.parse(data.resultJson)
      : data.resultJson;

    return firstUrlFrom(parsed?.videoUrls)
      || firstUrlFrom(parsed?.video_urls)
      || firstUrlFrom(parsed?.videos)
      || firstUrlFrom(parsed?.resultUrls)
      || firstUrlFrom(parsed?.url)
      || firstUrlFrom(parsed?.videoUrl);
  } catch {
    return undefined;
  }
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
    modelLabel: creditHold.modelLabel ? String(creditHold.modelLabel) : undefined,
    mode: creditHold.mode === 'image-to-video' ? 'image-to-video' : 'text-to-video',
    toolSlug: creditHold.toolSlug ? String(creditHold.toolSlug) : undefined,
    toolLabel: creditHold.toolLabel ? String(creditHold.toolLabel) : undefined,
  };
}

async function refundFailedVideoCredits(env, user, body, taskId, message) {
  if (!user || !shouldUseCreditLedger(env)) return null;

  const creditHold = readCreditHold(body, taskId);
  if (!creditHold) return null;

  const refund = await refundCredits(env, user.id, creditHold.requiredCredits, {
    reason: 'video_generation_refund',
    description: getVideoGenerationCreditRefundDescription(creditHold.model, creditHold.mode, creditHold),
    consumptionId: creditHold.consumptionId,
    metadata: {
      taskId,
      model: creditHold.model,
      modelLabel: creditHold.modelLabel,
      mode: creditHold.mode,
      mediaType: 'video',
      toolSlug: creditHold.toolSlug,
      toolLabel: creditHold.toolLabel,
      error: message || 'Video generation failed',
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
    const taskId = String(body?.taskId || '').trim();
    if (!taskId) {
      return jsonResponse({ error: 'Task ID is required' }, 400);
    }

    const user = shouldUseCreditLedger(env)
      ? await getCurrentUser(env, request)
      : null;
    if (shouldUseCreditLedger(env) && !user) {
      return jsonResponse({ error: 'Please sign in with Google to check video status.' }, 401);
    }
    if (
      shouldUseCreditLedger(env)
      && !(await verifyGenerationTaskAccess(env, user.id, body, taskId))
    ) {
      return jsonResponse({ error: GENERATION_TASK_ACCESS_ERROR }, 403);
    }

    const apiKey = getApiKey(env);
    if (!apiKey) {
      return jsonResponse({ error: 'API key not configured (KIE_AI_API_KEY)' }, 500);
    }

    const isVeoTask = body?.taskProvider === 'veo';
    const response = await fetch(
      isVeoTask
        ? `${KIE_VEO_BASE}/record-info?taskId=${encodeURIComponent(taskId)}`
        : `${KIE_AI_BASE}/recordInfo?taskId=${encodeURIComponent(taskId)}`,
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
      return jsonResponse({ error: msg || 'Failed to get video task status' }, response.status);
    }

    const data = result?.data ?? result;
    const veoResponse = isVeoTask ? data?.response : null;
    const status = isVeoTask
      ? normalizeVeoStatus(data?.successFlag)
      : normalizeStatus(data?.state ?? data?.status);
    const videoUrl = parseVideoUrl(veoResponse || data);
    const message = normalizeProviderFailureMessage(data?.failMsg ?? data?.message);
    const creditRefund = status === 'FAILED'
      ? await refundFailedVideoCredits(env, user, body, taskId, message)
      : null;

    return jsonResponse({
      status,
      ...(videoUrl && { videoUrl }),
      ...(message ? { message } : {}),
      ...(creditRefund || {}),
    });
  } catch (e) {
    return jsonResponse({
      error: e instanceof Error ? e.message : 'Internal server error',
    }, 500);
  }
}
