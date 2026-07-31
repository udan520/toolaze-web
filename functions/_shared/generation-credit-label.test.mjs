import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getImageGenerationCreditDescription,
  getImageGenerationCreditRefundDescription,
  getVideoGenerationCreditDescription,
  getVideoGenerationCreditRefundDescription,
} from './generation-credit-label.mjs';

test('video generation credit labels use wrapped tool labels when provided', () => {
  assert.equal(
    getVideoGenerationCreditDescription('infinitalk', 'image-to-video', {
      toolSlug: 'talking-avatar-creator',
      toolLabel: 'AI Talking Avatar',
    }),
    'AI Talking Avatar',
  );
  assert.equal(
    getVideoGenerationCreditRefundDescription('infinitalk', 'image-to-video', {
      toolSlug: 'talking-avatar-creator',
      toolLabel: 'AI Talking Avatar',
    }),
    'AI Talking Avatar refund',
  );
});

test('image generation credit labels use AI Breast Expansion before model metadata', () => {
  assert.equal(
    getImageGenerationCreditDescription('wan-2-7-image', true, {
      toolSlug: 'ai-breast-expansion',
      toolLabel: 'Wan 2.7 Image',
    }),
    'AI Breast Expansion',
  );
  assert.equal(
    getImageGenerationCreditRefundDescription('wan-2-7-image', true, {
      toolSlug: 'ai-breast-expansion',
    }),
    'AI Breast Expansion refund',
  );
});
