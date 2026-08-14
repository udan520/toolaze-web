import assert from 'node:assert/strict'
import test from 'node:test'

import nextConfig from '../../next.config.js'

const publishedLegacyModelRoots = [
  'happyhorse-ai-video-generator',
  'wan-3-0-ai-video-generator',
]

test('published legacy model roots permanently redirect to canonical model URLs', async () => {
  const redirects = await nextConfig.redirects()

  for (const slug of publishedLegacyModelRoots) {
    assert.deepEqual(
      redirects.find((rule) => rule.source === `/${slug}`),
      {
        source: `/${slug}`,
        destination: `/model/${slug}`,
        permanent: true,
      },
      `/${slug} should permanently redirect to its canonical model URL`,
    )
  }
})
