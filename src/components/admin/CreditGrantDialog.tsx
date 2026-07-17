'use client'

import { useMemo, useState } from 'react'
import type { AdminUser } from '@/lib/admin/users'

type ExpirationMode = 'permanent' | 'days' | 'date'

type CreditGrantDialogProps = {
  user: AdminUser | null
  onClose: () => void
  onGranted: (userId: string, balance: number) => void
}

export default function CreditGrantDialog({
  user,
  onClose,
  onGranted,
}: CreditGrantDialogProps) {
  const [amount, setAmount] = useState('1000')
  const [expirationMode, setExpirationMode] = useState<ExpirationMode>('permanent')
  const [validDays, setValidDays] = useState('30')
  const [expiresAt, setExpiresAt] = useState('')
  const [note, setNote] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const summary = useMemo(() => {
    if (!user) return ''
    if (expirationMode === 'permanent') {
      return `给 ${user.email} 赠送 ${amount || 0} credits，永久有效。`
    }
    if (expirationMode === 'days') {
      return `给 ${user.email} 赠送 ${amount || 0} credits，有效 ${validDays || 0} 天。`
    }
    return `给 ${user.email} 赠送 ${amount || 0} credits，到 ${expiresAt || '未选择日期'} 过期。`
  }, [amount, expirationMode, expiresAt, user, validDays])

  if (!user) return null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setStatus('submitting')
    setMessage('')

    const response = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}/credits/grant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Number(amount),
        expirationMode,
        validDays: expirationMode === 'days' ? Number(validDays) : undefined,
        expiresAt: expirationMode === 'date' && expiresAt
          ? new Date(expiresAt).toISOString()
          : undefined,
        note,
      }),
    })

    const payload = await response.json().catch(() => ({})) as {
      balance?: number
      error?: string
    }

    if (!response.ok) {
      setStatus('error')
      setMessage(payload.error || '赠送积分失败。')
      return
    }

    setStatus('success')
    setMessage(`赠送成功。当前余额：${Number(payload.balance ?? user.creditBalance).toLocaleString('zh-CN')} credits。`)
    onGranted(user.id, Number(payload.balance ?? user.creditBalance))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">赠送 Credits</h2>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            关闭
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">积分数量</span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="numeric"
              className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="例如 1000"
              required
            />
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-slate-700">有效期</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {[
                ['permanent', '永久有效'],
                ['days', '有效天数'],
                ['date', '指定日期'],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-700"
                >
                  <input
                    type="radio"
                    name="expirationMode"
                    value={value}
                    checked={expirationMode === value}
                    onChange={() => setExpirationMode(value as ExpirationMode)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {expirationMode === 'days' ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">有效天数</span>
              <input
                value={validDays}
                onChange={(event) => setValidDays(event.target.value)}
                inputMode="numeric"
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="例如 30"
                required
              />
            </label>
          ) : null}

          {expirationMode === 'date' ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">到期时间</span>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">备注</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={200}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="可选，例如测试补偿、活动赠送"
            />
          </label>

          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            {summary}
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 accent-amber-600"
              required
            />
            <span>
              我确认这会写入线上 D1，并生成可审计的积分赠送流水。
            </span>
          </label>

          {message ? (
            <div
              className={
                status === 'error'
                  ? 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700'
                  : 'rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-6 text-emerald-700'
              }
            >
              {message}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={status === 'submitting' || !confirmed}
              className="inline-flex h-10 items-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === 'submitting' ? '提交中' : '确认赠送'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
