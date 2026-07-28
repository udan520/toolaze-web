import { backfillCreditTransactionsWithHistory } from './credit-transaction-history-backfill'

type CreditSummaryForDisplay = {
  transactions: unknown[]
}

type FetchLike = (
  input: string,
  init?: {
    cache?: RequestCache
    credentials?: RequestCredentials
  },
) => Promise<{
  ok: boolean
  json: () => Promise<unknown>
}>

export async function enrichCreditSummaryWithHistory<TSummary extends CreditSummaryForDisplay>(
  credits: TSummary,
  fetchImpl: FetchLike = fetch,
): Promise<TSummary> {
  if (!Array.isArray(credits.transactions) || credits.transactions.length === 0) {
    return credits
  }

  try {
    const historyResponse = await fetchImpl('/api/history?limit=200', {
      cache: 'no-store',
      credentials: 'include',
    })
    if (!historyResponse.ok) return credits

    const historyData = await historyResponse.json().catch(() => ({ items: [] }))
    const historyItems = historyData && typeof historyData === 'object' && Array.isArray((historyData as { items?: unknown }).items)
      ? (historyData as { items: unknown[] }).items
      : []

    if (historyItems.length === 0) return credits

    return {
      ...credits,
      transactions: backfillCreditTransactionsWithHistory(credits.transactions as any[], historyItems as any[]) as TSummary['transactions'],
    }
  } catch {
    return credits
  }
}
