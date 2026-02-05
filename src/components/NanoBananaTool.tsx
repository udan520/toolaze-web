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

export default function NanoBananaTool() {
  const [activeTab, setActiveTab] = useState<'image-to-image' | 'text-to-image'>('image-to-image')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.isArray(files) ? files : Array.from(files)
    const img = list.find((f) => f.type.startsWith('image/'))
    if (img) handleFile(img)
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
      alert('今日免费次数已用完，请明天再来！')
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
    if (activeTab === 'image-to-image' && !imageFile) return
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
      if (activeTab === 'image-to-image' && imageFile) {
        if (uploadUrl) {
          const uploadForm = new FormData()
          uploadForm.append('image', imageFile)
          let uploadRes: Response
          try {
            uploadRes = await fetch(uploadUrl, { method: 'POST', body: uploadForm })
          } catch (e: any) {
            const msg = e?.message || ''
            if (msg.includes('fetch') || msg.includes('NetworkError') || msg.includes('Failed to fetch')) {
              throw new Error(
                '图片上传请求失败：请检查 1) NEXT_PUBLIC_IMAGE_UPLOAD_URL 是否为正确的 Worker 地址（如 https://xxx.workers.dev）；2) Worker 是否已部署；3) 浏览器控制台是否有 CORS 或网络报错。'
              )
            }
            throw e
          }
          if (!uploadRes.ok) {
            const err = await uploadRes.json().catch(() => ({}))
            const msg = err?.error || `上传失败 ${uploadRes.status}`
            if (uploadRes.status === 405) {
              throw new Error(
                msg +
                  '。请确认 NEXT_PUBLIC_IMAGE_UPLOAD_URL 为完整上传地址（例如 https://toolaze-web.pages.dev/api/upload），且不要漏掉末尾的 /api/upload。'
              )
            }
            throw new Error(msg)
          }
          const { url } = await uploadRes.json()
          if (url) formData.append('imageUrl', url)
          else throw new Error('Upload did not return url')
        } else {
          throw new Error(
            '图生图需要先上传图片到 R2 获取公网链接。请在 .env.local 中设置 NEXT_PUBLIC_IMAGE_UPLOAD_URL 为你的 Cloudflare Worker 上传地址。'
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
            inputPreview: imagePreview || '',
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
            throw new Error('网络连接失败，请检查网络连接后重试')
          }
          throw new Error(`请求失败: ${msg}`)
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
          inputPreview: imagePreview || '',
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
      alert(`生成失败: ${error.message}`)
      setRightMode('sample')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClear = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    setPrompt('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      // 方法1: 尝试直接下载（适用于同域或支持 CORS 的图片）
      const response = await fetch(imageUrl, { 
        mode: 'cors',
        credentials: 'omit'
      }).catch(() => null)
      
      if (response && response.ok) {
        const blob = await response.blob()
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
        return
      }
    } catch (error) {
      console.error('Fetch download failed:', error)
    }
    
    // 方法2: 尝试使用 download 属性（即使跨域，某些浏览器也可能支持）
    try {
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
      // 如果 download 属性不工作，浏览器会打开新标签页，这是可接受的回退方案
      return
    } catch (error) {
      console.error('Link download failed:', error)
    }
    
    // 方法3: 最后回退到新标签页打开
    window.open(imageUrl, '_blank', 'noopener,noreferrer')
  }

  // Placeholder sample images (can replace with real URLs)
  const sampleImages = [
    { caption: 'Sample output 1', color: 'bg-slate-200' },
    { caption: 'Sample output 2', color: 'bg-slate-300' },
  ]

  return (
    <section className="flex-1 flex flex-col min-h-0 overflow-hidden p-6">
      <div className="flex-1 flex min-h-0 gap-6 min-w-0">
        {/* Left: 生图参数区 — 上方可滚动，底部 Generate 固定在第一屏 */}
        <div className="w-full md:w-[380px] flex-shrink-0 flex flex-col rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5">
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
              <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] transition-colors">
                <option>Nano Banana</option>
              </select>
            </div>

            {/* Image Upload (Image to Image) */}
            {activeTab === 'image-to-image' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  className="border-2 border-dashed border-[#C7D2FE] rounded-xl p-8 bg-[#EEF2FF]/60 text-center cursor-pointer hover:border-[#4F46E5]/50 hover:bg-[#E0E7FF]/50 transition-all duration-200"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) handleFiles(e.target.files)
                      e.target.value = ''
                    }}
                  />
                  {!imagePreview ? (
                    <>
                      <div className="flex justify-center mb-3 text-[#4F46E5]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15V19C21 19.53 20.79 20.04 20.41 20.41C20.04 20.79 19.53 21 19 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 10L12 5L17 10M12 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium text-sm">Click or drop an image here</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, JPEG, PNG or WEBP up to 10 MB</p>
                    </>
                  ) : (
                    <img src={imagePreview} alt="Upload" className="max-h-32 mx-auto rounded-xl object-contain shadow-inner ring-1 ring-black/5" />
                  )}
                </div>
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
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] transition-colors"
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar.value} value={ar.value}>
                    {ar.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] transition-colors"
              >
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 tracking-wide mb-2">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:border-[#4F46E5] transition-colors"
              >
                <option value="Auto">Auto</option>
                <option value="PNG">PNG</option>
                <option value="JPG">JPG</option>
              </select>
            </div>
          </div>

          {/* Generate 固定底部，始终在第一屏 */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-[#E0E7FF] bg-white">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && !imageFile)}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                style={{
                  background: isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && !imageFile)
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
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-[#E0E7FF] shadow-lg shadow-[#4F46E5]/8 flex items-center justify-center p-8">
            <img 
              src={currentResult.outputPreview} 
              alt="Generated" 
              onClick={() => setPreviewImage(currentResult.outputPreview)}
              className="max-w-full max-h-full object-contain rounded-xl cursor-pointer hover:opacity-90 transition-opacity" 
            />
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
                <div className="relative w-full max-w-2xl flex justify-center items-center gap-10">
                  <button
                    type="button"
                    onClick={() => setSampleIndex((i) => (i <= 0 ? sampleImages.length - 1 : i - 1))}
                    className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center hover:bg-[#C7D2FE] transition-colors flex-shrink-0 shadow-sm"
                    aria-label="Previous"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <div className={`w-52 h-52 rounded-2xl ${sampleImages[sampleIndex % sampleImages.length].color} flex items-center justify-center text-slate-500 text-sm ring-1 ring-slate-200/50 shadow-inner`}>
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
                      onClick={() => {
                        navigator.clipboard.writeText(currentResult.prompt)
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors"
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
                    <img src={currentResult.inputPreview} alt="Input" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C7D2FE]" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Input image</p>
                    </div>
                  </div>
                )}

                {/* Metadata Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{aspectRatio}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Nano Banana</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{currentResult.time}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && !imageFile)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm text-center disabled:cursor-not-allowed transition-all duration-200 text-white shadow-md hover:shadow-lg disabled:shadow-none"
                    style={{
                      background: isGenerating || !prompt.trim() || (activeTab === 'image-to-image' && !imageFile)
                        ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                        : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                    }}
                  >
                    Recreate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(currentResult.outputPreview, `generated-${currentResult.id}.png`)}
                    className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                    title="Download"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
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
                          onClick={() => {
                            navigator.clipboard.writeText(item.prompt)
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white transition-colors"
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
                        <img src={item.inputPreview} alt="Input" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C7D2FE]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-xs text-[#4F46E5]">Text</div>
                      )}
                      <div className="flex flex-wrap gap-2 flex-1">
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">{item.aspectRatio || 'Auto'}</span>
                        <span className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold">Nano Banana</span>
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
                            // 注意：这里无法直接恢复 imageFile，因为它是 File 对象
                            // 但可以显示预览
                            setImagePreview(item.inputPreview)
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
                        className="px-4 py-3 rounded-xl border border-[#C7D2FE] text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                        title="Download"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
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
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-lg transition-colors"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
