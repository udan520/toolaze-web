function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatLocalTimestampToSeconds(value: string): string {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return ''

  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())
  const hour = padDatePart(date.getHours())
  const minute = padDatePart(date.getMinutes())
  const second = padDatePart(date.getSeconds())

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export function formatCreditTransactionTimestamp(value: string): string {
  return formatLocalTimestampToSeconds(value)
}
