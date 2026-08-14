import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH,
  loadPageDemoAssignments,
  type PageDemoAssignment,
} from '@/lib/admin/page-demo-assignments'

export const metadata: Metadata = {
  title: '页面 Demo 预览 | Toolaze Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

type PreviewSearchParams = Record<string, string | string[] | undefined>

type PreviewPageProps = {
  searchParams?: Promise<PreviewSearchParams>
}

export default async function AdminPageDemoPreviewPage({ searchParams }: PreviewPageProps) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')

  if (!isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    notFound()
  }

  const resolvedSearchParams: PreviewSearchParams = await Promise.resolve(searchParams || {})
  const id = readSearchParam(resolvedSearchParams.id)
  if (!id) notFound()

  const isOnlineMode = readSearchParam(resolvedSearchParams.source) === 'online'
  const storagePath = process.env.TOOLAZE_PAGE_DEMO_ASSIGNMENTS_FILE || DEFAULT_PAGE_DEMO_ASSIGNMENTS_PATH
  const assignments = isOnlineMode
    ? await fetchOnlinePageDemoAssignments(requestHeaders)
    : (await loadPageDemoAssignments(storagePath)).assignments
  const assignment = assignments.find((item) => item.id === id)
  if (!assignment) notFound()
  const assignmentsHref = isOnlineMode ? '/admin/page-demo-assignments?source=online' : '/admin/page-demo-assignments'

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-[#fbfcff]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-indigo-600">
              <Link href={assignmentsHref} className="transition hover:text-indigo-800">页面 Demo 配置</Link>
              <span className="text-slate-300">/</span>
              <span>预览</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Draft / Published 预览</h1>
            <p className="mt-2 text-sm text-slate-600">/{assignment.pageSlug} · {formatLocaleScope(assignment.locale)} · {assignment.placement} · {assignment.status}</p>
          </div>
          <Link href={assignmentsHref} className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700">
            返回配置列表
          </Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-[1280px] gap-6 px-5 py-7 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <PreviewMain assignment={assignment} />
        <PreviewDetails assignment={assignment} />
      </section>
    </main>
  )
}

async function fetchOnlinePageDemoAssignments(requestHeaders: Headers): Promise<PageDemoAssignment[]> {
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:3010'
  const protocol = requestHeaders.get('x-forwarded-proto') || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https')
  const url = new URL('/api/admin/page-demo-assignments?source=online', `${protocol}://${host}`)
  const headersForProxy = new Headers()
  const cookie = requestHeaders.get('cookie')
  const adminEmail = getAdminEmailFromHeaders(requestHeaders)
  if (cookie) headersForProxy.set('cookie', cookie)
  if (adminEmail) headersForProxy.set('cf-access-authenticated-user-email', adminEmail)

  const response = await fetch(url, {
    headers: headersForProxy,
    cache: 'no-store',
  })
  if (!response.ok) return []
  const payload = await response.json().catch(() => ({})) as { assignments?: PageDemoAssignment[] }
  return Array.isArray(payload.assignments) ? payload.assignments : []
}

function PreviewMain({ assignment }: { assignment: PageDemoAssignment }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Output Demo</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{assignment.title || assignment.asset.title || assignment.asset.id}</h2>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">{assignment.status}</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        {assignment.asset.type === 'video' ? (
          <video src={assignment.asset.url} poster={assignment.asset.posterUrl} controls muted preload="metadata" className="aspect-video w-full bg-slate-950 object-contain" />
        ) : (
          <img src={assignment.asset.url} alt={assignment.asset.title || 'Demo output'} className="max-h-[640px] w-full object-contain" />
        )}
      </div>
      {assignment.prompt ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Default Prompt</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{assignment.prompt}</p>
        </div>
      ) : null}
    </section>
  )
}

function PreviewDetails({ assignment }: { assignment: PageDemoAssignment }) {
  return (
    <aside className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">配置详情</h2>
        <dl className="mt-4 grid gap-2 text-xs text-slate-600">
          <Meta label="页面" value={`/${assignment.pageSlug}`} />
          <Meta label="语言范围" value={formatLocaleScope(assignment.locale)} />
          <Meta label="位置" value={assignment.placement} />
          <Meta label="模型" value={assignment.model || '—'} />
          <Meta label="版本" value={`v${assignment.version}`} />
          <Meta label="更新时间" value={formatDate(assignment.updatedAt)} />
        </dl>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">生成参数</h2>
        <dl className="mt-4 grid gap-2 text-xs text-slate-600">
          {Object.entries(assignment.params).length > 0 ? Object.entries(assignment.params).map(([key, value]) => (
            <Meta key={key} label={key} value={formatParamValue(value)} />
          )) : <Meta label="参数" value="—" />}
        </dl>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-950">参考 Input</h2>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">{assignment.inputAssets.length} 个</span>
        </div>
        <div className="mt-4 grid gap-3">
          {assignment.inputAssets.length > 0 ? assignment.inputAssets.map((asset) => (
            <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="grid grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2 transition hover:border-indigo-200">
              <div className="h-20 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                {asset.type === 'video' ? (
                  <video src={asset.url} poster={asset.posterUrl} muted preload="metadata" className="h-full w-full bg-slate-950 object-contain" />
                ) : (
                  <img src={asset.url} alt={asset.title || asset.id} className="h-full w-full object-contain" />
                )}
              </div>
              <div className="min-w-0 py-1">
                <p className="truncate text-xs font-semibold text-slate-800">{asset.title || asset.id}</p>
                <p className="mt-1 truncate font-mono text-[11px] text-slate-400">{asset.url}</p>
              </div>
            </a>
          )) : <p className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-500">没有参考 Input。</p>}
        </div>
      </section>
    </aside>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
      <dt className="font-semibold text-slate-400">{label}</dt>
      <dd className="truncate font-mono text-slate-600">{value}</dd>
    </div>
  )
}

function readSearchParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value || '').trim()
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

function formatLocaleScope(locale: string): string {
  return locale === 'all' ? '全部语言' : locale
}

function formatParamValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null || value === undefined) return '—'
  return JSON.stringify(value)
}
