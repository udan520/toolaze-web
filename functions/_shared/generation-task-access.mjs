export const GENERATION_TASK_ACCESS_ERROR = 'Generation task is not available for this account.';

function normalizeTaskId(taskId) {
  return String(taskId || '').trim();
}

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

async function readConsumptionTransaction(env, userId, consumptionId) {
  if (!env?.DB || !userId || !consumptionId) return null;

  return env.DB.prepare(`
    select
      credit_consumptions.id,
      credit_consumptions.user_id,
      credit_consumptions.transaction_id,
      credit_transactions.metadata
    from credit_consumptions
    join credit_transactions on credit_transactions.id = credit_consumptions.transaction_id
    where credit_consumptions.id = ?
      and credit_consumptions.user_id = ?
  `).bind(consumptionId, userId).first();
}

export async function attachGenerationTaskIdToConsumption(env, userId, consumptionId, taskId) {
  const normalizedTaskId = normalizeTaskId(taskId);
  if (!env?.DB || !userId || !consumptionId || !normalizedTaskId) return false;

  const row = await readConsumptionTransaction(env, userId, consumptionId);
  if (!row?.transaction_id) return false;

  const metadata = {
    ...parseMetadata(row.metadata),
    taskId: normalizedTaskId,
  };

  const result = await env.DB.prepare(`
    update credit_transactions
    set metadata = ?
    where id = ?
      and user_id = ?
  `).bind(JSON.stringify(metadata), row.transaction_id, userId).run();

  return result?.meta?.changes === 1 || result?.success === true;
}

export async function verifyGenerationTaskAccess(env, userId, body, taskId) {
  if (!env?.DB) return true;

  const normalizedTaskId = normalizeTaskId(taskId);
  const creditHold = body?.creditHold;
  const consumptionId = String(creditHold?.consumptionId || '').trim();

  if (
    !userId ||
    !normalizedTaskId ||
    creditHold?.provider !== 'credit-ledger' ||
    normalizeTaskId(creditHold?.taskId) !== normalizedTaskId ||
    !consumptionId
  ) {
    return false;
  }

  const row = await readConsumptionTransaction(env, userId, consumptionId);
  if (!row) return false;

  const metadata = parseMetadata(row.metadata);
  return normalizeTaskId(metadata.taskId) === normalizedTaskId;
}
