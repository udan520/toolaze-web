'use client'

import { useMemo, useState } from 'react'
import {
  filterAndSortUsers,
  type UserSessionFilter,
  type UserSort,
} from '@/lib/admin/user-view'
import type {
  AdminCreditGrantHistoryItem,
  AdminUser,
  UserDashboardData,
} from '@/lib/admin/users'
import CreditGrantDialog from './CreditGrantDialog'

type UserDashboardProps = {
  data: UserDashboardData
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export default function UserDashboard({ data }: UserDashboardProps) {
  const [users, setUsers] = useState(data.users)
  const [query, setQuery] = useState('')
  const [sessionFilter, setSessionFilter] = useState<UserSessionFilter>('all')
  const [sort, setSort] = useState<UserSort>('newest')
  const [grantUser, setGrantUser] = useState<AdminUser | null>(null)

  const visibleUsers = useMemo(
    () => filterAndSortUsers(users, { query, session: sessionFilter, sort }),
    [users, query, sessionFilter, sort],
  )

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.hasActiveSession).length,
    totalCredits: users.reduce((sum, user) => sum + user.creditBalance, 0),
    usersWithGenerations: users.filter(
      (user) => user.imageGenerationCount + user.videoGenerationCount > 0,
    ).length,
  }), [users])

  const statItems = [
    {
      label: '注册用户',
      value: stats.totalUsers.toLocaleString('zh-CN'),
      detail: 'Google 注册用户总数',
    },
    {
      label: '有效登录',
      value: stats.activeUsers.toLocaleString('zh-CN'),
      detail: '当前存在未过期会话',
    },
    {
      label: '剩余 Credits',
      value: stats.totalCredits.toLocaleString('zh-CN'),
      detail: '全部账号余额合计',
    },
    {
      label: '生成用户',
      value: stats.usersWithGenerations.toLocaleString('zh-CN'),
      detail: '至少生成过一次内容',
    },
  ]

  function handleGranted(userId: string, balance: number) {
    setUsers((currentUsers) => currentUsers.map((user) => (
      user.id === userId ? { ...user, creditBalance: balance } : user
    )))
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <article
            key={item.label}
            className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/80 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Google 注册用户</h2>
            <p className="mt-1 text-xs text-slate-500">
              当前显示 {visibleUsers.length} / {users.length} 个账号
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/generations"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              任务生成记录
            </a>

            <label className="relative block">
              <span className="sr-only">搜索用户</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索姓名或邮箱"
                className="h-10 w-full min-w-64 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label>
              <span className="sr-only">筛选登录状态</span>
              <select
                value={sessionFilter}
                onChange={(event) => setSessionFilter(event.target.value as UserSessionFilter)}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">全部会话</option>
                <option value="active">有效登录</option>
                <option value="inactive">无有效会话</option>
              </select>
            </label>

            <label>
              <span className="sr-only">用户排序</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as UserSort)}
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="newest">最新注册</option>
                <option value="lastLogin">最近登录</option>
                <option value="lastGeneration">最近生成</option>
                <option value="credits">Credits 最高</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1540px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500">
                <th className="px-5 py-3">用户</th>
                <th className="px-4 py-3">注册时间</th>
                <th className="px-4 py-3">注册入口</th>
                <th className="px-4 py-3">最近登录</th>
                <th className="px-4 py-3">会话</th>
                <th className="px-4 py-3 text-right">余额</th>
                <th className="px-4 py-3 text-right">图片</th>
                <th className="px-4 py-3 text-right">视频</th>
                <th className="px-4 py-3">最近使用功能</th>
                <th className="px-4 py-3">最近使用模型</th>
                <th className="px-5 py-3">最近生成</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.length > 0 ? (
                visibleUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onGrant={() => setGrantUser(user)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-5 py-14 text-center text-sm text-slate-500">
                    没有符合当前筛选条件的用户。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <CreditGrantDialog
        user={grantUser}
        onClose={() => setGrantUser(null)}
        onGranted={handleGranted}
      />

      <GrantHistorySection items={data.grantHistory} />
    </>
  )
}

function UserRow({ user, onGrant }: { user: AdminUser; onGrant: () => void }) {
  const initials = (user.name || user.email).trim().slice(0, 1).toLocaleUpperCase()

  return (
    <tr className="text-sm text-slate-700 transition hover:bg-indigo-50/30">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-950">{user.name || '未设置姓名'}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-xs">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-4">
        <SignupSourceBadge
          path={user.signupPath}
          url={user.signupUrl}
          referrer={user.signupReferrer}
        />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-xs">{formatDate(user.lastLoginAt)}</td>
      <td className="px-4 py-4">
        <span
          className={
            user.hasActiveSession
              ? 'inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200'
              : 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200'
          }
        >
          {user.hasActiveSession ? '有效' : '无有效会话'}
        </span>
      </td>
      <td className="px-4 py-4 text-right font-semibold tabular-nums text-slate-950">
        {user.creditBalance.toLocaleString('zh-CN')}
      </td>
      <td className="px-4 py-4 text-right tabular-nums">
        {user.imageGenerationCount.toLocaleString('zh-CN')}
      </td>
      <td className="px-4 py-4 text-right tabular-nums">
        {user.videoGenerationCount.toLocaleString('zh-CN')}
      </td>
      <td className="px-4 py-4">
        <ToolBadge label={user.recentToolLabel} slug={user.recentToolSlug} />
      </td>
      <td className="px-4 py-4">
        <ModelBadge model={user.recentModel} />
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-xs">{formatDate(user.lastGenerationAt)}</td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <a
            href={`/admin/users/${encodeURIComponent(user.id)}`}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            使用记录
          </a>
          <button
            type="button"
            onClick={onGrant}
            className="inline-flex h-9 items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
          >
            赠送积分
          </button>
        </div>
      </td>
    </tr>
  )
}

function ModelBadge({ model }: { model: string | null }) {
  if (!model) return <span className="text-xs text-slate-400">—</span>

  return (
    <div className="max-w-52">
      <p className="truncate font-mono text-xs font-semibold text-slate-700">{model}</p>
    </div>
  )
}

function SignupSourceBadge({
  path,
  url,
  referrer,
}: {
  path: string | null
  url: string | null
  referrer: string | null
}) {
  if (!path && !url) return <span className="text-xs text-slate-400">—</span>

  return (
    <div className="max-w-64" title={url || path || undefined}>
      <p className="truncate font-mono text-xs font-semibold text-slate-700">
        {path || url}
      </p>
      {referrer ? (
        <p className="mt-0.5 truncate text-[11px] text-slate-400">
          来源：{formatReferrer(referrer)}
        </p>
      ) : null}
    </div>
  )
}

function ToolBadge({
  label,
  slug,
  count,
}: {
  label: string | null
  slug: string | null
  count?: number
}) {
  if (!label && !slug) return <span className="text-xs text-slate-400">—</span>

  return (
    <div className="max-w-52">
      <p className="truncate text-xs font-semibold text-slate-800">{label || slug}</p>
      <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
        {slug}
        {typeof count === 'number' && count > 0 ? ` · ${count.toLocaleString('zh-CN')} 次` : ''}
      </p>
    </div>
  )
}

function formatDate(value: string | null): string {
  if (!value) return '—'

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

function formatReferrer(value: string): string {
  try {
    return new URL(value).hostname
  } catch {
    return value
  }
}

function GrantHistorySection({ items }: { items: AdminCreditGrantHistoryItem[] }) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">最近赠送历史</h2>
        <p className="mt-1 text-xs text-slate-500">
          仅显示后台手动赠送的 Bonus credits，按时间倒序最多 20 条。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-500">
              <th className="px-5 py-3">用户</th>
              <th className="px-4 py-3 text-right">数量</th>
              <th className="px-4 py-3 text-right">赠送后余额</th>
              <th className="px-4 py-3">用户侧显示</th>
              <th className="px-4 py-3">后台备注</th>
              <th className="px-5 py-3">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="text-sm text-slate-700">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">{item.email}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{item.userId}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-emerald-700">
                    +{item.amount.toLocaleString('zh-CN')}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    {item.balanceAfter.toLocaleString('zh-CN')}
                  </td>
                  <td className="px-4 py-4">{item.description}</td>
                  <td className="px-4 py-4 text-slate-500">{item.adminNote || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs">{formatDate(item.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                  暂无后台赠送记录。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
