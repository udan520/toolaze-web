import assert from 'node:assert/strict'
import test from 'node:test'
import { getL2SeoContent } from '@/lib/seo-loader'

test('text-to-video queued SEO sourceData resolves to complete L2 page content', async () => {
  const content = await getL2SeoContent('text-to-video-generator', 'en')
  const page = content as Record<string, any> | null

  assert.ok(page, 'expected text-to-video-generator content')
  assert.equal(page.topComponent, 'ai-video-generator')
  assert.equal(page.topTool?.mode, 'text-to-video')
  assert.equal(typeof page.metadata?.title, 'string')
  assert.match(page.hero?.h1 || '', /Text to Video Generator/)
})
