import {
  getCreemPromptModerationSetting,
  setCreemPromptModerationSetting,
} from '../../_shared/runtime-settings.mjs';
import { handleOptions, jsonResponse } from '../../_shared/http.mjs';

function getAdminToken(request) {
  const explicit = request.headers.get('x-admin-token') || '';
  if (explicit) return explicit;

  const auth = request.headers.get('authorization') || '';
  return auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
}

function requireAdmin(env, request) {
  const expected = String(env.REWARD_REVIEW_ADMIN_TOKEN || '').trim();
  if (!expected) return { ok: false, status: 503, error: 'Admin token is not configured.' };
  if (getAdminToken(request) !== expected) return { ok: false, status: 403, error: 'Admin token required.' };
  return { ok: true };
}

function buildSettingsPayload(setting) {
  return {
    settings: {
      creemPromptModerationEnabled: setting.enabled,
    },
    meta: {
      source: setting.source,
      reason: setting.reason,
    },
  };
}

function readBoolean(value) {
  return typeof value === 'boolean' ? value : null;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return handleOptions();

  const admin = requireAdmin(env, request);
  if (!admin.ok) return jsonResponse({ error: admin.error }, admin.status);

  if (request.method === 'GET') {
    const setting = await getCreemPromptModerationSetting(env);
    return jsonResponse(buildSettingsPayload(setting));
  }

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const enabled = readBoolean(body?.creemPromptModerationEnabled);
    if (enabled === null) {
      return jsonResponse({ error: 'creemPromptModerationEnabled must be a boolean.' }, 400);
    }

    try {
      const setting = await setCreemPromptModerationSetting(env, enabled);
      return jsonResponse(buildSettingsPayload(setting));
    } catch (error) {
      return jsonResponse({
        error: error instanceof Error ? error.message : 'Could not update settings.',
      }, 503);
    }
  }

  return jsonResponse({ error: 'Method not allowed', allow: 'GET, POST, OPTIONS' }, 405);
}
