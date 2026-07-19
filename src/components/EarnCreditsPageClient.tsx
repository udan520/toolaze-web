'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { dispatchToolazeTopNotice } from '@/lib/top-notice'
import type { EarnCreditsPageCopy } from '@/app/earn-credits/earn-credits-copy'
import { formatEarnCreditsCopy } from '@/app/earn-credits/earn-credits-copy'

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

function dispatchCheckInUpdated(checkIn: CheckInStatus | null | undefined) {
  if (typeof window === 'undefined' || !checkIn) return
  window.dispatchEvent(new CustomEvent('toolaze:check-in-updated', { detail: checkIn }))
}

type EarnCreditsPageClientProps = {
  copy: EarnCreditsPageCopy
  locale?: string
}

export default function EarnCreditsPageClient({ copy, locale = 'en' }: EarnCreditsPageClientProps) {
  const [checkIn, setCheckIn] = useState<CheckInStatus>(fallbackCheckIn)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [xPostUrl, setXPostUrl] = useState('')
  const [xSubmitting, setXSubmitting] = useState(false)
  const pricingHref = locale === 'en' ? '/pricing' : `/${locale}/pricing`

  useEffect(() => {
    let cancelled = false
    const loadRewards = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/rewards/check-in', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          throw new Error(copy.notices.signInEarn)
        }
        if (!response.ok) throw new Error(copy.notices.loadError)
        const data = await response.json().catch(() => ({}))
        if (cancelled) return
        const nextCheckIn = data.checkIn || fallbackCheckIn
        setCheckIn(nextCheckIn)
        dispatchCheckInUpdated(nextCheckIn)
      } catch (err) {
        if (!cancelled) {
          dispatchToolazeTopNotice({
            type: 'error',
            title: copy.notices.rewardsLoadTitle,
            message: err instanceof Error ? err.message : copy.notices.loadError,
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadRewards()
    return () => {
      cancelled = true
    }
  }, [copy.notices.loadError, copy.notices.rewardsLoadTitle, copy.notices.signInEarn])

  const claimCheckIn = async () => {
    if (claiming || checkIn.checkedInToday) return
    setClaiming(true)
    try {
      const response = await fetch('/api/rewards/check-in', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
        throw new Error(copy.notices.signInEarn)
      }
      if (!response.ok) throw new Error(data.error || copy.notices.checkInFailedMessage)
      const nextCheckIn = data.checkIn || fallbackCheckIn
      setCheckIn(nextCheckIn)
      dispatchCheckInUpdated(nextCheckIn)
      dispatchCreditsUpdated(data.credits)
      if (data.alreadyCheckedIn) {
        dispatchToolazeTopNotice({
          type: 'success',
          title: copy.notices.alreadyCheckedInTitle,
          message: copy.notices.alreadyCheckedInMessage,
        })
      } else {
        const rewardDay = data.checkIn?.day || checkIn.nextDay
        const rewardCredits = data.rewardCredits || checkIn.nextRewardCredits
        dispatchToolazeTopNotice({
          type: 'success',
          title: copy.notices.dailyRewardClaimedTitle,
          message: formatEarnCreditsCopy(copy.notices.dailyRewardClaimedMessage, {
            day: rewardDay,
            credits: rewardCredits,
          }),
        })
      }
    } catch (err) {
      dispatchToolazeTopNotice({
        type: 'error',
        title: copy.notices.checkInFailedTitle,
        message: err instanceof Error ? err.message : copy.notices.checkInFailedMessage,
      })
    } finally {
      setClaiming(false)
    }
  }

  const submitXPost = async () => {
    if (xSubmitting) return
    setXSubmitting(true)
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
        throw new Error(copy.notices.signInXPost)
      }
      if (!response.ok) throw new Error(data.error || copy.notices.submissionFailedMessage)
      dispatchToolazeTopNotice({
        type: 'success',
        title: copy.notices.xPostSubmittedTitle,
        message: data.duplicate
          ? copy.notices.xPostDuplicateMessage
          : copy.notices.xPostSubmittedMessage,
      })
      setXPostUrl('')
    } catch (err) {
      dispatchToolazeTopNotice({
        type: 'error',
        title: copy.notices.submissionFailedTitle,
        message: err instanceof Error ? err.message : copy.notices.submissionFailedMessage,
      })
    } finally {
      setXSubmitting(false)
    }
  }

  return (
    <main className="min-h-[70vh] bg-[#F8FAFF] px-4 py-10 md:px-6 md:py-14">
      <section className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-extrabold text-indigo-600">{copy.hero.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              {copy.hero.title}
            </h1>
            <p className="mt-3 max-w-none text-base leading-7 text-slate-600">
              {copy.hero.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section
            id="daily-check-in"
            className="scroll-mt-28 rounded-3xl border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-100/60 md:p-6"
          >
            <div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{copy.checkIn.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {copy.checkIn.description}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {checkIn.rewards.map((reward) => (
                <div
                  key={reward.day}
                  className={`relative rounded-2xl border px-3 py-4 text-center transition ${
                    reward.claimed
                      ? 'border-emerald-200 bg-emerald-50'
                      : reward.current
                        ? 'border-indigo-300 bg-gradient-to-b from-indigo-50 to-violet-50 shadow-md shadow-indigo-100'
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  <p className="text-xs font-extrabold text-slate-500">
                    {formatEarnCreditsCopy(copy.checkIn.dayLabel, { day: reward.day })}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span className="text-lg font-extrabold text-slate-900">+{reward.credits}</span>
                    <img src="/credits-icons/diamond-3d-indigo.svg" alt="" aria-hidden="true" className="h-5 w-5" />
                  </div>
                  {reward.claimed ? (
                    <span
                      className="absolute -left-1.5 -top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-100 ring-2 ring-white"
                      aria-label={formatEarnCreditsCopy(copy.checkIn.checkedInAria, { day: reward.day })}
                    >
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                        <path
                          d="M6.6 11.4 3.2 8l1-1 2.4 2.4 5.2-5.2 1 1-6.2 6.2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={claimCheckIn}
              disabled={loading || claiming || checkIn.checkedInToday}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkIn.checkedInToday
                ? copy.checkIn.checkedInToday
                : claiming
                  ? copy.checkIn.claiming
                  : formatEarnCreditsCopy(copy.checkIn.claimDayReward, { day: checkIn.nextDay })}
            </button>
          </section>

          <section className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-xl shadow-indigo-100/60 md:p-6">
            <h2 className="text-2xl font-extrabold text-slate-900">{copy.share.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {copy.share.description.split('{credits}')[0]}
              <span className="font-extrabold text-purple-700">10</span>
              {copy.share.description.split('{credits}')[1]}
            </p>
            <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="x-post-url">
              {copy.share.xPostUrlLabel}
            </label>
            <input
              id="x-post-url"
              value={xPostUrl}
              onChange={(event) => setXPostUrl(event.target.value)}
              placeholder={copy.share.xPostUrlPlaceholder}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={submitXPost}
              disabled={xSubmitting || !xPostUrl.trim()}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-extrabold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {xSubmitting ? copy.share.submitting : copy.share.submitForReview}
            </button>
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              {copy.cta.prefix}{' '}
              <Link href={pricingHref} className="font-extrabold text-indigo-600 hover:text-purple-600">
                {copy.cta.linkLabel}
              </Link>
              .
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
