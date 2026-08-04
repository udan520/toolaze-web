import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from './assets.js';

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
    return null;
  }

  async all() {
    if (this.sql.toLowerCase().includes('from media_library_assets')) {
      return {
        results: [
          {
            id: 'asset_video_1',
            type: 'video',
            url: 'https://assets.toolaze.com/generated/demo.mp4',
            title: 'Seedance Output',
            source: 'history',
            source_role: 'history_output',
            source_history_id: 'gen_1',
            source_tool_slug: 'image-to-video-generator',
            source_tool_label: 'Image to Video',
            source_path: '/image-to-video-generator',
            source_model: 'seedance-2-0',
            source_prompt: 'demo prompt',
            source_user_email: 'owner@example.com',
            source_created_at: '2026-08-04T00:00:00.000Z',
            review_status: 'candidate',
            metadata: '{"resolution":"1K"}',
            ai_tags: '["video"]',
            manual_tags: '["demo"]',
            safety_tags: '[]',
            confidence: '{}',
            usage_count: 0,
            created_at: '2026-08-04T10:00:00.000Z',
            updated_at: '2026-08-04T10:00:00.000Z',
          },
        ],
      };
    }
    return { results: [] };
  }
}

function createEnv(currentUser) {
  const env = {
    TOOLAZE_ADMIN_EMAILS: 'owner@example.com',
    currentUser,
    DB: {
      prepare(sql) {
        return new TestStatement(env, sql);
      },
    },
  };
  return env;
}

function createRequest() {
  return new Request('https://toolaze.test/api/media-library/assets?limit=20', {
    method: 'GET',
    headers: {
      Cookie: 'toolaze_session=test-session-token',
    },
  });
}

test('media library asset list requires a signed-in user', async () => {
  const env = createEnv(null);
  const response = await onRequest({ request: createRequest(), env });
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.equal(payload.error, 'Please sign in with an admin account.');
});

test('media library asset list rejects signed-in non-admin users', async () => {
  const env = createEnv({ id: 'viewer', email: 'viewer@example.com' });
  const response = await onRequest({ request: createRequest(), env });
  const payload = await response.json();

  assert.equal(response.status, 403);
  assert.equal(payload.error, 'Admin access required.');
});

test('media library asset list returns imported D1 assets for admins', async () => {
  const env = createEnv({ id: 'owner', email: 'owner@example.com' });
  const response = await onRequest({ request: createRequest(), env });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.assets.length, 1);
  assert.equal(payload.assets[0].id, 'asset_video_1');
  assert.equal(payload.assets[0].sourceRole, 'history_output');
  assert.deepEqual(payload.assets[0].manualTags, ['demo']);
  assert.equal(payload.stats.total, 1);
  assert.equal(payload.stats.videos, 1);
});
