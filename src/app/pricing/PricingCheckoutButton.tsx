'use client'

import { useState } from 'react'

type PricingCheckoutButtonProps = {
  planId: string
  enabled: boolean
  isFeatured: boolean
}

export default function PricingCheckoutButton({ planId, enabled, isFeatured }: PricingCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startCheckout() {
    if (!enabled || loading) return
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId }),
      })
      const payload = await response.json().catch(() => ({}))

      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
        throw new Error('Please sign in before buying credits.')
      }
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || 'Checkout could not be started.')
      }

      window.location.href = payload.checkoutUrl
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout could not be started.')
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        disabled={!enabled || loading}
        onClick={startCheckout}
        className={`w-full rounded-full px-5 py-3 text-sm font-extrabold transition duration-300 disabled:cursor-not-allowed ${
          enabled
            ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-indigo-50 shadow-lg shadow-indigo-200/80 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200/90 disabled:opacity-80'
            : isFeatured
              ? 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-indigo-50 shadow-lg shadow-indigo-200/80 disabled:opacity-80'
              : 'bg-slate-100 text-slate-500 disabled:opacity-75 group-hover:bg-indigo-50 group-hover:text-indigo-700'
        }`}
      >
        {enabled ? (loading ? 'Opening Checkout...' : 'Buy Credits') : 'Checkout Coming Soon'}
      </button>
      <p className="mt-2 text-center text-xs font-semibold text-slate-400">
        Credits valid for 12 months.
      </p>
      {error ? <p className="mt-2 text-center text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  )
}
