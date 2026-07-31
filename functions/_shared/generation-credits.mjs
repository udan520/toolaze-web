function moveNineEndingCreditsToNextTen(credits) {
  if (!Number.isFinite(credits) || credits <= 0) return credits;
  return credits % 10 === 9 ? credits + 1 : credits;
}

const IMAGE_GENERATION_CREDITS = {
  'nano-banana-pro': { '1K': 24, '2K': 24, '4K': 42 },
  'nano-banana-2': { '1K': 15, '2K': 24, '4K': 36 },
  'nano-banana-2-lite': { '1K': moveNineEndingCreditsToNextTen(9) },
  'gpt-image-2': { '1K': moveNineEndingCreditsToNextTen(9), '2K': 15, '4K': 24 },
  'gpt-image-1-5': { medium: 12, high: 66 },
  'flux-2-pro': { '1K': 15, '2K': 21 },
  'flux-2-flex': { '1K': 42, '2K': 72 },
  'seedream-4.5': { '1K': 20, '2K': 20, '4K': 20 },
  'seedream-4-5': { '1K': 20, '2K': 20, '4K': 20 },
  'seedream-5-0-lite': { '1K': 17, '2K': 17, '4K': 17 },
  'seedream-5-0-pro': { '1K': 21, '2K': 42 },
  'wan-2-7-image': { '1K': 15, '2K': 15, '4K': 15 },
  'grok-1-5-image': { '1K': 10, '2K': 15, '4K': 20 },
};

export const VIDEO_GENERATION_CREDIT_RATES = {
  'grok-1-5-video': {
    source: 'Kie pricing: 480p $0.008/output second, 720p $0.015/output second; Toolaze price = Kie cost × 2, then round(price / $0.005 per credit)',
    ratesByResolution: {
      '480p': 3,
      '720p': 6,
    },
  },
  'seedance-2': {
    source: 'Kie Seedance 2 pricing, no-video column: 480p $0.095/output second, 720p $0.205/output second, 1080p $0.51/output second, 4K $1.04/output second; Toolaze price = Kie cost × 2, then round(price / $0.005 per credit)',
    ratesByResolution: {
      '480p': 38,
      '720p': 82,
      '1080p': 204,
      '4K': 416,
    },
  },
  'seedance-2-mini': {
    source: 'Kie pricing: 480p $0.0475/output second, 720p $0.1025/output second; Toolaze price = Kie cost × 2, then round(price / $0.005 per credit)',
    ratesByResolution: {
      '480p': 19,
      '720p': 41,
    },
  },
  'seedance-2-fast': {
    source: 'Kie Seedance 2.0 Fast pricing mapped from published 480p and 720p costs; Toolaze price = Kie cost × 2, then round(price / $0.005 per credit). 1080p and 4K public costs are not listed.',
    ratesByResolution: { '480p': 31, '720p': 66 },
  },
  'seedance-1-5-pro': {
    source: 'Kie Seedance 1.5 Pro product rate mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '480p': 4, '720p': 7, '1080p': 15 },
    nativeAudioRatesByResolution: { '480p': 7, '720p': 14, '1080p': 30 },
  },
  'seedance-1-pro-fast': {
    source: 'Kie Seedance 1.0 Pro Fast fixed output pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: {},
    ratesByResolutionAndDuration: {
      '720p': { 5: 32, 10: 72 },
      '1080p': { 5: 72, 10: 144 },
    },
  },
  'seedance-1-pro': {
    source: 'Kie Seedance 1.0 Pro pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '480p': 6, '720p': 12, '1080p': 28 },
  },
  'seedance-1-lite': {
    source: 'Kie Seedance 1.0 Lite pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '480p': 4, '720p': 9, '1080p': 20 },
  },
  'wan-2-7': {
    source: 'Kie Wan 2.7 pricing: 720p $0.08/output second, 1080p $0.12/output second; Toolaze price = Kie cost × 2, then round(price / $0.005 per credit)',
    ratesByResolution: { '720p': 32, '1080p': 48 },
  },
  'wan-2-6': {
    source: 'Kie Wan 2.6 pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 28, '1080p': 42 },
  },
  'wan-2-5': {
    source: 'Kie Wan 2.5 pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 24, '1080p': 40 },
  },
  'wan-2-2': {
    source: 'Kie Wan 2.2 A14B Turbo pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 32 },
    ratesByResolutionAndDuration: {
      '480p': { 5: 16 },
    },
  },
  'kling-3-turbo': {
    source: 'Kie Kling 3 Turbo pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 36, '1080p': 45 },
  },
  'kling-3': {
    source: 'Kling official pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: {
      '720p': 28,
      '1080p': 36,
      '4K': 134,
    },
    nativeAudioRatesByResolution: {
      '720p': 40,
      '1080p': 54,
    },
  },
  'kling-2-6': {
    source: 'Kie Kling 2.6 pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 22, '1080p': 22 },
    nativeAudioRatesByResolution: { '720p': 44, '1080p': 44 },
  },
  'kling-2-5': {
    source: 'Kie Kling 2.5 Turbo Pro pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '1080p': 17 },
  },
  'kling-2-1': {
    source: 'Kie Kling 2.1 Master pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '1080p': 64 },
  },
  'veo-3-1-lite': {
    source: 'Kie Veo 3.1 pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 30, '1080p': 45 },
    fixedPerVideo: true,
  },
  'veo-3-1-fast': {
    source: 'Kie Veo 3.1 pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 60, '1080p': 75 },
    fixedPerVideo: true,
  },
  'veo-3-1-quality': {
    source: 'Kie Veo 3.1 pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 450, '1080p': 465 },
    fixedPerVideo: true,
  },
  'pixverse-v6': {
    source: 'PixVerse V6 official pricing mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '360p': 8, '540p': 11, '720p': 14, '1080p': 29 },
    nativeAudioRatesByResolution: { '360p': 11, '540p': 14, '720p': 19, '1080p': 37 },
  },
  'happyhorse-1-1': {
    source: 'Kie HappyHorse 1.1 product rate mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 45, '1080p': 58 },
  },
  'happyhorse': {
    source: 'Kie HappyHorse product rate mapped at cost × 2 and $0.005/credit',
    ratesByResolution: { '720p': 56, '1080p': 96 },
  },
};

const DEFAULT_VIDEO_DURATION_SECONDS = 8;
const MIN_VIDEO_DURATION_SECONDS = 1;
const MAX_VIDEO_DURATION_SECONDS = 15;

function normalizeVideoDurationSeconds(durationSeconds) {
  const value = Math.ceil(Number(durationSeconds ?? DEFAULT_VIDEO_DURATION_SECONDS));
  if (!Number.isFinite(value)) return DEFAULT_VIDEO_DURATION_SECONDS;
  return Math.max(MIN_VIDEO_DURATION_SECONDS, Math.min(MAX_VIDEO_DURATION_SECONDS, value));
}

export function calculateImageGenerationCredits(modelId, resolution, durationSeconds) {
  const normalizedModel = String(modelId || 'nano-banana-pro').trim();
  const normalizedResolution = String(resolution || '1K').trim();

  if (normalizedModel === 'grok-video-1-5') {
    const normalizedDuration = normalizeVideoDurationSeconds(durationSeconds);
    return calculateVideoGenerationCredits(
      'grok-1-5-video',
      normalizedResolution.toLowerCase(),
      normalizedDuration
    ) ?? calculateVideoGenerationCredits('grok-1-5-video', '480p', normalizedDuration) ?? 3;
  }

  const modelCredits = IMAGE_GENERATION_CREDITS[normalizedModel] || IMAGE_GENERATION_CREDITS['nano-banana-pro'];
  const credits = modelCredits[normalizedResolution]
    ?? modelCredits[normalizedResolution.toUpperCase()]
    ?? modelCredits[normalizedResolution.toLowerCase()]
    ?? modelCredits['1K'];
  return moveNineEndingCreditsToNextTen(credits);
}

export function calculateVideoGenerationCredits(modelId, resolution, duration, options = {}) {
  const normalizedModel = String(modelId || '').trim();
  const normalizedResolution = String(resolution || '').trim();
  const normalizedDuration = Math.ceil(Number(duration));
  const rateConfig = VIDEO_GENERATION_CREDIT_RATES[normalizedModel];
  const fixedSpecCredits = rateConfig?.ratesByResolutionAndDuration?.[normalizedResolution]?.[normalizedDuration];
  if (fixedSpecCredits) return fixedSpecCredits;
  const modelRates = options.nativeAudio
    ? rateConfig?.nativeAudioRatesByResolution
    : rateConfig?.ratesByResolution;
  const creditsPerSecond = modelRates?.[normalizedResolution];

  if (!creditsPerSecond || !Number.isFinite(normalizedDuration) || normalizedDuration <= 0) {
    return null;
  }

  if (rateConfig.fixedPerVideo) return creditsPerSecond;
  return Math.ceil(creditsPerSecond * normalizedDuration);
}
