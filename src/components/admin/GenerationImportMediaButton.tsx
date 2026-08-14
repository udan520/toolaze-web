'use client'

import { useState } from 'react'
import type { AdminDataSource } from '@/lib/admin/data-source'

type ImportState = 'idle' | 'loading' | 'success' | 'error'

type GenerationImportMediaButtonProps = {
  historyId: string
  dataSource: AdminDataSource
}

export function GenerationImportMediaButton({
  historyId,
  dataSource,
}: GenerationImportMediaButtonProps) {
  const [state, setState] = useState<ImportState>('idle')
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    if (state === 'loading') return

    setState('loading')
    setMessage('')

    try {
      const searchParams = new URLSearchParams()
      searchParams.set('source', dataSource)

      const response = await fetch(`/api/media-library/import-history?${searchParams.toString()}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historyId }),
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || '导入失败')
      }

      const importedCount = Number(payload.importedCount || 0)
      const skippedCount = Number(payload.skippedCount || 0)
      setState('success')
      setMessage(formatImportMessage(importedCount, skippedCount))
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : '导入失败')
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        data-admin-generation-import-media-library
        onClick={handleImport}
        disabled={state === 'loading'}
        className="inline-flex rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === 'loading' ? 'Importing' : 'Import'}
      </button>
      {message ? (
        <p className={`mt-1 text-[11px] leading-4 ${state === 'error' ? 'text-red-600' : 'text-slate-500'}`}>
          {message}
        </p>
      ) : null}
    </div>
  )
}

function formatImportMessage(importedCount: number, skippedCount: number): string {
  if (importedCount > 0) {
    return `已导入 ${importedCount.toLocaleString('zh-CN')} 个；跳过 ${skippedCount.toLocaleString('zh-CN')} 个`
  }
  if (skippedCount > 0) {
    return `已存在，跳过 ${skippedCount.toLocaleString('zh-CN')} 个`
  }
  return '没有可导入素材'
}
