import type { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  fetchProductionUserUsage,
  type AdminGenerationHistoryItem,
} from '@/lib/admin/users'
import { buildAdminMediaPreviewUrl } from '@/lib/admin/media-preview'

export const metadata: Metadata = {
  title: '用户使用记录 | Toolaze Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

type AdminUserUsagePageProps = {
  params: Promise<{
    userId: string
  }>
}

export default async function AdminUserUsagePage({ params }: AdminUserUsagePageProps) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')

  if (!isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    notFound()
  }

  const { userId: encodedUserId } = await params
  const userId = decodeURIComponent(encodedUserId)

  try {
    const items = await fetchProductionUserUsage(userId)

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader userId={userId} />
        <section className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
          <UsageTable items={items} />
        </section>
      </main>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '用户使用记录读取失败。'

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader userId={userId} />
        <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold text-red-700">无法读取线上 D1</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">用户使用记录暂时不可用</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">{message}</p>
            <div className="mt-6 rounded-lg bg-slate-950 px-4 py-3 font-mono text-xs text-slate-100">
              npx wrangler whoami
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              请先确认 Wrangler 已登录，并且当前 Cloudflare 账号有 toolaze-web-auth 的只读权限。
            </p>
          </div>
        </section>
      </main>
    )
  }
}

function AdminHeader({ userId }: { userId: string }) {
  return (
    <header className="border-b border-slate-200 bg-[#fbfcff]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Link href="/admin/users" className="transition hover:text-indigo-800">
              Google 用户管理
            </Link>
            <span className="text-slate-300">/</span>
            <span>使用记录</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">用户使用记录</h1>
          <p className="mt-2 max-w-4xl break-all font-mono text-xs leading-6 text-slate-500">
            {userId}
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
        >
          返回用户列表
        </Link>
      </div>
    </header>
  )
}

function UsageTable({ items }: { items: AdminGenerationHistoryItem[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">最近 100 条生成记录</h2>
        <p className="mt-1 text-xs text-slate-500">
          按生成时间倒序展示功能入口、模型、媒体类型、Prompt 和输出链接。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1280px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">时间</th>
              <th className="px-4 py-3">功能</th>
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">模型</th>
              <th className="px-4 py-3">Prompt</th>
              <th className="px-4 py-3">参数</th>
              <th className="px-5 py-3">输出</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="text-sm text-slate-700 transition hover:bg-indigo-50/30">
                  <td className="whitespace-nowrap px-5 py-4 text-xs">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-4">
                    <p className="max-w-56 truncate font-semibold text-slate-950">
                      {item.toolLabel || item.toolSlug || '—'}
                    </p>
                    <p className="mt-0.5 max-w-56 truncate font-mono text-[11px] text-slate-400">
                      {item.sourcePath || item.toolSlug || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      {item.mediaType}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-600">{item.model}</td>
                  <td className="px-4 py-4">
                    <p className="line-clamp-3 max-w-md text-xs leading-5 text-slate-600">
                      {item.prompt}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-xs leading-5 text-slate-500">
                    <p>比例：{item.aspectRatio || '—'}</p>
                    <p>分辨率：{item.resolution || '—'}</p>
                    <p>格式：{item.outputFormat || '—'}</p>
                    <p>输入：{item.inputUrls.length.toLocaleString('zh-CN')} 个</p>
                  </td>
                  <td className="px-5 py-4">
                    <OutputPreview item={item} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center text-sm text-slate-500">
                  该用户暂无生成使用记录。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function OutputPreview({ item }: { item: AdminGenerationHistoryItem }) {
  const previewUrl = buildAdminMediaPreviewUrl(item.outputUrl) ?? item.outputUrl

  return (
    <div className="w-44">
      <a
        href={previewUrl}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:border-indigo-300"
      >
        {item.mediaType === 'video' ? (
          <video
            src={previewUrl}
            controls
            muted
            preload="metadata"
            className="aspect-video w-full bg-slate-950 object-contain"
          />
        ) : (
          <img
            src={previewUrl}
            alt="用户生成结果预览"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="aspect-square w-full bg-slate-100 object-contain"
          />
        )}
      </a>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          浏览器预览
        </a>
        <a
          href={item.outputUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-semibold text-slate-500 transition hover:text-slate-700"
        >
          下载原图
        </a>
      </div>
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}
