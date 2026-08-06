import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { test } from 'node:test'
import {
  archivePageDemoAssignment,
  findPublishedPageDemoAssignment,
  loadPageDemoAssignments,
  publishPageDemoAssignment,
  saveDraftPageDemoAssignment,
  sortPageDemoAssignmentsForReview,
  updateDraftPageDemoAssignment,
} from './page-demo-assignments'

const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-page-demo-assignments-test-'))

test.after(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

function filePath(name: string): string {
  return join(tempDir, name)
}

test('saves a draft page demo assignment from an output asset and its inputs', async () => {
  const storePath = filePath('draft.json')
  const data = await saveDraftPageDemoAssignment({
    applyMode: 'demo_with_parameters',
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    title: 'Warm portrait demo',
    asset: {
      id: 'asset_output',
      type: 'image',
      url: 'https://assets.toolaze.com/generated/output.png',
      title: 'Clothes Output',
    },
    inputAssets: [{
      id: 'asset_input',
      type: 'image',
      url: 'https://assets.toolaze.com/uploads/reference.webp',
      title: 'Reference Input',
    }],
    prompt: 'Change the outfit into a tailored black suit.',
    model: 'gpt-image-2',
    params: { aspectRatio: '3:4', resolution: '1K' },
  }, storePath, '2026-08-04T12:00:00.000Z')

  assert.equal(data.assignments.length, 1)
  assert.equal(data.assignments[0].status, 'draft')
  assert.equal(data.assignments[0].applyMode, 'demo_with_parameters')
  assert.equal(data.assignments[0].pageSlug, 'ai-clothes-changer')
  assert.equal(data.assignments[0].placement, 'hero_demo')
  assert.equal(data.assignments[0].inputAssets.length, 1)
  assert.deepEqual(data.assignments[0].params, { aspectRatio: '3:4', resolution: '1K' })

  const persisted = await loadPageDemoAssignments(storePath)
  assert.equal(persisted.assignments[0].id, data.assignments[0].id)
  assert.equal(persisted.assignments[0].applyMode, 'demo_with_parameters')
})

test('keeps video schema metadata on page demo asset snapshots', async () => {
  const storePath = filePath('video-schema-metadata.json')
  const data = await saveDraftPageDemoAssignment({
    pageSlug: 'image-to-video-generator',
    placement: 'hero_demo',
    asset: {
      id: 'asset_video_output',
      type: 'video',
      url: 'https://assets.toolaze.com/generated/output.mp4',
      posterUrl: 'https://assets.toolaze.com/generated/output.webp',
      title: 'Output Video',
      durationSeconds: 8,
      duration: 'PT8S',
      uploadDate: '2026-08-05T08:00:00.000Z',
    },
  }, storePath, '2026-08-05T08:10:00.000Z')

  assert.equal(data.assignments[0].asset.posterUrl, 'https://assets.toolaze.com/generated/output.webp')
  assert.equal(data.assignments[0].asset.durationSeconds, 8)
  assert.equal(data.assignments[0].asset.duration, 'PT8S')
  assert.equal(data.assignments[0].asset.uploadDate, '2026-08-05T08:00:00.000Z')

  const persisted = await loadPageDemoAssignments(storePath)
  assert.equal(persisted.assignments[0].asset.duration, 'PT8S')
  assert.equal(persisted.assignments[0].asset.uploadDate, '2026-08-05T08:00:00.000Z')
})

test('defaults page demo drafts to output-only without carrying generation inputs', async () => {
  const storePath = filePath('demo-only-default.json')
  const data = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    asset: {
      id: 'asset_output',
      type: 'image',
      url: 'https://assets.toolaze.com/generated/output.png',
    },
    inputAssets: [{
      id: 'asset_input',
      type: 'image',
      url: 'https://assets.toolaze.com/uploads/reference.webp',
    }],
    prompt: 'This prompt should not be used as a page default.',
    model: 'gpt-image-2',
    params: { resolution: '1K' },
  }, storePath, '2026-08-04T12:00:00.000Z')

  assert.equal(data.assignments[0].applyMode, 'demo_only')
  assert.equal(data.assignments[0].inputAssets.length, 0)
  assert.equal(data.assignments[0].prompt, undefined)
  assert.equal(data.assignments[0].model, undefined)
  assert.deepEqual(data.assignments[0].params, {})
})

test('applies page demo assignments to all languages by default', async () => {
  const storePath = filePath('all-languages-default.json')
  const data = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    placement: 'hero_demo',
    asset: { id: 'asset_output', type: 'image', url: 'https://assets.toolaze.com/generated/output.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')

  assert.equal(data.assignments[0].locale, 'all')

  const replaced = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'all',
    placement: 'hero_demo',
    asset: { id: 'asset_next', type: 'image', url: 'https://assets.toolaze.com/generated/next.png' },
  }, storePath, '2026-08-04T12:05:00.000Z')

  assert.equal(replaced.assignments.length, 1)
  assert.equal(replaced.assignments[0].locale, 'all')
  assert.equal(replaced.assignments[0].asset.id, 'asset_next')
})

test('replaces an existing draft for the same page locale and placement', async () => {
  const storePath = filePath('replace-draft.json')
  const first = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    asset: { id: 'asset_one', type: 'image', url: 'https://assets.toolaze.com/generated/one.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  const second = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    asset: { id: 'asset_two', type: 'image', url: 'https://assets.toolaze.com/generated/two.png' },
  }, storePath, '2026-08-04T12:05:00.000Z')

  assert.equal(second.assignments.length, 1)
  assert.equal(second.assignments[0].id, first.assignments[0].id)
  assert.equal(second.assignments[0].asset.id, 'asset_two')
  assert.equal(second.assignments[0].version, 2)
})

test('updates an existing draft assignment so admins can change the target page', async () => {
  const storePath = filePath('update-draft-page.json')
  const first = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'all',
    placement: 'hero_demo',
    asset: { id: 'asset_one', type: 'image', url: 'https://assets.toolaze.com/generated/one.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')

  const updated = await updateDraftPageDemoAssignment({
    assignmentId: first.assignments[0].id,
    pageSlug: 'image-to-video-generator',
    locale: 'all',
    placement: 'default_reference',
    applyMode: 'demo_with_parameters',
    title: 'Moved demo',
  }, storePath, '2026-08-04T12:05:00.000Z')

  assert.equal(updated.assignment.id, first.assignments[0].id)
  assert.equal(updated.assignment.pageSlug, 'image-to-video-generator')
  assert.equal(updated.assignment.placement, 'default_reference')
  assert.equal(updated.assignment.applyMode, 'demo_with_parameters')
  assert.equal(updated.assignment.title, 'Moved demo')
  assert.equal(updated.assignment.asset.id, 'asset_one')
  assert.equal(updated.assignment.version, 2)
  assert.equal(updated.assignments.length, 1)
})

test('updates an existing published assignment so admins can retarget the same asset', async () => {
  const storePath = filePath('update-published-page.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'all',
    placement: 'hero_demo',
    asset: { id: 'asset_published_editable', type: 'image', url: 'https://assets.toolaze.com/generated/published-editable.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  const published = await publishPageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-04T12:01:00.000Z')

  const updated = await updateDraftPageDemoAssignment({
    assignmentId: published.assignment.id,
    pageSlug: 'model/wan-2-7-ai-video-generator',
    locale: 'all',
    placement: 'hero_demo',
    applyMode: 'demo_only',
    title: 'Moved published demo',
  }, storePath, '2026-08-04T12:05:00.000Z')

  assert.equal(updated.assignment.id, published.assignment.id)
  assert.equal(updated.assignment.status, 'published')
  assert.equal(updated.assignment.pageSlug, 'model/wan-2-7-ai-video-generator')
  assert.equal(updated.assignment.title, 'Moved published demo')
  assert.equal(updated.assignment.asset.id, 'asset_published_editable')
  assert.equal(updated.assignment.version, 2)
})

test('does not update archived page demo assignments', async () => {
  const storePath = filePath('update-archived-page.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    placement: 'hero_demo',
    asset: { id: 'asset_archived_edit', type: 'image', url: 'https://assets.toolaze.com/generated/archived-edit.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  const archived = await archivePageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-04T12:01:00.000Z')

  await assert.rejects(
    updateDraftPageDemoAssignment({
      assignmentId: archived.assignment.id,
      pageSlug: 'image-to-video-generator',
    }, storePath, '2026-08-04T12:05:00.000Z'),
    /归档配置不能编辑/,
  )
})

test('publishes one assignment and archives the previous published assignment for that slot', async () => {
  const storePath = filePath('publish.json')
  const firstDraft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    asset: { id: 'asset_one', type: 'image', url: 'https://assets.toolaze.com/generated/one.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  const firstPublished = await publishPageDemoAssignment(firstDraft.assignments[0].id, storePath, '2026-08-04T12:01:00.000Z')
  const nextDraft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    asset: { id: 'asset_two', type: 'image', url: 'https://assets.toolaze.com/generated/two.png' },
  }, storePath, '2026-08-04T12:02:00.000Z')
  const nextPublished = await publishPageDemoAssignment(nextDraft.assignments[0].id, storePath, '2026-08-04T12:03:00.000Z')

  assert.equal(firstPublished.assignment.status, 'published')
  assert.equal(nextPublished.assignment.status, 'published')
  assert.equal(nextPublished.assignments.filter((item) => item.status === 'published').length, 1)
  assert.equal(nextPublished.assignments.find((item) => item.asset.id === 'asset_one')?.status, 'archived')
})

test('archives an assignment without deleting it', async () => {
  const storePath = filePath('archive.json')
  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'prompt_example',
    asset: { id: 'asset_one', type: 'image', url: 'https://assets.toolaze.com/generated/one.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  const archived = await archivePageDemoAssignment(draft.assignments[0].id, storePath, '2026-08-04T12:01:00.000Z')

  assert.equal(archived.assignment.status, 'archived')
  assert.equal(archived.assignments.length, 1)
})

test('sorts active page demo assignments before archived records', async () => {
  const storePath = filePath('sort-review.json')
  const publishedDraft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'hero_demo',
    asset: { id: 'asset_published', type: 'image', url: 'https://assets.toolaze.com/generated/published.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  await publishPageDemoAssignment(publishedDraft.assignments[0].id, storePath, '2026-08-04T12:01:00.000Z')

  const archivedDraft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'en',
    placement: 'prompt_example',
    asset: { id: 'asset_archived', type: 'image', url: 'https://assets.toolaze.com/generated/archived.png' },
  }, storePath, '2026-08-04T12:03:00.000Z')
  await archivePageDemoAssignment(archivedDraft.assignments[0].id, storePath, '2026-08-04T12:06:00.000Z')

  const draft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-baby-generator',
    locale: 'pt',
    placement: 'default_reference',
    asset: { id: 'asset_draft', type: 'image', url: 'https://assets.toolaze.com/generated/draft.png' },
  }, storePath, '2026-08-04T12:04:00.000Z')
  const sorted = sortPageDemoAssignmentsForReview(draft.assignments)

  assert.deepEqual(sorted.map((item) => item.asset.id), [
    'asset_draft',
    'asset_published',
    'asset_archived',
  ])
})

test('finds published page demos by locale with all-language fallback', async () => {
  const storePath = filePath('find-published.json')
  const allDraft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'all',
    placement: 'hero_demo',
    asset: { id: 'asset_all', type: 'image', url: 'https://assets.toolaze.com/generated/all.png' },
  }, storePath, '2026-08-04T12:00:00.000Z')
  await publishPageDemoAssignment(allDraft.assignments[0].id, storePath, '2026-08-04T12:01:00.000Z')
  const localeDraft = await saveDraftPageDemoAssignment({
    pageSlug: 'ai-clothes-changer',
    locale: 'ja',
    placement: 'hero_demo',
    asset: { id: 'asset_ja', type: 'image', url: 'https://assets.toolaze.com/generated/ja.png' },
  }, storePath, '2026-08-04T12:02:00.000Z')
  const published = await publishPageDemoAssignment(localeDraft.assignments[0].id, storePath, '2026-08-04T12:03:00.000Z')

  assert.equal(findPublishedPageDemoAssignment(published.assignments, {
    pageSlug: 'ai-clothes-changer',
    locale: 'ja',
    placement: 'hero_demo',
  })?.asset.id, 'asset_ja')
  assert.equal(findPublishedPageDemoAssignment(published.assignments, {
    pageSlug: 'ai-clothes-changer',
    locale: 'pt',
    placement: 'hero_demo',
  })?.asset.id, 'asset_all')
})
