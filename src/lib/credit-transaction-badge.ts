export type CreditTransactionType = 'grant' | 'bonus' | 'use' | 'refund' | 'purchase' | 'adjustment'

export type CreditTransactionTypeLabels = Record<Exclude<CreditTransactionType, 'bonus'>, string>

export function formatCreditTransactionType(
  type: CreditTransactionType,
  labels: CreditTransactionTypeLabels,
) {
  return type === 'bonus' ? labels.grant : labels[type]
}

export function getCreditTransactionBadgeClass(type: CreditTransactionType) {
  if (type === 'use') return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100'
  if (type === 'refund') return 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-100'
  if (type === 'grant' || type === 'bonus' || type === 'purchase') {
    return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100'
  }
  return 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
}
