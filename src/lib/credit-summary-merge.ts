type CreditSummaryLike<TTransaction = unknown> = {
  balance: number
  transactions: TTransaction[]
  [key: string]: unknown
}

export function mergeCreditSummaryUpdate<TTransaction>(
  current: CreditSummaryLike<TTransaction>,
  next: CreditSummaryLike<TTransaction>,
): CreditSummaryLike<TTransaction> {
  if (next.transactions.length > 0) return next
  if (current.transactions.length === 0) return next

  return {
    ...next,
    transactions: current.transactions,
  }
}
