'use client'

import { useState, useRef, useCallback } from 'react'
import { compressToWebP, formatFileSize } from '@/lib/image-compress'

export default function R2UploadDemo() {
  const [uploading, setUploading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      setError(null)
      setUploadedUrl(null)
      setOriginalSize(file.size)
      setCompressedSize(null)

      // 步骤 1: 压缩并转换为 WebP
      setCompressing(true)
      let processedFile: File | Blob
      
      try {
        const compressedBlob = await compressToWebP(file, 100) // 压缩到 100KB
        setCompressedSize(compressedBlob.size)
        processedFile = compressedBlob
      } catch (compressError) {
        throw new Error(`图片压缩失败: ${compressError instanceof Error ? compressError.message : '未知错误'}`)
      } finally {
        setCompressing(false)
      }

      // 步骤 2: 上传到 R2
      const formData = new FormData()
      // 创建 File 对象以便服务器识别文件类型
      const webpFile = new File([processedFile], file.name.replace(/\.[^.]+$/, '.webp'), {
        type: 'image/webp',
        lastModified: Date.now(),
      })
      formData.append('image', webpFile)

      // 使用 API 接口上传（优先使用环境变量配置的 URL，否则使用本地 API 路由）
      const uploadUrl = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL || '/api/upload'
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `上传失败: ${response.status}`)
      }

      const data = await response.json()
      return data.url || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传失败，请重试'
      setError(errorMessage)
      return null
    } finally {
      setUploading(false)
      setCompressing(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件（JPG、PNG、WebP 等）')
      return
    }

    // 验证文件大小（30MB）
    const MAX_SIZE = 30 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      setError('图片大小不能超过 30MB')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      setUploadedUrl(url)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          handleFileSelect(file)
          break
        }
      }
    }
  }, [])

  const copyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl)
      alert('URL 已复制到剪贴板！')
    }
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6"
      onPaste={handlePaste}
      tabIndex={0}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-[40px] font-extrabold text-slate-900 mb-2">
            R2 图片上传 Demo
          </h1>
          <p className="text-slate-600 mb-2">
            支持点击选择、拖拽上传、粘贴图片三种方式
          </p>
          <div className="mb-8 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-700">
              <span className="font-semibold">✨ 自动优化：</span>
              所有图片会自动转换为 <span className="font-mono font-semibold">WebP</span> 格式并压缩到 <span className="font-semibold">100KB</span> 以内，确保快速加载
            </p>
          </div>

          {/* 上传区域 */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  {compressing ? '压缩中...' : uploading ? '上传中...' : '点击选择图片或拖拽到此处'}
                </p>
                <p className="text-sm text-slate-500">
                  支持 JPG、PNG、WebP 格式，自动转换为 WebP 并压缩到 100KB 以内
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  提示：也可以直接粘贴图片（Ctrl+V / Cmd+V）
                </p>
              </div>
            </div>

            {(compressing || uploading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-sm text-slate-600">
                    {compressing ? '正在压缩图片...' : '正在上传...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 上传成功 - 显示 URL */}
          {uploadedUrl && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-semibold mb-2">✅ 上传成功！</p>
                {/* 文件大小信息 */}
                {originalSize !== null && compressedSize !== null && (
                  <div className="mb-3 text-xs text-green-600">
                    <span className="font-medium">原始大小：</span>
                    {formatFileSize(originalSize)}
                    {' → '}
                    <span className="font-medium">压缩后：</span>
                    {formatFileSize(compressedSize)}
                    {compressedSize < originalSize && (
                      <span className="ml-2 text-green-700">
                        (节省 {((1 - compressedSize / originalSize) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={uploadedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={copyUrl}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    复制 URL
                  </button>
                </div>
              </div>

              {/* 预览图片 */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <p className="text-sm font-semibold text-slate-700 mb-3">图片预览：</p>
                <div className="flex justify-center">
                  <img
                    src={uploadedUrl}
                    alt="上传的图片"
                    className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
                    onError={() => setError('图片加载失败，请检查 URL')}
                  />
                </div>
              </div>

              {/* 使用说明 */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm font-semibold mb-2">💡 如何使用这个 URL：</p>
                <p className="text-blue-600 text-xs mb-2">
                  在 <code className="bg-blue-100 px-1 rounded">NanoBananaTool.tsx</code> 的 <code className="bg-blue-100 px-1 rounded">sampleImages</code> 数组中添加：
                </p>
                <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
{`{ 
  url: '${uploadedUrl}', 
  caption: 'Sample output 1' 
}`}
                </pre>
              </div>
            </div>
          )}

          {/* 使用说明 */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">使用说明</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">1.</span>
                <span>
                  <strong>点击上传</strong>：点击上方区域打开文件选择器
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">2.</span>
                <span>
                  <strong>拖拽上传</strong>：直接将图片文件拖拽到上传区域
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">3.</span>
                <span>
                  <strong>粘贴上传</strong>：复制图片后，在页面上按 Ctrl+V（Mac: Cmd+V）粘贴
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600">4.</span>
                <span>
                  上传成功后，复制 R2 URL 并在代码中使用
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
