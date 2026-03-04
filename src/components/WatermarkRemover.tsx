'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const HIDDEN_PROMPT = 'remove all watermarks in the image.'
const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30MB
const COMPRESS_THRESHOLD = 512 * 1024 // 超过 512KB 即压缩，降低 API 超时概率
const MAX_DIM = 1280 // AI 处理大图较慢，限制边长以缩短响应时间

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

export default function WatermarkRemover() {
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

      // 调用 qwen-image-edit（ai.t8star.cn /v1/images/edits），直接发送图片，无需上传与轮询
      const form = new FormData()
      form.append('model', 'nano-banana')
      form.append('prompt', HIDDEN_PROMPT)
      form.append('image', fileToSend, fileToSend.name || 'image.jpg')
      form.append('response_format', 'url')

      const res = await fetch('/api/qwen-image-edit', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`)
      }
      const resultUrl = data?.url
      if (!resultUrl) {
        throw new Error('No image URL in response')
      }
      setResultUrl(resultUrl)
      showToast('Watermark removed successfully', 'success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleFileSelect = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, etc.)')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('Image size must be under 30MB')
      return
    }
    setError(null)
    setResultUrl(null)
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    processImage(f)
  }, [processImage])

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

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `watermark-removed-${Date.now()}.jpg`
    a.click()
  }

  const handleComparePointerDown = () => setComparePressed(true)
  const handleComparePointerUp = () => setComparePressed(false)
  const handleComparePointerLeave = () => setComparePressed(false)

  // 空状态：上传区
  if (!preview) {
    return (
      <div className="max-w-2xl mx-auto" data-tool-watermark>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className="relative rounded-[2rem] border-2 border-dashed border-slate-200 bg-white hover:border-indigo-300 p-12 text-center transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <div className="text-4xl">📤</div>
            <p className="text-slate-600 font-medium">Click or drag image here</p>
            <p className="text-sm text-slate-400">JPG, PNG, WebP (max 30MB). Under 2MB or 1280px recommended for faster processing.</p>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
        )}
        <ToastList toasts={toasts} />
      </div>
    )
  }

  // 有图片：参考图布局（左图右栏）
  const displayImage = resultUrl ? (comparePressed ? preview : resultUrl) : preview

  return (
    <div className="max-w-5xl mx-auto" data-tool-watermark>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧：图片区域 */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[2rem] shadow-lg border border-indigo-50 overflow-hidden">
            {/* 顶部栏 */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100">
              <button
                onClick={handleClear}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 font-medium text-sm hover:bg-indigo-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload New
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>

            {/* 图片 + 处理中遮罩 + 对比按钮 */}
            <div className="relative aspect-[4/3] bg-slate-100">
              <img
                src={displayImage}
                alt={comparePressed ? 'Original' : 'Result'}
                className="w-full h-full object-contain"
              />

              {/* 处理中遮罩 */}
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <div className="bg-white/90 rounded-2xl px-8 py-6 shadow-xl border border-indigo-100 flex flex-col items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
                    </span>
                    <span className="text-slate-600 font-medium">Generating…</span>
                  </div>
                </div>
              )}

              {/* 对比按钮（生成完成后显示） */}
              {resultUrl && !isProcessing && (
                <button
                  onPointerDown={handleComparePointerDown}
                  onPointerUp={handleComparePointerUp}
                  onPointerLeave={handleComparePointerLeave}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ touchAction: 'none' }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-indigo-50 transition-colors"
                  title="Long-press to compare with original"
                  aria-label="Compare with original"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="8" height="18" rx="1" />
                    <rect x="13" y="3" width="8" height="18" rx="1" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：操作栏 */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-[2rem] p-6 border border-indigo-100/50 h-fit">
            <div className="space-y-3">
              <button
                onClick={handleRegenerate}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Regenerate
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleDownload}
                disabled={!resultUrl || isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Download
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l4-4m-4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
      )}

      <ToastList toasts={toasts} />
    </div>
  )
}

function ToastList({ toasts }: { toasts: Array<{ id: string; msg: string; type: string }> }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
            t.type === 'error' ? 'bg-red-500 text-white' :
            t.type === 'success' ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  )
}
