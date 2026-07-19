'use client'

import { useEffect, useState } from 'react'
import { formatCreditTransactionTimestamp } from '@/lib/credit-history-time'
import { formatCreditTransactionDescription } from '@/lib/credit-transaction-description'
import {
  CREDIT_TRANSACTION_TABS,
  filterCreditTransactions,
  type CreditTransactionTab,
} from '@/lib/credit-transaction-tabs'

type CreditTransaction = {
  id: string
  type: 'grant' | 'use' | 'refund' | 'purchase' | 'adjustment'
  amount: number
  balanceAfter: number
  reason: string
  description: string
  createdAt: string
}

type CreditSummary = {
  balance: number
  transactions: CreditTransaction[]
}

const emptyCreditSummary: CreditSummary = {
  balance: 0,
  transactions: [],
}

const defaultCreditsPageCopy = {
  title: 'Credit Activity',
  description: 'Review every credit change on your account, including bonuses, generation usage, refunds, and manual adjustments.',
  availableCredits: 'Available Credits',
  loading: 'Loading credit activity...',
  signInRequired: 'Please sign in with Google to view your credits.',
  loadError: 'Could not load credit activity.',
  emptyTitle: 'No Credit Activity Yet.',
  emptyDescription: 'Credit changes will appear here after signup bonuses or generations.',
  filteredEmptyTitle: 'No Records Yet.',
  balanceAfter: 'Balance: {balance}',
  tabs: {
    all: 'All',
    obtained: 'Obtained',
    used: 'Used',
    purchases: 'Purchases',
  },
  types: {
    grant: 'Bonus',
    use: 'Used',
    refund: 'Refund',
    purchase: 'Purchase',
    adjustment: 'Adjustment',
  },
}

function getCreditsPageCopy(initialTranslations?: any) {
  return {
    ...defaultCreditsPageCopy,
    ...(initialTranslations?.creditsPage || {}),
    types: {
      ...defaultCreditsPageCopy.types,
      ...(initialTranslations?.creditsPage?.types || {}),
    },
    tabs: {
      ...defaultCreditsPageCopy.tabs,
      ...(initialTranslations?.creditsPage?.tabs || {}),
    },
  }
}

function formatUiText(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  )
}

function formatCreditBalance(balance: number) {
  return balance.toLocaleString('en-US')
}

function formatType(type: CreditTransaction['type'], copy: ReturnType<typeof getCreditsPageCopy>) {
  return copy.types[type] || copy.types.adjustment
}

interface CreditsPageClientProps {
  initialTranslations?: any
  locale?: string
}

export default function CreditsPageClient({ initialTranslations }: CreditsPageClientProps = {}) {
  const copy = getCreditsPageCopy(initialTranslations)
  const [credits, setCredits] = useState<CreditSummary>(emptyCreditSummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<CreditTransactionTab>('all')
  const visibleTransactions = filterCreditTransactions(credits.transactions, activeTab)

  useEffect(() => {
    let cancelled = false
    const loadCredits = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch('/api/credits?limit=200', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('toolaze:open-auth-modal'))
          throw new Error(copy.signInRequired)
        }
        if (!response.ok) throw new Error(copy.loadError)
        const data = await response.json().catch(() => ({ credits: emptyCreditSummary }))
        if (!cancelled) setCredits(data.credits || emptyCreditSummary)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : copy.loadError)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadCredits()
    return () => {
      cancelled = true
    }
  }, [copy.loadError, copy.signInRequired])

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">{copy.title}</h1>
        <p className="mt-2 max-w-none text-sm leading-6 text-slate-600">
          {copy.description}
        </p>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white px-5 py-5">
        <p className="text-xs font-semibold text-indigo-600">{copy.availableCredits}</p>
        <p className="mt-2 text-4xl font-extrabold text-slate-950">{credits.balance}</p>
      </section>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-500">
          {copy.loading}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-8 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && credits.transactions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-extrabold text-slate-900">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm text-slate-500">{copy.emptyDescription}</p>
        </div>
      )}

      {!loading && !error && credits.transactions.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Credit activity filters">
            {CREDIT_TRANSACTION_TABS.map((tab) => {
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={`inline-flex min-h-9 items-center justify-center rounded-full border px-4 py-2 text-center text-sm font-extrabold transition ${
                    isActive
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/70'
                      : 'border-transparent bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {copy.tabs[tab.id] || tab.label}
                </button>
              )
            })}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {visibleTransactions.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm font-semibold text-slate-500">
                {copy.filteredEmptyTitle}
              </div>
            ) : (
              visibleTransactions.map((transaction) => {
                const isPositive = transaction.amount > 0
                return (
                  <article key={transaction.id} className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[1fr_auto]">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                          {formatType(transaction.type, copy)}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {formatCreditTransactionTimestamp(transaction.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-900">{formatCreditTransactionDescription(transaction.description)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatUiText(copy.balanceAfter, { balance: formatCreditBalance(transaction.balanceAfter) })}
                      </p>
                    </div>
                    <div className={`flex items-center justify-start text-lg font-extrabold sm:justify-end ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}{transaction.amount}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </>
      )}
    </main>
  )
}
