'use client'

import { useState, useRef, useCallback } from 'react'

type RightPanelMode = 'sample' | 'generating' | 'history' | 'result'

interface HistoryItem {
  id: string
  inputPreview: string
  outputPreview: string
  prompt: string
  time: string
  aspectRatio?: string
  resolution?: string
  outputFormat?: string
}

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1' },
  { value: '2:3', label: '2:3' },
  { value: '3:2', label: '3:2' },
  { value: '3:4', label: '3:4' },
  { value: '4:3', label: '4:3' },
  { value: '4:5', label: '4:5' },
  { value: '5:4', label: '5:4' },
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' },
  { value: '21:9', label: '21:9' },
  { value: 'auto', label: 'Auto' },
] as const

interface ImageItem {
  file: File
  preview: string
}

export default function NanoBananaTool() {
  const [activeTab, setActiveTab] = useState<'image-to-image' | 'text-to-image'>('image-to-image')
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([])
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<string>('auto')
  const [resolution, setResolution] = useState<string>('1K')
  const [outputFormat, setOutputFormat] = useState('Auto')
  const [isGenerating, setIsGenerating] = useState(false)
  const [rightMode, setRightMode] = useState<RightPanelMode>('sample')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentResult, setCurrentResult] = useState<HistoryItem | null>(null)
  const [sampleIndex, setSampleIndex] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const cleanMsg = msg.replace(/✅|❌|⚠️|❗/g, '').trim()
    
    setToasts(prev => [...prev, { id, msg: cleanMsg, type }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const MAX_IMAGES = 8
  const MAX_FILE_SIZE = 30 * 1024 * 1024 // 30MB

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.isArray(files) ? files : Array.from(files)
    const validFiles = list.filter((f) => {
      if (!f.type.startsWith('image/')) return false
      if (f.size > MAX_FILE_SIZE) {
        showToast(`File ${f.name} exceeds 30MB limit`, 'error')
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    const currentCount = imageFiles.length
    const remainingSlots = MAX_IMAGES - currentCount
    if (validFiles.length > remainingSlots) {
      showToast(`Maximum ${MAX_IMAGES} images allowed. Only ${remainingSlots} will be added.`, 'warning')
      validFiles.splice(remainingSlots)
    }

    const newImages: ImageItem[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setImageFiles(prev => {
      const combined = [...prev, ...newImages]
      return combined.slice(0, MAX_IMAGES)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const clearAllImages = () => {
    imageFiles.forEach(item => URL.revokeObjectURL(item.preview))
    setImageFiles([])
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const NANO_BANANA_DAILY_KEY = 'nano_banana_last_used_date'

  const checkDailyLimit = (): boolean => {
    const today = new Date().toISOString().split('T')[0]
    const lastUsed = typeof localStorage !== 'undefined' ? localStorage.getItem(NANO_BANANA_DAILY_KEY) : null
    if (lastUsed === today) {
      alert('Daily free limit reached. Please come back tomorrow!')
      return false
    }
    return true
  }

  const recordDailyUsage = () => {
    const today = new Date().toISOString().split('T')[0]
    try {
      localStorage.setItem(NANO_BANANA_DAILY_KEY, today)
    } catch (_) {}
  }

  const handleGenerate = async () => {
    if (activeTab === 'image-to-image' && imageFiles.length === 0) return
    if (!prompt?.trim()) return
    if (!checkDailyLimit()) return
    setIsGenerating(true)
    setRightMode('generating')
    
    try {
      const formData = new FormData()
      formData.append('prompt', prompt.trim())
      formData.append('aspectRatio', aspectRatio)
      formData.append('resolution', resolution)
      formData.append('outputFormat', outputFormat)
      formData.append('isImageToImage', String(activeTab === 'image-to-image'))

      const uploadUrl = typeof process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL === 'string'
        ? process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL.trim()
        : ''
      if (activeTab === 'image-to-image' && imageFiles.length > 0) {
        if (uploadUrl) {
          // 批量上传所有图片
          const imageUrls: string[] = []
          for (const imageItem of imageFiles) {
            const uploadForm = new FormData()
            uploadForm.append('image', imageItem.file)
            let uploadRes: Response
            try {
              uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
            } catch (e: any) {
              const msg = e?.message || ''
              if (msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch')) {
                throw new Error(
                  'Image upload request failed. Please check: 1) NEXT_PUBLIC_IMAGE_UPLOAD_URL is a valid Worker URL (e.g., https://xxx.workers.dev); 2) Worker is deployed; 3) Check browser console for CORS or network errors.'
                )
              }
              throw e
            }
            if (!uploadRes.ok) {
              const err = await uploadRes.json().catch(() => ({}))
              const msg = err?.error || `Upload failed: ${uploadRes.status}`
              if (uploadRes.status === 405) {
                throw new Error(
                  msg +
                    ' Please ensure NEXT_PUBLIC_IMAGE_UPLOAD_URL is the complete upload URL (e.g., https://toolaze-web.pages.dev/api/upload) and do not omit the trailing /api/upload.'
                )
              }
              throw new Error(msg)
            }
            const { url } = await uploadRes.json()
            if (url) {
              imageUrls.push(url)
            } else {
              throw new Error('Upload did not return url')
            }
          }
          // 将所有 URL 作为 JSON 字符串传递
          formData.append('imageUrls', JSON.stringify(imageUrls))
        } else {
          throw new Error(
            'Image-to-image requires uploading the image to R2 first to get a public URL. Please set NEXT_PUBLIC_IMAGE_UPLOAD_URL in .env.local to your Cloudflare Worker upload URL.'
          )
        }
      }

      const generateResponse = await fetch('/api/image-to-image', {
        method: 'POST',
        body: formData,
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const generateResult = await generateResponse.json()
      const taskId = generateResult.taskId

      if (!taskId) {
        // 如果直接返回了图片 URL（同步）
        if (generateResult.imageUrl) {
          const item: HistoryItem = {
            id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${performance.now()}`,
            inputPreview: imageFiles.length > 0 ? imageFiles[0].preview : '',
            outputPreview: generateResult.imageUrl,
            prompt,
            time: new Date().toLocaleString(),
            aspectRatio,
            resolution,
            outputFormat,
          }
          // 使用函数式更新，确保基于最新状态
          setHistory((prev) => {
            // 确保不会重复添加相同的项
            const exists = prev.find(h => h.id === item.id)
            if (exists) {
              console.warn('History item already exists:', item.id)
              return prev
            }
            const newHistory = [item, ...prev]
            console.log('Adding to history (sync):', item.id, 'Previous count:', prev.length, 'New count:', newHistory.length)
            return newHistory
          })
          setCurrentResult(item)
          setRightMode('result')
          setIsGenerating(false)
          recordDailyUsage()
          return
        }
        throw new Error('No task ID or image URL received')
      }

      // 轮询任务状态
      let attempts = 0
      const maxAttempts = 60 // 最多轮询 60 次（约 5 分钟）
      const pollInterval = 5000 // 每 5 秒轮询一次

      const pollStatus = async (): Promise<string> => {
        let statusResponse: Response
        try {
          statusResponse = await fetch('/api/image-to-image/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
          })
        } catch (error: any) {
          const msg = error?.message || 'Network error'
          if (msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
            throw new Error('Network connection failed. Please check your network connection and try again.')
          }
          throw new Error(`Request failed: ${msg}`)
        }

        if (!statusResponse.ok) {
          const errBody = await statusResponse.json().catch(() => ({}))
          const errMsg = (errBody as { error?: string })?.error || `Failed to check status (${statusResponse.status})`
          throw new Error(errMsg)
        }

        const statusResult = await statusResponse.json()

        if (statusResult.status === 'SUCCEEDED' && statusResult.imageUrl) {
          return statusResult.imageUrl
        }

        if (statusResult.status === 'FAILED') {
          throw new Error(statusResult.message || 'Image generation failed')
        }

        // 继续轮询
        attempts++
        if (attempts >= maxAttempts) {
          throw new Error('Generation timeout')
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval))
        return pollStatus()
      }

      const outputUrl = await pollStatus()

      if (outputUrl) {
        // 尝试把 Kie 生成图存到自己的 R2，便于直接下载（避免跨域新开标签）
        let finalUrl = outputUrl
        try {
          const saveRes = await fetch('/api/save-image-to-r2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: outputUrl }),
          })
          if (saveRes.ok) {
            const data = await saveRes.json()
            if ((data as { url?: string }).url) {
              finalUrl = (data as { url: string }).url
            }
          }
        } catch (_) {
          // 存 R2 失败则继续用 Kie 的 URL
        }

        const item: HistoryItem = {
          id: `async-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${performance.now()}`,
          inputPreview: imageFiles.length > 0 ? imageFiles[0].preview : '',
          outputPreview: finalUrl,
          prompt,
          time: new Date().toLocaleString(),
          aspectRatio,
          resolution,
          outputFormat,
        }
        // 使用函数式更新，确保基于最新状态
        setHistory((prev) => {
          // 确保不会重复添加相同的项
          const exists = prev.find(h => h.id === item.id)
          if (exists) {
            console.warn('History item already exists:', item.id)
            return prev
          }
          const newHistory = [item, ...prev]
          console.log('Adding to history (async):', item.id, 'Previous count:', prev.length, 'New count:', newHistory.length)
          return newHistory
        })
        setCurrentResult(item)
        setRightMode('result')
        recordDailyUsage()
      }
    } catch (error: any) {
      console.error('Generation error:', error)
      alert(`Generation failed: ${error.message}`)
      setRightMode('sample')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClear = () => {
    clearAllImages()
    setPrompt('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatTagValue = (value: string | undefined): string => {
    if (!value) return 'Auto'
    // 如果已经是首字母大写或全大写（如 "Auto", "PNG", "1K"），直接返回
    if (value[0] === value[0].toUpperCase() || value === value.toUpperCase()) {
      return value
    }
    // 否则首字母大写（如 "auto" -> "Auto"）
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

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

  const handleDownload = async (imageUrl: string, filename: string) => {
    setDownloadingUrl(imageUrl)
    
    try {
      // 优先使用下载代理（R2 等跨域图，服务端拉取后带 Content-Disposition 返回，实现直接下载）
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`
      
      // 方法1: 尝试通过 fetch 获取 blob（如果成功，可以更好地控制下载）
      try {
        const proxyRes = await fetch(proxyUrl)
        if (proxyRes.ok) {
          const blob = await proxyRes.blob()
          triggerBlobDownload(blob, filename)
          return
        }
        // 如果代理返回403（URL不在白名单），尝试直接下载
        if (proxyRes.status === 403) {
          console.warn('Download proxy rejected URL (not in whitelist), trying direct download')
        }
        // 如果返回其他错误（如500），继续尝试其他方法，不显示错误（因为浏览器可能已经触发了下载）
      } catch (error) {
        // 静默处理错误，继续尝试其他方法
      }

      // 方法2: 直接使用代理URL作为下载链接（让浏览器自动处理，避免错误提示）
      // 这样可以确保R2图片通过同域代理下载，即使代理返回错误，浏览器也会尝试下载
      try {
        const link = document.createElement('a')
        link.href = proxyUrl
        link.download = filename
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => document.body.removeChild(link), 100)
        // 等待一小段时间确保下载开始
        await new Promise(resolve => setTimeout(resolve, 500))
        return
      } catch (error) {
        // 静默处理错误
      }

      // 方法3: 直接 fetch 原始URL（同域或 CORS 允许时）
      try {
        const response = await fetch(imageUrl, {
          mode: 'cors',
          credentials: 'omit',
        }).catch(() => null)

        if (response && response.ok) {
          const blob = await response.blob()
          triggerBlobDownload(blob, filename)
          return
        }
      } catch (error) {
        // 静默处理错误
      }

      // 方法4: 最后回退到原始URL（可能新开标签）
      window.open(imageUrl, '_blank', 'noopener,noreferrer')
    } finally {
      // 延迟清除 loading 状态，确保下载已经开始
      setTimeout(() => setDownloadingUrl(null), 1000)
    }
  }

  // Placeholder sample images (can replace with real URLs)
  const sampleImages = [
    { caption: 'Sample output 1', color: 'bg-slate-200' },
    { caption: 'Sample output 2', color: 'bg-slate-300' },
  ]

  return (
    <section className="flex flex-col p-6 md:flex-1 md:min-h-0 md:overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 min-w-0 md:flex-1 md:min-h-0">
        {/* Left: 生图参数区 — 桌面可滚动+固定按钮；h5 上下流式布局，自然高度 */}
        <div className="w-full md:w-[380px] flex-shrink-0 flex flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 overflow-hidden">
          <div className="p-6 space-y-5 md:flex-1 md:min-h-0 md:overflow-y-auto">
            {/* Tabs */}
            <div className="flex rounded-xl bg-[#EEF2FF] p-1">
              <button
                type="button"
                onClick={() => setActiveTab('image-to-image')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'image-to-image'
                    ? 'bg-white text-[#4F46E5] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Image to Image
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('text-to-image')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'text-to-image'
                    ? 'bg-white text-[#4F46E5] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Text to Image
              </button>
            </div>

            {/* Models */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Models</label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/30 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] hover:border-[#C7D2FE] hover:bg-[#EEF2FF]/50 transition-all duration-200 appearance-none cursor-pointer shadow-sm">
                  <option>Nano Banana Pro</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Image Upload (Image to Image) - 小正方形一排三个 */}
            {activeTab === 'image-to-image' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wide">
                    Upload Your Image
                  </label>
                  {imageFiles.length > 0 && (
                    <span className="text-xs font-medium text-slate-400">{imageFiles.length}/{MAX_IMAGES}</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* 上传占位：第一格 */}
                  {imageFiles.length < MAX_IMAGES && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      className="aspect-square rounded-lg border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF]/50 cursor-pointer hover:border-[#4F46E5]/50 hover:bg-[#E0E7FF]/50 transition-all duration-200 flex flex-col items-center justify-center"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.length) handleFiles(e.target.files)
                          e.target.value = ''
                        }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span className="text-xs font-medium text-slate-500">Upload</span>
                    </div>
                  )}
                  {/* 已上传图片：小正方形 + 序号 */}
                  {imageFiles.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative group aspect-square rounded-lg overflow-hidden border border-[#E0E7FF] bg-slate-100 cursor-pointer"
                      onClick={() => {
                        // 点击图片格子替换该位置的图片
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/jpeg,image/jpg,image/png,image/webp'
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files
                          if (files && files.length > 0) {
                            const file = files[0]
                            if (file.size > MAX_FILE_SIZE) {
                              showToast(`File ${file.name} exceeds 30MB limit`, 'error')
                              return
                            }
                            // 替换指定位置的图片
                            setImageFiles(prev => {
                              const newFiles = [...prev]
                              URL.revokeObjectURL(newFiles[index].preview)
                              newFiles[index] = {
                                file,
                                preview: URL.createObjectURL(file)
                              }
                              return newFiles
                            })
                          }
                        }
                        input.click()
                      }}
                    >
                      <img
                        src={item.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* 序号：右下角 - 深灰色圆角方形，白色数字 */}
                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-slate-700 text-white text-xs font-bold flex items-center justify-center shadow-sm z-10">
                        {index + 1}
                      </span>
                      {/* 删除按钮：右上角 - 白色背景，深蓝色 X，正方形 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="absolute top-1 right-1 w-6 h-6 bg-white rounded-sm flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      {/* Hover overlay：替换提示 */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white text-[#4F46E5] rounded-lg font-semibold text-xs flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Replace
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">JPG, PNG, WEBP up to 30MB each · max {MAX_IMAGES} images</p>
              </div>
            )}

            {/* Prompt */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Please describe the image content"
                className="w-full min-h-[88px] px-4 py-3 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] resize-none transition-colors"
                rows={3}
              />
            </div>

            {/* Output Aspect Ratios */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Output Aspect Ratios</label>
              <div className="relative">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/30 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] hover:border-[#C7D2FE] hover:bg-[#EEF2FF]/50 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                >
                  {ASPECT_RATIOS.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Resolution</label>
              <div className="relative">
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/30 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] hover:border-[#C7D2FE] hover:bg-[#EEF2FF]/50 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="1K">1K</option>
                  <option value="2K">2K</option>
                  <option value="4K">4K</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Output Format</label>
              <div className="relative">
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/30 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] hover:border-[#C7D2FE] hover:bg-[#EEF2FF]/50 transition-all duration-200 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Auto">Auto</option>
                  <option value="PNG">PNG</option>
                  <option value="JPG">JPG</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Generate 固定底部，始终在第一屏 */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-[#E0E7FF] bg-white">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                style={{
                  background: isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0)
                    ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                    : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Generated Image (shown when result exists) or Generating Animation */}
        {isGenerating ? (
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
                <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              <p className="text-slate-500 font-medium text-sm">Generating...</p>
            </div>
          </div>
        ) : currentResult && rightMode === 'result' ? (
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 flex flex-col items-center justify-center p-8">
            <img 
              src={currentResult.outputPreview} 
              alt="Generated" 
              onClick={() => setPreviewImage(currentResult.outputPreview)}
              className="max-w-full max-h-full object-contain rounded-xl cursor-pointer hover:opacity-90 transition-opacity" 
            />
            <p className="mt-4 text-xs text-slate-500 text-center">
              The image will disappear after you refresh the page. Please download it as soon as possible.
            </p>
          </div>
        ) : null}

        {/* Right: 功能示例图 / 生成中 / 历史记录 / 结果详情 */}
        {!isGenerating && (
          <div className={`${rightMode === 'result' ? 'w-full md:w-[400px]' : 'flex-1'} min-w-0 bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 flex flex-col relative overflow-hidden`}>
          {/* Tabs for right panel when history exists */}
          {(history.length > 0 || isGenerating) && !isGenerating && rightMode !== 'result' && (
            <div className="flex border-b border-[#E0E7FF] px-5 pt-4 gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setRightMode('sample')}
                className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-colors ${
                  rightMode === 'sample' ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] border-b-0 -mb-px' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sample image
              </button>
              <button
                type="button"
                onClick={() => setRightMode('history')}
                className={`px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-colors ${
                  rightMode === 'history' ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] border-b-0 -mb-px' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                History
              </button>
            </div>
          )}

          <div className={`flex-1 overflow-auto p-8 flex flex-col ${rightMode === 'result' || rightMode === 'history' ? 'justify-start' : 'items-center justify-center'}`}>
            {rightMode === 'sample' && (
              <>
                <h3 className="text-slate-700 font-semibold text-base uppercase tracking-wider mb-8">Sample image</h3>
                <div className="relative w-full max-w-4xl flex justify-center items-center gap-6 md:gap-10">
                  <button
                    type="button"
                    onClick={() => setSampleIndex((i) => (i <= 0 ? sampleImages.length - 1 : i - 1))}
                    className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:bg-[#C7D2FE] transition-colors flex-shrink-0 shadow-sm"
                    aria-label="Previous"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <div className={`w-72 aspect-[4/3] md:w-96 rounded-2xl ${sampleImages[sampleIndex % sampleImages.length].color} flex items-center justify-center text-slate-500 text-sm ring-1 ring-slate-200/50 shadow-inner flex-shrink-0`}>
                    Sample {sampleIndex % sampleImages.length + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSampleIndex((i) => (i + 1) % sampleImages.length)}
                    className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:bg-[#C7D2FE] transition-colors flex-shrink-0 shadow-sm"
                    aria-label="Next"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </>
            )}

            {rightMode === 'generating' && !isGenerating && (
              <div className="flex flex-col items-center justify-center gap-8">
                <div className="w-16 h-16 rounded-full border-4 border-[#EEF2FF] border-t-[#4F46E5] animate-spin" />
                <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">Generating...</p>
              </div>
            )}

            {rightMode === 'result' && currentResult && (
              <div className="w-full space-y-6">
                {/* Output Prompt */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Prompt</label>
                  <div className="relative">
                    <textarea
                      value={currentResult.prompt}
                      readOnly
                      className="w-full min-h-[100px] px-4 py-3 pr-10 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-sm resize-none"
                      rows={4}
                    />
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const btn = e.currentTarget as HTMLButtonElement
                        if (!btn) return
                        
                        try {
                          await navigator.clipboard.writeText(currentResult.prompt)
                          // 临时显示成功反馈
                          const originalTitle = btn.getAttribute('title') || 'Copy prompt'
                          btn.setAttribute('title', 'Copied!')
                          setTimeout(() => {
                            btn.setAttribute('title', originalTitle)
                          }, 2000)
                        } catch (err) {
                          console.error('Failed to copy:', err)
                          // 降级方案：使用传统方法
                          const textArea = document.createElement('textarea')
                          textArea.value = currentResult.prompt
                          textArea.style.position = 'fixed'
                          textArea.style.opacity = '0'
                          document.body.appendChild(textArea)
                          textArea.select()
                          try {
                            document.execCommand('copy')
                            const originalTitle = btn.getAttribute('title') || 'Copy prompt'
                            btn.setAttribute('title', 'Copied!')
                            setTimeout(() => {
                              btn.setAttribute('title', originalTitle)
                            }, 2000)
                          } catch (fallbackErr) {
                            console.error('Fallback copy failed:', fallbackErr)
                          }
                          document.body.removeChild(textArea)
                        }
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer z-10"
                      title="Copy prompt"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Input Thumbnail */}
                {currentResult.inputPreview && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentResult.inputPreview} 
                      alt="Input" 
                      onClick={() => setPreviewImage(currentResult.inputPreview!)}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C7D2FE] cursor-pointer hover:opacity-80 transition-opacity" 
                    />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Input image</p>
                    </div>
                  </div>
                )}

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{formatTagValue(aspectRatio)}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Nano Banana Pro</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{currentResult.time}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                    style={{
                      background: isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && imageFiles.length === 0)
                        ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                        : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                    }}
                  >
                    Recreate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.png`)}
                    disabled={downloadingUrl === currentResult.outputPreview}
                    className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title={downloadingUrl === currentResult.outputPreview ? 'Downloading...' : 'Download'}
                  >
                    {downloadingUrl === currentResult.outputPreview ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" opacity="0.3" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentResult(null)
                      setRightMode('sample')
                    }}
                    className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                    title="Delete"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {rightMode === 'history' && (
              <div className="w-full space-y-6">
                <h3 className="text-slate-700 font-semibold text-base uppercase tracking-wider mb-6">History</h3>
                {/* Generating Status at Top */}
                {isGenerating && (
                  <div className="p-5 rounded-2xl border border-[#E0E7FF] bg-white shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
                        <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
                      </div>
                      <p className="text-slate-500 font-medium text-sm">Generating...</p>
                    </div>
                  </div>
                )}
                {/* History Items */}
                {history.length > 0 && history.map((item) => (
                  <div key={item.id} className="space-y-4 p-5 rounded-2xl border border-[#E0E7FF] bg-white shadow-sm">
                    {/* Prompt */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Prompt</label>
                      <div className="relative">
                        <textarea
                          value={item.prompt}
                          readOnly
                          className="w-full min-h-[80px] px-4 py-3 pr-10 rounded-xl border border-slate-200/90 bg-slate-50/50 text-slate-800 text-sm resize-none"
                          rows={3}
                        />
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const btn = e.currentTarget as HTMLButtonElement
                            if (!btn) return
                            
                            try {
                              await navigator.clipboard.writeText(item.prompt)
                              showToast('Prompt copied to clipboard', 'success')
                            } catch (err) {
                              console.error('Failed to copy:', err)
                              // 降级方案：使用传统方法
                              const textArea = document.createElement('textarea')
                              textArea.value = item.prompt
                              textArea.style.position = 'fixed'
                              textArea.style.opacity = '0'
                              document.body.appendChild(textArea)
                              textArea.select()
                              try {
                                document.execCommand('copy')
                                showToast('Prompt copied to clipboard', 'success')
                              } catch (fallbackErr) {
                                console.error('Fallback copy failed:', fallbackErr)
                                showToast('Failed to copy prompt', 'error')
                              }
                              document.body.removeChild(textArea)
                            }
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer z-10"
                          title="Copy prompt"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Input Thumbnail & Metadata */}
                    <div className="flex items-center gap-3">
                      {item.inputPreview ? (
                        <img 
                          src={item.inputPreview} 
                          alt="Input" 
                          onClick={() => setPreviewImage(item.inputPreview!)}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C7D2FE] cursor-pointer hover:opacity-80 transition-opacity" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-xs text-[#4F46E5]">Text</div>
                      )}
                      <div className="flex flex-wrap gap-2 flex-1">
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{formatTagValue(item.aspectRatio)}</span>
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Nano Banana Pro</span>
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{item.time}</span>
                      </div>
                    </div>

                    {/* Generated Image */}
                    <div className="w-full">
                      <img 
                        src={item.outputPreview} 
                        alt="Generated" 
                        onClick={() => setPreviewImage(item.outputPreview)}
                        className="w-full rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity border border-[#E0E7FF]" 
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPrompt(item.prompt)
                          setAspectRatio(item.aspectRatio || 'auto')
                          setResolution(item.resolution || '1K')
                          setOutputFormat(item.outputFormat || 'Auto')
                          if (item.inputPreview) {
                            // 如果有输入图片，切换到 image-to-image 模式
                            setActiveTab('image-to-image')
                            // 注意：这里无法直接恢复 imageFiles，因为它们是 File 对象
                            // 但可以显示预览（仅显示第一张）
                          }
                          setCurrentResult(item)
                          setRightMode('result')
                        }}
                        className="flex-1 py-3 rounded-xl font-bold text-sm text-center transition-all duration-200 text-white shadow-md hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                        }}
                      >
                        Recreate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(item.outputPreview, `generated-${item.id}.png`)}
                        disabled={downloadingUrl === item.outputPreview}
                        className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        title={downloadingUrl === item.outputPreview ? 'Downloading...' : 'Download'}
                      >
                        {downloadingUrl === item.outputPreview ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" opacity="0.3" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32" strokeDashoffset="16" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHistory((prev) => prev.filter((h) => h.id !== item.id))
                          if (currentResult?.id === item.id) {
                            setCurrentResult(null)
                            setRightMode(history.length > 1 ? 'history' : 'sample')
                          }
                        }}
                        className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                        title="Delete"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rightMode === 'history' && history.length === 0 && !isGenerating && (
              <p className="text-slate-500 text-sm">No history yet. Generate an image to see it here.</p>
            )}
            
            {rightMode === 'history' && history.length === 0 && isGenerating && (
              <div className="w-full max-w-3xl">
                <div className="p-5 rounded-2xl border border-[#E0E7FF] bg-white shadow-sm">
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <div className="w-3 h-3 rounded-full bg-[#4F46E5] animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Generating...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPreviewImage(null)
              }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white hover:bg-white flex items-center justify-center shadow-lg transition-colors z-10 cursor-pointer"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div id="toastContainer" className="fixed top-5 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-2.5 pointer-events-none">
        {toasts.map((toast) => {
          const ToastIcon = () => {
            if (toast.type === 'success') {
              return (
                <svg className="toast-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z" fill="#059669"/>
                </svg>
              )
            } else if (toast.type === 'error') {
              return (
                <svg className="toast-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#EF4444"/>
                  <path d="M10 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14H10.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            } else if (toast.type === 'warning') {
              return (
                <svg className="toast-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" fill="#F59E0B"/>
                  <path d="M10 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14H10.01" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )
            }
            return null
          }
          
          return (
            <div
              key={toast.id}
              className={`toast ${toast.type}`}
            >
              <ToastIcon />
              <span>{toast.msg}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
