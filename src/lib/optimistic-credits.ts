export type OptimisticCreditSummary = {
  balance: number
  transactions: unknown[]
  [key: string]: unknown
}

type CachedAuthSnapshot = {
  credits?: {
    balance?: unknown
    transactions?: unknown
    [key: string]: unknown
  }
}

export function createOptimisticCreditDeduction(
  rawAuthSnapshot: string | null | undefined,
  requiredCredits: number,
): { previous: OptimisticCreditSummary; next: OptimisticCreditSummary } | null {
  if (!Number.isInteger(requiredCredits) || requiredCredits <= 0 || !rawAuthSnapshot) return null

  let snapshot: CachedAuthSnapshot
  try {
    snapshot = JSON.parse(rawAuthSnapshot) as CachedAuthSnapshot
  } catch {
    return null
  }

  const credits = snapshot?.credits
  if (!credits || typeof credits.balance !== 'number' || credits.balance < requiredCredits) return null

  const previous = {
    ...credits,
    balance: credits.balance,
    transactions: Array.isArray(credits.transactions) ? credits.transactions : [],
  }

  return {
    previous,
    next: {
      ...previous,
      balance: previous.balance - requiredCredits,
    },
  }
}
