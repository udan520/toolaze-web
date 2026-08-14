import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  fetchLocalReleaseCalendar,
  type AdminReleaseCalendar,
} from '@/lib/admin/release-calendar'
import { ReleaseCalendarPlanner } from '@/components/admin/ReleaseCalendarPlanner'

export const metadata: Metadata = {
  title: '个人发版记录 | Toolaze Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function AdminReleasesPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')

  if (!isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    notFound()
  }

  try {
    const data = await fetchLocalReleaseCalendar()

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader data={data} />
        <section className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
          <ReleaseCalendarPlanner data={data} />
        </section>
      </main>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '本地发版记录读取失败。'

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader />
        <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold text-red-700">无法读取本地 Git</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">个人发版记录暂时不可用</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">{message}</p>
            <div className="mt-6 rounded-lg bg-slate-950 px-4 py-3 font-mono text-xs text-slate-100">
              git log --since=YYYY-MM-DD --name-status
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              该后台页只读取当前项目的 Git 历史，不访问线上数据库，也不会执行发布动作。
            </p>
          </div>
        </section>
      </main>
    )
  }
}

function AdminHeader({ data }: { data?: AdminReleaseCalendar }) {
  return (
    <header className="border-b border-slate-200 bg-[#fbfcff]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">个人发版记录</h1>
          {data ? (
            <p className="mt-2 text-xs text-slate-400">
              范围：{data.startDate} 至 {data.endDate}；读取时间：{new Date(data.fetchedAt).toLocaleString('zh-CN', { hour12: false })}
            </p>
          ) : null}
        </div>

        <a href="/admin/releases" className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700">
          刷新记录
        </a>
      </div>
    </header>
  )
}
