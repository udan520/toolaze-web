'use client'

import { useCallback, useState } from 'react'
import { getImageUploadUrl } from '@/lib/upload-url'
import { useCommonTranslations } from '@/lib/use-common-translations'
import ReferenceImageUploader from '@/components/ReferenceImageUploader'

const MAX_FILE_SIZE = 30 * 1024 * 1024
const DAILY_LIMIT_KEY = 'photo_restoration_last_used_date'

const RESTORE_COLORIZE_PROMPT = 'Restore and colorize this old photo by removing scratches, dust, and noise. Enhance clarity, sharpness, and details while preserving the original colors and natural look.'
const DEMO_IMAGE_URL = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'

interface PhotoRestorationProps {
  initialTranslations?: any
  heroTitle?: string
  heroDescription?: string
}

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

export default function PhotoRestoration({ initialTranslations, heroTitle, heroDescription }: PhotoRestorationProps) {
  const commonTranslations = useCommonTranslations(initialTranslations)
  const text = commonTranslations?.common?.photoRestorationTool || {
    invalidImage: 'Please upload a valid image file.',
    tooLarge: 'Image size must be under 30MB.',
    dailyLimit: 'Daily free limit reached. Please come back tomorrow!',
    uploadFailed: 'Image upload failed.',
    createFailed: 'Failed to create restoration task.',
    restorationFailed: 'Restoration failed.',
    timeout: 'Restoration timeout. Please try again.',
    uploadTitle: 'Drag and drop image here',
    uploadFormats: 'JPG, JPEG, PNG • Max 30MB',
    uploadButton: 'Upload Image',
    generating: 'Generating...',
    generate: 'Generate',
    regenerate: 'Regenerate',
    download: 'Download',
    uploadPreviewAlt: 'Uploaded preview',
    removeUploadedImage: 'Remove uploaded image',
    resultAlt: 'Restored photo result',
    oldExampleAlt: 'Old black and white damaged photo',
    restoredExampleAlt: 'Restored photo result example',
    previewAlt: 'Preview',
  }
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDailyLimitEnabled = () => {
    if (typeof window === 'undefined') return false
    const hostname = window.location.hostname
    return hostname === 'toolaze.com' || hostname === 'www.toolaze.com'
  }

  const checkDailyLimit = () => {
    if (!isDailyLimitEnabled()) return true
    try {
      return localStorage.getItem(DAILY_LIMIT_KEY) !== todayKey()
    } catch {
      return true
    }
  }

  const markDailyUsage = () => {
    if (!isDailyLimitEnabled()) return
    try {
      localStorage.setItem(DAILY_LIMIT_KEY, todayKey())
    } catch {}
  }

  const handlePickFile = useCallback((nextFile: File) => {
    if (!nextFile.type.startsWith('image/')) {
      setError(text.invalidImage)
      return
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError(text.tooLarge)
      return
    }
    setError(null)
    setFile(nextFile)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(nextFile))
  }, [previewUrl, text.invalidImage, text.tooLarge])

  const handleGenerate = useCallback(async () => {
    if (!file || isProcessing) return
    if (!checkDailyLimit()) {
      setError(text.dailyLimit)
      return
    }

    setIsProcessing(true)
    setError(null)
    setResultUrl(null)

    try {
      const uploadForm = new FormData()
      uploadForm.append('image', file)
      const uploadRes = await fetch(getImageUploadUrl(), { method: 'POST', body: uploadForm })
      const uploadData = await uploadRes.json().catch(() => ({}))
      if (!uploadRes.ok || !uploadData?.url) {
        throw new Error(uploadData?.error || text.uploadFailed)
      }

      const formData = new FormData()
      formData.append('prompt', RESTORE_COLORIZE_PROMPT)
      formData.append('aspectRatio', 'auto')
      formData.append('resolution', '1K')
      formData.append('isImageToImage', 'true')
      formData.append('model', 'gpt-image-2')
      formData.append('imageUrls', JSON.stringify([uploadData.url]))

      const createRes = await fetch('/api/image-to-image', { method: 'POST', body: formData })
      const createData = await createRes.json().catch(() => ({}))
      if (!createRes.ok || !createData?.taskId) {
        throw new Error(createData?.error || text.createFailed)
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
        if (statusData?.status === 'FAILED') {
          throw new Error(statusData?.message || text.restorationFailed)
        }
        await new Promise((resolve) => setTimeout(resolve, 3000))
      }

      if (!outputUrl) {
        throw new Error(text.timeout)
      }

      try {
        const saveRes = await fetch('/api/save-image-to-r2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: outputUrl }),
        })
        const saveData = await saveRes.json().catch(() => ({}))
        const finalUrl = saveRes.ok && saveData?.url ? saveData.url : outputUrl
        setResultUrl(finalUrl)
      } catch {
        setResultUrl(outputUrl)
      }

      markDailyUsage()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsProcessing(false)
    }
  }, [file, isProcessing, text.createFailed, text.dailyLimit, text.restorationFailed, text.timeout, text.uploadFailed])

  const clearUploadedImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFile(null)
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const link = document.createElement('a')
    link.href = resultUrl
    link.download = `photo-restoration-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mx-auto w-full max-w-7xl" data-legacy-generator-layout>
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 items-start lg:grid-cols-[380px_1fr]">
          <div data-generator-controls-panel className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <ReferenceImageUploader
              items={previewUrl ? [{
                id: 'photo-restoration-source',
                src: previewUrl,
                alt: text.uploadPreviewAlt,
                onRemove: clearUploadedImage,
                onReplace: handlePickFile,
              }] : []}
              maxImages={1}
              maxFileSizeMb={30}
              onFiles={(files) => handlePickFile(files[0])}
              onInvalidType={() => setError(text.invalidImage)}
              onValidationError={() => setError(text.tooLarge)}
              label={text.uploadTitle}
              helperText={text.uploadFormats}
              uploadLabel={text.uploadButton}
              replaceLabel={text.uploadButton}
              deleteLabel={text.removeUploadedImage}
              size="large"
              testIdPrefix="photo-restoration-reference"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!file || isProcessing}
              className="w-full mt-5 py-3.5 rounded-xl font-bold text-sm text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-center"
              style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)' }}
            >
              {isProcessing ? text.generating : text.generate}
            </button>
          </div>

          <div data-generator-demo-history-panel className="rounded-2xl border border-slate-200 bg-slate-50 min-h-[400px] md:min-h-[64vh] flex flex-col gap-4 p-3 md:p-4">
            {(heroTitle || heroDescription) && (
              <div className="mx-auto max-w-3xl px-2 pt-2 text-center">
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
            <div className="w-full h-full flex flex-col">
              <div className="relative flex-1 min-h-[340px] md:min-h-[56vh] rounded-xl overflow-hidden border border-slate-200 bg-white">
              {resultUrl ? (
                <button
                  type="button"
                  onClick={() => setPreviewImage(resultUrl)}
                  className="absolute inset-0 z-10"
                >
                  <img src={resultUrl} alt={text.resultAlt} className="w-full h-full object-contain bg-slate-100" />
                </button>
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 w-1/2">
                    <img src={DEMO_IMAGE_URL} alt={text.oldExampleAlt} className="w-full h-full object-cover grayscale contrast-125 brightness-90" />
                    <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(115deg,transparent,transparent_16px,rgba(255,255,255,0.75)_17px,rgba(255,255,255,0.75)_18px)]" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,0.45)_0,rgba(0,0,0,0)_45%),radial-gradient(circle_at_78%_70%,rgba(0,0,0,0.4)_0,rgba(0,0,0,0)_40%)]" />
                  </div>
                  <div className="absolute inset-y-0 right-0 w-1/2">
                    <img src={DEMO_IMAGE_URL} alt={text.restoredExampleAlt} className="w-full h-full object-cover saturate-110 contrast-110" />
                  </div>
                  <div className="absolute inset-y-0 left-1/2 w-[2px] -ml-[1px] bg-white/80" />
                </>
              )}
              {isProcessing && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px]">
                  <div className="rounded-xl bg-white/95 border border-indigo-100 px-5 py-3 shadow-md flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
                    <span className="text-sm font-semibold text-slate-700">{text.generating}</span>
                  </div>
                </div>
              )}
              </div>
            {resultUrl && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isProcessing || !file}
                  className="px-5 py-2.5 rounded-lg border border-indigo-200 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 disabled:opacity-50"
                >
                  {text.regenerate}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm"
                >
                  {text.download}
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt={text.previewAlt}
            className="max-w-[92vw] max-h-[92vh] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
