import {
  archivePageDemoAssignment,
  DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  loadPageDemoAssignments,
  publishPageDemoAssignment,
  saveDraftPageDemoAssignment,
  updateDraftPageDemoAssignment,
  type PageDemoApplyMode,
  type PageDemoAssignmentStatus,
  type PageDemoPlacement,
} from '@/lib/admin/page-demo-assignments'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

type SaveDraftBody = {
  action: 'save_draft'
  pageSlug?: string
  locale?: string
  placement?: PageDemoPlacement
  applyMode?: PageDemoApplyMode
  title?: string
  asset?: unknown
  inputAssets?: unknown[]
  prompt?: string
  model?: string
  params?: Record<string, unknown>
  sourceHistoryId?: string
}

type PublishBody = {
  action: 'publish' | 'archive'
  assignmentId?: string
}

type UpdateDraftBody = Omit<SaveDraftBody, 'action' | 'asset'> & {
  action: 'update_draft'
  assignmentId?: string
  asset?: unknown
}

type ActionBody = SaveDraftBody | PublishBody | UpdateDraftBody

export async function GET(request: Request) {
  if (!isRequestAllowed(request)) return json({ error: 'Not found' }, 404)
  if (shouldUseOnlineAssignments(request)) return proxyToOnlineAssignments(request)

  const url = new URL(request.url)
  const status = readStatus(url.searchParams.get('status'))
  const data = await loadPageDemoAssignments(getAssignmentsPath())
  const assignments = status
    ? data.assignments.filter((assignment) => assignment.status === status)
    : data.assignments

  return json({
    assignments,
    total: assignments.length,
    storagePath: getAssignmentsPath(),
  })
}

export async function POST(request: Request) {
  if (!isRequestAllowed(request)) return json({ error: 'Not found' }, 404)
  if (shouldUseOnlineAssignments(request)) return proxyToOnlineAssignments(request)

  try {
    const body = await readJson<ActionBody>(request)

    if (body.action === 'save_draft') {
      const data = await saveDraftPageDemoAssignment({
        pageSlug: body.pageSlug || '',
        locale: body.locale,
        placement: body.placement as PageDemoPlacement,
        applyMode: body.applyMode,
        title: body.title,
        asset: body.asset as never,
        inputAssets: body.inputAssets as never,
        prompt: body.prompt,
        model: body.model,
        params: body.params,
        sourceHistoryId: body.sourceHistoryId,
      }, getAssignmentsPath())
      const assignment = data.assignments.find((item) => (
        item.status === 'draft'
        && item.pageSlug === normalizePageSlugForLookup(body.pageSlug || '')
        && item.locale === normalizeLocaleForLookup(body.locale)
        && item.placement === body.placement
      )) || data.assignments[0]

      return json({
        assignment,
        assignments: data.assignments,
        previewUrl: `/admin/page-demo-preview?id=${encodeURIComponent(assignment.id)}`,
      }, 201)
    }

    if (body.action === 'update_draft') {
      const result = await updateDraftPageDemoAssignment({
        assignmentId: String(body.assignmentId || ''),
        pageSlug: body.pageSlug,
        locale: body.locale,
        placement: body.placement,
        applyMode: body.applyMode,
        title: body.title,
        asset: body.asset as never,
        inputAssets: body.inputAssets as never,
        prompt: body.prompt,
        model: body.model,
        params: body.params,
        sourceHistoryId: body.sourceHistoryId,
      }, getAssignmentsPath())

      return json({
        ...result,
        previewUrl: `/admin/page-demo-preview?id=${encodeURIComponent(result.assignment.id)}`,
      })
    }

    if (body.action === 'publish') {
      const result = await publishPageDemoAssignment(String(body.assignmentId || ''), getAssignmentsPath())
      return json({
        ...result,
        previewUrl: `/admin/page-demo-preview?id=${encodeURIComponent(result.assignment.id)}`,
      })
    }

    if (body.action === 'archive') {
      return json(await archivePageDemoAssignment(String(body.assignmentId || ''), getAssignmentsPath()))
    }
  } catch (error) {
    return json({ error: readErrorMessage(error) }, 400)
  }

  return json({ error: '未知页面 Demo 配置操作。' }, 400)
}

function isRequestAllowed(request: Request): boolean {
  const requestUrl = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host
  if (isMainPreviewHost(host)) return false

  return (isPageDemoAdminHost(host) || isOnlinePageDemoAdminHost(host)) && isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(request.headers),
  })
}


function shouldUseOnlineAssignments(request: Request): boolean {
  const requestUrl = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host
  const source = requestUrl.searchParams.get('source')?.trim().toLowerCase()
  return source === 'online'
    || source === 'production'
    || source === 'd1'
    || process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_SOURCE === 'remote'
    || isOnlinePageDemoAdminHost(host)
}

async function proxyToOnlineAssignments(request: Request): Promise<Response> {
  const { proxyToPagesFunctions } = await import('../../_shared/backend-proxy.js')
  return proxyToPagesFunctions(request, '/api/page-demo-assignments/admin')
}

function isMainPreviewHost(host: string | null): boolean {
  return readHostPort(host).port === '3006'
}

function isOnlinePageDemoAdminHost(host: string | null): boolean {
  const { hostname } = readHostPort(host)
  return hostname === 'toolaze.com'
    || hostname === 'www.toolaze.com'
    || hostname.endsWith('.vercel.app')
}

function isPageDemoAdminHost(host: string | null): boolean {
  const { hostname, port } = readHostPort(host)
  return (
    (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]')
    && port === '3010'
  )
}

function readHostPort(host: string | null): { hostname: string; port: string } {
  if (!host) return { hostname: '', port: '' }
  const normalized = host.trim().toLowerCase()
  if (normalized.startsWith('[')) {
    return {
      hostname: normalized.slice(0, normalized.indexOf(']') + 1),
      port: normalized.slice(normalized.indexOf(']') + 1).replace(/^:/, ''),
    }
  }
  const [hostname, port = ''] = normalized.split(':')
  return { hostname, port }
}

function normalizePageSlugForLookup(value: string): string {
  return value.replace(/^\/+|\/+$/g, '').trim().toLowerCase()
}

function normalizeLocaleForLookup(value: string | undefined): string {
  const text = value?.trim()
  return text ? (text.toLowerCase() === 'all' ? 'all' : text) : 'all'
}

function readStatus(value: string | null): PageDemoAssignmentStatus | undefined {
  if (value === 'draft' || value === 'published' || value === 'archived') return value
  return undefined
}

async function readJson<T>(request: Request): Promise<T> {
  try {
    return await request.json() as T
  } catch {
    return {} as T
  }
}

function getAssignmentsPath(): string {
  return process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE || DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '页面 Demo 配置操作失败。'
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}
