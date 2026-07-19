export const CREEM_PROMPT_MODERATION_SETTING_KEY = 'creem_prompt_moderation_enabled';

const TRUE_VALUES = new Set(['1', 'true', 'on', 'enabled', 'yes']);
const FALSE_VALUES = new Set(['0', 'false', 'off', 'disabled', 'no']);
const DEFAULT_CREEM_PROMPT_MODERATION_ENABLED = false;

function hasD1(env = {}) {
  return Boolean(env?.DB && typeof env.DB.prepare === 'function');
}

function parseBooleanSetting(value, fallback) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  return fallback;
}

export async function getCreemPromptModerationSetting(env = {}) {
  if (!hasD1(env)) {
    return {
      enabled: DEFAULT_CREEM_PROMPT_MODERATION_ENABLED,
      source: 'default',
      reason: 'settings_unbound',
    };
  }

  try {
    const row = await env.DB.prepare(`
      select value
      from app_settings
      where key = ?
      limit 1
    `).bind(CREEM_PROMPT_MODERATION_SETTING_KEY).first();

    if (!row || row.value == null) {
      return {
        enabled: DEFAULT_CREEM_PROMPT_MODERATION_ENABLED,
        source: 'default',
        reason: 'settings_missing',
      };
    }

    const enabled = parseBooleanSetting(row.value, DEFAULT_CREEM_PROMPT_MODERATION_ENABLED);
    return {
      enabled,
      source: 'database',
      reason: enabled ? 'enabled_by_admin' : 'disabled_by_admin',
    };
  } catch {
    return {
      enabled: false,
      source: 'fallback',
      reason: 'settings_unavailable',
    };
  }
}

export async function setCreemPromptModerationSetting(env = {}, enabled) {
  if (!hasD1(env)) {
    throw new Error('D1 database is not configured.');
  }

  const normalizedValue = enabled ? 'true' : 'false';
  const now = new Date().toISOString();

  await env.DB.prepare(`
    insert into app_settings (key, value, updated_at)
    values (?, ?, ?)
    on conflict(key) do update set
      value = excluded.value,
      updated_at = excluded.updated_at
  `).bind(CREEM_PROMPT_MODERATION_SETTING_KEY, normalizedValue, now).run();

  return {
    enabled,
    source: 'database',
    reason: enabled ? 'enabled_by_admin' : 'disabled_by_admin',
  };
}
