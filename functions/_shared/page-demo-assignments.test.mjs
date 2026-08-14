import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  archivePageDemoAssignment,
  listPageDemoAssignments,
  listPublishedPageDemoAssignments,
  publishPageDemoAssignment,
  saveDraftPageDemoAssignment,
} from './page-demo-assignments.mjs';

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

  async all() {
    const normalized = this.sql.toLowerCase();
    if (normalized.includes('from page_demo_assignments')) {
      return { results: this.env.pageDemoRows.map((row) => ({ ...row })) };
    }
    return { results: [] };
  }

  async first() {
    const normalized = this.sql.toLowerCase();
    if (!normalized.includes('from page_demo_assignments')) return null;

    if (normalized.includes('where id = ?')) {
      return this.env.pageDemoRows.find((row) => row.id === this.values[0]) || null;
    }

    if (normalized.includes("status = 'draft'")) {
      const [pageSlug, locale, placement] = this.values;
      return this.env.pageDemoRows.find((row) => (
        row.status === 'draft'
        && row.page_slug === pageSlug
        && row.locale === locale
        && row.placement === placement
      )) || null;
    }

    return null;
  }

  async run() {
    const normalized = this.sql.toLowerCase();

    if (normalized.includes('insert into page_demo_assignments')) {
      const [
        id, pageSlug, locale, placement, applyMode, title, asset, inputAssets,
        prompt, model, params, sourceHistoryId, status, version, createdAt, updatedAt, publishedAt,
      ] = this.values;
      const row = {
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
      };
      const index = this.env.pageDemoRows.findIndex((item) => item.id === id);
      if (index >= 0) this.env.pageDemoRows[index] = row;
      else this.env.pageDemoRows.unshift(row);
      return { meta: { changes: 1 } };
    }

    if (normalized.includes("set status = 'archived'")) {
      const [updatedAt, pageSlug, locale, placement, currentId] = this.values;
      let changes = 0;
      for (const row of this.env.pageDemoRows) {
        if (
          row.status === 'published'
          && row.page_slug === pageSlug
          && row.locale === locale
          && row.placement === placement
          && row.id !== currentId
        ) {
          row.status = 'archived';
          row.updated_at = updatedAt;
          changes += 1;
        }
      }
      return { meta: { changes } };
    }

    if (normalized.includes('set status = ?')) {
      const [status, updatedAt, publishedAt, id] = this.values;
      const row = this.env.pageDemoRows.find((item) => item.id === id);
      if (!row) return { meta: { changes: 0 } };
      row.status = status;
      row.updated_at = updatedAt;
      row.published_at = publishedAt;
      return { meta: { changes: 1 } };
    }

    return { meta: { changes: 0 } };
  }
}

function createEnv(rows = []) {
  const env = {
    pageDemoRows: rows,
    DB: {
      prepare(sql) {
        return new TestStatement(env, sql);
      },
    },
  };
  return env;
}

function createRow(overrides = {}) {
  const now = '2026-08-05T00:00:00.000Z';
  return {
    id: overrides.id || 'demo_row',
    page_slug: overrides.page_slug || 'image-to-video-generator',
    locale: overrides.locale || 'all',
    placement: overrides.placement || 'hero_demo',
    apply_mode: overrides.apply_mode || 'demo_only',
    title: overrides.title || null,
    asset: JSON.stringify(overrides.asset || { id: 'asset_output', type: 'video', url: 'https://assets.toolaze.com/generated/demo.mp4' }),
    input_assets: JSON.stringify(overrides.input_assets || []),
    prompt: overrides.prompt || null,
    model: overrides.model || null,
    params: JSON.stringify(overrides.params || {}),
    source_history_id: overrides.source_history_id || null,
    status: overrides.status || 'draft',
    version: overrides.version || 1,
    created_at: overrides.created_at || now,
    updated_at: overrides.updated_at || now,
    published_at: overrides.published_at || null,
  };
}

test('page demo assignment migration creates a D1-backed assignments table', () => {
  const migrationPath = join(process.cwd(), 'migrations', '0009_page_demo_assignments.sql');
  assert.equal(existsSync(migrationPath), true);
  const migration = readFileSync(migrationPath, 'utf8');
  assert.match(migration, /create table if not exists page_demo_assignments/i);
  assert.match(migration, /page_slug text not null/i);
  assert.match(migration, /status text not null/i);
  assert.match(migration, /idx_page_demo_assignments_published_slot/i);
});

test('draft save publishes a normalized page demo assignment into D1 rows', async () => {
  const env = createEnv();
  const result = await saveDraftPageDemoAssignment(env, {
    pageSlug: '/image-to-video-generator',
    placement: 'hero_demo',
    asset: { id: 'asset_output', type: 'video', url: 'https://assets.toolaze.com/generated/demo.mp4' },
  }, '2026-08-05T00:00:00.000Z');

  assert.equal(result.assignment.status, 'draft');
  assert.equal(result.assignment.pageSlug, 'image-to-video-generator');
  assert.equal(result.assignment.locale, 'all');
  assert.equal(env.pageDemoRows.length, 1);
});

test('publishing a D1 assignment archives the previous published row for the same slot', async () => {
  const env = createEnv([
    createRow({ id: 'old_published', status: 'published', published_at: '2026-08-04T00:00:00.000Z' }),
    createRow({ id: 'new_draft', status: 'draft' }),
  ]);

  const result = await publishPageDemoAssignment(env, 'new_draft', '2026-08-05T00:00:00.000Z');

  assert.equal(result.assignment.status, 'published');
  assert.equal(env.pageDemoRows.find((row) => row.id === 'old_published')?.status, 'archived');
  assert.equal(env.pageDemoRows.find((row) => row.id === 'new_draft')?.status, 'published');
});

test('published list exposes only matching published assignments with all-language fallback', async () => {
  const env = createEnv([
    createRow({ id: 'draft_ignored', status: 'draft' }),
    createRow({ id: 'published_match', status: 'published', locale: 'all' }),
    createRow({ id: 'other_page', status: 'published', page_slug: 'ai-clothes-changer' }),
  ]);

  const result = await listPublishedPageDemoAssignments(env, {
    pageSlug: 'image-to-video-generator',
    locale: 'pt',
  });

  assert.deepEqual(result.assignments.map((assignment) => assignment.id), ['published_match']);
});

test('admin list can include archived assignments and archive one assignment', async () => {
  const env = createEnv([createRow({ id: 'published_demo', status: 'published' })]);
  await archivePageDemoAssignment(env, 'published_demo', '2026-08-05T00:00:00.000Z');
  const result = await listPageDemoAssignments(env);

  assert.equal(result.assignments[0].status, 'archived');
});
