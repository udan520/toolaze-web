import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'

const previousFile = process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE
const previousRemoteAdmin = process.env.TOOLAZE_ENABLE_REMOTE_ADMIN
const previousAdminEmails = process.env.TOOLAZE_ADMIN_EMAILS
const tempDir = mkdtempSync(join(tmpdir(), 'toolaze-page-demo-route-test-'))
process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE = join(tempDir, 'assignments.json')

test.after(() => {
  if (previousFile === undefined) {
    delete process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE
  } else {
    process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE = previousFile
  }
  if (previousRemoteAdmin === undefined) delete process.env.TOOLAZE_ENABLE_REMOTE_ADMIN
  else process.env.TOOLAZE_ENABLE_REMOTE_ADMIN = previousRemoteAdmin
  if (previousAdminEmails === undefined) delete process.env.TOOLAZE_ADMIN_EMAILS
  else process.env.TOOLAZE_ADMIN_EMAILS = previousAdminEmails
  rmSync(tempDir, { recursive: true, force: true })
})

test('page demo assignments API is hidden on production by default', async () => {
  const route = await import('./route')
  const response = await route.GET(new Request('https://toolaze.com/api/admin/page-demo-assignments'))

  assert.equal(response.status, 404)
})

test('page demo assignments API does not run on the main 3006 preview port', async () => {
  const route = await import('./route')
  const response = await route.GET(new Request('http://localhost:3006/api/admin/page-demo-assignments'))

  assert.equal(response.status, 404)
})

test('localhost page demo assignments API proxies online D1 source from port 3010', async () => {
  const route = await import('./route')
  const originalFetch = globalThis.fetch
  let proxiedRequest: { url: string; method?: string } | null = null

  globalThis.fetch = async (target, init = {}) => {
    proxiedRequest = {
      url: String(target),
      method: init.method,
    }
    return Response.json({ assignments: [{ id: 'online_demo', status: 'published' }] })
  }

  try {
    const response = await route.GET(new Request('http://localhost:3010/api/admin/page-demo-assignments?source=online'))
    const payload = await response.json()

    assert.equal(response.status, 200)
    assert.equal(payload.assignments[0].id, 'online_demo')
    assert.ok(proxiedRequest)
    const proxied = proxiedRequest as { url: string; method?: string }
    assert.equal(proxied.url, 'https://toolaze-web.pages.dev/api/page-demo-assignments/admin?source=online')
    assert.equal(proxied.method, 'GET')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('remote page demo assignments API proxies when remote admin allowlist passes', async () => {
  const route = await import('./route')
  const originalFetch = globalThis.fetch
  process.env.TOOLAZE_ENABLE_REMOTE_ADMIN = 'true'
  process.env.TOOLAZE_ADMIN_EMAILS = 'owner@example.com'
  let proxiedRequest: { url: string; method?: string; headers: Headers } | null = null

  globalThis.fetch = async (target, init = {}) => {
    proxiedRequest = {
      url: String(target),
      method: init.method,
      headers: new Headers(init.headers),
    }
    return Response.json({ assignments: [] })
  }

  try {
    const response = await route.GET(new Request('https://toolaze.com/api/admin/page-demo-assignments', {
      headers: {
        'cf-access-authenticated-user-email': 'owner@example.com',
        cookie: 'toolaze_session=prod-session',
      },
    }))

    assert.equal(response.status, 200)
    assert.ok(proxiedRequest)
    const proxied = proxiedRequest as { url: string; method?: string; headers: Headers }
    assert.equal(proxied.url, 'https://toolaze-web.pages.dev/api/page-demo-assignments/admin')
    assert.equal(proxied.headers.get('cookie'), 'toolaze_session=prod-session')
    assert.equal(proxied.headers.get('host'), null)
  } finally {
    globalThis.fetch = originalFetch
    if (previousRemoteAdmin === undefined) delete process.env.TOOLAZE_ENABLE_REMOTE_ADMIN
    else process.env.TOOLAZE_ENABLE_REMOTE_ADMIN = previousRemoteAdmin
    if (previousAdminEmails === undefined) delete process.env.TOOLAZE_ADMIN_EMAILS
    else process.env.TOOLAZE_ADMIN_EMAILS = previousAdminEmails
  }
})

test('localhost page demo assignments API saves drafts and publishes them on port 3010', async () => {
  const route = await import('./route')
  const draftResponse = await route.POST(new Request('http://localhost:3010/api/admin/page-demo-assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'save_draft',
      applyMode: 'demo_with_parameters',
      pageSlug: 'ai-clothes-changer',
      locale: 'en',
      placement: 'hero_demo',
      asset: {
        id: 'asset_output',
        type: 'image',
        url: 'https://assets.toolaze.com/generated/output.png',
        title: 'Output Demo',
      },
      inputAssets: [{
        id: 'asset_input',
        type: 'image',
        url: 'https://assets.toolaze.com/uploads/ref.webp',
      }],
      prompt: 'Change the outfit.',
      model: 'gpt-image-2',
      params: { resolution: '1K' },
    }),
  }))
  const draftPayload = await draftResponse.json()

  assert.equal(draftResponse.status, 201)
  assert.equal(draftPayload.assignment.status, 'draft')
  assert.equal(draftPayload.assignment.applyMode, 'demo_with_parameters')
  assert.equal(draftPayload.assignment.inputAssets.length, 1)

  const publishResponse = await route.POST(new Request('http://localhost:3010/api/admin/page-demo-assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'publish',
      assignmentId: draftPayload.assignment.id,
    }),
  }))
  const publishPayload = await publishResponse.json()

  assert.equal(publishResponse.status, 200)
  assert.equal(publishPayload.assignment.status, 'published')

  const listResponse = await route.GET(new Request('http://localhost:3010/api/admin/page-demo-assignments?status=published'))
  const listPayload = await listResponse.json()

  assert.equal(listResponse.status, 200)
  assert.equal(listPayload.assignments.length, 1)
  assert.equal(listPayload.assignments[0].pageSlug, 'ai-clothes-changer')
})

test('localhost page demo assignments API defaults drafts to all languages', async () => {
  const route = await import('./route')
  const draftResponse = await route.POST(new Request('http://localhost:3010/api/admin/page-demo-assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'save_draft',
      pageSlug: 'ai-baby-generator',
      placement: 'default_reference',
      asset: {
        id: 'asset_all_languages',
        type: 'image',
        url: 'https://assets.toolaze.com/generated/all-languages.png',
      },
    }),
  }))
  const draftPayload = await draftResponse.json()

  assert.equal(draftResponse.status, 201)
  assert.equal(draftPayload.assignment.locale, 'all')
})

test('localhost page demo assignments API defaults to output-only apply mode', async () => {
  const route = await import('./route')
  const draftResponse = await route.POST(new Request('http://localhost:3010/api/admin/page-demo-assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'save_draft',
      pageSlug: 'image-to-video-generator',
      placement: 'hero_demo',
      asset: {
        id: 'asset_output_only',
        type: 'video',
        url: 'https://assets.toolaze.com/generated/output.mp4',
      },
      inputAssets: [{
        id: 'asset_input_ignored',
        type: 'image',
        url: 'https://assets.toolaze.com/uploads/reference.webp',
      }],
      prompt: 'Do not carry this prompt to the page.',
      model: 'veo-3',
      params: { duration: 8 },
    }),
  }))
  const draftPayload = await draftResponse.json()

  assert.equal(draftResponse.status, 201)
  assert.equal(draftPayload.assignment.applyMode, 'demo_only')
  assert.equal(draftPayload.assignment.inputAssets.length, 0)
  assert.equal(draftPayload.assignment.prompt, undefined)
  assert.equal(draftPayload.assignment.model, undefined)
  assert.deepEqual(draftPayload.assignment.params, {})
})

test('localhost page demo assignments API updates an existing draft target page', async () => {
  const route = await import('./route')
  const draftResponse = await route.POST(new Request('http://localhost:3010/api/admin/page-demo-assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'save_draft',
      pageSlug: 'ai-clothes-changer',
      placement: 'hero_demo',
      asset: {
        id: 'asset_editable',
        type: 'image',
        url: 'https://assets.toolaze.com/generated/editable.png',
      },
    }),
  }))
  const draftPayload = await draftResponse.json()

  const updateResponse = await route.POST(new Request('http://localhost:3010/api/admin/page-demo-assignments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      action: 'update_draft',
      assignmentId: draftPayload.assignment.id,
      pageSlug: 'image-to-video-generator',
      locale: 'all',
      placement: 'default_reference',
      applyMode: 'demo_only',
      title: 'Moved output demo',
    }),
  }))
  const updatePayload = await updateResponse.json()

  assert.equal(updateResponse.status, 200)
  assert.equal(updatePayload.assignment.id, draftPayload.assignment.id)
  assert.equal(updatePayload.assignment.pageSlug, 'image-to-video-generator')
  assert.equal(updatePayload.assignment.placement, 'default_reference')
  assert.equal(updatePayload.assignment.title, 'Moved output demo')
  assert.equal(updatePayload.assignments.filter((assignment: any) => assignment.id === draftPayload.assignment.id).length, 1)
})
