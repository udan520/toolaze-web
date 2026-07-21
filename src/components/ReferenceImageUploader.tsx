'use client'

import { useRef } from 'react'
import DeleteIcon from '@/components/icons/DeleteIcon'
import ImageReplaceButton from '@/components/ImageReplaceButton'

export type ReferenceImagePreviewStatus = 'loading' | 'retrying' | 'loaded' | 'failed'

export interface ReferenceImageUploaderItem {
  id: string
  src: string
  alt: string
  status?: ReferenceImagePreviewStatus
  onLoad?: () => void
  onError?: () => void
  onPreview?: () => void
  onRemove: () => void
  onReplace?: (file: File) => void
}

interface ReferenceImageUploaderProps {
  items: ReferenceImageUploaderItem[]
  maxImages: number
  maxFileSizeMb: number
  onFiles: (files: File[]) => void
  onInvalidType?: (file: File) => void
  onValidationError?: (file: File) => void
  label: string
  helperText: string
  uploadLabel: string
  replaceLabel: string
  deleteLabel: string
  loadingLabel?: string
  failedLabel?: string
  size?: 'compact' | 'large'
  testIdPrefix?: string
}

const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/jpg,image/png,image/webp'

export default function ReferenceImageUploader({
  items,
  maxImages,
  maxFileSizeMb,
  onFiles,
  onInvalidType,
  onValidationError,
  label,
  helperText,
  uploadLabel,
  replaceLabel,
  deleteLabel,
  loadingLabel = 'Loading',
  failedLabel = 'Image Failed',
  size = 'compact',
  testIdPrefix = 'reference-image',
}: ReferenceImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replacementIndexRef = useRef<number | null>(null)
  const maxBytes = maxFileSizeMb * 1024 * 1024

  const validateFiles = (files: File[]) => files.filter((file) => {
    if (!file.type.startsWith('image/')) {
      onInvalidType?.(file)
      return false
    }
    if (file.size <= maxBytes) return true
    onValidationError?.(file)
    return false
  })

  const submitFiles = (files: FileList | File[]) => {
    const validFiles = validateFiles(Array.from(files)).slice(0, Math.max(0, maxImages - items.length))
    if (validFiles.length > 0) onFiles(validFiles)
  }

  const openReplacementPicker = (index: number) => {
    replacementIndexRef.current = index
    fileInputRef.current?.click()
  }

  const handleInputChange = (files: FileList | null) => {
    if (!files?.length) return
    const replacementIndex = replacementIndexRef.current
    if (replacementIndex !== null) {
      const [file] = validateFiles([files[0]])
      if (file) items[replacementIndex]?.onReplace?.(file)
      replacementIndexRef.current = null
      return
    }
    submitFiles(files)
  }

  const singleSizeClass = size === 'large' ? 'w-full max-w-60' : 'max-w-28'

  return (
    <div data-reference-image-uploader={testIdPrefix}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-xs font-semibold tracking-wide text-slate-500">{label}</label>
        {items.length > 0 ? <span className="text-xs font-medium text-slate-400">{items.length}/{maxImages}</span> : null}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        multiple={maxImages > 1}
        className="hidden"
        onChange={(event) => {
          handleInputChange(event.target.files)
          event.target.value = ''
        }}
      />
      <div className={`grid gap-2 ${maxImages === 1 ? `grid-cols-1 ${singleSizeClass}` : 'grid-cols-3'}`}>
        {items.length < maxImages ? (
          <button
            type="button"
            data-reference-upload-tile
            onClick={() => {
              replacementIndexRef.current = null
              fileInputRef.current?.click()
            }}
            onDrop={(event) => {
              event.preventDefault()
              submitFiles(event.dataTransfer.files)
            }}
            onDragOver={(event) => event.preventDefault()}
            className="aspect-square rounded-lg border-2 border-dashed border-[#C7D2FE] bg-[#EEF2FF]/50 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#4F46E5]/50 hover:bg-[#E0E7FF]/50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-xs font-medium text-slate-500">{uploadLabel}</span>
          </button>
        ) : null}
        {items.map((item, index) => {
          const isLoading = item.status === 'loading' || item.status === 'retrying'
          return (
            <div key={item.id} className="relative group aspect-square overflow-hidden rounded-lg border border-[#E0E7FF] bg-slate-100 cursor-pointer" onClick={item.onPreview}>
              {item.status !== 'failed' ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`h-full w-full object-cover transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={item.onLoad}
                  onError={item.onError}
                />
              ) : null}
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 text-xs font-semibold text-slate-500">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#C7D2FE] border-t-[#4F46E5]" />
                  <span>{loadingLabel}</span>
                </div>
              ) : null}
              {item.status === 'failed' ? <div className="absolute inset-0 flex items-center justify-center bg-slate-100 px-3 text-center text-xs font-semibold text-slate-500">{failedLabel}</div> : null}
              {item.onReplace ? <ImageReplaceButton onReplace={() => openReplacementPicker(index)} label={replaceLabel} /> : null}
              <span className="absolute bottom-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-md bg-white/80 text-xs font-bold text-black shadow-sm">{index + 1}</span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  item.onRemove()
                }}
                className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-white/80 text-black shadow-sm [&_svg]:flex-shrink-0 md:invisible md:opacity-0 md:transition-opacity md:group-hover:visible md:group-hover:opacity-100"
                title={deleteLabel}
                aria-label={deleteLabel}
              >
                <DeleteIcon size={16} />
              </button>
            </div>
          )
        })}
      </div>
      <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
    </div>
  )
}
