import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import UserDashboard from '@/components/admin/UserDashboard'
import {
  getAdminEmailFromHeaders,
  isAdminRequestAllowed,
} from '@/lib/admin/access'
import { fetchProductionUsers } from '@/lib/admin/users'

export const metadata: Metadata = {
  title: 'Google 用户管理 | Toolaze Admin',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

export default async function AdminUsersPage() {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')

  if (!isAdminRequestAllowed({
    host,
    adminEmail: getAdminEmailFromHeaders(requestHeaders),
  })) {
    notFound()
  }

  try {
    const data = await fetchProductionUsers()

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader fetchedAt={data.fetchedAt} />
        <div className="mx-auto max-w-[1480px] px-5 py-7 lg:px-8">
          <UserDashboard data={data} />
        </div>
      </main>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '线上用户数据读取失败。'

    return (
      <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
        <AdminHeader />
        <section className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-semibold text-red-700">无法读取线上 D1</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">用户面板暂时不可用</h1>
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
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <span>Toolaze Admin</span>
            <span className="text-slate-300">/</span>
            <span>线上 D1</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Google 用户管理</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            只读查看线上注册用户、有效登录会话、credits 和内容生成情况。
          </p>
          {fetchedAt ? (
            <p className="mt-2 text-xs text-slate-400">
              数据读取时间：{new Date(fetchedAt).toLocaleString('zh-CN', { hour12: false })}
            </p>
          ) : null}
        </div>

        <a
          href="/admin/users"
          className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          刷新数据
        </a>
      </div>
    </header>
  )
}
