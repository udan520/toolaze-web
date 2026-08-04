import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  filterOnlineMediaResources,
  mapR2ObjectsToOnlineMediaResources,
  parseR2ListObjectsResponse,
} from './media-library-online-assets'

const r2Xml = `<?xml version="1.0" encoding="UTF-8"?>
<ListBucketResult>
  <Name>toolaze</Name>
  <Prefix>uploads/</Prefix>
  <IsTruncated>false</IsTruncated>
  <Contents>
    <Key>uploads/full-body-reference.webp</Key>
    <LastModified>2026-08-04T03:00:00.000Z</LastModified>
    <Size>12345</Size>
  </Contents>
  <Contents>
    <Key>uploads/demo-video.mp4</Key>
    <LastModified>2026-08-04T03:05:00.000Z</LastModified>
    <Size>456789</Size>
  </Contents>
  <Contents>
    <Key>uploads/readme.txt</Key>
    <LastModified>2026-08-04T03:10:00.000Z</LastModified>
    <Size>12</Size>
  </Contents>
</ListBucketResult>`

test('maps R2 objects into online media resources with public URLs', () => {
  const parsed = parseR2ListObjectsResponse(r2Xml)
  const resources = mapR2ObjectsToOnlineMediaResources(parsed.objects, {
    publicBaseUrl: 'https://assets.toolaze.com',
    existingUrls: new Set(['https://assets.toolaze.com/uploads/full-body-reference.webp']),
  })

  assert.deepEqual(
    resources.map((resource) => ({
      key: resource.key,
      type: resource.type,
      url: resource.url,
      alreadyInLibrary: resource.alreadyInLibrary,
    })),
    [
      {
        key: 'uploads/full-body-reference.webp',
        type: 'image',
        url: 'https://assets.toolaze.com/uploads/full-body-reference.webp',
        alreadyInLibrary: true,
      },
      {
        key: 'uploads/demo-video.mp4',
        type: 'video',
        url: 'https://assets.toolaze.com/uploads/demo-video.mp4',
        alreadyInLibrary: false,
      },
    ],
  )
})

test('filters online media resources by type, prefix, and query', () => {
  const resources = mapR2ObjectsToOnlineMediaResources(parseR2ListObjectsResponse(r2Xml).objects, {
    publicBaseUrl: 'https://assets.toolaze.com',
    existingUrls: new Set(),
  })

  const matches = filterOnlineMediaResources(resources, {
    type: 'image',
    prefix: 'uploads/',
    query: 'full body',
  })

  assert.deepEqual(matches.map((resource) => resource.key), ['uploads/full-body-reference.webp'])
})
