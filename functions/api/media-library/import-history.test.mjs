import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from './import-history.js';

class TestStatement {
  constructor(env, sql) {
    this.env = env;
    this.sql = sql;
    this.values = [];
  }

  bind(...values) {
    this.values = values;
    return this;
  }

  async first() {
    const normalized = this.sql.toLowerCase();
    if (normalized.includes('from sessions')) {
      if (!this.env.currentUser) return null;
      return {
        id: this.env.currentUser.id,
        email: this.env.currentUser.email,
        name: this.env.currentUser.name || 'Admin',
        avatar_url: null,
        session_id: 'sess_test',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      };
    }
    if (normalized.includes('from generation_history')) {
      return {
        id: 'gen_admin_1',
        user_id: 'user_admin',
        media_type: 'image',
        model: 'seedream-5-0-lite',
        prompt: 'full body outfit demo',
        output_url: 'https://assets.toolaze.com/generated/admin-output.webp',
        input_urls: JSON.stringify(['https://assets.toolaze.com/uploads/admin-input.webp']),
        aspect_ratio: '16:9',
        resolution: '1K',
        output_format: 'webp',
        native_audio: 0,
        tool_slug: 'ai-clothes-changer',
        tool_label: 'Clothes Changer',
        source_path: '/ai-clothes-changer',
        created_at: '2026-08-04T00:00:00.000Z',
      };
    }
    return null;
  }

  async run() {
    if (this.sql.toLowerCase().includes('insert or ignore into media_library_assets')) {
      this.env.mediaLibraryInserts.push(this.values);
      return { meta: { changes: 1 } };
    }
    return { meta: { changes: 0 } };
  }
}

function createEnv(currentUser) {
  const env = {
    TOOLAZE_ADMIN_EMAILS: 'owner@example.com',
    currentUser,
    mediaLibraryInserts: [],
    DB: {
      prepare(sql) {
        return new TestStatement(env, sql);
      },
    },
  };
  return env;
}

function createRequest(body = { historyId: 'gen_admin_1' }) {
  return new Request('https://toolaze.test/api/media-library/import-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=test-session-token',
    },
    body: JSON.stringify(body),
  });
}

test('history import requires a signed-in user', async () => {
  const env = createEnv(null);
  const response = await onRequest({ request: createRequest(), env });
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.equal(payload.error, 'Please sign in with an admin account.');
});

test('history import rejects signed-in non-admin users', async () => {
  const env = createEnv({ id: 'user_viewer', email: 'viewer@example.com' });
  const response = await onRequest({ request: createRequest(), env });
  const payload = await response.json();

  assert.equal(response.status, 403);
  assert.equal(payload.error, 'Admin access required.');
  assert.equal(env.mediaLibraryInserts.length, 0);
});

test('history import allows admins to import one of their own history records', async () => {
  const env = createEnv({ id: 'user_admin', email: 'owner@example.com' });
  const response = await onRequest({ request: createRequest(), env });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.importedCount, 2);
  assert.equal(payload.assets[0].sourceHistoryId, 'gen_admin_1');
  assert.equal(env.mediaLibraryInserts.length, 2);
});
