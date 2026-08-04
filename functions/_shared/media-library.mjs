import { rewriteLegacyR2PublicUrl } from './r2-public-url.mjs';

const VIDEO_EXTENSIONS = new Set(['mp4', 'mov', 'webm', 'm4v', 'mkv']);
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function parseAdminEmailAllowlist(env = {}) {
  return String(env.MEDIA_LIBRARY_ADMIN_EMAILS || env.TOOLAZE_ADMIN_EMAILS || '')
    .split(/[,\n]/)
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isMediaLibraryAdminEmail(email, env = {}) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return parseAdminEmailAllowlist(env).includes(normalized);
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value) {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeMediaUrl(value, env) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (url.startsWith('/')) return url.startsWith('//') || url.length === 1 ? '' : url;

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? rewriteLegacyR2PublicUrl(url, env)
      : '';
  } catch {
    return '';
  }
}

function getUrlExtension(url) {
  try {
    return new URL(url, 'https://toolaze.local').pathname.split('.').pop()?.toLowerCase() || '';
  } catch {
    return String(url || '').split('.').pop()?.toLowerCase() || '';
  }
}

function inferMediaType(url, fallback = 'image') {
  const extension = getUrlExtension(url).replace(/[^a-z0-9]/g, '');
  if (VIDEO_EXTENSIONS.has(extension)) return 'video';
  if (IMAGE_EXTENSIONS.has(extension)) return 'image';
  return fallback === 'video' ? 'video' : 'image';
}

async function createAssetId(url) {
  const encoded = new TextEncoder().encode(String(url || '').trim());
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `asset_${hex.slice(0, 18)}`;
}

function buildTitle(record, sourceRole) {
  const tool = record.toolLabel || record.toolSlug || 'History';
  return `${tool} ${sourceRole === 'history_output' ? 'Output' : 'Input'}`;
}

function serializeHistoryRow(row, env) {
  const outputUrl = normalizeMediaUrl(row.output_url, env);
  const inputUrls = parseJsonArray(row.input_urls)
    .map((url) => normalizeMediaUrl(url, env))
    .filter(Boolean);

  return {
    id: row.id,
    userId: row.user_id,
    mediaType: row.media_type === 'video' ? 'video' : 'image',
    model: row.model || 'unknown',
    prompt: row.prompt || '',
    outputUrl,
    inputUrls,
    aspectRatio: row.aspect_ratio || null,
    resolution: row.resolution || null,
    outputFormat: row.output_format || null,
    nativeAudio: row.native_audio === 1,
    toolSlug: row.tool_slug || null,
    toolLabel: row.tool_label || null,
    sourcePath: row.source_path || null,
    createdAt: row.created_at || null,
  };
}

function buildMetadata(record) {
  return {
    aspectRatio: record.aspectRatio,
    resolution: record.resolution,
    outputFormat: record.outputFormat,
    nativeAudio: Boolean(record.nativeAudio),
  };
}

function serializeAssetForResponse(row) {
  const metadata = parseJsonObject(row.metadata);
  return {
    id: row.id,
    type: row.type,
    url: row.url,
    title: row.title,
    source: row.source,
    posterUrl: row.posterUrl || row.poster_url || metadata.posterUrl,
    sourceRole: row.sourceRole || row.source_role,
    sourceHistoryId: row.sourceHistoryId || row.source_history_id,
    sourceToolSlug: row.sourceToolSlug || row.source_tool_slug,
    sourceToolLabel: row.sourceToolLabel || row.source_tool_label,
    sourcePath: row.sourcePath || row.source_path,
    sourceModel: row.sourceModel || row.source_model,
    sourcePrompt: row.sourcePrompt || row.source_prompt,
    sourceUserEmail: row.sourceUserEmail || row.source_user_email,
    sourceCreatedAt: row.sourceCreatedAt || row.source_created_at,
    reviewStatus: row.reviewStatus || row.review_status || 'candidate',
    metadata,
    aiTags: parseJsonArray(row.aiTags || row.ai_tags),
    manualTags: parseJsonArray(row.manualTags || row.manual_tags),
    safetyTags: parseJsonArray(row.safetyTags || row.safety_tags),
    confidence: parseJsonObject(row.confidence),
    usageCount: Number(row.usageCount ?? row.usage_count ?? 0),
    createdAt: row.createdAt || row.created_at,
    updatedAt: row.updatedAt || row.updated_at,
  };
}

function clampAssetListLimit(value) {
  const limit = Number(value || 100);
  if (!Number.isFinite(limit)) return 100;
  return Math.min(Math.max(Math.trunc(limit), 1), 200);
}

function buildMediaAssetStats(assets) {
  return {
    total: assets.length,
    images: assets.filter((asset) => asset.type === 'image').length,
    videos: assets.filter((asset) => asset.type === 'video').length,
    approved: assets.filter((asset) => asset.reviewStatus === 'approved').length,
    needsReview: assets.filter((asset) => asset.reviewStatus === 'needs_review').length,
    candidates: assets.filter((asset) => asset.reviewStatus === 'candidate').length,
    rejected: assets.filter((asset) => asset.reviewStatus === 'rejected').length,
    history: assets.filter((asset) => asset.source === 'history').length,
    upload: assets.filter((asset) => asset.source === 'upload').length,
    generated: assets.filter((asset) => asset.source === 'generated').length,
  };
}

export async function listMediaLibraryAssets(env, options = {}) {
  const limit = clampAssetListLimit(options.limit);
  const where = [];
  const values = [];
  const type = String(options.type || 'all');
  const reviewStatus = String(options.reviewStatus || 'all');
  const query = String(options.query || '').trim().toLowerCase();

  if (type === 'image' || type === 'video') {
    where.push('type = ?');
    values.push(type);
  }
  if (['candidate', 'needs_review', 'approved', 'rejected'].includes(reviewStatus)) {
    where.push('review_status = ?');
    values.push(reviewStatus);
  }
  if (query) {
    where.push(`(
      lower(id) like ? or lower(url) like ? or lower(coalesce(title, '')) like ?
      or lower(coalesce(source_tool_label, '')) like ? or lower(coalesce(source_model, '')) like ?
      or lower(coalesce(source_prompt, '')) like ?
    )`);
    const like = `%${query}%`;
    values.push(like, like, like, like, like, like);
  }

  const sql = `
    select id, type, url, title, source, source_role, source_history_id,
      source_tool_slug, source_tool_label, source_path, source_model, source_prompt,
      source_user_email, source_created_at, review_status, metadata,
      ai_tags, manual_tags, safety_tags, confidence, usage_count, created_at, updated_at
    from media_library_assets
    ${where.length ? `where ${where.join(' and ')}` : ''}
    order by created_at desc
    limit ?
  `;
  const result = await env.DB.prepare(sql).bind(...values, limit).all();
  const assets = (result?.results || []).map(serializeAssetForResponse);

  return {
    ok: true,
    assets,
    stats: buildMediaAssetStats(assets),
  };
}

async function buildAssetRecord(record, user, sourceRole, url, now) {
  return {
    id: await createAssetId(url),
    type: inferMediaType(url, sourceRole === 'history_output' ? record.mediaType : 'image'),
    url,
    title: buildTitle(record, sourceRole),
    source: 'history',
    sourceRole,
    sourceHistoryId: record.id,
    sourceToolSlug: record.toolSlug,
    sourceToolLabel: record.toolLabel,
    sourcePath: record.sourcePath,
    sourceModel: record.model,
    sourcePrompt: record.prompt,
    sourceUserId: user.id,
    sourceUserEmail: user.email,
    sourceCreatedAt: record.createdAt,
    reviewStatus: 'candidate',
    metadata: buildMetadata(record),
    createdAt: now,
    updatedAt: now,
  };
}

async function insertAsset(env, asset) {
  const result = await env.DB.prepare(`
    insert or ignore into media_library_assets (
      id, type, url, title, source, source_role, source_history_id,
      source_tool_slug, source_tool_label, source_path, source_model, source_prompt,
      source_user_id, source_user_email, source_created_at, review_status, metadata,
      ai_tags, manual_tags, safety_tags, confidence, usage_count, created_at, updated_at
    )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    asset.id,
    asset.type,
    asset.url,
    asset.title,
    asset.source,
    asset.sourceRole,
    asset.sourceHistoryId,
    asset.sourceToolSlug,
    asset.sourceToolLabel,
    asset.sourcePath,
    asset.sourceModel,
    asset.sourcePrompt,
    asset.sourceUserId,
    asset.sourceUserEmail,
    asset.sourceCreatedAt,
    asset.reviewStatus,
    JSON.stringify(asset.metadata),
    '[]',
    '[]',
    '[]',
    '{}',
    0,
    asset.createdAt,
    asset.updatedAt,
  ).run();

  return Number(result?.meta?.changes || 0) > 0;
}

export async function importHistoryItemToMediaLibrary(env, user, historyId) {
  const id = String(historyId || '').trim();
  if (!id) {
    return { ok: false, status: 400, error: 'History item id is required.' };
  }

  const row = await env.DB.prepare(`
    select id, user_id, media_type, model, prompt, output_url, input_urls,
      aspect_ratio, resolution, output_format, native_audio, tool_slug, tool_label, source_path, created_at
    from generation_history
    where id = ? and user_id = ?
  `).bind(id, user.id).first();

  if (!row) {
    return { ok: false, status: 404, error: 'History item not found.' };
  }

  const record = serializeHistoryRow(row, env);
  const now = nowIso();
  const candidates = [
    { url: record.outputUrl, sourceRole: 'history_output' },
    ...record.inputUrls.map((url) => ({ url, sourceRole: 'history_input' })),
  ].filter((candidate) => candidate.url);
  const assets = [];
  let importedCount = 0;
  let skippedCount = 0;

  for (const candidate of candidates) {
    const asset = await buildAssetRecord(record, user, candidate.sourceRole, candidate.url, now);
    const inserted = await insertAsset(env, asset);
    if (inserted) {
      importedCount += 1;
      assets.push(serializeAssetForResponse(asset));
    } else {
      skippedCount += 1;
    }
  }

  return {
    ok: true,
    importedCount,
    skippedCount,
    assets,
  };
}
