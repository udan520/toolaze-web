import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import {
  importHistoryItemToMediaLibrary,
  isMediaLibraryAdminEmail,
} from './media-library.mjs';

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
    if (normalized.includes('from generation_history')) {
      return {
        id: 'gen_clothes_1',
        user_id: 'user_admin',
        media_type: 'image',
        model: 'seedream-5-0-lite',
        prompt: 'change this outfit into a fitted blazer',
        output_url: 'https://assets.toolaze.com/generated/output.webp',
        input_urls: JSON.stringify([
          'https://assets.toolaze.com/uploads/person.webp',
          '/ai-clothes-changer/default-reference.webp',
        ]),
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

function createEnv() {
  const env = {
    mediaLibraryInserts: [],
    DB: {
      prepare(sql) {
        return new TestStatement(env, sql);
      },
    },
  };
  return env;
}

test('media library admin emails are read from the Toolaze allowlist', () => {
  assert.equal(isMediaLibraryAdminEmail(' Owner@Example.com ', {
    TOOLAZE_ADMIN_EMAILS: 'owner@example.com, ops@example.com',
  }), true);
  assert.equal(isMediaLibraryAdminEmail('viewer@example.com', {
    TOOLAZE_ADMIN_EMAILS: 'owner@example.com',
  }), false);
});

test('importHistoryItemToMediaLibrary imports output and reference assets with generation metadata', async () => {
  const env = createEnv();
  const result = await importHistoryItemToMediaLibrary(env, {
    id: 'user_admin',
    email: 'owner@example.com',
  }, 'gen_clothes_1');

  assert.equal(result.ok, true);
  assert.equal(result.importedCount, 3);
  assert.equal(result.skippedCount, 0);
  assert.equal(env.mediaLibraryInserts.length, 3);

  const outputInsert = env.mediaLibraryInserts[0];
  assert.match(outputInsert[0], /^asset_[a-f0-9]{18}$/);
  assert.equal(outputInsert[2], 'https://assets.toolaze.com/generated/output.webp');
  assert.equal(outputInsert[3], 'Clothes Changer Output');
  assert.equal(outputInsert[5], 'history_output');
  assert.equal(outputInsert[6], 'gen_clothes_1');
  assert.equal(outputInsert[9], '/ai-clothes-changer');
  assert.equal(outputInsert[10], 'seedream-5-0-lite');
  assert.equal(outputInsert[11], 'change this outfit into a fitted blazer');
  assert.equal(outputInsert[13], 'owner@example.com');
  assert.deepEqual(JSON.parse(outputInsert[16]), {
    aspectRatio: '16:9',
    resolution: '1K',
    outputFormat: 'webp',
    nativeAudio: false,
  });

  const referenceInsert = env.mediaLibraryInserts[1];
  assert.equal(referenceInsert[2], 'https://assets.toolaze.com/uploads/person.webp');
  assert.equal(referenceInsert[5], 'history_input');
});

test('media library migration creates a production D1 table with URL dedupe', () => {
  const migrationPath = join(process.cwd(), 'migrations', '0008_media_library_assets.sql');
  assert.equal(existsSync(migrationPath), true);
  const migration = readFileSync(migrationPath, 'utf8');
  assert.match(migration, /create table if not exists media_library_assets/i);
  assert.match(migration, /source_history_id text/i);
  assert.match(migration, /url text not null unique/i);
});
