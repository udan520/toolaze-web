import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from './admin.js';

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
        name: 'Admin',
        avatar_url: null,
        session_id: 'sess_test',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      };
    }
    if (normalized.includes('from page_demo_assignments') && normalized.includes("status = 'draft'")) {
      return null;
    }
    if (normalized.includes('from page_demo_assignments') && normalized.includes('where id = ?')) {
      return this.env.pageDemoRows.find((row) => row.id === this.values[0]) || null;
    }
    return null;
  }

  async all() {
    if (this.sql.toLowerCase().includes('from page_demo_assignments')) {
      return { results: this.env.pageDemoRows };
    }
    return { results: [] };
  }

  async run() {
    const normalized = this.sql.toLowerCase();
    if (normalized.includes('insert into page_demo_assignments')) {
      const [id, pageSlug, locale, placement, applyMode, title, asset, inputAssets, prompt, model, params, sourceHistoryId, status, version, createdAt, updatedAt, publishedAt] = this.values;
      this.env.pageDemoRows.unshift({
        id,
        page_slug: pageSlug,
        locale,
        placement,
        apply_mode: applyMode,
        title,
        asset,
        input_assets: inputAssets,
        prompt,
        model,
        params,
        source_history_id: sourceHistoryId,
        status,
        version,
        created_at: createdAt,
        updated_at: updatedAt,
        published_at: publishedAt,
      });
      return { meta: { changes: 1 } };
    }
    return { meta: { changes: 0 } };
  }
}

function createEnv(currentUser) {
  const env = {
    TOOLAZE_ADMIN_EMAILS: 'owner@example.com',
    currentUser,
    pageDemoRows: [],
    DB: {
      prepare(sql) {
        return new TestStatement(env, sql);
      },
    },
  };
  return env;
}

function createRequest(body) {
  return new Request('https://toolaze.test/api/page-demo-assignments/admin', {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'toolaze_session=test-session-token',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

test('page demo admin endpoint requires a signed-in user', async () => {
  const response = await onRequest({ request: createRequest(), env: createEnv(null) });
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.equal(payload.error, 'Please sign in with an admin account.');
});

test('page demo admin endpoint rejects signed-in non-admin users', async () => {
  const response = await onRequest({ request: createRequest(), env: createEnv({ id: 'viewer', email: 'viewer@example.com' }) });
  const payload = await response.json();

  assert.equal(response.status, 403);
  assert.equal(payload.error, 'Admin access required.');
});

test('page demo admin endpoint saves drafts for admin users', async () => {
  const env = createEnv({ id: 'owner', email: 'owner@example.com' });
  const response = await onRequest({
    request: createRequest({
      action: 'save_draft',
      pageSlug: 'image-to-video-generator',
      placement: 'hero_demo',
      asset: { id: 'asset_output', type: 'video', url: 'https://assets.toolaze.com/generated/live.mp4' },
    }),
    env,
  });
  const payload = await response.json();

  assert.equal(response.status, 201);
  assert.equal(payload.assignment.status, 'draft');
  assert.equal(payload.assignments.length, 1);
  assert.equal(env.pageDemoRows.length, 1);
});
