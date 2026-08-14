import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import {
  fetchProductionDailyMetrics,
  type AdminDailyMetric,
  type AdminDailyMetricsDashboard,
} from '@/lib/admin/daily-metrics'

export const metadata: Metadata = {
  title: '每日数据看板 | Toolaze Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function AdminDataDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ refresh?: string }>
}) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')

  if (!isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    notFound()
  }

  try {
    const { refresh } = searchParams ? await searchParams : {}
    const data = await fetchProductionDailyMetrics(undefined, undefined, {
      forceRefresh: refresh === '1',
    })

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader fetchedAt={data.fetchedAt} />
        <section className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
          <DailyMetricsDashboard data={data} />
        </section>
      </main>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '每日数据读取失败。'

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader />
        <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold text-red-700">无法读取线上 D1</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">每日数据看板暂时不可用</h1>
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

function AdminHeader({ fetchedAt }: { fetchedAt?: string }) {
  return (
    <header className="border-b border-slate-200 bg-[#fbfcff]">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-7 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">每日数据看板</h1>
          {fetchedAt ? (
            <p className="mt-2 text-xs text-slate-400">
              数据读取时间：{new Date(fetchedAt).toLocaleString('zh-CN', { hour12: false })}
            </p>
          ) : null}
        </div>

        <a href="/admin/data-dashboard?refresh=1" className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700">
          刷新数据
        </a>
      </div>
    </header>
  )
}

function DailyMetricsDashboard({ data }: { data: AdminDailyMetricsDashboard }) {
  const statItems = [
    { label: '签到用户', value: data.totals.checkinUsers, detail: '最近 30 天 daily_checkin 去重用户合计' },
    { label: '完成注册', value: data.totals.registeredUsers, detail: '最近 30 天 users.created_at 新增用户' },
    { label: '生图用户', value: data.totals.imageGenerationUsers, detail: '最近 30 天生成图片的去重用户合计' },
    { label: '生图次数', value: data.totals.imageGenerationCount, detail: '最近 30 天完成的图片生成记录' },
  ]

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <article key={item.label} className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {item.value.toLocaleString('zh-CN')}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50/80 px-5 py-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">最近 30 天每日数据</h2>
            <p className="mt-1 text-xs text-slate-500">
              日期按北京时间（UTC+8）统计；真实使用生图以 `generation_history.media_type = image` 的成功记录为准。
            </p>
          </div>
          <p className="text-xs text-slate-400">最新日期：{data.latestDate || '—'}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500">
                <th className="px-5 py-3">日期</th>
                <th className="px-4 py-3 text-right">签到用户</th>
                <th className="px-4 py-3 text-right">完成注册</th>
                <th className="px-4 py-3 text-right">生图用户</th>
                <th className="px-5 py-3 text-right">生图次数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.rows.length > 0 ? (
                data.rows.map((row) => <DailyMetricRow key={row.date} row={row} />)
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-sm text-slate-500">暂无每日数据。</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function DailyMetricRow({ row }: { row: AdminDailyMetric }) {
  return (
    <tr className="text-sm text-slate-700 transition hover:bg-indigo-50/30">
      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-600">{row.date}</td>
      <td className="px-4 py-4 text-right font-semibold text-slate-950">{row.checkinUsers.toLocaleString('zh-CN')}</td>
      <td className="px-4 py-4 text-right font-semibold text-slate-950">{row.registeredUsers.toLocaleString('zh-CN')}</td>
      <td className="px-4 py-4 text-right font-semibold text-slate-950">{row.imageGenerationUsers.toLocaleString('zh-CN')}</td>
      <td className="px-5 py-4 text-right font-semibold text-slate-950">{row.imageGenerationCount.toLocaleString('zh-CN')}</td>
    </tr>
  )
}
