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
        consumption_id, created_at, updated_at
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        updated_at = ?
      where id = ? and user_id = ?
    `).bind(
      options.taskId,
      options.consumptionId || null,
      options.creditTransactionId || null,
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
