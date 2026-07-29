const BASE_CREDITS = {
  'gpt-image-2': 10,
  'gpt-image-1-5': 15,
  'flux-2-pro': 15,
  'flux-2-flex': 20,
  'nano-banana-2': 10,
  'seedream-4.5': 10,
  'seedream-4-5': 10,
  'seedream-5-0-lite': 10,
  'seedream-5-0-pro': 10,
  'wan-2-7-image': 10,
  'grok-1-5-image': 10,
  'grok-video-1-5': 3,
  'nano-banana-pro': 20,
};

const RESOLUTION_MULTIPLIER = {
  '2K': 1.5,
  '4K': 2,
};

export const VIDEO_GENERATION_CREDIT_RATES = {
  'grok-1-5-video': {
    source: 'Kie pricing: 480p $0.008/output second, 720p $0.015/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: {
      '480p': 3,
      '720p': 5,
    },
  },
  'seedance-2': {
    source: 'Kie Seedance 2 pricing, no-video column: 480p $0.095/output second, 720p $0.205/output second, 1080p $0.51/output second, 4K $1.04/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: {
      '480p': 30,
      '720p': 60,
      '1080p': 150,
      '4K': 310,
    },
  },
  'seedance-2-mini': {
    source: 'Kie pricing: 480p $0.0475/output second, 720p $0.1025/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: {
      '480p': 15,
      '720p': 30,
    },
  },
  'seedance-2-fast': {
    source: 'Kie Seedance 2.0 Fast pricing mapped from the Seedance 2.0 rate ladder',
    ratesByResolution: { '480p': 25, '720p': 50, '1080p': 120, '4K': 250 },
    nativeAudioRatesByResolution: { '480p': 30, '720p': 60, '1080p': 150, '4K': 300 },
  },
  'seedance-1-5-pro': {
    source: 'Kie Seedance 1.5 Pro product rate mapped to Toolaze credits',
    ratesByResolution: { '480p': 15, '720p': 30, '1080p': 60 },
    nativeAudioRatesByResolution: { '480p': 20, '720p': 40, '1080p': 80 },
  },
  'seedance-1-pro-fast': {
    source: 'Kie Seedance 1.0 Pro Fast fixed output pricing mapped to Toolaze credits',
    ratesByResolution: {},
    ratesByResolutionAndDuration: {
      '720p': { 5: 24, 10: 54 },
      '1080p': { 5: 54, 10: 108 },
    },
  },
  'seedance-1-pro': {
    source: 'Kie Seedance 1.0 Pro pricing mapped to Toolaze at $0.01/credit',
    ratesByResolution: { '480p': 5, '720p': 10, '1080p': 25 },
  },
  'seedance-1-lite': {
    source: 'Kie Seedance 1.0 Lite pricing mapped to Toolaze at $0.01/credit',
    ratesByResolution: { '480p': 5, '720p': 10, '1080p': 15 },
  },
  'wan-2-7': {
    source: 'Kie Wan 2.7 pricing: 720p 16 Kie credits/output second, 1080p 24 Kie credits/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 25, '1080p': 35 },
  },
  'wan-2-6': {
    source: 'Kie Wan 2.6 pricing: 720p 12 Kie credits/output second, 1080p 20 Kie credits/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 20, '1080p': 30 },
  },
  'wan-2-5': {
    source: 'Kie Wan 2.5 pricing: 720p 12 Kie credits/output second, 1080p 20 Kie credits/output second; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 20, '1080p': 30 },
  },
  'wan-2-2': {
    source: 'Kie Wan 2.2 A14B Turbo pricing mapped to Toolaze at $0.01/credit with 200% profit over cost',
    ratesByResolution: { '480p': 10, '720p': 10 },
  },
  'kling-3-turbo': {
    source: 'Kie Kling 3 Turbo pricing mapped to Toolaze at $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 45, '1080p': 55 },
  },
  'kling-3': {
    source: 'Kling official pricing: no-native-audio 720p 6 credits/s, 1080p 8 credits/s, 4K 30 credits/s; native-audio 720p 9 credits/s, 1080p 12 credits/s; Toolaze target: $0.01/credit with cleaned per-second rates',
    ratesByResolution: {
      '720p': 20,
      '1080p': 25,
      '4K': 90,
    },
    nativeAudioRatesByResolution: {
      '720p': 30,
      '1080p': 40,
    },
  },
  'kling-2-6': {
    source: 'Kie Kling 2.6 pricing mapped to Toolaze at $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 20, '1080p': 30 },
    nativeAudioRatesByResolution: { '720p': 30, '1080p': 40 },
  },
  'kling-2-5': {
    source: 'Kie Kling 2.5 Turbo Pro pricing mapped to Toolaze at $0.01/credit with 200% profit over cost',
    ratesByResolution: { '1080p': 30 },
  },
  'kling-2-1': {
    source: 'Kie Kling 2.1 Master pricing: $0.80/5 seconds and $1.60/10 seconds; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '1080p': 50 },
  },
  'veo-3-1-lite': {
    source: 'Kie Veo 3.1 pricing: Lite 720p $0.15/video, 1080p $0.18/video; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 45, '1080p': 55 },
    fixedPerVideo: true,
  },
  'veo-3-1-fast': {
    source: 'Kie Veo 3.1 pricing: Fast 720p $0.30/video, 1080p $0.33/video; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 90, '1080p': 100 },
    fixedPerVideo: true,
  },
  'veo-3-1-quality': {
    source: 'Kie Veo 3.1 pricing: Quality 720p $1.25/video, 1080p $1.28/video; Toolaze target: $0.01/credit with 200% profit over cost',
    ratesByResolution: { '720p': 375, '1080p': 385 },
    fixedPerVideo: true,
  },
  'pixverse-v6': {
    source: 'PixVerse V6 official pricing mapped to Toolaze at $0.01/credit with 200% target margin',
    ratesByResolution: { '360p': 10, '540p': 15, '720p': 15, '1080p': 30 },
    nativeAudioRatesByResolution: { '360p': 15, '540p': 15, '720p': 20, '1080p': 35 },
  },
  'happyhorse-1-1': {
    source: 'Kie HappyHorse 1.1 product rate mapped to Toolaze credits',
    ratesByResolution: { '720p': 25, '1080p': 30 },
  },
  'happyhorse': {
    source: 'Kie HappyHorse product rate mapped to Toolaze credits',
    ratesByResolution: { '720p': 20, '1080p': 25 },
  },
};

const DEFAULT_VIDEO_DURATION_SECONDS = 8;
const MIN_VIDEO_DURATION_SECONDS = 1;
const MAX_VIDEO_DURATION_SECONDS = 15;

function normalizeVideoDurationSeconds(durationSeconds) {
  const value = Math.round(Number(durationSeconds ?? DEFAULT_VIDEO_DURATION_SECONDS));
  if (!Number.isFinite(value)) return DEFAULT_VIDEO_DURATION_SECONDS;
  return Math.max(MIN_VIDEO_DURATION_SECONDS, Math.min(MAX_VIDEO_DURATION_SECONDS, value));
}

export function calculateImageGenerationCredits(modelId, resolution, durationSeconds) {
  const normalizedModel = String(modelId || 'nano-banana-pro').trim();
  const normalizedResolution = String(resolution || '1K').trim().toUpperCase();

  if (normalizedModel === 'gpt-image-1-5') {
    return normalizedResolution === 'HIGH' ? 25 : 15;
  }
  if (normalizedModel === 'flux-2-pro') {
    return normalizedResolution === '2K' ? 25 : 15;
  }
  if (normalizedModel === 'flux-2-flex') {
    return normalizedResolution === '2K' ? 30 : 20;
  }

  if (normalizedModel === 'seedream-5-0-pro') {
    return normalizedResolution === '2K' ? 20 : 10;
  }

  if (normalizedModel === 'grok-video-1-5') {
    const normalizedDuration = normalizeVideoDurationSeconds(durationSeconds);
    return calculateVideoGenerationCredits(
      'grok-1-5-video',
      normalizedResolution.toLowerCase(),
      normalizedDuration
    ) ?? calculateVideoGenerationCredits('grok-1-5-video', '480p', normalizedDuration) ?? 3;
  }

  const baseCredits = BASE_CREDITS[normalizedModel] || BASE_CREDITS['nano-banana-pro'];
  const multiplier = RESOLUTION_MULTIPLIER[normalizedResolution] || 1;
  return Math.ceil(baseCredits * multiplier);
}

export function calculateVideoGenerationCredits(modelId, resolution, duration, options = {}) {
  const normalizedModel = String(modelId || '').trim();
  const normalizedResolution = String(resolution || '').trim();
  const normalizedDuration = Number(duration);
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
