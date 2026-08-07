import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'

const locales = ['en', 'de', 'ja', 'es', 'zh-TW', 'pt', 'fr', 'ko', 'it']
const demos = [
  {
    slug: 'wan-2-7-ai-video-generator',
    taskId: '2026-08-01-wan-2-7-ai-video-generator',
    src: 'https://assets.toolaze.com/generated/0648742ae72f41c1a047421beb1c93b9.mp4',
    poster: 'https://assets.toolaze.com/model-assets/wan-2-7-ai-video-generator/hero-demo-poster.webp',
    width: 864,
    height: 496,
    duration: 'PT5.042S',
    uploadDate: '2026-08-04T07:32:43.927Z',
  },
  {
    slug: 'pixverse-v6-ai-video-generator',
    taskId: '2026-08-06-pixverse-v6-ai-video-generator',
    src: 'https://assets.toolaze.com/generated/d38c8d15f5e64bb4a0e563c257b5429f.mp4',
    poster: 'https://assets.toolaze.com/model-assets/pixverse-v6-ai-video-generator/hero-demo-poster.webp',
    width: 1280,
    height: 720,
    duration: 'PT5.042S',
    uploadDate: '2026-08-06T15:23:13.315Z',
  },
  {
    slug: 'happyhorse-ai-video-generator',
    taskId: '2026-08-06-happyhorse-ai-video-generator',
    src: 'https://assets.toolaze.com/generated/d6c7c4472b1f4a6b9148fca922d1a107.mp4',
    poster: 'https://assets.toolaze.com/model-assets/happyhorse-ai-video-generator/hero-demo-poster.webp',
    width: 1280,
    height: 720,
    duration: 'PT5.163S',
    uploadDate: '2026-08-06T13:53:15.198Z',
  },
]

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

test('published video model hero demos are fixed in public and SEO Factory content', () => {
  for (const demo of demos) {
    for (const locale of locales) {
      const publicContent = readJson(join('src', 'data', locale, `${demo.slug}.json`))
      const factory = readJson(join('_codex', 'seo-pipeline', 'tasks', demo.taskId, 'content', `${locale}.json`))
      const { sourceData: _sourceData, ...factoryContent } = factory

      assert.deepEqual(factoryContent, publicContent, `${demo.slug} ${locale} Factory content should match public content`)
      assert.deepEqual(
        {
          src: publicContent.heroDemoVideo?.src,
          poster: publicContent.heroDemoVideo?.poster,
          width: publicContent.heroDemoVideo?.width,
          height: publicContent.heroDemoVideo?.height,
          duration: publicContent.heroDemoVideo?.duration,
          uploadDate: publicContent.heroDemoVideo?.uploadDate,
          type: publicContent.heroDemoVideo?.type,
        },
        {
          src: demo.src,
          poster: demo.poster,
          width: demo.width,
          height: demo.height,
          duration: demo.duration,
          uploadDate: demo.uploadDate,
          type: 'video',
        },
      )
      assert.ok(publicContent.heroDemoVideo?.ariaLabel?.trim(), `${demo.slug} ${locale} should keep a localized aria label`)
    }
  }
})
