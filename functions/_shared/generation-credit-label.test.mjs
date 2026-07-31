import assert from 'node:assert/strict';
import test from 'node:test';
import {
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

