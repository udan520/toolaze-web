import {
  getGenerationModelLabel,
  getWrappedGeneratorToolSlug,
  getWrappedHairToolHistoryDisplay,
} from './generation-history-display'

const LEGACY_IMAGE_CREDIT_HISTORY_MATCH_WINDOW_MS = 15 * 60 * 1000

type CreditTransactionMetadata = {
  model?: string | null
  modelLabel?: string | null
  isImageToImage?: boolean | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
  [key: string]: unknown
}

type CreditTransactionForHistoryBackfill = {
  reason?: string | null
  description?: string | null
  createdAt?: string | null
  metadata?: CreditTransactionMetadata | null
}

type GenerationHistoryForCreditBackfill = {
  model?: string | null
  inputUrls?: string[] | null
  toolSlug?: string | null
  toolLabel?: string | null
  sourcePath?: string | null
  createdAt?: string | null
}

function getTimestampMs(value: string | null | undefined) {
  const timestamp = Date.parse(String(value || ''))
  return Number.isFinite(timestamp) ? timestamp : 0
}

function isLegacyImageGenerationCreditTransaction(transaction: CreditTransactionForHistoryBackfill) {
  if (transaction.metadata?.toolLabel) return false
  return transaction.reason === 'image_generation' || transaction.reason === 'image_generation_refund'
}

function getImageGenerationModeFromCreditDescription(
  description: string | null | undefined,
  historyItem: GenerationHistoryForCreditBackfill,
) {
  const normalizedDescription = String(description || '').toLowerCase()
  if (normalizedDescription.includes('image-to-image')) return true
  if (normalizedDescription.includes('text-to-image')) return false
  return Array.isArray(historyItem.inputUrls) && historyItem.inputUrls.length > 0
}

function findHistoryMatchForCreditTransaction(
  transaction: CreditTransactionForHistoryBackfill,
  historyItems: GenerationHistoryForCreditBackfill[],
) {
  const transactionTime = getTimestampMs(transaction.createdAt)
  if (!transactionTime) return null

  const description = String(transaction.description || '').toLowerCase()
  return historyItems
    .filter((item) => getWrappedGeneratorToolSlug(item))
    .map((item) => {
      const createdAtMs = getTimestampMs(item.createdAt)
      return {
        item,
        distance: createdAtMs ? Math.abs(createdAtMs - transactionTime) : Number.POSITIVE_INFINITY,
        modelMatches: description.includes(getGenerationModelLabel(item.model).toLowerCase()),
      }
    })
    .filter((candidate) => candidate.distance <= LEGACY_IMAGE_CREDIT_HISTORY_MATCH_WINDOW_MS)
    .sort((left, right) => {
      if (left.modelMatches !== right.modelMatches) return left.modelMatches ? -1 : 1
      return left.distance - right.distance
    })[0]?.item || null
}

export function backfillCreditTransactionsWithHistory<TTransaction extends CreditTransactionForHistoryBackfill>(
  transactions: TTransaction[],
  historyItems: GenerationHistoryForCreditBackfill[],
) {
  if (!transactions.some(isLegacyImageGenerationCreditTransaction) || historyItems.length === 0) {
    return transactions
  }

  return transactions.map((transaction) => {
    if (!isLegacyImageGenerationCreditTransaction(transaction)) return transaction

    const historyItem = findHistoryMatchForCreditTransaction(transaction, historyItems)
    if (!historyItem) return transaction

    const historyDisplay = getWrappedHairToolHistoryDisplay(historyItem)
    if (!historyDisplay.showToolLabel) return transaction

    const isImageToImage = getImageGenerationModeFromCreditDescription(transaction.description, historyItem)
    const metadata: CreditTransactionMetadata = {
      ...(transaction.metadata || {}),
      model: historyItem.model || transaction.metadata?.model || '',
      modelLabel: historyDisplay.modelLabel,
      isImageToImage,
      toolSlug: getWrappedGeneratorToolSlug(historyItem),
      toolLabel: historyDisplay.toolLabel,
      sourcePath: historyItem.sourcePath || transaction.metadata?.sourcePath || '',
    }

    Object.keys(metadata).forEach((key) => {
      if (metadata[key] === undefined || metadata[key] === null || metadata[key] === '') {
        delete metadata[key]
      }
    })

    return {
      ...transaction,
      description: transaction.reason === 'image_generation_refund'
        ? `${historyDisplay.toolLabel} refund`
        : historyDisplay.toolLabel,
      metadata,
    }
  })
}
