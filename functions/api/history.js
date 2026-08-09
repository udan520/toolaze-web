import { getCurrentUser } from '../_shared/auth.mjs';
import {
  createGenerationHistoryItem,
  deleteGenerationHistoryItem,
  listGenerationHistory,
} from '../_shared/generation-history.mjs';
import { handleOptions, jsonResponse } from '../_shared/http.mjs';
import {
  deleteGenerationAttempt,
  deleteGenerationAttemptsForHistory,
  linkGenerationAttemptHistory,
  listGenerationAttempts,
  updateGenerationAttemptStatus,
} from '../_shared/generation-attempts.mjs';

function buildAttemptStatusRequest(attempt) {
  if (
    attempt.status !== 'pending'
    || !attempt.taskId
    || !attempt.consumptionId
    || !Number.isInteger(attempt.requiredCredits)
    || attempt.requiredCredits <= 0
  ) return null;

  return {
    endpoint: attempt.taskProvider === 'image-to-image' || attempt.mediaType === 'image'
      ? '/api/image-to-image/status'
      : '/api/ai-video-generator/status',
    taskId: attempt.taskId,
    taskProvider: attempt.taskProvider || null,
    creditHold: {
      provider: 'credit-ledger',
      taskId: attempt.taskId,
      consumptionId: attempt.consumptionId,
      requiredCredits: attempt.requiredCredits,
      model: attempt.model,
      mediaType: attempt.mediaType,
      toolSlug: attempt.toolSlug,
      toolLabel: attempt.toolLabel,
    },
  };
}

function mergeHistoryItems(historyItems, attempts, limit) {
  const completed = historyItems.map((item) => ({
    ...item,
    status: 'succeeded',
    updatedAt: item.createdAt,
  }));
  const lifecycle = attempts
    .filter((attempt) => !attempt.historyId)
    .map((attempt) => ({
      ...attempt,
      failureReason: null,
      statusRequest: buildAttemptStatusRequest(attempt),
    }));

  return [...completed, ...lifecycle]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, limit);
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google to view history.' }, 401);

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const limit = Math.max(1, Math.min(Number(url.searchParams.get('limit') || '100') || 100, 200));
    const [historyItems, attempts] = await Promise.all([
      listGenerationHistory(env, user.id, limit),
      listGenerationAttempts(env, user.id, limit),
    ]);
    const items = mergeHistoryItems(historyItems, attempts, limit);
    return jsonResponse({ items });
  }

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const mediaType = body.mediaType === 'video' ? 'video' : 'image';
    const outputUrl = String(body.outputUrl || '').trim();
    const prompt = String(body.prompt || '').trim();
    const model = String(body.model || '').trim();
    const taskId = String(body.taskId || '').trim();

    if (!outputUrl.startsWith('http')) {
      return jsonResponse({ error: 'Output URL is required.' }, 400);
    }
    if (mediaType !== 'video' && !prompt) {
      return jsonResponse({ error: 'Prompt is required.' }, 400);
    }
    if (!model) {
      return jsonResponse({ error: 'Model is required.' }, 400);
    }

    const item = await createGenerationHistoryItem(env, user.id, {
      taskId,
      mediaType,
      model,
      prompt,
      outputUrl,
      inputUrls: body.inputUrls,
      aspectRatio: body.aspectRatio,
      resolution: body.resolution,
      outputFormat: body.outputFormat,
      nativeAudio: body.nativeAudio,
      toolSlug: body.toolSlug,
      toolLabel: body.toolLabel,
      sourcePath: body.sourcePath,
    });

    if (taskId) {
      await updateGenerationAttemptStatus(env, {
        userId: user.id,
        taskId,
        status: 'succeeded',
        outputUrl: item.outputUrl,
      });
      await linkGenerationAttemptHistory(env, {
        userId: user.id,
        taskId,
        historyId: item.id,
      });
    }

    return jsonResponse({ item }, 201);
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const id = String(url.searchParams.get('id') || '').trim();
    if (!id) return jsonResponse({ error: 'History item id is required.' }, 400);

    if (id.startsWith('gen_attempt_')) {
      const deleted = await deleteGenerationAttempt(env, user.id, id);
      if (!deleted) return jsonResponse({ error: 'History item not found.' }, 404);
      return jsonResponse({ ok: true, deleted });
    }

    const result = await deleteGenerationHistoryItem(env, user.id, id);
    if (!result.ok) {
      const deletedAttempt = await deleteGenerationAttempt(env, user.id, id);
      if (!deletedAttempt) return jsonResponse({ error: 'History item not found.' }, 404);
      return jsonResponse({ ok: true, deleted: deletedAttempt });
    }
    await deleteGenerationAttemptsForHistory(env, user.id, id);

    return jsonResponse({ ok: true, deleted: result.deleted });
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'GET, POST, DELETE, OPTIONS' }, 405);
}
