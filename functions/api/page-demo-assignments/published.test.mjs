import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from './published.js';

class TestStatement {
  constructor(env, sql) {
    this.env = env;
    this.sql = sql;
  }

  bind() {
    return this;
  }

  async all() {
    if (this.sql.toLowerCase().includes('from page_demo_assignments')) {
      return { results: this.env.pageDemoRows };
    }
    return { results: [] };
  }
}

function createEnv() {
  return {
    pageDemoRows: [{
      id: 'published_demo',
      page_slug: 'image-to-video-generator',
      locale: 'all',
      placement: 'hero_demo',
      apply_mode: 'demo_only',
      title: 'Live demo',
      asset: JSON.stringify({ id: 'asset_video', type: 'video', url: 'https://assets.toolaze.com/generated/live.mp4' }),
      input_assets: '[]',
      prompt: null,
      model: null,
      params: '{}',
      source_history_id: null,
      status: 'published',
      version: 1,
      created_at: '2026-08-05T00:00:00.000Z',
      updated_at: '2026-08-05T00:00:00.000Z',
      published_at: '2026-08-05T00:00:00.000Z',
    }, {
      id: 'draft_hidden',
      page_slug: 'image-to-video-generator',
      locale: 'all',
      placement: 'default_reference',
      apply_mode: 'demo_only',
      asset: JSON.stringify({ id: 'asset_draft', type: 'image', url: 'https://assets.toolaze.com/generated/draft.webp' }),
      input_assets: '[]',
      status: 'draft',
      version: 1,
      created_at: '2026-08-05T00:00:00.000Z',
      updated_at: '2026-08-05T00:00:00.000Z',
    }],
    DB: {
      prepare(sql) {
        return new TestStatement(thisEnv, sql);
      },
    },
  };
}

let thisEnv;

test('published page demo endpoint returns only live assignments without auth', async () => {
  thisEnv = createEnv();
  const response = await onRequest({
    request: new Request('https://toolaze.test/api/page-demo-assignments/published?pageSlug=image-to-video-generator&locale=pt'),
    env: thisEnv,
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.assignments.length, 1);
  assert.equal(payload.assignments[0].id, 'published_demo');
  assert.equal(payload.assignments[0].asset.url, 'https://assets.toolaze.com/generated/live.mp4');
});

test('published page demo endpoint requires a page slug', async () => {
  thisEnv = createEnv();
  const response = await onRequest({
    request: new Request('https://toolaze.test/api/page-demo-assignments/published'),
    env: thisEnv,
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.match(payload.error, /pageSlug/);
});
