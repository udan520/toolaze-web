import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateImageGenerationCredits,
  calculateVideoGenerationCredits,
  VIDEO_GENERATION_CREDIT_RATES,
} from './generation-credits.mjs';

test('keeps existing image credit calculation unchanged', () => {
  assert.equal(calculateImageGenerationCredits('nano-banana-pro', '4K'), 40);
  assert.equal(calculateImageGenerationCredits('seedream-5-0-pro', '2K'), 20);
});

test('maps Kie video costs to cleaned Toolaze per-second video credits', () => {
  assert.equal(
    VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].source,
    'Kie pricing: 480p $0.0475/output second, 720p $0.1025/output second; Toolaze target: $0.01/credit with 200% profit over cost'
  );
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video'].ratesByResolution['480p'], 3);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video'].ratesByResolution['720p'], 5);
  assert.match(
    VIDEO_GENERATION_CREDIT_RATES['seedance-2'].source,
    /no-video column: 480p \$0\.095\/output second, 720p \$0\.205\/output second, 1080p \$0\.51\/output second, 4K \$1\.04\/output second/
  );
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['480p'], 30);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['720p'], 60);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['1080p'], 150);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['4K'], 310);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].ratesByResolution['480p'], 15);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].ratesByResolution['720p'], 30);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].ratesByResolution['720p'], 20);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].ratesByResolution['1080p'], 25);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].ratesByResolution['4K'], 90);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].nativeAudioRatesByResolution['720p'], 30);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].nativeAudioRatesByResolution['1080p'], 40);
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '480p', 5), 15);
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '720p', 10), 50);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '480p', 5), 150);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '720p', 5), 300);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '1080p', 15), 2250);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '4K', 15), 4650);
  assert.equal(calculateVideoGenerationCredits('seedance-2-mini', '480p', 5), 75);
  assert.equal(calculateVideoGenerationCredits('seedance-2-mini', '720p', 10), 300);
  assert.equal(calculateVideoGenerationCredits('kling-3', '720p', 5), 100);
  assert.equal(calculateVideoGenerationCredits('kling-3', '1080p', 10), 250);
  assert.equal(calculateVideoGenerationCredits('kling-3', '4K', 15), 1350);
  assert.equal(calculateVideoGenerationCredits('kling-3', '720p', 5, { nativeAudio: true }), 150);
  assert.equal(calculateVideoGenerationCredits('kling-3', '1080p', 10, { nativeAudio: true }), 400);
  assert.equal(calculateVideoGenerationCredits('kling-3', '4K', 10, { nativeAudio: true }), null);
});

test('keeps cleaned video credit rates readable for users', () => {
  for (const [modelId, config] of Object.entries(VIDEO_GENERATION_CREDIT_RATES)) {
    for (const [resolution, creditsPerSecond] of Object.entries({
      ...config.ratesByResolution,
      ...(config.nativeAudioRatesByResolution || {}),
    })) {
      if (creditsPerSecond < 10) continue;
      const lastDigit = creditsPerSecond % 10;
      assert.ok(
        lastDigit === 0 || lastDigit === 5,
        `${modelId} ${resolution} should end in 0 or 5, got ${creditsPerSecond}`
      );
    }
  }
});
