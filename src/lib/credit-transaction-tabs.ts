export type CreditTransactionTab = 'all' | 'obtained' | 'used' | 'purchases'

export type CreditTransactionForTabs = {
  id: string
  type: string
  amount: number
  reason?: string
  description?: string
}

export const CREDIT_TRANSACTION_TABS: ReadonlyArray<{
  id: CreditTransactionTab
  label: string
}> = [
  { id: 'all', label: 'All' },
  { id: 'obtained', label: 'Obtained' },
  { id: 'used', label: 'Used' },
  { id: 'purchases', label: 'Purchases' },
]

function isCreditPurchase(transaction: CreditTransactionForTabs) {
  const description = transaction.description?.trim().toLowerCase() || ''

  return (
    transaction.type === 'purchase' ||
    transaction.reason === 'credit_purchase' ||
    description.endsWith('credit purchase')
  )
}

function matchesCreditTransactionTab(
  transaction: CreditTransactionForTabs,
  tab: CreditTransactionTab,
) {
  if (tab === 'all') return true
  if (tab === 'purchases') return isCreditPurchase(transaction)
  if (tab === 'used') return transaction.type === 'use' || transaction.amount < 0

  return transaction.amount > 0 && !isCreditPurchase(transaction)
}

export function filterCreditTransactions<T extends CreditTransactionForTabs>(
  transactions: T[],
  tab: CreditTransactionTab,
) {
  return transactions.filter((transaction) => matchesCreditTransactionTab(transaction, tab))
}
