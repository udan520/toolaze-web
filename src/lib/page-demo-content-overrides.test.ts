import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { test } from 'node:test'
import {
  publishPageDemoAssignment,
  saveDraftPageDemoAssignment,
} from './admin/page-demo-assignments'
import { applyPublishedPageDemoAssignments } from './page-demo-content-overrides'

const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-page-demo-content-overrides-test-'))

test.after(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

function filePath(name: string): string {
  return join(tempDir, name)
}

test('published hero demo overrides the page demo media without carrying parameters in demo-only mode', async () => {
  const storePath = filePath('demo-only.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'image-to-video-generator',
    locale: 'all',
    placement: 'hero_demo',
    applyMode: 'demo_only',
    title: 'Living room motion demo',
    asset: {
      id: 'asset_video_demo',
      type: 'video',
      url: 'https://assets.toolaze.com/generated/demo.mp4',
      posterUrl: 'https://assets.toolaze.com/generated/demo.webp',
      title: 'Output demo',
    },
    inputAssets: [{
      id: 'asset_reference',
      type: 'image',
      url: 'https://assets.toolaze.com/uploads/reference.webp',
    }],
    prompt: 'This should not become the default prompt.',
    model: 'grok-video-1-5',
  }, storePath, '2026-08-05T08:00:00.000Z')
  await publishPageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-05T08:01:00.000Z')

  const content: any = await applyPublishedPageDemoAssignments({
    heroDemoVideo: { src: 'https://assets.toolaze.com/original.mp4' },
    topTool: { initialPrompt: 'Original prompt', initialImageUrls: [] },
  }, {
    pageSlug: 'image-to-video-generator',
    locale: 'pt',
    filePath: storePath,
  })

  assert.equal(content.heroDemoVideo.src, 'https://assets.toolaze.com/generated/demo.mp4')
  assert.equal(content.heroDemoVideo.poster, 'https://assets.toolaze.com/generated/demo.webp')
  assert.equal(content.heroDemoVideo.type, 'video')
  assert.equal(content.heroDemoVideo.ariaLabel, 'Living room motion demo')
  assert.equal(content.topTool.initialPrompt, 'Original prompt')
  assert.deepEqual(content.topTool.initialImageUrls, [])
})

test('published video hero demo carries poster duration and upload date for VideoObject schema', async () => {
  const storePath = filePath('video-schema.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'image-to-video-generator',
    locale: 'all',
    placement: 'hero_demo',
    applyMode: 'demo_only',
    title: 'Stable release demo',
    asset: {
      id: 'asset_video_schema',
      type: 'video',
      url: 'https://assets.toolaze.com/generated/stable-demo.mp4',
      posterUrl: 'https://assets.toolaze.com/generated/stable-demo.webp',
      durationSeconds: 8,
      uploadDate: '2026-08-05T08:00:00.000Z',
    },
  }, storePath, '2026-08-05T08:00:00.000Z')
  await publishPageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-05T08:01:00.000Z')

  const content: any = await applyPublishedPageDemoAssignments({
    heroDemoVideo: {
      src: 'https://assets.toolaze.com/original.mp4',
      poster: 'https://assets.toolaze.com/original.webp',
      duration: 'PT5S',
      uploadDate: '2026-07-01T00:00:00.000Z',
    },
  }, {
    pageSlug: 'image-to-video-generator',
    locale: 'en',
    filePath: storePath,
  })

  assert.equal(content.heroDemoVideo.src, 'https://assets.toolaze.com/generated/stable-demo.mp4')
  assert.equal(content.heroDemoVideo.poster, 'https://assets.toolaze.com/generated/stable-demo.webp')
  assert.equal(content.heroDemoVideo.duration, 'PT8S')
  assert.equal(content.heroDemoVideo.uploadDate, '2026-08-05T08:00:00.000Z')
})

test('published image hero demo does not inherit stale video schema metadata', async () => {
  const storePath = filePath('image-over-video.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'all',
    placement: 'hero_demo',
    applyMode: 'demo_only',
    title: 'Static outfit demo',
    asset: {
      id: 'asset_image_demo',
      type: 'image',
      url: 'https://assets.toolaze.com/generated/outfit.webp',
    },
  }, storePath, '2026-08-05T08:00:00.000Z')
  await publishPageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-05T08:01:00.000Z')

  const content: any = await applyPublishedPageDemoAssignments({
    heroDemoVideo: {
      src: 'https://assets.toolaze.com/original.mp4',
      poster: 'https://assets.toolaze.com/original.webp',
      duration: 'PT5S',
      uploadDate: '2026-07-01T00:00:00.000Z',
    },
  }, {
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    filePath: storePath,
  })

  assert.equal(content.heroDemoVideo.src, 'https://assets.toolaze.com/generated/outfit.webp')
  assert.equal(content.heroDemoVideo.type, 'image')
  assert.equal(content.heroDemoVideo.poster, undefined)
  assert.equal(content.heroDemoVideo.duration, undefined)
  assert.equal(content.heroDemoVideo.uploadDate, undefined)
})

test('published demo with parameters carries prompt model and reference assets into top tool defaults', async () => {
  const storePath = filePath('with-parameters.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'all',
    placement: 'hero_demo',
    applyMode: 'demo_with_parameters',
    title: 'Outfit change demo',
    asset: {
      id: 'asset_output',
      type: 'image',
      url: 'https://assets.toolaze.com/generated/outfit-output.webp',
    },
    inputAssets: [{
      id: 'asset_person',
      type: 'image',
      url: 'https://assets.toolaze.com/uploads/person.webp',
    }],
    prompt: 'Dress the person in a tailored black suit.',
    model: 'seedream-5-0-lite',
    params: { defaultVideoDurationSeconds: 8 },
  }, storePath, '2026-08-05T08:10:00.000Z')
  await publishPageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-05T08:11:00.000Z')

  const content: any = await applyPublishedPageDemoAssignments({
    heroDemoVideo: { src: 'https://assets.toolaze.com/original.webp' },
    topTool: { defaultPrompt: 'Original prompt', defaultImageUrls: [] },
  }, {
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    filePath: storePath,
  })

  assert.equal(content.heroDemoVideo.src, 'https://assets.toolaze.com/generated/outfit-output.webp')
  assert.equal(content.heroDemoVideo.type, 'image')
  assert.equal(content.topTool.defaultPrompt, 'Dress the person in a tailored black suit.')
  assert.equal(content.topTool.initialPrompt, 'Dress the person in a tailored black suit.')
  assert.deepEqual(content.topTool.defaultImageUrls, ['https://assets.toolaze.com/uploads/person.webp'])
  assert.deepEqual(content.topTool.initialImageUrls, ['https://assets.toolaze.com/uploads/person.webp'])
  assert.equal(content.topTool.modelId, 'seedream-5-0-lite')
  assert.equal(content.topTool.defaultVideoDurationSeconds, 8)
})

test('model route demo assignments can be resolved from the model page slug alias', async () => {
  const storePath = filePath('model-route.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'model/wan-2-6-ai-video-generator',
    locale: 'all',
    placement: 'hero_demo',
    asset: {
      id: 'asset_model_demo',
      type: 'video',
      url: 'https://assets.toolaze.com/generated/wan-demo.mp4',
    },
  }, storePath, '2026-08-05T08:20:00.000Z')
  await publishPageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-05T08:21:00.000Z')

  const content: any = await applyPublishedPageDemoAssignments({ heroDemoVideo: { src: 'https://assets.toolaze.com/original.mp4' } }, {
    pageSlug: 'wan-2-6-ai-video-generator',
    locale: 'ja',
    filePath: storePath,
  })

  assert.equal(content.heroDemoVideo.src, 'https://assets.toolaze.com/generated/wan-demo.mp4')
})

test('draft hero demo can override page demo media for local preview mode', async () => {
  const storePath = filePath('draft-local-preview.json')
  await saveDraftPageDemoAssignment({
    pageSlug: 'model/wan-2-7-ai-video-generator',
    locale: 'all',
    placement: 'hero_demo',
    applyMode: 'demo_only',
    asset: {
      id: 'asset_wan_27_draft',
      type: 'video',
      url: 'https://assets.toolaze.com/generated/wan-2-7-draft.mp4',
    },
  }, storePath, '2026-08-06T08:00:00.000Z')

  const defaultContent: any = await applyPublishedPageDemoAssignments({
    heroDemoVideo: { src: 'https://assets.toolaze.com/original-wan-2-7.png' },
  }, {
    pageSlug: 'wan-2-7-ai-video-generator',
    locale: 'en',
    filePath: storePath,
  })
  const localPreviewContent: any = await applyPublishedPageDemoAssignments({
    heroDemoVideo: { src: 'https://assets.toolaze.com/original-wan-2-7.png' },
  }, {
    pageSlug: 'wan-2-7-ai-video-generator',
    locale: 'en',
    filePath: storePath,
    includeDrafts: true,
  })

  assert.equal(defaultContent.heroDemoVideo.src, 'https://assets.toolaze.com/original-wan-2-7.png')
  assert.equal(localPreviewContent.heroDemoVideo.src, 'https://assets.toolaze.com/generated/wan-2-7-draft.mp4')
  assert.equal(localPreviewContent.heroDemoVideo.type, 'video')
})
