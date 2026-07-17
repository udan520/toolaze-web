'use client'

import { useMemo, useState } from 'react'

type ReviewItem = {
  id: string
  userId: string
  userEmail: string | null
  userName: string | null
  postUrl: string
  rewardCredits: number
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy: string | null
  reviewedAt: string | null
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
}

type RewardEvent = {
  id: string
  userId: string
  userEmail: string | null
  userName: string | null
  type: string
  amount: number
  balanceAfter: number
  reason: string
  description: string
  createdAt: string
}

type AdminView = 'reviews' | 'events'
type AdminDataSource = 'local' | 'production'
type StatusFilter = 'pending' | 'approved' | 'rejected' | 'all'
type RewardReasonFilter = 'all' | 'new_user_bonus' | 'daily_checkin' | 'x_post_reward' | 'admin_grant'

const LOCAL_DEV_ADMIN_TOKEN = 'toolaze-local-dev-admin'
const dataSourceOptions: Array<{ value: AdminDataSource; label: string }> = [
  { value: 'local', label: 'Local' },
  { value: 'production', label: 'Production' },
]
const statusOptions: StatusFilter[] = ['pending', 'approved', 'rejected', 'all']
const reasonOptions: Array<{ value: RewardReasonFilter; label: string }> = [
  { value: 'all', label: 'All rewards' },
  { value: 'new_user_bonus', label: 'Registration' },
  { value: 'daily_checkin', label: 'Check-in' },
  { value: 'x_post_reward', label: 'X post' },
  { value: 'admin_grant', label: 'Admin grant' },
]
const reasonLabels: Record<string, string> = {
  new_user_bonus: 'Registration',
  daily_checkin: 'Daily check-in',
  x_post_reward: 'X post reward',
  admin_grant: 'Admin grant',
  bonus: 'Bonus',
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toLocaleString() : value
}

function getReasonLabel(reason: string) {
  return reasonLabels[reason] || reason
}

export default function RewardReviewsClient() {
  const [dataSource, setDataSource] = useState<AdminDataSource>('local')
  const [activeView, setActiveView] = useState<AdminView>('reviews')
  const [status, setStatus] = useState<StatusFilter>('pending')
  const [rewardReason, setRewardReason] = useState<RewardReasonFilter>('all')
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([])
  const [rewardEvents, setRewardEvents] = useState<RewardEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [actingId, setActingId] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({})

  const pendingCount = useMemo(
    () => reviewItems.filter((item) => item.status === 'pending').length,
    [reviewItems],
  )
  const summaryLabel = activeView === 'reviews' ? 'Pending shown' : 'Events shown'
  const summaryCount = activeView === 'reviews' ? pendingCount : rewardEvents.length

  const clearResults = () => {
    setReviewItems([])
    setRewardEvents([])
    setNotice('')
    setError('')
  }

  const loadReviews = async (nextStatus = status) => {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch(`/api/admin/reward-reviews?status=${encodeURIComponent(nextStatus)}&source=${encodeURIComponent(dataSource)}`, {
        cache: 'no-store',
        headers: {
          'x-admin-token': LOCAL_DEV_ADMIN_TOKEN,
        },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not load reward reviews.')
      setReviewItems(Array.isArray(data.items) ? data.items : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load reward reviews.')
    } finally {
      setLoading(false)
    }
  }

  const loadRewardEvents = async (nextReason = rewardReason) => {
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch(`/api/admin/reward-events?reason=${encodeURIComponent(nextReason)}&source=${encodeURIComponent(dataSource)}`, {
        cache: 'no-store',
        headers: {
          'x-admin-token': LOCAL_DEV_ADMIN_TOKEN,
        },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not load credit reward events.')
      setRewardEvents(Array.isArray(data.items) ? data.items : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load credit reward events.')
    } finally {
      setLoading(false)
    }
  }

  const loadActiveView = () => {
    if (activeView === 'reviews') {
      void loadReviews(status)
    } else {
      void loadRewardEvents(rewardReason)
    }
  }

  const review = async (item: ReviewItem, action: 'approve' | 'reject') => {
    if (actingId) return
    setActingId(item.id)
    setError('')
    setNotice('')
    try {
      const response = await fetch(`/api/admin/reward-reviews?source=${encodeURIComponent(dataSource)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': LOCAL_DEV_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          id: item.id,
          action,
          reason: action === 'reject' ? rejectReasons[item.id] : undefined,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Could not update this review.')
      setNotice(action === 'approve'
        ? `Approved +${item.rewardCredits} credits for ${item.userEmail || item.userId}.`
        : `Rejected ${item.userEmail || item.userId}.`
      )
      await loadReviews(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update this review.')
    } finally {
      setActingId('')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-extrabold text-indigo-600">Toolaze admin</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Reward admin</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Review X post submissions and audit credit rewards from registration, daily check-ins, X posts, and admin grants.
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-bold text-slate-500">{summaryLabel}</p>
            <p className="mt-1 text-3xl font-extrabold text-purple-700">{summaryCount}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {([
              ['reviews', 'X post reviews'],
              ['events', 'Credit rewards'],
            ] as Array<[AdminView, string]>).map(([view, label]) => (
              <button
                key={view}
                type="button"
                onClick={() => {
                  setActiveView(view)
                  clearResults()
                  if (view === 'reviews') void loadReviews(status)
                  if (view === 'events') void loadRewardEvents(rewardReason)
                }}
                className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  activeView === view
                    ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-purple-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-[auto_auto_auto] md:items-end md:justify-start">
            <label className="block text-sm font-bold text-slate-700">
              Data source
              <select
                value={dataSource}
                onChange={(event) => {
                  const nextSource = event.target.value as AdminDataSource
                  setDataSource(nextSource)
                  clearResults()
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 md:w-44"
              >
                {dataSourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            {activeView === 'reviews' ? (
              <label className="block text-sm font-bold text-slate-700">
                Status
                <select
                  value={status}
                  onChange={(event) => {
                    const nextStatus = event.target.value as StatusFilter
                    setStatus(nextStatus)
                    void loadReviews(nextStatus)
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 md:w-44"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="block text-sm font-bold text-slate-700">
                Source
                <select
                  value={rewardReason}
                  onChange={(event) => {
                    const nextReason = event.target.value as RewardReasonFilter
                    setRewardReason(nextReason)
                    void loadRewardEvents(nextReason)
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 md:w-48"
                >
                  {reasonOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            )}
            <button
              type="button"
              onClick={loadActiveView}
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Loading...' : activeView === 'reviews' ? 'Load reviews' : 'Load rewards'}
            </button>
          </div>
        </div>

        {notice && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</div>}
        {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div>}

        {activeView === 'reviews' ? (
          <div className="mt-6 space-y-4">
            {reviewItems.length === 0 && !loading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-semibold text-slate-500">
                No reward reviews match this filter.
              </div>
            ) : reviewItems.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                        item.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.status}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-purple-700">
                        +{item.rewardCredits} credits
                      </span>
                    </div>
                    <h2 className="mt-3 truncate text-lg font-extrabold text-slate-900">{item.userEmail || item.userName || item.userId}</h2>
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-sm font-bold text-indigo-600 hover:text-purple-700"
                    >
                      {item.postUrl}
                    </a>
                    <p className="mt-2 text-xs text-slate-500">Submitted {formatDate(item.createdAt)}</p>
                    {item.reviewedAt && (
                      <p className="mt-1 text-xs text-slate-500">
                        Reviewed {formatDate(item.reviewedAt)} by {item.reviewedBy || 'admin'}
                      </p>
                    )}
                    {item.rejectionReason && <p className="mt-2 text-sm font-semibold text-rose-600">{item.rejectionReason}</p>}
                  </div>

                  {item.status === 'pending' && (
                    <div className="w-full shrink-0 space-y-3 lg:w-80">
                      <input
                        value={rejectReasons[item.id] || ''}
                        onChange={(event) => setRejectReasons((current) => ({ ...current, [item.id]: event.target.value }))}
                        placeholder="Reject reason, optional"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => review(item, 'reject')}
                          disabled={Boolean(actingId)}
                          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-extrabold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => review(item, 'approve')}
                          disabled={Boolean(actingId)}
                          className="rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Approve +{item.rewardCredits}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {rewardEvents.length === 0 && !loading ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-semibold text-slate-500">
                No credit rewards match this filter.
              </div>
            ) : rewardEvents.map((event) => (
              <article key={event.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-extrabold text-purple-700">
                        {getReasonLabel(event.reason)}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                        +{event.amount} credits
                      </span>
                    </div>
                    <h2 className="mt-3 truncate text-lg font-extrabold text-slate-900">{event.userEmail || event.userName || event.userId}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{event.description}</p>
                    <p className="mt-2 text-xs text-slate-500">Granted {formatDate(event.createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left md:text-right">
                    <p className="text-xs font-bold text-slate-500">Balance after</p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">{event.balanceAfter}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
