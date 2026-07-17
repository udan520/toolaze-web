'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type CreditTransaction = {
  id: string
  amount: number
  balanceAfter: number
  description: string
  createdAt: string
}

type CreditSummary = {
  balance: number
  transactions: CreditTransaction[]
}

type CheckInReward = {
  day: number
  credits: number
  current: boolean
  claimed: boolean
}

type CheckInStatus = {
  checkedInToday: boolean
  streakDay: number
  lastCheckInDate: string | null
  nextDay: number
  nextRewardCredits: number
  rewards: CheckInReward[]
  day?: number
}

const fallbackCheckIn: CheckInStatus = {
  checkedInToday: false,
  streakDay: 0,
  lastCheckInDate: null,
  nextDay: 1,
  nextRewardCredits: 5,
  rewards: [
    { day: 1, credits: 5, current: true, claimed: false },
    { day: 2, credits: 10, current: false, claimed: false },
    { day: 3, credits: 15, current: false, claimed: false },
    { day: 4, credits: 20, current: false, claimed: false },
    { day: 5, credits: 25, current: false, claimed: false },
    { day: 6, credits: 30, current: false, claimed: false },
    { day: 7, credits: 50, current: false, claimed: false },
  ],
}

function dispatchCreditsUpdated(credits: CreditSummary | null | undefined) {
  if (typeof window === 'undefined' || !credits) return
  window.dispatchEvent(new CustomEvent('toolaze:credits-updated', { detail: credits }))
}

export default function EarnCreditsPageClient() {
  const [checkIn, setCheckIn] = useState<CheckInStatus>(fallbackCheckIn)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [xPostUrl, setXPostUrl] = useState('')
  const [xSubmitting, setXSubmitting] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const loadRewards = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/rewards/check-in', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          throw new Error('Please sign in to earn credits.')
        }
        if (!response.ok) throw new Error('Could not load reward status.')
        const data = await response.json().catch(() => ({}))
        if (cancelled) return
        setCheckIn(data.checkIn || fallbackCheckIn)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load reward status.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadRewards()
    return () => {
      cancelled = true
    }
  }, [])

  const claimCheckIn = async () => {
    if (claiming || checkIn.checkedInToday) return
    setClaiming(true)
    setNotice('')
    setError('')
    try {
      const response = await fetch('/api/rewards/check-in', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
        throw new Error('Please sign in to earn credits.')
      }
      if (!response.ok) throw new Error(data.error || 'Could not claim your daily reward.')
      setCheckIn(data.checkIn || fallbackCheckIn)
      dispatchCreditsUpdated(data.credits)
      setNotice(data.alreadyCheckedIn
        ? 'You have already checked in today.'
        : `Day ${data.checkIn?.day || checkIn.nextDay} reward added: +${data.rewardCredits} credits.`
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not claim your daily reward.')
    } finally {
      setClaiming(false)
    }
  }

  const submitXPost = async () => {
    if (xSubmitting) return
    setXSubmitting(true)
    setNotice('')
    setError('')
    try {
      const response = await fetch('/api/rewards/x-post', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postUrl: xPostUrl }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
        throw new Error('Please sign in to submit your X post.')
      }
      if (!response.ok) throw new Error(data.error || 'Could not submit this X post.')
      setNotice(data.duplicate
        ? 'This X post is already submitted and waiting for review.'
        : 'X post submitted. Approved posts receive +10 credits.'
      )
      setXPostUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit this X post.')
    } finally {
      setXSubmitting(false)
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#F8FAFF] px-4 py-10 md:px-6 md:py-14">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-extrabold text-indigo-600">Earn free credits</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Get more credits without buying a pack
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Check in daily or share Toolaze on X. Rewards are added to your account after claim or review.
            </p>
          </div>
        </div>

        {notice && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {notice}
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section
            id="daily-check-in"
            className="scroll-mt-28 rounded-3xl border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-100/60 md:p-6"
          >
            <div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Daily check-in</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Keep the streak. Miss a day and the reward starts again from Day 1.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {checkIn.rewards.map((reward) => (
                <div
                  key={reward.day}
                  className={`rounded-2xl border px-3 py-4 text-center transition ${
                    reward.current
                      ? 'border-indigo-300 bg-gradient-to-b from-indigo-50 to-violet-50 shadow-md shadow-indigo-100'
                      : reward.claimed
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-xs font-extrabold text-slate-500">Day {reward.day}</p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="text-lg font-extrabold text-slate-900">+{reward.credits}</span>
                    <img src="/credits-icons/diamond-3d-indigo.svg" alt="" aria-hidden="true" className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={claimCheckIn}
              disabled={loading || claiming || checkIn.checkedInToday}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkIn.checkedInToday ? 'Checked in today' : claiming ? 'Claiming...' : `Claim Day ${checkIn.nextDay} reward`}
            </button>
          </section>

          <section className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-100/60 md:p-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Share on X</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Post about Toolaze on X, paste the post link here, and approved posts receive{' '}
              <span className="font-extrabold text-purple-700">10 credits</span>.
            </p>
            <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="x-post-url">
              X post URL
            </label>
            <input
              id="x-post-url"
              value={xPostUrl}
              onChange={(event) => setXPostUrl(event.target.value)}
              placeholder="https://x.com/yourname/status/..."
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={submitXPost}
              disabled={xSubmitting || !xPostUrl.trim()}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-extrabold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {xSubmitting ? 'Submitting...' : 'Submit for review'}
            </button>
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Need credits right now?{' '}
              <Link href="/pricing" className="font-extrabold text-indigo-600 hover:text-purple-600">
                Buy a one-time pack
              </Link>
              .
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
