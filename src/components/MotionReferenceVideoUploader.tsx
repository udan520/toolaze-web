'use client'

import { useRef } from 'react'
import DeleteIcon from '@/components/icons/DeleteIcon'

export type MotionReferenceVideoUploaderItem = {
  source: 'remote' | 'local'
  index: number
  src: string
  label: string
}

interface MotionReferenceVideoUploaderProps {
  selectedVideo: MotionReferenceVideoUploaderItem | null
  accept: string
  title: string
  helperText: string
  previewLabel: string
  replaceLabel: string
  deleteLabel: string
  onUpload: (files: FileList | null) => void
  onReplace: (item: MotionReferenceVideoUploaderItem, files: FileList | null) => void
  onPreview: (item: MotionReferenceVideoUploaderItem) => void
  onDelete: () => void
}

export default function MotionReferenceVideoUploader({
  selectedVideo,
  accept,
  title,
  helperText,
  previewLabel,
  replaceLabel,
  deleteLabel,
  onUpload,
  onReplace,
  onPreview,
  onDelete,
}: MotionReferenceVideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replacementItemRef = useRef<MotionReferenceVideoUploaderItem | null>(null)

  const openPicker = (replacementItem: MotionReferenceVideoUploaderItem | null = null) => {
    replacementItemRef.current = replacementItem
    fileInputRef.current?.click()
  }

  return (
    <div data-motion-reference-video-uploader className="rounded-2xl border border-[#E0E7FF] bg-[#F8FAFF] p-3">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={(event) => {
          const replacementItem = replacementItemRef.current
          replacementItemRef.current = null
          if (replacementItem) {
            onReplace(replacementItem, event.target.files)
          } else {
            onUpload(event.target.files)
          }
          event.currentTarget.value = ''
        }}
      />
      <div className="mb-2 flex items-center justify-between gap-3">
        <p data-motion-video-heading className="text-xs font-bold text-slate-700">{title}</p>
      </div>
      {selectedVideo ? (
        <div
          data-motion-video-large-dropzone
          data-motion-video-selected-card
          className="group relative min-h-[164px] overflow-hidden rounded-2xl border border-indigo-100 bg-slate-950 shadow-sm"
        >
          <video src={selectedVideo.src} className="absolute inset-0 h-full w-full object-cover" muted playsInline preload="metadata" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/35" />
          <button
            type="button"
            data-motion-video-delete
            onClick={onDelete}
            className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-red-600"
            aria-label={deleteLabel}
          >
            <DeleteIcon className="h-3.5 w-3.5" />
          </button>
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-slate-950/0 opacity-0 transition duration-150 group-hover:bg-slate-950/35 group-hover:opacity-100 group-focus-within:bg-slate-950/35 group-focus-within:opacity-100">
            <button
              type="button"
              data-motion-video-preview-button
              onClick={() => onPreview(selectedVideo)}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-900 opacity-0 shadow-sm transition hover:bg-indigo-50 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {previewLabel}
            </button>
            <button
              type="button"
              data-motion-video-replace
              onClick={() => openPicker(selectedVideo)}
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white opacity-0 ring-1 ring-white/30 transition hover:bg-white/25 group-hover:opacity-100 group-focus-within:opacity-100"
            >
              {replaceLabel}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          data-motion-video-large-dropzone
          data-motion-video-empty-requirements
          onClick={() => openPicker(null)}
          className="flex min-h-[164px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-white px-5 py-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 15V3" />
              <path d="m7 8 5-5 5 5" />
              <path d="M20 16.5v2.25A2.25 2.25 0 0 1 17.75 21H6.25A2.25 2.25 0 0 1 4 18.75V16.5" />
            </svg>
          </span>
          <span className="mt-3 max-w-[17rem] text-[11px] leading-4 text-slate-500">{helperText}</span>
        </button>
      )}
    </div>
  )
}
