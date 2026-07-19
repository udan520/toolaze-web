'use client'

import { useState } from 'react'
import type { PricingCheckoutCopy } from './pricing-copy'
import { shouldUseEmbeddedCheckout } from './creem-checkout-mode'
import { openCreemEmbeddedCheckout } from './open-creem-embedded-checkout'

type PricingCheckoutButtonProps = {
  planId: string
  enabled: boolean
  isFeatured: boolean
  copy?: PricingCheckoutCopy
}

const defaultCopy: PricingCheckoutCopy = {
  buyCredits: 'Buy Credits',
  openingCheckout: 'Opening Checkout...',
  checkoutComingSoon: 'Checkout Coming Soon',
  validityNote: 'Credits valid for 12 months.',
  signInRequired: 'Please sign in before buying credits.',
  checkoutFailed: 'Checkout could not be started.',
}

export default function PricingCheckoutButton({
  planId,
  enabled,
  isFeatured,
  copy = defaultCopy,
}: PricingCheckoutButtonProps) {
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
        throw new Error(copy.signInRequired)
      }
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || copy.checkoutFailed)
      }

      if (shouldUseEmbeddedCheckout()) {
        await openCreemEmbeddedCheckout(payload.checkoutUrl, {
          onClose: () => setLoading(false),
        })
        return
      }

      window.location.href = payload.checkoutUrl
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : copy.checkoutFailed)
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
        {enabled ? (loading ? copy.openingCheckout : copy.buyCredits) : copy.checkoutComingSoon}
      </button>
      <p className="mt-2 text-center text-xs font-semibold text-slate-400">
        {copy.validityNote}
      </p>
      {error ? <p className="mt-2 text-center text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  )
}
