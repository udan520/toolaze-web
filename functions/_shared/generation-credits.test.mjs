import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateImageGenerationCredits,
  calculateVideoGenerationCredits,
  VIDEO_GENERATION_CREDIT_RATES,
} from './generation-credits.mjs';

test('maps image costs to credits from KIE cost times three', () => {
  // Example: $0.015 KIE cost × 3 = $0.045 target Toolaze revenue;
  // $0.045 / $0.005 per credit = 9 credits, then 9-credit results move to 10.
  assert.equal(calculateImageGenerationCredits('nano-banana-2-lite', '1K'), 10);
  assert.equal(calculateImageGenerationCredits('gpt-image-2', '1K'), 10);
  assert.equal(calculateImageGenerationCredits('gpt-image-1-5', 'medium'), 12);
  assert.equal(calculateImageGenerationCredits('gpt-image-1-5', 'high'), 66);
  assert.equal(calculateImageGenerationCredits('nano-banana-pro', '1K'), 24);
  assert.equal(calculateImageGenerationCredits('nano-banana-pro', '2K'), 24);
  assert.equal(calculateImageGenerationCredits('nano-banana-pro', '4K'), 42);
  assert.equal(calculateImageGenerationCredits('nano-banana-2', '1K'), 15);
  assert.equal(calculateImageGenerationCredits('nano-banana-2', '2K'), 24);
  assert.equal(calculateImageGenerationCredits('nano-banana-2', '4K'), 36);
  assert.equal(calculateImageGenerationCredits('seedream-5-0-pro', '1K'), 21);
  assert.equal(calculateImageGenerationCredits('seedream-5-0-pro', '2K'), 42);
  assert.equal(calculateImageGenerationCredits('flux-2-pro', '2K'), 21);
  assert.equal(calculateImageGenerationCredits('flux-2-flex', '2K'), 72);
});

test('maps Kie video costs to credits from KIE cost times two', () => {
  assert.match(
    VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].source,
    /Toolaze price = Kie cost × 2, then round\(price \/ \$0\.005 per credit\)/
  );
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video'].ratesByResolution['480p'], 3);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['grok-1-5-video'].ratesByResolution['720p'], 6);
  assert.match(
    VIDEO_GENERATION_CREDIT_RATES['seedance-2'].source,
    /no-video column: 480p \$0\.095\/output second, 720p \$0\.205\/output second, 1080p \$0\.51\/output second, 4K \$1\.04\/output second/
  );
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['480p'], 38);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['720p'], 82);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['1080p'], 204);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2'].ratesByResolution['4K'], 416);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].ratesByResolution['480p'], 20);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-2-mini'].ratesByResolution['720p'], 41);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].ratesByResolution['720p'], 28);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].ratesByResolution['1080p'], 36);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].ratesByResolution['4K'], 134);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].nativeAudioRatesByResolution['720p'], 40);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['kling-3'].nativeAudioRatesByResolution['1080p'], 54);
  assert.match(
    VIDEO_GENERATION_CREDIT_RATES['veo-3-1-lite'].source,
    /Kie Veo 3\.1 pricing/
  );
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-lite'].ratesByResolution['720p'], 30);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-lite'].ratesByResolution['1080p'], 45);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-fast'].ratesByResolution['720p'], 60);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-fast'].ratesByResolution['1080p'], 75);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-quality'].ratesByResolution['720p'], 450);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['veo-3-1-quality'].ratesByResolution['1080p'], 465);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].ratesByResolution['540p'], 11);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].ratesByResolution['720p'], 14);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['seedance-1-lite'].ratesByResolution['720p'], 10);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].ratesByResolution['1080p'], 30);
  assert.equal(VIDEO_GENERATION_CREDIT_RATES['pixverse-v6'].nativeAudioRatesByResolution['720p'], 20);
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '480p', 5), 15);
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '480p', 3), 10);
  assert.equal(calculateVideoGenerationCredits('grok-1-5-video', '720p', 10), 60);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '480p', 5), 190);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '720p', 5), 410);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '1080p', 15), 3060);
  assert.equal(calculateVideoGenerationCredits('seedance-2', '4K', 15), 6240);
  assert.equal(calculateVideoGenerationCredits('seedance-2-mini', '480p', 5), 100);
  assert.equal(calculateVideoGenerationCredits('seedance-2-mini', '720p', 10), 410);
  assert.equal(calculateVideoGenerationCredits('kling-3', '720p', 5), 140);
  assert.equal(calculateVideoGenerationCredits('kling-3', '1080p', 10), 360);
  assert.equal(calculateVideoGenerationCredits('kling-3', '4K', 15), 2010);
  assert.equal(calculateVideoGenerationCredits('kling-3', '720p', 5, { nativeAudio: true }), 200);
  assert.equal(calculateVideoGenerationCredits('kling-3', '1080p', 10, { nativeAudio: true }), 540);
  assert.equal(calculateVideoGenerationCredits('kling-3', '4K', 10, { nativeAudio: true }), null);
  assert.equal(calculateVideoGenerationCredits('veo-3-1-lite', '720p', 8), 30);
  assert.equal(calculateVideoGenerationCredits('veo-3-1-fast', '1080p', 8), 75);
  assert.equal(calculateVideoGenerationCredits('veo-3-1-quality', '720p', 4), 450);
  assert.equal(calculateVideoGenerationCredits('pixverse-v6', '720p', 5), 70);
  assert.equal(calculateVideoGenerationCredits('pixverse-v6', '720p', 5, { nativeAudio: true }), 100);
});

test('Kissing Grok Video uses the same credits as Grok 1.5 Video', () => {
  for (const [resolution, duration] of [
    ['480p', 3],
    ['480p', 5],
    ['720p', 8],
    ['720p', 10],
  ]) {
    assert.equal(
      calculateImageGenerationCredits('grok-video-1-5', resolution, duration),
      calculateVideoGenerationCredits('grok-1-5-video', resolution, duration)
    );
  }
});

test('unpriced Seedance 2.0 Fast specs stay unavailable instead of using old credits', () => {
  assert.equal(calculateVideoGenerationCredits('seedance-2-fast', '1080p', 5), null);
  assert.equal(calculateVideoGenerationCredits('seedance-2-fast', '4K', 5), null);
});

test('Seedance 1.0 Pro Fast uses fixed credits for each supported output spec', () => {
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '720p', 5), 32);
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '720p', 10), 72);
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '1080p', 5), 72);
  assert.equal(calculateVideoGenerationCredits('seedance-1-pro-fast', '1080p', 10), 144);
});
