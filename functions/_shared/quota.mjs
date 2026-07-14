const FREE_DAILY_LIMIT = 1;

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getUsageSummary(env, userId, usageDate = getTodayDate()) {
  const row = await env.DB.prepare(`
    select image_count
    from usage_daily
    where user_id = ? and usage_date = ?
  `).bind(userId, usageDate).first();

  const used = row?.image_count ?? 0;
  return {
    date: usageDate,
    freeLimit: FREE_DAILY_LIMIT,
    used,
    remaining: Math.max(0, FREE_DAILY_LIMIT - used),
  };
}

export async function reserveFreeGeneration(env, userId, usageDate = getTodayDate()) {
  const now = nowIso();

  await env.DB.prepare(`
    insert into usage_daily (id, user_id, usage_date, image_count, created_at, updated_at)
    values (?, ?, ?, 0, ?, ?)
    on conflict(user_id, usage_date) do nothing
  `).bind(createId('usage'), userId, usageDate, now, now).run();

  const result = await env.DB.prepare(`
    update usage_daily
    set image_count = image_count + 1, updated_at = ?
    where user_id = ? and usage_date = ? and image_count < 1
  `).bind(now, userId, usageDate).run();

  return result?.meta?.changes === 1;
}

export async function releaseFreeGeneration(env, userId, usageDate = getTodayDate()) {
  await env.DB.prepare(`
    update usage_daily
    set image_count = max(0, image_count - 1), updated_at = ?
    where user_id = ? and usage_date = ?
  `).bind(nowIso(), userId, usageDate).run();
}
