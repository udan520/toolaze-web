const PAGE_DEMO_ALL_LOCALES = 'all';
const PAGE_DEMO_PLACEMENTS = new Set(['hero_demo', 'default_reference', 'prompt_example']);
const PAGE_DEMO_APPLY_MODES = new Set(['demo_only', 'demo_with_parameters']);
const PAGE_DEMO_STATUSES = new Set(['draft', 'published', 'archived']);

const PAGE_DEMO_COLUMNS = `
  id, page_slug, locale, placement, apply_mode, title, asset, input_assets,
  prompt, model, params, source_history_id, status, version, created_at,
  updated_at, published_at
`;

function nowIso() {
  return new Date().toISOString();
}

function normalizeRequiredString(value, field) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(`Missing ${field}.`);
  return text;
}

function normalizeOptionalString(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text || undefined;
}

function normalizePageSlug(value) {
  const text = normalizeRequiredString(value, 'pageSlug')
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/[?#].*$/, '')
    .replace(/^\/+|\/+$/g, '')
    .trim()
    .toLowerCase();
  if (!/^[a-z0-9][a-z0-9/_-]*$/.test(text)) throw new Error('Invalid pageSlug.');
  return text;
}

function normalizeLocale(value) {
  const text = normalizeOptionalString(value) || PAGE_DEMO_ALL_LOCALES;
  if (text.toLowerCase() === PAGE_DEMO_ALL_LOCALES) return PAGE_DEMO_ALL_LOCALES;
  if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(text)) throw new Error('Invalid locale.');
  return text;
}

function normalizePlacement(value) {
  if (PAGE_DEMO_PLACEMENTS.has(value)) return value;
  throw new Error('Invalid placement.');
}

function normalizeApplyMode(value) {
  return PAGE_DEMO_APPLY_MODES.has(value) ? value : 'demo_only';
}

function normalizeStatus(value) {
  return PAGE_DEMO_STATUSES.has(value) ? value : 'draft';
}

function normalizeJsonObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([key, entry]) => key.trim() && entry !== null && entry !== undefined && entry !== ''),
  );
}

function normalizeAssetSnapshot(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Missing ${field}.`);
  return {
    id: normalizeRequiredString(value.id, `${field}.id`),
    type: value.type === 'video' ? 'video' : 'image',
    url: normalizeRequiredString(value.url, `${field}.url`),
    ...(normalizeOptionalString(value.posterUrl) ? { posterUrl: normalizeOptionalString(value.posterUrl) } : {}),
    ...(normalizeOptionalString(value.title) ? { title: normalizeOptionalString(value.title) } : {}),
  };
}

function safeJsonParse(value, fallback) {
  if (value && typeof value === 'object') return value;
  try {
    return JSON.parse(String(value || ''));
  } catch {
    return fallback;
  }
}

function serializeJson(value) {
  return JSON.stringify(value ?? null);
}

async function createAssignmentId(pageSlug, locale, placement, assetId) {
  const payload = `${pageSlug}|${locale}|${placement}|${assetId}|${Date.now()}|${Math.random()}`;
  const encoded = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const hex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return `demo_${hex.slice(0, 18)}`;
}

function serializeAssignment(row) {
  const applyMode = normalizeApplyMode(row.apply_mode || row.applyMode);
  const shouldCarryGenerationParameters = applyMode === 'demo_with_parameters';
  return {
    id: normalizeRequiredString(row.id, 'id'),
    pageSlug: normalizePageSlug(row.page_slug || row.pageSlug),
    locale: normalizeLocale(row.locale),
    placement: normalizePlacement(row.placement),
    applyMode,
    ...(normalizeOptionalString(row.title) ? { title: normalizeOptionalString(row.title) } : {}),
    asset: normalizeAssetSnapshot(safeJsonParse(row.asset, row.asset), 'asset'),
    inputAssets: shouldCarryGenerationParameters
      ? (Array.isArray(safeJsonParse(row.input_assets || row.inputAssets, [])) ? safeJsonParse(row.input_assets || row.inputAssets, []) : [])
        .map((asset, index) => normalizeAssetSnapshot(asset, `inputAssets[${index}]`))
      : [],
    ...(shouldCarryGenerationParameters && normalizeOptionalString(row.prompt) ? { prompt: normalizeOptionalString(row.prompt) } : {}),
    ...(shouldCarryGenerationParameters && normalizeOptionalString(row.model) ? { model: normalizeOptionalString(row.model) } : {}),
    params: shouldCarryGenerationParameters ? normalizeJsonObject(safeJsonParse(row.params, {})) : {},
    ...(normalizeOptionalString(row.source_history_id || row.sourceHistoryId) ? { sourceHistoryId: normalizeOptionalString(row.source_history_id || row.sourceHistoryId) } : {}),
    status: normalizeStatus(row.status),
    version: Math.max(1, Number(row.version) || 1),
    createdAt: normalizeOptionalString(row.created_at || row.createdAt) || nowIso(),
    updatedAt: normalizeOptionalString(row.updated_at || row.updatedAt) || normalizeOptionalString(row.created_at || row.createdAt) || nowIso(),
    ...(normalizeOptionalString(row.published_at || row.publishedAt) ? { publishedAt: normalizeOptionalString(row.published_at || row.publishedAt) } : {}),
  };
}

function sortAssignments(assignments) {
  const ranks = { draft: 0, published: 1, archived: 2 };
  return [...assignments].sort((left, right) => {
    const rankDiff = (ranks[left.status] ?? 9) - (ranks[right.status] ?? 9);
    if (rankDiff) return rankDiff;
    const timeDiff = Date.parse(right.updatedAt || '') - Date.parse(left.updatedAt || '');
    if (Number.isFinite(timeDiff) && timeDiff) return timeDiff;
    return left.id.localeCompare(right.id);
  });
}

function getPageSlugCandidates(value) {
  const slug = normalizePageSlug(value);
  const candidates = [slug];
  if (slug && !slug.startsWith('model/')) candidates.push(`model/${slug}`);
  if (slug.startsWith('model/')) candidates.push(slug.replace(/^model\//, ''));
  return Array.from(new Set(candidates.filter(Boolean)));
}

function filterPublishedAssignments(assignments, options = {}) {
  const pageSlugs = getPageSlugCandidates(options.pageSlug);
  const locale = normalizeLocale(options.locale);
  const selected = new Map();

  for (const placement of PAGE_DEMO_PLACEMENTS) {
    const exact = assignments.find((assignment) => (
      assignment.status === 'published'
      && pageSlugs.includes(assignment.pageSlug)
      && assignment.locale === locale
      && assignment.placement === placement
    ));
    const fallback = assignments.find((assignment) => (
      assignment.status === 'published'
      && pageSlugs.includes(assignment.pageSlug)
      && assignment.locale === PAGE_DEMO_ALL_LOCALES
      && assignment.placement === placement
    ));
    const assignment = exact || fallback;
    if (assignment) selected.set(placement, assignment);
  }

  return Array.from(selected.values());
}

async function readAllAssignments(env, status) {
  const where = status ? 'where status = ?' : '';
  const statement = env.DB.prepare(`
    select ${PAGE_DEMO_COLUMNS}
    from page_demo_assignments
    ${where}
    order by
      case status when 'draft' then 0 when 'published' then 1 else 2 end,
      updated_at desc
    limit 500
  `);
  const result = status ? await statement.bind(status).all() : await statement.all();
  return sortAssignments((result?.results || []).map(serializeAssignment));
}

async function findAssignmentById(env, assignmentId) {
  return env.DB.prepare(`
    select ${PAGE_DEMO_COLUMNS}
    from page_demo_assignments
    where id = ?
    limit 1
  `).bind(assignmentId).first();
}

async function findDraftForSlot(env, pageSlug, locale, placement) {
  return env.DB.prepare(`
    select ${PAGE_DEMO_COLUMNS}
    from page_demo_assignments
    where status = 'draft' and page_slug = ? and locale = ? and placement = ?
    limit 1
  `).bind(pageSlug, locale, placement).first();
}

async function saveAssignmentRow(env, assignment) {
  await env.DB.prepare(`
    insert into page_demo_assignments (
      id, page_slug, locale, placement, apply_mode, title, asset, input_assets,
      prompt, model, params, source_history_id, status, version, created_at,
      updated_at, published_at
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    on conflict(id) do update set
      page_slug = excluded.page_slug,
      locale = excluded.locale,
      placement = excluded.placement,
      apply_mode = excluded.apply_mode,
      title = excluded.title,
      asset = excluded.asset,
      input_assets = excluded.input_assets,
      prompt = excluded.prompt,
      model = excluded.model,
      params = excluded.params,
      source_history_id = excluded.source_history_id,
      status = excluded.status,
      version = excluded.version,
      updated_at = excluded.updated_at,
      published_at = excluded.published_at
  `).bind(
    assignment.id,
    assignment.pageSlug,
    assignment.locale,
    assignment.placement,
    assignment.applyMode,
    assignment.title || null,
    serializeJson(assignment.asset),
    serializeJson(assignment.inputAssets || []),
    assignment.prompt || null,
    assignment.model || null,
    serializeJson(assignment.params || {}),
    assignment.sourceHistoryId || null,
    assignment.status,
    assignment.version,
    assignment.createdAt,
    assignment.updatedAt,
    assignment.publishedAt || null,
  ).run();
}

export async function listPageDemoAssignments(env, options = {}) {
  const status = PAGE_DEMO_STATUSES.has(options.status) ? options.status : undefined;
  return {
    ok: true,
    assignments: await readAllAssignments(env, status),
  };
}

export async function listPublishedPageDemoAssignments(env, options = {}) {
  const assignments = await readAllAssignments(env, 'published');
  return {
    ok: true,
    assignments: filterPublishedAssignments(assignments, options),
  };
}

export async function saveDraftPageDemoAssignment(env, input, now = nowIso()) {
  const pageSlug = normalizePageSlug(input.pageSlug);
  const locale = normalizeLocale(input.locale);
  const placement = normalizePlacement(input.placement);
  const applyMode = normalizeApplyMode(input.applyMode);
  const shouldCarryGenerationParameters = applyMode === 'demo_with_parameters';
  const asset = normalizeAssetSnapshot(input.asset, 'asset');
  const previousRow = await findDraftForSlot(env, pageSlug, locale, placement);
  const previous = previousRow ? serializeAssignment(previousRow) : null;
  const assignment = {
    id: previous?.id || await createAssignmentId(pageSlug, locale, placement, asset.id),
    pageSlug,
    locale,
    placement,
    applyMode,
    ...(normalizeOptionalString(input.title) ? { title: normalizeOptionalString(input.title) } : {}),
    asset,
    inputAssets: shouldCarryGenerationParameters && Array.isArray(input.inputAssets)
      ? input.inputAssets.map((item, index) => normalizeAssetSnapshot(item, `inputAssets[${index}]`))
      : [],
    ...(shouldCarryGenerationParameters && normalizeOptionalString(input.prompt) ? { prompt: normalizeOptionalString(input.prompt) } : {}),
    ...(shouldCarryGenerationParameters && normalizeOptionalString(input.model) ? { model: normalizeOptionalString(input.model) } : {}),
    params: shouldCarryGenerationParameters ? normalizeJsonObject(input.params) : {},
    ...(normalizeOptionalString(input.sourceHistoryId) ? { sourceHistoryId: normalizeOptionalString(input.sourceHistoryId) } : {}),
    status: 'draft',
    version: (previous?.version || 0) + 1,
    createdAt: previous?.createdAt || now,
    updatedAt: now,
  };

  await saveAssignmentRow(env, assignment);
  return {
    ok: true,
    assignment,
    assignments: await readAllAssignments(env),
  };
}

export async function updateDraftPageDemoAssignment(env, input, now = nowIso()) {
  const currentRow = await findAssignmentById(env, String(input.assignmentId || '').trim());
  if (!currentRow) return { ok: false, status: 404, error: 'Page demo assignment not found.' };
  const current = serializeAssignment(currentRow);
  if (current.status !== 'draft') return { ok: false, status: 400, error: 'Only draft page demo assignments can be edited.' };

  const applyMode = normalizeApplyMode(input.applyMode || current.applyMode);
  const shouldCarryGenerationParameters = applyMode === 'demo_with_parameters';
  const assignment = {
    ...current,
    pageSlug: input.pageSlug === undefined ? current.pageSlug : normalizePageSlug(input.pageSlug),
    locale: input.locale === undefined ? current.locale : normalizeLocale(input.locale),
    placement: input.placement === undefined ? current.placement : normalizePlacement(input.placement),
    applyMode,
    title: Object.prototype.hasOwnProperty.call(input, 'title') ? normalizeOptionalString(input.title) : current.title,
    asset: input.asset ? normalizeAssetSnapshot(input.asset, 'asset') : current.asset,
    inputAssets: shouldCarryGenerationParameters
      ? (Array.isArray(input.inputAssets) ? input.inputAssets.map((item, index) => normalizeAssetSnapshot(item, `inputAssets[${index}]`)) : current.inputAssets)
      : [],
    prompt: shouldCarryGenerationParameters
      ? (Object.prototype.hasOwnProperty.call(input, 'prompt') ? normalizeOptionalString(input.prompt) : current.prompt)
      : undefined,
    model: shouldCarryGenerationParameters
      ? (Object.prototype.hasOwnProperty.call(input, 'model') ? normalizeOptionalString(input.model) : current.model)
      : undefined,
    params: shouldCarryGenerationParameters
      ? (Object.prototype.hasOwnProperty.call(input, 'params') ? normalizeJsonObject(input.params) : current.params)
      : {},
    sourceHistoryId: Object.prototype.hasOwnProperty.call(input, 'sourceHistoryId')
      ? normalizeOptionalString(input.sourceHistoryId)
      : current.sourceHistoryId,
    version: current.version + 1,
    updatedAt: now,
  };

  await saveAssignmentRow(env, assignment);
  return {
    ok: true,
    assignment,
    assignments: await readAllAssignments(env),
  };
}

export async function publishPageDemoAssignment(env, assignmentId, now = nowIso()) {
  const currentRow = await findAssignmentById(env, String(assignmentId || '').trim());
  if (!currentRow) return { ok: false, status: 404, error: 'Page demo assignment not found.' };
  const current = serializeAssignment(currentRow);

  await env.DB.prepare(`
    update page_demo_assignments
    set status = 'archived', updated_at = ?
    where status = 'published'
      and page_slug = ?
      and locale = ?
      and placement = ?
      and id <> ?
  `).bind(now, current.pageSlug, current.locale, current.placement, current.id).run();

  await env.DB.prepare(`
    update page_demo_assignments
    set status = ?, updated_at = ?, published_at = ?
    where id = ?
  `).bind('published', now, now, current.id).run();

  const assignment = {
    ...current,
    status: 'published',
    updatedAt: now,
    publishedAt: now,
  };
  return {
    ok: true,
    assignment,
    assignments: await readAllAssignments(env),
  };
}

export async function archivePageDemoAssignment(env, assignmentId, now = nowIso()) {
  const currentRow = await findAssignmentById(env, String(assignmentId || '').trim());
  if (!currentRow) return { ok: false, status: 404, error: 'Page demo assignment not found.' };
  const current = serializeAssignment(currentRow);

  await env.DB.prepare(`
    update page_demo_assignments
    set status = ?, updated_at = ?, published_at = ?
    where id = ?
  `).bind('archived', now, current.publishedAt || null, current.id).run();

  const assignment = {
    ...current,
    status: 'archived',
    updatedAt: now,
  };
  return {
    ok: true,
    assignment,
    assignments: await readAllAssignments(env),
  };
}
