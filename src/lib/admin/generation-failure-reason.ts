type AdminGenerationFailureReasonInput = {
  status: 'succeeded' | 'failed' | 'pending'
  failureReason?: string | null
  inputUrls?: string[] | null
}

function hasReferenceInput(inputUrls: AdminGenerationFailureReasonInput['inputUrls']): boolean {
  return Array.isArray(inputUrls) && inputUrls.some((url) => String(url || '').trim())
}

function isGenericInternalError(value: string): boolean {
  return value.trim().toLowerCase() === 'internal error'
}

function isProviderSafetyError(value: string): boolean {
  return /inappropriate content|content policy|safety|moderation|nsfw/i.test(value)
}

export function formatAdminGenerationFailureReason(
  item: AdminGenerationFailureReasonInput,
): string | null {
  if (item.status !== 'failed') return null

  const reason = String(item.failureReason || '').trim()
  if (!reason) return null

  if (isGenericInternalError(reason) && hasReferenceInput(item.inputUrls)) {
    return `上游生成失败，可能由参考图内容安全限制导致（原始错误：${reason}）`
  }

  if (isProviderSafetyError(reason)) {
    return `上游内容安全限制：${reason}`
  }

  return reason
}
