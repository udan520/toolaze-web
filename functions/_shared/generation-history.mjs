function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function normalizeHistoryReferenceImageUrl(url) {
  const imageUrl = typeof url === 'string' ? url.trim() : '';
  if (!imageUrl) return '';
  if (imageUrl.startsWith('/')) return imageUrl.startsWith('//') || imageUrl.length === 1 ? '' : imageUrl;

  try {
    const parsed = new URL(imageUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? imageUrl : '';
  } catch {
    return '';
  }
}

export async function createGenerationHistoryItem(env, userId, item) {
  const now = nowIso();
  const id = createId('gen');
  const inputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.map(normalizeHistoryReferenceImageUrl).filter(Boolean)
    : [];
  const toolSlug = String(item.toolSlug || '').trim() || null;
  const toolLabel = String(item.toolLabel || '').trim() || null;
  const sourcePath = String(item.sourcePath || '').trim() || null;

  await env.DB.prepare(`
    insert into generation_history (
      id, user_id, media_type, model, prompt, output_url, input_urls,
      aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path, created_at
    )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    userId,
    item.mediaType === 'video' ? 'video' : 'image',
    String(item.model || '').trim() || 'unknown',
    String(item.prompt || '').trim(),
    String(item.outputUrl || '').trim(),
    inputUrls.length > 0 ? JSON.stringify(inputUrls) : null,
    item.aspectRatio || null,
    item.resolution || null,
    item.outputFormat || null,
    item.nativeAudio === true ? 1 : 0,
    toolSlug,
    toolLabel,
    sourcePath,
    now
  ).run();

  return {
    id,
    mediaType: item.mediaType === 'video' ? 'video' : 'image',
    model: String(item.model || '').trim() || 'unknown',
    prompt: String(item.prompt || '').trim(),
    outputUrl: String(item.outputUrl || '').trim(),
    inputUrls,
    aspectRatio: item.aspectRatio || null,
    resolution: item.resolution || null,
    outputFormat: item.outputFormat || null,
    nativeAudio: item.nativeAudio === true,
    toolSlug,
    toolLabel,
    sourcePath,
    createdAt: now,
  };
}

export async function listGenerationHistory(env, userId, limit = 100) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200));
  const result = await env.DB.prepare(`
    select id, media_type, model, prompt, output_url, input_urls,
      aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path, created_at
    from generation_history
    where user_id = ?
    order by created_at desc
    limit ?
  `).bind(userId, safeLimit).all();

  return (result?.results || []).map((row) => ({
    id: row.id,
    mediaType: row.media_type,
    model: row.model,
    prompt: row.prompt,
    outputUrl: row.output_url,
    inputUrls: parseJsonArray(row.input_urls),
    aspectRatio: row.aspect_ratio,
    resolution: row.resolution,
    outputFormat: row.output_format,
    nativeAudio: row.native_audio === 1,
    toolSlug: row.tool_slug,
    toolLabel: row.tool_label,
    sourcePath: row.source_path,
    createdAt: row.created_at,
  }));
}

export async function deleteGenerationHistoryItem(env, userId, itemId) {
  const id = String(itemId || '').trim();
  if (!id) return { ok: false, deleted: 0 };

  const result = await env.DB.prepare(`
    delete from generation_history
    where id = ? and user_id = ?
  `).bind(id, userId).run();

  const deleted = Number(result?.meta?.changes || 0);
  return {
    ok: deleted > 0,
    deleted,
  };
}
