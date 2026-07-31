import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./talking-avatar-creator.js', import.meta.url), 'utf8');

test('Talking Avatar backend charges from shared Infinitalk pricing and request duration', () => {
  assert.match(
    source,
    /import \{ calculateVideoGenerationCredits \} from '\.\.\/_shared\/generation-credits\.mjs';/,
    'backend should use the shared generation pricing table'
  );
  assert.doesNotMatch(
    source,
    /function getRequiredCredits\(resolution\)/,
    'backend should not keep a local fixed credit ladder'
  );
  assert.match(source, /const durationSeconds = normalizeDurationSeconds\(readString\(formData, 'durationSeconds'\)\)/);
  assert.match(source, /return Math\.max\(1, Math\.min\(15, Math\.ceil\(duration\)\)\)/);
  assert.match(source, /calculateVideoGenerationCredits\(INFINITALK_MODEL_ID, resolution, durationSeconds\)/);
  assert.match(source, /durationSeconds,/);
});
