import { getCurrentUser } from '../_shared/auth.mjs';
import {
  createGenerationHistoryItem,
  deleteGenerationHistoryItem,
  listGenerationHistory,
} from '../_shared/generation-history.mjs';
import { handleOptions, jsonResponse } from '../_shared/http.mjs';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') return handleOptions();

  const user = await getCurrentUser(env, request);
  if (!user) return jsonResponse({ error: 'Please sign in with Google to view history.' }, 401);

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || '100');
    const items = await listGenerationHistory(env, user.id, limit);
    return jsonResponse({ items });
  }

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const outputUrl = String(body.outputUrl || '').trim();
    const prompt = String(body.prompt || '').trim();
    const model = String(body.model || '').trim();

    if (!outputUrl.startsWith('http')) {
      return jsonResponse({ error: 'Output URL is required.' }, 400);
    }
    if (!prompt) {
      return jsonResponse({ error: 'Prompt is required.' }, 400);
    }
    if (!model) {
      return jsonResponse({ error: 'Model is required.' }, 400);
    }

    const item = await createGenerationHistoryItem(env, user.id, {
      mediaType: body.mediaType,
      model,
      prompt,
      outputUrl,
      inputUrls: body.inputUrls,
      aspectRatio: body.aspectRatio,
      resolution: body.resolution,
      outputFormat: body.outputFormat,
      toolSlug: body.toolSlug,
      toolLabel: body.toolLabel,
      sourcePath: body.sourcePath,
    });

    return jsonResponse({ item }, 201);
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const id = String(url.searchParams.get('id') || '').trim();
    if (!id) return jsonResponse({ error: 'History item id is required.' }, 400);

    const result = await deleteGenerationHistoryItem(env, user.id, id);
    if (!result.ok) return jsonResponse({ error: 'History item not found.' }, 404);

    return jsonResponse({ ok: true, deleted: result.deleted });
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'GET, POST, DELETE, OPTIONS' }, 405);
}
