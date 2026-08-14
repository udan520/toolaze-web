import type { AdminGenerationHistoryItem } from '@/lib/admin/users'

type GenerationStatus = NonNullable<AdminGenerationHistoryItem['status']>

type GenerationStatusBadgeProps = {
  status: GenerationStatus
  failureReason?: string | null
}

const STATUS_STYLES: Record<GenerationStatus, string> = {
  succeeded: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
  pending: 'bg-sky-50 text-sky-700 ring-sky-200',
}

const STATUS_LABELS: Record<GenerationStatus, string> = {
  succeeded: '成功',
  failed: '失败',
  pending: '处理中',
}

export function GenerationStatusBadge({
  status,
  failureReason,
}: GenerationStatusBadgeProps) {
  return (
    <div className="max-w-52">
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STATUS_STYLES[status]}`}>
        {STATUS_LABELS[status]}
      </span>
      {failureReason ? (
        <p className="mt-2 line-clamp-3 text-xs leading-5 text-red-600" title={failureReason}>
          失败原因：{failureReason}
        </p>
      ) : null}
    </div>
  )
}
