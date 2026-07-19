'use client'

import { useEffect, useState } from 'react'

type CheckoutResultState = 'idle' | 'confirming' | 'failed'

type CreditSummaryPayload = {
  balance: number
  transactions: unknown[]
  [key: string]: unknown
}

function readCheckoutId(searchParams: URLSearchParams) {
  return (
    searchParams.get('checkout_id') ||
    searchParams.get('checkoutId') ||
    ''
  ).trim()
}

function isCreditSummaryPayload(value: unknown): value is CreditSummaryPayload {
  if (!value || typeof value !== 'object') return false
  const summary = value as { balance?: unknown; transactions?: unknown }
  return typeof summary.balance === 'number' && Array.isArray(summary.transactions)
}

async function fetchLatestCreditSummary(): Promise<CreditSummaryPayload | null> {
  const authResponse = await fetch('/api/auth/me', {
    cache: 'no-store',
    credentials: 'include',
  })
  if (!authResponse.ok) return null

  const authPayload: { credits?: unknown } = await authResponse.json().catch(() => ({}))
  return isCreditSummaryPayload(authPayload?.credits) ? authPayload.credits : null
}

function dispatchCreditsUpdated(credits: CreditSummaryPayload) {
  window.dispatchEvent(new CustomEvent('toolaze:credits-updated', {
    detail: credits,
  }))
}

function dispatchTopNotice(title: string, message: string) {
  window.dispatchEvent(new CustomEvent('toolaze:top-notice', {
    detail: {
      type: 'success',
      title,
      message,
      celebration: true,
    },
  }))
}

export default function PricingCheckoutResult() {
  const [state, setState] = useState<CheckoutResultState>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const checkoutId = readCheckoutId(searchParams)
    if (!checkoutId || searchParams.get('checkout') !== 'success') return

    let cancelled = false
    const confirmCheckout = async () => {
      setState('confirming')
      setMessage('Confirming your credits...')

      try {
        const response = await fetch('/api/billing/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ checkoutId }),
        })
        const payload = await response.json().catch(() => ({}))
        if (cancelled) return

        if (!response.ok || !payload?.credits) {
          throw new Error(payload?.error || 'Credits could not be confirmed yet.')
        }

        const fallbackCredits = {
          balance: payload.credits.balance,
          transactions: [],
        }
        const latestCredits = await fetchLatestCreditSummary().catch(() => null)
        if (cancelled) return

        dispatchCreditsUpdated(latestCredits || fallbackCredits)
        const successMessage = payload.credits.duplicate
          ? 'Credits Already Added.'
          : `${payload.credits.added} Credits Added to Your Account.`

        const cleanUrl = new URL(window.location.href)
        for (const key of ['checkout', 'checkout_id', 'checkoutId', 'order_id', 'customer_id', 'product_id', 'request_id', 'signature']) {
          cleanUrl.searchParams.delete(key)
        }
        window.history.replaceState({}, '', cleanUrl.toString())

        dispatchTopNotice('Purchase Successful', successMessage)
        setState('idle')
      } catch (error) {
        if (cancelled) return
        setState('failed')
        setMessage(error instanceof Error ? error.message : 'Credits could not be confirmed yet.')
      }
    }

    void confirmCheckout()

    return () => {
      cancelled = true
    }
  }, [])

  if (state === 'idle') return null

  return (
    <div
      className={`mx-auto mb-6 max-w-3xl overflow-hidden rounded-3xl border px-5 py-5 shadow-sm ${
        state === 'failed'
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-indigo-100 bg-gradient-to-br from-white via-violet-50 to-fuchsia-50 text-slate-800 shadow-indigo-100'
      }`}
      role={state === 'failed' ? 'alert' : 'status'}
    >
      <div className="flex flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-base font-black ${state === 'failed' ? 'text-rose-700' : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent'}`}>
            {state === 'confirming' ? 'Confirming Your Credits' : 'Checkout Could Not Be Confirmed'}
          </p>
          <p className={`mt-1 text-sm font-semibold ${state === 'failed' ? 'text-rose-600' : 'text-slate-600'}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
