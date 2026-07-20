'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { getImageUploadUrl } from '@/lib/upload-url'
import { useCommonTranslations } from '@/lib/use-common-translations'

const HIDDEN_PROMPT = 'Remove visible watermarks, logos, timestamp overlays, or text overlays from this image. Preserve the original subject, background, lighting, texture, and composition. Only edit the overlay areas.'
const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30MB
const COMPRESS_THRESHOLD = 512 * 1024 // 超过 512KB 即压缩，降低 API 超时概率
const MAX_DIM = 1280 // AI 处理大图较慢，限制边长以缩短响应时间

interface WatermarkRemoverProps {
  initialTranslations?: any
  heroTitle?: string
  heroDescription?: string
}

async function compressIfNeeded(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    const objUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objUrl)
      const maxDim = MAX_DIM
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (file.size <= COMPRESS_THRESHOLD && w <= maxDim && h <= maxDim) {
        resolve(file)
        return
      }
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w)
          w = maxDim
        } else {
          w = Math.round((w * maxDim) / h)
          h = maxDim
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg') || 'image.jpg', { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.85
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(objUrl)
      resolve(file)
    }
    img.src = objUrl
  })
}

export default function WatermarkRemover({ initialTranslations, heroTitle, heroDescription }: WatermarkRemoverProps) {
  const commonTranslations = useCommonTranslations(initialTranslations)
  const text = commonTranslations?.common?.watermarkRemoverTool || {
    uploadTitle: 'Click or drag image here',
    uploadFormats: 'JPG, PNG, WebP (max 30MB). Under 2MB or 1280px recommended for faster processing.',
    rightsNotice: 'By uploading, you confirm that you own this image or have permission to edit and remove the selected overlay.',
    uploadNew: 'Upload New',
    generating: 'Generating...',
    generate: 'Generate',
    regenerate: 'Regenerate',
    download: 'Download',
    downloading: 'Downloading...',
    compareTitle: 'Long-press to compare with original',
    compareAria: 'Compare with original',
    back: 'Back',
    originalAlt: 'Original',
    resultAlt: 'Result',
    invalidImage: 'Please select an image file (JPG, PNG, WebP, etc.)',
    tooLarge: 'Image size must be under 30MB',
    success: 'Watermark removed successfully',
    downloadStarted: 'Download started',
    downloadFailed: 'Download failed',
    uploadFailed: 'Image upload failed',
    createFailed: 'Failed to create watermark removal task',
    generationFailed: 'Watermark removal failed',
    timeout: 'Watermark removal timeout. Please try again.',
    requestFailed: 'Request failed: {status}',
    noImageUrl: 'No image URL in response',
  }
  const formatText = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce((next, [key, value]) => next.replace(`{${key}}`, String(value)), template)
  const formatRequestFailed = (status: number) =>
    formatText(text.requestFailed || 'Request failed: {status}', { status })
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: string }>>([])
  const [comparePressed, setComparePressed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const processImage = useCallback(async (f: File) => {
    setIsProcessing(true)
    setError(null)
    setResultUrl(null)

    try {
      const fileToSend = await compressIfNeeded(f)

      const uploadForm = new FormData()
      uploadForm.append('image', fileToSend, fileToSend.name || 'image.jpg')
      const uploadRes = await fetch(getImageUploadUrl(), { method: 'POST', body: uploadForm })
      const uploadData = await uploadRes.json().catch(() => ({}))
      if (!uploadRes.ok || !uploadData?.url) {
        throw new Error(uploadData?.error || text.uploadFailed || formatRequestFailed(uploadRes.status))
      }

      const formData = new FormData()
      formData.append('prompt', HIDDEN_PROMPT)
      formData.append('aspectRatio', 'auto')
      formData.append('resolution', '1K')
      formData.append('isImageToImage', 'true')
      formData.append('model', 'gpt-image-2')
      formData.append('imageUrls', JSON.stringify([uploadData.url]))

      const createRes = await fetch('/api/image-to-image', { method: 'POST', body: formData })
      const createData = await createRes.json().catch(() => ({}))
      if (!createRes.ok || !createData?.taskId) {
        throw new Error(createData?.error || text.createFailed || formatRequestFailed(createRes.status))
      }

      let outputUrl = ''
      for (let i = 0; i < 60; i++) {
        const statusRes = await fetch('/api/image-to-image/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: createData.taskId }),
        })
        const statusData = await statusRes.json().catch(() => ({}))
        if (statusData?.status === 'SUCCEEDED' && statusData?.imageUrl) {
          outputUrl = statusData.imageUrl
          break
        }
        if (!statusRes.ok || statusData?.status === 'FAILED') {
          throw new Error(statusData?.message || statusData?.error || text.generationFailed || formatRequestFailed(statusRes.status))
        }
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }

      if (!outputUrl) {
        throw new Error(text.timeout || text.noImageUrl)
      }

      try {
        const saveRes = await fetch('/api/save-image-to-r2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: outputUrl }),
        })
        const saveData = await saveRes.json().catch(() => ({}))
        setResultUrl(saveRes.ok && saveData?.url ? saveData.url : outputUrl)
      } catch {
        setResultUrl(outputUrl)
      }
      showToast(text.success, 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [
    text.createFailed,
    text.generationFailed,
    text.noImageUrl,
    text.requestFailed,
    text.success,
    text.timeout,
    text.uploadFailed,
  ])

  const handleFileSelect = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError(text.invalidImage)
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError(text.tooLarge)
      return
    }
    setError(null)
    setResultUrl(null)
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    processImage(f)
  }, [processImage, text.invalidImage, text.tooLarge])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFileSelect(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const f = e.dataTransfer.files?.[0]
    if (f) handleFileSelect(f)
  }, [handleFileSelect])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleRegenerate = () => {
    if (!file || isProcessing) return
    processImage(file)
  }

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setResultUrl(null)
    setError(null)
    setComparePressed(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const [downloading, setDownloading] = useState(false)

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    }, 100)
  }

  const handleDownload = async () => {
    if (!resultUrl || downloading) return
    setDownloading(true)
    const filename = `watermark-removed-${Date.now()}.jpg`
    try {
      // data URL 直接转为 blob 下载
      if (resultUrl.startsWith('data:')) {
        const res = await fetch(resultUrl)
        const blob = await res.blob()
        triggerBlobDownload(blob, filename)
        showToast(text.downloadStarted, 'success')
        return
      }
      // 方法1: 代理下载（R2 等白名单 URL）
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(resultUrl)}&filename=${encodeURIComponent(filename)}`
      const proxyRes = await fetch(proxyUrl).catch(() => null)
      if (proxyRes?.ok) {
        const blob = await proxyRes.blob()
        triggerBlobDownload(blob, filename)
        showToast(text.downloadStarted, 'success')
        return
      }
      // 方法2: 直接 fetch（CORS 允许时）
      const directRes = await fetch(resultUrl, { mode: 'cors', credentials: 'omit' }).catch(() => null)
      if (directRes?.ok) {
        const blob = await directRes.blob()
        triggerBlobDownload(blob, filename)
        showToast(text.downloadStarted, 'success')
        return
      }
      // 方法3: 降级为 a 标签（同源时生效；跨域时浏览器可能仍打开预览）
      const a = document.createElement('a')
      a.href = resultUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      showToast(text.downloadStarted, 'success')
    } catch {
      showToast(text.downloadFailed, 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handleComparePointerDown = () => setComparePressed(true)
  const handleComparePointerUp = () => setComparePressed(false)
  const handleComparePointerLeave = () => setComparePressed(false)

  const displayImage = preview ? (resultUrl ? (comparePressed ? preview : resultUrl) : preview) : null
  const primaryActionLabel = isProcessing ? text.generating : resultUrl ? text.regenerate : text.generate || text.regenerate

  return (
    <div className="mx-auto w-full max-w-7xl" data-tool-watermark data-legacy-generator-layout>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="grid min-h-[620px] grid-cols-1 gap-4 lg:grid-cols-[390px_minmax(0,1fr)] lg:items-stretch">
        <aside
          data-generator-controls-panel
          className="flex flex-col rounded-[1.5rem] border border-indigo-100 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#4F46E5]">AI tool</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950">{text.uploadNew}</h2>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-indigo-200 bg-[#F8FAFF] p-4 text-center transition-colors hover:border-indigo-300 hover:bg-indigo-50/70"
          >
            {preview ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img src={preview} alt={text.originalAlt} className="h-52 w-full object-contain" />
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 px-3 py-2 text-xs font-bold text-white">
                  {text.uploadNew}
                </div>
              </div>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#4F46E5] shadow-sm ring-1 ring-indigo-100">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-700">{text.uploadTitle}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{text.uploadFormats}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {preview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-bold text-[#4F46E5] transition-colors hover:bg-indigo-50"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0L8 8m4-4v12" />
                </svg>
                {text.uploadNew}
              </button>
            )}

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={!file || isProcessing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
                </svg>
              )}
              {primaryActionLabel}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!resultUrl || isProcessing || downloading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={downloading ? text.downloading : text.download}
            >
              {downloading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="16" opacity="0.3" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="16" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
              {downloading ? text.downloading : text.download}
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleClear}
                className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100"
              >
                {text.back}
              </button>
            )}
          </div>

          <p className="mt-auto pt-5 text-xs leading-5 text-slate-500">
            {text.rightsNotice ||
              'By uploading, you confirm that you own this image or have permission to edit and remove the selected overlay.'}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}
        </aside>

        <section
          data-generator-demo-history-panel
          className="flex min-h-[560px] flex-col rounded-[1.5rem] border border-indigo-100 bg-white p-4 shadow-sm md:p-6"
        >
          {(heroTitle || heroDescription) && (
            <div className="mx-auto mb-5 max-w-3xl text-center">
              {heroTitle && (
                <h1 className="text-[34px] font-extrabold leading-tight tracking-tight text-slate-950 md:text-[40px]">
                  {heroTitle}
                </h1>
              )}
              {heroDescription && (
                <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                  {heroDescription}
                </p>
              )}
            </div>
          )}

          <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {displayImage ? (
              <img
                src={displayImage}
                alt={comparePressed ? text.originalAlt : text.resultAlt}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 grid grid-cols-2 overflow-hidden bg-slate-100">
                <div className="relative bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.42),transparent_32%),radial-gradient(circle_at_78%_78%,rgba(14,165,233,0.34),transparent_34%),linear-gradient(135deg,#dbeafe,#f8fafc)]">
                  <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(115deg,transparent,transparent_18px,rgba(15,23,42,0.55)_19px,rgba(15,23,42,0.55)_21px)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="-rotate-12 rounded-xl border border-white/50 bg-white/60 px-6 py-3 text-2xl font-black tracking-[0.18em] text-slate-700 shadow-sm">
                      TOOLAZE
                    </span>
                  </div>
                </div>
                <div className="bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.42),transparent_32%),radial-gradient(circle_at_78%_78%,rgba(14,165,233,0.34),transparent_34%),linear-gradient(135deg,#dbeafe,#f8fafc)]" />
                <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/90" />
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-indigo-100 bg-white/90 px-8 py-6 shadow-xl">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-600" />
                  </span>
                  <span className="font-medium text-slate-600">{text.generating}</span>
                </div>
              </div>
            )}

            {resultUrl && !isProcessing && (
              <button
                onPointerDown={handleComparePointerDown}
                onPointerUp={handleComparePointerUp}
                onPointerLeave={handleComparePointerLeave}
                onContextMenu={(e) => e.preventDefault()}
                style={{ touchAction: 'none' }}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-lg transition-colors hover:bg-slate-50 active:bg-indigo-50"
                title={text.compareTitle}
                aria-label={text.compareAria}
              >
                <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="8" height="18" rx="1" />
                  <rect x="13" y="3" width="8" height="18" rx="1" />
                  <line x1="12" y1="3" x2="12" y2="21" />
                </svg>
              </button>
            )}
          </div>
        </section>
      </div>

      <ToastList toasts={toasts} />
    </div>
  )
}

function ToastList({ toasts }: { toasts: Array<{ id: string; msg: string; type: string }> }) {
  return (
    <div className="fixed left-1/2 top-[90px] z-[10000] flex w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 flex-col items-center gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`w-full rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg backdrop-blur pointer-events-auto ${
            t.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-rose-100' :
            t.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100' : 'border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100'
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
