import { rewriteLegacyR2PublicUrl } from './r2-public-url.mjs';

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

function normalizeHistoryReferenceImageUrl(url, env) {
  const imageUrl = typeof url === 'string' ? url.trim() : '';
  if (!imageUrl) return '';
  if (imageUrl.startsWith('/')) return imageUrl.startsWith('//') || imageUrl.length === 1 ? '' : imageUrl;

  try {
    const parsed = new URL(imageUrl);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? rewriteLegacyR2PublicUrl(imageUrl, env)
      : '';
  } catch {
    return '';
  }
}

function normalizeNullableText(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeCountryCode(value) {
  const trimmed = normalizeNullableText(value);
  if (!trimmed || !/^[A-Za-z]{2}$/.test(trimmed)) return null;
  const country = trimmed.toUpperCase();
  return country === 'XX' ? null : country;
}

function isMissingRequestMetadataColumnError(error) {
  return /no such column:\s*(?:request_ip|request_country)|table generation_history has no column named (?:request_ip|request_country)/i.test(
    error instanceof Error ? error.message : String(error),
  );
}

export async function createGenerationHistoryItem(env, userId, item) {
  const now = nowIso();
  const taskId = String(item.taskId || '').trim();
  const id = taskId
    ? `gen_task_${encodeURIComponent(userId)}_${encodeURIComponent(taskId)}`
    : createId('gen');
  const outputUrl = rewriteLegacyR2PublicUrl(String(item.outputUrl || '').trim(), env);
  const inputUrls = Array.isArray(item.inputUrls)
    ? item.inputUrls.map((url) => normalizeHistoryReferenceImageUrl(url, env)).filter(Boolean)
    : [];
  const toolSlug = String(item.toolSlug || '').trim() || null;
  const toolLabel = String(item.toolLabel || '').trim() || null;
  const sourcePath = String(item.sourcePath || '').trim() || null;
  const requestIp = normalizeNullableText(item.requestIp);
  const requestCountry = normalizeCountryCode(item.requestCountry);

  await insertGenerationHistoryRow(env, {
    id,
    userId,
    mediaType: item.mediaType === 'video' ? 'video' : 'image',
    model: String(item.model || '').trim() || 'unknown',
    prompt: String(item.prompt || '').trim(),
    outputUrl,
    inputUrls: inputUrls.length > 0 ? JSON.stringify(inputUrls) : null,
    aspectRatio: item.aspectRatio || null,
    resolution: item.resolution || null,
    outputFormat: item.outputFormat || null,
    nativeAudio: item.nativeAudio === true ? 1 : 0,
    toolSlug,
    toolLabel,
    sourcePath,
    requestIp,
    requestCountry,
    createdAt: now,
  });

  return {
    id,
    mediaType: item.mediaType === 'video' ? 'video' : 'image',
    model: String(item.model || '').trim() || 'unknown',
    prompt: String(item.prompt || '').trim(),
    outputUrl,
    inputUrls,
    aspectRatio: item.aspectRatio || null,
    resolution: item.resolution || null,
    outputFormat: item.outputFormat || null,
    nativeAudio: item.nativeAudio === true,
    toolSlug,
    toolLabel,
    sourcePath,
    requestIp,
    requestCountry,
    createdAt: now,
  };
}

async function insertGenerationHistoryRow(env, values) {
  try {
    await env.DB.prepare(`
      insert into generation_history (
        id, user_id, media_type, model, prompt, output_url, input_urls,
        aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path,
        request_ip, request_country, created_at
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      on conflict(id) do update set
        media_type = excluded.media_type,
        model = excluded.model,
        prompt = excluded.prompt,
        output_url = excluded.output_url,
        input_urls = excluded.input_urls,
        aspect_ratio = excluded.aspect_ratio,
        resolution = excluded.resolution,
        output_format = excluded.output_format,
        native_audio = excluded.native_audio,
        tool_slug = excluded.tool_slug,
        tool_label = excluded.tool_label,
        source_path = excluded.source_path,
        request_ip = excluded.request_ip,
        request_country = excluded.request_country
    `).bind(
      values.id,
      values.userId,
      values.mediaType,
      values.model,
      values.prompt,
      values.outputUrl,
      values.inputUrls,
      values.aspectRatio,
      values.resolution,
      values.outputFormat,
      values.nativeAudio,
      values.toolSlug,
      values.toolLabel,
      values.sourcePath,
      values.requestIp,
      values.requestCountry,
      values.createdAt
    ).run();
  } catch (error) {
    if (!isMissingRequestMetadataColumnError(error)) throw error;

    await env.DB.prepare(`
      insert into generation_history (
        id, user_id, media_type, model, prompt, output_url, input_urls,
        aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path, created_at
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      on conflict(id) do update set
        media_type = excluded.media_type,
        model = excluded.model,
        prompt = excluded.prompt,
        output_url = excluded.output_url,
        input_urls = excluded.input_urls,
        aspect_ratio = excluded.aspect_ratio,
        resolution = excluded.resolution,
        output_format = excluded.output_format,
        native_audio = excluded.native_audio,
        tool_slug = excluded.tool_slug,
        tool_label = excluded.tool_label,
        source_path = excluded.source_path
    `).bind(
      values.id,
      values.userId,
      values.mediaType,
      values.model,
      values.prompt,
      values.outputUrl,
      values.inputUrls,
      values.aspectRatio,
      values.resolution,
      values.outputFormat,
      values.nativeAudio,
      values.toolSlug,
      values.toolLabel,
      values.sourcePath,
      values.createdAt
    ).run();
  }
}

export async function listGenerationHistory(env, userId, limit = 100) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200));
  const result = await listGenerationHistoryRows(env, userId, safeLimit);

  return (result?.results || []).map((row) => ({
    id: row.id,
    mediaType: row.media_type,
    model: row.model,
    prompt: row.prompt,
    outputUrl: rewriteLegacyR2PublicUrl(row.output_url, env),
    inputUrls: parseJsonArray(row.input_urls)
      .map((url) => normalizeHistoryReferenceImageUrl(url, env))
      .filter(Boolean),
    aspectRatio: row.aspect_ratio,
    resolution: row.resolution,
    outputFormat: row.output_format,
    nativeAudio: row.native_audio === 1,
    toolSlug: row.tool_slug,
    toolLabel: row.tool_label,
    sourcePath: row.source_path,
    requestIp: normalizeNullableText(row.request_ip),
    requestCountry: normalizeCountryCode(row.request_country),
    createdAt: row.created_at,
  }));
}

async function listGenerationHistoryRows(env, userId, safeLimit) {
  try {
    return await env.DB.prepare(`
      select id, media_type, model, prompt, output_url, input_urls,
        aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path,
        request_ip, request_country, created_at
      from generation_history
      where user_id = ?
      order by created_at desc
      limit ?
    `).bind(userId, safeLimit).all();
  } catch (error) {
    if (!isMissingRequestMetadataColumnError(error)) throw error;

    return env.DB.prepare(`
      select id, media_type, model, prompt, output_url, input_urls,
        aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path, created_at
      from generation_history
      where user_id = ?
      order by created_at desc
      limit ?
    `).bind(userId, safeLimit).all();
  }
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
