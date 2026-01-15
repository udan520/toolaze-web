'use client'

import { useState, useRef, useEffect } from 'react'
import JSZip from 'jszip'

interface FileItem {
  id: string
  file: File
  origSize: string
  blob: Blob | null
  url: string | null
  rawUrl: string
  thumbReady: boolean
}

interface ImageCompressorProps {
  initialTarget?: string | number
}

export default function ImageCompressor({ initialTarget }: ImageCompressorProps) {
  // Parse target from slug
  const parseTargetFromSlug = (slug: string | number | undefined): { size: number; unit: 'KB' | 'MB' } => {
    if (typeof slug === 'number') {
      return { size: slug, unit: 'KB' }
    }
    if (!slug || typeof slug !== 'string') {
      return { size: 200, unit: 'KB' }
    }
    
    const kbMatch = slug.match(/(\d+)kb/i)
    if (kbMatch) {
      return { size: parseInt(kbMatch[1], 10), unit: 'KB' }
    }
    
    const mbMatch = slug.match(/(\d+)mb/i)
    if (mbMatch) {
      return { size: parseInt(mbMatch[1], 10), unit: 'MB' }
    }
    
    return { size: 200, unit: 'KB' }
  }

  const parsedTarget = parseTargetFromSlug(initialTarget)
  const [queue, setQueue] = useState<FileItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [targetSize, setTargetSize] = useState(parsedTarget.size)
  const [unit, setUnit] = useState<'KB' | 'MB'>(parsedTarget.unit)
  const [toasts, setToasts] = useState<Array<{ id: string; msg: string; type: string }>>([])
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [fileStates, setFileStates] = useState<Record<string, { status: string; newSize?: string; thumbUrl?: string }>>({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const startBtnRef = useRef<HTMLButtonElement>(null)
  const downloadAllBtnRef = useRef<HTMLButtonElement>(null)
  const MAX_FILES = 100

  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    const cleanMsg = msg.replace(/✅|❌|⚠️|❗/g, '').trim()
    
    setToasts(prev => [...prev, { id, msg: cleanMsg, type }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const formatFileSize = (bytes: number): string => {
    const kb = bytes / 1024
    if (kb >= 1024) {
      return (kb / 1024).toFixed(1) + ' M'
    }
    return kb.toFixed(1) + ' KB'
  }

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  }

  const forceDownload = async (url: string, filename: string) => {
    const item = queue.find(i => i.url === url || i.rawUrl === url)
    
    if (isIOS() && navigator.share && item?.blob) {
      // 使用 iOS 原生 Web Share API
      try {
        const file = new File([item.blob], filename, { type: item.blob.type || 'image/jpeg' })
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename,
            text: `Image: ${filename}`,
          })
          showToast('Shared successfully', 'success')
          return
        }
      } catch (error: any) {
        // 如果用户取消分享，不显示错误
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error)
          // 如果分享失败，回退到普通下载
        } else {
          return // 用户取消，直接返回
        }
      }
    }
    
    // 非 iOS 或分享失败时，使用普通下载
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const compressImage = (rawUrl: string, maxSize: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }
          let w = img.width, h = img.height, q = 0.92, res: Blob | null = null

          for (let i = 0; i < 7; i++) {
            canvas.width = w
            canvas.height = h
            ctx.drawImage(img, 0, 0, w, h)
            res = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', q))
            if (res && res.size <= maxSize) break
            q -= 0.15
            if (q < 0.3) {
              w *= 0.8
              h *= 0.8
            }
          }
          if (res) {
            resolve(res)
          } else {
            reject(new Error('Compression failed'))
          }
        } catch (e) {
          reject(e)
        }
      }
      img.src = rawUrl
    })
  }

  const createThumb = async (item: FileItem) => {
    try {
      const img = new Image()
      img.src = item.rawUrl
      await img.decode()
      const canvas = document.createElement('canvas')
      const size = 300
      canvas.width = size
      canvas.height = size * (img.height / img.width)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const thumbUrl = canvas.toDataURL('image/jpeg', 0.7)
        setFileStates(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], thumbUrl }
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const processThumbnails = async (items: FileItem[]) => {
    const pending = items.filter(item => !item.thumbReady)
    for (let i = 0; i < pending.length; i += 3) {
      const chunk = pending.slice(i, i + 3)
      await Promise.all(chunk.map(item => createThumb(item)))
      await new Promise(r => setTimeout(r, 30))
    }
    setQueue(prev => prev.map(item => ({ ...item, thumbReady: true })))
  }

  const traverse = async (entry: any, list: File[]): Promise<void> => {
    try {
      if (entry.isFile) {
        const file = await new Promise<File>((resolve, reject) => {
          try {
            entry.file(resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        list.push(file)
      } else if (entry.isDirectory) {
        const reader = entry.createReader()
        const entries = await new Promise<any[]>((resolve, reject) => {
          try {
            reader.readEntries(resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        for (const e of entries) {
          await traverse(e, list)
        }
      }
    } catch (error) {
      console.warn('Error traversing file entry:', error)
    }
  }

  const handleFiles = async (files: File[]) => {
    const supported = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']
    const newItems: FileItem[] = []
    
    for (const file of files) {
      if (queue.length + newItems.length >= MAX_FILES) break
      if (!supported.includes(file.type)) {
        showToast(`Unsupported format: ${file.name}`, 'error')
        continue
      }

      const id = 'id' + Math.random().toString(36).substr(2, 9)
      const item: FileItem = {
        id,
        file,
        origSize: formatFileSize(file.size),
        blob: null,
        url: null,
        rawUrl: URL.createObjectURL(file),
        thumbReady: false
      }
      newItems.unshift(item)
      setFileStates(prev => ({
        ...prev,
        [id]: { status: 'Waiting' }
      }))
    }

    setQueue(prev => [...newItems, ...prev])
    processThumbnails(newItems)

    // Scroll to start button
    setTimeout(() => {
      if (startBtnRef.current) {
        const nav = document.getElementById('mainNav')
        const navHeight = nav ? nav.offsetHeight : 0
        const targetPosition = startBtnRef.current.getBoundingClientRect().top + window.pageYOffset - navHeight - 20
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  const handleStart = async () => {
    if (queue.length === 0 || isProcessing) return
    setIsProcessing(true)
    const target = targetSize * (unit === 'MB' ? 1024 * 1024 : 1024)
    
    if (downloadAllBtnRef.current) {
      downloadAllBtnRef.current.classList.remove('show')
      downloadAllBtnRef.current.style.display = 'none'
    }
    
    for (const item of queue) {
      if (item.url) {
        URL.revokeObjectURL(item.url)
      }
      
      setFileStates(prev => ({
        ...prev,
        [item.id]: { ...prev[item.id], status: 'Running' }
      }))

      try {
        const timeoutPromise = new Promise<Blob>((_, reject) => 
          setTimeout(() => reject(new Error('Compression timeout after 60 seconds')), 60000)
        )
        
        const blob = await Promise.race([
          compressImage(item.rawUrl, target),
          timeoutPromise
        ])
        
        const url = URL.createObjectURL(blob)
        const newSize = formatFileSize(blob.size)
        
        setQueue(prev => prev.map(i => 
          i.id === item.id ? { ...i, blob, url } : i
        ))
        
        setFileStates(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], status: 'Done', newSize, thumbUrl: url }
        }))
      } catch (error) {
        setFileStates(prev => ({
          ...prev,
          [item.id]: { ...prev[item.id], status: 'Error' }
        }))
        
        const errorMsg = (error as Error).message?.includes('timeout') 
          ? `Compression timeout: ${item.file.name}` 
          : `Failed to compress: ${item.file.name}`
        showToast(errorMsg, 'error')
      }
    }

    setIsProcessing(false)
    const hasCompressed = queue.some(item => item.blob !== null)
    if (hasCompressed) {
      showToast('Processing completed!', 'success')
      if (downloadAllBtnRef.current) {
        downloadAllBtnRef.current.classList.add('show')
        downloadAllBtnRef.current.style.display = 'inline-flex'
      }
    }
  }

  const retryCompress = async (itemId: string) => {
    const item = queue.find(i => i.id === itemId)
    if (!item) return
    
    const target = targetSize * (unit === 'MB' ? 1024 * 1024 : 1024)
    
    setFileStates(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], status: 'Running' }
    }))

    try {
      const timeoutPromise = new Promise<Blob>((_, reject) => 
        setTimeout(() => reject(new Error('Compression timeout after 60 seconds')), 60000)
      )
      
      const blob = await Promise.race([
        compressImage(item.rawUrl, target),
        timeoutPromise
      ])
      
      if (item.url) {
        URL.revokeObjectURL(item.url)
      }
      
      const url = URL.createObjectURL(blob)
      const newSize = formatFileSize(blob.size)
      
      setQueue(prev => prev.map(i => 
        i.id === itemId ? { ...i, blob, url } : i
      ))
      
      setFileStates(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], status: 'Done', newSize, thumbUrl: url }
      }))
      
      showToast(`Retry successful: ${item.file.name}`, 'success')
      
      const hasCompressed = queue.some(i => i.blob !== null)
      if (downloadAllBtnRef.current && hasCompressed) {
        downloadAllBtnRef.current.classList.add('show')
        downloadAllBtnRef.current.style.display = 'inline-flex'
      }
    } catch (error) {
      setFileStates(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], status: 'Error' }
      }))
      
      const errorMsg = (error as Error).message?.includes('timeout') 
        ? `Retry timeout: ${item.file.name}` 
        : `Retry failed: ${item.file.name}`
      showToast(errorMsg, 'error')
    }
  }

  const deleteImage = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const item = queue.find(i => i.id === id)
    if (!item) return
    
    URL.revokeObjectURL(item.rawUrl)
    if (item.url) {
      URL.revokeObjectURL(item.url)
    }
    
    setQueue(prev => prev.filter(i => i.id !== id))
    setFileStates(prev => {
      const newStates = { ...prev }
      delete newStates[id]
      return newStates
    })
    
    const hasCompressed = queue.some(i => i.id !== id && i.blob !== null)
    if (downloadAllBtnRef.current) {
      if (hasCompressed) {
        downloadAllBtnRef.current.classList.add('show')
        downloadAllBtnRef.current.style.display = 'inline-flex'
      } else {
        downloadAllBtnRef.current.classList.remove('show')
        downloadAllBtnRef.current.style.display = 'none'
      }
    }
    
    showToast('Image removed', 'info')
  }

  const handleClear = () => {
    queue.forEach(item => {
      URL.revokeObjectURL(item.rawUrl)
      if (item.url) URL.revokeObjectURL(item.url)
    })
    setQueue([])
    setIsProcessing(false)
    setFileStates({})
    if (downloadAllBtnRef.current) {
      downloadAllBtnRef.current.classList.remove('show')
      downloadAllBtnRef.current.style.display = 'none'
    }
    showToast('List cleared', 'info')
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    queue.forEach(item => {
      if (item.blob) {
        zip.file(`min_${item.file.name.split('.')[0]}.jpg`, item.blob)
      }
    })
    const content = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(content)
    a.download = 'compressed_images.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const zoomImg = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setModalImage(url)
  }

  const closeModal = () => {
    setModalImage(null)
  }

  useEffect(() => {
    // Check for files from homepage
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return
      
      const pendingFiles = sessionStorage.getItem('toolaze_pending_files')
      const fromHomepage = sessionStorage.getItem('toolaze_from_homepage')
      
      if (pendingFiles && fromHomepage === 'true') {
        try {
          const fileDataArray = JSON.parse(pendingFiles)
          const files = fileDataArray.map((fileData: any) => {
            const byteString = atob(fileData.data.split(',')[1])
            const mimeString = fileData.data.split(',')[0].split(':')[1].split(';')[0]
            const ab = new ArrayBuffer(byteString.length)
            const ia = new Uint8Array(ab)
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i)
            }
            const blob = new Blob([ab], { type: mimeString })
            return new File([blob], fileData.name, { type: fileData.type })
          })
          
          sessionStorage.removeItem('toolaze_pending_files')
          sessionStorage.removeItem('toolaze_from_homepage')
          
          setTimeout(() => {
            handleFiles(files)
            showToast(`Loaded ${files.length} file(s) from homepage`, 'success')
          }, 100)
        } catch (e) {
          console.error('Error loading files from homepage:', e)
          try {
            sessionStorage.removeItem('toolaze_pending_files')
            sessionStorage.removeItem('toolaze_from_homepage')
          } catch (storageError) {
            // Ignore storage errors
          }
        }
      }
    } catch (error) {
      console.warn('SessionStorage access blocked:', error)
    }

    // Drag and drop handlers
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (dropZone) {
        dropZone.style.borderColor = '#4f46e5'
      }
    }

    const handleDragLeave = () => {
      if (dropZone) {
        dropZone.style.borderColor = '#cbd5e1'
      }
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      if (dropZone) {
        dropZone.style.borderColor = '#cbd5e1'
      }
      
      if (!e.dataTransfer) return
      
      const items = Array.from(e.dataTransfer.items)
      const files: File[] = []
      
      for (const item of items) {
        const entry = (item as any).webkitGetAsEntry?.()
        if (entry) {
          await traverse(entry, files)
        } else if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) files.push(file)
        }
      }
      
      if (files.length > 0) {
        handleFiles(files)
      }
    }

    dropZone.addEventListener('dragover', handleDragOver)
    dropZone.addEventListener('dragleave', handleDragLeave)
    dropZone.addEventListener('drop', handleDrop)

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver)
      dropZone.removeEventListener('dragleave', handleDragLeave)
      dropZone.removeEventListener('drop', handleDrop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasCompressed = queue.some(item => item.blob !== null)
  const showControls = queue.length > 0
  const showGallery = queue.length > 0

  return (
    <>
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

      {/* Image Modal */}
      {modalImage && (
        <div 
          id="modal"
          className={modalImage ? 'show' : ''}
          onClick={closeModal}
          style={{ display: modalImage ? 'flex' : 'none' }}
        >
          <img src={modalImage} alt="Preview" onClick={(e) => e.stopPropagation()} />
        </div>
      )}


      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-super p-6 shadow-soft border border-indigo-50">
          <div
            id="dropZone"
            ref={dropZoneRef}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-100 rounded-[2.2rem] p-10 bg-indigo-50/20 text-center relative overflow-hidden group hover:border-indigo-300 transition-all"
          >
            <div className="mb-6 group-hover:scale-110 transition-transform flex justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-400">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Click or Drag Images/Folders Here</h3>
            <p className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">JPG, PNG, WebP, BMP (Max 100 files)</p>
            <input 
              type="file" 
              id="fileInput"
              ref={fileInputRef}
              multiple 
              accept="image/*" 
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files) {
                  handleFiles(Array.from(e.target.files))
                  e.target.value = ''
                }
              }}
            />
          </div>

          {showControls && (
            <div className="controls mt-6" id="controlsSection">
              <span className="font-semibold text-slate-700">Target Size:</span>
              <input 
                type="number" 
                id="targetSize"
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value))}
                style={{ width: '70px', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
              <select 
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'KB' | 'MB')}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="KB">KB</option>
                <option value="MB">MB</option>
              </select>
              <div style={{ width: '20px' }}></div>
              <button 
                id="startBtn"
                ref={startBtnRef}
                className="btn-blue" 
                onClick={handleStart}
                disabled={isProcessing}
                style={{ padding: '12px 24px !important' }}
              >
                <span id="btnText">{isProcessing ? 'Processing...' : 'Start Batch Compression'}</span>
              </button>
              <button 
                id="downloadAllBtn"
                ref={downloadAllBtnRef}
                className="btn-green" 
                onClick={handleDownloadAll}
                style={{ padding: '12px 24px !important', display: hasCompressed ? 'inline-flex' : 'none' }}
              >
                Download All (ZIP)
              </button>
              <div style={{ flexGrow: 1 }}></div>
              <button 
                id="clearBtn"
                className="btn-outline" 
                onClick={handleClear}
                style={{ padding: '12px 24px !important' }}
              >
                Clear List
              </button>
            </div>
          )}

          {showGallery && (
            <>
              <div className="gallery-header mt-8" id="galleryHeader">
                <b className="text-lg font-bold text-slate-800">Gallery Preview</b>
                <span className="counter-pill" id="counter">Added: {queue.length} / 100</span>
              </div>

              <div className="file-list mt-4" id="fileList">
                {queue.map((item) => {
                  const state = fileStates[item.id] || { status: 'Waiting' }
                  const statusClass = state.status === 'Running' ? 'status-processing' : 
                                    state.status === 'Done' ? 'status-done' : 
                                    state.status === 'Error' ? 'status-error' : ''
                  
                  return (
                    <div key={item.id} className="file-item" id={item.id}>
                      <div className={`status-badge ${statusClass}`} id={`tag-${item.id}`}>
                        {state.status}
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={(e) => deleteImage(item.id, e)} 
                        title="Delete"
                      >
                        ×
                      </button>
                      <div className="img-wrapper">
                        {!item.thumbReady && !state.thumbUrl && (
                          <div className="skeleton" id={`skel-${item.id}`}></div>
                        )}
                        {(state.thumbUrl || item.url || item.rawUrl) && (
                          <img 
                            id={`img-${item.id}`}
                            src={state.thumbUrl || item.url || item.rawUrl}
                            alt={item.file.name}
                            style={{ display: 'block' }}
                            onClick={(e) => zoomImg(item.url || item.rawUrl, e)}
                          />
                        )}
                      </div>
                      <div className="item-info">
                        <div className="filename">{item.file.name}</div>
                        <div className="size-tag">
                          <span>Original: {item.origSize}</span>
                          <span id={`newsize-${item.id}`}>
                            {state.newSize && <span className="size-reduced">New: {state.newSize}</span>}
                          </span>
                        </div>
                      </div>
                      <div id={`dl-container-${item.id}`}>
                        {state.status === 'Error' && (
                          <button 
                            className="single-dl retry-btn"
                            onClick={() => retryCompress(item.id)}
                          >
                            Retry
                          </button>
                        )}
                        {state.status === 'Done' && item.url && (
                          <button 
                            className="single-dl"
                            onClick={() => forceDownload(item.url!, `min_${item.file.name}`)}
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-indigo-900/60 uppercase tracking-widest">
          <span>🔒 100% Private</span> <span className="hidden md:block">|</span>
          <span>⚡ Local Browser API</span> <span className="hidden md:block">|</span>
          <span>🚫 No Server Logs</span>
        </div>
      </div>
    </>
  )
}
