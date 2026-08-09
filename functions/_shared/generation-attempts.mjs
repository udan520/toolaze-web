function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

function serializeInputUrls(value) {
  if (!Array.isArray(value)) return null;
  const urls = value
    .map((item) => String(item || '').trim())
    .filter(Boolean);
  return urls.length > 0 ? JSON.stringify(urls) : null;
}

function parseInputUrls(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item || '').trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function isMissingAttemptTableError(error) {
  return /no such table:\s*generation_attempts/i.test(
    error instanceof Error ? error.message : String(error),
  );
}

function logAttemptError(action, error) {
  if (isMissingAttemptTableError(error)) return;
  console.warn(`Unable to ${action} generation attempt`, error);
}

export async function createGenerationAttempt(env, userId, item) {
  if (!env?.DB || !userId) return null;

  const now = nowIso();
  const id = createId('gen_attempt');

  try {
    await env.DB.prepare(`
      insert into generation_attempts (
        id, user_id, task_id, media_type, status, model, prompt, output_url,
        input_urls, aspect_ratio, resolution, output_format, native_audio,
        tool_slug, tool_label, source_path, failure_reason, credit_transaction_id,
        consumption_id, task_provider, required_credits, history_id, created_at, updated_at
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userId,
      item.taskId || null,
      item.mediaType === 'video' ? 'video' : 'image',
      item.status || 'pending',
      String(item.model || '').trim() || 'unknown',
      String(item.prompt || '').trim(),
      item.outputUrl || null,
      serializeInputUrls(item.inputUrls),
      item.aspectRatio || null,
      item.resolution || null,
      item.outputFormat || null,
      item.nativeAudio === true ? 1 : 0,
      item.toolSlug || null,
      item.toolLabel || null,
      item.sourcePath || null,
      item.failureReason || null,
      item.creditTransactionId || null,
      item.consumptionId || null,
      item.taskProvider || null,
      Number.isInteger(item.requiredCredits) ? item.requiredCredits : null,
      item.historyId || null,
      now,
      now,
    ).run();

    return { id, createdAt: now };
  } catch (error) {
    logAttemptError('create', error);
    return null;
  }
}

export async function attachGenerationAttemptTask(env, options) {
  if (!env?.DB || !options?.attemptId || !options?.userId || !options?.taskId) return false;

  try {
    const result = await env.DB.prepare(`
      update generation_attempts
      set task_id = ?,
        consumption_id = coalesce(?, consumption_id),
        credit_transaction_id = coalesce(?, credit_transaction_id),
        task_provider = coalesce(?, task_provider),
        required_credits = coalesce(?, required_credits),
        updated_at = ?
      where id = ? and user_id = ?
    `).bind(
      options.taskId,
      options.consumptionId || null,
      options.creditTransactionId || null,
      options.taskProvider || null,
      Number.isInteger(options.requiredCredits) ? options.requiredCredits : null,
      nowIso(),
      options.attemptId,
      options.userId,
    ).run();

    return result?.meta?.changes === 1;
  } catch (error) {
    logAttemptError('attach task to', error);
    return false;
  }
}

export async function listGenerationAttempts(env, userId, limit = 100) {
  if (!env?.DB || !userId) return [];
  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200));

  try {
    const result = await env.DB.prepare(`
      select id, task_id, media_type, status, model, prompt, output_url,
        input_urls, aspect_ratio, resolution, output_format, native_audio,
        tool_slug, tool_label, source_path, failure_reason, credit_transaction_id,
        consumption_id, task_provider, required_credits, history_id, created_at, updated_at
      from generation_attempts
      where user_id = ?
      order by created_at desc
      limit ?
    `).bind(userId, safeLimit).all();

    return (result?.results || []).map((row) => ({
      id: row.id,
      taskId: row.task_id,
      mediaType: row.media_type === 'video' ? 'video' : 'image',
      status: row.status === 'succeeded' ? 'succeeded' : row.status === 'failed' ? 'failed' : 'pending',
      model: row.model,
      prompt: row.prompt,
      outputUrl: row.output_url || '',
      inputUrls: parseInputUrls(row.input_urls),
      aspectRatio: row.aspect_ratio,
      resolution: row.resolution,
      outputFormat: row.output_format,
      nativeAudio: row.native_audio === 1,
      toolSlug: row.tool_slug,
      toolLabel: row.tool_label,
      sourcePath: row.source_path,
      failureReason: row.failure_reason,
      creditTransactionId: row.credit_transaction_id,
      consumptionId: row.consumption_id,
      taskProvider: row.task_provider,
      requiredCredits: Number(row.required_credits) || null,
      historyId: row.history_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (error) {
    logAttemptError('list', error);
    return [];
  }
}

export async function linkGenerationAttemptHistory(env, options) {
  if (!env?.DB || !options?.userId || !options?.taskId || !options?.historyId) return false;
  try {
    const result = await env.DB.prepare(`
      update generation_attempts
      set history_id = ?, updated_at = ?
      where task_id = ? and user_id = ?
    `).bind(options.historyId, nowIso(), options.taskId, options.userId).run();
    return Number(result?.meta?.changes || 0) > 0;
  } catch (error) {
    logAttemptError('link history to', error);
    return false;
  }
}

export async function deleteGenerationAttempt(env, userId, attemptId) {
  if (!env?.DB || !userId || !attemptId) return 0;
  try {
    const result = await env.DB.prepare(`
      delete from generation_attempts
      where id = ? and user_id = ?
    `).bind(attemptId, userId).run();
    return Number(result?.meta?.changes || 0);
  } catch (error) {
    logAttemptError('delete', error);
    return 0;
  }
}

export async function deleteGenerationAttemptsForHistory(env, userId, historyId) {
  if (!env?.DB || !userId || !historyId) return 0;
  try {
    const result = await env.DB.prepare(`
      delete from generation_attempts
      where history_id = ? and user_id = ?
    `).bind(historyId, userId).run();
    return Number(result?.meta?.changes || 0);
  } catch (error) {
    logAttemptError('delete linked', error);
    return 0;
  }
}

export async function updateGenerationAttemptStatus(env, options) {
  if (!env?.DB || !options?.userId) return false;

  const attemptId = String(options.attemptId || '').trim();
  const taskId = String(options.taskId || '').trim();
  if (!attemptId && !taskId) return false;

  const status = options.status === 'succeeded'
    ? 'succeeded'
    : options.status === 'failed'
      ? 'failed'
      : 'pending';
  const where = attemptId
    ? 'id = ? and user_id = ?'
    : 'task_id = ? and user_id = ?';
  const values = attemptId ? [attemptId, options.userId] : [taskId, options.userId];

  try {
    const result = await env.DB.prepare(`
      update generation_attempts
      set status = ?,
        output_url = coalesce(?, output_url),
        failure_reason = ?,
        updated_at = ?
      where ${where}
    `).bind(
      status,
      options.outputUrl || null,
      options.failureReason || null,
      nowIso(),
      ...values,
    ).run();

    return Number(result?.meta?.changes || 0) > 0;
  } catch (error) {
    logAttemptError('update', error);
    return false;
  }
}
