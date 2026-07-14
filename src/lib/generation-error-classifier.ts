type GenerationErrorPayload = Record<string, any> | null | undefined

function collectErrorText(payload: GenerationErrorPayload): string {
  if (!payload || typeof payload !== 'object') return ''

  return [
    payload.error,
    payload.message,
    payload.msg,
    payload.code,
    payload.reason,
  ]
    .filter((value) => typeof value === 'string' || typeof value === 'number')
    .map(String)
    .join(' ')
    .toLowerCase()
}

function readCreditBalance(payload: GenerationErrorPayload): number | null {
  const balance = payload?.credits?.balance ?? payload?.creditBalance ?? payload?.balance
  return typeof balance === 'number' && Number.isFinite(balance) ? balance : null
}

export function isCreditExhaustedGenerationError(status: number, payload: GenerationErrorPayload): boolean {
  if (status === 402) return true

  const text = collectErrorText(payload)
  const mentionsCredits = /\bcredit|credits|balance\b/i.test(text)
  const describesShortage = /insufficient|not enough|no credits?|used up|remaining|exhausted|too low|用完|不足|余额|餘額|點數|点数/i.test(text)
  if (mentionsCredits && describesShortage) return true

  const balance = readCreditBalance(payload)
  return balance === 0 && (mentionsCredits || status === 401 || status === 403)
}
