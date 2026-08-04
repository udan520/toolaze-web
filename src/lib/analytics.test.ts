import assert from 'node:assert/strict'
import test from 'node:test'
import { trackToolazeEvent } from './analytics'

test('sends analytics events through gtag when GA4 is loaded', () => {
  const calls: unknown[][] = []
  ;(globalThis as any).window = {
    gtag: (...args: unknown[]) => calls.push(args),
  }

  trackToolazeEvent('credit_low_view', {
    source: 'nano_banana_tool',
    media_type: 'image',
    credit_cost: 10,
    ignored: undefined,
  })

  assert.deepEqual(calls, [
    [
      'event',
      'credit_low_view',
      {
        source: 'nano_banana_tool',
        media_type: 'image',
        credit_cost: 10,
      },
    ],
  ])

  delete (globalThis as any).window
})

test('falls back to dataLayer when gtag is not ready', () => {
  const dataLayer: unknown[] = []
  ;(globalThis as any).window = { dataLayer }

  trackToolazeEvent('generate_click', {
    media_type: 'image',
    model_id: 'nano-banana-pro',
    has_reference_images: false,
  })

  assert.deepEqual(dataLayer, [
    {
      event: 'generate_click',
      media_type: 'image',
      model_id: 'nano-banana-pro',
      has_reference_images: false,
    },
  ])

  delete (globalThis as any).window
})

test('does not throw during server rendering', () => {
  delete (globalThis as any).window

  assert.doesNotThrow(() => {
    trackToolazeEvent('credit_low_buy_click', {
      destination: '/pricing',
    })
  })
})
